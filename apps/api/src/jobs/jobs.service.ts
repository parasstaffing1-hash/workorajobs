import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { JobStatus } from "@prisma/client";

import { AuthenticatedUser } from "../auth/types/authenticated-user.type";
import { CompaniesService, slugify } from "../companies/companies.service";
import { PrismaService } from "../prisma/prisma.service";
import { CreateJobDto } from "./dto/create-job.dto";
import { SearchJobsDto } from "./dto/search-jobs.dto";
import { UpdateJobDto } from "./dto/update-job.dto";

@Injectable()
export class JobsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly companies: CompaniesService,
  ) {}

  async search(query: SearchJobsDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const where = {
      status: JobStatus.PUBLISHED,
      category: query.category,
      employmentType: query.employmentType,
      experienceLevel: query.experienceLevel,
      remotePolicy: query.remotePolicy,
      location: query.location
        ? {
            contains: query.location,
            mode: "insensitive" as const,
          }
        : undefined,
      salaryMin: query.salaryMin ? { gte: query.salaryMin } : undefined,
      salaryMax: query.salaryMax ? { lte: query.salaryMax } : undefined,
      OR: query.keyword
        ? [
            {
              title: { contains: query.keyword, mode: "insensitive" as const },
            },
            {
              summary: {
                contains: query.keyword,
                mode: "insensitive" as const,
              },
            },
            {
              description: {
                contains: query.keyword,
                mode: "insensitive" as const,
              },
            },
            {
              company: {
                name: { contains: query.keyword, mode: "insensitive" as const },
              },
            },
          ]
        : undefined,
    };

    const [items, total] = await Promise.all([
      this.prisma.job.findMany({
        include: { company: true },
        orderBy:
          query.sort === "salary"
            ? { salaryMax: "desc" }
            : { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        where,
      }),
      this.prisma.job.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  featured() {
    return this.prisma.job.findMany({
      include: { company: true },
      orderBy: { publishedAt: "desc" },
      take: 8,
      where: {
        featured: true,
        status: JobStatus.PUBLISHED,
      },
    });
  }

  latest() {
    return this.prisma.job.findMany({
      include: { company: true },
      orderBy: { publishedAt: "desc" },
      take: 12,
      where: {
        status: JobStatus.PUBLISHED,
      },
    });
  }

  async details(id: string) {
    const job = await this.prisma.job.findFirst({
      include: { company: true, analytics: true },
      where: {
        id,
        status: JobStatus.PUBLISHED,
      },
    });
    if (!job) throw new NotFoundException("Job not found.");
    await this.prisma.jobAnalytics.upsert({
      create: { jobId: id, views: 1 },
      update: { views: { increment: 1 } },
      where: { jobId: id },
    });
    return job;
  }

  async listEmployerJobs(user: AuthenticatedUser) {
    const company = await this.companies.getOwnedCompany(user);
    return this.prisma.job.findMany({
      include: { analytics: true, _count: { select: { applications: true } } },
      orderBy: { createdAt: "desc" },
      where: { companyId: company.id },
    });
  }

  async drafts(user: AuthenticatedUser) {
    const company = await this.companies.getOwnedCompany(user);
    return this.prisma.job.findMany({
      orderBy: { updatedAt: "desc" },
      where: { companyId: company.id, status: JobStatus.DRAFT },
    });
  }

  async create(user: AuthenticatedUser, dto: CreateJobDto) {
    const company = await this.companies.getOwnedCompany(user);
    const slug = await this.uniqueJobSlug(company.id, dto.title);
    const job = await this.prisma.job.create({
      data: {
        ...dto,
        applicationDeadline: dto.applicationDeadline
          ? new Date(dto.applicationDeadline)
          : undefined,
        companyId: company.id,
        createdById: user.sub,
        salaryCurrency: dto.salaryCurrency ?? "USD",
        slug,
        analytics: { create: {} },
      },
      include: { analytics: true, company: true },
    });
    return job;
  }

  async getEmployerJob(user: AuthenticatedUser, id: string) {
    const job = await this.assertEmployerJob(user, id);
    return job;
  }

  async update(user: AuthenticatedUser, id: string, dto: UpdateJobDto) {
    const job = await this.assertEmployerJob(user, id);
    return this.prisma.job.update({
      data: {
        ...dto,
        applicationDeadline: dto.applicationDeadline
          ? new Date(dto.applicationDeadline)
          : undefined,
        slug: dto.title
          ? await this.uniqueJobSlug(job.companyId, dto.title, id)
          : undefined,
      },
      include: { analytics: true, company: true },
      where: { id },
    });
  }

  async remove(user: AuthenticatedUser, id: string) {
    await this.assertEmployerJob(user, id);
    await this.prisma.job.delete({ where: { id } });
    return { success: true };
  }

  async duplicate(user: AuthenticatedUser, id: string) {
    const job = await this.assertEmployerJob(user, id);
    const title = `${job.title} Copy`;
    return this.prisma.job.create({
      data: {
        title,
        slug: await this.uniqueJobSlug(job.companyId, title),
        summary: job.summary,
        description: job.description,
        responsibilities: job.responsibilities,
        requirements: job.requirements,
        benefits: job.benefits,
        category: job.category,
        location: job.location,
        country: job.country,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        salaryCurrency: job.salaryCurrency,
        employmentType: job.employmentType,
        experienceLevel: job.experienceLevel,
        remotePolicy: job.remotePolicy,
        featured: false,
        status: JobStatus.DRAFT,
        companyId: job.companyId,
        createdById: user.sub,
        analytics: { create: {} },
      },
    });
  }

  async publish(user: AuthenticatedUser, id: string) {
    await this.assertEmployerJob(user, id);
    return this.prisma.job.update({
      data: {
        status: JobStatus.PUBLISHED,
        publishedAt: new Date(),
        closedAt: null,
      },
      where: { id },
    });
  }

  async close(user: AuthenticatedUser, id: string) {
    const job = await this.assertEmployerJob(user, id);
    await this.prisma.notification.createMany({
      data: job.applications.map((application) => ({
        userId: application.candidateId,
        type: "JOB_CLOSED",
        title: "Job closed",
        body: `${job.title} has been closed.`,
        metadata: { jobId: job.id },
      })),
    });
    return this.prisma.job.update({
      data: { status: JobStatus.CLOSED, closedAt: new Date() },
      where: { id },
    });
  }

  async analytics(user: AuthenticatedUser, id: string) {
    await this.assertEmployerJob(user, id);
    return this.prisma.jobAnalytics.findUnique({ where: { jobId: id } });
  }

  async applicants(user: AuthenticatedUser, id: string) {
    await this.assertEmployerJob(user, id);
    return this.prisma.jobApplication.findMany({
      include: {
        candidate: {
          include: {
            profile: true,
            candidateProfile: { include: { skills: true } },
          },
        },
        timeline: true,
        interviews: true,
      },
      orderBy: { createdAt: "desc" },
      where: { jobId: id },
    });
  }

  async interviewCalendar(user: AuthenticatedUser) {
    const company = await this.companies.getOwnedCompany(user);
    return this.prisma.interview.findMany({
      include: {
        application: {
          include: {
            candidate: { include: { profile: true } },
            job: true,
          },
        },
      },
      orderBy: { startsAt: "asc" },
      where: {
        application: {
          job: {
            companyId: company.id,
          },
        },
      },
    });
  }

  async assertEmployerJob(user: AuthenticatedUser, id: string) {
    const company = await this.companies.getOwnedCompany(user);
    const job = await this.prisma.job.findFirst({
      include: { applications: true, analytics: true, company: true },
      where: { id, companyId: company.id },
    });
    if (!job)
      throw new ForbiddenException("Job is not owned by this employer.");
    return job;
  }

  private async uniqueJobSlug(
    companyId: string,
    title: string,
    existingId?: string,
  ) {
    const base = slugify(title);
    let slug = base;
    let suffix = 2;
    while (
      await this.prisma.job.findFirst({
        where: {
          companyId,
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
}
