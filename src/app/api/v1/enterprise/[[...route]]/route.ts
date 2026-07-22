import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";
import { RbacGuard } from "@/lib/auth/rbac";
import { EmployerVerificationService } from "@/lib/enterprise/verification";
import { JobQualityEngine } from "@/lib/enterprise/quality-engine";
import { FeatureFlagEngine } from "@/lib/enterprise/feature-flags";
import { RecommendationEngine } from "@/lib/enterprise/recommendation-engine";
import { BackgroundTaskQueue } from "@/lib/enterprise/background-jobs";
import { AdminModerationService } from "@/lib/enterprise/moderation";

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

  // 1. GET /api/v1/enterprise/recommendations
  if (subPath === "recommendations") {
    if (!authUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const jobs = await RecommendationEngine.getPersonalizedJobRecommendations(authUser.userId);
    return NextResponse.json({ success: true, count: jobs.length, jobs });
  }

  // 2. GET /api/v1/enterprise/quality/:jobId
  if (subPath.startsWith("quality/")) {
    const jobId = subPath.split("/")[1];
    const quality = await JobQualityEngine.evaluateJobQuality(jobId);
    return NextResponse.json({ success: true, quality });
  }

  return NextResponse.json({ success: false, error: `Route GET /api/v1/enterprise/${subPath} not found` }, { status: 404 });
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

  try {
    const body = await request.json();

    // 1. POST /api/v1/enterprise/verification/request
    if (subPath === "verification/request") {
      const res = await EmployerVerificationService.submitVerificationRequest(body.companyId, body.businessEmail, body.documentsUrl);
      return NextResponse.json({ success: true, verification: res });
    }

    // 2. POST /api/v1/enterprise/verification/approve (Admin only)
    if (subPath === "verification/approve") {
      if (!RbacGuard.isAdmin(authUser.role)) {
        return NextResponse.json({ success: false, error: "Forbidden. Admin access required." }, { status: 403 });
      }
      const res = await EmployerVerificationService.updateVerificationStatus(authUser.userId, body.companyId, body.status, body.notes);
      return NextResponse.json({ success: true, verification: res });
    }

    // 3. POST /api/v1/enterprise/feature-flags (Admin only)
    if (subPath === "feature-flags") {
      if (!RbacGuard.isAdmin(authUser.role)) {
        return NextResponse.json({ success: false, error: "Forbidden. Admin access required." }, { status: 403 });
      }
      const flag = await FeatureFlagEngine.setFeatureFlag(body);
      return NextResponse.json({ success: true, flag });
    }

    // 4. POST /api/v1/enterprise/queue/process (Admin or Cron)
    if (subPath === "queue/process") {
      const result = await BackgroundTaskQueue.processPendingTasks();
      return NextResponse.json({ success: true, result });
    }

    // 5. POST /api/v1/enterprise/moderation/report
    if (subPath === "moderation/report") {
      const report = await AdminModerationService.submitAbuseReport(authUser.userId, body.targetType, body.targetId, body.reason);
      return NextResponse.json({ success: true, report });
    }

    return NextResponse.json({ success: false, error: `Route POST /api/v1/enterprise/${subPath} not found` }, { status: 404 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || "Enterprise Action Failed" }, { status: 400 });
  }
}
