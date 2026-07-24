import { prisma } from "@/lib/prisma";
import { storageDriver } from "@/lib/storage/storage-driver";
import { validateResumeFile } from "./resume-validation";

export class ResumeService {
  /**
   * Fetch all active resumes for a candidate
   */
  static async getUserResumes(userId: string) {
    const resumes = await prisma.resumeRecord.findMany({
      where: { userId },
      include: {
        versions: {
          orderBy: { version: "desc" },
        },
      },
      orderBy: [
        { isDefault: "desc" },
        { updatedAt: "desc" },
      ],
    });

    return resumes.map((r) => ({
      id: r.id,
      title: r.title,
      isDefault: r.isDefault,
      fileUrl: r.fileUrl,
      fileName: r.fileName,
      fileSize: r.fileSize,
      fileType: r.fileType,
      version: r.version,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      versionCount: r.versions.length,
      versions: r.versions.map((v) => ({
        id: v.id,
        version: v.version,
        fileUrl: v.fileUrl,
        fileName: v.fileName,
        fileSize: v.fileSize,
        fileType: v.fileType,
        changeSummary: v.changeSummary,
        createdAt: v.createdAt,
      })),
    }));
  }

  /**
   * Upload a new Resume Record (v1.0)
   */
  static async uploadResume(data: {
    userId: string;
    fileBuffer: Buffer;
    fileName: string;
    fileType: string;
    title?: string;
    isDefault?: boolean;
  }) {
    // 1. Validate File
    const validation = validateResumeFile(data.fileName, data.fileBuffer.length, data.fileType);
    if (!validation.valid) {
      throw new Error(validation.error || "File validation failed.");
    }

    // 2. Save file via Storage Driver
    const stored = await storageDriver.uploadFile(
      data.fileBuffer,
      data.fileName,
      data.fileType,
      "resumes"
    );

    // 3. Determine Default status
    const existingCount = await prisma.resumeRecord.count({ where: { userId: data.userId } });
    const shouldBeDefault = data.isDefault || existingCount === 0;

    if (shouldBeDefault) {
      // Unset previous default
      await prisma.resumeRecord.updateMany({
        where: { userId: data.userId },
        data: { isDefault: false },
      });
    }

    const resumeTitle =
      data.title?.trim() ||
      data.fileName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9 -]/g, " ");

    // 4. Create ResumeRecord and Version 1.0 in DB
    const record = await prisma.resumeRecord.create({
      data: {
        userId: data.userId,
        title: resumeTitle,
        isDefault: shouldBeDefault,
        fileUrl: stored.url,
        fileName: stored.fileName,
        fileSize: stored.fileSize,
        fileType: stored.mimeType,
        version: 1,
        versions: {
          create: {
            version: 1,
            fileUrl: stored.url,
            fileName: stored.fileName,
            fileSize: stored.fileSize,
            fileType: stored.mimeType,
            changeSummary: "Initial version upload",
          },
        },
      },
      include: { versions: true },
    });

    // Also update UserProfile.resumeUrl for main profile compatibility
    if (shouldBeDefault) {
      await prisma.userProfile.upsert({
        where: { userId: data.userId },
        create: { userId: data.userId, resumeUrl: stored.url },
        update: { resumeUrl: stored.url },
      });
    }

    return record;
  }

  /**
   * Replace existing Resume file and create a new Version (v+1)
   */
  static async replaceResume(data: {
    resumeId: string;
    userId: string;
    fileBuffer: Buffer;
    fileName: string;
    fileType: string;
    changeSummary?: string;
  }) {
    const existing = await prisma.resumeRecord.findFirst({
      where: { id: data.resumeId, userId: data.userId },
    });

    if (!existing) {
      throw new Error("Resume record not found or access denied.");
    }

    // Validate File
    const validation = validateResumeFile(data.fileName, data.fileBuffer.length, data.fileType);
    if (!validation.valid) {
      throw new Error(validation.error || "File validation failed.");
    }

    // Save new version file via Storage Driver
    const stored = await storageDriver.uploadFile(
      data.fileBuffer,
      data.fileName,
      data.fileType,
      "resumes"
    );

    const nextVersion = existing.version + 1;

    // Update ResumeRecord and append new ResumeVersion
    const updated = await prisma.resumeRecord.update({
      where: { id: data.resumeId },
      data: {
        fileUrl: stored.url,
        fileName: stored.fileName,
        fileSize: stored.fileSize,
        fileType: stored.mimeType,
        version: nextVersion,
        versions: {
          create: {
            version: nextVersion,
            fileUrl: stored.url,
            fileName: stored.fileName,
            fileSize: stored.fileSize,
            fileType: stored.mimeType,
            changeSummary: data.changeSummary || `Updated to version ${nextVersion}.0`,
          },
        },
      },
      include: { versions: { orderBy: { version: "desc" } } },
    });

    if (existing.isDefault) {
      await prisma.userProfile.upsert({
        where: { userId: data.userId },
        create: { userId: data.userId, resumeUrl: stored.url },
        update: { resumeUrl: stored.url },
      });
    }

    return updated;
  }

  /**
   * Set a specific resume as the default primary resume for applications
   */
  static async setDefaultResume(resumeId: string, userId: string) {
    const target = await prisma.resumeRecord.findFirst({
      where: { id: resumeId, userId },
    });

    if (!target) {
      throw new Error("Resume record not found.");
    }

    // Unset all existing defaults for user
    await prisma.resumeRecord.updateMany({
      where: { userId },
      data: { isDefault: false },
    });

    // Set target default
    const updated = await prisma.resumeRecord.update({
      where: { id: resumeId },
      data: { isDefault: true },
    });

    await prisma.userProfile.upsert({
      where: { userId },
      create: { userId, resumeUrl: target.fileUrl },
      update: { resumeUrl: target.fileUrl },
    });

    return updated;
  }

  /**
   * Delete resume record and all version files
   */
  static async deleteResume(resumeId: string, userId: string) {
    const target = await prisma.resumeRecord.findFirst({
      where: { id: resumeId, userId },
      include: { versions: true },
    });

    if (!target) {
      throw new Error("Resume record not found.");
    }

    // Delete stored files for all versions
    for (const v of target.versions) {
      await storageDriver.deleteFile(v.fileUrl);
    }

    await prisma.resumeRecord.delete({
      where: { id: resumeId },
    });

    // If deleted resume was default, assign new default if available
    if (target.isDefault) {
      const nextAvailable = await prisma.resumeRecord.findFirst({
        where: { userId },
        orderBy: { updatedAt: "desc" },
      });

      if (nextAvailable) {
        await prisma.resumeRecord.update({
          where: { id: nextAvailable.id },
          data: { isDefault: true },
        });

        await prisma.userProfile.updateMany({
          where: { userId },
          data: { resumeUrl: nextAvailable.fileUrl },
        });
      } else {
        await prisma.userProfile.updateMany({
          where: { userId },
          data: { resumeUrl: null },
        });
      }
    }

    return true;
  }
}
