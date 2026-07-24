import { NextRequest, NextResponse } from "next/server";
import { EnterpriseAuthController } from "@/lib/auth/enterprise-auth-controller";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ success: false, error: "Verification token is required." }, { status: 400 });
    }

    await EnterpriseAuthController.verifyEmail(token);

    return NextResponse.json({
      success: true,
      message: "Email address has been successfully verified!",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Email verification failed." }, { status: 400 });
  }
}
