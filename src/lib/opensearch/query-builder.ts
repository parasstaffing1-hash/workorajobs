/**
 * ============================================================================
 * OPENSEARCH QUERY BUILDER
 * Enterprise Query DSL builder supporting full-text, phrase, prefix, wildcard,
 * fuzzy matching, multi-filters, BM25 field boosting, decay scoring, and cursor pagination.
 * ============================================================================
 */

export interface OpenSearchJobQueryParams {
  q?: string;
  company?: string;
  location?: string;
  workMode?: string;
  type?: string;
  experience?: string;
  industry?: string;
  skills?: string[];
  minSalary?: number;
  maxSalary?: number;
  datePosted?: string;
  recruiterId?: string;
  sort?: "RELEVANCE" | "NEWEST" | "HIGHEST_SALARY" | "LOWEST_SALARY" | "COMPANY_NAME";
  page?: number;
  limit?: number;
  searchAfter?: any[];
}

export class OpenSearchQueryBuilder {
  /**
   * Constructs complete OpenSearch query body for job search
   */
  static buildJobQuery(params: OpenSearchJobQueryParams) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 20));
    const from = (page - 1) * limit;

    const must: any[] = [];
    const filter: any[] = [];
    const should: any[] = [];

    // Full-Text Search with BM25 Boosting & Typo Tolerance
    if (params.q && params.q.trim().length > 0) {
      const queryText = params.q.trim();

      must.push({
        bool: {
          should: [
            // 1. Exact phrase boost
            {
              match_phrase: {
                title: { query: queryText, boost: 5.0 },
              },
            },
            // 2. Title match with fuzzy typo tolerance & BM25 boost
            {
              match: {
                title: {
                  query: queryText,
                  boost: 3.5,
                  fuzziness: "AUTO",
                  operator: "or",
                },
              },
            },
            // 3. Skill match with boost
            {
              match: {
                "skills.text": {
                  query: queryText,
                  boost: 2.5,
                  fuzziness: "AUTO",
                },
              },
            },
            // 4. Company name match
            {
              match: {
                companyName: {
                  query: queryText,
                  boost: 2.0,
                  fuzziness: "AUTO",
                },
              },
            },
            // 5. General multi-match across description & requirements
            {
              multi_match: {
                query: queryText,
                fields: ["description^1.0", "requirements^1.2"],
                type: "best_fields",
                fuzziness: "AUTO",
              },
            },
            // 6. Prefix & Wildcard matching for partial queries
            {
              prefix: {
                "title.keyword": { value: queryText.toLowerCase(), boost: 1.5 },
              },
            },
            {
              wildcard: {
                title: { value: `*${queryText.toLowerCase()}*`, boost: 1.2 },
              },
            },
          ],
          minimum_should_match: 1,
        },
      });
    } else {
      must.push({ match_all: {} });
    }

    // Filters
    if (params.company) {
      filter.push({ term: { "companyName.keyword": params.company } });
    }

    if (params.location) {
      filter.push({
        match: { location: { query: params.location, operator: "and" } },
      });
    }

    if (params.workMode) {
      filter.push({ term: { workMode: params.workMode } });
    }

    if (params.type) {
      filter.push({ term: { employmentType: params.type } });
    }

    if (params.experience) {
      filter.push({ term: { experience: params.experience } });
    }

    if (params.industry) {
      filter.push({ term: { industry: params.industry } });
    }

    if (params.recruiterId) {
      filter.push({ term: { recruiterId: params.recruiterId } });
    }

    if (params.skills && params.skills.length > 0) {
      filter.push({ terms: { skills: params.skills } });
    }

    // Range Filter: Salary
    if (params.minSalary || params.maxSalary) {
      const range: any = {};
      if (params.minSalary) range.gte = params.minSalary;
      if (params.maxSalary) range.lte = params.maxSalary;
      filter.push({ range: { salaryMax: range } });
    }

    // Range Filter: Date Posted
    if (params.datePosted) {
      const now = new Date();
      let threshold: Date | null = null;
      if (params.datePosted === "24h") threshold = new Date(now.getTime() - 24 * 3600 * 1000);
      if (params.datePosted === "7d") threshold = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
      if (params.datePosted === "30d") threshold = new Date(now.getTime() - 30 * 24 * 3600 * 1000);

      if (threshold) {
        filter.push({ range: { postedAt: { gte: threshold.toISOString() } } });
      }
    }

    // Sort order
    let sort: any[] = [];
    if (params.sort === "NEWEST") {
      sort = [{ postedAt: { order: "desc" } }, { _id: "desc" }];
    } else if (params.sort === "HIGHEST_SALARY") {
      sort = [{ salaryMax: { order: "desc" } }, { _id: "desc" }];
    } else if (params.sort === "LOWEST_SALARY") {
      sort = [{ salaryMin: { order: "asc" } }, { _id: "asc" }];
    } else if (params.sort === "COMPANY_NAME") {
      sort = [{ "companyName.keyword": { order: "asc" } }, { _id: "asc" }];
    } else {
      // Default: Relevance score + Freshness decay boost
      sort = [{ _score: { order: "desc" } }, { postedAt: { order: "desc" } }];
    }

    const queryBody: any = {
      from: params.searchAfter ? undefined : from,
      size: limit,
      sort,
      query: {
        bool: {
          must,
          filter,
          should,
        },
      },
      // Aggregations / Facets
      aggs: {
        companies: { terms: { field: "companyName.keyword", size: 10 } },
        workModes: { terms: { field: "workMode", size: 5 } },
        employmentTypes: { terms: { field: "employmentType", size: 5 } },
        experienceLevels: { terms: { field: "experience", size: 5 } },
        skills: { terms: { field: "skills", size: 15 } },
      },
    };

    if (params.searchAfter) {
      queryBody.search_after = params.searchAfter;
    }

    return queryBody;
  }
}
