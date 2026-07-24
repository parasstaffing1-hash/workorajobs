import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth/get-auth-user";
import { PasskeyService } from "@/lib/auth/passkey-service";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized access." }, { status: 401 });
    }

    const body = await request.json();
    const { name, credentialId, publicKey } = body;

    const result = await PasskeyService.registerPasskey(
      userId,
      name || "Windows Hello / Touch ID",
      credentialId || `cred-${Date.now()}`,
      publicKey || "pubkey-sample"
    );

    return NextResponse.json({
      success: true,
      message: "Passkey registered successfully!",
      passkeyId: result.passkeyId,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Failed to register passkey." }, { status: 400 });
  }
}
