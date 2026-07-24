import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const secret = crypto.randomBytes(20).toString("hex").toUpperCase();
    const backupCodes = Array.from({ length: 8 }, () =>
      crypto.randomBytes(4).toString("hex").toUpperCase()
    );

    const qrCodeUrl = `otpauth://totp/WorkoraJobs:EnterpriseUser?secret=${secret}&issuer=WorkoraJobs`;

    return NextResponse.json({
      success: true,
      secret,
      qrCodeUrl,
      backupCodes,
      message: "Scan the QR code in your Authenticator app (Google Authenticator, Authy, or 1Password).",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "MFA setup failed." }, { status: 400 });
  }
}
