import { NextResponse } from "next/server";

export async function GET() {
  // Liveness probe: returns 200 as long as Node process is responsive
  return NextResponse.json(
    { status: "ALIVE", timestamp: new Date().toISOString() },
    { status: 200 }
  );
}
