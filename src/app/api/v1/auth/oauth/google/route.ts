import { NextRequest, NextResponse } from "next/server";
import { OAuthService } from "@/lib/auth/oauth-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, name, picture, sub, role, credential } = body;

    const userEmail = email || body.email;
    const providerAccountId = sub || body.sub || `google-sub-${Date.now()}`;

    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: "Valid Google email address is required." },
        { status: 400 }
      );
    }

    const ipAddress = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || "Browser";

    const result = await OAuthService.authenticateWithProvider(
      {
        provider: "google",
        providerAccountId,
        email: userEmail,
        name: name || userEmail.split("@")[0],
        picture,
        role: role || (userEmail.includes("employer") ? "EMPLOYER" : "JOB_SEEKER"),
        idToken: credential,
      },
      ipAddress,
      userAgent
    );

    const response = NextResponse.json({
      success: true,
      message: "Google authentication successful.",
      user: result.user,
      token: result.accessToken,
      refreshToken: result.refreshToken,
      sessionToken: result.sessionToken,
    });

    // Set secure HTTPOnly session cookie
    response.cookies.set("sessionToken", result.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Google authentication failed." },
      { status: 500 }
    );
  }
}
