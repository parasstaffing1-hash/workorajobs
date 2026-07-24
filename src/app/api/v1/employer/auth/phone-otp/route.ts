import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwt } from "@/lib/jwt";
import { SessionStore } from "@/lib/auth/session-store";
import { EmployerAuthService } from "@/lib/auth/employer-auth-service";

export const dynamic = "force-dynamic";

async function getAuthUserId(request: NextRequest): Promise<string | null> {
  const sessionToken =
    request.cookies.get("sessionToken")?.value ||
    request.headers.get("x-session-token");

  if (sessionToken) {
    const session = await SessionStore.getSession(sessionToken);
    if (session) return session.userId;
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    const jwt = verifyJwt(token);
    if (jwt) return jwt.userId;
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, otpCode } = body;

    if (action === "send") {
      const result = await EmployerAuthService.sendPhoneOtp(userId);
      return NextResponse.json({
        success: true,
        message: "SMS OTP sent successfully to registered employer phone.",
        demoOtpCode: result.otpCode,
      });
    }

    if (action === "verify") {
      if (!otpCode || otpCode.length !== 6) {
        return NextResponse.json({ success: false, error: "Please enter a valid 6-digit OTP code." }, { status: 400 });
      }

      await EmployerAuthService.verifyPhoneOtp(userId, otpCode);
      return NextResponse.json({
        success: true,
        message: "Phone number verified successfully!",
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action type." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Phone OTP operation failed." },
      { status: 400 }
    );
  }
}
