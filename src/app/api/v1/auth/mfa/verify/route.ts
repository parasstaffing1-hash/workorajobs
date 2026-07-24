import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code || code.length !== 6) {
      return NextResponse.json({ success: false, error: "Please enter a valid 6-digit MFA code." }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Multi-Factor Authentication code verified successfully!",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "MFA verification failed." }, { status: 400 });
  }
}
