import { NextRequest, NextResponse } from "next/server";
import { signJwt } from "@/lib/jwt";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json({ success: false, error: "Refresh token is required." }, { status: 400 });
    }

    const newAccessToken = signJwt({ userId: "demo-user-id", email: "user@example.com", role: "JOB_SEEKER" });
    const newRefreshToken = crypto.randomBytes(40).toString("hex");

    return NextResponse.json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Token rotation failed." }, { status: 401 });
  }
}
