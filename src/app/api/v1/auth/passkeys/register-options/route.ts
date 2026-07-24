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

    const options = await PasskeyService.generateRegistrationOptions(
      userId,
      "user@workorajobs.example.com"
    );

    return NextResponse.json({
      success: true,
      options,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Failed to generate passkey options." }, { status: 400 });
  }
}
