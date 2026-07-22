import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";
import { WebhookEngine } from "@/lib/webhooks/webhook-engine";
import { prisma } from "@/lib/prisma";

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

  // 1. GET /api/v1/webhooks/logs
  if (subPath === "logs") {
    const logs = await prisma.notificationDeliveryLog.findMany({
      where: { channel: "WEBHOOK" },
      orderBy: { sentAt: "desc" },
      take: 50,
    });
    return NextResponse.json({ success: true, count: logs.length, logs });
  }

  return NextResponse.json({ success: false, error: `Route GET /api/v1/webhooks/${subPath} not found` }, { status: 404 });
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

  // 1. POST /api/v1/webhooks/trigger
  if (subPath === "trigger") {
    try {
      const body = await request.json();
      const result = await WebhookEngine.dispatchEvent(
        body.event || "JOB_CREATED",
        body.data || {},
        body.targetUrl,
        body.secret
      );
      return NextResponse.json({ success: true, result });
    } catch (e: any) {
      return NextResponse.json({ success: false, error: e?.message || "Webhook trigger failed" }, { status: 400 });
    }
  }

  return NextResponse.json({ success: false, error: `Route POST /api/v1/webhooks/${subPath} not found` }, { status: 404 });
}
