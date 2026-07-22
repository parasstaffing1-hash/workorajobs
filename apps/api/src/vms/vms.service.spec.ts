import { BadRequestException, NotFoundException } from "@nestjs/common";
import * as PrismaClientPkg from "@prisma/client";

const RequisitionStatus = PrismaClientPkg.RequisitionStatus || { DRAFT: "DRAFT", VENDOR_DISTRIBUTION: "VENDOR_DISTRIBUTION", OPEN: "OPEN", CLOSED: "CLOSED" };
const SubmissionStatus = PrismaClientPkg.SubmissionStatus || { SUBMITTED: "SUBMITTED", REVIEWED: "REVIEWED", REJECTED: "REJECTED" };
const VendorRole = PrismaClientPkg.VendorRole || { ADMIN: "ADMIN", RECRUITER: "RECRUITER" };
const VendorStatus = PrismaClientPkg.VendorStatus || { PENDING: "PENDING", APPROVED: "APPROVED", SUSPENDED: "SUSPENDED" };


import { AuthenticatedUser } from "../auth/types/authenticated-user.type";
import { VmsService } from "./vms.service";

describe("VmsService (Vendor Management System)", () => {
  let service: VmsService;

  const mockUser: AuthenticatedUser = {
    sub: "user-123",
    email: "manager@workora.com",
    role: "RECRUITER" as any,
  };

  const mockPrisma = {
    vendorProfile: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    vendorMember: {
      create: jest.fn(),
    },
    company: {
      findUnique: jest.fn(),
    },
    jobRequisition: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    vendorDistribution: {
      upsert: jest.fn(),
      findUnique: jest.fn(),
    },
    candidateProfile: {
      findUnique: jest.fn(),
    },
    vendorSubmission: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
    vendorSlaViolation: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    vendorScorecard: {
      create: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  const mockQueue = {
    registerWorker: jest.fn(),
    add: jest.fn().mockResolvedValue({ id: "job-1" }),
  };

  beforeEach(() => {
    service = new VmsService(mockPrisma as any, mockQueue as any);
    jest.clearAllMocks();
  });

  describe("Vendor Registration", () => {
    it("should successfully register a vendor organization", async () => {
      const dto = {
        name: "Apex Staffing",
        category: "RPO",
        specialization: "Engineering",
      };
      mockPrisma.vendorProfile.create.mockResolvedValueOnce({
        id: "vendor-1",
        ...dto,
        status: VendorStatus.PENDING,
      });

      const result = await service.registerVendor(dto);
      expect(result.id).toBe("vendor-1");
      expect(mockPrisma.vendorProfile.create).toHaveBeenCalledWith({
        data: {
          name: dto.name,
          category: dto.category,
          specialization: dto.specialization,
          primaryContact: undefined,
          billingContact: undefined,
          companyId: null,
          status: VendorStatus.PENDING,
        },
      });
    });

    it("should successfully add a member to vendor profile", async () => {
      mockPrisma.vendorProfile.findUnique.mockResolvedValueOnce({ id: "vendor-1" });
      mockPrisma.vendorMember.create.mockResolvedValueOnce({
        id: "mem-1",
        vendorId: "vendor-1",
        userId: "user-abc",
        role: VendorRole.RECRUITER,
      });

      const result = await service.addVendorMember("vendor-1", {
        userId: "user-abc",
        role: VendorRole.RECRUITER,
      });

      expect(result.id).toBe("mem-1");
      expect(mockPrisma.vendorMember.create).toHaveBeenCalled();
    });

    it("should throw NotFoundException if vendor not found when adding a member", async () => {
      mockPrisma.vendorProfile.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.addVendorMember("missing-vendor", {
          userId: "user-abc",
          role: VendorRole.RECRUITER,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("Job Requisition Management", () => {
    it("should create a job requisition successfully", async () => {
      mockPrisma.company.findUnique.mockResolvedValueOnce({ id: "comp-1" });
      mockPrisma.jobRequisition.create.mockResolvedValueOnce({
        id: "req-1",
        requisitionNumber: "REQ-12345",
        companyId: "comp-1",
        title: "Staff Dev",
        status: RequisitionStatus.DRAFT,
      });

      const result = await service.createRequisition(mockUser, {
        title: "Staff Dev",
        companyId: "comp-1",
        hiringManagerId: "user-123",
        employmentType: "FULL_TIME",
        requiredSkills: ["Node"],
        description: "Need strong backend dev",
      });

      expect(result.id).toBe("req-1");
      expect(mockPrisma.jobRequisition.create).toHaveBeenCalled();
    });
  });

  describe("Requisition Distribution & Candidate Submission", () => {
    it("should distribute job requisitions to vendors", async () => {
      mockPrisma.jobRequisition.findUnique.mockResolvedValueOnce({ id: "req-1" });
      mockPrisma.vendorProfile.findUnique.mockResolvedValueOnce({ id: "vendor-1" });
      mockPrisma.vendorDistribution.upsert.mockResolvedValueOnce({
        requisitionId: "req-1",
        vendorId: "vendor-1",
        status: "ACTIVE",
      });
      mockPrisma.jobRequisition.update.mockResolvedValueOnce({});

      const result = await service.distributeRequisition("req-1", {
        vendorIds: ["vendor-1"],
      });

      expect(result).toHaveLength(1);
      expect(mockPrisma.vendorDistribution.upsert).toHaveBeenCalled();
      expect(mockQueue.add).toHaveBeenCalledWith("vendor-distribution", { requisitionId: "req-1" });
    });

    it("should submit candidates successfully to distributed requisitions", async () => {
      mockPrisma.vendorDistribution.findUnique.mockResolvedValueOnce({
        requisitionId: "req-1",
        vendorId: "vendor-1",
        status: "ACTIVE",
      });
      mockPrisma.candidateProfile.findUnique.mockResolvedValueOnce({ id: "cand-1" });
      mockPrisma.vendorSubmission.findUnique.mockResolvedValueOnce(null);
      mockPrisma.vendorSubmission.create.mockResolvedValueOnce({
        id: "sub-1",
        status: SubmissionStatus.SUBMITTED,
      });

      const result = await service.submitCandidate({
        requisitionId: "req-1",
        vendorId: "vendor-1",
        candidateId: "cand-1",
      });

      expect(result.status).toBe(SubmissionStatus.SUBMITTED);
      expect(mockQueue.add).toHaveBeenCalledWith("scorecard-calculation", { vendorId: "vendor-1" });
      expect(mockQueue.add).toHaveBeenCalledWith("n8n-dispatch", expect.any(Object));
    });

    it("should prevent duplicate candidate submissions", async () => {
      mockPrisma.vendorDistribution.findUnique.mockResolvedValueOnce({
        requisitionId: "req-1",
        vendorId: "vendor-1",
        status: "ACTIVE",
      });
      mockPrisma.candidateProfile.findUnique.mockResolvedValueOnce({ id: "cand-1" });
      mockPrisma.vendorSubmission.findUnique.mockResolvedValueOnce({ id: "sub-existing" });

      await expect(
        service.submitCandidate({
          requisitionId: "req-1",
          vendorId: "vendor-1",
          candidateId: "cand-1",
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("SLA Violations & Scorecards", () => {
    it("should log SLA violations and trigger scorecard update", async () => {
      mockPrisma.vendorSlaViolation.create.mockResolvedValueOnce({
        id: "viol-1",
        slaType: "RESPONSE",
      });
      mockPrisma.vendorSubmission.findMany.mockResolvedValueOnce([]);
      mockPrisma.vendorSlaViolation.findMany.mockResolvedValueOnce([{ id: "viol-1" }]);

      const result = await service.logSlaViolation("vendor-1", "RESPONSE", "Late reply");

      expect(result.id).toBe("viol-1");
      expect(mockQueue.add).toHaveBeenCalledWith("scorecard-calculation", { vendorId: "vendor-1" });
    });
  });
});
