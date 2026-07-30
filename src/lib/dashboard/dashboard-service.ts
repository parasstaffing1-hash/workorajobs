import { prisma } from "@/lib/prisma";
import { calculateProfileCompletion } from "@/lib/profile/profile-completion";
import { ProfileService } from "@/lib/profile/profile-service";

async function safeDb<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    const res = await fn();
    return res !== null && res !== undefined ? res : fallback;
  } catch (_) {
    return fallback;
  }
}

export class DashboardService {
  /**
   * Fetch complete dashboard dataset for a candidate with Fallback Isolation
   */
  static async getCandidateDashboardData(userId: string) {
    const applications = await safeDb(
      () =>
        prisma.application.findMany({
          where: { applicantId: userId },
          include: {
            job: {
              include: {
                company: {
                  select: { id: true, name: true, logoUrl: true },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        }),
      null
    );

    if (applications !== null) {
      const totalApplied = applications.length;
      const underReview = applications.filter((a) => a.status === "UNDER_REVIEW" || a.status === "SHORTLISTED").length;
      const interviews = applications.filter(
        (a) => a.status === "INTERVIEW_SCHEDULED" || a.status === "INTERVIEW_COMPLETED"
      ).length;
      const offers = applications.filter((a) => a.status === "OFFER_EXTENDED" || a.status === "HIRED").length;
      const rejected = applications.filter((a) => a.status === "REJECTED").length;

      const activeResponses = underReview + interviews + offers + rejected;
      const responseRate = totalApplied > 0 ? Math.round((activeResponses / totalApplied) * 100) : 0;

      const monthlyData: Record<string, { month: string; applications: number; interviews: number }> = {};
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = d.toLocaleString("default", { month: "short" });
        monthlyData[key] = { month: key, applications: 0, interviews: 0 };
      }

      applications.forEach((app) => {
        const monthKey = new Date(app.createdAt).toLocaleString("default", { month: "short" });
        if (monthlyData[monthKey]) {
          monthlyData[monthKey].applications += 1;
          if (app.status.includes("INTERVIEW") || app.status.includes("OFFER")) {
            monthlyData[monthKey].interviews += 1;
          }
        }
      });

      const applicationTrend = Object.values(monthlyData);
      const fullProfile = await ProfileService.getProfileByUserId(userId);
      const profileReport = calculateProfileCompletion(fullProfile);

      const defaultResume = await safeDb(
        () =>
          prisma.resumeRecord.findFirst({
            where: { userId, isDefault: true },
            select: {
              id: true,
              title: true,
              fileName: true,
              fileUrl: true,
              fileSize: true,
              version: true,
              updatedAt: true,
            },
          }),
        null
      );

      const savedJobsRecords = await safeDb(
        () =>
          prisma.savedJob.findMany({
            where: { userId },
            include: {
              job: {
                include: {
                  company: {
                    select: { id: true, name: true, logoUrl: true, headquartersCity: true },
                  },
                },
              },
            },
            take: 5,
            orderBy: { createdAt: "desc" },
          }),
        []
      );

      const savedJobs = savedJobsRecords.map((s: any) => ({
        id: s.job.id,
        title: s.job.title,
        location: s.job.location,
        type: s.job.type,
        workMode: s.job.workMode,
        salary: s.job.salary,
        company: s.job.company,
        savedAt: s.createdAt,
      }));

      return {
        stats: {
          totalApplied,
          underReview,
          interviews,
          offers,
          rejected,
          responseRate,
        },
        applicationTrend,
        recentApplications: applications.slice(0, 5),
        recommendedJobs: [],
        recentlyViewed: [],
        upcomingInterviews: [],
        notifications: [],
        recentActivity: [],
        profileReport,
        defaultResume,
        savedJobs,
      };
    }

    // If the database is unavailable, return an empty, truthful dashboard.
    // Never fabricate production activity or job data.
    const profileReport = {
      score: 0,
      level: "Beginner",
      completedItems: 0,
      totalItems: 13,
      missingItems: [],
    };

    return {
      stats: {
        totalApplied: 0,
        underReview: 0,
        interviews: 0,
        offers: 0,
        rejected: 0,
        responseRate: 0,
      },
      applicationTrend: [],
      recentApplications: [],
      recommendedJobs: [],
      recentlyViewed: [],
      upcomingInterviews: [],
      notifications: [],
      recentActivity: [],
      profileReport,
      defaultResume: null,
      savedJobs: [],
    };
  }
}
