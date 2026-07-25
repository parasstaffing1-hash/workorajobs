/**
 * Sentry Client-Side Configuration for WorkoraJobs (Browser Runtime)
 * Next.js 15 App Router
 */

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",

    // Production Performance Monitoring (Conservative 10% sampling in prod, 100% in dev)
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

    // Session Replays Configuration
    replaysSessionSampleRate: 0.05, // 5% of normal user sessions
    replaysOnErrorSampleRate: 1.0, // 100% of sessions with unhandled errors

    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false, // Mask sensitive fields only
        blockAllMedia: true,
      }),
    ],

    // Ignore benign browser noise and 404 navigation errors
    ignoreErrors: [
      "ResizeObserver loop limit exceeded",
      "ResizeObserver loop completed with undelivered notifications",
      "NetworkError when attempting to fetch resource",
      "Load failed",
      "Importing a module script failed",
      "AbortError",
    ],

    beforeSend(event) {
      // Never send events in test environment unless explicitly forced
      if (process.env.NODE_ENV === "test") {
        return null;
      }
      return event;
    },
  });
}
