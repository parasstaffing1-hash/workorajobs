import { PrismaClient } from "@prisma/client";
import { getDatabaseUrl, getSanitizedDbConfig } from "./db-config";

function createPrismaClient(): PrismaClient {
  const dbUrl = getDatabaseUrl();

  if (typeof process !== "undefined" && !process.env.DATABASE_URL) {
    process.env.DATABASE_URL = dbUrl;
  }

  return new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
    log: [],
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

globalForPrisma.prisma = prisma;

/**
 * Validate connection on startup / health probes with latency measurement
 */
export async function validateDatabaseConnection(): Promise<{
  connected: boolean;
  latencyMs: number;
  error?: string;
  config: ReturnType<typeof getSanitizedDbConfig>;
}> {
  const startTime = Date.now();
  const config = getSanitizedDbConfig();

  try {
    await prisma.$queryRaw`SELECT 1`;
    const latencyMs = Date.now() - startTime;
    return {
      connected: true,
      latencyMs,
      config,
    };
  } catch (error: any) {
    const latencyMs = Date.now() - startTime;
    return {
      connected: false,
      latencyMs,
      error: error?.message || "PostgreSQL connection failed",
      config,
    };
  }
}
