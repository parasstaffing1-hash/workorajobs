/**
 * ============================================================================
 * OPENSEARCH CANDIDATES INDEX MAPPING & ANALYZER DEFINITION
 * Talent pool search index for recruiter candidate sourcing.
 * ============================================================================
 */

export const CANDIDATES_INDEX_NAME = "workora_candidates_v1";
export const CANDIDATES_ALIAS_NAME = "workora_candidates";

export const CANDIDATES_INDEX_MAPPING = {
  settings: {
    index: {
      number_of_shards: 2,
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
      userId: { type: "keyword" },
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
      headline: { type: "text" },
      summary: { type: "text" },
      skills: { type: "keyword", fields: { text: { type: "text" } } },
      experienceYears: { type: "integer" },
      location: { type: "text", fields: { keyword: { type: "keyword" } } },
      preferredJobTitles: { type: "keyword" },
      salaryExpectation: { type: "double" },
      workMode: { type: "keyword" },
      noticePeriod: { type: "keyword" },
      educationLevel: { type: "keyword" },
      certifications: { type: "keyword" },
      isAvailable: { type: "boolean" },
      updatedAt: { type: "date" },
    },
  },
};
