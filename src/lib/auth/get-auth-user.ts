import { NextRequest } from "next/server";
import { SessionStore } from "@/lib/auth/session-store";
import { verifyJwt } from "@/lib/jwt";

export async function getAuthUserId(
  request: NextRequest,
  requiredRole: "EMPLOYER" | "JOB_SEEKER" | "ADMIN" | "ANY" = "ANY"
): Promise<string | null> {
  try {
    // 1. Check session cookie or header
    const sessionToken =
      request.cookies.get("sessionToken")?.value ||
      request.headers.get("x-session-token");

    if (sessionToken) {
      const session = await SessionStore.getSession(sessionToken).catch(() => null);
      if (session?.userId) {
        if (requiredRole !== "ANY" && session.role !== requiredRole && session.role !== "ADMIN") {
          return null; // Role mismatch
        }
        return session.userId;
      }
    }

    // 2. Check Bearer JWT Header
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const jwt = verifyJwt(token);
      if (jwt?.userId) {
        if (requiredRole !== "ANY" && jwt.role !== requiredRole && jwt.role !== "ADMIN") {
          return null; // Role mismatch
        }
        return jwt.userId;
      }
    }

    // Unauthenticated
    return null;
  } catch (_) {
    return null;
  }
}
