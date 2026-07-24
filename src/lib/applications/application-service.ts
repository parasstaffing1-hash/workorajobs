import { prisma } from "@/lib/prisma";
import { ApplicationStatus } from "@prisma/client";

export class ApplicationService {
  /**
   * Apply to a job with selected resume and optional cover letter & screening answers
   */
  static async applyToJob(data: {
    applicantId: string;
    jobId: string;
    resumeRecordId?: string;
    coverLetter?: string;
    answers?: Record<string, any>;
    isOneClick?: boolean;
  }) {
    // 1. Verify Job exists
    const job = await prisma.job.findUnique({
      where: { id: data.jobId },
      include: { company: true },
    });

    if (!job || job.deletedAt) {
      throw new Error("Job posting not found or is no longer accepting applications.");
    }

    // 2. Check duplicate application
    const existing = await prisma.application.findUnique({
      where: {
        applicantId_jobId: {
          applicantId: data.applicantId,
          jobId: data.jobId,
        },
      },
    });

    if (existing) {
      throw new Error(`You have already applied for "${job.title}". Check your Application History dashboard.`);
    }

    // 3. Resolve Resume
    let resumeUrl: string | undefined;
    let resumeRecordId = data.resumeRecordId;

    if (resumeRecordId) {
      const rec = await prisma.resumeRecord.findUnique({ where: { id: resumeRecordId } });
      if (rec) resumeUrl = rec.fileUrl;
    }

    if (!resumeUrl) {
      // Fallback to user default resume
      const defaultRec = await prisma.resumeRecord.findFirst({
        where: { userId: data.applicantId, isDefault: true },
      });
      if (defaultRec) {
        resumeRecordId = defaultRec.id;
        resumeUrl = defaultRec.fileUrl;
      } else {
        const userProfile = await prisma.userProfile.findUnique({ where: { userId: data.applicantId } });
        resumeUrl = userProfile?.resumeUrl || undefined;
      }
    }

    // 4. Create Application and Initial Status History Record
    const application = await prisma.application.create({
      data: {
        applicantId: data.applicantId,
        jobId: data.jobId,
        resumeRecordId,
        resumeUrl,
        coverLetter: data.coverLetter?.trim() || null,
        answers: data.answers || undefined,
        isOneClick: !!data.isOneClick,
        status: "APPLIED",
        statusHistory: {
          create: {
            fromStatus: "APPLIED",
            toStatus: "APPLIED",
            note: data.isOneClick ? "Applied via 1-Click Instant Application" : "Application submitted by candidate",
          },
        },
      },
      include: {
        job: { include: { company: true } },
        statusHistory: true,
      },
    });

    // 5. Create Audit Log
    await prisma.auditLog.create({
      data: {
        userId: data.applicantId,
        action: `JOB_APPLICATION_SUBMITTED:${job.title}:${data.jobId}`,
      },
    });

    return application;
  }

  /**
   * One-Click Instant Application utilizing candidate's primary default resume
   */
  static async oneClickApply(applicantId: string, jobId: string) {
    const defaultResume = await prisma.resumeRecord.findFirst({
      where: { userId: applicantId, isDefault: true },
    });

    if (!defaultResume) {
      throw new Error("No default resume found. Please upload a resume and mark it as primary default to use 1-Click Apply.");
    }

    return this.applyToJob({
      applicantId,
      jobId,
      resumeRecordId: defaultResume.id,
      isOneClick: true,
    });
  }

  /**
   * Fetch candidate applications history with timeline and job info
   */
  static async getCandidateApplications(applicantId: string, statusFilter?: string) {
    const whereClause: any = { applicantId };

    if (statusFilter && statusFilter !== "ALL") {
      whereClause.status = statusFilter as ApplicationStatus;
    }

    const applications = await prisma.application.findMany({
      where: whereClause,
      include: {
        job: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                logoUrl: true,
                industry: true,
                headquartersCity: true,
              },
            },
          },
        },
        resumeRecord: {
          select: {
            id: true,
            title: true,
            fileName: true,
            fileUrl: true,
          },
        },
        statusHistory: {
          orderBy: { createdAt: "desc" },
        },
        notes: {
          select: { id: true, createdAt: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return applications.map((app) => ({
      id: app.id,
      status: app.status,
      appliedAt: app.createdAt,
      updatedAt: app.updatedAt,
      isOneClick: app.isOneClick,
      coverLetter: app.coverLetter,
      withdrawalReason: app.withdrawalReason,
      job: {
        id: app.job.id,
        title: app.job.title,
        location: app.job.location,
        type: app.job.type,
        workMode: app.job.workMode,
        salary: app.job.salary,
        company: app.job.company,
      },
      resume: app.resumeRecord || (app.resumeUrl ? { fileUrl: app.resumeUrl, fileName: "Uploaded Resume" } : null),
      timeline: app.statusHistory.map((h) => ({
        id: h.id,
        fromStatus: h.fromStatus,
        toStatus: h.toStatus,
        note: h.note,
        createdAt: h.createdAt,
      })),
      employerNotesCount: app.notes.length,
    }));
  }

  /**
   * Withdraw an active application
   */
  static async withdrawApplication(applicationId: string, applicantId: string, reason?: string) {
    const app = await prisma.application.findFirst({
      where: { id: applicationId, applicantId },
    });

    if (!app) {
      throw new Error("Application not found or unauthorized.");
    }

    if (app.status === "WITHDRAWN") {
      throw new Error("Application has already been withdrawn.");
    }

    const previousStatus = app.status;

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: "WITHDRAWN",
        withdrawalReason: reason?.trim() || "Candidate requested withdrawal",
        statusHistory: {
          create: {
            fromStatus: previousStatus,
            toStatus: "WITHDRAWN",
            note: reason ? `Withdrawal reason: ${reason}` : "Withdrawn by candidate",
          },
        },
      },
      include: { statusHistory: { orderBy: { createdAt: "desc" } } },
    });

    await prisma.auditLog.create({
      data: {
        userId: applicantId,
        action: `JOB_APPLICATION_WITHDRAWN:${applicationId}`,
      },
    });

    return updated;
  }

  /**
   * Update Application Status (Recruiter / Admin Funnel Workflow)
   */
  static async updateApplicationStatus(data: {
    applicationId: string;
    newStatus: ApplicationStatus;
    changedById?: string;
    note?: string;
  }) {
    const app = await prisma.application.findUnique({
      where: { id: data.applicationId },
    });

    if (!app) {
      throw new Error("Application not found.");
    }

    const previousStatus = app.status;

    const updated = await prisma.application.update({
      where: { id: data.applicationId },
      data: {
        status: data.newStatus,
        statusHistory: {
          create: {
            fromStatus: previousStatus,
            toStatus: data.newStatus,
            note: data.note || `Status updated from ${previousStatus} to ${data.newStatus}`,
            changedById: data.changedById,
          },
        },
      },
      include: { statusHistory: { orderBy: { createdAt: "desc" } } },
    });

    await prisma.auditLog.create({
      data: {
        userId: data.changedById || app.applicantId,
        action: `JOB_APPLICATION_STATUS_CHANGED:${data.applicationId}:${previousStatus}->${data.newStatus}`,
      },
    });

    return updated;
  }

  /**
   * Add Employer Private Note to Application
   */
  static async addEmployerNote(data: {
    applicationId: string;
    authorId: string;
    content: string;
  }) {
    const app = await prisma.application.findUnique({
      where: { id: data.applicationId },
    });

    if (!app) throw new Error("Application not found.");

    return prisma.candidateNote.create({
      data: {
        applicationId: data.applicationId,
        candidateId: app.applicantId,
        authorId: data.authorId,
        content: data.content.trim(),
      },
    });
  }
}
