import { prisma } from "@/lib/prisma";
import { CompanyService } from "@/lib/company/company-service";

export interface AtsQueryOptions {
  jobId?: string;
  query?: string;
  stage?: string;
  page?: number;
  limit?: number;
}

export class AtsService {
  /**
   * Fetch Applicants Organized by Recruitment Pipeline Stages
   */
  static async getPipelineApplicants(employerUserId: string, options: AtsQueryOptions = {}) {
    const { company } = await CompanyService.getEmployerCompany(employerUserId);

    const whereClause: any = {
      job: { companyId: company.id },
    };

    if (options.jobId && options.jobId !== "ALL") {
      whereClause.jobId = options.jobId;
    }

    if (options.query && options.query.trim()) {
      const q = options.query.trim();
      whereClause.OR = [
        { applicant: { name: { contains: q, mode: "insensitive" } } },
        { applicant: { email: { contains: q, mode: "insensitive" } } },
        { job: { title: { contains: q, mode: "insensitive" } } },
      ];
    }

    const applications = await prisma.application.findMany({
      where: whereClause,
      include: {
        applicant: {
          select: {
            id: true,
            name: true,
            email: true,
            profile: true,
          },
        },
        job: {
          select: { id: true, title: true, location: true, type: true, workMode: true },
        },
        resumeRecord: true,
        statusHistory: { orderBy: { createdAt: "desc" } },
        notes: { include: { author: { select: { name: true } } }, orderBy: { createdAt: "desc" } },
        ratings: { include: { author: { select: { name: true } } }, orderBy: { createdAt: "desc" } },
        tags: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Pipeline Stages Mapping
    const stages = [
      { key: "APPLIED", label: "Applied", color: "blue" },
      { key: "SCREENING", label: "Screening", color: "indigo" },
      { key: "INTERVIEW", label: "Interview", color: "amber" },
      { key: "TECHNICAL_ROUND", label: "Technical Round", color: "purple" },
      { key: "HR_ROUND", label: "HR Round", color: "teal" },
      { key: "OFFER", label: "Offer Extended", color: "emerald" },
      { key: "HIRED", label: "Hired", color: "green" },
      { key: "REJECTED", label: "Not Selected", color: "red" },
    ];

    const pipeline: Record<string, any[]> = {
      APPLIED: [],
      SCREENING: [],
      INTERVIEW: [],
      TECHNICAL_ROUND: [],
      HR_ROUND: [],
      OFFER: [],
      HIRED: [],
      REJECTED: [],
    };

    applications.forEach((app) => {
      let stageKey = "APPLIED";
      if (app.status === "UNDER_REVIEW" || app.status === "SHORTLISTED") stageKey = "SCREENING";
      else if (app.status === "INTERVIEW_SCHEDULED" || app.status === "INTERVIEW_COMPLETED") stageKey = "INTERVIEW";
      else if (app.status === "OFFER_EXTENDED") stageKey = "OFFER";
      else if (app.status === "HIRED") stageKey = "HIRED";
      else if (app.status === "REJECTED" || app.status === "WITHDRAWN") stageKey = "REJECTED";

      const formatted = {
        id: app.id,
        applicationId: app.id,
        status: app.status,
        stageKey,
        appliedAt: app.createdAt,
        isOneClick: app.isOneClick,
        candidate: {
          id: app.applicant.id,
          name: app.applicant.name || "Candidate",
          email: app.applicant.email,
          phone: app.applicant.profile?.phone || undefined,
          headline: app.applicant.profile?.headline || "Software Engineer",
          location: app.applicant.profile?.location || "Remote",
          skills: app.applicant.profile?.skills || [],
        },
        job: app.job,
        resumeUrl: app.resumeRecord?.fileUrl || app.resumeUrl || undefined,
        resumeTitle: app.resumeRecord?.fileName || "Resume.pdf",
        notesCount: app.notes.length,
        notes: app.notes,
        ratings: app.ratings,
        averageRating:
          app.ratings.length > 0
            ? (app.ratings.reduce((acc, r) => acc + r.rating, 0) / app.ratings.length).toFixed(1)
            : null,
        tags: app.tags,
        statusHistory: app.statusHistory,
      };

      if (pipeline[stageKey]) {
        pipeline[stageKey].push(formatted);
      } else {
        pipeline.APPLIED.push(formatted);
      }
    });

    return {
      stages,
      pipeline,
      totalCount: applications.length,
    };
  }

  /**
   * Move Candidate Stage in ATS Pipeline
   */
  static async moveApplicantStage(
    recruiterUserId: string,
    applicationId: string,
    newStatus: string,
    note?: string
  ) {
    const app = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true },
    });

    if (!app) throw new Error("Application record not found.");

    const fromStatus = app.status;

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: newStatus as any,
      },
    });

    // Record Status History Audit Log
    await prisma.applicationStatusHistory.create({
      data: {
        applicationId,
        fromStatus,
        toStatus: newStatus as any,
        note: note || `Stage updated to ${newStatus}`,
        changedById: recruiterUserId,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: recruiterUserId,
        action: `ATS_STAGE_CHANGED:${applicationId}:${fromStatus}->${newStatus}`,
      },
    });

    return updated;
  }

  /**
   * Add Internal Recruiter Note
   */
  static async addCandidateNote(authorId: string, applicationId: string, content: string) {
    if (!content.trim()) throw new Error("Note content cannot be empty.");

    return prisma.candidateNote.create({
      data: {
        applicationId,
        authorId,
        content: content.trim(),
      },
      include: { author: { select: { name: true } } },
    });
  }

  /**
   * Add Interview Feedback Scorecard
   */
  static async addInterviewRating(
    authorId: string,
    applicationId: string,
    rating: number,
    recommendation?: string,
    feedback?: string,
    stage?: string
  ) {
    return prisma.candidateRating.create({
      data: {
        applicationId,
        authorId,
        rating,
        recommendation: recommendation || "HIRE",
        feedback: feedback?.trim() || null,
        stage: stage || "INTERVIEW",
      },
      include: { author: { select: { name: true } } },
    });
  }

  /**
   * Tag Candidate
   */
  static async addCandidateTag(applicationId: string, tag: string, color = "blue") {
    const cleanTag = tag.trim();
    if (!cleanTag) throw new Error("Tag name is required.");

    return prisma.candidateTag.create({
      data: {
        applicationId,
        tag: cleanTag,
        color,
      },
    });
  }

  /**
   * Remove Tag
   */
  static async removeCandidateTag(tagId: string) {
    await prisma.candidateTag.delete({ where: { id: tagId } });
    return true;
  }
}
