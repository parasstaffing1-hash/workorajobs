import { NextRequest, NextResponse } from "next/server";
import { NotificationService } from "@/lib/notifications/notification-service";
import { getAuthUserId } from "@/lib/auth/get-auth-user";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const unreadOnly = searchParams.get("unread") === "true";

    const data = await NotificationService.getNotifications(userId, unreadOnly);
    return NextResponse.json({ success: true, ...data });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch notifications" },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, notificationId, title, message, type, actionUrl } = body;

    if (action === "mark_read") {
      await NotificationService.markNotificationRead(userId, notificationId);
      return NextResponse.json({ success: true, message: "Notification marked read" });
    }

    if (action === "mark_all_read") {
      await NotificationService.markAllNotificationsRead(userId);
      return NextResponse.json({ success: true, message: "All notifications marked read" });
    }

    if (action === "delete") {
      await NotificationService.deleteNotification(userId, notificationId);
      return NextResponse.json({ success: true, message: "Notification deleted" });
    }

    if (action === "send") {
      const notification = await NotificationService.createNotification(userId, title, message, type, actionUrl);
      return NextResponse.json({ success: true, message: "Notification dispatched", notification });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Notification action failed" },
      { status: 400 }
    );
  }
}
