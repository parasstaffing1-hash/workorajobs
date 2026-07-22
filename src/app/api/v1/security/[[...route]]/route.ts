import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwt } from "@/lib/jwt";
import { MfaService } from "@/lib/security/mfa";
import { RbacGuard } from "@/lib/auth/rbac";

export const dynamic = "force-dynamic";

function getAuthUser(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.substring(7);
  return verifyJwt(token);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ route?: string[] }> }
) {
  const { route } = await params;
  const subPath = route ? route.join("/") : "";
  const authUser = getAuthUser(request);

  if (!authUser || !RbacGuard.isAdmin(authUser.role)) {
    return NextResponse.json({ success: false, error: "Forbidden. Admin access required." }, { status: 403 });
  }

  // 1. GET /api/v1/security/audit-logs
  if (subPath === "audit-logs") {
    const logs = await prisma.auditLog.findMany({
      orderBy: { timestamp: "desc" },
      take: 100,
    });
    return NextResponse.json({ success: true, count: logs.length, logs });
  }

  return NextResponse.json({ success: false, error: `Route GET /api/v1/security/${subPath} not found` }, { status: 404 });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ route?: string[] }> }
) {
  const { route } = await params;
  const subPath = route ? route.join("/") : "";
  const authUser = getAuthUser(request);

  if (!authUser) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  // 1. POST /api/v1/security/mfa/setup
  if (subPath === "mfa/setup") {
    const { secret, otpauthUrl } = MfaService.generateTotpSecret();
    return NextResponse.json({ success: true, secret, otpauthUrl });
  }

  // 2. POST /api/v1/security/mfa/verify
  if (subPath === "mfa/verify") {
    try {
      const body = await request.json();
      const isValid = MfaService.verifyTotpCode(body.secret, body.token);
      if (!isValid) {
        return NextResponse.json({ success: false, error: "Invalid 2FA verification code" }, { status: 400 });
      }

      await prisma.auditLog.create({
        data: { userId: authUser.userId, action: "MFA_VERIFIED_SUCCESSFULLY" },
      });

      return NextResponse.json({ success: true, message: "MFA verified successfully" });
    } catch (e: any) {
      return NextResponse.json({ success: false, error: e?.message || "MFA verification failed" }, { status: 400 });
    }
  }

  return NextResponse.json({ success: false, error: `Route POST /api/v1/security/${subPath} not found` }, { status: 404 });
}
