/**
 * ============================================================================
 * ENTERPRISE OAUTH CALLBACK HANDLER (PRODUCTION-GRADE)
 * Complete token exchange, userinfo fetching, profile auto-provisioning,
 * role-aware redirection, structured logging, and dual-cookie setting.
 * ============================================================================
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { OAuthService } from "@/lib/auth/oauth-service";
import { oauthPublicUrl } from "@/lib/auth/oauth-public-url";
import { StructuredLogger } from "@/lib/observability/structured-logger";

export const dynamic = "force-dynamic";

const STATE_COOKIE = "workora_oauth_state";
const PROVIDERS = ["google", "linkedin"] as const;
type Provider = (typeof PROVIDERS)[number];

function isProvider(value: string): value is Provider {
  return (PROVIDERS as readonly string[]).includes(value);
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ provider: string }> }
) {
  const startTime = Date.now();
  const requestId = `oauth_cb_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
  const { provider: rawProvider } = await context.params;
  const provider = rawProvider.toLowerCase();
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const errorQuery = request.nextUrl.searchParams.get("error");
  const errorDesc = request.nextUrl.searchParams.get("error_description");

  // 1. Handle OAuth Provider Error Query Parameters (e.g. user denied consent)
  if (errorQuery) {
    StructuredLogger.warn(`[OAuth Callback] Provider returned error`, {
      requestId,
      provider,
      error: errorQuery,
      errorDescription: errorDesc,
      latencyMs: Date.now() - startTime,
    });
    return NextResponse.json(
      {
        success: false,
        error: `OAuth error from ${provider}: ${errorDesc || errorQuery}`,
        requestId,
      },
      { status: 400 }
    );
  }

  // 2. Validate State Cookie & Parameters
  const storedCookie = request.cookies.get(STATE_COOKIE)?.value;
  let transaction: {
    provider: Provider;
    state: string;
    verifier: string;
    callback?: string;
    requestId?: string;
  } | null = null;

  try {
    transaction = storedCookie ? JSON.parse(storedCookie) : null;
  } catch (e) {
    // Malformed state cookie
  }

  if (
    !isProvider(provider) ||
    !code ||
    !state ||
    !transaction ||
    transaction.provider !== provider ||
    transaction.state !== state
  ) {
    StructuredLogger.error(`[OAuth Callback] Invalid or expired OAuth state`, undefined, {
      requestId,
      provider,
      hasCode: Boolean(code),
      hasState: Boolean(state),
      hasTransaction: Boolean(transaction),
      latencyMs: Date.now() - startTime,
    });
    return NextResponse.json(
      { success: false, error: "Invalid or expired OAuth state.", requestId },
      { status: 400 }
    );
  }

  // 3. Resolve Credentials & Callback URL
  const prefix = provider.toUpperCase();
  const clientId = process.env[`${prefix}_CLIENT_ID`]?.trim();
  const clientSecret = process.env[`${prefix}_CLIENT_SECRET`]?.trim();

  if (!clientId || !clientSecret) {
    StructuredLogger.error(`[OAuth Callback] Missing OAuth credentials`, undefined, {
      requestId,
      provider,
      latencyMs: Date.now() - startTime,
    });
    return NextResponse.json(
      { success: false, error: `${provider} OAuth is not configured on server.`, requestId },
      { status: 503 }
    );
  }

  const envCallback = process.env[`${prefix}_CALLBACK_URL`]?.trim();
  const callback =
    envCallback ||
    transaction.callback ||
    oauthPublicUrl(request, `/api/v1/auth/oauth/${provider}/callback`).toString();

  const tokenUrl =
    provider === "google"
      ? "https://oauth2.googleapis.com/token"
      : "https://www.linkedin.com/oauth/v2/accessToken";

  try {
    // 4. Token Exchange Request
    StructuredLogger.info(`[OAuth Callback] Exchanging authorization code for token`, {
      requestId,
      provider,
      callback,
    });

    let tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: callback,
        grant_type: "authorization_code",
        code_verifier: transaction.verifier,
      }),
    });

    // Fallback for LinkedIn if PKCE is not accepted by application configuration
    if (!tokenResponse.ok && provider === "linkedin") {
      const firstErrorText = await tokenResponse.text().catch(() => "");
      StructuredLogger.warn(`[OAuth Callback] LinkedIn PKCE token exchange returned non-200. Retrying standard grant body.`, {
        requestId,
        status: tokenResponse.status,
        response: firstErrorText,
      });

      tokenResponse = await fetch(tokenUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          redirect_uri: callback,
          grant_type: "authorization_code",
        }),
      });
    }

    if (!tokenResponse.ok) {
      const errorBodyText = await tokenResponse.text().catch(() => "");
      let parsedError: any = {};
      try {
        parsedError = JSON.parse(errorBodyText);
      } catch (_) {
        parsedError = { raw: errorBodyText };
      }

      StructuredLogger.error(`[OAuth Callback] Token exchange failed from provider`, undefined, {
        requestId,
        provider,
        httpStatus: tokenResponse.status,
        errorResponseBody: parsedError,
        latencyMs: Date.now() - startTime,
      });

      const detailMsg = parsedError.error_description || parsedError.error || errorBodyText || "Token exchange rejected.";
      throw new Error(`OAuth token exchange failed (${provider}): ${detailMsg}`);
    }

    const tokenData = (await tokenResponse.json()) as { access_token?: string; id_token?: string };
    if (!tokenData.access_token) {
      throw new Error(`OAuth provider (${provider}) did not return an access token.`);
    }

    // 5. Fetch User Profile
    const profileUrl =
      provider === "google"
        ? "https://openidconnect.googleapis.com/v1/userinfo"
        : "https://api.linkedin.com/v2/userinfo";

    const profileResponse = await fetch(profileUrl, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!profileResponse.ok) {
      const profileErrText = await profileResponse.text().catch(() => "");
      StructuredLogger.error(`[OAuth Callback] Profile lookup failed`, undefined, {
        requestId,
        provider,
        httpStatus: profileResponse.status,
        errorBody: profileErrText,
      });
      throw new Error(`OAuth profile lookup failed (${provider}): ${profileErrText}`);
    }

    const profile = (await profileResponse.json()) as {
      sub?: string;
      id?: string;
      email?: string;
      email_verified?: boolean;
      name?: string;
      picture?: string;
    };

    const providerAccountId = profile.sub || profile.id;
    if (!profile.email || !providerAccountId) {
      throw new Error(`OAuth provider (${provider}) did not return a valid email identity.`);
    }

    if (provider === "google" && profile.email_verified !== true) {
      throw new Error("Google account email is not verified.");
    }

    // 6. Authenticate & Auto-Provision User in Database / Session Store
    const result = await OAuthService.authenticateWithProvider(
      {
        provider,
        providerAccountId,
        email: profile.email,
        name: profile.name,
        picture: profile.picture,
        accessToken: tokenData.access_token,
        idToken: tokenData.id_token,
      },
      request.headers.get("x-forwarded-for") ?? "127.0.0.1",
      request.headers.get("user-agent") ?? "Browser"
    );

    // 7. Role-Aware Redirect Path Resolution
    let dashboardPath = "/candidate/dashboard";
    if (result.user.role === "EMPLOYER" || result.user.role === "RECRUITER") {
      dashboardPath = "/employer/dashboard";
    } else if (result.user.role === "ADMIN") {
      dashboardPath = "/admin/seo-dashboard";
    }

    const targetUrl = oauthPublicUrl(request, dashboardPath);
    const response = NextResponse.redirect(targetUrl);

    // 8. Set Both Security Cookies (sessionToken & userRole) on path "/"
    const maxAge = 30 * 24 * 60 * 60; // 30 days

    response.cookies.set("sessionToken", result.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge,
      path: "/",
    });

    response.cookies.set("userRole", result.user.role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge,
      path: "/",
    });

    // Clear state cookie
    response.cookies.set(STATE_COOKIE, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    StructuredLogger.audit(`USER_OAUTH_LOGIN_SUCCESS:${provider}`, {
      requestId,
      userId: result.user.id,
      email: result.user.email,
      role: result.user.role,
      redirectPath: dashboardPath,
      latencyMs: Date.now() - startTime,
    });

    return response;
  } catch (error: any) {
    const errorMessage = error?.message || "OAuth authentication failed.";
    StructuredLogger.error(`[OAuth Callback Exception]`, error instanceof Error ? error : undefined, {
      requestId,
      provider,
      errorMessage,
      latencyMs: Date.now() - startTime,
    });

    const response = NextResponse.json(
      {
        success: false,
        error: errorMessage,
        requestId,
      },
      { status: 400 }
    );

    // Clear state cookie on error
    response.cookies.set(STATE_COOKIE, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return response;
  }
}
