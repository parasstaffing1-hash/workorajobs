import { NextRequest, NextResponse } from "next/server";
import { SessionStore } from "@/lib/auth/session-store";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const sessionToken =
    request.cookies.get("sessionToken")?.value ||
    request.headers.get("x-session-token");

  if (sessionToken) {
    await SessionStore.revokeSession(sessionToken);
  }

  const response = NextResponse.json({
    success: true,
    message: "Employer logged out successfully.",
  });

  response.cookies.delete("sessionToken");
  response.cookies.delete("userRole");

  return response;
}
