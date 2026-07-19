import { NextResponse } from "next/server";

import { n8nStore } from "@/lib/N8nConnector";

export async function GET() {
  return NextResponse.json({
    success: true,
    config: n8nStore.config,
    logs: n8nStore.logs,
  });
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    if (typeof payload.enabled !== "boolean") {
      return NextResponse.json({ success: false, error: "enabled must be a boolean" }, { status: 400 });
    }
    if (typeof payload.webhookUrl !== "string") {
      return NextResponse.json({ success: false, error: "webhookUrl must be a string" }, { status: 400 });
    }
    if (!payload.events || typeof payload.events !== "object") {
      return NextResponse.json({ success: false, error: "events must be an object" }, { status: 400 });
    }

    n8nStore.config = {
      enabled: payload.enabled,
      webhookUrl: payload.webhookUrl,
      events: {
        job_created: !!payload.events.job_created,
        application_status_changed: !!payload.events.application_status_changed,
        ats_scan_completed: !!payload.events.ats_scan_completed,
        copywriter_document_assembled: !!payload.events.copywriter_document_assembled,
      },
    };

    return NextResponse.json({
      success: true,
      config: n8nStore.config,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
