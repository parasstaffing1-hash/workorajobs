/**
 * Enterprise AWS S3 Storage Service Layer for WorkoraJobs
 *
 * Requirements Met:
 * - AWS SDK v3 (@aws-sdk/client-s3 & @aws-sdk/s3-request-presigner)
 * - Strict TypeScript types (zero `any`)
 * - Environment variable configuration
 * - Strict file validation (MIME, Extension, Size, Magic Bytes)
 * - Filename sanitization & UUID v4 key generation
 * - Path traversal prevention
 * - Presigned URL generation for private files
 * - Structured logging & exception handling
 * - Antivirus scan hook readiness (AWS GuardDuty / ClamAV integration)
 * - Domain helper functions: uploadResume, uploadProfilePhoto, uploadCompanyLogo, uploadCertificate
 */

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ObjectCannedACL,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import path from "path";
import crypto from "crypto";

// ==========================================
// Types & Interfaces
// ==========================================

export type UploadFolder = "resumes" | "profile-images" | "company-logos" | "certificates";

export type AccessLevel = "public-read" | "private";

export interface S3Config {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucket: string;
  publicBaseUrl?: string;
}

export interface ValidationRule {
  maxSizeBytes: number;
  allowedMimeTypes: string[];
  allowedExtensions: string[];
  accessLevel: AccessLevel;
}

export interface S3UploadInput {
  fileBuffer: Buffer;
  originalFileName: string;
  contentType: string;
  folder: UploadFolder;
  userId?: string;
  customMetadata?: Record<string, string>;
}

export interface S3UploadOutput {
  key: string;
  url: string;
  bucket: string;
  region: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  folder: UploadFolder;
  isPrivate: boolean;
  uploadedAt: string;
  etag?: string;
}

export interface PresignedUploadResult {
  uploadUrl: string;
  key: string;
  publicUrl: string;
  expiresInSeconds: number;
  headers: Record<string, string>;
}

export interface AntivirusScanResult {
  isClean: boolean;
  threatName?: string;
  scannedAt: string;
}

// ==========================================
// Folder Validation Configuration
// ==========================================

export const FOLDER_RULES: Record<UploadFolder, ValidationRule> = {
  resumes: {
    maxSizeBytes: 10 * 1024 * 1024, // 10 MB
    allowedMimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    allowedExtensions: [".pdf", ".doc", ".docx"],
    accessLevel: "private",
  },
  "profile-images": {
    maxSizeBytes: 5 * 1024 * 1024, // 5 MB
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    allowedExtensions: [".jpg", ".jpeg", ".png", ".webp"],
    accessLevel: "public-read",
  },
  "company-logos": {
    maxSizeBytes: 5 * 1024 * 1024, // 5 MB
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    allowedExtensions: [".jpg", ".jpeg", ".png", ".webp"],
    accessLevel: "public-read",
  },
  certificates: {
    maxSizeBytes: 10 * 1024 * 1024, // 10 MB
    allowedMimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/webp",
    ],
    allowedExtensions: [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png", ".webp"],
    accessLevel: "private",
  },
};

// ==========================================
// S3 Client Singleton
// ==========================================

let s3ClientInstance: S3Client | null = null;

/**
 * Validates and retrieves AWS S3 configuration from environment variables.
 */
export interface S3Config {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucket: string;
  endpoint?: string;
  publicBaseUrl?: string;
}

/**
 * Validates and retrieves AWS S3 / Cloudflare R2 configuration from environment variables.
 */
export function getS3Config(): S3Config {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
  const endpoint =
    process.env.CLOUDFLARE_R2_ENDPOINT?.trim() ||
    process.env.AWS_S3_ENDPOINT?.trim() ||
    (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined);

  const accessKeyId =
    process.env.CLOUDFLARE_R2_ACCESS_KEY_ID?.trim() ||
    process.env.AWS_ACCESS_KEY_ID?.trim();
  const secretAccessKey =
    process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY?.trim() ||
    process.env.AWS_SECRET_ACCESS_KEY?.trim();
  const region = process.env.AWS_REGION?.trim() || "auto";
  const bucket =
    process.env.CLOUDFLARE_R2_BUCKET?.trim() ||
    process.env.AWS_S3_BUCKET?.trim() ||
    "workora-storage";
  const publicBaseUrl =
    process.env.CLOUDFLARE_R2_PUBLIC_URL?.trim() ||
    process.env.AWS_S3_PUBLIC_BASE_URL?.trim();

  if (!accessKeyId || !secretAccessKey || !bucket) {
    const missing: string[] = [];
    if (!accessKeyId) missing.push("CLOUDFLARE_R2_ACCESS_KEY_ID / AWS_ACCESS_KEY_ID");
    if (!secretAccessKey) missing.push("CLOUDFLARE_R2_SECRET_ACCESS_KEY / AWS_SECRET_ACCESS_KEY");
    if (!bucket) missing.push("CLOUDFLARE_R2_BUCKET / AWS_S3_BUCKET");

    throw new Error(
      `[Storage Error] Missing required Storage environment variables: ${missing.join(", ")}`
    );
  }

  return {
    accessKeyId,
    secretAccessKey,
    region,
    bucket,
    endpoint,
    publicBaseUrl,
  };
}

/**
 * Returns a cached AWS SDK v3 / Cloudflare R2 S3Client instance.
 */
export function getS3Client(): S3Client {
  if (s3ClientInstance) {
    return s3ClientInstance;
  }

  const config = getS3Config();

  s3ClientInstance = new S3Client({
    region: config.region,
    ...(config.endpoint ? { endpoint: config.endpoint } : {}),
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });

  return s3ClientInstance;
}

// ==========================================
// Security & Validation Helpers
// ==========================================

/**
 * Sanitizes a filename to prevent path traversal and shell injection attacks.
 */
export function sanitizeFileName(fileName: string): string {
  // Strip directory paths
  const baseName = path.basename(fileName);
  // Remove null bytes and path traversal patterns
  const cleanName = baseName.replace(/\0/g, "").replace(/\.\./g, "");
  // Replace illegal characters with underscore, keeping alphanumeric, dots, dashes, underscores
  const safeName = cleanName.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  // Limit length
  return safeName.substring(0, 100);
}

function sanitizeOwnerSegment(userId?: string): string | null {
  if (!userId) return null;
  const safe = userId.replace(/[^a-zA-Z0-9_-]/g, "_").substring(0, 80);
  return safe || null;
}

export function normalizeS3Key(key: string): string {
  if (!key || typeof key !== "string") {
    throw new Error("[S3 Storage Error] Key is required.");
  }

  const cleanKey = key.replace(/^\/+/, "").replace(/\\/g, "/");
  if (
    cleanKey.includes("\0") ||
    cleanKey.includes("../") ||
    cleanKey.includes("..\\") ||
    cleanKey.startsWith("../")
  ) {
    throw new Error("[S3 Storage Error] Invalid object key.");
  }

  const folder = cleanKey.split("/")[0] as UploadFolder;
  if (!FOLDER_RULES[folder]) {
    throw new Error("[S3 Storage Error] Object key is outside an allowed upload folder.");
  }

  return cleanKey;
}

function getFolderFromKey(key: string): UploadFolder {
  return normalizeS3Key(key).split("/")[0] as UploadFolder;
}

/**
 * Generates a unique, non-colliding S3 key with folder prefix and UUID v4.
 */
export function generateS3Key(folder: UploadFolder, originalFileName: string, userId?: string): string {
  const sanitized = sanitizeFileName(originalFileName);
  const ext = path.extname(sanitized).toLowerCase();
  const baseWithoutExt = path.basename(sanitized, ext) || "file";
  const uuid = crypto.randomUUID();
  const ownerSegment = sanitizeOwnerSegment(userId);

  return `${folder}/${ownerSegment ? `${ownerSegment}/` : ""}${uuid}-${baseWithoutExt}${ext}`;
}

function validateUploadMetadata(
  originalFileName: string,
  contentType: string,
  fileSize: number,
  folder: UploadFolder
): void {
  const rule = FOLDER_RULES[folder];
  if (!rule) {
    throw new Error(`[S3 Validation Error] Invalid upload folder: '${folder}'`);
  }

  if (!Number.isFinite(fileSize) || fileSize <= 0) {
    throw new Error("[S3 Validation Error] File size must be a positive number.");
  }
  if (fileSize > rule.maxSizeBytes) {
    throw new Error(
      `[S3 Validation Error] File size exceeds maximum allowed limit of ${rule.maxSizeBytes / (1024 * 1024)} MB.`
    );
  }

  const sanitized = sanitizeFileName(originalFileName);
  if (!sanitized || sanitized.length > 100) {
    throw new Error("[S3 Validation Error] Invalid file name.");
  }

  const ext = path.extname(sanitized).toLowerCase();
  if (!rule.allowedExtensions.includes(ext)) {
    throw new Error("[S3 Validation Error] File extension is not allowed for this folder.");
  }

  const normalizedContentType = contentType.toLowerCase().split(";")[0].trim();
  if (!rule.allowedMimeTypes.includes(normalizedContentType)) {
    throw new Error("[S3 Validation Error] MIME type is not allowed for this folder.");
  }
}

async function assertCanAccessS3Object(
  key: string,
  userId: string,
  action: "read" | "delete"
): Promise<string> {
  const cleanKey = normalizeS3Key(key);
  const folder = getFolderFromKey(cleanKey);
  const rule = FOLDER_RULES[folder];
  const ownerSegment = sanitizeOwnerSegment(userId);

  if (action === "read" && rule.accessLevel === "public-read") {
    return cleanKey;
  }

  if (ownerSegment && cleanKey.startsWith(`${folder}/${ownerSegment}/`)) {
    return cleanKey;
  }

  const config = getS3Config();
  const s3 = getS3Client();
  const head = await s3.send(
    new HeadObjectCommand({
      Bucket: config.bucket,
      Key: cleanKey,
    })
  );

  const uploadedBy = head.Metadata?.["uploaded-by"];
  if (uploadedBy === userId) {
    return cleanKey;
  }

  throw new Error("[S3 Storage Error] You are not allowed to access this file.");
}

/**
 * Verifies magic bytes of the file buffer to prevent extension spoofing attacks.
 */
export function verifyMagicBytes(buffer: Buffer, contentType: string): boolean {
  if (!buffer || buffer.length < 4) {
    return false;
  }

  const header = buffer.subarray(0, 12);

  // PDF check (%PDF-)
  if (contentType === "application/pdf") {
    return header[0] === 0x25 && header[1] === 0x50 && header[2] === 0x44 && header[3] === 0x46;
  }

  // PNG check (\x89PNG)
  if (contentType === "image/png") {
    return header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4e && header[3] === 0x47;
  }

  // JPEG check (\xFF\xD8\xFF)
  if (contentType === "image/jpeg" || contentType === "image/jpg") {
    return header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
  }

  // WEBP check (RIFF....WEBP)
  if (contentType === "image/webp") {
    const isRiff = header[0] === 0x52 && header[1] === 0x49 && header[2] === 0x46 && header[3] === 0x46;
    const isWebp = header[8] === 0x57 && header[9] === 0x45 && header[10] === 0x42 && header[11] === 0x50;
    return isRiff && isWebp;
  }

  // DOCX / ZIP check (PK\x03\x04)
  if (
    contentType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return header[0] === 0x50 && header[1] === 0x4b && header[2] === 0x03 && header[3] === 0x04;
  }

  // Legacy DOC check (\xD0\xCF\x11\xE0)
  if (contentType === "application/msword") {
    return header[0] === 0xd0 && header[1] === 0xcf && header[2] === 0x11 && header[3] === 0xe0;
  }

  // Default fallback for validated MIME types
  return true;
}

/**
 * Validates file size, extension, MIME type, and magic bytes according to folder rules.
 */
export function validateUploadFile(
  buffer: Buffer,
  originalFileName: string,
  contentType: string,
  folder: UploadFolder
): void {
  const rule = FOLDER_RULES[folder];
  if (!rule) {
    throw new Error(`[S3 Validation Error] Invalid upload folder: '${folder}'`);
  }

  // 1. Check File Size
  if (buffer.length === 0) {
    throw new Error(`[S3 Validation Error] File is empty (0 bytes).`);
  }
  if (buffer.length > rule.maxSizeBytes) {
    const maxMb = (rule.maxSizeBytes / (1024 * 1024)).toFixed(0);
    const actualMb = (buffer.length / (1024 * 1024)).toFixed(2);
    throw new Error(
      `[S3 Validation Error] File size (${actualMb} MB) exceeds maximum allowed limit of ${maxMb} MB for ${folder}.`
    );
  }

  // 2. Check Extension
  const sanitized = sanitizeFileName(originalFileName);
  const ext = path.extname(sanitized).toLowerCase();
  if (!rule.allowedExtensions.includes(ext)) {
    throw new Error(
      `[S3 Validation Error] File extension '${ext}' is not allowed for ${folder}. Allowed extensions: ${rule.allowedExtensions.join(
        ", "
      )}`
    );
  }

  // 3. Check Content Type (MIME)
  const normalizedContentType = contentType.toLowerCase().split(";")[0].trim();
  if (!rule.allowedMimeTypes.includes(normalizedContentType)) {
    throw new Error(
      `[S3 Validation Error] MIME type '${normalizedContentType}' is not allowed for ${folder}. Allowed types: ${rule.allowedMimeTypes.join(
        ", "
      )}`
    );
  }

  // 4. Magic Bytes Inspection
  if (!verifyMagicBytes(buffer, normalizedContentType)) {
    throw new Error(
      `[S3 Validation Error] File header signature (magic bytes) does not match reported MIME type '${normalizedContentType}'. File rejected for security.`
    );
  }
}

/**
 * Antivirus readiness hook: Simulates or integrates with ClamAV / AWS GuardDuty.
 * Can be hooked into Lambda or container-side scanner before uploading to S3.
 */
export async function scanBufferForThreats(
  buffer: Buffer,
  fileName: string
): Promise<AntivirusScanResult> {
  // Check for known test EICAR malware signature string for security testing
  const eicarSignature = "X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*";
  const bufferString = buffer.toString("utf8", 0, Math.min(buffer.length, 256));

  if (bufferString.includes(eicarSignature)) {
    console.error(`[S3 Antivirus Alert] Malware signature detected in file: ${fileName}`);
    return {
      isClean: false,
      threatName: "EICAR-Test-Signature",
      scannedAt: new Date().toISOString(),
    };
  }

  return {
    isClean: true,
    scannedAt: new Date().toISOString(),
  };
}

// ==========================================
// Core S3 Storage Service Implementation
// ==========================================

/**
 * Uploads a file buffer to AWS S3 with full validation, security metadata, and error handling.
 */
export async function uploadToS3(input: S3UploadInput): Promise<S3UploadOutput> {
  const { fileBuffer, originalFileName, contentType, folder, userId, customMetadata } = input;

  // Step 1: Validate file against folder rules
  validateUploadFile(fileBuffer, originalFileName, contentType, folder);

  // Step 2: Antivirus scan check
  const scanResult = await scanBufferForThreats(fileBuffer, originalFileName);
  if (!scanResult.isClean) {
    throw new Error(
      `[S3 Security Error] Antivirus scan rejected file '${originalFileName}'. Detected threat: ${scanResult.threatName}`
    );
  }

  // Step 3: Prepare S3 parameters
  const config = getS3Config();
  const s3 = getS3Client();
  const key = generateS3Key(folder, originalFileName, userId);
  const rule = FOLDER_RULES[folder];
  const isPrivate = rule.accessLevel === "private";

  const sanitizedOriginalName = sanitizeFileName(originalFileName);

  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
    ACL: (isPrivate ? "private" : "public-read") as ObjectCannedACL,
    Metadata: {
      "uploaded-by": userId || "system",
      "original-name": sanitizedOriginalName,
      "scan-status": "clean",
      "folder-type": folder,
      ...customMetadata,
    },
  });

  try {
    const response = await s3.send(command);

    // Compute public/private URL
    const publicBase =
      config.publicBaseUrl || `https://${config.bucket}.s3.${config.region}.amazonaws.com`;
    const url = isPrivate ? key : `${publicBase}/${key}`;

    const result: S3UploadOutput = {
      key,
      url,
      bucket: config.bucket,
      region: config.region,
      fileName: sanitizedOriginalName,
      fileSize: fileBuffer.length,
      contentType,
      folder,
      isPrivate,
      uploadedAt: new Date().toISOString(),
      etag: response.ETag?.replace(/"/g, ""),
    };

    console.info(`[S3 Storage Success] Uploaded '${key}' (${fileBuffer.length} bytes) to ${config.bucket}`);
    return result;
  } catch (error: unknown) {
    const err = error as Error & { code?: string; $metadata?: { httpStatusCode?: number } };
    console.error(`[S3 Storage Exception] Failed to upload '${key}' to bucket '${config.bucket}':`, {
      message: err.message,
      code: err.code,
      statusCode: err.$metadata?.httpStatusCode,
    });
    throw new Error(`AWS S3 Upload Failed: ${err.message}`);
  }
}

/**
 * Deletes an object from AWS S3 by key.
 */
export async function deleteFromS3(key: string, userId?: string): Promise<boolean> {
  if (!key || typeof key !== "string") {
    throw new Error("[S3 Storage Error] Key is required for file deletion.");
  }

  const cleanKey = userId
    ? await assertCanAccessS3Object(key, userId, "delete")
    : normalizeS3Key(key);

  const config = getS3Config();
  const s3 = getS3Client();

  const command = new DeleteObjectCommand({
    Bucket: config.bucket,
    Key: cleanKey,
  });

  try {
    await s3.send(command);
    console.info(`[S3 Storage Success] Deleted key '${cleanKey}' from bucket '${config.bucket}'`);
    return true;
  } catch (error: unknown) {
    const err = error as Error;
    console.error(`[S3 Storage Exception] Failed to delete key '${cleanKey}':`, err.message);
    return false;
  }
}

/**
 * Generates a presigned GET URL for downloading private files (resumes, certificates).
 */
export async function getSignedDownloadUrl(
  key: string,
  expiresInSeconds = 3600,
  userId?: string
): Promise<string> {
  if (!key) {
    throw new Error("[S3 Storage Error] Key is required for generating signed URL.");
  }

  const cleanKey = userId
    ? await assertCanAccessS3Object(key, userId, "read")
    : normalizeS3Key(key);
  const safeExpiresInSeconds = Math.min(3600, Math.max(60, expiresInSeconds));
  const config = getS3Config();
  const s3 = getS3Client();

  const command = new GetObjectCommand({
    Bucket: config.bucket,
    Key: cleanKey,
  });

  try {
    const url = await getSignedUrl(s3, command, { expiresIn: safeExpiresInSeconds });
    return url;
  } catch (error: unknown) {
    const err = error as Error;
    console.error(`[S3 Presigned Error] Failed to generate signed URL for key '${cleanKey}':`, err.message);
    throw new Error(`Failed to generate signed download URL: ${err.message}`);
  }
}

/**
 * Generates a presigned PUT URL for direct client-to-S3 uploads.
 */
export async function getSignedUploadUrl(
  folder: UploadFolder,
  originalFileName: string,
  contentType: string,
  fileSize: number,
  userId?: string
): Promise<PresignedUploadResult> {
  const rule = FOLDER_RULES[folder];
  if (!rule) {
    throw new Error(`[S3 Error] Invalid folder '${folder}'`);
  }

  validateUploadMetadata(originalFileName, contentType, fileSize, folder);

  const config = getS3Config();
  const s3 = getS3Client();
  const key = generateS3Key(folder, originalFileName, userId);
  const isPrivate = rule.accessLevel === "private";

  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: key,
    ContentType: contentType,
    ACL: (isPrivate ? "private" : "public-read") as ObjectCannedACL,
    Metadata: {
      "uploaded-by": userId || "system",
      "original-name": sanitizeFileName(originalFileName),
      "folder-type": folder,
    },
  });

  const expiresInSeconds = 900; // 15 minutes
  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: expiresInSeconds });
  const publicBase =
    config.publicBaseUrl || `https://${config.bucket}.s3.${config.region}.amazonaws.com`;
  const publicUrl = isPrivate ? key : `${publicBase}/${key}`;

  return {
    uploadUrl,
    key,
    publicUrl,
    expiresInSeconds,
    headers: {
      "Content-Type": contentType,
      "x-amz-acl": isPrivate ? "private" : "public-read",
    },
  };
}

// ==========================================
// Reusable Domain Helper Functions
// ==========================================

/**
 * Converts File or Uint8Array or Buffer into a standard Node.js Buffer.
 */
async function toBuffer(fileInput: File | Buffer | Uint8Array): Promise<Buffer> {
  if (Buffer.isBuffer(fileInput)) {
    return fileInput;
  }
  if (fileInput instanceof Uint8Array) {
    return Buffer.from(fileInput);
  }
  if (typeof File !== "undefined" && fileInput instanceof File) {
    const arrayBuffer = await fileInput.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
  throw new Error("[S3 Helper Error] Unsupported file input format. Expected File or Buffer.");
}

/**
 * Upload helper specifically tailored for Candidate Resumes (PDF, DOC, DOCX up to 10MB).
 */
export async function uploadResume(
  fileInput: File | Buffer | Uint8Array,
  fileName: string,
  contentType: string,
  userId?: string
): Promise<S3UploadOutput> {
  const fileBuffer = await toBuffer(fileInput);
  return uploadToS3({
    fileBuffer,
    originalFileName: fileName,
    contentType,
    folder: "resumes",
    userId,
  });
}

/**
 * Upload helper specifically tailored for Candidate Profile Photos (PNG, JPG, WEBP up to 5MB).
 */
export async function uploadProfilePhoto(
  fileInput: File | Buffer | Uint8Array,
  fileName: string,
  contentType: string,
  userId?: string
): Promise<S3UploadOutput> {
  const fileBuffer = await toBuffer(fileInput);
  return uploadToS3({
    fileBuffer,
    originalFileName: fileName,
    contentType,
    folder: "profile-images",
    userId,
  });
}

/**
 * Upload helper specifically tailored for Employer Company Logos (PNG, JPG, WEBP up to 5MB).
 */
export async function uploadCompanyLogo(
  fileInput: File | Buffer | Uint8Array,
  fileName: string,
  contentType: string,
  userId?: string
): Promise<S3UploadOutput> {
  const fileBuffer = await toBuffer(fileInput);
  return uploadToS3({
    fileBuffer,
    originalFileName: fileName,
    contentType,
    folder: "company-logos",
    userId,
  });
}

/**
 * Upload helper specifically tailored for Skill / Education Certificates (PDF, DOC, DOCX, PNG, JPG up to 10MB).
 */
export async function uploadCertificate(
  fileInput: File | Buffer | Uint8Array,
  fileName: string,
  contentType: string,
  userId?: string
): Promise<S3UploadOutput> {
  const fileBuffer = await toBuffer(fileInput);
  return uploadToS3({
    fileBuffer,
    originalFileName: fileName,
    contentType,
    folder: "certificates",
    userId,
  });
}
