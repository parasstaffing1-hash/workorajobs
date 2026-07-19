import { FinanceService } from "./finance.service";

describe("FinanceService", () => {
  let service: FinanceService;

  const mockPrisma = {
    placement: {
      findUnique: jest.fn(),
    },
    company: {
      findUnique: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    payrollRecord: {
      create: jest.fn(),
    },
    clientInvoice: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    recruiterCommission: {
      create: jest.fn(),
    },
  };

  const mockQueue = {
    registerWorker: jest.fn(),
    add: jest.fn().mockResolvedValue({ id: "job-id" }),
  };

  beforeEach(() => {
    service = new FinanceService(mockPrisma as any, mockQueue as any);
    jest.clearAllMocks();
  });

  describe("Payroll & Invoicing", () => {
    it("should successfully create a payroll record", async () => {
      mockPrisma.placement.findUnique.mockResolvedValueOnce({ id: "place-1" });
      mockPrisma.payrollRecord.create.mockResolvedValueOnce({ id: "pay-1" });

      const result = await service.createPayrollRecord({
        placementId: "place-1",
        payPeriodStart: "2026-01-01",
        payPeriodEnd: "2026-01-15",
        baseEarnings: 5000,
        overtimeEarnings: 500,
        totalDeductions: 1000,
      });

      expect(result.id).toBe("pay-1");
      expect(mockPrisma.payrollRecord.create).toHaveBeenCalled();
      expect(mockQueue.add).toHaveBeenCalledWith("payroll-disbursement", { payrollRecordId: "pay-1" });
    });

    it("should successfully create a client invoice", async () => {
      mockPrisma.company.findUnique.mockResolvedValueOnce({ id: "comp-1" });
      mockPrisma.clientInvoice.create.mockResolvedValueOnce({ id: "inv-1" });

      const result = await service.createClientInvoice({
        companyId: "comp-1",
        invoiceNumber: "INV-2026-001",
        amount: 8000,
        dueDate: "2026-02-01",
      });

      expect(result.id).toBe("inv-1");
      expect(mockPrisma.clientInvoice.create).toHaveBeenCalled();
      expect(mockQueue.add).toHaveBeenCalledWith("invoice-reconciliation", { invoiceId: "inv-1" });
    });
  });
});
