import { prisma } from "@/lib/prisma";
import { JobPostInput } from "@/lib/jobs/job-validation-schemas";
import { generateJobSlug } from "@/lib/jobs/job-slug-generator";
import { CompanyService } from "@/lib/company/company-service";

export interface EmployerJobsOptions {
  status?: string;
  query?: string;
  page?: number;
  limit?: number;
}

export class JobService {
  /**
   * Create Job Posting (Draft, Published, Scheduled)
   */
  static async createJob(userId: string, input: JobPostInput) {
    const { company } = await CompanyService.getEmployerCompany(userId);
    const slug = generateJobSlug(input.title, company.name, input.location);

    const deadline = input.deadlineAt ? new Date(input.deadlineAt) : null;
    const scheduled = input.scheduledPublishAt ? new Date(input.scheduledPublishAt) : null;

    const job = await prisma.job.create({
      data: {
        title: input.title,
        slug,
        department: input.department || null,
        description: input.description,
        responsibilities: input.responsibilities || null,
        requirements: input.requirements || null,
        location: input.location,
        salaryMin: input.salaryMin || null,
        salaryMax: input.salaryMax || null,
        salary: input.salary || input.salaryMax || input.salaryMin || null,
        type: input.type,
        workMode: input.workMode,
        experience: input.experience,
        education: input.education || null,
        skillsRequired: input.skillsRequired,
        openingsCount: input.openingsCount,
        noticePeriod: input.noticePeriod,
        benefits: input.benefits,
        screeningQuestions: input.screeningQuestions || [],
        externalApplyUrl: input.externalApplyUrl || null,
        deadlineAt: deadline,
        scheduledPublishAt: scheduled,
        status: input.status,
        companyId: company.id,
        postedById: userId,
        version: 1,
      },
      include: { company: true },
    });

    // Create Initial Version History
    await prisma.jobVersionHistory.create({
      data: {
        jobId: job.id,
        version: 1,
        title: job.title,
        description: job.description,
        responsibilities: job.responsibilities,
        requirements: job.requirements,
        changedById: userId,
        changeSummary: `Initial ${input.status.toLowerCase()} creation`,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: `JOB_POSTING_CREATED:${job.title}:${job.id}`,
      },
    });

    return job;
  }

  /**
   * Update Job Posting (With Version Increment)
   */
  static async updateJob(userId: string, jobId: string, input: Partial<JobPostInput>) {
    const existing = await prisma.job.findUnique({
      where: { id: jobId },
      include: { company: true },
    });

    if (!existing || existing.deletedAt) {
      throw new Error("Job posting not found.");
    }

    const nextVersion = existing.version + 1;

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        title: input.title !== undefined ? input.title : existing.title,
        department: input.department !== undefined ? input.department : existing.department,
        description: input.description !== undefined ? input.description : existing.description,
        responsibilities: input.responsibilities !== undefined ? input.responsibilities : existing.responsibilities,
        requirements: input.requirements !== undefined ? input.requirements : existing.requirements,
        location: input.location !== undefined ? input.location : existing.location,
        salaryMin: input.salaryMin !== undefined ? input.salaryMin : existing.salaryMin,
        salaryMax: input.salaryMax !== undefined ? input.salaryMax : existing.salaryMax,
        salary: input.salary !== undefined ? input.salary : existing.salary,
        type: input.type !== undefined ? input.type : existing.type,
        workMode: input.workMode !== undefined ? input.workMode : existing.workMode,
        experience: input.experience !== undefined ? input.experience : existing.experience,
        education: input.education !== undefined ? input.education : existing.education,
        skillsRequired: input.skillsRequired !== undefined ? input.skillsRequired : existing.skillsRequired,
        openingsCount: input.openingsCount !== undefined ? input.openingsCount : existing.openingsCount,
        noticePeriod: input.noticePeriod !== undefined ? input.noticePeriod : existing.noticePeriod,
        benefits: input.benefits !== undefined ? input.benefits : existing.benefits,
        screeningQuestions: input.screeningQuestions !== undefined ? input.screeningQuestions : (existing.screeningQuestions as any),
        externalApplyUrl: input.externalApplyUrl !== undefined ? input.externalApplyUrl : existing.externalApplyUrl,
        deadlineAt: input.deadlineAt ? new Date(input.deadlineAt) : existing.deadlineAt,
        scheduledPublishAt: input.scheduledPublishAt ? new Date(input.scheduledPublishAt) : existing.scheduledPublishAt,
        status: input.status !== undefined ? input.status : existing.status,
        version: nextVersion,
      },
      include: { company: true },
    });

    // Record Version History
    await prisma.jobVersionHistory.create({
      data: {
        jobId: updatedJob.id,
        version: nextVersion,
        title: updatedJob.title,
        description: updatedJob.description,
        responsibilities: updatedJob.responsibilities,
        requirements: updatedJob.requirements,
        changedById: userId,
        changeSummary: `Updated to version ${nextVersion}`,
      },
    });

    return updatedJob;
  }

  /**
   * Change Job Status (PUBLISHED, PAUSED, CLOSED, ARCHIVED)
   */
  static async changeJobStatus(userId: string, jobId: string, status: string) {
    const updated = await prisma.job.update({
      where: { id: jobId },
      data: { status },
    });
    return updated;
  }

  /**
   * Duplicate Job Posting into a new Draft
   */
  static async duplicateJob(userId: string, jobId: string) {
    const source = await prisma.job.findUnique({
      where: { id: jobId },
      include: { company: true },
    });

    if (!source) throw new Error("Source job posting not found.");

    const duplicatedInput: JobPostInput = {
      title: `${source.title} (Copy)`,
      department: source.department || undefined,
      type: source.type,
      workMode: source.workMode as any,
      location: source.location || "Remote",
      salaryMin: source.salaryMin,
      salaryMax: source.salaryMax,
      salary: source.salary,
      experience: source.experience || "Mid Level",
      education: source.education,
      skillsRequired: source.skillsRequired,
      openingsCount: source.openingsCount,
      noticePeriod: source.noticePeriod || "Immediate",
      benefits: source.benefits,
      description: source.description,
      responsibilities: source.responsibilities,
      requirements: source.requirements,
      screeningQuestions: (source.screeningQuestions as any) || [],
      externalApplyUrl: source.externalApplyUrl,
      status: "DRAFT",
    };

    return this.createJob(userId, duplicatedInput);
  }

  /**
   * Soft Delete Job
   */
  static async deleteJob(userId: string, jobId: string) {
    await prisma.job.update({
      where: { id: jobId },
      data: { deletedAt: new Date() },
    });
    return true;
  }

  /**
   * Get Employer Jobs List with Filters & Pagination
   */
  static async getEmployerJobs(userId: string, options: EmployerJobsOptions = {}) {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 10;
    const skip = (page - 1) * limit;

    const { company } = await CompanyService.getEmployerCompany(userId);

    const whereClause: any = {
      companyId: company.id,
      deletedAt: null,
    };

    if (options.status && options.status !== "ALL") {
      whereClause.status = options.status;
    }

    if (options.query && options.query.trim()) {
      const q = options.query.trim();
      whereClause.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { location: { contains: q, mode: "insensitive" } },
        { department: { contains: q, mode: "insensitive" } },
      ];
    }

    const [total, items] = await Promise.all([
      prisma.job.count({ where: whereClause }),
      prisma.job.findMany({
        where: whereClause,
        include: {
          company: { select: { name: true, logoUrl: true } },
          _count: { select: { applications: true } },
        },
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      jobs: items.map((j) => ({
        ...j,
        applicantCount: j._count.applications,
      })),
    };
  }
}
