import { z } from "zod";

export const JobPostSchema = z.object({
  title: z
    .string()
    .min(3, "Job title must be at least 3 characters")
    .max(120, "Job title cannot exceed 120 characters"),
  department: z.string().optional(),
  type: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "FREELANCE"]).default("FULL_TIME"),
  workMode: z.enum(["Remote", "Hybrid", "On-site"]).default("Remote"),
  location: z.string().min(2, "Location is required"),
  salaryMin: z.number().optional().nullable(),
  salaryMax: z.number().optional().nullable(),
  salary: z.number().optional().nullable(),
  experience: z.string().default("Mid Level"),
  education: z.string().optional().nullable(),
  skillsRequired: z.array(z.string()).default([]),
  openingsCount: z.number().min(1).default(1),
  noticePeriod: z.string().default("Immediate"),
  benefits: z.array(z.string()).default([]),
  description: z
    .string()
    .min(30, "Job description must be at least 30 characters"),
  responsibilities: z.string().optional().nullable(),
  requirements: z.string().optional().nullable(),
  screeningQuestions: z
    .array(
      z.object({
        id: z.string(),
        question: z.string().min(3),
        required: z.boolean().default(true),
      })
    )
    .optional()
    .default([]),
  externalApplyUrl: z.string().url("Please enter a valid URL").optional().nullable().or(z.literal("")),
  deadlineAt: z.string().optional().nullable(),
  scheduledPublishAt: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED", "PAUSED", "CLOSED", "ARCHIVED"]).default("PUBLISHED"),
});

export type JobPostInput = z.infer<typeof JobPostSchema>;
