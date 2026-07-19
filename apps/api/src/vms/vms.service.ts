import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { RequisitionStatus, SubmissionStatus, VendorStatus } from "@prisma/client";

import { AuthenticatedUser } from "../auth/types/authenticated-user.type";
import { PrismaService } from "../prisma/prisma.service";
import { QueueService } from "../common/queue/queue.service";
import {
  AddVendorMemberDto,
  CreateRequisitionDto,
  DistributeRequisitionDto,
  RegisterVendorDto,
  SubmitCandidateDto,
  UpdateRequisitionDto,
  UpdateSubmissionStatusDto,
} from "./dto/vms.dto";

@Injectable()
export class VmsService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queue: QueueService,
  ) {}

  onModuleInit() {
    this.queue.registerWorker("vendor-distribution", async (data: { requisitionId: string }) => {
      console.log(`[Queue] Distributing job requisition: ${data.requisitionId}`);
    });

    this.queue.registerWorker("sla-monitoring", async (data: { vendorId: string }) => {
      console.log(`[Queue] Monitoring SLAs for vendor: ${data.vendorId}`);
    });

    this.queue.registerWorker("scorecard-calculation", async (data: { vendorId: string }) => {
      console.log(`[Queue] Recalculating performance scorecard for vendor: ${data.vendorId}`);
      await this.recalculatePerformance(data.vendorId);
    });

    this.queue.registerWorker("n8n-dispatch", async (data: { event: string; payload: any }) => {
      console.log(`[Queue] Dispatching VMS event to n8n webhook: ${data.event}`);
    });
  }

  // 1. Vendor Organization Management
  async registerVendor(dto: RegisterVendorDto) {
    return this.prisma.vendorProfile.create({
      data: {
        name: dto.name,
        category: dto.category,
        specialization: dto.specialization,
        primaryContact: dto.primaryContact,
        billingContact: dto.billingContact,
        companyId: dto.companyId ? dto.companyId : null,
        status: VendorStatus.PENDING,
      },
    });
  }

  async getVendors() {
    return this.prisma.vendorProfile.findMany({
      include: {
        members: { include: { user: { include: { profile: true } } } },
      },
    });
  }

  async getVendorById(id: string) {
    const vendor = await this.prisma.vendorProfile.findUnique({
      where: { id },
      include: {
        members: { include: { user: { include: { profile: true } } } },
        distributions: { include: { requisition: true } },
        submissions: { include: { requisition: true, candidate: true } },
        scorecards: true,
        slaViolations: true,
      },
    });
    if (!vendor) {
      throw new NotFoundException("Vendor profile not found.");
    }
    return vendor;
  }

  async addVendorMember(vendorId: string, dto: AddVendorMemberDto) {
    const vendor = await this.prisma.vendorProfile.findUnique({ where: { id: vendorId } });
    if (!vendor) {
      throw new NotFoundException("Vendor profile not found.");
    }

    return this.prisma.vendorMember.create({
      data: {
        vendorId,
        userId: dto.userId,
        role: dto.role,
      },
      include: { user: true },
    });
  }

  // 2. Client Job Requisitions
  async createRequisition(user: AuthenticatedUser, dto: CreateRequisitionDto) {
    const clientCompany = await this.prisma.company.findUnique({
      where: { id: dto.companyId },
    });
    if (!clientCompany) {
      throw new NotFoundException("Client company profile not found.");
    }

    const reqNumber = `REQ-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    return this.prisma.jobRequisition.create({
      data: {
        requisitionNumber: reqNumber,
        companyId: dto.companyId,
        jobId: dto.jobId,
        title: dto.title,
        department: dto.department,
        hiringManagerId: dto.hiringManagerId,
        location: dto.location,
        employmentType: dto.employmentType,
        numberOfOpenings: dto.numberOfOpenings ?? 1,
        minSalary: dto.minSalary,
        maxSalary: dto.maxSalary,
        requiredSkills: dto.requiredSkills,
        preferredSkills: dto.preferredSkills ?? [],
        priority: dto.priority ?? "MEDIUM",
        status: RequisitionStatus.DRAFT,
        deadline: dto.deadline ? new Date(dto.deadline) : null,
        expectedStartDate: dto.expectedStartDate ? new Date(dto.expectedStartDate) : null,
        description: dto.description,
      },
    });
  }

  async updateRequisition(id: string, dto: UpdateRequisitionDto) {
    const requisition = await this.prisma.jobRequisition.findUnique({ where: { id } });
    if (!requisition) {
      throw new NotFoundException("Job requisition not found.");
    }

    return this.prisma.jobRequisition.update({
      where: { id },
      data: {
        title: dto.title,
        department: dto.department,
        location: dto.location,
        status: dto.status,
        numberOfOpenings: dto.numberOfOpenings,
        priority: dto.priority,
        description: dto.description,
      },
    });
  }

  async getRequisitions(companyId?: string) {
    return this.prisma.jobRequisition.findMany({
      where: companyId ? { companyId } : {},
      include: {
        company: true,
        hiringManager: { include: { profile: true } },
        distributions: { include: { vendor: true } },
        submissions: { include: { vendor: true, candidate: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getRequisitionById(id: string) {
    const requisition = await this.prisma.jobRequisition.findUnique({
      where: { id },
      include: {
        company: true,
        hiringManager: { include: { profile: true } },
        distributions: { include: { vendor: true } },
        submissions: { include: { vendor: true, candidate: true } },
      },
    });
    if (!requisition) {
      throw new NotFoundException("Job requisition not found.");
    }
    return requisition;
  }

  // 3. Requisition Distribution
  async distributeRequisition(requisitionId: string, dto: DistributeRequisitionDto) {
    const requisition = await this.prisma.jobRequisition.findUnique({ where: { id: requisitionId } });
    if (!requisition) {
      throw new NotFoundException("Job requisition not found.");
    }

    const distributions = await Promise.all(
      dto.vendorIds.map(async (vendorId) => {
        const vendor = await this.prisma.vendorProfile.findUnique({ where: { id: vendorId } });
        if (!vendor) {
          throw new NotFoundException(`Vendor profile with ID ${vendorId} not found.`);
        }

        return this.prisma.vendorDistribution.upsert({
          where: {
            requisitionId_vendorId: { requisitionId, vendorId },
          },
          create: {
            requisitionId,
            vendorId,
            status: "ACTIVE",
          },
          update: {
            status: "ACTIVE",
          },
        });
      }),
    );

    // Automatically transition requisition to VENDOR_DISTRIBUTION status
    await this.prisma.jobRequisition.update({
      where: { id: requisitionId },
      data: { status: RequisitionStatus.VENDOR_DISTRIBUTION },
    });

    await this.queue.add("vendor-distribution", { requisitionId });

    return distributions;
  }

  // 4. Vendor Candidate Submission Portal
  async submitCandidate(dto: SubmitCandidateDto) {
    // Verify distribution exists and is active
    const distribution = await this.prisma.vendorDistribution.findUnique({
      where: {
        requisitionId_vendorId: {
          requisitionId: dto.requisitionId,
          vendorId: dto.vendorId,
        },
      },
    });

    if (!distribution || distribution.status !== "ACTIVE") {
      throw new BadRequestException("Requisition is not distributed to this vendor.");
    }

    // Verify candidate exists
    const candidate = await this.prisma.candidateProfile.findUnique({
      where: { id: dto.candidateId },
    });
    if (!candidate) {
      throw new NotFoundException("Candidate profile not found.");
    }

    // Verify duplicate submission prevention
    const existing = await this.prisma.vendorSubmission.findUnique({
      where: {
        requisitionId_vendorId_candidateId: {
          requisitionId: dto.requisitionId,
          vendorId: dto.vendorId,
          candidateId: dto.candidateId,
        },
      },
    });
    if (existing) {
      throw new BadRequestException("Candidate has already been submitted to this requisition by this vendor.");
    }

    const submission = await this.prisma.vendorSubmission.create({
      data: {
        requisitionId: dto.requisitionId,
        vendorId: dto.vendorId,
        candidateId: dto.candidateId,
        expectedRate: dto.expectedRate,
        availability: dto.availability,
        notes: dto.notes,
        status: SubmissionStatus.SUBMITTED,
      },
    });

    await this.queue.add("scorecard-calculation", { vendorId: dto.vendorId });
    await this.queue.add("n8n-dispatch", { event: "candidate_submitted", payload: submission });

    return submission;
  }

  async getSubmissions(vendorId?: string, requisitionId?: string) {
    const where: any = {};
    if (vendorId) where.vendorId = vendorId;
    if (requisitionId) where.requisitionId = requisitionId;

    return this.prisma.vendorSubmission.findMany({
      where,
      include: {
        requisition: { include: { company: true } },
        vendor: true,
        candidate: { include: { user: { include: { profile: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateSubmissionStatus(id: string, dto: UpdateSubmissionStatusDto) {
    const submission = await this.prisma.vendorSubmission.findUnique({ where: { id } });
    if (!submission) {
      throw new NotFoundException("Vendor submission not found.");
    }

    const updated = await this.prisma.vendorSubmission.update({
      where: { id },
      data: { status: dto.status },
    });

    await this.queue.add("scorecard-calculation", { vendorId: submission.vendorId });
    await this.queue.add("n8n-dispatch", { event: "submission_status_changed", payload: updated });

    return updated;
  }

  // 5. SLA & Performance Scorecard Engine
  async logSlaViolation(vendorId: string, slaType: string, description: string) {
    const violation = await this.prisma.vendorSlaViolation.create({
      data: {
        vendorId,
        slaType,
        description,
      },
    });

    await this.queue.add("scorecard-calculation", { vendorId });
    await this.queue.add("n8n-dispatch", { event: "sla_violated", payload: violation });

    return violation;
  }

  async recalculatePerformance(vendorId: string) {
    const [submissions, violations] = await Promise.all([
      this.prisma.vendorSubmission.findMany({ where: { vendorId } }),
      this.prisma.vendorSlaViolation.findMany({ where: { vendorId } }),
    ]);

    const totalSubmissions = submissions.length;
    if (totalSubmissions === 0) return;

    const placements = submissions.filter(
      (s) => s.status === SubmissionStatus.PLACEMENT_CONFIRMED || s.status === SubmissionStatus.OFFER_ACCEPTED,
    ).length;
    const interviews = submissions.filter(
      (s) => s.status === SubmissionStatus.INTERVIEW_SCHEDULED || s.status === SubmissionStatus.INTERVIEW_COMPLETED,
    ).length;

    // Score Calculations (0-100 scales)
    const submissionScore = Math.min(100, (totalSubmissions / 5) * 100);
    const placementScore = totalSubmissions > 0 ? (placements / totalSubmissions) * 100 : 0;
    const feedbackScore = totalSubmissions > 0 ? (interviews / totalSubmissions) * 100 : 0;
    const timeToFillScore = 85.0; // Benchmark fallback

    const totalViolations = violations.length;
    const slaCompliance = Math.max(0, 100 - totalViolations * 10); // Deduct 10 points per violation

    // Weighted Overall Score
    const overallScore =
      placementScore * 0.4 +
      feedbackScore * 0.3 +
      slaCompliance * 0.2 +
      submissionScore * 0.1;

    // Create Scorecard Record
    await this.prisma.vendorScorecard.create({
      data: {
        vendorId,
        submissionScore,
        placementScore,
        feedbackScore,
        timeToFillScore,
        slaCompliance,
        overallScore,
      },
    });

    // Update Vendor Profile Score
    await this.prisma.vendorProfile.update({
      where: { id: vendorId },
      data: { performanceScore: overallScore },
    });
  }

  async getScorecard(vendorId: string) {
    const scorecard = await this.prisma.vendorScorecard.findFirst({
      where: { vendorId },
      orderBy: { calculatedAt: "desc" },
    });
    if (!scorecard) {
      return {
        submissionScore: 100.0,
        placementScore: 100.0,
        feedbackScore: 100.0,
        timeToFillScore: 100.0,
        slaCompliance: 100.0,
        overallScore: 100.0,
      };
    }
    return scorecard;
  }

  async getAnalytics() {
    const [totalVendors, totalRequisitions, totalSubmissions, activePlacements] = await Promise.all([
      this.prisma.vendorProfile.count(),
      this.prisma.jobRequisition.count(),
      this.prisma.vendorSubmission.count(),
      this.prisma.vendorSubmission.count({
        where: { status: SubmissionStatus.PLACEMENT_CONFIRMED },
      }),
    ]);

    const pipeline = await this.prisma.vendorSubmission.groupBy({
      by: ["status"],
      _count: { _all: true },
    });

    return {
      metrics: {
        totalVendors,
        totalRequisitions,
        totalSubmissions,
        activePlacements,
      },
      pipeline: pipeline.map((item) => ({
        status: item.status,
        count: item._count._all,
      })),
    };
  }
}
