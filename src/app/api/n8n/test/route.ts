import { NextResponse } from "next/server";

import { N8nConnector, n8nStore } from "@/lib/N8nConnector";

export async function POST(request: Request) {
  try {
    const { eventType } = await request.json();

    if (!eventType) {
      return NextResponse.json({ success: false, error: "eventType is required" }, { status: 400 });
    }

    // Construct mock payload depending on eventType
    let payload: Record<string, unknown> = {};
    const timestamp = new Date().toISOString();

    if (eventType === "job_created") {
      payload = {
        event: "job_created",
        timestamp,
        job: {
          id: "wj-test-999",
          title: "Lead DevOps & Platform Reliability Engineer",
          company: "Northstar Cloud",
          location: "Remote, North America",
          type: "Full-time",
          salary: "$145k - $175k",
          department: "Engineering",
        },
      };
    } else if (eventType === "application_status_changed") {
      payload = {
        event: "application_status_changed",
        timestamp,
        candidate: {
          name: "Sarah Connor",
          email: "sarah.connor@sky.net",
          role: "Software Architect",
          previousStatus: "Applied",
          newStatus: "Interviewing",
          sequenceTemplate: "interview_invite",
        },
      };
    } else if (eventType === "ats_scan_completed") {
      payload = {
        event: "ats_scan_completed",
        timestamp,
        candidate: {
          name: "John Connor",
          email: "john.connor@sky.net",
        },
        scanResult: {
          score: 92,
          matchedSkills: ["TypeScript", "Next.js", "Docker", "Git"],
          missingSkills: ["Kubernetes"],
          hiringStage: "SCREENING",
        },
      };
    } else if (eventType === "copywriter_document_assembled") {
      payload = {
        event: "copywriter_document_assembled",
        timestamp,
        document: {
          id: "doc-555",
          title: "Stripe Frontend Engineering Assessment Prompt",
          wordCount: 1150,
          creator: "System AI Agent",
        },
      };
    } else {
      payload = {
        event: eventType,
        timestamp,
        data: "Generic automation mock data payload",
      };
    }

    const { config } = n8nStore;

    if (!config.enabled) {
      // If automation is disabled, log it as skipped/failed and return early
      const skippedLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp,
        eventType,
        status: "failed" as const,
        statusCode: 0,
        payload,
        response: { error: "Automation is disabled in settings. Enable it to dispatch hooks." },
      };
      n8nStore.logs.unshift(skippedLog);
      return NextResponse.json({
        success: false,
        message: "Automation is disabled. Dispatch skipped.",
        log: skippedLog,
      });
    }

    // Trigger using our N8nConnector
    const logItem = await N8nConnector.triggerEvent(eventType, payload);

    if (logItem && logItem.status === "success") {
      return NextResponse.json({
        success: true,
        message: `Mock event '${eventType}' dispatched successfully to N8N webhook.`,
        log: logItem,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: `Mock event '${eventType}' dispatch failed.`,
        log: logItem,
      });
    }
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
