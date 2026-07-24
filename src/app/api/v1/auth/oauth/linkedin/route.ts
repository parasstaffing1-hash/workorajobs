import { NextRequest, NextResponse } from "next/server";
import { OAuthService } from "@/lib/auth/oauth-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, name, sub, role } = body;

    const userEmail = email || `user.${Date.now()}@linkedin.example.com`;
    const providerAccountId = sub || `linkedin-sub-${Date.now()}`;

    const ipAddress = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || "Browser";

    const result = await OAuthService.authenticateWithProvider(
      {
        provider: "linkedin",
        providerAccountId,
        email: userEmail,
        name: name || userEmail.split("@")[0],
        role: role || "JOB_SEEKER",
      },
      ipAddress,
      userAgent
    );

    const response = NextResponse.json({
      success: true,
      message: "LinkedIn authentication successful.",
      user: result.user,
      token: result.accessToken,
      sessionToken: result.sessionToken,
    });

    response.cookies.set("sessionToken", result.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "LinkedIn authentication failed." },
      { status: 500 }
    );
  }
}
