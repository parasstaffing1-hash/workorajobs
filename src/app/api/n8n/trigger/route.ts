import { NextRequest, NextResponse } from "next/server";

import { N8nConnector } from "@/lib/N8nConnector";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("x-n8n-secret") || request.headers.get("authorization");
    const expectedSecret = process.env.N8N_WEBHOOK_SECRET || process.env.JWT_SECRET || "workora_n8n_shared_secret";

    if (authHeader && authHeader.replace("Bearer ", "") !== expectedSecret && authHeader !== expectedSecret) {
      // Log warning but allow fallback in dev if secret not strictly set
      if (process.env.NODE_ENV === "production" && process.env.N8N_WEBHOOK_SECRET) {
        return NextResponse.json({ success: false, error: "Invalid n8n webhook secret" }, { status: 401 });
      }
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

