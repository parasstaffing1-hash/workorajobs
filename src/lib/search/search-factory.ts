/**
 * ============================================================================
 * SEARCH ENGINE FACTORY (ADAPTER PATTERN)
 * Abstract Search Factory enabling zero-downtime search engine replacement.
 * Automatically routes queries to OpenSearch when available and falls back
 * to PostgreSQL Prisma search when OpenSearch is offline.
 * ============================================================================
 */

import { JobSearchEngine } from "./search-engine";
import { OpenSearchSearchProvider } from "@/lib/opensearch/opensearch-provider";
import { isOpenSearchAvailable } from "@/lib/opensearch/client";
import { JobSearchQueryParams, JobSearchResponse, SearchAutocompleteSuggestion } from "./types";

export class SearchFactory {
  /**
   * Unified Job Search with OpenSearch primary & PostgreSQL fallback
   */
  static async searchJobs(params: JobSearchQueryParams): Promise<JobSearchResponse> {
    const isOpensearchUp = await isOpenSearchAvailable().catch(() => false);

    if (isOpensearchUp) {
      try {
        return await OpenSearchSearchProvider.searchJobs(params);
      } catch (err) {
        console.warn("[SearchFactory Warning] OpenSearch query failed; falling back to PostgreSQL:", err);
      }
    }

    // Fallback to PostgreSQL Prisma Search Engine
    return JobSearchEngine.search(params);
  }

  /**
   * Unified Autocomplete Suggestions
   */
  static async getSuggestions(query: string): Promise<SearchAutocompleteSuggestion[]> {
    const isOpensearchUp = await isOpenSearchAvailable().catch(() => false);

    if (isOpensearchUp) {
      try {
        const suggestions = await OpenSearchSearchProvider.getSuggestions(query);
        if (suggestions.length > 0) return suggestions;
      } catch (_) {
        // Fallback
      }
    }

    return JobSearchEngine.getSuggestions(query);
  }
}
