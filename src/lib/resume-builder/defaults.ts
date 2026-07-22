import { z } from "zod";

import {
  CertificationSchema,
  EducationSchema,
  PersonalInfoSchema,
  ProjectSchema,
  ResumeDataSchema,
  SocialLinksSchema,
  WorkExperienceSchema,
  type ResumeData,
} from "./validation";

const DraftUrlSchema = z.string().max(2_048).optional().or(z.literal(""));
const DraftSocialLinksSchema = SocialLinksSchema.safeExtend({
  linkedin: DraftUrlSchema,
  github: DraftUrlSchema,
  portfolio: DraftUrlSchema,
  twitter: DraftUrlSchema,
});
const DraftPersonalInfoSchema = PersonalInfoSchema.safeExtend({
  fullName: z.string(),
  email: z.string(),
  socialLinks: DraftSocialLinksSchema.optional(),
});
const DraftWorkExperienceSchema = WorkExperienceSchema.safeExtend({
  role: z.string(),
  company: z.string(),
});
const DraftEducationSchema = EducationSchema.safeExtend({
  degree: z.string(),
  institution: z.string(),
});
const DraftProjectSchema = ProjectSchema.safeExtend({
  name: z.string(),
  url: DraftUrlSchema,
});
const DraftCertificationSchema = CertificationSchema.safeExtend({
  name: z.string(),
  issuer: z.string(),
  url: DraftUrlSchema,
});
const ResumeDraftSchema = ResumeDataSchema.safeExtend({
  personalInfo: DraftPersonalInfoSchema,
  workExperiences: z.array(DraftWorkExperienceSchema).default([]),
  education: z.array(DraftEducationSchema).default([]),
  projects: z.array(DraftProjectSchema).default([]),
  certifications: z.array(DraftCertificationSchema).default([]),
});

export function createResumeEntryId(prefix = "entry"): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createEmptyResumeData(): ResumeData {
  return {
    personalInfo: {
      fullName: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      socialLinks: {
        linkedin: "",
        github: "",
        portfolio: "",
        twitter: "",
      },
    },
    summary: "",
    workExperiences: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    achievements: [],
    awards: [],
    languages: [],
    volunteer: [],
    publications: [],
    patents: [],
    research: [],
    training: [],
    internships: [],
    references: [],
    customSections: [],
  };
}

export function createSampleResumeData(): ResumeData {
  return {
    personalInfo: {
      fullName: "Alex Morgan",
      title: "Senior Product Engineer",
      email: "alex.morgan@example.com",
      phone: "+1 415 555 0147",
      location: "San Francisco, CA",
      socialLinks: {
        linkedin: "https://linkedin.com/in/alexmorgan",
        github: "https://github.com/alexmorgan",
        portfolio: "https://alexmorgan.dev",
        twitter: "",
      },
    },
    summary:
      "Product-minded software engineer with 8+ years of experience building reliable web platforms and leading cross-functional delivery. Improved activation by 28% and reduced release time by 40% through customer-led product development and platform automation.",
    workExperiences: [
      {
        id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        role: "Lead Product Engineer",
        company: "Northstar Labs",
        location: "San Francisco, CA",
        startDate: "2021-06",
        endDate: "",
        isCurrent: true,
        description: "Lead the product engineering group responsible for activation, billing, and the developer platform.",
        bullets: [
          "Increased new-user activation by 28% by redesigning onboarding with product and research partners.",
          "Reduced deployment time by 40% by standardizing CI pipelines across 14 services.",
          "Mentored 6 engineers and introduced delivery rituals that improved quarterly predictability.",
        ],
      },
      {
        id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12",
        role: "Senior Software Engineer",
        company: "Atlas Commerce",
        location: "Remote",
        startDate: "2018-03",
        endDate: "2021-05",
        isCurrent: false,
        description: "Built customer-facing commerce workflows used by mid-market retailers.",
        bullets: [
          "Scaled checkout services to 12,000 orders per hour while maintaining 99.99% availability.",
          "Cut support tickets by 22% through self-service billing and account-management tooling.",
        ],
      },
    ],
    education: [
      {
        id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13",
        degree: "B.S. in Computer Science",
        institution: "University of California, Berkeley",
        location: "Berkeley, CA",
        startDate: "2012-08",
        endDate: "2016-05",
        gpa: "3.8 / 4.0",
        details: "Coursework in distributed systems, human-computer interaction, and data structures.",
      },
    ],
    skills: [
      { name: "TypeScript", level: "Expert", category: "Engineering" },
      { name: "React", level: "Expert", category: "Engineering" },
      { name: "Node.js", level: "Advanced", category: "Engineering" },
      { name: "PostgreSQL", level: "Advanced", category: "Data" },
      { name: "AWS", level: "Advanced", category: "Cloud" },
      { name: "Product strategy", level: "Advanced", category: "Leadership" },
    ],
    projects: [
      {
        id: "d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14",
        name: "Open Metrics Toolkit",
        role: "Creator",
        url: "https://github.com/alexmorgan/open-metrics",
        techStack: ["TypeScript", "Next.js", "PostgreSQL"],
        description: "An open-source toolkit for instrumenting product funnels.",
        bullets: ["Adopted by 30+ teams and reached 1,400 GitHub stars."],
      },
    ],
    certifications: [
      {
        name: "AWS Certified Solutions Architect",
        issuer: "Amazon Web Services",
        issueDate: "2024-04",
        expiryDate: "2027-04",
        credentialId: "AWS-CSA-2048",
        url: "",
      },
    ],
    achievements: [],
    awards: [],
    languages: [
      { language: "English", proficiency: "Native" },
      { language: "Spanish", proficiency: "Professional working" },
    ],
    volunteer: [],
    publications: [],
    patents: [],
    research: [],
    training: [],
    internships: [],
    references: [],
    customSections: [],
  };
}

/**
 * Parse current and legacy browser drafts while backfilling arrays added by
 * newer builder versions. Invalid IDs are repaired without discarding the CV.
 */
export function parseResumeDraft(value: unknown): ResumeData {
  const source = value && typeof value === "object" ? structuredClone(value) : value;

  if (source && typeof source === "object") {
    const draft = source as Record<string, unknown>;
    for (const key of ["workExperiences", "education", "projects", "volunteer", "internships", "customSections"]) {
      const entries = draft[key];
      if (!Array.isArray(entries)) continue;
      draft[key] = entries.map((entry) => {
        if (!entry || typeof entry !== "object") return entry;
        const item = entry as Record<string, unknown>;
        return {
          ...item,
          id: typeof item.id === "string" && item.id.trim() ? item.id : createResumeEntryId(key),
        };
      });
    }
  }

  // Browser drafts are intentionally tolerant of in-progress fields. Strict
  // validation remains available through ResumeDataSchema for API writes.
  return ResumeDraftSchema.parse(source) as ResumeData;
}
