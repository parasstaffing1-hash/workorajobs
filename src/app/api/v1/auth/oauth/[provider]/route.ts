import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { oauthPublicUrl } from "@/lib/auth/oauth-public-url";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ provider: string }> }
) {
  const { provider } = await context.params;
  const searchParams = request.nextUrl.searchParams;
  const role = searchParams.get("role") || "JOB_SEEKER";

  const cleanProvider = provider.toLowerCase();
  const clientId = cleanProvider === "google" ? process.env.GOOGLE_CLIENT_ID : process.env.LINKEDIN_CLIENT_ID;
  if (!clientId || !["google", "linkedin"].includes(cleanProvider)) {
    return NextResponse.json({ success: false, error: "OAuth provider is not configured." }, { status: 503 });
  }
  const state = crypto.randomUUID();
  const callback = oauthPublicUrl(request, `/api/v1/auth/oauth/${cleanProvider}/callback`).toString();
  const authUrl = cleanProvider === "google"
    ? new URL("https://accounts.google.com/o/oauth2/v2/auth")
    : new URL("https://www.linkedin.com/oauth/v2/authorization");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", callback);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", cleanProvider === "google" ? "openid email profile" : "openid profile email");
  authUrl.searchParams.set("state", `${state}.${role}`);
  const response = NextResponse.redirect(authUrl);
  response.cookies.set("oauth_state", `${state}.${role}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return response;
}
