/**
 * Next.js 15 Server Instrumentation Hook
 * Registers Sentry error tracking for Node.js and Edge runtimes.
 */

import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    try {
      await import("../sentry.server.config");
    } catch (err) {
      console.warn("[Instrumentation] Sentry server config load warning:", err);
    }
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    try {
      await import("../sentry.edge.config");
    } catch (err) {
      console.warn("[Instrumentation] Sentry edge config load warning:", err);
    }
  }
}

export const onRequestError = Sentry.captureRequestError;
