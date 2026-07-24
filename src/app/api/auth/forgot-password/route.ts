import { NextRequest, NextResponse } from "next/server";
import { EnterpriseAuthController } from "@/lib/auth/enterprise-auth-controller";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: "Email address is required." }, { status: 400 });
    }

    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    await EnterpriseAuthController.requestPasswordReset(email, ip);

    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, a password reset link has been dispatched.",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Password reset request failed." }, { status: 400 });
  }
}
