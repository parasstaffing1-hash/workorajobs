import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

/**
 * GET /api/v1/health/sentry-test
 * Verification route to test Sentry error tracking and message logging.
 */
export async function GET() {
  try {
    const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

    if (!dsn) {
      return NextResponse.json(
        {
          success: false,
          message: "SENTRY_DSN environment variable is not configured.",
          configured: false,
        },
        { status: 503 }
      );
    }

    // 1. Capture info message
    const messageId = Sentry.captureMessage(
      "WorkoraJobs Sentry Verification Test Message",
      "info"
    );

    // 2. Capture test exception
    const testError = new Error(
      "WorkoraJobs Sentry Verification Test Exception - Real Production Event Test"
    );
    const eventId = Sentry.captureException(testError);

    // 3. Flush Sentry queue to ensure immediate delivery
    await Sentry.flush(2000);

    return NextResponse.json({
      success: true,
      message: "Test error and message events successfully sent to Sentry.",
      data: {
        eventId,
        messageId,
        dsnConfigured: true,
        environment: process.env.NODE_ENV || "development",
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[Sentry Test Route Error]:", err.message);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to send test event to Sentry" },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
