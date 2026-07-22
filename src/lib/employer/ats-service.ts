import { prisma } from "@/lib/prisma";
import { ApplicationStatus, EmployerUserRole } from "@prisma/client";

export class EmployerAtsService {
  // 1. Multi-tenant Tenant Isolation & Authorization Guard
  static async verifyEmployerAccess(userId: string, companyId?: string): Promise<{
    companyId: string;
    role: EmployerUserRole | "OWNER";
  }> {
    // Check if user is company owner directly
    let company = await prisma.company.findFirst({
      where: {
        ...(companyId ? { id: companyId } : {}),
        ownerId: userId,
        deletedAt: null,
      },
    });

    if (company) {
      return { companyId: company.id, role: "OWNER" };
    }

    // Check CompanyUser team membership
    const companyUser = await prisma.companyUser.findFirst({
      where: {
        userId,
        ...(companyId ? { companyId } : {}),
      },
      include: { company: true },
    });

    if (!companyUser || companyUser.company.deletedAt) {
      throw new Error("Forbidden. You do not have access to this employer workspace.");
    }

    return { companyId: companyUser.companyId, role: companyUser.role };
  }

  // 2. Company Profile Management
  static async getCompanyProfile(userId: string) {
    const { companyId } = await this.verifyEmployerAccess(userId);
    return prisma.company.findUnique({
      where: { id: companyId },
      include: {
        companyUsers: { include: { user: { select: { id: true, name: true, email: true } } } },
        _count: { select: { jobs: true } },
      },
    });
  }

  static async updateCompanyProfile(userId: string, data: {
    name?: string;
    description?: string;
    websiteUrl?: string;
    logoUrl?: string;
    domain?: string;
  }) {
    const { companyId, role } = await this.verifyEmployerAccess(userId);

    if (role !== "OWNER" && role !== "ADMIN") {
      throw new Error("Forbidden. Only company owners and admins can update company profiles.");
    }

    return prisma.company.update({
      where: { id: companyId },
      data,
    });
  }

  // 3. Job Lifecycle Management
  static async createJob(userId: string, data: {
    title: string;
    description: string;
    location?: string;
    salary?: number;
    type?: any;
    workMode?: string;
    experience?: string;
  }) {
    const { companyId, role } = await this.verifyEmployerAccess(userId);

    if (role === "VIEWER") {
      throw new Error("Forbidden. Viewers cannot post jobs.");
    }

    return prisma.job.create({
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        salary: data.salary,
        type: data.type || "FULL_TIME",
        workMode: data.workMode || "Remote",
        experience: data.experience || "Mid Level",
        companyId,
        postedById: userId,
      },
    });
  }

  static async updateJob(userId: string, jobId: string, data: Partial<{
    title: string;
    description: string;
    location: string;
    salary: number;
    type: any;
    workMode: string;
    experience: string;
  }>) {
    const { companyId, role } = await this.verifyEmployerAccess(userId);

    if (role === "VIEWER") {
      throw new Error("Forbidden. Viewers cannot edit jobs.");
    }

    const job = await prisma.job.findFirst({
      where: { id: jobId, companyId, deletedAt: null },
    });

    if (!job) {
      throw new Error("Job not found or access denied.");
    }

    return prisma.job.update({
      where: { id: jobId },
      data,
    });
  }

  static async deleteJob(userId: string, jobId: string) {
    const { companyId, role } = await this.verifyEmployerAccess(userId);

    if (role !== "OWNER" && role !== "ADMIN") {
      throw new Error("Forbidden. Only company owners or admins can delete jobs.");
    }

    return prisma.job.update({
      where: { id: jobId, companyId },
      data: { deletedAt: new Date() },
    });
  }

  // 4. Kanban Pipeline Stage Movement & Applicant Tracking
  static async updateApplicationStage(userId: string, applicationId: string, newStage: ApplicationStatus, note?: string) {
    const app = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true },
    });

    if (!app) {
      throw new Error("Application not found.");
    }

    await this.verifyEmployerAccess(userId, app.job.companyId);

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: { status: newStage },
    });

    // Audit History Log
    await prisma.applicationStatusHistory.create({
      data: {
        applicationId,
        fromStatus: app.status,
        toStatus: newStage,
        note: note || `Candidate moved to stage ${newStage}`,
        changedById: userId,
      },
    });

    // Notify Candidate
    await prisma.notification.create({
      data: {
        userId: app.applicantId,
        title: "Application Pipeline Update",
        message: `Your application for ${app.job.title} has progressed to ${newStage}.`,
        type: "INFO",
      },
    });

    return updated;
  }

  // 5. Interview Scheduling
  static async scheduleInterview(userId: string, data: {
    applicationId: string;
    title: string;
    scheduledAt: string;
    durationMins?: number;
    locationUrl?: string;
    notes?: string;
  }) {
    const app = await prisma.application.findUnique({
      where: { id: data.applicationId },
      include: { job: true },
    });

    if (!app) {
      throw new Error("Application not found.");
    }

    await this.verifyEmployerAccess(userId, app.job.companyId);

    const interview = await prisma.interview.create({
      data: {
        applicationId: data.applicationId,
        title: data.title,
        scheduledAt: new Date(data.scheduledAt),
        durationMins: data.durationMins || 45,
        locationUrl: data.locationUrl,
        notes: data.notes,
      },
    });

    // Update Application Stage automatically
    await prisma.application.update({
      where: { id: data.applicationId },
      data: { status: ApplicationStatus.INTERVIEW_SCHEDULED },
    });

    return interview;
  }

  // 6. Ratings & Candidate Notes
  static async addCandidateNote(userId: string, applicationId: string, content: string) {
    const app = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true },
    });

    if (!app) {
      throw new Error("Application not found.");
    }

    await this.verifyEmployerAccess(userId, app.job.companyId);

    return prisma.candidateNote.create({
      data: {
        applicationId,
        candidateId: app.applicantId,
        authorId: userId,
        content,
      },
    });
  }

  static async addCandidateRating(userId: string, applicationId: string, rating: number, feedback?: string) {
    const app = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true },
    });

    if (!app) {
      throw new Error("Application not found.");
    }

    await this.verifyEmployerAccess(userId, app.job.companyId);

    return prisma.candidateRating.create({
      data: {
        applicationId,
        authorId: userId,
        rating,
        feedback,
      },
    });
  }

  // 7. Employer Dashboard Analytics
  static async getDashboardMetrics(userId: string) {
    const { companyId } = await this.verifyEmployerAccess(userId);

    const openJobsCount = await prisma.job.count({
      where: { companyId, deletedAt: null },
    });

    const activeApplicantsCount = await prisma.application.count({
      where: {
        job: { companyId },
        status: { notIn: [ApplicationStatus.REJECTED, ApplicationStatus.WITHDRAWN] },
      },
    });

    const interviewsToday = await prisma.interview.count({
      where: {
        application: { job: { companyId } },
        scheduledAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });

    const offersSent = await prisma.application.count({
      where: {
        job: { companyId },
        status: ApplicationStatus.OFFER_EXTENDED,
      },
    });

    return {
      openJobsCount,
      activeApplicantsCount,
      interviewsToday,
      offersSent,
      hiringFunnel: {
        applied: await prisma.application.count({ where: { job: { companyId }, status: ApplicationStatus.APPLIED } }),
        underReview: await prisma.application.count({ where: { job: { companyId }, status: ApplicationStatus.UNDER_REVIEW } }),
        shortlisted: await prisma.application.count({ where: { job: { companyId }, status: ApplicationStatus.SHORTLISTED } }),
        interviewing: await prisma.application.count({ where: { job: { companyId }, status: ApplicationStatus.INTERVIEW_SCHEDULED } }),
        hired: await prisma.application.count({ where: { job: { companyId }, status: ApplicationStatus.HIRED } }),
      },
    };
  }
}
