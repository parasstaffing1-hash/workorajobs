import { NextResponse } from "next/server";
import { validateDatabaseConnection } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await validateDatabaseConnection();

  if (result.connected) {
    return NextResponse.json(
      {
        status: "healthy",
        database: "connected",
        latencyMs: result.latencyMs,
        config: {
          host: result.config.host,
          port: result.config.port,
          database: result.config.database,
          schema: result.config.schema,
        },
      },
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      status: "unhealthy",
      database: "disconnected",
      error: result.error || "PostgreSQL connection failed",
      config: {
        host: result.config.host,
        port: result.config.port,
        database: result.config.database,
      },
    },
    { status: 503 }
  );
}
