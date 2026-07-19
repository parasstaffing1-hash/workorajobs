import { MarketplaceService } from "./marketplace.service";

describe("MarketplaceService", () => {
  let service: MarketplaceService;

  const mockPrisma = {
    marketplaceApp: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    appInstallation: {
      create: jest.fn(),
    },
    appReview: {
      create: jest.fn(),
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
    service = new MarketplaceService(mockPrisma as any, mockQueue as any);
    jest.clearAllMocks();
  });

  describe("Apps & Installations", () => {
    it("should publish a marketplace app successfully", async () => {
      const dto = {
        name: "Slack Connector",
        description: "Post notifications to Slack channels",
        version: "1.0.0",
        category: "HR tech",
      };
      mockPrisma.marketplaceApp.create.mockResolvedValueOnce({ id: "app-1", ...dto });

      const result = await service.publishApp(dto);

      expect(result.id).toBe("app-1");
      expect(mockPrisma.marketplaceApp.create).toHaveBeenCalled();
    });

    it("should successfully install an app for a tenant", async () => {
      mockPrisma.marketplaceApp.findUnique.mockResolvedValueOnce({ id: "app-1" });
      mockPrisma.company.findUnique.mockResolvedValueOnce({ id: "comp-1" });
      mockPrisma.appInstallation.create.mockResolvedValueOnce({ id: "install-1" });

      const result = await service.installApp({
        appId: "app-1",
        companyId: "comp-1",
      });

      expect(result.id).toBe("install-1");
      expect(mockPrisma.appInstallation.create).toHaveBeenCalled();
      expect(mockQueue.add).toHaveBeenCalledWith("app-provisioning", { installationId: "install-1" });
    });
  });
});
