import { NextRequest, NextResponse } from "next/server";
import { EnterpriseAuthController } from "@/lib/auth/enterprise-auth-controller";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || "";

    const result = await EnterpriseAuthController.signup(body, ip, userAgent);

    const response = NextResponse.json(
      {
        success: true,
        message: "Registration successful!",
        user: result.user,
        token: result.accessToken,
        sessionToken: result.sessionToken,
        verificationToken: result.verificationToken,
      },
      { status: 201 }
    );

    const maxAge = 30 * 24 * 60 * 60;
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

    return response;
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    const errorMessage = err.message || "Registration failed.";
    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        error: errorMessage,
      },
      { status: statusCode }
    );
  }
}
