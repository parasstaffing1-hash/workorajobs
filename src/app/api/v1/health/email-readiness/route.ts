import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const provider = (process.env.EMAIL_PROVIDER || "").toLowerCase().trim();
  const apiKey = process.env.RESEND_API_KEY?.trim() || "";
  const from = process.env.EMAIL_FROM?.trim() || "";
  const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "";

  // Mask API key for security: keep first 5 characters and last 4 characters
  const maskedKey = apiKey
    ? `${apiKey.slice(0, 5)}...${apiKey.slice(-4)}`
    : "NOT_CONFIGURED";

  const isConfigured = Boolean(
    provider === "resend" && apiKey && from && appUrl
  );

  return NextResponse.json({
    status: isConfigured ? "READY" : "DEGRADED",
    provider: provider || "NOT_CONFIGURED",
    resendApiKeyConfigured: Boolean(apiKey),
    resendApiKeyMasked: maskedKey,
    emailFromConfigured: Boolean(from),
    emailFrom: from || "NOT_CONFIGURED",
    appUrlConfigured: Boolean(appUrl),
    appUrl: appUrl || "NOT_CONFIGURED",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
}
