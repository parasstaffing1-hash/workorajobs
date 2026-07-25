"use server";

import {
  uploadResume,
  uploadProfilePhoto,
  uploadCompanyLogo,
  uploadCertificate,
  deleteFromS3,
  getSignedDownloadUrl,
  S3UploadOutput,
} from "@/lib/aws/s3";

export interface ServerActionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Server Action: Upload candidate resume file (PDF, DOC, DOCX up to 10MB)
 */
export async function uploadResumeAction(
  formData: FormData,
  userId?: string
): Promise<ServerActionResponse<S3UploadOutput>> {
  try {
    const file = formData.get("file") as File | null;
    if (!file) {
      return { success: false, error: "No file provided in form data." };
    }

    const result = await uploadResume(file, file.name, file.type, userId);
    return { success: true, data: result };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, error: err.message || "Failed to upload resume." };
  }
}

/**
 * Server Action: Upload profile photo (PNG, JPG, WEBP up to 5MB)
 */
export async function uploadProfilePhotoAction(
  formData: FormData,
  userId?: string
): Promise<ServerActionResponse<S3UploadOutput>> {
  try {
    const file = formData.get("file") as File | null;
    if (!file) {
      return { success: false, error: "No file provided in form data." };
    }

    const result = await uploadProfilePhoto(file, file.name, file.type, userId);
    return { success: true, data: result };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, error: err.message || "Failed to upload profile photo." };
  }
}

/**
 * Server Action: Upload company logo (PNG, JPG, WEBP up to 5MB)
 */
export async function uploadCompanyLogoAction(
  formData: FormData,
  userId?: string
): Promise<ServerActionResponse<S3UploadOutput>> {
  try {
    const file = formData.get("file") as File | null;
    if (!file) {
      return { success: false, error: "No file provided in form data." };
    }

    const result = await uploadCompanyLogo(file, file.name, file.type, userId);
    return { success: true, data: result };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, error: err.message || "Failed to upload company logo." };
  }
}

/**
 * Server Action: Upload certificate (PDF, DOC, DOCX, PNG, JPG up to 10MB)
 */
export async function uploadCertificateAction(
  formData: FormData,
  userId?: string
): Promise<ServerActionResponse<S3UploadOutput>> {
  try {
    const file = formData.get("file") as File | null;
    if (!file) {
      return { success: false, error: "No file provided in form data." };
    }

    const result = await uploadCertificate(file, file.name, file.type, userId);
    return { success: true, data: result };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, error: err.message || "Failed to upload certificate." };
  }
}

/**
 * Server Action: Delete file from S3 storage by key
 */
export async function deleteFileAction(key: string): Promise<ServerActionResponse<boolean>> {
  try {
    if (!key) {
      return { success: false, error: "File key is required." };
    }

    const deleted = await deleteFromS3(key);
    return { success: true, data: deleted };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, error: err.message || "Failed to delete file from S3." };
  }
}

/**
 * Server Action: Generate presigned download URL for private files
 */
export async function getSignedDownloadUrlAction(
  key: string,
  expiresInSeconds = 3600
): Promise<ServerActionResponse<string>> {
  try {
    if (!key) {
      return { success: false, error: "File key is required." };
    }

    const url = await getSignedDownloadUrl(key, expiresInSeconds);
    return { success: true, data: url };
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, error: err.message || "Failed to generate signed download URL." };
  }
}
