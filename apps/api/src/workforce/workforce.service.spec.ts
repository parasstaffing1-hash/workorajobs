import { NotFoundException } from "@nestjs/common";
import { WorkforceService } from "./workforce.service";

describe("WorkforceService", () => {
  let service: WorkforceService;

  const mockPrisma = {
    placement: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    assignment: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
    timesheet: {
      create: jest.fn(),
    },
    attendanceRecord: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    leaveRequest: {
      create: jest.fn(),
    },
    expenseClaim: {
      create: jest.fn(),
    },
    workerCompliance: {
      create: jest.fn(),
    },
    candidateProfile: {
      findUnique: jest.fn(),
    },
    company: {
      findUnique: jest.fn(),
    },
  };

  const mockQueue = {
    registerWorker: jest.fn(),
    add: jest.fn().mockResolvedValue({ id: "job-id" }),
  };

  beforeEach(() => {
    service = new WorkforceService(mockPrisma as any, mockQueue as any);
    jest.clearAllMocks();
  });

  describe("Placements", () => {
    it("should create placement successfully", async () => {
      mockPrisma.candidateProfile.findUnique.mockResolvedValueOnce({ id: "cand-1" });
      mockPrisma.company.findUnique.mockResolvedValueOnce({ id: "comp-1" });
      mockPrisma.placement.create.mockResolvedValueOnce({ id: "place-1" });

      const result = await service.createPlacement({
        candidateId: "cand-1",
        companyId: "comp-1",
        billingRate: 100,
        payRate: 80,
        startDate: "2026-01-01",
      });

      expect(result.id).toBe("place-1");
      expect(mockPrisma.placement.create).toHaveBeenCalled();
      expect(mockQueue.add).toHaveBeenCalledWith("compliance-expiry-check", { candidateId: "cand-1" });
    });

    it("should throw NotFoundException if candidate not found", async () => {
      mockPrisma.candidateProfile.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.createPlacement({
          candidateId: "missing",
          companyId: "comp-1",
          billingRate: 100,
          payRate: 80,
          startDate: "2026-01-01",
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("Assignments & Timesheets", () => {
    it("should submit a timesheet successfully", async () => {
      mockPrisma.placement.findUnique.mockResolvedValueOnce({ id: "place-1" });
      mockPrisma.timesheet.create.mockResolvedValueOnce({ id: "time-1", totalHours: 16 });

      const result = await service.submitTimesheet({
        placementId: "place-1",
        startDate: "2026-01-01",
        endDate: "2026-01-07",
        rows: [
          { date: "2026-01-02", hours: 8, description: "Worked" },
          { date: "2026-01-03", hours: 8, description: "Worked" },
        ],
      });

      expect(result.id).toBe("time-1");
      expect(mockPrisma.timesheet.create).toHaveBeenCalled();
      expect(mockQueue.add).toHaveBeenCalledWith("timesheet-approval-processing", { timesheetId: "time-1" });
    });
  });
});
