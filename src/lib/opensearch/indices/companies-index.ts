/**
 * ============================================================================
 * OPENSEARCH COMPANIES INDEX MAPPING & ANALYZER DEFINITION
 * High-performance search index for employer companies.
 * ============================================================================
 */

export const COMPANIES_INDEX_NAME = "workora_companies_v1";
export const COMPANIES_ALIAS_NAME = "workora_companies";

export const COMPANIES_INDEX_MAPPING = {
  settings: {
    index: {
      number_of_shards: 1,
      number_of_replicas: 1,
      refresh_interval: "1s",
    },
    analysis: {
      analyzer: {
        autocomplete_analyzer: {
          type: "custom",
          tokenizer: "standard",
          filter: ["lowercase", "edge_ngram_filter"],
        },
      },
      filter: {
        edge_ngram_filter: {
          type: "edge_ngram",
          min_gram: 2,
          max_gram: 20,
        },
      },
    },
  },
  mappings: {
    properties: {
      id: { type: "keyword" },
      name: {
        type: "text",
        fields: {
          keyword: { type: "keyword" },
          autocomplete: {
            type: "text",
            analyzer: "autocomplete_analyzer",
          },
        },
      },
      slug: { type: "keyword" },
      industry: { type: "keyword" },
      headquarters: { type: "text", fields: { keyword: { type: "keyword" } } },
      description: { type: "text" },
      companySize: { type: "keyword" },
      websiteUrl: { type: "keyword" },
      logoUrl: { type: "keyword" },
      activeJobsCount: { type: "integer" },
      isVerified: { type: "boolean" },
      createdAt: { type: "date" },
    },
  },
};
