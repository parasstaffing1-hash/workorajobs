import { NextRequest, NextResponse } from "next/server";
import { PasskeyService } from "@/lib/auth/passkey-service";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { credentialId } = body;

    const result = await PasskeyService.verifyPasskeyLogin(credentialId);

    const response = NextResponse.json({
      success: true,
      message: "Passkey authentication successful!",
      user: result.user,
      token: result.token,
    });

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
    return NextResponse.json({ success: false, error: "Passkey login failed." }, { status: 400 });
  }
}
