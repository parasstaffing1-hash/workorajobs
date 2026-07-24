import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth/get-auth-user";
import { SessionStore } from "@/lib/auth/session-store";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized access." }, { status: 401 });
    }

    const body = await request.json();
    const { sessionToken } = body;

    if (sessionToken) {
      await SessionStore.revokeSession(sessionToken);
    }

    return NextResponse.json({
      success: true,
      message: "Session has been successfully revoked.",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Failed to revoke session." }, { status: 400 });
  }
}
