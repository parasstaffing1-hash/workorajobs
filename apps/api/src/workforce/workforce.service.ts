import { Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { QueueService } from "../common/queue/queue.service";
import {
  ClockInOutDto,
  CreateAssignmentDto,
  CreatePlacementDto,
  FileExpenseDto,
  RequestLeaveDto,
  SubmitComplianceDto,
  SubmitTimesheetDto,
} from "./dto/workforce.dto";

@Injectable()
export class WorkforceService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queue: QueueService,
  ) {}

  onModuleInit() {
    this.queue.registerWorker("timesheet-approval-processing", async (data: { timesheetId: string }) => {
      console.log(`[Queue] Processing auto-approvals or rules for timesheet: ${data.timesheetId}`);
    });

    this.queue.registerWorker("compliance-expiry-check", async (data: { candidateId: string }) => {
      console.log(`[Queue] Checking compliance document status for candidate: ${data.candidateId}`);
    });
  }

  async createPlacement(dto: CreatePlacementDto) {
    const candidate = await this.prisma.candidateProfile.findUnique({
      where: { id: dto.candidateId },
    });
    if (!candidate) {
      throw new NotFoundException("Candidate profile not found.");
    }

    const company = await this.prisma.company.findUnique({
      where: { id: dto.companyId },
    });
    if (!company) {
      throw new NotFoundException("Company profile not found.");
    }

    const placement = await this.prisma.placement.create({
      data: {
        candidateId: dto.candidateId,
        companyId: dto.companyId,
        jobId: dto.jobId,
        billingRate: dto.billingRate,
        payRate: dto.payRate,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        status: "ACTIVE",
      },
    });

    await this.queue.add("compliance-expiry-check", { candidateId: dto.candidateId });

    return placement;
  }

  async getPlacements(companyId?: string) {
    return this.prisma.placement.findMany({
      where: companyId ? { companyId } : {},
      include: {
        candidate: { include: { user: { include: { profile: true } } } },
        company: true,
      },
    });
  }

  async createAssignment(dto: CreateAssignmentDto) {
    const placement = await this.prisma.placement.findUnique({
      where: { id: dto.placementId },
    });
    if (!placement) {
      throw new NotFoundException("Placement not found.");
    }

    return this.prisma.assignment.create({
      data: {
        placementId: dto.placementId,
        name: dto.name,
        project: dto.project,
        department: dto.department,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
      },
    });
  }

  async submitTimesheet(dto: SubmitTimesheetDto) {
    const placement = await this.prisma.placement.findUnique({
      where: { id: dto.placementId },
    });
    if (!placement) {
      throw new NotFoundException("Placement not found.");
    }

    const totalHours = dto.rows.reduce((sum, row) => sum + row.hours, 0);

    const timesheet = await this.prisma.timesheet.create({
      data: {
        placementId: dto.placementId,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        totalHours,
        status: "SUBMITTED",
        rows: {
          create: dto.rows.map((row) => ({
            date: new Date(row.date),
            hours: row.hours,
            description: row.description,
          })),
        },
      },
      include: { rows: true },
    });

    await this.queue.add("timesheet-approval-processing", { timesheetId: timesheet.id });

    return timesheet;
  }

  async clockInOut(dto: ClockInOutDto) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: dto.assignmentId },
    });
    if (!assignment) {
      throw new NotFoundException("Assignment not found.");
    }

    if (dto.clockOut) {
      // Find the last open clock-in record
      const lastRecord = await this.prisma.attendanceRecord.findFirst({
        where: { assignmentId: dto.assignmentId, clockOut: null },
        orderBy: { clockIn: "desc" },
      });

      if (!lastRecord) {
        throw new NotFoundException("No active clock-in session found.");
      }

      return this.prisma.attendanceRecord.update({
        where: { id: lastRecord.id },
        data: { clockOut: new Date(dto.clockOut) },
      });
    }

    return this.prisma.attendanceRecord.create({
      data: {
        assignmentId: dto.assignmentId,
        clockIn: dto.clockIn ? new Date(dto.clockIn) : new Date(),
      },
    });
  }

  async requestLeave(dto: RequestLeaveDto) {
    const candidate = await this.prisma.candidateProfile.findUnique({
      where: { id: dto.candidateId },
    });
    if (!candidate) {
      throw new NotFoundException("Candidate profile not found.");
    }

    return this.prisma.leaveRequest.create({
      data: {
        candidateId: dto.candidateId,
        leaveType: dto.leaveType,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        reason: dto.reason,
        status: "PENDING",
      },
    });
  }

  async fileExpense(dto: FileExpenseDto) {
    const candidate = await this.prisma.candidateProfile.findUnique({
      where: { id: dto.candidateId },
    });
    if (!candidate) {
      throw new NotFoundException("Candidate profile not found.");
    }

    return this.prisma.expenseClaim.create({
      data: {
        candidateId: dto.candidateId,
        category: dto.category,
        amount: dto.amount,
        receiptUrl: dto.receiptUrl,
        status: "PENDING",
      },
    });
  }

  async submitCompliance(dto: SubmitComplianceDto) {
    const candidate = await this.prisma.candidateProfile.findUnique({
      where: { id: dto.candidateId },
    });
    if (!candidate) {
      throw new NotFoundException("Candidate profile not found.");
    }

    return this.prisma.workerCompliance.create({
      data: {
        candidateId: dto.candidateId,
        documentType: dto.documentType,
        expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : null,
        status: "PENDING",
      },
    });
  }
}
