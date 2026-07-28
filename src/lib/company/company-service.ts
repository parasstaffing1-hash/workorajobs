import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { calculateCompanyCompletion } from "@/lib/company/company-completion";

const PERSONAL_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "hotmail.com",
  "outlook.com",
  "yahoo.com",
]);

function companySlug(name: string, userId: string) {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "company";
  return `${base.slice(0, 70)}-${userId.slice(-8).toLowerCase()}`;
}

export class CompanyService {
  /**
   * Provision or repair the real company workspace owned by an employer.
   * This never returns fabricated IDs and is safe to call repeatedly.
   */
  static async provisionEmployerCompany(db: Prisma.TransactionClient, userId: string) {
    const account = await db.user.findUnique({
      where: { id: userId },
      include: { employerProfile: { include: { company: true } } },
    });

    if (!account || account.role !== "EMPLOYER" || !account.employerProfile) {
      throw new Error("A valid employer account is required to manage job postings.");
    }

    if (account.employerProfile.company && !account.employerProfile.company.deletedAt) {
      return {
        company: account.employerProfile.company,
        employerProfile: account.employerProfile,
      };
    }

    let company = await db.company.findUnique({
      where: { ownerId: userId },
    });

    if (!company || company.deletedAt) {
      const emailDomain = account.email.split("@")[1]?.toLowerCase() || null;
      const usableDomain = emailDomain && !PERSONAL_EMAIL_DOMAINS.has(emailDomain) ? emailDomain : null;
      const domainOwner = usableDomain
        ? await db.company.findFirst({
            where: {
              OR: [{ officialDomain: usableDomain }, { domain: usableDomain }],
            },
            select: { id: true },
          })
        : null;

      company = await db.company.create({
        data: {
          name: account.employerProfile.companyName,
          slug: companySlug(account.employerProfile.companyName, userId),
          ownerId: userId,
          officialDomain: domainOwner ? null : usableDomain,
          domain: domainOwner ? null : usableDomain,
          hiringEmail: account.employerProfile.businessEmail || account.email,
          verificationStatus: "PENDING",
          indexingStatus: "draft",
          contentQualityScore: 0,
        },
      });
    }

    const employerProfile = await db.employerProfile.update({
      where: { userId },
      data: { companyId: company.id },
      include: { company: true },
    });

    return { company, employerProfile };
  }

  static async ensureEmployerCompany(userId: string) {
    return prisma.$transaction((db) => this.provisionEmployerCompany(db, userId));
  }

  /**
   * Fetch the real company profile linked to an employer user.
   */
  static async getEmployerCompany(userId: string) {
    const { company, employerProfile } = await this.ensureEmployerCompany(userId);
    const completion = calculateCompanyCompletion(company);
    return { company, employerProfile, completion };
  }

  /**
   * Update Company Profile Details
   */
  static async updateCompanyProfile(userId: string, data: any) {
    const { company } = await this.getEmployerCompany(userId);

    const updatedCompany = await prisma.company.update({
      where: { id: company.id },
      data: {
        name: data.name !== undefined ? data.name : company.name,
        tagline: data.tagline !== undefined ? data.tagline : company.tagline,
        description: data.description !== undefined ? data.description : company.description,
        logoUrl: data.logoUrl !== undefined ? data.logoUrl : company.logoUrl,
        coverImageUrl: data.coverImageUrl !== undefined ? data.coverImageUrl : company.coverImageUrl,
        websiteUrl: data.websiteUrl || data.website !== undefined ? data.websiteUrl || data.website : company.websiteUrl,
        industry: data.industry !== undefined ? data.industry : company.industry,
        employeeRange: data.employeeRange !== undefined ? data.employeeRange : company.employeeRange,
        foundedYear: data.foundedYear ? parseInt(data.foundedYear, 10) : company.foundedYear,
        gstNumber: data.gstNumber !== undefined ? data.gstNumber : company.gstNumber,
        cinNumber: data.cinNumber !== undefined ? data.cinNumber : company.cinNumber,
        hiringEmail: data.hiringEmail !== undefined ? data.hiringEmail : company.hiringEmail,
        hrContact: data.hrContact !== undefined ? data.hrContact : company.hrContact,
        recruiterContact: data.recruiterContact !== undefined ? data.recruiterContact : company.recruiterContact,
        linkedinUrl: data.linkedinUrl !== undefined ? data.linkedinUrl : company.linkedinUrl,
        twitterUrl: data.twitterUrl !== undefined ? data.twitterUrl : company.twitterUrl,
      },
    });

    const completion = calculateCompanyCompletion(updatedCompany);

    return {
      company: updatedCompany,
      completion,
    };
  }
}
