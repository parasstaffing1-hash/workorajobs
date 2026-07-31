/**
 * ============================================================================
 * OPENSEARCH JOBS INDEX MAPPING & ANALYZER DEFINITION
 * Custom analyzers: autocomplete (edge_ngram), typo tolerance, synonym expansion.
 * BM25 optimized for title, skills, company, description, and location.
 * ============================================================================
 */

export const JOBS_INDEX_NAME = "workora_jobs_v1";
export const JOBS_ALIAS_NAME = "workora_jobs";

export const JOBS_INDEX_MAPPING = {
  settings: {
    index: {
      number_of_shards: 2,
      number_of_replicas: 1,
      refresh_interval: "1s",
      "similarity.default.type": "BM25",
      "similarity.default.k1": 1.2,
      "similarity.default.b": 0.75,
    },
    analysis: {
      analyzer: {
        autocomplete_analyzer: {
          type: "custom",
          tokenizer: "standard",
          filter: ["lowercase", "edge_ngram_filter"],
        },
        autocomplete_search_analyzer: {
          type: "custom",
          tokenizer: "standard",
          filter: ["lowercase"],
        },
        synonym_analyzer: {
          type: "custom",
          tokenizer: "standard",
          filter: ["lowercase", "tech_synonyms"],
        },
      },
      filter: {
        edge_ngram_filter: {
          type: "edge_ngram",
          min_gram: 2,
          max_gram: 20,
        },
        tech_synonyms: {
          type: "synonym",
          synonyms: [
            "js, javascript",
            "ts, typescript",
            "py, python",
            "react, reactjs",
            "vue, vuejs",
            "node, nodejs",
            "postgres, postgresql",
            "k8s, kubernetes",
            "aws, amazon web services",
            "gcp, google cloud platform",
            "ml, machine learning",
            "ai, artificial intelligence",
            "frontend, front end, front-end",
            "backend, back end, back-end",
            "fullstack, full stack, full-stack",
          ],
        },
      },
    },
  },
  mappings: {
    properties: {
      id: { type: "keyword" },
      title: {
        type: "text",
        analyzer: "synonym_analyzer",
        fields: {
          keyword: { type: "keyword" },
          autocomplete: {
            type: "text",
            analyzer: "autocomplete_analyzer",
            search_analyzer: "autocomplete_search_analyzer",
          },
        },
      },
      companyId: { type: "keyword" },
      companyName: {
        type: "text",
        analyzer: "synonym_analyzer",
        fields: {
          keyword: { type: "keyword" },
          autocomplete: {
            type: "text",
            analyzer: "autocomplete_analyzer",
            search_analyzer: "autocomplete_search_analyzer",
          },
        },
      },
      companySlug: { type: "keyword" },
      description: {
        type: "text",
        analyzer: "synonym_analyzer",
      },
      requirements: {
        type: "text",
        analyzer: "synonym_analyzer",
      },
      skills: {
        type: "keyword",
        fields: {
          text: { type: "text", analyzer: "synonym_analyzer" },
        },
      },
      location: {
        type: "text",
        fields: {
          keyword: { type: "keyword" },
        },
      },
      workMode: { type: "keyword" }, // Remote, Hybrid, On-site
      employmentType: { type: "keyword" }, // FULL_TIME, CONTRACT, INTERNSHIP
      experience: { type: "keyword" }, // Entry Level, Mid Level, Senior Level
      industry: { type: "keyword" },
      salaryMin: { type: "double" },
      salaryMax: { type: "double" },
      salaryCurrency: { type: "keyword" },
      recruiterId: { type: "keyword" },
      postedAt: { type: "date" },
      updatedAt: { type: "date" },
      viewsCount: { type: "integer" },
      applicationsCount: { type: "integer" },
      isFeatured: { type: "boolean" },
    },
  },
};
