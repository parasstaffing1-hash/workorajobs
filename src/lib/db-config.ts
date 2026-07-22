/**
 * Dynamic Database Connection & Configuration Utility
 * Parses DATABASE_URL or constructs connection string from individual POSTGRES_* environment variables.
 */

export function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== "") {
    return process.env.DATABASE_URL.trim();
  }

  const host = process.env.POSTGRES_HOST || "localhost";
  const port = process.env.POSTGRES_PORT || "5432";
  const db = process.env.POSTGRES_DB || "workora_jobs";
  const user = process.env.POSTGRES_USER || "workora";
  const password = process.env.POSTGRES_PASSWORD || "workora_password";
  const schema = process.env.POSTGRES_SCHEMA || "public";

  // Connection pooling options (max connections, connection timeout)
  const connectionLimit = process.env.POSTGRES_CONNECTION_LIMIT || "10";

  return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${db}?schema=${schema}&connection_limit=${connectionLimit}`;
}

export function getSanitizedDbConfig() {
  const rawUrl = getDatabaseUrl();
  try {
    const urlObj = new URL(rawUrl);
    return {
      host: urlObj.hostname,
      port: urlObj.port || "5432",
      database: urlObj.pathname.replace(/^\//, ""),
      user: urlObj.username,
      schema: urlObj.searchParams.get("schema") || "public",
      isConfigured: true,
    };
  } catch (e) {
    return {
      host: process.env.POSTGRES_HOST || "unknown",
      port: process.env.POSTGRES_PORT || "5432",
      database: process.env.POSTGRES_DB || "unknown",
      user: process.env.POSTGRES_USER || "unknown",
      schema: "public",
      isConfigured: false,
    };
  }
}
