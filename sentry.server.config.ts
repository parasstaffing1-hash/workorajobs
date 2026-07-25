/**
 * Sentry Server-Side Configuration for WorkoraJobs (Node.js Server Runtime)
 * Next.js 15 App Router
 */

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",

    // Server-side performance monitoring (10% sampling in production)
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

    // Filter out transactions for high-frequency health check & probe routes
    ignoreTransactions: [
      "/api/v1/health",
      "/api/v1/health/liveness",
      "/api/v1/health/readiness",
      "/api/health/database",
      "/health/database",
      "/robots.txt",
      "/favicon.ico",
      "/16d8438fd62243ea8c7d0464673b88fe.txt",
    ],

    ignoreErrors: [
      "NEXT_NOT_FOUND",
      "NEXT_REDIRECT",
      "ECONNRESET",
      "EPIPE",
    ],

    beforeSend(event, hint) {
      // Ignore expected Next.js 404 errors
      const error = hint.originalException as { digest?: string; message?: string } | undefined;
      if (error?.digest?.startsWith("NEXT_NOT_FOUND") || error?.message?.includes("NEXT_NOT_FOUND")) {
        return null;
      }
      return event;
    },
  });
}
