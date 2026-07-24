import { NextRequest, NextResponse } from "next/server";
import { SessionStore } from "@/lib/auth/session-store";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const sessionToken =
    request.cookies.get("sessionToken")?.value ||
    request.headers.get("x-session-token");

  if (sessionToken) {
    await SessionStore.revokeSession(sessionToken).catch(() => null);
  }

  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully.",
  });

  response.cookies.set("sessionToken", "", { maxAge: 0, path: "/" });
  response.cookies.set("userRole", "", { maxAge: 0, path: "/" });

  return response;
}
