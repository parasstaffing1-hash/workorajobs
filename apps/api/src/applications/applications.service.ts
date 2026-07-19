import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ApplicationStatus, JobStatus, NotificationType } from "@prisma/client";

import { AuthenticatedUser } from "../auth/types/authenticated-user.type";
import { CandidateService } from "../candidate/candidate.service";
import { EmailService } from "../email/email.service";
import { JobsService } from "../jobs/jobs.service";
import { NotificationsService } from "../notifications/notifications.service";
import { PrismaService } from "../prisma/prisma.service";
import { ApplyJobDto } from "./dto/apply-job.dto";
import { ChangeApplicationStatusDto } from "./dto/change-application-status.dto";
import { ScheduleInterviewDto } from "./dto/schedule-interview.dto";

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly candidate: CandidateService,
    private readonly jobs: JobsService,
    private readonly notifications: NotificationsService,
    private readonly email: EmailService,
  ) {}

  async apply(user: AuthenticatedUser, jobId: string, dto: ApplyJobDto) {
    const job = await this.prisma.job.findFirst({
      include: { company: true },
      where: { id: jobId, status: JobStatus.PUBLISHED },
    });
    if (!job) throw new NotFoundException("Published job not found.");
    const profile = await this.candidate.ensureProfile(user.sub);

    const application = await this.prisma.jobApplication.create({
      data: {
        jobId,
        candidateId: user.sub,
        coverLetter: dto.coverLetter,
        expectedSalary: dto.expectedSalary,
        availableFrom: dto.availableFrom
          ? new Date(dto.availableFrom)
          : undefined,
        resumeUrl: profile.resumeUrl,
        resumeKey: profile.resumeKey,
        timeline: {
          create: {
            status: ApplicationStatus.SUBMITTED,
            note: "Application submitted.",
          },
        },
      },
      include: { job: true, candidate: true, timeline: true },
    });

    await Promise.all([
      this.prisma.jobAnalytics.upsert({
        create: { jobId, applications: 1 },
        update: { applications: { increment: 1 } },
        where: { jobId },
      }),
      this.notifications.create({
        userId: user.sub,
        type: NotificationType.APPLICATION_SUBMITTED,
        title: "Application submitted",
        body: `Your application for ${job.title} was submitted.`,
        metadata: { jobId, applicationId: application.id },
      }),
      this.notifications.create({
        userId: job.company.ownerId,
        type: NotificationType.APPLICATION_SUBMITTED,
        title: "New applicant",
        body: `${user.email} applied for ${job.title}.`,
        metadata: { jobId, applicationId: application.id },
      }),
      this.email.applicationConfirmation(user.email, job.title),
    ]);

    return application;
  }

  async withdraw(user: AuthenticatedUser, applicationId: string) {
    const application = await this.prisma.jobApplication.findFirst({
      include: { job: true },
      where: { id: applicationId, candidateId: user.sub },
    });
    if (!application) throw new NotFoundException("Application not found.");
    const updated = await this.prisma.jobApplication.update({
      data: {
        status: ApplicationStatus.WITHDRAWN,
        withdrawnAt: new Date(),
        timeline: {
          create: {
            status: ApplicationStatus.WITHDRAWN,
            note: "Application withdrawn by candidate.",
          },
        },
      },
      where: { id: applicationId },
    });
    await this.notifications.create({
      userId: user.sub,
      type: NotificationType.APPLICATION_WITHDRAWN,
      title: "Application withdrawn",
      body: `You withdrew your application for ${application.job.title}.`,
      metadata: { applicationId },
    });
    return updated;
  }

  async getCandidateApplication(
    user: AuthenticatedUser,
    applicationId: string,
  ) {
    const application = await this.prisma.jobApplication.findFirst({
      include: {
        job: { include: { company: true } },
        timeline: true,
        interviews: true,
      },
      where: { id: applicationId, candidateId: user.sub },
    });
    if (!application) throw new NotFoundException("Application not found.");
    return application;
  }

  async changeStatus(
    user: AuthenticatedUser,
    applicationId: string,
    dto: ChangeApplicationStatusDto,
  ) {
    const application = await this.getEmployerApplication(user, applicationId);
    const updated = await this.prisma.jobApplication.update({
      data: {
        status: dto.status,
        timeline: {
          create: {
            status: dto.status,
            note: dto.note,
          },
        },
      },
      include: { candidate: true, job: true },
      where: { id: applicationId },
    });

    await Promise.all([
      this.updateAnalyticsForStatus(application.jobId, dto.status),
      this.notifications.create({
        userId: application.candidateId,
        type: NotificationType.APPLICATION_STATUS,
        title: "Application status updated",
        body: `Your application for ${application.job.title} is now ${dto.status}.`,
        metadata: { applicationId, status: dto.status },
      }),
      this.email.applicationStatus(
        updated.candidate.email,
        updated.job.title,
        dto.status,
      ),
    ]);

    return updated;
  }

  shortlist(user: AuthenticatedUser, applicationId: string) {
    return this.changeStatus(user, applicationId, {
      status: ApplicationStatus.SHORTLISTED,
      note: "Candidate shortlisted.",
    });
  }

  reject(user: AuthenticatedUser, applicationId: string) {
    return this.changeStatus(user, applicationId, {
      status: ApplicationStatus.REJECTED,
      note: "Candidate rejected.",
    });
  }

  async scheduleInterview(
    user: AuthenticatedUser,
    applicationId: string,
    dto: ScheduleInterviewDto,
  ) {
    const application = await this.getEmployerApplication(user, applicationId);
    const interview = await this.prisma.interview.create({
      data: {
        applicationId,
        scheduledById: user.sub,
        startsAt: new Date(dto.startsAt),
        endsAt: new Date(dto.endsAt),
        timezone: dto.timezone ?? "UTC",
        location: dto.location,
        meetingUrl: dto.meetingUrl,
        notes: dto.notes,
      },
      include: { application: { include: { candidate: true, job: true } } },
    });
    await this.changeStatus(user, applicationId, {
      status: ApplicationStatus.INTERVIEW_SCHEDULED,
      note: "Interview scheduled.",
    });
    await Promise.all([
      this.notifications.create({
        userId: application.candidateId,
        type: NotificationType.INTERVIEW_SCHEDULED,
        title: "Interview scheduled",
        body: `Interview scheduled for ${application.job.title}.`,
        metadata: { applicationId, interviewId: interview.id },
      }),
      this.email.interviewInvitation(
        interview.application.candidate.email,
        interview.application.job.title,
        interview.startsAt,
      ),
    ]);
    return interview;
  }

  private async getEmployerApplication(
    user: AuthenticatedUser,
    applicationId: string,
  ) {
    const application = await this.prisma.jobApplication.findUnique({
      include: { job: true },
      where: { id: applicationId },
    });
    if (!application) throw new NotFoundException("Application not found.");
    await this.jobs.assertEmployerJob(user, application.jobId);
    return application;
  }

  private updateAnalyticsForStatus(jobId: string, status: ApplicationStatus) {
    if (status === ApplicationStatus.SHORTLISTED) {
      return this.prisma.jobAnalytics.upsert({
        create: { jobId, shortlisted: 1 },
        update: { shortlisted: { increment: 1 } },
        where: { jobId },
      });
    }
    if (status === ApplicationStatus.REJECTED) {
      return this.prisma.jobAnalytics.upsert({
        create: { jobId, rejected: 1 },
        update: { rejected: { increment: 1 } },
        where: { jobId },
      });
    }
    if (status === ApplicationStatus.INTERVIEW_SCHEDULED) {
      return this.prisma.jobAnalytics.upsert({
        create: { jobId, interviews: 1 },
        update: { interviews: { increment: 1 } },
        where: { jobId },
      });
    }
    return Promise.resolve();
  }

  assertCandidate(user: AuthenticatedUser) {
    if (user.role !== "CANDIDATE" && user.role !== "ADMIN") {
      throw new ForbiddenException("Candidate access is required.");
    }
  }
}
