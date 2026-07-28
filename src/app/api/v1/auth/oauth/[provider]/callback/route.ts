import { NextRequest, NextResponse } from "next/server";
import { OAuthService } from "@/lib/auth/oauth-service";
import { oauthPublicUrl } from "@/lib/auth/oauth-public-url";

export const dynamic = "force-dynamic";

const STATE_COOKIE = "workora_oauth_state";
const PROVIDERS = ["google", "linkedin"] as const;
type Provider = (typeof PROVIDERS)[number];

function isProvider(value: string): value is Provider {
  return (PROVIDERS as readonly string[]).includes(value);
}

export async function GET(request: NextRequest, context: { params: Promise<{ provider: string }> }) {
  const { provider: rawProvider } = await context.params;
  const provider = rawProvider.toLowerCase();
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const stored = request.cookies.get(STATE_COOKIE)?.value;

  let transaction: { provider: Provider; state: string; verifier: string } | null = null;
  try { transaction = stored ? JSON.parse(stored) : null; } catch { /* invalid state is rejected below */ }
  if (!isProvider(provider) || !code || !state || !transaction || transaction.provider !== provider || transaction.state !== state) {
    return NextResponse.json({ success: false, error: "Invalid or expired OAuth state." }, { status: 400 });
  }

  const prefix = provider.toUpperCase();
  const clientId = process.env[`${prefix}_CLIENT_ID`];
  const clientSecret = process.env[`${prefix}_CLIENT_SECRET`];
  if (!clientId || !clientSecret) return NextResponse.json({ success: false, error: "OAuth is not configured." }, { status: 503 });

  try {
    const callback = oauthPublicUrl(request, `/api/v1/auth/oauth/${provider}/callback`).toString();
    const tokenUrl = provider === "google" ? "https://oauth2.googleapis.com/token" : "https://www.linkedin.com/oauth/v2/accessToken";
    const tokenResponse = await fetch(tokenUrl, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, code, redirect_uri: callback, grant_type: "authorization_code", code_verifier: transaction.verifier }) });
    if (!tokenResponse.ok) throw new Error("OAuth token exchange failed.");
    const token = await tokenResponse.json() as { access_token?: string };
    if (!token.access_token) throw new Error("OAuth provider did not return an access token.");
    const profileResponse = await fetch(provider === "google" ? "https://openidconnect.googleapis.com/v1/userinfo" : "https://api.linkedin.com/v2/userinfo", { headers: { Authorization: `Bearer ${token.access_token}` } });
    if (!profileResponse.ok) throw new Error("OAuth profile lookup failed.");
    const profile = await profileResponse.json() as { sub?: string; id?: string; email?: string; email_verified?: boolean; name?: string; picture?: string };
    if (!profile.email || !(profile.sub ?? profile.id) || (provider === "google" && profile.email_verified !== true)) throw new Error("OAuth provider did not return a verified email identity.");

    const result = await OAuthService.authenticateWithProvider({ provider, providerAccountId: profile.sub ?? profile.id!, email: profile.email, name: profile.name, picture: profile.picture }, request.headers.get("x-forwarded-for") ?? "127.0.0.1", request.headers.get("user-agent") ?? "Browser");
    const redirect = oauthPublicUrl(request, "/candidate/dashboard");
    const response = NextResponse.redirect(redirect);
    response.cookies.set(STATE_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/api/v1/auth/oauth", maxAge: 0 });
    response.cookies.set("sessionToken", result.sessionToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 30 * 24 * 60 * 60 });
    return response;
  } catch (error) {
    const response = NextResponse.json({ success: false, error: error instanceof Error ? error.message : "OAuth authentication failed." }, { status: 400 });
    response.cookies.set(STATE_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/api/v1/auth/oauth", maxAge: 0 });
    return response;
  }
}
