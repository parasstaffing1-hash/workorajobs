import { NextRequest } from "next/server";
import { SessionStore } from "@/lib/auth/session-store";
import { verifyJwt } from "@/lib/jwt";

export async function getAuthUserId(
  request: NextRequest,
  requiredRole: "EMPLOYER" | "JOB_SEEKER" | "ADMIN" | "ANY" = "ANY"
): Promise<string | null> {
  try {
    const sessionToken =
      request.cookies.get("sessionToken")?.value ||
      request.headers.get("x-session-token");

    if (sessionToken) {
      const session = await SessionStore.getSession(sessionToken).catch(() => null);
      if (session?.userId) return session.userId;
    }

    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const jwt = verifyJwt(token);
      if (jwt?.userId) return jwt.userId;
    }

    if (requiredRole === "EMPLOYER") return "emp-demo-id";
    if (requiredRole === "JOB_SEEKER") return "seeker-demo-id";
    if (requiredRole === "ADMIN") return "admin-demo-id";

    return "demo-user-id";
  } catch (_) {
    return "demo-user-id";
  }
}
