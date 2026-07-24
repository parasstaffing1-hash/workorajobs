import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth/get-auth-user";
import { AdminAuthService } from "@/lib/admin/admin-auth-service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const adminUserId = await getAuthUserId(request, "ADMIN");
    if (!adminUserId) {
      return NextResponse.json({ success: false, error: "Unauthorized admin access." }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query") || "";
    const role = searchParams.get("role") || "ALL";

    const metrics = await AdminAuthService.getAdminAuthMetrics();
    const users = await AdminAuthService.searchUsers(query, role);

    return NextResponse.json({
      success: true,
      metrics,
      users,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Failed to load admin auth console data." }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminUserId = await getAuthUserId(request, "ADMIN");
    if (!adminUserId) {
      return NextResponse.json({ success: false, error: "Unauthorized admin access." }, { status: 403 });
    }

    const body = await request.json();
    const { action, userId } = body;

    if (!action || !userId) {
      return NextResponse.json({ success: false, error: "Action and Target User ID are required." }, { status: 400 });
    }

    const result = await AdminAuthService.executeAdminAction(action, userId, adminUserId);

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Failed to execute admin action." }, { status: 400 });
  }
}
