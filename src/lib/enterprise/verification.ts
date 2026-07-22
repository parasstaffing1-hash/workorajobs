import { prisma } from "@/lib/prisma";

export class EmployerVerificationService {
  /**
   * Submits company verification request with business email and domain proof
   */
  static async submitVerificationRequest(companyId: string, businessEmail: string, documentsUrl?: string) {
    const domain = businessEmail.split("@")[1];

    return prisma.companyVerification.upsert({
      where: { companyId },
      create: {
        companyId,
        businessEmail,
        domain,
        documentsUrl,
        status: "PENDING",
      },
      update: {
        businessEmail,
        domain,
        documentsUrl,
        status: "PENDING",
      },
    });
  }

  /**
   * Admin approves or rejects employer verification
   */
  static async updateVerificationStatus(adminUserId: string, companyId: string, status: "VERIFIED" | "REJECTED", notes?: string) {
    const verification = await prisma.companyVerification.update({
      where: { companyId },
      data: {
        status,
        verifiedById: adminUserId,
        verifiedAt: status === "VERIFIED" ? new Date() : null,
        notes,
      },
    });

    if (status === "VERIFIED") {
      await prisma.company.update({
        where: { id: companyId },
        data: { rating: 5.0 },
      });
    }

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: adminUserId,
        action: `COMPANY_VERIFICATION_${status}`,
      },
    });

    return verification;
  }
}
