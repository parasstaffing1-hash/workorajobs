import { z } from "zod";

// Enum validator for the 25 core taxonomy categories
export const ConceptTypeSchema = z.enum([
  "SKILL",
  "SKILL_ALIAS",
  "JOB_TITLE",
  "COMPANY",
  "INDUSTRY",
  "TECHNOLOGY",
  "PROGRAMMING_LANGUAGE",
  "FRAMEWORK",
  "DATABASE",
  "CLOUD_PLATFORM",
  "DEVOPS_TOOL",
  "OPERATING_SYSTEM",
  "CERTIFICATION",
  "UNIVERSITY",
  "LOCATION",
  "COUNTRY",
  "STATE",
  "CITY",
  "EMPLOYMENT_TYPE",
  "SECURITY_CLEARANCE",
  "VISA_STATUS",
  "NOTICE_PERIOD",
  "DEGREE_TYPE"
]);

// Validator for creating a new alias/synonym
export const CreateAliasSchema = z.object({
  name: z.string().min(1).max(256),
  isSynonym: z.boolean().default(true),
});

// Validator for inserting a fresh concept
export const CreateConceptSchema = z.object({
  name: z.string().min(1).max(256),
  type: ConceptTypeSchema,
  description: z.string().optional(),
  aliases: z.array(CreateAliasSchema).default([]),
});

// Validator for updating/versioning an existing concept
export const UpdateConceptSchema = z.object({
  name: z.string().min(1).max(256).optional(),
  description: z.string().optional(),
  aliases: z.array(CreateAliasSchema).optional(),
  incrementVersion: z.boolean().default(false), // triggers a new version creation rather than in-place update
});

// Validator for executing a boolean search query string
export const BooleanSearchQuerySchema = z.object({
  query: z.string().min(1),
  expandSynonyms: z.boolean().default(true),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

// Types inferred from schemas
export type CreateConceptInput = z.infer<typeof CreateConceptSchema>;
export type UpdateConceptInput = z.infer<typeof UpdateConceptSchema>;
export type BooleanSearchQueryInput = z.infer<typeof BooleanSearchQuerySchema>;

// Recruiter Structured Filters Validator
export const RecruiterFiltersSchema = z.object({
  experienceYearsMin: z.number().optional(),
  experienceYearsMax: z.number().optional(),
  currentCompany: z.string().optional(),
  previousCompany: z.string().optional(),
  location: z.string().optional(),
  radiusMiles: z.number().optional(),
  workplaceModel: z.enum(["remote", "hybrid", "onsite", "any"]).default("any"),
  noticePeriod: z.string().optional(),
  degreeType: z.string().optional(),
  certification: z.string().optional(),
  industry: z.string().optional(),
  employmentType: z.string().optional(),
  visaStatus: z.string().optional(),
  securityClearance: z.string().optional(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  availability: z.string().optional(),
  currentDesignation: z.string().optional(),
  previousDesignation: z.string().optional(),
  mustHave: z.array(z.string()).default([]),
  niceToHave: z.array(z.string()).default([]),
  exclude: z.array(z.string()).default([]),
  preferredEmployer: z.string().optional(),
  preferredUniversity: z.string().optional(),
  preferredSkillCategory: z.string().optional(),
});

export type RecruiterFiltersInput = z.infer<typeof RecruiterFiltersSchema>;
