import { prisma, validateDatabaseConnection } from "./prisma";

export class DatabaseService {
  // 1. Connection Validation & Health Check
  static async checkHealth() {
    return validateDatabaseConnection();
  }

  // 2. Jobs Repository
  static async getJobs(options?: {
    limit?: number;
    offset?: number;
    companyId?: string;
    location?: string;
    type?: any;
    workMode?: string;
    includeDeleted?: boolean;
  }) {
    const { limit = 20, offset = 0, companyId, location, type, workMode, includeDeleted = false } = options || {};
    
    return prisma.job.findMany({
      where: {
        ...(includeDeleted ? {} : { deletedAt: null }),
        ...(companyId ? { companyId } : {}),
        ...(location ? { location: { contains: location, mode: "insensitive" } } : {}),
        ...(type ? { type } : {}),
        ...(workMode ? { workMode } : {}),
      },
      include: {
        company: true,
      },
      orderBy: { postedAt: "desc" },
      take: limit,
      skip: offset,
    });
  }

  static async getJobById(id: string) {
    return prisma.job.findFirst({
      where: { id, deletedAt: null },
      include: { company: true, applications: true },
    });
  }

  static async createJob(data: {
    title: string;
    description: string;
    location?: string;
    salary?: number;
    type?: any;
    workMode?: string;
    experience?: string;
    companyId: string;
    postedById: string;
  }) {
    return prisma.job.create({
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        salary: data.salary,
        type: data.type || "FULL_TIME",
        workMode: data.workMode || "Remote",
        experience: data.experience || "Mid Level",
        companyId: data.companyId,
        postedById: data.postedById,
      },
      include: { company: true },
    });
  }

  static async softDeleteJob(id: string) {
    return prisma.job.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // 3. Companies Repository
  static async getCompanies(limit = 20) {
    return prisma.company.findMany({
      where: { deletedAt: null },
      include: { _count: { select: { jobs: true } } },
      take: limit,
    });
  }

  static async createCompany(data: {
    name: string;
    description?: string;
    websiteUrl?: string;
    logoUrl?: string;
    domain?: string;
    ownerId: string;
  }) {
    return prisma.company.create({
      data,
    });
  }

  // 4. Locations & Skills Repository
  static async getLocations() {
    return prisma.location.findMany({
      orderBy: { city: "asc" },
    });
  }

  static async getSkills() {
    return prisma.skill.findMany({
      orderBy: { name: "asc" },
    });
  }

  // 5. Applications Repository
  static async createApplication(data: {
    applicantId: string;
    jobId: string;
    resumeUrl?: string;
  }) {
    return prisma.application.create({
      data,
      include: { job: true },
    });
  }
}
