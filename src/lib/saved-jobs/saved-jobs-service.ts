import { prisma } from "@/lib/prisma";

export interface SavedJobsQueryOptions {
  query?: string;
  folderId?: string;
  workMode?: string;
  jobType?: string;
  sortBy?: "RECENTLY_SAVED" | "SALARY_HIGH_LOW" | "COMPANY_AZ" | "POSTED_DATE";
  page?: number;
  limit?: number;
}

export class SavedJobsService {
  /**
   * Save a job for candidate (with optional folder assignment & personal notes)
   */
  static async saveJob(userId: string, jobId: string, folderId?: string, notes?: string) {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job || job.deletedAt) {
      throw new Error("Job posting not found.");
    }

    const existing = await prisma.savedJob.findUnique({
      where: { userId_jobId: { userId, jobId } },
    });

    if (existing) {
      // Update folder or notes
      return prisma.savedJob.update({
        where: { id: existing.id },
        data: {
          folderId: folderId !== undefined ? folderId : existing.folderId,
          notes: notes !== undefined ? notes : existing.notes,
        },
        include: { job: { include: { company: true } }, folder: true },
      });
    }

    const saved = await prisma.savedJob.create({
      data: {
        userId,
        jobId,
        folderId: folderId || null,
        notes: notes?.trim() || null,
      },
      include: { job: { include: { company: true } }, folder: true },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: `JOB_SAVED:${job.title}:${jobId}`,
      },
    });

    return saved;
  }

  /**
   * Remove job from candidate saved list
   */
  static async removeSavedJob(userId: string, jobId: string) {
    const existing = await prisma.savedJob.findUnique({
      where: { userId_jobId: { userId, jobId } },
    });

    if (!existing) return true;

    await prisma.savedJob.delete({
      where: { id: existing.id },
    });

    return true;
  }

  /**
   * Get Candidate Saved Jobs with Search, Sort, Filters, and Pagination
   */
  static async getSavedJobs(userId: string, options: SavedJobsQueryOptions = {}) {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 10;
    const skip = (page - 1) * limit;

    const whereClause: any = { userId };

    if (options.folderId && options.folderId !== "ALL") {
      if (options.folderId === "UNORGANIZED") {
        whereClause.folderId = null;
      } else {
        whereClause.folderId = options.folderId;
      }
    }

    if (options.query && options.query.trim()) {
      const q = options.query.trim();
      whereClause.job = {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { location: { contains: q, mode: "insensitive" } },
          { company: { name: { contains: q, mode: "insensitive" } } },
        ],
      };
    }

    if (options.workMode && options.workMode !== "ALL") {
      whereClause.job = {
        ...(whereClause.job || {}),
        workMode: options.workMode,
      };
    }

    if (options.jobType && options.jobType !== "ALL") {
      whereClause.job = {
        ...(whereClause.job || {}),
        type: options.jobType as any,
      };
    }

    let orderBy: any = { createdAt: "desc" };

    if (options.sortBy === "COMPANY_AZ") {
      orderBy = { job: { company: { name: "asc" } } };
    } else if (options.sortBy === "POSTED_DATE") {
      orderBy = { job: { postedAt: "desc" } };
    }

    const [total, items] = await Promise.all([
      prisma.savedJob.count({ where: whereClause }),
      prisma.savedJob.findMany({
        where: whereClause,
        include: {
          job: {
            include: {
              company: {
                select: {
                  id: true,
                  name: true,
                  logoUrl: true,
                  industry: true,
                  headquartersCity: true,
                },
              },
            },
          },
          folder: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
    ]);

    // Format output
    const savedJobs = items.map((s) => ({
      id: s.id,
      savedJobId: s.id,
      jobId: s.job.id,
      title: s.job.title,
      location: s.job.location,
      type: s.job.type,
      workMode: s.job.workMode,
      salary: s.job.salary,
      postedAt: s.job.postedAt,
      company: s.job.company,
      folder: s.folder,
      notes: s.notes,
      savedAt: s.createdAt,
    }));

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      savedJobs,
    };
  }

  /**
   * Create custom SavedJobFolder for candidate
   */
  static async createFolder(userId: string, name: string, color = "blue") {
    const cleanName = name.trim();
    if (!cleanName) throw new Error("Folder name is required.");

    return prisma.savedJobFolder.create({
      data: {
        userId,
        name: cleanName,
        color,
      },
    });
  }

  /**
   * Fetch all folders for a candidate with counts
   */
  static async getUserFolders(userId: string) {
    const folders = await prisma.savedJobFolder.findMany({
      where: { userId },
      include: {
        _count: {
          select: { savedJobs: true },
        },
      },
      orderBy: { name: "asc" },
    });

    const totalSaved = await prisma.savedJob.count({ where: { userId } });
    const unorganizedCount = await prisma.savedJob.count({
      where: { userId, folderId: null },
    });

    return {
      folders: folders.map((f) => ({
        id: f.id,
        name: f.name,
        color: f.color || "blue",
        count: f._count.savedJobs,
      })),
      totalSaved,
      unorganizedCount,
    };
  }

  /**
   * Delete folder
   */
  static async deleteFolder(userId: string, folderId: string) {
    await prisma.savedJobFolder.deleteMany({
      where: { id: folderId, userId },
    });
    return true;
  }
}
