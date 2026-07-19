import { BadRequestException, ForbiddenException, NotFoundException } from "@nestjs/common";

const UserRole = {
  RECRUITER: "RECRUITER" as any,
  EMPLOYER: "EMPLOYER" as any,
  ADMIN: "ADMIN" as any,
};

const RecruiterRole = {
  ADMIN: "ADMIN" as any,
  STANDARD: "STANDARD" as any,
};

const RecruiterStatus = {
  ACTIVE: "ACTIVE" as any,
  SUSPENDED: "SUSPENDED" as any,
};

const VerificationStatus = {
  PENDING: "PENDING" as any,
  APPROVED: "APPROVED" as any,
};

import { RecruiterService } from "./recruiter.service";
import { AuthenticatedUser } from "../auth/types/authenticated-user.type";

describe("RecruiterService (Enterprise Module)", () => {
  let service: RecruiterService;

  const mockUser: AuthenticatedUser = {
    sub: "user-123",
    email: "recruiter@workora.com",
    role: UserRole.RECRUITER,
  };

  const mockEmployer: AuthenticatedUser = {
    sub: "owner-456",
    email: "owner@workora.com",
    role: UserRole.EMPLOYER,
  };

  const mockAdmin: AuthenticatedUser = {
    sub: "admin-789",
    email: "admin@workora.com",
    role: UserRole.ADMIN,
  };

  const mockPrisma = {
    recruiterProfile: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      upsert: jest.fn(),
      findMany: jest.fn(),
    },
    company: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
    hiringTeam: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    hiringTeamMember: {
      create: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn(),
    },
    hiringTeamInvitation: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockAudit = {
    record: jest.fn().mockResolvedValue(undefined),
  };

  const mockQueue = {
    add: jest.fn().mockResolvedValue({ id: "job-1" }),
    registerWorker: jest.fn(),
  };

  beforeEach(() => {
    service = new RecruiterService(mockPrisma as any, mockAudit as any, mockQueue as any);
    jest.clearAllMocks();
  });

  describe("getCompanyForUser", () => {
    it("should return null for ADMIN role", async () => {
      const result = await service.getCompanyForUser(mockAdmin);
      expect(result).toBeNull();
    });

    it("should fetch company for EMPLOYER owner", async () => {
      mockPrisma.company.findFirst.mockResolvedValueOnce({ id: "comp-1" });
      const result = await service.getCompanyForUser(mockEmployer);
      expect(result).toEqual({ id: "comp-1" });
      expect(mockPrisma.company.findFirst).toHaveBeenCalledWith({
        where: { ownerId: mockEmployer.sub },
      });
    });

    it("should throw ForbiddenException if RECRUITER has no assigned company", async () => {
      mockPrisma.recruiterProfile.findUnique.mockResolvedValueOnce(null);
      await expect(service.getCompanyForUser(mockUser)).rejects.toThrow(ForbiddenException);
    });

    it("should return company for RECRUITER profile", async () => {
      mockPrisma.recruiterProfile.findUnique.mockResolvedValueOnce({ companyId: "comp-1" });
      mockPrisma.company.findUnique.mockResolvedValueOnce({ id: "comp-1" });

      const result = await service.getCompanyForUser(mockUser);
      expect(result).toEqual({ id: "comp-1" });
    });
  });

  describe("registerRecruiter", () => {
    it("should fail if recruiter profile already exists", async () => {
      mockPrisma.recruiterProfile.findUnique.mockResolvedValueOnce({ id: "rec-1" });
      await expect(
        service.registerRecruiter(mockUser, { title: "Senior HR" }),
      ).rejects.toThrow(BadRequestException);
    });

    it("should successfully register recruiter profile and emit activity job", async () => {
      mockPrisma.recruiterProfile.findUnique.mockResolvedValueOnce(null);
      mockPrisma.recruiterProfile.create.mockResolvedValueOnce({
        id: "rec-new",
        userId: mockUser.sub,
        title: "Staff Sourcer",
      });

      const result = await service.registerRecruiter(mockUser, {
        title: "Staff Sourcer",
        phone: "+12345678",
      });

      expect(result.id).toBe("rec-new");
      expect(mockAudit.record).toHaveBeenCalled();
      expect(mockQueue.add).toHaveBeenCalledWith("activity-processing", expect.any(Object));
    });
  });

  describe("Hiring Teams Operations", () => {
    it("should create hiring team and assign OWNER membership", async () => {
      mockPrisma.recruiterProfile.findUnique.mockResolvedValueOnce({ companyId: "comp-1" });
      mockPrisma.company.findUnique.mockResolvedValueOnce({ id: "comp-1" });

      mockPrisma.hiringTeam.create.mockResolvedValueOnce({
        id: "team-1",
        name: "Dev Team",
        companyId: "comp-1",
      });

      const result = await service.createHiringTeam(mockUser, { name: "Dev Team" });

      expect(result.id).toBe("team-1");
      expect(mockPrisma.hiringTeamMember.create).toHaveBeenCalledWith({
        data: {
          teamId: "team-1",
          userId: mockUser.sub,
          role: RecruiterRole.OWNER,
        },
      });
    });

    it("should prevent non-owners from editing team metadata", async () => {
      mockPrisma.recruiterProfile.findUnique.mockResolvedValueOnce({ companyId: "comp-1" });
      mockPrisma.company.findUnique.mockResolvedValueOnce({ id: "comp-1" });

      mockPrisma.hiringTeam.findUnique.mockResolvedValueOnce({
        id: "team-1",
        companyId: "comp-1",
        ownerId: "owner-456",
      });

      await expect(service.updateHiringTeam(mockUser, "team-1", "New Name")).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
