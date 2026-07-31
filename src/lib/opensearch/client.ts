/**
 * ============================================================================
 * OPENSEARCH CLIENT SINGLETON
 * Resilient OpenSearch connection pool with health checking and automatic fallback.
 * ============================================================================
 */

import { Client } from "@opensearch-project/opensearch";
import { getOpenSearchConfig } from "./config";

let clientInstance: Client | null = null;
let isHealthy = false;
let lastCheckTime = 0;
const HEALTH_CHECK_INTERVAL_MS = 30000; // Check health every 30s

export function getOpenSearchClient(): Client | null {
  const config = getOpenSearchConfig();
  if (!config.enabled) return null;

  if (!clientInstance) {
    try {
      clientInstance = new Client({
        node: config.node,
        auth: config.auth,
        requestTimeout: config.requestTimeout,
        maxRetries: config.maxRetries,
        ssl: {
          rejectUnauthorized: process.env.NODE_ENV === "production",
        },
      });
    } catch (err) {
      console.warn("[OpenSearch Client Init Warning] Could not instantiate OpenSearch client:", err);
      return null;
    }
  }

  return clientInstance;
}

/**
 * Health check helper to verify OpenSearch availability
 */
export async function isOpenSearchAvailable(): Promise<boolean> {
  const now = Date.now();
  if (now - lastCheckTime < HEALTH_CHECK_INTERVAL_MS) {
    return isHealthy;
  }

  const client = getOpenSearchClient();
  if (!client) {
    isHealthy = false;
    lastCheckTime = now;
    return false;
  }

  try {
    const health = await client.cluster.health({ timeout: "3s" });
    isHealthy = Boolean(health && health.body && ["green", "yellow"].includes(health.body.status));
  } catch (_) {
    isHealthy = false;
  }

  lastCheckTime = now;
  return isHealthy;
}
