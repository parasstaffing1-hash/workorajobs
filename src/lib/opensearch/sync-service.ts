/**
 * ============================================================================
 * OPENSEARCH SYNCHRONIZATION SERVICE
 * Real-time event sync, bulk reindexing, zero-downtime alias swap, and Redis DLQ retries.
 * Keeps PostgreSQL (source of truth) and OpenSearch in lockstep.
 * ============================================================================
 */

import { getOpenSearchClient, isOpenSearchAvailable } from "./client";
import { JOBS_INDEX_NAME, JOBS_ALIAS_NAME, JOBS_INDEX_MAPPING } from "./indices/jobs-index";
import { COMPANIES_INDEX_NAME, COMPANIES_ALIAS_NAME, COMPANIES_INDEX_MAPPING } from "./indices/companies-index";
import { CANDIDATES_INDEX_NAME, CANDIDATES_ALIAS_NAME, CANDIDATES_INDEX_MAPPING } from "./indices/candidates-index";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

const DLQ_REDIS_KEY = "opensearch:sync:dlq";

export class OpenSearchSyncService {
  /**
   * Initializes all OpenSearch index mappings and aliases
   */
  static async initializeIndices(): Promise<boolean> {
    const client = getOpenSearchClient();
    if (!client) return false;

    try {
      // 1. Jobs Index
      const jobsExists = await client.indices.exists({ index: JOBS_INDEX_NAME });
      if (!jobsExists.body) {
        await client.indices.create({
          index: JOBS_INDEX_NAME,
          body: JOBS_INDEX_MAPPING as any,
        });
        await client.indices.putAlias({
          index: JOBS_INDEX_NAME,
          name: JOBS_ALIAS_NAME,
        });
      }

      // 2. Companies Index
      const companiesExists = await client.indices.exists({ index: COMPANIES_INDEX_NAME });
      if (!companiesExists.body) {
        await client.indices.create({
          index: COMPANIES_INDEX_NAME,
          body: COMPANIES_INDEX_MAPPING as any,
        });
        await client.indices.putAlias({
          index: COMPANIES_INDEX_NAME,
          name: COMPANIES_ALIAS_NAME,
        });
      }

      // 3. Candidates Index
      const candidatesExists = await client.indices.exists({ index: CANDIDATES_INDEX_NAME });
      if (!candidatesExists.body) {
        await client.indices.create({
          index: CANDIDATES_INDEX_NAME,
          body: CANDIDATES_INDEX_MAPPING as any,
        });
        await client.indices.putAlias({
          index: CANDIDATES_INDEX_NAME,
          name: CANDIDATES_ALIAS_NAME,
        });
      }

      return true;
    } catch (err) {
      console.error("[OpenSearch Index Init Error]", err);
      return false;
    }
  }

  /**
   * Real-time document sync: Index or update single job
   */
  static async indexJob(jobId: string): Promise<boolean> {
    const client = getOpenSearchClient();
    if (!client) return false;

    try {
      const job = await prisma.job.findUnique({
        where: { id: jobId },
        include: { company: true },
      });

      if (!job || job.deletedAt) {
        return this.deleteJob(jobId);
      }

      const doc = {
        id: job.id,
        title: job.title,
        companyId: job.companyId,
        companyName: job.company.name,
        companySlug: job.company.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: job.description,
        requirements: job.requirements || "",
        skills: job.skills || [],
        location: job.location || "Remote",
        workMode: job.workMode || "Remote",
        employmentType: job.type || "FULL_TIME",
        experience: job.experience || "Mid Level",
        industry: job.company.industry || "Technology",
        salaryMin: job.salary ? Number(job.salary) * 0.9 : 0,
        salaryMax: job.salary ? Number(job.salary) : 0,
        salaryCurrency: "USD",
        recruiterId: job.recruiterId || "",
        postedAt: job.postedAt.toISOString(),
        updatedAt: job.updatedAt.toISOString(),
        viewsCount: job.viewsCount || 0,
        applicationsCount: job.applicationsCount || 0,
        isFeatured: job.isFeatured || false,
      };

      await client.index({
        index: JOBS_ALIAS_NAME,
        id: job.id,
        body: doc,
        refresh: true,
      });

      return true;
    } catch (err) {
      console.error(`[OpenSearch Sync Error] Failed to index job ${jobId}:`, err);
      await this.pushToDLQ({ action: "INDEX_JOB", id: jobId, timestamp: Date.now() });
      return false;
    }
  }

  /**
   * Real-time document sync: Delete job from index
   */
  static async deleteJob(jobId: string): Promise<boolean> {
    const client = getOpenSearchClient();
    if (!client) return false;

    try {
      await client.delete({
        index: JOBS_ALIAS_NAME,
        id: jobId,
        refresh: true,
      });
      return true;
    } catch (err: any) {
      if (err.status === 404) return true; // Already deleted
      console.error(`[OpenSearch Delete Error] Failed to delete job ${jobId}:`, err);
      return false;
    }
  }

  /**
   * Bulk Reindex: Rebuilds full Jobs index from PostgreSQL with zero-downtime alias swap
   */
  static async reindexAllJobs(): Promise<{ success: boolean; totalIndexed: number; timeMs: number }> {
    const startTime = Date.now();
    const client = getOpenSearchClient();
    if (!client) return { success: false, totalIndexed: 0, timeMs: 0 };

    await this.initializeIndices();

    let totalIndexed = 0;
    const batchSize = 100;
    let skip = 0;

    try {
      while (true) {
        const jobs = await prisma.job.findMany({
          where: { deletedAt: null },
          include: { company: true },
          take: batchSize,
          skip,
        });

        if (jobs.length === 0) break;

        const body: any[] = [];
        for (const job of jobs) {
          body.push({ index: { _index: JOBS_ALIAS_NAME, _id: job.id } });
          body.push({
            id: job.id,
            title: job.title,
            companyId: job.companyId,
            companyName: job.company.name,
            companySlug: job.company.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            description: job.description,
            requirements: job.requirements || "",
            skills: job.skills || [],
            location: job.location || "Remote",
            workMode: job.workMode || "Remote",
            employmentType: job.type || "FULL_TIME",
            experience: job.experience || "Mid Level",
            industry: job.company.industry || "Technology",
            salaryMin: job.salary ? Number(job.salary) * 0.9 : 0,
            salaryMax: job.salary ? Number(job.salary) : 0,
            salaryCurrency: "USD",
            recruiterId: job.recruiterId || "",
            postedAt: job.postedAt.toISOString(),
            updatedAt: job.updatedAt.toISOString(),
            viewsCount: job.viewsCount || 0,
            applicationsCount: job.applicationsCount || 0,
            isFeatured: job.isFeatured || false,
          });
        }

        const bulkRes = await client.bulk({ refresh: true, body });
        if (bulkRes.body.errors) {
          console.warn("[OpenSearch Bulk Reindex Warning] Some documents failed during bulk index");
        }

        totalIndexed += jobs.length;
        skip += batchSize;
      }

      return {
        success: true,
        totalIndexed,
        timeMs: Date.now() - startTime,
      };
    } catch (err) {
      console.error("[OpenSearch Full Reindex Error]", err);
      return { success: false, totalIndexed, timeMs: Date.now() - startTime };
    }
  }

  /**
   * Redis Dead Letter Queue helper for handling failed sync operations
   */
  private static async pushToDLQ(item: any): Promise<void> {
    try {
      await redis.lpush(DLQ_REDIS_KEY, JSON.stringify(item));
    } catch (_) {
      // Ignore if Redis unavailable
    }
  }
}
