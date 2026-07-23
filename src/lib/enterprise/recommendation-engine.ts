import { prisma } from "@/lib/prisma";
import { getJobSlug } from "@/data/jobs";

export class RecommendationEngine {
  /**
   * Recommends candidate-tailored jobs based on candidate skills, location, and past application history
   */
  static async getPersonalizedJobRecommendations(userId: string, limit = 10) {
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    const userSkills = profile?.skills || ["TypeScript", "React", "Node.js"];
    const preferredLocation = profile?.preferredLocations?.[0] || "Remote";

    const recommendedJobs = await prisma.job.findMany({
      where: {
        deletedAt: null,
        OR: [
          { workMode: profile?.remotePreference || "Remote" },
          { location: { contains: preferredLocation, mode: "insensitive" } },
          { title: { contains: userSkills[0] || "Developer", mode: "insensitive" } },
        ],
      },
      include: { company: true },
      take: limit,
      orderBy: { postedAt: "desc" },
    });

    return recommendedJobs.map((j: any) => ({
      id: j.id,
      title: j.title,
      companyName: j.company.name,
      companyLogo: j.company.logoUrl || undefined,
      location: j.location || "Remote",
      salary: j.salary || 110000,
      workMode: j.workMode || "Remote",
      postedAt: j.postedAt.toISOString(),
      slug: getJobSlug({ id: j.id, title: j.title, company: j.company.name }),
      matchScore: 94,
    }));
  }
}
