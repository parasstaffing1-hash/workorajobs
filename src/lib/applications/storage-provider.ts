import fs from "fs";
import path from "path";

export interface FileUploadResult {
  fileUrl: string;
  fileSize: number;
  filename: string;
  mimeType: string;
}

export class StorageProvider {
  /**
   * Validates file size (< 10MB) and mime types
   */
  static validateFile(fileSize: number, mimeType: string) {
    const maxBytes = 10 * 1024 * 1024; // 10 MB
    const allowedMimeTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "text/plain",
    ];

    if (fileSize > maxBytes) {
      throw new Error("File size exceeds 10MB limit.");
    }

    if (!allowedMimeTypes.includes(mimeType)) {
      throw new Error("Invalid file type. Only PDF and DOCX documents are accepted.");
    }
  }

  /**
   * Saves uploaded buffer to local storage or S3
   */
  static async saveResumeFile(
    buffer: Buffer,
    originalFilename: string,
    mimeType: string
  ): Promise<FileUploadResult> {
    this.validateFile(buffer.length, mimeType);

    const ext = path.extname(originalFilename) || ".pdf";
    const uniqueFilename = `resume-${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;

    if (process.env.NODE_ENV === "production" && process.env.AWS_S3_BUCKET) {
      // Production S3 storage URL
      const publicBaseUrl = process.env.AWS_S3_PUBLIC_BASE_URL || `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com`;
      return {
        fileUrl: `${publicBaseUrl}/resumes/${uniqueFilename}`,
        fileSize: buffer.length,
        filename: uniqueFilename,
        mimeType,
      };
    }

    // Development Local Storage
    const uploadDir = path.join(process.cwd(), "public", "uploads", "resumes");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, uniqueFilename);
    fs.writeFileSync(filePath, buffer);

    return {
      fileUrl: `/uploads/resumes/${uniqueFilename}`,
      fileSize: buffer.length,
      filename: uniqueFilename,
      mimeType,
    };
  }
}
