import { Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { QueueService } from "../common/queue/queue.service";
import {
  CreateClientInvoiceDto,
  CreatePayrollRecordDto,
  RecordCommissionDto,
} from "./dto/finance.dto";

@Injectable()
export class FinanceService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queue: QueueService,
  ) {}

  onModuleInit() {
    this.queue.registerWorker("payroll-disbursement", async (data: { payrollRecordId: string }) => {
      console.log(`[Queue] Running tax deduction and ACH/Wire process for payroll record: ${data.payrollRecordId}`);
    });

    this.queue.registerWorker("invoice-reconciliation", async (data: { invoiceId: string }) => {
      console.log(`[Queue] Checking payment clearing status for invoice: ${data.invoiceId}`);
    });
  }

  async createPayrollRecord(dto: CreatePayrollRecordDto) {
    const placement = await this.prisma.placement.findUnique({
      where: { id: dto.placementId },
    });
    if (!placement) {
      throw new NotFoundException("Placement not found.");
    }

    const overtime = dto.overtimeEarnings ?? 0;
    const deductions = dto.totalDeductions ?? 0;
    const netPay = dto.baseEarnings + overtime - deductions;

    const record = await this.prisma.payrollRecord.create({
      data: {
        placementId: dto.placementId,
        payPeriodStart: new Date(dto.payPeriodStart),
        payPeriodEnd: new Date(dto.payPeriodEnd),
        baseEarnings: dto.baseEarnings,
        overtimeEarnings: overtime,
        totalDeductions: deductions,
        netPay,
        status: "DRAFT",
        components: {
          create: [
            { type: "BASE", amount: dto.baseEarnings },
            { type: "OVERTIME", amount: overtime },
            { type: "TAX", amount: deductions * 0.8 }, // sample split
            { type: "INSURANCE", amount: deductions * 0.2 },
          ],
        },
      },
      include: { components: true },
    });

    await this.queue.add("payroll-disbursement", { payrollRecordId: record.id });

    return record;
  }

  async createClientInvoice(dto: CreateClientInvoiceDto) {
    const company = await this.prisma.company.findUnique({
      where: { id: dto.companyId },
    });
    if (!company) {
      throw new NotFoundException("Client company not found.");
    }

    const invoice = await this.prisma.clientInvoice.create({
      data: {
        companyId: dto.companyId,
        invoiceNumber: dto.invoiceNumber,
        amount: dto.amount,
        taxAmount: dto.taxAmount ?? 0,
        status: "DRAFT",
        dueDate: new Date(dto.dueDate),
      },
    });

    await this.queue.add("invoice-reconciliation", { invoiceId: invoice.id });

    return invoice;
  }

  async getClientInvoices(companyId?: string) {
    return this.prisma.clientInvoice.findMany({
      where: companyId ? { companyId } : {},
      include: { company: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async recordCommission(dto: RecordCommissionDto) {
    const recruiter = await this.prisma.user.findUnique({
      where: { id: dto.recruiterId },
    });
    if (!recruiter) {
      throw new NotFoundException("Recruiter profile not found.");
    }

    const placement = await this.prisma.placement.findUnique({
      where: { id: dto.placementId },
    });
    if (!placement) {
      throw new NotFoundException("Placement not found.");
    }

    return this.prisma.recruiterCommission.create({
      data: {
        recruiterId: dto.recruiterId,
        placementId: dto.placementId,
        amount: dto.amount,
        status: "PENDING",
      },
    });
  }
}
