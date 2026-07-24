import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface StoredFileResult {
  url: string;
  key: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export interface IStorageDriver {
  uploadFile(
    fileBuffer: Buffer,
    originalFileName: string,
    mimeType: string,
    subfolder?: string
  ): Promise<StoredFileResult>;
  deleteFile(fileKey: string): Promise<boolean>;
  getFileBuffer(fileKey: string): Promise<Buffer | null>;
}

/**
 * Local Disk Storage Driver for Development & Standalone Server Deployments
 */
export class LocalStorageDriver implements IStorageDriver {
  private baseDir: string;
  private baseUrl: string;

  constructor() {
    this.baseDir = path.join(process.cwd(), "public", "uploads");
    this.baseUrl = "/uploads";
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  async uploadFile(
    fileBuffer: Buffer,
    originalFileName: string,
    mimeType: string,
    subfolder = "resumes"
  ): Promise<StoredFileResult> {
    const targetFolder = path.join(this.baseDir, subfolder);
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    const fileExt = path.extname(originalFileName) || ".pdf";
    const uniqueHash = crypto.randomBytes(8).toString("hex");
    const safeBaseName = path
      .basename(originalFileName, fileExt)
      .replace(/[^a-zA-Z0-9_-]/g, "_");

    const uniqueFileName = `${safeBaseName}_${Date.now()}_${uniqueHash}${fileExt}`;
    const filePath = path.join(targetFolder, uniqueFileName);
    const relativeKey = `${subfolder}/${uniqueFileName}`;

    await fs.promises.writeFile(filePath, fileBuffer);

    return {
      url: `${this.baseUrl}/${relativeKey}`,
      key: relativeKey,
      fileName: originalFileName,
      fileSize: fileBuffer.length,
      mimeType,
    };
  }

  async deleteFile(fileKey: string): Promise<boolean> {
    try {
      const cleanKey = fileKey.replace(/^\/?uploads\//, "");
      const filePath = path.join(this.baseDir, cleanKey);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
      return false;
    } catch (err) {
      console.warn("Local storage delete file warning:", err);
      return false;
    }
  }

  async getFileBuffer(fileKey: string): Promise<Buffer | null> {
    try {
      const cleanKey = fileKey.replace(/^\/?uploads\//, "");
      const filePath = path.join(this.baseDir, cleanKey);
      if (fs.existsSync(filePath)) {
        return await fs.promises.readFile(filePath);
      }
      return null;
    } catch {
      return null;
    }
  }
}

// Global Storage Factory
export const storageDriver: IStorageDriver = new LocalStorageDriver();
