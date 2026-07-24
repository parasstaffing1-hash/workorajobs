export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/msword", // .doc
];

export const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".doc"];

export interface ValidationResult {
  valid: boolean;
  error?: string;
  fileTypeLabel?: "PDF" | "DOCX" | "DOC";
}

export function validateResumeFile(
  fileName: string,
  fileSize: number,
  mimeType?: string
): ValidationResult {
  const ext = fileName.substring(fileName.lastIndexOf(".")).toLowerCase();

  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: `Invalid file extension (${ext}). Only PDF (.pdf) and Word documents (.docx, .doc) are supported.`,
    };
  }

  if (mimeType && !ALLOWED_MIME_TYPES.includes(mimeType)) {
    return {
      valid: false,
      error: `Invalid file type (${mimeType}). Please upload a valid PDF or DOCX file.`,
    };
  }

  if (fileSize > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (fileSize / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size (${sizeMb} MB) exceeds maximum allowed limit of 10 MB.`,
    };
  }

  let fileTypeLabel: "PDF" | "DOCX" | "DOC" = "PDF";
  if (ext === ".docx") fileTypeLabel = "DOCX";
  if (ext === ".doc") fileTypeLabel = "DOC";

  return {
    valid: true,
    fileTypeLabel,
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
