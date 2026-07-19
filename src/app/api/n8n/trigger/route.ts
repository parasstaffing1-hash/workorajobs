import { NextResponse } from "next/server";

import { N8nConnector } from "@/lib/N8nConnector";

export async function POST(request: Request) {
  try {
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
