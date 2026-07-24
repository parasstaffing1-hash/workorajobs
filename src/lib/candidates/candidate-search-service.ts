import { prisma } from "@/lib/prisma";

export interface CandidateSearchOptions {
  query?: string;
  skills?: string[];
  minExp?: number;
  maxExp?: number;
  location?: string;
  maxSalary?: number;
  noticePeriod?: string;
  education?: string;
  language?: string;
  sortBy?: "RELEVANCE" | "EXPERIENCE_DESC" | "SALARY_ASC" | "RECENT";
  page?: number;
  limit?: number;
}

export class CandidateSearchService {
  /**
   * Search Candidate Profiles with Granular Enterprise Filters
   */
  static async searchCandidates(employerUserId: string, options: CandidateSearchOptions = {}) {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 10;
    const skip = (page - 1) * limit;

    const whereClause: any = {
      user: { role: "JOB_SEEKER", deletedAt: null },
      profileVisibility: { in: ["PUBLIC", "RECRUITERS_ONLY"] },
    };

    if (options.query && options.query.trim()) {
      const q = options.query.trim();
      whereClause.OR = [
        { headline: { contains: q, mode: "insensitive" } },
        { summary: { contains: q, mode: "insensitive" } },
        { location: { contains: q, mode: "insensitive" } },
        { user: { name: { contains: q, mode: "insensitive" } } },
      ];
    }

    if (options.location && options.location.trim()) {
      whereClause.location = { contains: options.location.trim(), mode: "insensitive" };
    }

    if (options.noticePeriod && options.noticePeriod !== "ALL") {
      whereClause.noticePeriod = options.noticePeriod;
    }

    if (options.maxSalary && options.maxSalary > 0) {
      whereClause.salaryExpectation = { lte: options.maxSalary };
    }

    if (options.skills && options.skills.length > 0) {
      whereClause.skills = { hasSome: options.skills };
    }

    let orderBy: any = { updatedAt: "desc" };
    if (options.sortBy === "SALARY_ASC") {
      orderBy = { salaryExpectation: "asc" };
    }

    const [total, profiles] = await Promise.all([
      prisma.userProfile.count({ where: whereClause }),
      prisma.userProfile.findMany({
        where: whereClause,
        include: {
          user: { select: { id: true, name: true, email: true } },
          experienceList: { orderBy: { startDate: "desc" }, take: 2 },
          educationList: { orderBy: { startDate: "desc" }, take: 1 },
          skillList: true,
          certificationList: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      candidates: profiles.map((p) => ({
        id: p.id,
        userId: p.userId,
        name: p.user.name || "Candidate",
        email: p.contactVisibility !== "PRIVATE" ? p.user.email : undefined,
        photoUrl: p.photoUrl || undefined,
        headline: p.headline || "Software Engineer",
        summary: p.summary || undefined,
        location: p.location || "Remote",
        skills: p.skills,
        experienceYrs: p.experienceList.length * 2,
        expectedSalary: p.salaryExpectation || undefined,
        noticePeriod: p.noticePeriod || "Immediate",
        experiences: p.experienceList,
        education: p.educationList[0]?.degree || undefined,
        certificationsCount: p.certificationList.length,
      })),
    };
  }

  /**
   * Save Candidate Search Filter Criteria
   */
  static async saveCandidateSearch(userId: string, title: string, filters: any) {
    return prisma.savedCandidateSearch.create({
      data: {
        userId,
        title: title.trim(),
        filtersJson: filters,
      },
    });
  }

  /**
   * Get Saved Candidate Searches
   */
  static async getSavedCandidateSearches(userId: string) {
    return prisma.savedCandidateSearch.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Send Direct Job Invitation to Candidate
   */
  static async inviteCandidateToApply(
    employerUserId: string,
    candidateUserId: string,
    jobId: string,
    message?: string
  ) {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new Error("Job posting not found.");

    await prisma.notification.create({
      data: {
        userId: candidateUserId,
        title: `Job Invitation: ${job.title}`,
        message: message || `An employer has invited you to apply for ${job.title}!`,
        type: "JOB_INVITATION",
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: employerUserId,
        action: `CANDIDATE_INVITED:${candidateUserId}:${jobId}`,
      },
    });

    return true;
  }
}
