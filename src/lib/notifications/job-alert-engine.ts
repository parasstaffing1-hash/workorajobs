import { prisma } from "@/lib/prisma";
import { NotificationChannelDispatcher } from "./channels";

export const AlertFrequency = {
  INSTANT: "INSTANT",
  DAILY: "DAILY",
  WEEKLY: "WEEKLY"
} as const;

export type AlertFrequency = typeof AlertFrequency[keyof typeof AlertFrequency];

export class JobAlertEngine {
  /**
   * Creates a new job alert subscription for user
   */
  static async createAlert(userId: string, data: {
    title: string;
    keywords?: string;
    skills?: string[];
    location?: string;
    workMode?: string;
    minSalary?: number;
    maxSalary?: number;
    experience?: string;
    frequency?: AlertFrequency;
  }) {
    return prisma.jobAlert.create({
      data: {
        userId,
        title: data.title,
        keywords: data.keywords,
        skills: data.skills || [],
        location: data.location,
        workMode: data.workMode,
        minSalary: data.minSalary,
        maxSalary: data.maxSalary,
        experience: data.experience,
        frequency: data.frequency || AlertFrequency.DAILY,
      },
    });
  }

  static async getUserAlerts(userId: string) {
    return prisma.jobAlert.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async deleteAlert(userId: string, alertId: string) {
    return prisma.jobAlert.deleteMany({
      where: { id: alertId, userId },
    });
  }

  /**
   * Matches active jobs against active job alerts and dispatches notifications
   */
  static async matchAndTriggerAlerts(): Promise<{ totalAlertsProcessed: number; notificationsTriggered: number }> {
    const activeAlerts = await prisma.jobAlert.findMany({
      where: { isActive: true },
      include: { user: true },
    });

    let notificationsTriggered = 0;

    for (const alert of activeAlerts) {
      const matchingJobs = await prisma.job.findMany({
        where: {
          deletedAt: null,
          ...(alert.keywords ? { title: { contains: alert.keywords, mode: "insensitive" } } : {}),
          ...(alert.location ? { location: { contains: alert.location, mode: "insensitive" } } : {}),
          ...(alert.workMode ? { workMode: alert.workMode } : {}),
          ...(alert.minSalary ? { salary: { gte: alert.minSalary } } : {}),
        },
        include: { company: true },
        take: 3,
        orderBy: { postedAt: "desc" },
      });

      if (matchingJobs.length > 0) {
        const topJob = matchingJobs[0];
        await NotificationChannelDispatcher.dispatch({
          userId: alert.userId,
          recipientEmail: alert.user.email,
          title: "New Job Alert Match: {{job_title}}",
          message: "{{count}} new jobs matching '{{alert_title}}' including {{job_title}} at {{company}}.",
          variables: {
            alert_title: alert.title,
            count: String(matchingJobs.length),
            job_title: topJob.title,
            company: topJob.company.name,
            location: topJob.location || "Remote",
          },
          channels: ["IN_APP", "EMAIL"],
        });

        await prisma.jobAlert.update({
          where: { id: alert.id },
          data: { lastTriggeredAt: new Date() },
        });

        notificationsTriggered++;
      }
    }

    return { totalAlertsProcessed: activeAlerts.length, notificationsTriggered };
  }
}
