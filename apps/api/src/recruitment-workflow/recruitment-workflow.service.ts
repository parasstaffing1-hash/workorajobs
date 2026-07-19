import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  OnModuleInit,
} from "@nestjs/common";
import { InterviewStatus as PrismaInterviewStatus, NotificationType as PrismaNotificationType } from "@prisma/client";

const InterviewStatus = PrismaInterviewStatus || {
  SCHEDULED: "SCHEDULED" as any,
  COMPLETED: "COMPLETED" as any,
  CANCELLED: "CANCELLED" as any,
  RESCHEDULED: "RESCHEDULED" as any,
};

const NotificationType = PrismaNotificationType || {
  INTERVIEW_SCHEDULED: "INTERVIEW_SCHEDULED" as any,
  APPLICATION_STATUS_CHANGED: "APPLICATION_STATUS_CHANGED" as any,
};

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { QueueService } from "../common/queue/queue.service";
import { NotificationsService } from "../notifications/notifications.service";
import { EmailService } from "../email/email.service";
import { AuthenticatedUser } from "../auth/types/authenticated-user.type";
import {
  RecruitmentStore,
  Offer,
  OfferApproval,
} from "./recruitment-store";
import {
  InterviewScheduleDto,
  InterviewRescheduleDto,
  InterviewCancelDto,
} from "./dto/interview-schedule.dto";
import { FeedbackScorecardDto } from "./dto/feedback-scorecard.dto";
import { CreateOfferDto, OfferApprovalDto, OfferResponseDto } from "./dto/offer.dto";

@Injectable()
export class RecruitmentWorkflowService implements OnModuleInit {
  private readonly logger = new Logger(RecruitmentWorkflowService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly queue: QueueService,
    private readonly notifications: NotificationsService,
    private readonly email: EmailService,
  ) {}

  onModuleInit() {
    // Register BullMQ-compatible workers
    this.queue.registerWorker("interview-reminders", async (data) => {
      this.logger.log(`[Queue Worker - interview-reminders] Processing job: ${JSON.stringify(data)}`);
      if (data.email && data.candidateName && data.jobTitle) {
        await this.email.reminderEmail(
          data.email,
          `Reminder: Upcoming Interview for ${data.jobTitle}`,
          `Hi ${data.candidateName}, this is a reminder for your upcoming interview tomorrow at ${new Date(
            data.startsAt,
          ).toLocaleTimeString()}.`,
        );
      }
    });

    this.queue.registerWorker("calendar-sync", async (data) => {
      this.logger.log(`[Queue Worker - calendar-sync] Syncing calendar invitation for ${data.interviewId}`);
    });

    this.queue.registerWorker("offer-generation", async (data) => {
      this.logger.log(`[Queue Worker - offer-generation] Generating PDF document for offer ${data.offerId}`);
    });

    this.queue.registerWorker("feedback-processing", async (data) => {
      this.logger.log(`[Queue Worker - feedback-processing] Analyzing scorecard feedback for interview ${data.interviewId}`);
    });

    this.queue.registerWorker("workflow-analytics", async (data) => {
      this.logger.log(`[Queue Worker - workflow-analytics] Tracking stage history transitions: ${JSON.stringify(data)}`);
    });
  }

  // INTERVIEWS METHODS

  async scheduleInterview(
    user: AuthenticatedUser,
    applicationId: string,
    dto: InterviewScheduleDto,
  ) {
    const application = await this.prisma.jobApplication.findUnique({
      include: {
        candidate: { include: { profile: true } },
        job: true,
      },
      where: { id: applicationId },
    });

    if (!application) {
      throw new NotFoundException("Job application not found.");
    }

    // Create base Interview in PostgreSQL via Prisma
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
        status: InterviewStatus.SCHEDULED,
      },
    });

    // Store extended panel & roundName details in RecruitmentStore
    const extended = RecruitmentStore.saveInterview(interview.id, {
      interviewId: interview.id,
      roundName: dto.roundName ?? "Technical Assessment",
      bufferMinutes: dto.bufferMinutes ?? 15,
      panel: dto.panel ?? [],
    });

    // Change JobApplication stage status to INTERVIEW_SCHEDULED
    await this.prisma.jobApplication.update({
      data: {
        status: "INTERVIEW_SCHEDULED",
        timeline: {
          create: {
            status: "INTERVIEW_SCHEDULED",
            note: `Scheduled ${dto.roundName ?? "Interview"} with panel.`,
          },
        },
      },
      where: { id: applicationId },
    });

    // Enqueue workers for sync & reminders
    await this.queue.add("calendar-sync", { interviewId: interview.id });
    const oneDayInMs = 24 * 60 * 60 * 1000;
    const reminderTime = new Date(interview.startsAt).getTime() - oneDayInMs;
    if (reminderTime > Date.now()) {
      await this.queue.add("interview-reminders", {
        interviewId: interview.id,
        email: application.candidate.email,
        candidateName: `${application.candidate.profile?.firstName || ""} ${
          application.candidate.profile?.lastName || ""
        }`.trim(),
        jobTitle: application.job.title,
        startsAt: interview.startsAt,
      });
    }

    // Trigger candidate notifications and email
    await Promise.all([
      this.notifications.create({
        userId: application.candidateId,
        type: NotificationType.INTERVIEW_SCHEDULED,
        title: "Interview Scheduled",
        body: `Your interview for "${application.job.title}" has been scheduled.`,
        metadata: { interviewId: interview.id, applicationId },
      }),
      this.email.interviewInvitation(
        application.candidate.email,
        application.job.title,
        interview.startsAt,
      ),
    ]);

    // Record Audit trail
    await this.audit.record({
      actorId: user.sub,
      action: "recruitment.interview.scheduled",
      entity: "Interview",
      entityId: interview.id,
      metadata: { applicationId, roundName: dto.roundName },
    });

    return { ...interview, extended };
  }

  async rescheduleInterview(
    user: AuthenticatedUser,
    interviewId: string,
    dto: InterviewRescheduleDto,
  ) {
    const interview = await this.prisma.interview.findUnique({
      include: { application: { include: { candidate: true, job: true } } },
      where: { id: interviewId },
    });

    if (!interview) {
      throw new NotFoundException("Interview not found.");
    }

    const updated = await this.prisma.interview.update({
      data: {
        startsAt: new Date(dto.startsAt),
        endsAt: new Date(dto.endsAt),
        status: InterviewStatus.RESCHEDULED,
        notes: dto.notes ?? interview.notes,
      },
    });

    await this.queue.add("calendar-sync", { interviewId, action: "RESCHEDULE" });

    // Notify candidate
    await this.notifications.create({
      userId: interview.application.candidateId,
      type: NotificationType.INTERVIEW_SCHEDULED,
      title: "Interview Rescheduled",
      body: `Your interview for "${interview.application.job.title}" has been rescheduled to ${new Date(
        dto.startsAt,
      ).toLocaleString()}.`,
    });

    await this.audit.record({
      actorId: user.sub,
      action: "recruitment.interview.rescheduled",
      entity: "Interview",
      entityId: interviewId,
      metadata: { newStartsAt: dto.startsAt },
    });

    const extended = RecruitmentStore.getInterview(interviewId);
    return { ...updated, extended };
  }

  async cancelInterview(
    user: AuthenticatedUser,
    interviewId: string,
    dto: InterviewCancelDto,
  ) {
    const interview = await this.prisma.interview.findUnique({
      include: { application: { include: { candidate: true, job: true } } },
      where: { id: interviewId },
    });

    if (!interview) {
      throw new NotFoundException("Interview not found.");
    }

    const updated = await this.prisma.interview.update({
      where: { id: interviewId },
      data: {
        status: InterviewStatus.CANCELLED,
      },
    });

    await this.queue.add("calendar-sync", { interviewId, action: "CANCEL" });

    await this.notifications.create({
      userId: interview.application.candidateId,
      type: NotificationType.INTERVIEW_SCHEDULED,
      title: "Interview Cancelled",
      body: `Your interview for "${interview.application.job.title}" has been cancelled. Reason: ${dto.reason ?? "N/A"}`,
    });

    await this.audit.record({
      actorId: user.sub,
      action: "recruitment.interview.cancelled",
      entity: "Interview",
      entityId: interviewId,
      metadata: { reason: dto.reason },
    });

    const extended = RecruitmentStore.getInterview(interviewId);
    return { ...updated, extended };
  }

  async submitFeedback(
    user: AuthenticatedUser,
    interviewId: string,
    dto: FeedbackScorecardDto,
  ) {
    const interview = await this.prisma.interview.findUnique({
      include: { application: { include: { candidate: { include: { profile: true } }, job: true } } },
      where: { id: interviewId },
    });

    if (!interview) {
      throw new NotFoundException("Interview not found.");
    }

    const updatedInterview = await this.prisma.interview.update({
      where: { id: interviewId },
      data: {
        status: InterviewStatus.COMPLETED,
      },
    });

    // Save detailed ratings, strengths, weaknesses and overall decision to store
    const extended = RecruitmentStore.saveInterview(interviewId, {
      feedback: {
        ...dto,
        createdAt: new Date().toISOString(),
      },
    });

    // Process analytics and feedback asynchronously in worker
    await this.queue.add("feedback-processing", { interviewId });
    await this.queue.add("workflow-analytics", {
      type: "FEEDBACK_SUBMITTED",
      applicationId: interview.applicationId,
      ratings: dto,
    });

    await this.audit.record({
      actorId: user.sub,
      action: "recruitment.interview.feedback_submitted",
      entity: "Interview",
      entityId: interviewId,
      metadata: { recommendation: dto.recommendation },
    });

    return { ...updatedInterview, extended };
  }

  // OFFERS METHODS

  async createOffer(user: AuthenticatedUser, dto: CreateOfferDto) {
    const application = await this.prisma.jobApplication.findUnique({
      include: {
        candidate: { include: { profile: true } },
        job: true,
      },
      where: { id: dto.applicationId },
    });

    if (!application) {
      throw new NotFoundException("Job application not found.");
    }

    const offerId = uuidv4();

    // Setup an approval chain based on input or standard configuration
    const approvalChain: OfferApproval[] = (dto.approvers || []).map((approverId, index) => {
      let role = "HR Approval";
      if (index === 0) role = "Hiring Manager Approval";
      if (index === dto.approvers!.length - 1) role = "Executive Approval";
      return {
        userId: approverId,
        role,
        status: "PENDING",
      };
    });

    const isPendingApproval = approvalChain.length > 0;
    const initialStatus = isPendingApproval ? "PENDING_APPROVAL" : "DRAFT";

    const offer: Offer = {
      id: offerId,
      applicationId: dto.applicationId,
      templateName: dto.templateName,
      baseSalary: dto.baseSalary,
      signOnBonus: dto.signOnBonus,
      benefits: dto.benefits,
      joiningDate: dto.joiningDate,
      expirationDate: dto.expirationDate,
      status: initialStatus,
      version: 1,
      approvals: approvalChain,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    RecruitmentStore.saveOffer(offer);

    // Queue Document / Template generation task
    await this.queue.add("offer-generation", { offerId });

    await this.audit.record({
      actorId: user.sub,
      action: "recruitment.offer.created",
      entity: "Offer",
      entityId: offerId,
      metadata: { applicationId: dto.applicationId, baseSalary: dto.baseSalary },
    });

    return offer;
  }

  async approveOffer(user: AuthenticatedUser, offerId: string, dto: OfferApprovalDto) {
    const offer = RecruitmentStore.getOffer(offerId);
    if (!offer) {
      throw new NotFoundException("Offer not found.");
    }

    const approvalIndex = offer.approvals.findIndex((app) => app.userId === user.sub);
    if (approvalIndex === -1) {
      throw new BadRequestException("User is not in the approval chain for this offer.");
    }

    // Update specific approval block
    offer.approvals[approvalIndex].status = dto.status === "APPROVED" ? "APPROVED" : "REJECTED";
    offer.approvals[approvalIndex].comment = dto.comment;
    offer.approvals[approvalIndex].updatedAt = new Date().toISOString();

    // Check final status of approvals
    const hasRejected = offer.approvals.some((app) => app.status === "REJECTED");
    const allApproved = offer.approvals.every((app) => app.status === "APPROVED");

    if (hasRejected) {
      offer.status = "DECLINED";
    } else if (allApproved) {
      offer.status = "APPROVED";
    }

    offer.updatedAt = new Date().toISOString();
    RecruitmentStore.saveOffer(offer);

    await this.audit.record({
      actorId: user.sub,
      action: `recruitment.offer.${dto.status.toLowerCase()}`,
      entity: "Offer",
      entityId: offerId,
      metadata: { comment: dto.comment },
    });

    return offer;
  }

  async sendOffer(user: AuthenticatedUser, offerId: string) {
    const offer = RecruitmentStore.getOffer(offerId);
    if (!offer) {
      throw new NotFoundException("Offer not found.");
    }

    offer.status = "SENT";
    offer.updatedAt = new Date().toISOString();
    RecruitmentStore.saveOffer(offer);

    const application = await this.prisma.jobApplication.findUnique({
      include: { candidate: true, job: true },
      where: { id: offer.applicationId },
    });

    if (application) {
      await this.prisma.jobApplication.update({
        data: {
          status: "OFFERED",
          timeline: {
            create: {
              status: "OFFERED",
              note: `Offer of Base ${offer.baseSalary} sent to candidate.`,
            },
          },
        },
        where: { id: offer.applicationId },
      });

      // Send notifications & congrats emails
      await Promise.all([
        this.notifications.create({
          userId: application.candidateId,
          type: NotificationType.APPLICATION_STATUS_CHANGED,
          title: "Congratulations! Offer Received",
          body: `An official employment offer for "${application.job.title}" has been issued to you.`,
        }),
        this.email.offerEmail(application.candidate.email, application.job.title),
      ]);
    }

    await this.audit.record({
      actorId: user.sub,
      action: "recruitment.offer.sent",
      entity: "Offer",
      entityId: offerId,
    });

    return offer;
  }

  async respondToOffer(offerId: string, dto: OfferResponseDto) {
    const offer = RecruitmentStore.getOffer(offerId);
    if (!offer) {
      throw new NotFoundException("Offer not found.");
    }

    offer.status = dto.status === "ACCEPTED" ? "ACCEPTED" : "DECLINED";
    offer.reason = dto.reason;
    offer.updatedAt = new Date().toISOString();
    RecruitmentStore.saveOffer(offer);

    const application = await this.prisma.jobApplication.findUnique({
      include: { candidate: { include: { profile: true } }, job: true },
      where: { id: offer.applicationId },
    });

    if (application) {
      const candidateName = `${application.candidate.profile?.firstName || ""} ${
        application.candidate.profile?.lastName || ""
      }`.trim();

      const newStatus = dto.status === "ACCEPTED" ? "HIRED" : "REJECTED";
      await this.prisma.jobApplication.update({
        data: {
          status: newStatus,
          timeline: {
            create: {
              status: newStatus,
              note: `Candidate ${candidateName} ${dto.status.toLowerCase()} the offer. Reason: ${dto.reason ?? "N/A"}`,
            },
          },
        },
        where: { id: offer.applicationId },
      });

      await this.queue.add("workflow-analytics", {
        type: `OFFER_${dto.status}`,
        applicationId: offer.applicationId,
        salary: offer.baseSalary,
      });
    }

    await this.audit.record({
      actorId: "CANDIDATE_RESPONSE",
      action: `recruitment.offer.response.${dto.status.toLowerCase()}`,
      entity: "Offer",
      entityId: offerId,
      metadata: { reason: dto.reason },
    });

    return offer;
  }

  async withdrawOffer(user: AuthenticatedUser, offerId: string) {
    const offer = RecruitmentStore.getOffer(offerId);
    if (!offer) {
      throw new NotFoundException("Offer not found.");
    }

    offer.status = "WITHDRAWN";
    offer.updatedAt = new Date().toISOString();
    RecruitmentStore.saveOffer(offer);

    await this.audit.record({
      actorId: user.sub,
      action: "recruitment.offer.withdrawn",
      entity: "Offer",
      entityId: offerId,
    });

    return offer;
  }

  // BULK BATCH AND DASHBOARD ANALYTICS METHODS

  async getInterviews(params: {
    status?: InterviewStatus;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.status) {
      where.status = params.status;
    }

    const orderBy: any = {};
    if (params.sortBy) {
      orderBy[params.sortBy] = params.sortOrder ?? "desc";
    } else {
      orderBy.startsAt = "asc";
    }

    const [interviews, total] = await Promise.all([
      this.prisma.interview.findMany({
        include: {
          application: {
            include: {
              candidate: { include: { profile: true } },
              job: true,
            },
          },
        },
        where,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.interview.count({ where }),
    ]);

    const enriched = interviews.map((item) => {
      const extended = RecruitmentStore.getInterview(item.id);
      return { ...item, extended };
    });

    return {
      data: enriched,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  getOffers(params: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const skip = (page - 1) * limit;

    let offers = RecruitmentStore.listOffers();
    if (params.status) {
      offers = offers.filter((o) => o.status === params.status);
    }

    // Sort by updated time descending
    offers.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    const paginatedOffers = offers.slice(skip, skip + limit);

    return {
      data: paginatedOffers,
      meta: {
        total: offers.length,
        page,
        limit,
        totalPages: Math.ceil(offers.length / limit),
      },
    };
  }

  async getDashboardAnalytics() {
    const [scheduled, completed, cancelled] = await Promise.all([
      this.prisma.interview.count({ where: { status: InterviewStatus.SCHEDULED } }),
      this.prisma.interview.count({ where: { status: InterviewStatus.COMPLETED } }),
      this.prisma.interview.count({ where: { status: InterviewStatus.CANCELLED } }),
    ]);

    const offers = RecruitmentStore.listOffers();
    const pendingOffers = offers.filter((o) => o.status === "PENDING_APPROVAL" || o.status === "SENT").length;
    const acceptedOffers = offers.filter((o) => o.status === "ACCEPTED" || o.status === "JOINED").length;

    // Aggregate scorecards average ratings
    const interviewsWithFeedback = RecruitmentStore.listInterviews().filter((i) => i.feedback);
    const feedbackCount = interviewsWithFeedback.length;

    let avgTechnical = 0;
    let avgCommunication = 0;
    let avgProblemSolving = 0;

    if (feedbackCount > 0) {
      const sumTech = interviewsWithFeedback.reduce((acc, curr) => acc + curr.feedback!.technicalRating, 0);
      const sumComm = interviewsWithFeedback.reduce((acc, curr) => acc + curr.feedback!.communicationRating, 0);
      const sumProb = interviewsWithFeedback.reduce((acc, curr) => acc + curr.feedback!.problemSolvingRating, 0);

      avgTechnical = parseFloat((sumTech / feedbackCount).toFixed(1));
      avgCommunication = parseFloat((sumComm / feedbackCount).toFixed(1));
      avgProblemSolving = parseFloat((sumProb / feedbackCount).toFixed(1));
    }

    return {
      upcomingInterviews: scheduled,
      completedInterviews: completed,
      cancelledInterviews: cancelled,
      offersPending: pendingOffers,
      offersAccepted: acceptedOffers,
      averageFeedback: {
        count: feedbackCount,
        technical: avgTechnical,
        communication: avgCommunication,
        problemSolving: avgProblemSolving,
      },
      hiringFunnel: {
        scheduled,
        completed,
        offered: offers.filter((o) => o.status === "SENT").length,
        hired: acceptedOffers,
      },
    };
  }

  async batchCancelInterviews(user: AuthenticatedUser, interviewIds: string[], reason: string) {
    const results = await Promise.all(
      interviewIds.map(async (id) => {
        try {
          return await this.cancelInterview(user, id, { reason });
        } catch (e) {
          return { interviewId: id, error: e.message };
        }
      }),
    );
    return { success: true, results };
  }
}
