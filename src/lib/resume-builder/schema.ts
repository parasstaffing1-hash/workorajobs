import { pgTable, text, timestamp, boolean, integer, jsonb, uuid } from "drizzle-orm/pg-core";

// Templates table
export const resumeTemplates = pgTable("resume_templates", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  config: jsonb("config").notNull(), // Styling config: fonts, margins, colors, layout structures
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Parent Resume table (metadata & soft delete status)
export const resumes = pgTable("resumes", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Resume Versions / Drafts table
export const resumeVersions = pgTable("resume_versions", {
  id: uuid("id").defaultRandom().primaryKey(),
  resumeId: uuid("resume_id")
    .references(() => resumes.id, { onDelete: "cascade" })
    .notNull(),
  versionNumber: integer("version_number").notNull(),
  templateId: uuid("template_id").references(() => resumeTemplates.id),
  // The complete Zod-validated resume structure:
  data: jsonb("data").notNull(), 
  // ATS metadata (score, formatting checks, keywords)
  atsMetadata: jsonb("ats_metadata"),
  isAutosaveDraft: boolean("is_autosave_draft").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type ResumeTemplate = typeof resumeTemplates.$inferSelect;
export type NewResumeTemplate = typeof resumeTemplates.$inferInsert;

export type Resume = typeof resumes.$inferSelect;
export type NewResume = typeof resumes.$inferInsert;

export type ResumeVersion = typeof resumeVersions.$inferSelect;
export type NewResumeVersion = typeof resumeVersions.$inferInsert;
