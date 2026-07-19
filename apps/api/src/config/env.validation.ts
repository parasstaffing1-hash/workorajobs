const required = [
  "DATABASE_URL",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "COOKIE_SECRET",
];

export function validateEnv(config: Record<string, unknown>) {
  const nodeEnv = String(config.NODE_ENV ?? "development");

  for (const key of required) {
    const value = config[key];
    if (!value || typeof value !== "string") {
      throw new Error(`Missing required environment variable: ${key}`);
    }

    if (nodeEnv === "production" && value.startsWith("replace-with")) {
      throw new Error(
        `Production environment variable ${key} must be replaced.`,
      );
    }
  }

  const port = Number(config.PORT ?? config.API_PORT ?? 4000);
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error("PORT must be a valid TCP port.");
  }

  return {
    ...config,
    NODE_ENV: nodeEnv,
    PORT: port,
  };
}
