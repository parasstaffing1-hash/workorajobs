import { z } from "zod";

// Social Links schema
export const SocialLinksSchema = z.object({
  linkedin: z.string().url().optional().or(z.literal("")),
  github: z.string().url().optional().or(z.literal("")),
  portfolio: z.string().url().optional().or(z.literal("")),
  twitter: z.string().url().optional().or(z.literal("")),
  other: z.array(
    z.object({
      label: z.string(),
      url: z.string().url(),
    })
  ).optional(),
});

// Personal Info schema
export const PersonalInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  title: z.string().optional(), // e.g. Senior Full Stack Engineer
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  location: z.string().optional(),
  socialLinks: SocialLinksSchema.optional(),
});

// Work Experience schema (and Internships schema)
export const WorkExperienceSchema = z.object({
  // Entry IDs are client-side list keys, not database identifiers. Accepting any
  // non-empty stable ID keeps older locally saved drafts importable.
  id: z.string().min(1),
  role: z.string().min(1, "Role title is required"),
  company: z.string().min(1, "Company name is required"),
  location: z.string().optional(),
  startDate: z.string(), // e.g. "2022-01" or "01/2022"
  endDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  description: z.string().optional(),
  bullets: z.array(z.string()).default([]),
});

// Education schema
export const EducationSchema = z.object({
  id: z.string().min(1),
  degree: z.string().min(1, "Degree name is required"),
  institution: z.string().min(1, "Institution name is required"),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  gpa: z.string().optional(),
  details: z.string().optional(),
});

// Skills schema
export const SkillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  level: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]).optional(),
  category: z.string().optional(), // e.g. Languages, Frontend, Cloud
});

// Projects schema
export const ProjectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, "Project name is required"),
  role: z.string().optional(),
  url: z.string().url().optional().or(z.literal("")),
  techStack: z.array(z.string()).default([]),
  description: z.string().optional(),
  bullets: z.array(z.string()).default([]),
});

// Certifications schema
export const CertificationSchema = z.object({
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().min(1, "Issuer name is required"),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),
  credentialId: z.string().optional(),
  url: z.string().url().optional().or(z.literal("")),
});

// Volunteer Experience schema
export const VolunteerExperienceSchema = z.object({
  id: z.string().min(1),
  role: z.string().min(1, "Role is required"),
  organization: z.string().min(1, "Organization is required"),
  startDate: z.string(),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

// Publications schema
export const PublicationSchema = z.object({
  title: z.string().min(1, "Publication title is required"),
  publisher: z.string().optional(),
  date: z.string().optional(),
  url: z.string().url().optional().or(z.literal("")),
  description: z.string().optional(),
});

// Patents schema
export const PatentSchema = z.object({
  title: z.string().min(1, "Patent title is required"),
  number: z.string().optional(),
  office: z.string().optional(), // e.g. USPTO
  date: z.string().optional(),
  url: z.string().url().optional().or(z.literal("")),
  status: z.enum(["Pending", "Issued"]).default("Issued"),
});

// Custom section schema
export const CustomSectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1, "Custom section title is required"),
  items: z.array(
    z.object({
      title: z.string().optional(),
      subtitle: z.string().optional(),
      date: z.string().optional(),
      description: z.string().optional(),
    })
  ).default([]),
});

// Consolidated Resume Data schema (all sections)
export const ResumeDataSchema = z.object({
  personalInfo: PersonalInfoSchema,
  summary: z.string().optional(),
  workExperiences: z.array(WorkExperienceSchema).default([]),
  education: z.array(EducationSchema).default([]),
  skills: z.array(SkillSchema).default([]),
  projects: z.array(ProjectSchema).default([]),
  certifications: z.array(CertificationSchema).default([]),
  achievements: z.array(z.string()).default([]),
  awards: z.array(
    z.object({
      title: z.string(),
      issuer: z.string(),
      date: z.string().optional(),
    })
  ).default([]),
  languages: z.array(
    z.object({
      language: z.string(),
      proficiency: z.string(),
    })
  ).default([]),
  volunteer: z.array(VolunteerExperienceSchema).default([]),
  publications: z.array(PublicationSchema).default([]),
  patents: z.array(PatentSchema).default([]),
  research: z.array(
    z.object({
      title: z.string(),
      organization: z.string(),
      description: z.string().optional(),
    })
  ).default([]),
  training: z.array(
    z.object({
      name: z.string(),
      provider: z.string(),
      date: z.string().optional(),
    })
  ).default([]),
  internships: z.array(WorkExperienceSchema).default([]),
  references: z.array(
    z.object({
      name: z.string(),
      contact: z.string(),
      relation: z.string().optional(),
    })
  ).default([]),
  customSections: z.array(CustomSectionSchema).default([]),
});

// ATS score & evaluation schema
export const AtsMetadataSchema = z.object({
  score: z.number().min(0).max(100),
  formattingCheck: z.object({
    hasContactInfo: z.boolean(),
    hasValidSections: z.boolean(),
    hasProperFontSizes: z.boolean(),
  }),
  keywordMatches: z.array(z.string()),
  keywordGaps: z.array(z.string()),
  complexityScore: z.number(),
  suggestions: z.array(z.string()),
});

export type ResumeData = z.infer<typeof ResumeDataSchema>;
export type AtsMetadata = z.infer<typeof AtsMetadataSchema>;
