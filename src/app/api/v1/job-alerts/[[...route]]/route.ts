import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";
import { JobAlertEngine } from "@/lib/notifications/job-alert-engine";

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
  const authUser = getAuthUser(request);

  if (!authUser) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const alerts = await JobAlertEngine.getUserAlerts(authUser.userId);
  return NextResponse.json({ success: true, count: alerts.length, alerts });
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

  // 1. POST /api/v1/job-alerts/trigger (Trigger batch matching)
  if (subPath === "trigger") {
    const result = await JobAlertEngine.matchAndTriggerAlerts();
    return NextResponse.json({ success: true, message: "Job alert matching executed.", ...result });
  }

  // 2. POST /api/v1/job-alerts (Create new alert)
  if (subPath === "") {
    try {
      const body = await request.json();
      const alert = await JobAlertEngine.createAlert(authUser.userId, body);
      return NextResponse.json({ success: true, alert }, { status: 201 });
    } catch (e: any) {
      return NextResponse.json({ success: false, error: e?.message || "Failed to create job alert" }, { status: 400 });
    }
  }

  return NextResponse.json({ success: false, error: `Route POST /api/v1/job-alerts/${subPath} not found` }, { status: 404 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ route?: string[] }> }
) {
  const { route } = await params;
  const alertId = route ? route[0] : "";
  const authUser = getAuthUser(request);

  if (!authUser) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await JobAlertEngine.deleteAlert(authUser.userId, alertId);
  return NextResponse.json({ success: true, message: "Job alert deleted successfully" });
}
