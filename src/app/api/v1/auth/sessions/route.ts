import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth/get-auth-user";
import { SessionStore } from "@/lib/auth/session-store";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized access." }, { status: 401 });
    }

    const currentSessionToken = request.cookies.get("sessionToken")?.value;
    const sessions = await SessionStore.getUserSessions(userId, currentSessionToken);

    return NextResponse.json({
      success: true,
      sessions,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Failed to fetch active sessions." }, { status: 400 });
  }
}
