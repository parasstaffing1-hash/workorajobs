import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { TalentStore, TalentPool } from "./talent-store";
import { SearchIndexService } from "./search-index.service";

@Injectable()
export class TalentPoolService {
  private readonly logger = new Logger(TalentPoolService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly searchIndex: SearchIndexService,
  ) {}

  // Create pool
  async createPool(
    ownerId: string,
    data: {
      name: string;
      isPublic?: boolean;
      isDynamic?: boolean;
      autoRules?: {
        skills?: string[];
        experienceMin?: number;
        preferredLocation?: string;
        keywords?: string[];
      };
      candidateIds?: string[];
      sharedTeamIds?: string[];
    },
  ): Promise<TalentPool> {
    const id = `pool_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const pool: TalentPool = {
      id,
      name: data.name,
      isPublic: data.isPublic ?? false,
      isDynamic: data.isDynamic ?? false,
      autoRules: data.autoRules,
      candidateIds: data.candidateIds ?? [],
      ownerId,
      sharedTeamIds: data.sharedTeamIds ?? [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (pool.isDynamic) {
      // Dynamic pools should populate candidates initially matching the rules
      pool.candidateIds = await this.evaluateDynamicPoolCandidates(pool);
    }

    TalentStore.savePool(pool);
    return pool;
  }

  // Update pool
  async updatePool(
    id: string,
    data: {
      name?: string;
      isPublic?: boolean;
      autoRules?: {
        skills?: string[];
        experienceMin?: number;
        preferredLocation?: string;
        keywords?: string[];
      };
      candidateIds?: string[];
      sharedTeamIds?: string[];
    },
  ): Promise<TalentPool> {
    const pool = TalentStore.getPool(id);
    if (!pool) {
      throw new NotFoundException(`Talent Pool ${id} not found.`);
    }

    if (data.name !== undefined) pool.name = data.name;
    if (data.isPublic !== undefined) pool.isPublic = data.isPublic;
    if (data.autoRules !== undefined) pool.autoRules = data.autoRules;
    if (data.candidateIds !== undefined && !pool.isDynamic) pool.candidateIds = data.candidateIds;
    if (data.sharedTeamIds !== undefined) pool.sharedTeamIds = data.sharedTeamIds;

    pool.updatedAt = new Date().toISOString();

    if (pool.isDynamic) {
      pool.candidateIds = await this.evaluateDynamicPoolCandidates(pool);
    }

    TalentStore.savePool(pool);
    return pool;
  }

  // Delete pool
  deletePool(id: string) {
    const pool = TalentStore.getPool(id);
    if (!pool) {
      throw new NotFoundException(`Talent Pool ${id} not found.`);
    }
    TalentStore.deletePool(id);
  }

  // List pools scoped to the recruiter / public / shared teams
  async listPools(recruiterId: string): Promise<TalentPool[]> {
    const all = TalentStore.listPools();
    // Return pools owned by recruiter, or shared, or public
    const filtered = all.filter(p => p.ownerId === recruiterId || p.isPublic || p.sharedTeamIds?.includes(recruiterId));

    // Refresh dynamic pools on list request to ensure they remain fresh
    for (const p of filtered) {
      if (p.isDynamic) {
        p.candidateIds = await this.evaluateDynamicPoolCandidates(p);
        TalentStore.savePool(p);
      }
    }

    return filtered;
  }

  // Add candidate to manual pool
  assignCandidate(poolId: string, candidateProfileId: string): TalentPool {
    const pool = TalentStore.getPool(poolId);
    if (!pool) {
      throw new NotFoundException(`Talent Pool ${poolId} not found.`);
    }
    if (pool.isDynamic) {
      throw new Error("Cannot manually assign candidates to a dynamic talent pool.");
    }

    if (!pool.candidateIds.includes(candidateProfileId)) {
      pool.candidateIds.push(candidateProfileId);
      pool.updatedAt = new Date().toISOString();
      TalentStore.savePool(pool);
    }

    return pool;
  }

  // Remove candidate from manual pool
  removeCandidate(poolId: string, candidateProfileId: string): TalentPool {
    const pool = TalentStore.getPool(poolId);
    if (!pool) {
      throw new NotFoundException(`Talent Pool ${poolId} not found.`);
    }
    if (pool.isDynamic) {
      throw new Error("Cannot manually remove candidates from a dynamic talent pool.");
    }

    pool.candidateIds = pool.candidateIds.filter(id => id !== candidateProfileId);
    pool.updatedAt = new Date().toISOString();
    TalentStore.savePool(pool);

    return pool;
  }

  // Evaluate dynamic candidates based on rules
  private async evaluateDynamicPoolCandidates(pool: TalentPool): Promise<string[]> {
    if (!pool.autoRules) return [];

    const result = await this.searchIndex.search({
      skill: pool.autoRules.skills?.[0], // match on first skill rule
      experienceMin: pool.autoRules.experienceMin,
      location: pool.autoRules.preferredLocation,
      keyword: pool.autoRules.keywords?.[0],
      limit: 1000,
    });

    return result.items.map(c => c.id);
  }

  // Trigger dynamic pool update worker task
  async updateAllDynamicPools() {
    const all = TalentStore.listPools().filter(p => p.isDynamic);
    for (const p of all) {
      p.candidateIds = await this.evaluateDynamicPoolCandidates(p);
      p.updatedAt = new Date().toISOString();
      TalentStore.savePool(p);
    }
    this.logger.log(`Refreshed all dynamic talent pool populations`);
  }
}
