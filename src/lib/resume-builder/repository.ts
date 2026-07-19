import { eq, and, desc } from "drizzle-orm";
import { db } from "./db";
import { resumes, resumeVersions, resumeTemplates, type NewResume, type NewResumeVersion } from "./schema";
import { type ResumeData, type AtsMetadata } from "./validation";

export class ResumeRepository {
  /**
   * Create a new resume with an initial version #1
   */
  async createResume(userId: string, title: string, templateId: string | null, data: ResumeData) {
    // 1. Insert parent resume record
    const [newResume] = await db
      .insert(resumes)
      .values({
        userId,
        title,
      })
      .returning();

    // 2. Insert initial version #1
    const [initialVersion] = await db
      .insert(resumeVersions)
      .values({
        resumeId: newResume.id,
        versionNumber: 1,
        templateId,
        data,
        isAutosaveDraft: false,
      })
      .returning();

    return { resume: newResume, version: initialVersion };
  }

  /**
   * List all active (non-soft-deleted) resumes for a user
   */
  async listResumes(userId: string) {
    return db
      .select()
      .from(resumes)
      .where(and(eq(resumes.userId, userId), eq(resumes.isDeleted, false)))
      .orderBy(desc(resumes.updatedAt));
  }

  /**
   * Fetch a single resume by ID if it belongs to the user and is not deleted
   */
  async getResume(resumeId: string, userId: string) {
    const [resume] = await db
      .select()
      .from(resumes)
      .where(
        and(
          eq(resumes.id, resumeId),
          eq(resumes.userId, userId),
          eq(resumes.isDeleted, false)
        )
      );
    return resume || null;
  }

  /**
   * Soft delete a resume
   */
  async softDeleteResume(resumeId: string, userId: string) {
    const [updated] = await db
      .update(resumes)
      .set({
        isDeleted: true,
        deletedAt: new Date(),
      })
      .where(and(eq(resumes.id, resumeId), eq(resumes.userId, userId)))
      .returning();
    return updated || null;
  }

  /**
   * Restore a soft-deleted resume
   */
  async restoreResume(resumeId: string, userId: string) {
    const [updated] = await db
      .update(resumes)
      .set({
        isDeleted: false,
        deletedAt: null,
      })
      .where(and(eq(resumes.id, resumeId), eq(resumes.userId, userId)))
      .returning();
    return updated || null;
  }

  /**
   * Autosave a draft. Updates the existing draft version, or creates one if none exists.
   */
  async autosaveDraft(resumeId: string, templateId: string | null, data: ResumeData) {
    // 1. Check if an autosave draft already exists for this resume
    const [existingDraft] = await db
      .select()
      .from(resumeVersions)
      .where(
        and(
          eq(resumeVersions.resumeId, resumeId),
          eq(resumeVersions.isAutosaveDraft, true)
        )
      );

    if (existingDraft) {
      // Update existing draft
      const [updated] = await db
        .update(resumeVersions)
        .set({
          data,
          templateId,
          createdAt: new Date(),
        })
        .where(eq(resumeVersions.id, existingDraft.id))
        .returning();
      
      // Update parent updated_at
      await db.update(resumes).set({ updatedAt: new Date() }).where(eq(resumes.id, resumeId));
      
      return updated;
    } else {
      // Find the latest non-draft version number to determine the base
      const latestNonDraft = await this.getLatestNonDraftVersion(resumeId);
      const nextVersionNumber = latestNonDraft ? latestNonDraft.versionNumber + 1 : 1;

      // Create new draft version
      const [newDraft] = await db
        .insert(resumeVersions)
        .values({
          resumeId,
          versionNumber: nextVersionNumber,
          templateId,
          data,
          isAutosaveDraft: true,
        })
        .returning();

      await db.update(resumes).set({ updatedAt: new Date() }).where(eq(resumes.id, resumeId));
      return newDraft;
    }
  }

  /**
   * Commit a formal version snapshot (e.g. user manually clicks "Save Version" or "Publish")
   */
  async createVersionSnapshot(resumeId: string, templateId: string | null, data: ResumeData, atsMetadata?: AtsMetadata) {
    // 1. Delete any existing autosave draft (as it is now promoted to a formal version)
    await db
      .delete(resumeVersions)
      .where(
        and(
          eq(resumeVersions.resumeId, resumeId),
          eq(resumeVersions.isAutosaveDraft, true)
        )
      );

    // 2. Find the highest existing version number
    const latestNonDraft = await this.getLatestNonDraftVersion(resumeId);
    const nextVersionNumber = latestNonDraft ? latestNonDraft.versionNumber + 1 : 1;

    // 3. Create the formal version row
    const [newVersion] = await db
      .insert(resumeVersions)
      .values({
        resumeId,
        versionNumber: nextVersionNumber,
        templateId,
        data,
        atsMetadata,
        isAutosaveDraft: false,
      })
      .returning();

    // 4. Update parent timestamp
    await db
      .update(resumes)
      .set({ updatedAt: new Date() })
      .where(eq(resumes.id, resumeId));

    return newVersion;
  }

  /**
   * Get the latest non-draft version record
   */
  async getLatestNonDraftVersion(resumeId: string) {
    const [latest] = await db
      .select()
      .from(resumeVersions)
      .where(
        and(
          eq(resumeVersions.resumeId, resumeId),
          eq(resumeVersions.isAutosaveDraft, false)
        )
      )
      .orderBy(desc(resumeVersions.versionNumber));
    return latest || null;
  }

  /**
   * Get the active version or current draft version (draft takes priority if it exists)
   */
  async getActiveOrDraftVersion(resumeId: string) {
    const [activeDraft] = await db
      .select()
      .from(resumeVersions)
      .where(
        and(
          eq(resumeVersions.resumeId, resumeId),
          eq(resumeVersions.isAutosaveDraft, true)
        )
      );

    if (activeDraft) return activeDraft;

    return this.getLatestNonDraftVersion(resumeId);
  }

  /**
   * List all versions (formal snapshots and drafts) for a resume
   */
  async listVersions(resumeId: string) {
    return db
      .select()
      .from(resumeVersions)
      .where(eq(resumeVersions.resumeId, resumeId))
      .orderBy(desc(resumeVersions.versionNumber), desc(resumeVersions.createdAt));
  }

  /**
   * Revert a resume content to a past version number
   */
  async revertToVersion(resumeId: string, versionNumber: number) {
    const [targetVersion] = await db
      .select()
      .from(resumeVersions)
      .where(
        and(
          eq(resumeVersions.resumeId, resumeId),
          eq(resumeVersions.versionNumber, versionNumber),
          eq(resumeVersions.isAutosaveDraft, false)
        )
      );

    if (!targetVersion) {
      throw new Error(`Version number ${versionNumber} not found.`);
    }

    // Insert a new active version copy containing the historical data
    return this.createVersionSnapshot(
      resumeId,
      targetVersion.templateId,
      targetVersion.data as ResumeData,
      targetVersion.atsMetadata as AtsMetadata || undefined
    );
  }

  /**
   * List all available templates
   */
  async listTemplates() {
    return db.select().from(resumeTemplates).orderBy(resumeTemplates.name);
  }
}
