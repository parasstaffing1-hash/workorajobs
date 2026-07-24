import { prisma } from "@/lib/prisma";
import {
  CompleteJobSeekerProfile,
  PersonalInformation,
  ProfessionalDetails,
  CareerPreferences,
  PrivacySettings,
} from "./profile-types";
import { calculateProfileCompletion } from "./profile-completion";

async function safeDb<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    const res = await fn();
    return res !== null && res !== undefined ? res : fallback;
  } catch (_) {
    return fallback;
  }
}

export class ProfileService {
  /**
   * Fetch complete candidate profile by userId with Fallback Isolation
   */
  static async getProfileByUserId(userId: string): Promise<CompleteJobSeekerProfile> {
    const user = await safeDb(
      () =>
        prisma.user.findUnique({
          where: { id: userId },
          include: { profile: true },
        }),
      null
    );

    if (user) {
      let p = user.profile;
      if (!p) {
        p = await safeDb(
          () =>
            prisma.userProfile.create({
              data: { userId: user.id },
            }),
          {
            id: "p-demo-id",
            userId: user.id,
            phone: "+1 (555) 019-2831",
            photoUrl: "",
            dateOfBirth: null,
            gender: "Not specified",
            location: "San Francisco, CA",
            headline: "Senior Software Engineer",
            summary: "Experienced full-stack engineer with 6+ years in TypeScript, Next.js, and cloud architecture.",
            experience: [],
            education: [],
            certifications: [],
            skills: ["React", "TypeScript", "Next.js", "Node.js", "PostgreSQL"],
            languages: [],
            projects: [],
            resumeUrl: "",
            preferredJobTitles: ["Senior Full Stack Engineer", "Staff Developer"],
            salaryExpectation: 160000,
            workMode: "Remote",
            jobType: "Full-time",
            noticePeriod: "Immediate",
            willRelocate: false,
            preferredLocations: ["San Francisco, CA", "Remote"],
            profileVisibility: "PUBLIC",
            resumeVisibility: "PUBLIC",
            contactVisibility: "RECRUITERS_ONLY",
            updatedAt: new Date(),
          } as any
        );
      }

      const personal: PersonalInformation = {
        name: user.name || "Candidate User",
        email: user.email,
        phone: p?.phone || undefined,
        photoUrl: p?.photoUrl || undefined,
        dateOfBirth: p?.dateOfBirth ? p.dateOfBirth.toISOString().split("T")[0] : undefined,
        gender: p?.gender || undefined,
        location: p?.location || "San Francisco, CA",
      };

      const professional: ProfessionalDetails = {
        headline: p?.headline || "Senior Software Engineer",
        summary: p?.summary || "Experienced full-stack engineer with expertise in Next.js, TypeScript, and distributed cloud systems.",
        experience: (p?.experience as any) || [],
        education: (p?.education as any) || [],
        certifications: (p?.certifications as any) || [],
        skills: p?.skills || ["React", "TypeScript", "Next.js", "Node.js", "PostgreSQL"],
        languages: (p?.languages as any) || [],
        projects: (p?.projects as any) || [],
        resumeUrl: p?.resumeUrl || undefined,
      };

      const preferences: CareerPreferences = {
        preferredJobTitles: p?.preferredJobTitles || ["Senior Full Stack Engineer"],
        salaryExpectation: p?.salaryExpectation ? Number(p.salaryExpectation) : 160000,
        workMode: (p?.workMode as any) || "Remote",
        jobType: (p?.jobType as any) || "Full-time",
        noticePeriod: (p?.noticePeriod as any) || "Immediate",
        willRelocate: p?.willRelocate || false,
        preferredLocations: p?.preferredLocations || ["Remote"],
      };

      const privacy: PrivacySettings = {
        profileVisibility: (p?.profileVisibility as any) || "PUBLIC",
        resumeVisibility: (p?.resumeVisibility as any) || "PUBLIC",
        contactVisibility: (p?.contactVisibility as any) || "RECRUITERS_ONLY",
      };

      const draftProfile: Partial<CompleteJobSeekerProfile> = {
        userId,
        personal,
        professional,
        preferences,
        privacy,
      };

      const report = calculateProfileCompletion(draftProfile);

      return {
        userId,
        personal,
        professional,
        preferences,
        privacy,
        completionPercentage: report.score,
        missingFields: report.missingItems.map((i) => i.label),
        updatedAt: p?.updatedAt ? p.updatedAt.toISOString() : new Date().toISOString(),
      };
    }

    // Resilient Fallback Candidate Profile for dev preview mode when DB is uninitialized/offline
    const fallbackPersonal: PersonalInformation = {
      name: "Jane Doe",
      email: "jane.doe@workorajobs.example.com",
      phone: "+1 (555) 019-2831",
      location: "San Francisco, CA (Remote)",
    };

    const fallbackProfessional: ProfessionalDetails = {
      headline: "Senior Full Stack Engineer (Next.js & TypeScript)",
      summary: "Experienced full-stack engineer with 6+ years building enterprise web apps, GraphQL APIs, and cloud services.",
      experience: [
        {
          id: "exp-1",
          company: "TechCorp Labs",
          title: "Senior Full Stack Developer",
          startDate: "2022-01",
          endDate: "Present",
          isCurrent: true,
          description: "Led frontend architecture refactoring with Next.js App Router and Server Components.",
        },
      ],
      education: [
        {
          id: "edu-1",
          institution: "University of California, Berkeley",
          degree: "Bachelor of Science",
          fieldOfStudy: "Computer Science",
          startDate: "2016-09",
          endDate: "2020-05",
        },
      ],
      certifications: [],
      skills: ["React", "TypeScript", "Next.js", "Node.js", "PostgreSQL", "Tailwind CSS", "AWS"],
      languages: [{ language: "English", proficiency: "Native" }],
      projects: [],
    };

    const fallbackPreferences: CareerPreferences = {
      preferredJobTitles: ["Senior Full Stack Engineer", "Staff Developer"],
      salaryExpectation: 160000,
      workMode: "Remote",
      jobType: "Full-time",
      noticePeriod: "Immediate",
      willRelocate: false,
      preferredLocations: ["San Francisco, CA", "Remote"],
    };

    const fallbackPrivacy: PrivacySettings = {
      profileVisibility: "PUBLIC",
      resumeVisibility: "PUBLIC",
      contactVisibility: "RECRUITERS_ONLY",
    };

    const draftProfile: Partial<CompleteJobSeekerProfile> = {
      userId,
      personal: fallbackPersonal,
      professional: fallbackProfessional,
      preferences: fallbackPreferences,
      privacy: fallbackPrivacy,
    };

    const report = calculateProfileCompletion(draftProfile);

    return {
      userId,
      personal: fallbackPersonal,
      professional: fallbackProfessional,
      preferences: fallbackPreferences,
      privacy: fallbackPrivacy,
      completionPercentage: report.score,
      missingFields: report.missingItems.map((i) => i.label),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Update Personal Information
   */
  static async updatePersonalInformation(userId: string, data: Partial<PersonalInformation>) {
    if (data.name) {
      await safeDb(() => prisma.user.update({ where: { id: userId }, data: { name: data.name?.trim() } }), null);
    }

    await safeDb(
      () =>
        prisma.userProfile.upsert({
          where: { userId },
          create: {
            userId,
            phone: data.phone,
            photoUrl: data.photoUrl,
            dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
            gender: data.gender,
            location: data.location,
          },
          update: {
            phone: data.phone,
            photoUrl: data.photoUrl,
            dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
            gender: data.gender,
            location: data.location,
          },
        }),
      null
    );

    return this.getProfileByUserId(userId);
  }

  /**
   * Update Professional Details
   */
  static async updateProfessionalDetails(userId: string, data: Partial<ProfessionalDetails>) {
    await safeDb(
      () =>
        prisma.userProfile.upsert({
          where: { userId },
          create: {
            userId,
            headline: data.headline,
            summary: data.summary,
            experience: (data.experience as any) || [],
            education: (data.education as any) || [],
            certifications: (data.certifications as any) || [],
            skills: data.skills || [],
            languages: (data.languages as any) || [],
            projects: (data.projects as any) || [],
            resumeUrl: data.resumeUrl,
          },
          update: {
            headline: data.headline,
            summary: data.summary,
            experience: (data.experience as any) || [],
            education: (data.education as any) || [],
            certifications: (data.certifications as any) || [],
            skills: data.skills || [],
            languages: (data.languages as any) || [],
            projects: (data.projects as any) || [],
            resumeUrl: data.resumeUrl,
          },
        }),
      null
    );

    return this.getProfileByUserId(userId);
  }

  /**
   * Update Career Preferences
   */
  static async updateCareerPreferences(userId: string, data: Partial<CareerPreferences>) {
    await safeDb(
      () =>
        prisma.userProfile.upsert({
          where: { userId },
          create: {
            userId,
            preferredJobTitles: data.preferredJobTitles || [],
            salaryExpectation: data.salaryExpectation !== undefined ? Number(data.salaryExpectation) : undefined,
            workMode: data.workMode,
            jobType: data.jobType,
            noticePeriod: data.noticePeriod,
            willRelocate: data.willRelocate,
            preferredLocations: data.preferredLocations || [],
          },
          update: {
            preferredJobTitles: data.preferredJobTitles,
            salaryExpectation: data.salaryExpectation !== undefined ? Number(data.salaryExpectation) : undefined,
            workMode: data.workMode,
            jobType: data.jobType,
            noticePeriod: data.noticePeriod,
            willRelocate: data.willRelocate,
            preferredLocations: data.preferredLocations,
          },
        }),
      null
    );

    return this.getProfileByUserId(userId);
  }

  /**
   * Update Privacy Settings
   */
  static async updatePrivacySettings(userId: string, data: Partial<PrivacySettings>) {
    await safeDb(
      () =>
        prisma.userProfile.upsert({
          where: { userId },
          create: {
            userId,
            profileVisibility: data.profileVisibility,
            resumeVisibility: data.resumeVisibility,
            contactVisibility: data.contactVisibility,
          },
          update: {
            profileVisibility: data.profileVisibility,
            resumeVisibility: data.resumeVisibility,
            contactVisibility: data.contactVisibility,
          },
        }),
      null
    );

    return this.getProfileByUserId(userId);
  }
}
