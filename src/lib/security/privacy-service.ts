import { prisma } from "@/lib/prisma";

export class PrivacyService {
  /**
   * GDPR Data Export: Returns JSON dump of user profile, applications, resumes, and saved jobs
   */
  static async exportUserData(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        employerProfile: true,
        applications: { include: { job: { select: { title: true, company: { select: { name: true } } } } } },
        resumes: true,
        savedJobs: { include: { job: { select: { title: true } } } },
      },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    return {
      exportedAt: new Date().toISOString(),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      profile: user.profile,
      employerProfile: user.employerProfile,
      applications: user.applications,
      resumes: user.resumes,
      savedJobs: user.savedJobs,
    };
  }

  /**
   * GDPR Right to be Forgotten: Soft-deletes user record and scrubs sensitive PII
   */
  static async requestAccountDeletion(userId: string) {
    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId,
        action: "GDPR_ACCOUNT_DELETION_REQUESTED",
      },
    });

    // Soft delete user record and scrub PII
    return prisma.user.update({
      where: { id: userId },
      data: {
        name: "Anonymized Candidate",
        email: `deleted-${userId}@anonymized.workorajobs.com`,
        passwordHash: "",
        deletedAt: new Date(),
      },
    });
  }
}
