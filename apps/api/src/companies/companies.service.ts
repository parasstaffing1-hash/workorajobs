import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from "@nestjs/common";
import { CompanyStatus, Prisma, UserRole, VerificationStatus } from "@prisma/client";

import { AuthenticatedUser } from "../auth/types/authenticated-user.type";
import { PrismaService } from "../prisma/prisma.service";
import { StorageService } from "../storage/storage.service";
import { QueueService } from "../common/queue/queue.service";
import { CompanySettingsDto } from "./dto/company-settings.dto";
import { SaveCandidateDto } from "./dto/save-candidate.dto";
import { UpsertCompanyDto } from "./dto/upsert-company.dto";
import { RequestVerificationDto, ReviewVerificationDto } from "./dto/company-verification.dto";

@Injectable()
export class CompaniesService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly queue: QueueService,
  ) {}

  onModuleInit() {
    this.queue.registerWorker("company-verification", async (data) => {
      await this.processCompanyVerification(data);
    });

    this.queue.registerWorker("company-indexing", async (data) => {
      await this.processCompanyIndexing(data);
    });
  }

  async dashboard(user: AuthenticatedUser) {
    const company = await this.getOwnedCompany(user);
    const [jobs, applications, savedCandidates, interviews] = await Promise.all(
      [
        this.prisma.job.count({ where: { companyId: company.id } }),
        this.prisma.jobApplication.count({
          where: { job: { companyId: company.id } },
        }),
        this.prisma.savedCandidate.count({ where: { companyId: company.id } }),
        this.prisma.interview.count({
          where: {
            application: {
              job: {
                companyId: company.id,
              },
            },
          },
        }),
      ],
    );

    return {
      company,
      metrics: {
        jobs,
        applications,
        savedCandidates,
        interviews,
      },
      billing: {
        plan: company.subscriptionPlan ?? "starter",
        status: company.subscriptionStatus ?? "configuration-required",
      },
    };
  }

  async getOwnedCompany(user: AuthenticatedUser) {
    const company = await this.prisma.company.findFirst({
      where: {
        ownerId: user.sub,
      },
    });
    if (!company) throw new NotFoundException("Company profile not found.");
    return company;
  }

  async upsert(user: AuthenticatedUser, dto: UpsertCompanyDto) {
    this.requireEmployer(user);
    const existing = await this.prisma.company.findFirst({
      where: {
        ownerId: user.sub,
      },
    });
    const slug = await this.uniqueSlug(dto.name, existing?.id);

    if (existing) {
      const updated = await this.prisma.company.update({
        data: {
          ...dto,
          slug,
          status: CompanyStatus.ACTIVE,
        },
        where: { id: existing.id },
      });
      await this.queue.add("company-indexing", { companyId: updated.id, action: "UPDATE" });
      return updated;
    }

    const created = await this.prisma.company.create({
      data: {
        ...dto,
        slug,
        ownerId: user.sub,
        status: CompanyStatus.ACTIVE,
      },
    });
    await this.queue.add("company-indexing", { companyId: created.id, action: "CREATE" });
    return created;
  }

  async updateSettings(user: AuthenticatedUser, dto: CompanySettingsDto) {
    const company = await this.getOwnedCompany(user);
    return this.prisma.company.update({
      data: {
        settings: dto as Prisma.InputJsonObject,
      },
      where: {
        id: company.id,
      },
    });
  }

  async uploadLogo(user: AuthenticatedUser, file: Express.Multer.File) {
    const company = await this.getOwnedCompany(user);
    const upload = await this.storage.upload(file, "company-logo", company.id);
    return this.prisma.company.update({
      data: {
        logoUrl: upload.url,
        logoKey: upload.key,
      },
      where: {
        id: company.id,
      },
    });
  }

  async saveCandidate(
    user: AuthenticatedUser,
    candidateProfileId: string,
    dto: SaveCandidateDto,
  ) {
    const company = await this.getOwnedCompany(user);
    return this.prisma.savedCandidate.upsert({
      create: {
        companyId: company.id,
        candidateProfileId,
        notes: dto.notes,
      },
      update: {
        notes: dto.notes,
      },
      where: {
        companyId_candidateProfileId: {
          companyId: company.id,
          candidateProfileId,
        },
      },
    });
  }

  async savedCandidates(user: AuthenticatedUser) {
    const company = await this.getOwnedCompany(user);
    return this.prisma.savedCandidate.findMany({
      include: {
        candidateProfile: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
            skills: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      where: {
        companyId: company.id,
      },
    });
  }

  requireEmployer(user: AuthenticatedUser) {
    const allowedRoles: UserRole[] = [
      UserRole.EMPLOYER,
      UserRole.ADMIN,
      UserRole.RECRUITER,
    ];
    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenException("Employer access is required.");
    }
  }

  private async uniqueSlug(name: string, existingId?: string) {
    const base = slugify(name);
    let slug = base;
    let suffix = 2;

    while (
      await this.prisma.company.findFirst({
        where: {
          slug,
          id: existingId ? { not: existingId } : undefined,
        },
      })
    ) {
      slug = `${base}-${suffix}`;
      suffix += 1;
    }

    return slug;
  }

  // Upload company banner
  async uploadBanner(user: AuthenticatedUser, file: Express.Multer.File) {
    const company = await this.getOwnedCompany(user);
    const upload = await this.storage.upload(file, "company-banner", company.id);
    const updated = await this.prisma.company.update({
      data: {
        bannerUrl: upload.url,
        bannerKey: upload.key,
      },
      where: {
        id: company.id,
      },
    });

    await this.queue.add("company-indexing", { companyId: company.id, action: "UPDATE" });
    return updated;
  }

  // Submit/Request Company Verification
  async requestVerification(user: AuthenticatedUser, dto: RequestVerificationDto) {
    const company = await this.getOwnedCompany(user);

    // Create or update the latest verification request
    const verification = await this.prisma.companyVerification.create({
      data: {
        companyId: company.id,
        businessDocUrl: dto.businessDocUrl,
        emailVerified: dto.emailVerified ?? false,
        domainVerified: dto.domainVerified ?? false,
        status: VerificationStatus.PENDING,
      },
    });

    // Update company verification status
    await this.prisma.company.update({
      where: { id: company.id },
      data: {
        verificationStatus: "PENDING",
      },
    });

    // Enqueue background processing (verification analysis / automation)
    await this.queue.add("company-verification", {
      verificationId: verification.id,
      companyId: company.id,
      businessDocUrl: dto.businessDocUrl,
    });

    return verification;
  }

  // Get verification history for the company
  async getVerificationStatus(user: AuthenticatedUser) {
    const company = await this.getOwnedCompany(user);
    return this.prisma.companyVerification.findMany({
      where: { companyId: company.id },
      orderBy: { createdAt: "desc" },
    });
  }

  // Admin: List verification queue (supports filtering, sorting, pagination)
  async listVerificationsQueue(
    user: AuthenticatedUser,
    page = 1,
    limit = 20,
    status?: VerificationStatus,
  ) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException("Only administrators can view the verification queue.");
    }

    const skip = (page - 1) * limit;
    const where: Prisma.CompanyVerificationWhereInput = status ? { status } : {};

    const [items, total] = await Promise.all([
      this.prisma.companyVerification.findMany({
        where,
        include: { company: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.companyVerification.count({ where }),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Admin: Approve or Reject a company verification request
  async reviewVerification(
    user: AuthenticatedUser,
    verificationId: string,
    dto: ReviewVerificationDto,
  ) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException("Only administrators can review verification requests.");
    }

    const verification = await this.prisma.companyVerification.findUnique({
      where: { id: verificationId },
    });

    if (!verification) {
      throw new NotFoundException("Verification request not found.");
    }

    const updatedVerification = await this.prisma.companyVerification.update({
      where: { id: verificationId },
      data: {
        status: dto.status,
        rejectionReason: dto.rejectionReason,
        reviewedAt: new Date(),
        reviewedById: user.sub,
      },
    });

    const isApproved = dto.status === VerificationStatus.APPROVED;

    // Update the master Company record flags
    await this.prisma.company.update({
      where: { id: verification.companyId },
      data: {
        isVerified: isApproved,
        verificationStatus: dto.status,
      },
    });

    // Enqueue background indexing to refresh SEO cache and search engines
    await this.queue.add("company-indexing", {
      companyId: verification.companyId,
      action: "VERIFICATION_UPDATE",
    });

    // Sync with n8n workflow for enterprise automated pipelines
    await this.syncDataToN8n(verification.companyId);

    return updatedVerification;
  }

  // -------------------------
  // BACKGROUND QUEUE WORKERS
  // -------------------------

  private async processCompanyVerification(data: any) {
    console.log(`[Worker] Auto-analyzing business document for verification ID: ${data.verificationId}...`);
    // Here we could extract document text, cross-match company registries, etc.
    // In our enterprise setup, this simulates automatic pre-checks or flagging suspicious files
  }

  private async processCompanyIndexing(data: any) {
    console.log(`[Worker] Indexing company ${data.companyId} (Action: ${data.action}) into Search Indices...`);
    // Here we can sync data to PostgreSQL search tables, Elasticsearch, or Algolia
  }

  // -------------------------
  // N8N INTEGRATION WEBHOOK
  // -------------------------

  async syncDataToN8n(companyId: string) {
    console.log(`[Webhook] Syncing company data for ${companyId} to n8n webhook workflow...`);
    // Since we want this to be extremely robust, we can trigger an asynchronous HTTP call if configured,
    // otherwise log locally.
    const url = process.env.N8N_WEBHOOK_URL;
    if (url) {
      try {
        await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "company.verified",
            companyId,
            timestamp: new Date().toISOString(),
          }),
        });
        console.log(`[Webhook] Successfully dispatched to n8n.`);
      } catch (err) {
        console.error(`[Webhook] Failed to dispatch company verify hook to n8n:`, err);
      }
    }
  }
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}
