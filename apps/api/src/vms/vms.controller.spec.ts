import { Test, TestingModule } from "@nestjs/testing";
import { Reflector } from "@nestjs/core";
import { SubmissionStatus, VendorRole } from "@prisma/client";

import { VmsController } from "./vms.controller";
import { VmsService } from "./vms.service";
import { AuthenticatedUser } from "../auth/types/authenticated-user.type";

describe("VmsController", () => {
  let controller: VmsController;
  let service: VmsService;

  const mockUser: AuthenticatedUser = {
    sub: "user-123",
    email: "manager@workora.com",
    role: "RECRUITER" as any,
  };

  const mockVmsService = {
    registerVendor: jest.fn(),
    getVendors: jest.fn(),
    getVendorById: jest.fn(),
    addVendorMember: jest.fn(),
    getScorecard: jest.fn(),
    createRequisition: jest.fn(),
    updateRequisition: jest.fn(),
    getRequisitions: jest.fn(),
    getRequisitionById: jest.fn(),
    distributeRequisition: jest.fn(),
    submitCandidate: jest.fn(),
    getSubmissions: jest.fn(),
    updateSubmissionStatus: jest.fn(),
    getAnalytics: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VmsController],
      providers: [
        { provide: VmsService, useValue: mockVmsService },
        Reflector,
      ],
    }).compile();

    controller = module.get<VmsController>(VmsController);
    service = module.get<VmsService>(VmsService);
    jest.clearAllMocks();
  });

  describe("Vendor Registrations", () => {
    it("should call registerVendor on service", async () => {
      const dto = { name: "Apex Staffing" };
      mockVmsService.registerVendor.mockResolvedValueOnce({ id: "v-1", ...dto });

      const result = await controller.registerVendor(dto);
      expect(result.id).toBe("v-1");
      expect(service.registerVendor).toHaveBeenCalledWith(dto);
    });

    it("should call addVendorMember on service", async () => {
      const dto = { userId: "user-abc", role: VendorRole.ADMIN };
      mockVmsService.addVendorMember.mockResolvedValueOnce({ id: "member-1" });

      const result = await controller.addVendorMember("v-1", dto);
      expect(result.id).toBe("member-1");
      expect(service.addVendorMember).toHaveBeenCalledWith("v-1", dto);
    });
  });

  describe("Job Requisition Routes", () => {
    it("should call createRequisition on service", async () => {
      const dto = {
        title: "Dev",
        companyId: "comp-1",
        hiringManagerId: "u-1",
        employmentType: "FULL",
        requiredSkills: ["Node"],
        description: "Dev job",
      };
      mockVmsService.createRequisition.mockResolvedValueOnce({ id: "req-1" });

      const result = await controller.createRequisition(mockUser, dto);
      expect(result.id).toBe("req-1");
      expect(service.createRequisition).toHaveBeenCalledWith(mockUser, dto);
    });

    it("should call distributeRequisition on service", async () => {
      const dto = { vendorIds: ["v-1"] };
      mockVmsService.distributeRequisition.mockResolvedValueOnce([]);

      const result = await controller.distributeRequisition("req-1", dto);
      expect(result).toEqual([]);
      expect(service.distributeRequisition).toHaveBeenCalledWith("req-1", dto);
    });
  });

  describe("Candidate Submission Routes", () => {
    it("should call submitCandidate on service", async () => {
      const dto = { requisitionId: "req-1", vendorId: "v-1", candidateId: "c-1" };
      mockVmsService.submitCandidate.mockResolvedValueOnce({ id: "sub-1" });

      const result = await controller.submitCandidate(dto);
      expect(result.id).toBe("sub-1");
      expect(service.submitCandidate).toHaveBeenCalledWith(dto);
    });

    it("should call updateSubmissionStatus on service", async () => {
      const dto = { status: SubmissionStatus.SHORTLISTED };
      mockVmsService.updateSubmissionStatus.mockResolvedValueOnce({ id: "sub-1", status: SubmissionStatus.SHORTLISTED });

      const result = await controller.updateSubmissionStatus("sub-1", dto);
      expect(result.status).toBe(SubmissionStatus.SHORTLISTED);
      expect(service.updateSubmissionStatus).toHaveBeenCalledWith("sub-1", dto);
    });
  });
});
