/**
 * ============================================================================
 * OPENSEARCH CONFIGURATION MODULE
 * Enterprise settings for OpenSearch connection, indexing, and performance tuning.
 * ============================================================================
 */

export interface OpenSearchConfig {
  node: string;
  auth?: {
    username?: string;
    password?: string;
  };
  requestTimeout: number;
  maxRetries: number;
  indices: {
    jobs: string;
    companies: string;
    candidates: string;
  };
  aliases: {
    jobs: string;
    companies: string;
    candidates: string;
  };
  enabled: boolean;
}

export function getOpenSearchConfig(): OpenSearchConfig {
  const node = process.env.OPENSEARCH_NODE || process.env.ELASTICSEARCH_NODE || "http://localhost:9200";
  const username = process.env.OPENSEARCH_USERNAME || "";
  const password = process.env.OPENSEARCH_PASSWORD || "";
  const enabled = process.env.OPENSEARCH_ENABLED !== "false" && process.env.OPENSEARCH_ENABLED !== "0";

  return {
    node,
    auth: username && password ? { username, password } : undefined,
    requestTimeout: Number(process.env.OPENSEARCH_TIMEOUT_MS) || 5000,
    maxRetries: Number(process.env.OPENSEARCH_MAX_RETRIES) || 3,
    indices: {
      jobs: process.env.OPENSEARCH_INDEX_JOBS || "workora_jobs_v1",
      companies: process.env.OPENSEARCH_INDEX_COMPANIES || "workora_companies_v1",
      candidates: process.env.OPENSEARCH_INDEX_CANDIDATES || "workora_candidates_v1",
    },
    aliases: {
      jobs: "workora_jobs",
      companies: "workora_companies",
      candidates: "workora_candidates",
    },
    enabled,
  };
}
