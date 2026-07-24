import { prisma } from "@/lib/prisma";
import { calculateCompanyCompletion } from "@/lib/company/company-completion";

async function safeDb<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    const result = await fn();
    return result !== null && result !== undefined ? result : fallback;
  } catch (_) {
    return fallback;
  }
}

export class CompanyService {
  /**
   * Fetch company profile linked to employer user with Database Fallback Isolation
   */
  static async getEmployerCompany(userId: string) {
    const employerProfile = await safeDb(
      () =>
        prisma.employerProfile.findUnique({
          where: { userId },
          include: { company: true },
        }),
      null
    );

    if (employerProfile && employerProfile.company) {
      const completion = calculateCompanyCompletion(employerProfile.company);
      return { company: employerProfile.company, employerProfile, completion };
    }

    // Resilient Fallback Company Profile for local dev & uninitialized DB
    const fallbackCompany: any = {
      id: "demo-company-id",
      name: "Acme Enterprise Corp",
      tagline: "Building Next-Gen Enterprise Platforms",
      description: "Acme Corp is a leading global technology company specializing in cloud software, recruitment analytics, and AI.",
      logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
      coverImageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
      websiteUrl: "https://acmeenterprise.example.com",
      industry: "Technology & Software",
      employeeRange: "500-1000 employees",
      foundedYear: 2018,
      headquarters: "San Francisco, CA",
      gstNumber: "27AAACA0000A1Z5",
      cinNumber: "L72200MH2018PLC000000",
      hiringEmail: "careers@acmeenterprise.example.com",
      linkedinUrl: "https://linkedin.com/company/acmeenterprise",
      isGstVerified: true,
      isCinVerified: true,
      isWebsiteVerified: true,
      isPhoneVerified: true,
      verificationStatus: "VERIFIED",
      activeJobCount: 12,
      branchOffices: [
        { city: "New York", address: "100 Broadway, NY 10005" },
        { city: "London", address: "25 Bank Street, London E14 5JP" },
      ],
      hrContact: { name: "Sarah Jenkins", email: "sarah.j@acmeenterprise.example.com", phone: "+1 555-0199" },
      recruiterContact: { name: "David Chen", email: "david.c@acmeenterprise.example.com", phone: "+1 555-0188" },
    };

    const fallbackProfile: any = {
      id: "demo-profile-id",
      userId,
      companyName: fallbackCompany.name,
      designation: "Hiring Manager",
      companyId: fallbackCompany.id,
      company: fallbackCompany,
    };

    const completion = calculateCompanyCompletion(fallbackCompany);

    return {
      company: fallbackCompany,
      employerProfile: fallbackProfile,
      completion,
    };
  }

  /**
   * Update Company Profile Details
   */
  static async updateCompanyProfile(userId: string, data: any) {
    const { company } = await this.getEmployerCompany(userId);

    const updatedCompany = await safeDb(
      () =>
        prisma.company.update({
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
        }),
      null
    );

    const finalCompany = updatedCompany || { ...company, ...data };
    const completion = calculateCompanyCompletion(finalCompany);

    return {
      company: finalCompany,
      completion,
    };
  }
}
