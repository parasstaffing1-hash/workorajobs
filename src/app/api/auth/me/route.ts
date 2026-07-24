import { NextRequest, NextResponse } from "next/server";
import { SessionStore } from "@/lib/auth/session-store";
import { verifyJwt } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const sessionToken =
    request.cookies.get("sessionToken")?.value ||
    request.headers.get("x-session-token");

  if (sessionToken) {
    const session = await SessionStore.getSession(sessionToken).catch(() => null);
    if (session) {
      const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { id: true, email: true, name: true, role: true, isEmailVerified: true },
      }).catch(() => null);

      return NextResponse.json({
        success: true,
        user: user || {
          id: session.userId,
          email: session.email,
          role: session.role,
        },
      });
    }
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const jwt = verifyJwt(authHeader.substring(7));
    if (jwt) {
      const user = await prisma.user.findUnique({
        where: { id: jwt.userId },
        select: { id: true, email: true, name: true, role: true, isEmailVerified: true },
      }).catch(() => null);

      return NextResponse.json({
        success: true,
        user: user || {
          id: jwt.userId,
          email: jwt.email,
          role: jwt.role || "JOB_SEEKER",
        },
      });
    }
  }

  return NextResponse.json(
    {
      success: false,
      message: "Unauthenticated",
      error: "Authentication required",
    },
    { status: 401 }
  );
}
