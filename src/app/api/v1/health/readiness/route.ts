import { NextResponse } from "next/server";
import { prisma, validateDatabaseConnection } from "@/lib/prisma";

export async function GET() {
  // Readiness probe: verifies DB connectivity and executes a live query via Hyperdrive
  const db = await validateDatabaseConnection();

  if (db.connected) {
    try {
      const jobCount = await prisma.job.count();
      return NextResponse.json(
        {
          status: "READY",
          database: "CONNECTED",
          latencyMs: db.latencyMs,
          details: {
            hyperdrive: db.config.isHyperdrive,
            databaseHost: db.config.host,
            totalJobsSeeded: jobCount,
          },
        },
        { status: 200 }
      );
    } catch (queryErr: any) {
      return NextResponse.json(
        {
          status: "READY",
          database: "CONNECTED",
          latencyMs: db.latencyMs,
          queryError: queryErr?.message,
        },
        { status: 200 }
      );
    }
  }

  return NextResponse.json(
    { status: "NOT_READY", database: "DISCONNECTED", error: db.error },
    { status: 503 }
  );
}
