import { prisma } from "@/lib/prisma";
import { StorageProvider } from "./storage-provider";
import { ResumeParser } from "./resume-parser";
import { ApplicationStatus } from "@prisma/client";

export class ApplicationService {
  // 1. Resume Management
  static async uploadResume(
    userId: string,
    buffer: Buffer,
    originalFilename: string,
    mimeType: string,
    title?: string
  ) {
    const fileResult = await StorageProvider.saveResumeFile(buffer, originalFilename, mimeType);
    const plainText = buffer.toString("utf-8"); // basic plain text fallback
    const parsedData = ResumeParser.parseText(plainText);

    // Check if user has existing default resume
    const existingCount = await prisma.resume.count({ where: { userId } });
    const isDefault = existingCount === 0;

    const resume = await prisma.resume.create({
      data: {
        userId,
        title: title || originalFilename,
        fileUrl: fileResult.fileUrl,
        fileSize: fileResult.fileSize,
        fileType: mimeType,
        isDefault,
        parsedText: plainText,
        extractedData: parsedData as any,
      },
    });

    return resume;
  }

  static async getUserResumes(userId: string) {
    return prisma.resume.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async setDefaultResume(userId: string, resumeId: string) {
    await prisma.resume.updateMany({
      where: { userId },
      data: { isDefault: false },
    });

    return prisma.resume.update({
      where: { id: resumeId },
      data: { isDefault: true },
    });
  }

  static async deleteResume(userId: string, resumeId: string) {
    return prisma.resume.deleteMany({
      where: { id: resumeId, userId },
    });
  }

  // 2. Candidate Job Application Pipeline
  static async submitApplication(data: {
    applicantId: string;
    jobId: string;
    resumeId?: string;
    coverLetter?: string;
  }) {
    // 1. Check duplicate submission
    const existing = await prisma.application.findUnique({
      where: {
        applicantId_jobId: {
          applicantId: data.applicantId,
          jobId: data.jobId,
        },
      },
    });

    if (existing) {
      throw new Error("You have already applied for this job position.");
    }

    // 2. Resolve default resume if not specified
    let selectedResumeId = data.resumeId;
    let selectedResumeUrl: string | undefined = undefined;

    if (selectedResumeId) {
      const res = await prisma.resume.findUnique({ where: { id: selectedResumeId } });
      selectedResumeUrl = res?.fileUrl;
    } else {
      const defaultRes = await prisma.resume.findFirst({
        where: { userId: data.applicantId, isDefault: true },
      });
      selectedResumeId = defaultRes?.id;
      selectedResumeUrl = defaultRes?.fileUrl;
    }

    const job = await prisma.job.findUnique({
      where: { id: data.jobId },
      include: { company: true },
    });

    if (!job || job.deletedAt) {
      throw new Error("The target job listing is no longer available.");
    }

    // 3. Create Application
    const application = await prisma.application.create({
      data: {
        applicantId: data.applicantId,
        jobId: data.jobId,
        resumeId: selectedResumeId,
        resumeUrl: selectedResumeUrl,
        coverLetter: data.coverLetter,
        status: ApplicationStatus.APPLIED,
      },
      include: { job: { include: { company: true } } },
    });

    // 4. Log initial status history
    await prisma.applicationStatusHistory.create({
      data: {
        applicationId: application.id,
        fromStatus: ApplicationStatus.APPLIED,
        toStatus: ApplicationStatus.APPLIED,
        note: "Candidate submitted application.",
        changedById: data.applicantId,
      },
    });

    // 5. In-App Notification Trigger
    await prisma.notification.create({
      data: {
        userId: data.applicantId,
        title: "Application Submitted",
        message: `Your application for ${job.title} at ${job.company.name} was successfully received.`,
        type: "SUCCESS",
      },
    });

    return application;
  }

  static async getCandidateApplications(applicantId: string) {
    return prisma.application.findMany({
      where: { applicantId },
      include: {
        job: { include: { company: true } },
        resume: true,
        statusHistory: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async withdrawApplication(applicantId: string, applicationId: string) {
    const app = await prisma.application.findFirst({
      where: { id: applicationId, applicantId },
    });

    if (!app) {
      throw new Error("Application not found or unauthorized.");
    }

    if (app.status === ApplicationStatus.HIRED || app.status === ApplicationStatus.REJECTED) {
      throw new Error("Cannot withdraw a closed application.");
    }

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: { status: ApplicationStatus.WITHDRAWN },
    });

    await prisma.applicationStatusHistory.create({
      data: {
        applicationId,
        fromStatus: app.status,
        toStatus: ApplicationStatus.WITHDRAWN,
        note: "Candidate withdrew application.",
        changedById: applicantId,
      },
    });

    return updated;
  }

  // 3. Employer Applicant Management
  static async getJobApplicants(employerUserId: string, jobId: string) {
    const job = await prisma.job.findFirst({
      where: { id: jobId, postedById: employerUserId },
    });

    if (!job) {
      throw new Error("Job not found or access denied.");
    }

    return prisma.application.findMany({
      where: { jobId },
      include: {
        applicant: { select: { id: true, name: true, email: true, profile: true } },
        resume: true,
        statusHistory: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async updateApplicationStatus(data: {
    applicationId: string;
    changedById: string;
    newStatus: ApplicationStatus;
    note?: string;
  }) {
    const app = await prisma.application.findUnique({
      where: { id: data.applicationId },
      include: { job: true },
    });

    if (!app) {
      throw new Error("Application not found.");
    }

    const updated = await prisma.application.update({
      where: { id: data.applicationId },
      data: { status: data.newStatus },
    });

    // History Log
    await prisma.applicationStatusHistory.create({
      data: {
        applicationId: data.applicationId,
        fromStatus: app.status,
        toStatus: data.newStatus,
        note: data.note || `Status updated to ${data.newStatus}`,
        changedById: data.changedById,
      },
    });

    // Candidate Notification
    await prisma.notification.create({
      data: {
        userId: app.applicantId,
        title: "Application Status Update",
        message: `Your application status for ${app.job.title} has been updated to ${data.newStatus}.`,
        type: "INFO",
      },
    });

    return updated;
  }
}
