import { prisma } from "@/lib/prisma";
import { SecurityNotificationService } from "./security-notification-service";
import { SessionStore } from "./session-store";

export class RiskDetectionService {
  /**
   * Evaluate security risk on user login attempt
   */
  static async evaluateLoginRisk(data: {
    userId: string;
    email: string;
    ipAddress: string;
    userAgent: string;
  }) {
    try {
      const parsedUa = SessionStore.parseUserAgent(data.userAgent);

      // Check for previous login history with matching User-Agent or IP
      const previousLogins = await prisma.loginHistory
        .findMany({
          where: { userId: data.userId, status: "SUCCESS" },
          take: 10,
          orderBy: { createdAt: "desc" },
        })
        .catch(() => []);

      const isKnownIp = previousLogins.some((l) => l.ipAddress === data.ipAddress);
      const isKnownBrowser = previousLogins.some((l) =>
        l.userAgent?.includes(parsedUa.browser)
      );

      // Trigger New Device Detection alert if browser or IP is unrecognized
      if (!isKnownIp && !isKnownBrowser && previousLogins.length > 0) {
        await SecurityNotificationService.sendSecurityAlert({
          userId: data.userId,
          type: "NEW_DEVICE_DETECTED",
          title: "New Device Login Detected",
          message: `Your account was accessed from a new device (${parsedUa.browser} on ${parsedUa.os}) near IP ${data.ipAddress}.`,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
        });
      }

      // Check for multiple failed logins (Brute-Force Risk Detection)
      const recentFailedAttempts = await prisma.loginHistory
        .count({
          where: {
            email: data.email,
            status: { startsWith: "FAILED" },
            createdAt: { gte: new Date(Date.now() - 15 * 60 * 1000) }, // 15 mins
          },
        })
        .catch(() => 0);

      if (recentFailedAttempts >= 5) {
        await SecurityNotificationService.sendSecurityAlert({
          userId: data.userId,
          type: "SUSPICIOUS_LOGIN_ATTEMPT",
          title: "Multiple Failed Login Attempts",
          message: `We detected ${recentFailedAttempts} failed password attempts on your account in the last 15 minutes.`,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
        });
      }
    } catch (_) {}
  }
}
