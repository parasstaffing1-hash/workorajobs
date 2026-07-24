import { NextRequest, NextResponse } from "next/server";
import { signJwt } from "@/lib/jwt";
import { SessionStore } from "@/lib/auth/session-store";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ provider: string }> }
) {
  const { provider } = await context.params;
  const searchParams = request.nextUrl.searchParams;
  const role = searchParams.get("role") || "JOB_SEEKER";

  const cleanProvider = provider.toLowerCase();
  const demoEmail = `oauth.${cleanProvider}.${Date.now()}@workorajobs.example.com`;

  const session = await SessionStore.createSession({
    userId: `oauth-${cleanProvider}-user`,
    email: demoEmail,
    role,
  }).catch(() => ({ sessionToken: `dev-oauth-session-${Date.now()}` }));

  const redirectUrl = new URL(
    role === "EMPLOYER" ? "/employer/dashboard" : "/candidate/dashboard",
    request.url
  );

  const response = NextResponse.redirect(redirectUrl);

  const maxAge = 30 * 24 * 60 * 60;
  response.cookies.set("sessionToken", session.sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
    path: "/",
  });

  response.cookies.set("userRole", role, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
    path: "/",
  });

  return response;
}
