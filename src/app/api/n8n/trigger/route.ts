import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

import { N8nConnector } from "@/lib/N8nConnector";
import { getAuthUserId } from "@/lib/auth/get-auth-user";

function secretsMatch(provided: string | null, expected: string | undefined) {
  if (!provided || !expected) return false;
  const normalized = provided.replace(/^Bearer\s+/i, "");
  const providedBuffer = Buffer.from(normalized);
  const expectedBuffer = Buffer.from(expected);
  return (
    providedBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(providedBuffer, expectedBuffer)
  );
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("x-n8n-secret") || request.headers.get("authorization");
    const authenticatedUserId = await getAuthUserId(request, "ANY");
    const internalRequest = secretsMatch(authHeader, process.env.N8N_WEBHOOK_SECRET);

    if (!authenticatedUserId && !internalRequest) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
    }

    const { eventType, payload } = await request.json();
    if (!eventType || !payload) {
      return NextResponse.json({ success: false, error: "eventType and payload are required" }, { status: 400 });
    }
    const log = await N8nConnector.triggerEvent(eventType, payload);
    return NextResponse.json({ success: true, log });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

