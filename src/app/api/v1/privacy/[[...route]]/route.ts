import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";
import { PrivacyService } from "@/lib/security/privacy-service";

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

  if (!authUser) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  // 1. GET /api/v1/privacy/export (GDPR Data Export)
  if (subPath === "export" || subPath === "") {
    try {
      const dump = await PrivacyService.exportUserData(authUser.userId);
      return NextResponse.json({ success: true, ...dump });
    } catch (e: any) {
      return NextResponse.json({ success: false, error: e?.message || "Export failed" }, { status: 400 });
    }
  }

  return NextResponse.json({ success: false, error: `Route GET /api/v1/privacy/${subPath} not found` }, { status: 404 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ route?: string[] }> }
) {
  const { route } = await params;
  const subPath = route ? route.join("/") : "";
  const authUser = getAuthUser(request);

  if (!authUser) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  // 1. DELETE /api/v1/privacy/account (GDPR Account Deletion)
  if (subPath === "account" || subPath === "") {
    try {
      await PrivacyService.requestAccountDeletion(authUser.userId);
      return NextResponse.json({ success: true, message: "Account deleted and PII anonymized under GDPR compliance." });
    } catch (e: any) {
      return NextResponse.json({ success: false, error: e?.message || "Account deletion failed" }, { status: 400 });
    }
  }

  return NextResponse.json({ success: false, error: `Route DELETE /api/v1/privacy/${subPath} not found` }, { status: 404 });
}
