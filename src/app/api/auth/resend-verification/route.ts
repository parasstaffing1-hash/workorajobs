import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: "Email address is required." }, { status: 400 });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    return NextResponse.json({
      success: true,
      message: "Verification email has been re-sent.",
      verificationToken,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Failed to resend verification email." }, { status: 400 });
  }
}
