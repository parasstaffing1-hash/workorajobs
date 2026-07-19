import { Injectable } from "@nestjs/common";
import { Prisma, UserRole } from "@prisma/client";

import { AuthenticatedUser } from "../auth/types/authenticated-user.type";
import { PrismaService } from "../prisma/prisma.service";
import { CreateReportDto, CsvExportDto } from "./dto/analytics.dto";

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async hiringAnalytics(user: AuthenticatedUser) {
    const applicationWhere = this.applicationScope(user);
    const jobWhere = this.jobScope(user);
    const [jobs, applications, interviews, funnel] = await Promise.all([
      this.prisma.job.count({ where: jobWhere }),
      this.prisma.jobApplication.count({ where: applicationWhere }),
      this.prisma.interview.count({ where: this.interviewScope(user) }),
      this.prisma.jobApplication.groupBy({
        by: ["status"],
        _count: { _all: true },
        where: applicationWhere,
      }),
    ]);
    return {
      metrics: { jobs, applications, interviews },
      funnel: funnel.map((item) => ({
        status: item.status,
        count: item._count._all,
      })),
    };
  }

  employerAnalytics(user: AuthenticatedUser) {
    return this.prisma.company.findMany({
      include: {
        jobs: {
          include: {
            analytics: true,
            _count: { select: { applications: true } },
          },
        },
        subscriptions: { include: { plan: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
      where: this.companyScope(user),
    });
  }

  async candidateAnalytics() {
    const [profiles, completion, savedJobs, appliedJobs] = await Promise.all([
      this.prisma.candidateProfile.count(),
      this.prisma.candidateProfile.aggregate({
        _avg: { completionScore: true },
      }),
      this.prisma.savedJob.count(),
      this.prisma.jobApplication.count(),
    ]);
    return {
      profiles,
      averageCompletionScore: Math.round(completion._avg.completionScore ?? 0),
      savedJobs,
      appliedJobs,
    };
  }

  async recruiterPerformance() {
    const recruiters = await this.prisma.user.findMany({
      include: {
        profile: true,
        assignedJobs: { select: { id: true } },
        assignedCandidates: { select: { id: true } },
        recruiterTasks: { select: { status: true } },
      },
      where: { role: "RECRUITER" },
    });

    return recruiters.map((recruiter) => ({
      recruiter,
      assignedJobs: recruiter.assignedJobs.length,
      assignedCandidates: recruiter.assignedCandidates.length,
      openTasks: recruiter.recruiterTasks.filter(
        (task) => task.status !== "DONE",
      ).length,
    }));
  }

  conversionFunnel(user: AuthenticatedUser) {
    return this.prisma.jobApplication.groupBy({
      by: ["status"],
      _count: { _all: true },
      where: this.applicationScope(user),
    });
  }

  reports() {
    return this.prisma.analyticsReport.findMany({
      include: { createdBy: { include: { profile: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  }

  async createReport(user: AuthenticatedUser, dto: CreateReportDto) {
    const summary = await this.summaryFor(user, dto.type);
    return this.prisma.analyticsReport.create({
      data: {
        title: dto.title,
        type: dto.type,
        filters: dto.filters as Prisma.InputJsonValue | undefined,
        summary: summary as Prisma.InputJsonValue,
        createdById: user.sub,
      },
    });
  }

  async createCsvExport(user: AuthenticatedUser, dto: CsvExportDto) {
    const csv = await this.csvFor(user, dto.type);
    const exportRecord = await this.prisma.csvExport.create({
      data: {
        type: dto.type,
        status: "READY",
        filename: `${dto.type}-${Date.now()}.csv`,
        filters: dto.filters as Prisma.InputJsonValue | undefined,
        createdById: user.sub,
        completedAt: new Date(),
      },
    });
    return { export: exportRecord, csv };
  }

  private async summaryFor(user: AuthenticatedUser, type: string) {
    if (type === "recruiter-performance") {
      return this.recruiterPerformance();
    }
    if (type === "candidate-analytics") {
      return this.candidateAnalytics();
    }
    return this.hiringAnalytics(user);
  }

  private async csvFor(user: AuthenticatedUser, type: string) {
    if (type === "applications") {
      const rows = await this.prisma.jobApplication.findMany({
        include: { job: true, candidate: true },
        take: 500,
        where: this.applicationScope(user),
      });
      return [
        "application_id,job_title,candidate_email,status,created_at",
        ...rows.map((row) =>
          [
            row.id,
            this.csv(row.job.title),
            row.candidate.email,
            row.status,
            row.createdAt.toISOString(),
          ].join(","),
        ),
      ].join("\n");
    }
    const rows = await this.prisma.job.findMany({
      include: { company: true, analytics: true },
      take: 500,
      where: this.jobScope(user),
    });
    return [
      "job_id,title,company,status,views,applications",
      ...rows.map((row) =>
        [
          row.id,
          this.csv(row.title),
          this.csv(row.company.name),
          row.status,
          row.analytics?.views ?? 0,
          row.analytics?.applications ?? 0,
        ].join(","),
      ),
    ].join("\n");
  }

  private csv(value: string) {
    return `"${value.replaceAll('"', '""')}"`;
  }

  private companyScope(user: AuthenticatedUser): Prisma.CompanyWhereInput {
    if (user.role !== UserRole.EMPLOYER) return {};
    return { ownerId: user.sub };
  }

  private jobScope(user: AuthenticatedUser): Prisma.JobWhereInput {
    if (user.role !== UserRole.EMPLOYER) return {};
    return { company: { ownerId: user.sub } };
  }

  private applicationScope(
    user: AuthenticatedUser,
  ): Prisma.JobApplicationWhereInput {
    if (user.role !== UserRole.EMPLOYER) return {};
    return { job: { company: { ownerId: user.sub } } };
  }

  private interviewScope(user: AuthenticatedUser): Prisma.InterviewWhereInput {
    if (user.role !== UserRole.EMPLOYER) return {};
    return { application: { job: { company: { ownerId: user.sub } } } };
  }
}
