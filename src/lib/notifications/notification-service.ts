import { prisma } from "@/lib/prisma";

export type NotificationType =
  | "NEW_APPLICANT"
  | "INTERVIEW_REMINDER"
  | "CANDIDATE_MESSAGE"
  | "JOB_EXPIRING"
  | "SUBSCRIPTION_REMINDER"
  | "VERIFICATION_STATUS"
  | "SYSTEM_ALERT"
  | "INFO";

export class NotificationService {
  /**
   * Fetch User Notifications with Unread Count
   */
  static async getNotifications(userId: string, filterUnreadOnly = false) {
    const whereClause: any = { userId };
    if (filterUnreadOnly) {
      whereClause.isRead = false;
    }

    const [unreadCount, notifications] = await Promise.all([
      prisma.notification.count({ where: { userId, isRead: false } }),
      prisma.notification.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
    ]);

    return {
      unreadCount,
      notifications,
    };
  }

  /**
   * Dispatch New Notification to User
   */
  static async createNotification(
    userId: string,
    title: string,
    message: string,
    type: NotificationType = "INFO",
    actionUrl?: string
  ) {
    // Check Notification Preferences
    const prefs = await this.getNotificationPreferences(userId);
    if (!prefs.inAppEnabled) return null;

    return prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        actionUrl,
      },
    });
  }

  /**
   * Mark Single Notification as Read
   */
  static async markNotificationRead(userId: string, notificationId: string) {
    return prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  }

  /**
   * Mark All User Notifications as Read
   */
  static async markAllNotificationsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  /**
   * Delete Notification
   */
  static async deleteNotification(userId: string, notificationId: string) {
    return prisma.notification.deleteMany({
      where: { id: notificationId, userId },
    });
  }

  /**
   * Get User Notification Preferences
   */
  static async getNotificationPreferences(userId: string) {
    let prefs = await prisma.notificationPreference.findUnique({
      where: { userId },
    });

    if (!prefs) {
      prefs = await prisma.notificationPreference.create({
        data: {
          userId,
          emailEnabled: true,
          inAppEnabled: true,
          telegramEnabled: false,
          discordEnabled: false,
        },
      });
    }

    return prefs;
  }

  /**
   * Update Notification Preferences
   */
  static async updateNotificationPreferences(userId: string, data: any) {
    return prisma.notificationPreference.upsert({
      where: { userId },
      update: {
        emailEnabled: data.emailEnabled,
        inAppEnabled: data.inAppEnabled,
        telegramEnabled: data.telegramEnabled,
        discordEnabled: data.discordEnabled,
        telegramChatId: data.telegramChatId,
        discordWebhookUrl: data.discordWebhookUrl,
        quietHoursStart: data.quietHoursStart,
        quietHoursEnd: data.quietHoursEnd,
      },
      create: {
        userId,
        emailEnabled: data.emailEnabled ?? true,
        inAppEnabled: data.inAppEnabled ?? true,
        telegramEnabled: data.telegramEnabled ?? false,
        discordEnabled: data.discordEnabled ?? false,
        telegramChatId: data.telegramChatId,
        discordWebhookUrl: data.discordWebhookUrl,
        quietHoursStart: data.quietHoursStart,
        quietHoursEnd: data.quietHoursEnd,
      },
    });
  }
}
