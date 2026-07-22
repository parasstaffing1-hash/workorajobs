import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";
import { AnalyticsService } from "@/lib/analytics/analytics-service";
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

  // 1. GET /api/v1/analytics/admin (Admin only)
  if (subPath === "admin") {
    if (!authUser || !RbacGuard.isAdmin(authUser.role)) {
      return NextResponse.json({ success: false, error: "Forbidden. Admin access required." }, { status: 403 });
    }
    const metrics = await AnalyticsService.getAdminMetrics();
    return NextResponse.json({ success: true, metrics });
  }

  // 2. GET /api/v1/analytics/employer
  if (subPath === "employer") {
    if (!authUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    try {
      const metrics = await AnalyticsService.getEmployerMetrics(authUser.userId);
      return NextResponse.json({ success: true, metrics });
    } catch (e: any) {
      return NextResponse.json({ success: false, error: e?.message || "Employer analytics error" }, { status: 400 });
    }
  }

  // 3. GET /api/v1/analytics/user
  if (subPath === "user") {
    if (!authUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const metrics = await AnalyticsService.getCandidateMetrics(authUser.userId);
    return NextResponse.json({ success: true, metrics });
  }

  // 4. GET /api/v1/analytics/reports?type=JOBS
  if (subPath === "reports") {
    const { searchParams } = new URL(request.url);
    const type = (searchParams.get("type") as any) || "JOBS";
    const csvContent = await AnalyticsService.generateCsvReport(type);
    
    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="workorajobs-${type.toLowerCase()}-report.csv"`,
      },
    });
  }

  return NextResponse.json({ success: false, error: `Route GET /api/v1/analytics/${subPath} not found` }, { status: 404 });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ route?: string[] }> }
) {
  const { route } = await params;
  const subPath = route ? route.join("/") : "";
  const authUser = getAuthUser(request);

  // 1. POST /api/v1/analytics/track
  if (subPath === "track") {
    try {
      const body = await request.json();
      const ip = request.headers.get("x-forwarded-for") || undefined;
      const ua = request.headers.get("user-agent") || undefined;

      const event = await AnalyticsService.trackEvent({
        eventType: body.eventType,
        userId: authUser?.userId || body.userId,
        entityId: body.entityId,
        metadata: body.metadata,
        ipAddress: ip,
        userAgent: ua,
      });

      return NextResponse.json({ success: true, event }, { status: 201 });
    } catch (e: any) {
      return NextResponse.json({ success: false, error: e?.message || "Failed to track event" }, { status: 400 });
    }
  }

  return NextResponse.json({ success: false, error: `Route POST /api/v1/analytics/${subPath} not found` }, { status: 404 });
}
