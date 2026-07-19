import { Injectable } from "@nestjs/common";
import { FeatureFlagEnvironment, Prisma, UserRole } from "@prisma/client";

import { AuthenticatedUser } from "../auth/types/authenticated-user.type";
import { PrismaService } from "../prisma/prisma.service";
import {
  AssignRoleDto,
  ContentPageDto,
  MaintenanceModeDto,
  PlatformPermissionDto,
  PlatformRoleDto,
  UpsertFeatureFlagDto,
  UpsertSystemSettingDto,
} from "./dto/admin.dto";

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async dashboard() {
    const [
      users,
      companies,
      jobs,
      applications,
      recruiters,
      openInvoices,
      revenue,
      recentAudit,
    ] = await Promise.all([
      this.prisma.user.groupBy({ by: ["role"], _count: { _all: true } }),
      this.prisma.company.count(),
      this.prisma.job.count(),
      this.prisma.jobApplication.count(),
      this.prisma.user.count({ where: { role: UserRole.RECRUITER } }),
      this.prisma.invoice.count({ where: { status: "OPEN" } }),
      this.prisma.invoice.aggregate({
        _sum: { totalCents: true },
        where: { status: "PAID" },
      }),
      this.prisma.auditLog.findMany({
        include: { actor: { include: { profile: true } } },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
    ]);

    return {
      metrics: {
        users: users.reduce((sum, item) => sum + item._count._all, 0),
        companies,
        jobs,
        applications,
        recruiters,
        openInvoices,
        revenueCents: revenue._sum.totalCents ?? 0,
      },
      usersByRole: users.map((item) => ({
        role: item.role,
        count: item._count._all,
      })),
      recentAudit,
    };
  }

  statistics() {
    return Promise.all([
      this.prisma.user.count(),
      this.prisma.company.count(),
      this.prisma.candidateProfile.count(),
      this.prisma.job.count(),
      this.prisma.jobApplication.count(),
      this.prisma.interview.count(),
      this.prisma.auditLog.count(),
      this.prisma.mediaAsset.count(),
    ]).then(
      ([
        users,
        companies,
        candidates,
        jobs,
        applications,
        interviews,
        auditLogs,
        mediaAssets,
      ]) => ({
        users,
        companies,
        candidates,
        jobs,
        applications,
        interviews,
        auditLogs,
        mediaAssets,
      }),
    );
  }

  users(role?: UserRole) {
    return this.prisma.user.findMany({
      include: {
        profile: true,
        roleAssignments: { include: { role: true } },
      },
      orderBy: { createdAt: "desc" },
      where: { role },
      take: 100,
    });
  }

  jobs() {
    return this.prisma.job.findMany({
      include: { company: true, analytics: true, assignedRecruiter: true },
      orderBy: { updatedAt: "desc" },
      take: 100,
    });
  }

  applications() {
    return this.prisma.jobApplication.findMany({
      include: {
        candidate: { include: { profile: true } },
        job: { include: { company: true } },
        currentStage: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 100,
    });
  }

  roles() {
    return this.prisma.platformRole.findMany({
      include: { permissions: { include: { permission: true } } },
      orderBy: { name: "asc" },
    });
  }

  upsertRole(dto: PlatformRoleDto) {
    return this.prisma.platformRole.upsert({
      create: dto,
      update: {
        name: dto.name,
        description: dto.description,
      },
      where: { key: dto.key },
    });
  }

  permissions() {
    return this.prisma.platformPermission.findMany({
      orderBy: [{ resource: "asc" }, { action: "asc" }],
    });
  }

  upsertPermission(dto: PlatformPermissionDto) {
    return this.prisma.platformPermission.upsert({
      create: dto,
      update: {
        resource: dto.resource,
        action: dto.action,
        description: dto.description,
      },
      where: { key: dto.key },
    });
  }

  assignRole(dto: AssignRoleDto) {
    return this.prisma.platformRoleAssignment.upsert({
      create: {
        userId: dto.userId,
        roleId: dto.roleId,
      },
      update: {},
      where: {
        userId_roleId: {
          userId: dto.userId,
          roleId: dto.roleId,
        },
      },
    });
  }

  auditLogs() {
    return this.prisma.auditLog.findMany({
      include: { actor: { include: { profile: true } } },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
  }

  async activityTimeline() {
    const [audit, crm, automation] = await Promise.all([
      this.prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 30,
      }),
      this.prisma.crmActivity.findMany({
        orderBy: { createdAt: "desc" },
        take: 30,
      }),
      this.prisma.automationRun.findMany({
        orderBy: { createdAt: "desc" },
        take: 30,
      }),
    ]);
    return { audit, crm, automation };
  }

  async globalSearch(q = "") {
    const query = q.trim();
    if (!query) return { users: [], companies: [], jobs: [], indexed: [] };
    const contains = { contains: query, mode: "insensitive" as const };
    const [users, companies, jobs, indexed] = await Promise.all([
      this.prisma.user.findMany({
        include: { profile: true },
        where: {
          OR: [
            { email: contains },
            { profile: { is: { firstName: contains } } },
            { profile: { is: { lastName: contains } } },
          ],
        },
        take: 20,
      }),
      this.prisma.company.findMany({
        where: { OR: [{ name: contains }, { industry: contains }] },
        take: 20,
      }),
      this.prisma.job.findMany({
        include: { company: true },
        where: {
          OR: [
            { title: contains },
            { summary: contains },
            { category: contains },
          ],
        },
        take: 20,
      }),
      this.prisma.searchIndexDocument.findMany({
        where: { OR: [{ title: contains }, { content: contains }] },
        take: 20,
      }),
    ]);
    return { users, companies, jobs, indexed };
  }

  content() {
    return this.prisma.contentPage.findMany({
      include: { author: { include: { profile: true } } },
      orderBy: { updatedAt: "desc" },
    });
  }

  upsertContent(user: AuthenticatedUser, dto: ContentPageDto) {
    return this.prisma.contentPage.upsert({
      create: {
        ...dto,
        authorId: user.sub,
        publishedAt: dto.status === "PUBLISHED" ? new Date() : undefined,
      },
      update: {
        title: dto.title,
        excerpt: dto.excerpt,
        body: dto.body,
        status: dto.status,
        publishedAt: dto.status === "PUBLISHED" ? new Date() : undefined,
      },
      where: { slug: dto.slug },
    });
  }

  media() {
    return this.prisma.mediaAsset.findMany({
      include: { uploadedBy: { include: { profile: true } }, company: true },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
  }

  settings() {
    return this.prisma.systemSetting.findMany({
      orderBy: { key: "asc" },
    });
  }

  upsertSetting(dto: UpsertSystemSettingDto) {
    return this.prisma.systemSetting.upsert({
      create: {
        key: dto.key,
        value: dto.value as Prisma.InputJsonValue,
        type: dto.type,
        description: dto.description,
        sensitive: dto.sensitive ?? false,
      },
      update: {
        value: dto.value as Prisma.InputJsonValue,
        type: dto.type,
        description: dto.description,
        sensitive: dto.sensitive,
      },
      where: { key: dto.key },
    });
  }

  featureFlags() {
    return this.prisma.featureFlag.findMany({
      orderBy: [{ environment: "asc" }, { key: "asc" }],
    });
  }

  upsertFeatureFlag(dto: UpsertFeatureFlagDto) {
    const environment = dto.environment ?? FeatureFlagEnvironment.GLOBAL;
    return this.prisma.featureFlag.upsert({
      create: {
        key: dto.key,
        name: dto.name,
        description: dto.description,
        enabled: dto.enabled ?? false,
        environment,
        rolloutPercentage: dto.rolloutPercentage ?? 0,
        conditions: dto.conditions as Prisma.InputJsonValue | undefined,
      },
      update: {
        name: dto.name,
        description: dto.description,
        enabled: dto.enabled,
        rolloutPercentage: dto.rolloutPercentage,
        conditions: dto.conditions as Prisma.InputJsonValue | undefined,
      },
      where: { key_environment: { key: dto.key, environment } },
    });
  }

  maintenance(dto: MaintenanceModeDto) {
    return this.prisma.systemSetting.upsert({
      create: {
        key: "maintenance_mode",
        value: {
          enabled: dto.enabled,
          message: dto.message ?? "Workora Jobs is undergoing maintenance.",
        },
        type: "JSON",
        description: "Global maintenance mode control.",
      },
      update: {
        value: {
          enabled: dto.enabled,
          message: dto.message ?? "Workora Jobs is undergoing maintenance.",
        },
      },
      where: { key: "maintenance_mode" },
    });
  }
}
