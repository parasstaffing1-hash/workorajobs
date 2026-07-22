import { prisma } from "@/lib/prisma";

export class AdminModerationService {
  /**
   * Submits abuse report for moderation queue
   */
  static async submitAbuseReport(reporterId: string, targetType: "JOB" | "USER" | "COMPANY", targetId: string, reason: string) {
    return prisma.moderationReport.create({
      data: {
        reporterId,
        targetType,
        targetId,
        reason,
        status: "PENDING",
      },
    });
  }

  /**
   * Admin suspends user or company account
   */
  static async suspendUser(adminUserId: string, targetUserId: string, reason: string) {
    await prisma.user.update({
      where: { id: targetUserId },
      data: { deletedAt: new Date() },
    });

    return prisma.auditLog.create({
      data: {
        userId: adminUserId,
        action: `USER_SUSPENDED: ${reason}`,
      },
    });
  }

  /**
   * Admin resolves moderation report
   */
  static async resolveReport(adminUserId: string, reportId: string, status: "RESOLVED" | "DISMISSED", adminNote?: string) {
    return prisma.moderationReport.update({
      where: { id: reportId },
      data: {
        status,
        adminNote,
      },
    });
  }
}
