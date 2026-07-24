import { NextResponse } from "next/server";
import { validateDatabaseConnection } from "@/lib/prisma";

export async function GET() {
  // Readiness probe: verifies DB connectivity before accepting traffic
  const db = await validateDatabaseConnection();

  if (db.connected) {
    return NextResponse.json(
      { status: "READY", database: "CONNECTED", latencyMs: db.latencyMs },
      { status: 200 }
    );
  }

  return NextResponse.json(
    { status: "NOT_READY", database: "DISCONNECTED", error: db.error },
    { status: 503 }
  );
}
