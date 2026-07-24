import { NextRequest, NextResponse } from "next/server";
import { EnterpriseAuthController } from "@/lib/auth/enterprise-auth-controller";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json({ success: false, error: "Reset token and new password are required." }, { status: 400 });
    }

    await EnterpriseAuthController.resetPassword(token, password);

    return NextResponse.json({
      success: true,
      message: "Password has been successfully updated. Please sign in with your new password.",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to reset password." }, { status: 400 });
  }
}
