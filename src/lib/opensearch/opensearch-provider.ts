/**
 * ============================================================================
 * OPENSEARCH SEARCH PROVIDER
 * Executes high-performance search, aggregations, suggestions, and similar items.
 * ============================================================================
 */

import { getOpenSearchClient, isOpenSearchAvailable } from "./client";
import { JOBS_ALIAS_NAME } from "./indices/jobs-index";
import { OpenSearchQueryBuilder, OpenSearchJobQueryParams } from "./query-builder";
import { JobSearchResponse, JobSearchResultItem, SearchAutocompleteSuggestion } from "@/lib/search/types";

export class OpenSearchSearchProvider {
  /**
   * Main search endpoint executing OpenSearch DSL
   */
  static async searchJobs(params: OpenSearchJobQueryParams): Promise<JobSearchResponse> {
    const startTime = Date.now();
    const client = getOpenSearchClient();

    if (!client) {
      throw new Error("OpenSearch client is not initialized.");
    }

    const queryBody = OpenSearchQueryBuilder.buildJobQuery(params);
    const searchRes = await client.search({
      index: JOBS_ALIAS_NAME,
      body: queryBody,
    });

    const hits = searchRes.body.hits;
    const total = typeof hits.total === "number" ? hits.total : hits.total.value;
    const limit = Math.min(100, Math.max(1, params.limit || 20));
    const page = Math.max(1, params.page || 1);

    const jobs: JobSearchResultItem[] = hits.hits.map((hit: any) => {
      const src = hit._source;
      return {
        id: src.id,
        title: src.title,
        companyName: src.companyName,
        companySlug: src.companySlug,
        location: src.location || "Remote",
        salary: src.salaryMax || 110000,
        type: src.employmentType || "FULL_TIME",
        workMode: src.workMode || "Remote",
        experience: src.experience || "Mid Level",
        postedAt: src.postedAt,
        slug: `${src.companySlug}-${src.id}`,
      };
    });

    return {
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      jobs,
      tookMs: Date.now() - startTime,
    };
  }

  /**
   * Autocomplete suggestions via OpenSearch Completion & Prefix match
   */
  static async getSuggestions(query: string): Promise<SearchAutocompleteSuggestion[]> {
    if (!query || query.trim().length < 2) return [];
    const client = getOpenSearchClient();
    if (!client) return [];

    const searchRes = await client.search({
      index: JOBS_ALIAS_NAME,
      body: {
        size: 5,
        query: {
          match_phrase_prefix: {
            title: {
              query: query.trim(),
              max_expansions: 10,
            },
          },
        },
        _source: ["title", "companyName", "location"],
      },
    });

    const suggestions: SearchAutocompleteSuggestion[] = [];
    const hits = searchRes.body.hits.hits || [];

    hits.forEach((h: any) => {
      if (h._source.title) suggestions.push({ text: h._source.title, type: "JOB_TITLE" });
      if (h._source.companyName) suggestions.push({ text: h._source.companyName, type: "COMPANY" });
    });

    return suggestions;
  }
}
