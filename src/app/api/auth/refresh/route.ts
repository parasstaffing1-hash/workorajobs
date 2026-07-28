import { NextRequest, NextResponse } from "next/server";
import { signJwt } from "@/lib/jwt";
import { SessionStore } from "@/lib/auth/session-store";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json({ success: false, error: "Refresh token is required." }, { status: 400 });
    }

    const session = await SessionStore.getSession(refreshToken);
    if (!session) {
      return NextResponse.json({ success: false, error: "Invalid or expired refresh token." }, { status: 401 });
    }

    const newSession = await SessionStore.createSession({
      userId: session.userId,
      email: session.email,
      role: session.role,
      ipAddress: request.headers.get("x-forwarded-for") ?? session.ipAddress,
      userAgent: request.headers.get("user-agent") ?? "Browser",
      rememberMe: true,
    });
    await SessionStore.revokeSession(refreshToken);

    const newAccessToken = signJwt({ userId: session.userId, email: session.email, role: session.role });

    return NextResponse.json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newSession.sessionToken,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Token rotation failed." }, { status: 401 });
  }
}
