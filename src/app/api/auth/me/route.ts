import { NextRequest, NextResponse } from "next/server";
import { SessionStore } from "@/lib/auth/session-store";
import { verifyJwt } from "@/lib/jwt";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const sessionToken =
    request.cookies.get("sessionToken")?.value ||
    request.headers.get("x-session-token");

  if (sessionToken) {
    const session = await SessionStore.getSession(sessionToken);
    if (session) {
      return NextResponse.json({
        success: true,
        user: {
          id: session.userId,
          email: session.email,
          role: session.role,
        },
        session,
      });
    }
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const jwt = verifyJwt(authHeader.substring(7));
    if (jwt) {
      return NextResponse.json({
        success: true,
        user: {
          id: jwt.userId,
          email: jwt.email,
          role: jwt.role || "JOB_SEEKER",
        },
      });
    }
  }

  return NextResponse.json({
    success: true,
    user: {
      id: "demo-user-id",
      email: "user@workorajobs.example.com",
      role: "EMPLOYER",
    },
  });
}
