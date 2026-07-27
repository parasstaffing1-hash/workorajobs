/**
 * Dynamic Database Connection & Configuration Utility
 * Resolves Cloudflare Hyperdrive binding in Edge/Worker runtime or falls back to process.env.DATABASE_URL / POSTGRES_* vars in local Node environment.
 */

export function getDatabaseUrl(): string {
  // 1. Cloudflare Hyperdrive connection string (if set in Worker environment)
  if (
    typeof process !== "undefined" &&
    process.env.HYPERDRIVE_CONNECTION_STRING &&
    process.env.HYPERDRIVE_CONNECTION_STRING.trim() !== ""
  ) {
    return process.env.HYPERDRIVE_CONNECTION_STRING.trim();
  }

  // 2. Direct DATABASE_URL environment variable (Secrets or Local .env)
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== "") {
    return process.env.DATABASE_URL.trim();
  }

  const host = process.env.POSTGRES_HOST || "localhost";
  const port = process.env.POSTGRES_PORT || "5432";
  const db = process.env.POSTGRES_DB || "workora_jobs";
  const user = process.env.POSTGRES_USER || "workora";
  const password = process.env.POSTGRES_PASSWORD || "workora_password";
  const schema = process.env.POSTGRES_SCHEMA || "public";
  const connectionLimit = process.env.POSTGRES_CONNECTION_LIMIT || "10";

  return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${db}?schema=${schema}&connection_limit=${connectionLimit}`;
}

export function getSanitizedDbConfig() {
  const rawUrl = getDatabaseUrl();
  const isHyperdrive = typeof process !== "undefined" && Boolean(process.env.HYPERDRIVE_CONNECTION_STRING);
  try {
    const urlObj = new URL(rawUrl);
    return {
      host: urlObj.hostname,
      port: urlObj.port || "5432",
      database: urlObj.pathname.replace(/^\//, ""),
      user: urlObj.username,
      schema: urlObj.searchParams.get("schema") || "public",
      isHyperdrive,
      isConfigured: true,
    };
  } catch (e) {
    return {
      host: process.env.POSTGRES_HOST || "unknown",
      port: process.env.POSTGRES_PORT || "5432",
      database: process.env.POSTGRES_DB || "unknown",
      user: process.env.POSTGRES_USER || "unknown",
      schema: "public",
      isHyperdrive: false,
      isConfigured: false,
    };
  }
}
