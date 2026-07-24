import { prisma } from "@/lib/prisma";

export type SecurityEventType =
  | "PASSWORD_CHANGED"
  | "EMAIL_CHANGED"
  | "NEW_LOGIN_DETECTED"
  | "NEW_DEVICE_DETECTED"
  | "MFA_ENABLED"
  | "MFA_DISABLED"
  | "ACCOUNT_DELETED"
  | "SUSPICIOUS_LOGIN_ATTEMPT";

export class SecurityNotificationService {
  /**
   * Dispatch security alert notification to user
   */
  static async sendSecurityAlert(data: {
    userId: string;
    type: SecurityEventType;
    title: string;
    message: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    try {
      // 1. Create In-App Notification
      await prisma.notification
        .create({
          data: {
            userId: data.userId,
            title: data.title,
            message: data.message,
            type: "SYSTEM_ALERT",
            isRead: false,
          },
        })
        .catch(() => null);

      // 2. Create Audit Log Entry
      await prisma.auditLog
        .create({
          data: {
            userId: data.userId,
            action: `SECURITY_ALERT:${data.type}`,
            ipAddress: data.ipAddress || "127.0.0.1",
            userAgent: data.userAgent || "Browser",
          },
        })
        .catch(() => null);
    } catch (_) {}
  }
}
