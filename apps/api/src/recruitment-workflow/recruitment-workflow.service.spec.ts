import { RecruitmentWorkflowService } from "./recruitment-workflow.service";
import { NotFoundException } from "@nestjs/common";
import { RecruitmentStore } from "./recruitment-store";

const InterviewStatus = {
  SCHEDULED: "SCHEDULED" as any,
  COMPLETED: "COMPLETED" as any,
  CANCELLED: "CANCELLED" as any,
  RESCHEDULED: "RESCHEDULED" as any,
};

describe("RecruitmentWorkflowService", () => {
  let service: RecruitmentWorkflowService;

  const mockPrisma = {
    jobApplication: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    interview: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const mockAudit = {
    record: jest.fn().mockResolvedValue(undefined),
  };

  const mockQueue = {
    registerWorker: jest.fn(),
    add: jest.fn().mockResolvedValue({ id: "job_id" }),
  };

  const mockNotifications = {
    create: jest.fn().mockResolvedValue({ id: "notif_id" }),
  };

  const mockEmail = {
    send: jest.fn().mockResolvedValue({ queued: true }),
    interviewInvitation: jest.fn().mockResolvedValue({ queued: true }),
    offerEmail: jest.fn().mockResolvedValue({ queued: true }),
    reminderEmail: jest.fn().mockResolvedValue({ queued: true }),
  };

  const mockUser = {
    sub: "recruiter-1",
    email: "recruiter@workora.com",
    role: "RECRUITER",
  } as any;

  beforeEach(() => {
    service = new RecruitmentWorkflowService(
      mockPrisma as any,
      mockAudit as any,
      mockQueue as any,
      mockNotifications as any,
      mockEmail as any,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("scheduleInterview", () => {
    it("should successfully schedule an interview and enqueue jobs", async () => {
      const applicationId = "app-1";
      const appData = {
        id: applicationId,
        candidateId: "cand-1",
        candidate: { email: "candidate@gmail.com", profile: { firstName: "Jane", lastName: "Doe" } },
        job: { title: "Senior Software Engineer" },
      };

      const dto = {
        startsAt: new Date(Date.now() + 1000000).toISOString(),
        endsAt: new Date(Date.now() + 5000000).toISOString(),
        roundName: "Technical Round",
        bufferMinutes: 10,
        panel: [{ userId: "interviewer-1", role: "Lead" }],
      };

      const mockInterviewCreated = {
        id: "int-123",
        applicationId,
        scheduledById: "recruiter-1",
        startsAt: new Date(dto.startsAt),
        endsAt: new Date(dto.endsAt),
        timezone: "UTC",
        status: InterviewStatus.SCHEDULED,
      };

      mockPrisma.jobApplication.findUnique.mockResolvedValue(appData);
      mockPrisma.interview.create.mockResolvedValue(mockInterviewCreated);
      mockPrisma.jobApplication.update.mockResolvedValue({});

      const result = await service.scheduleInterview(mockUser, applicationId, dto);

      expect(mockPrisma.jobApplication.findUnique).toHaveBeenCalledWith({
        include: { candidate: { include: { profile: true } }, job: true },
        where: { id: applicationId },
      });
      expect(mockPrisma.interview.create).toHaveBeenCalled();
      expect(mockQueue.add).toHaveBeenCalledWith("calendar-sync", { interviewId: "int-123" });
      expect(mockNotifications.create).toHaveBeenCalled();
      expect(mockEmail.interviewInvitation).toHaveBeenCalled();
      expect(result.id).toEqual("int-123");
    });

    it("should throw NotFoundException if job application does not exist", async () => {
      mockPrisma.jobApplication.findUnique.mockResolvedValue(null);
      await expect(
        service.scheduleInterview(mockUser, "invalid-app", { startsAt: "", endsAt: "" }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("rescheduleInterview", () => {
    it("should reschedule starts/endsAt and dispatch update worker", async () => {
      const interviewId = "int-123";
      const existing = {
        id: interviewId,
        startsAt: new Date(),
        endsAt: new Date(),
        application: { candidateId: "cand-1", job: { title: "Title" } },
      };

      mockPrisma.interview.findUnique.mockResolvedValue(existing);
      mockPrisma.interview.update.mockResolvedValue({ ...existing, status: InterviewStatus.RESCHEDULED });

      const dto = {
        startsAt: new Date().toISOString(),
        endsAt: new Date().toISOString(),
      };

      const result = await service.rescheduleInterview(mockUser, interviewId, dto);
      expect(mockPrisma.interview.update).toHaveBeenCalled();
      expect(mockQueue.add).toHaveBeenCalledWith("calendar-sync", { interviewId, action: "RESCHEDULE" });
      expect(result.status).toEqual(InterviewStatus.RESCHEDULED);
    });
  });

  describe("cancelInterview", () => {
    it("should mark interview as cancelled", async () => {
      const interviewId = "int-123";
      const existing = {
        id: interviewId,
        application: { candidateId: "cand-1", job: { title: "Title" } },
      };

      mockPrisma.interview.findUnique.mockResolvedValue(existing);
      mockPrisma.interview.update.mockResolvedValue({ ...existing, status: InterviewStatus.CANCELLED });

      const result = await service.cancelInterview(mockUser, interviewId, { reason: "Conflict" });
      expect(mockPrisma.interview.update).toHaveBeenCalledWith({
        data: { status: InterviewStatus.CANCELLED },
        where: { id: interviewId },
      });
      expect(result.status).toEqual(InterviewStatus.CANCELLED);
    });
  });

  describe("submitFeedback", () => {
    it("should save structured feedback scorecard and update interview to COMPLETED", async () => {
      const interviewId = "int-123";
      const existing = {
        id: interviewId,
        applicationId: "app-1",
        application: { candidateId: "cand-1", candidate: { profile: {} }, job: { title: "Title" } },
      };

      mockPrisma.interview.findUnique.mockResolvedValue(existing);
      mockPrisma.interview.update.mockResolvedValue({ ...existing, status: InterviewStatus.COMPLETED });

      const feedbackDto = {
        technicalRating: 5,
        communicationRating: 4,
        problemSolvingRating: 5,
        leadershipRating: 4,
        culturalFitRating: 4,
        recommendation: "STRONG_HIRE",
      };

      const result = await service.submitFeedback(mockUser, interviewId, feedbackDto);
      expect(mockPrisma.interview.update).toHaveBeenCalledWith({
        data: { status: InterviewStatus.COMPLETED },
        where: { id: interviewId },
      });
      expect(result.extended.feedback).toBeDefined();
      expect(result.extended.feedback!.technicalRating).toEqual(5);
    });
  });

  describe("Offers Workflow", () => {
    it("should successfully create a structured pending offer", async () => {
      const dto = {
        applicationId: "app-1",
        templateName: "Full-Time Executive",
        baseSalary: 150000,
        joiningDate: new Date().toISOString(),
        expirationDate: new Date().toISOString(),
        approvers: ["approver-1"],
      };

      const application = {
        id: "app-1",
        candidateId: "cand-1",
        candidate: { email: "cand@gmail.com" },
        job: { title: "VP of Product" },
      };

      mockPrisma.jobApplication.findUnique.mockResolvedValue(application);

      const offer = await service.createOffer(mockUser, dto);
      expect(offer.status).toEqual("PENDING_APPROVAL");
      expect(offer.approvals.length).toEqual(1);
      expect(offer.baseSalary).toEqual(150000);
    });

    it("should approve offer when selected user signs off", async () => {
      const offerId = "offer-123";
      const initialOffer: any = {
        id: offerId,
        applicationId: "app-1",
        status: "PENDING_APPROVAL",
        approvals: [{ userId: "approver-1", role: "Hiring Manager Approval", status: "PENDING" }],
      };
      RecruitmentStore.saveOffer(initialOffer);

      const approverUser = { sub: "approver-1", role: "EMPLOYER" } as any;
      const result = await service.approveOffer(approverUser, offerId, { status: "APPROVED", comment: "Great fit" });

      expect(result.status).toEqual("APPROVED");
      expect(result.approvals[0].status).toEqual("APPROVED");
    });
  });
});
