import { OperationsService } from "./operations.service";

describe("OperationsService", () => {
  let service: OperationsService;

  const mockPrisma = {
    operationalIncident: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
    selfHealingAction: {
      create: jest.fn(),
    },
    graphNode: {
      create: jest.fn(),
    },
    graphEdge: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    agentInstance: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
    agentExecutionLog: {
      create: jest.fn(),
    },
    regionConfig: {
      create: jest.fn(),
    },
    replicationLog: {
      create: jest.fn(),
    },
    composableCapability: {
      create: jest.fn(),
    },
    supportTicket: {
      create: jest.fn(),
    },
    customerHealthScore: {
      create: jest.fn(),
    },
    platformGaRelease: {
      create: jest.fn(),
    },
  };

  const mockQueue = {
    registerWorker: jest.fn(),
    add: jest.fn().mockResolvedValue({ id: "job-id" }),
  };

  beforeEach(() => {
    service = new OperationsService(mockPrisma as any, mockQueue as any);
    jest.clearAllMocks();
  });

  describe("AIOps & Self-Healing", () => {
    it("should trigger incident and dispatch healing job", async () => {
      mockPrisma.operationalIncident.create.mockResolvedValueOnce({ id: "inc-1" });

      const result = await service.triggerIncident({
        title: "Redis connection dropped",
        severity: "CRITICAL",
      });

      expect(result.id).toBe("inc-1");
      expect(mockPrisma.operationalIncident.create).toHaveBeenCalled();
      expect(mockQueue.add).toHaveBeenCalledWith("aiops-incident-remediation", { incidentId: "inc-1" });
    });
  });

  describe("Autonomous AI Agents", () => {
    it("should execute agent reasoning goal successfully", async () => {
      mockPrisma.agentInstance.findUnique.mockResolvedValueOnce({ id: "ag-1" });
      mockPrisma.agentExecutionLog.create.mockResolvedValueOnce({ id: "run-1" });

      const result = await service.runAgent("ag-1", { goal: "Verify candidate mapping" });

      expect(result.id).toBe("run-1");
      expect(mockPrisma.agentExecutionLog.create).toHaveBeenCalled();
    });
  });

  describe("Ecosystem White-Label & GA Releases", () => {
    it("should register a platform GA release successfully", async () => {
      mockPrisma.platformGaRelease.create.mockResolvedValueOnce({ id: "rel-1" });

      const result = await service.registerGaRelease({
        version: "v1.0.0-GA",
        testedBy: "QA Automation Lead",
      });

      expect(result.id).toBe("rel-1");
      expect(mockPrisma.platformGaRelease.create).toHaveBeenCalled();
    });
  });
});
