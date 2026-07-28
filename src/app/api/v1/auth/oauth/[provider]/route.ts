import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const PROVIDERS = ["google", "linkedin"] as const;
type Provider = (typeof PROVIDERS)[number];
const STATE_COOKIE = "workora_oauth_state";

function isProvider(value: string): value is Provider {
  return (PROVIDERS as readonly string[]).includes(value);
}

function configFor(provider: Provider) {
  const prefix = provider.toUpperCase();
  const clientId = process.env[`${prefix}_CLIENT_ID`];
  const clientSecret = process.env[`${prefix}_CLIENT_SECRET`];
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret };
}

/** Starts an OAuth Authorization Code + PKCE flow.  This endpoint intentionally
 * does not accept identity data from the browser. */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ provider: string }> }
) {
  const { provider: rawProvider } = await context.params;
  const provider = rawProvider.toLowerCase();
  if (!isProvider(provider)) {
    return NextResponse.json({ success: false, error: "Unsupported OAuth provider." }, { status: 404 });
  }

  const config = configFor(provider);
  if (!config) {
    return NextResponse.json(
      { success: false, error: `${provider === "google" ? "Google" : "LinkedIn"} OAuth is not configured.` },
      { status: 503 }
    );
  }

  const state = crypto.randomBytes(32).toString("base64url");
  const verifier = crypto.randomBytes(48).toString("base64url");
  const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");
  const callback = new URL(`/api/v1/auth/oauth/${provider}/callback`, request.url).toString();
  const authorizationUrl = new URL(
    provider === "google"
      ? "https://accounts.google.com/o/oauth2/v2/auth"
      : "https://www.linkedin.com/oauth/v2/authorization"
  );
  authorizationUrl.searchParams.set("client_id", config.clientId);
  authorizationUrl.searchParams.set("redirect_uri", callback);
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("scope", provider === "google" ? "openid email profile" : "openid profile email");
  authorizationUrl.searchParams.set("state", state);
  authorizationUrl.searchParams.set("code_challenge", challenge);
  authorizationUrl.searchParams.set("code_challenge_method", "S256");

  const response = NextResponse.redirect(authorizationUrl);
  response.cookies.set(STATE_COOKIE, JSON.stringify({ provider, state, verifier }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/v1/auth/oauth",
    maxAge: 10 * 60,
  });
  return response;
}

// POST used to mint sessions from browser supplied emails and provider IDs. OAuth
// login is redirect-only; rejecting POST closes that account-takeover vector.
export async function POST() {
  return NextResponse.json(
    { success: false, error: "OAuth must be started with a browser redirect." },
    { status: 405, headers: { Allow: "GET" } }
  );
}
