import { PrismaClient } from "@prisma/client";
import { getDatabaseUrl, getSanitizedDbConfig } from "./db-config";

const dbUrl = getDatabaseUrl();

// Ensure process.env.DATABASE_URL is set dynamically for Prisma Client runtime
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = dbUrl;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
    // Silence Prisma internal stderr logger in development when DB is offline
    log: [],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Validate connection on startup with graceful error handling
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
