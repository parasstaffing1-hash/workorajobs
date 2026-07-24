import { NextResponse } from "next/server";
import { validateDatabaseConnection } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { signJwt, verifyJwt } from "@/lib/jwt";

export async function GET() {
  const startTime = Date.now();

  // 1. Check PostgreSQL Database
  const dbHealth = await validateDatabaseConnection();

  // 2. Check Redis Cache
  let redisStatus = "UNKNOWN";
  let redisLatencyMs = 0;
  const redisStart = Date.now();

  try {
    await redis.set("healthcheck:ping", "pong", "EX", 10);
    const val = await redis.get("healthcheck:ping");
    redisLatencyMs = Date.now() - redisStart;
    redisStatus = val === "pong" ? "UP" : "DEGRADED";
  } catch (err: any) {
    redisLatencyMs = Date.now() - redisStart;
    redisStatus = "DOWN";
  }

  // 3. Check JWT Subsystem
  let jwtStatus = "UP";
  try {
    const testToken = signJwt({ userId: "health-user", role: "SYSTEM", email: "health@workorajobs.com" }, 10);
    const verified = verifyJwt(testToken);
    if (!verified || verified.userId !== "health-user") {
      jwtStatus = "DEGRADED";
    }
  } catch (_) {
    jwtStatus = "DOWN";
  }

  // 4. Check Heap Memory
  const memUsage = process.memoryUsage();
  const heapUsedMb = Math.round(memUsage.heapUsed / 1024 / 1024);
  const heapTotalMb = Math.round(memUsage.heapTotal / 1024 / 1024);

  const isHealthy = dbHealth.connected && (redisStatus === "UP" || redisStatus === "DEGRADED") && jwtStatus === "UP";
  const statusCode = isHealthy ? 200 : 503;

  return NextResponse.json(
    {
      status: isHealthy ? "HEALTHY" : "UNHEALTHY",
      service: "workorajobs-auth",
      timestamp: new Date().toISOString(),
      latencyMs: Date.now() - startTime,
      checks: {
        database: {
          status: dbHealth.connected ? "UP" : "DOWN",
          latencyMs: dbHealth.latencyMs,
          ...(dbHealth.error ? { error: dbHealth.error } : {}),
        },
        redis: {
          status: redisStatus,
          latencyMs: redisLatencyMs,
        },
        jwtSubsystem: {
          status: jwtStatus,
        },
        systemMemory: {
          status: heapUsedMb < 1024 ? "UP" : "WARN_HIGH_MEMORY",
          heapUsedMb,
          heapTotalMb,
        },
        uptimeSeconds: Math.floor(process.uptime()),
      },
    },
    { status: statusCode }
  );
}
