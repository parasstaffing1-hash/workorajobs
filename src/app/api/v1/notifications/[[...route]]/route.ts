import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwt } from "@/lib/jwt";
import { NotificationChannelDispatcher } from "@/lib/notifications/channels";

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

  // 1. GET /api/v1/notifications/preferences
  if (subPath === "preferences") {
    const pref = await prisma.notificationPreference.findUnique({
      where: { userId: authUser.userId },
    });
    return NextResponse.json({ success: true, preference: pref });
  }

  // 2. GET /api/v1/notifications
  if (subPath === "") {
    const notifications = await prisma.notification.findMany({
      where: { userId: authUser.userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    const unreadCount = await prisma.notification.count({
      where: { userId: authUser.userId, isRead: false },
    });
    return NextResponse.json({ success: true, unreadCount, count: notifications.length, notifications });
  }

  return NextResponse.json({ success: false, error: `Route GET /api/v1/notifications/${subPath} not found` }, { status: 404 });
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

  // 1. POST /api/v1/notifications/send
  if (subPath === "send") {
    try {
      const body = await request.json();
      const result = await NotificationChannelDispatcher.dispatch({
        userId: body.userId || authUser.userId,
        recipientEmail: body.recipientEmail,
        title: body.title,
        message: body.message,
        variables: body.variables,
        channels: body.channels,
      });
      return NextResponse.json({ success: true, result });
    } catch (e: any) {
      return NextResponse.json({ success: false, error: e?.message || "Failed to send notification" }, { status: 400 });
    }
  }

  return NextResponse.json({ success: false, error: `Route POST /api/v1/notifications/${subPath} not found` }, { status: 404 });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ route?: string[] }> }
) {
  const { route } = await params;
  const subPath = route ? route.join("/") : "";
  const authUser = getAuthUser(request);

  if (!authUser) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  // 1. PATCH /api/v1/notifications/read (Mark all or single as read)
  if (subPath === "read") {
    const body = await request.json().catch(() => ({}));
    if (body.notificationId) {
      await prisma.notification.updateMany({
        where: { id: body.notificationId, userId: authUser.userId },
        data: { isRead: true },
      });
    } else {
      await prisma.notification.updateMany({
        where: { userId: authUser.userId, isRead: false },
        data: { isRead: true },
      });
    }
    return NextResponse.json({ success: true, message: "Notifications marked as read" });
  }

  return NextResponse.json({ success: false, error: `Route PATCH /api/v1/notifications/${subPath} not found` }, { status: 404 });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ route?: string[] }> }
) {
  const { route } = await params;
  const subPath = route ? route.join("/") : "";
  const authUser = getAuthUser(request);

  if (!authUser) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  // 1. PUT /api/v1/notifications/preferences
  if (subPath === "preferences") {
    const body = await request.json();
    const updated = await prisma.notificationPreference.upsert({
      where: { userId: authUser.userId },
      create: { userId: authUser.userId, ...body },
      update: body,
    });
    return NextResponse.json({ success: true, preference: updated });
  }

  return NextResponse.json({ success: false, error: `Route PUT /api/v1/notifications/${subPath} not found` }, { status: 404 });
}
