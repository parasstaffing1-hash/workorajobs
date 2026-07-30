import { NextRequest, NextResponse } from "next/server";
import { OAuthService } from "@/lib/auth/oauth-service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, context: { params: Promise<{ provider: string }> }) {
  const provider = (await context.params).provider.toLowerCase();
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state") || "";
  const storedState = request.cookies.get("oauth_state")?.value;
  if (!storedState || !state || storedState.split(".")[0] !== state.split(".")[0]) {
    return NextResponse.redirect(new URL(`/auth/login?error=oauth_state_expired`, request.url));
  }
  const role = storedState.split(".")[1] === "EMPLOYER" ? "EMPLOYER" : "JOB_SEEKER";
  if (!code || !["google", "linkedin"].includes(provider)) {
    return NextResponse.redirect(new URL(`/auth/login?error=oauth_failed`, request.url));
  }
  const clientId = provider === "google" ? process.env.GOOGLE_CLIENT_ID : process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = provider === "google" ? process.env.GOOGLE_CLIENT_SECRET : process.env.LINKEDIN_CLIENT_SECRET;
  const redirectUri = new URL(`/api/v1/auth/oauth/${provider}/callback`, request.url).toString();
  if (!clientId || !clientSecret) return NextResponse.redirect(new URL(`/auth/login?error=oauth_unconfigured`, request.url));
  try {
    const tokenResponse = await fetch(provider === "google" ? "https://oauth2.googleapis.com/token" : "https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ grant_type: "authorization_code", code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri }),
    });
    if (!tokenResponse.ok) throw new Error("OAuth token exchange failed");
    const tokens = await tokenResponse.json();
    const profileResponse = await fetch(provider === "google" ? "https://openidconnect.googleapis.com/v1/userinfo" : "https://api.linkedin.com/v2/userinfo", { headers: { Authorization: `Bearer ${tokens.access_token}` } });
    if (!profileResponse.ok) throw new Error("OAuth profile lookup failed");
    const profile = await profileResponse.json();
    const result = await OAuthService.authenticateWithProvider({ provider: provider as "google" | "linkedin", providerAccountId: profile.sub, email: profile.email, name: profile.name, picture: profile.picture, role: role as any, accessToken: tokens.access_token }, request.headers.get("x-forwarded-for") || "127.0.0.1", request.headers.get("user-agent") || "Browser");
    const response = NextResponse.redirect(new URL(role === "EMPLOYER" ? "/employer/dashboard" : "/candidate/dashboard", request.url));
    response.cookies.set("sessionToken", result.sessionToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 30 * 24 * 60 * 60, path: "/" });
    response.cookies.set("userRole", result.user.role, { httpOnly: false, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 30 * 24 * 60 * 60, path: "/" });
    response.cookies.set("oauth_state", "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 0, path: "/" });
    return response;
  } catch {
    return NextResponse.redirect(new URL(`/auth/login?error=oauth_failed`, request.url));
  }
}
