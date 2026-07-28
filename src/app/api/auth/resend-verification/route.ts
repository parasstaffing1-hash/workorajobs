import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/auth/auth-service";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: "Email address is required." }, { status: 400 });
    }

    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const result = await AuthService.resendVerificationEmail(email, ip);

    return NextResponse.json({
      success: true,
      message: "Verification email has been re-sent.",
      ...(process.env.NODE_ENV !== "production" &&
        "verificationToken" in result && {
          verificationToken: result.verificationToken,
        }),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Failed to resend verification email." }, { status: 400 });
  }
}
