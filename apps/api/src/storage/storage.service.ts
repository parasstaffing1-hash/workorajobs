import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { MediaAssetType, Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { extname } from "node:path";

import { AuthenticatedUser } from "../auth/types/authenticated-user.type";
import { PrismaService } from "../prisma/prisma.service";

export type UploadKind =
  | "certificate"
  | "company-logo"
  | "content-image"
  | "document"
  | "profile-image"
  | "resume";

const allowedMimeTypes: Record<UploadKind, string[]> = {
  certificate: ["application/pdf", "image/png", "image/jpeg", "image/webp"],
  "company-logo": ["image/png", "image/jpeg", "image/webp", "image/svg+xml"],
  "content-image": ["image/png", "image/jpeg", "image/webp"],
  document: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
  ],
  "profile-image": ["image/png", "image/jpeg", "image/webp"],
  resume: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
};

const maxFileSize: Record<UploadKind, number> = {
  certificate: 8 * 1024 * 1024,
  "company-logo": 2 * 1024 * 1024,
  "content-image": 4 * 1024 * 1024,
  document: 12 * 1024 * 1024,
  "profile-image": 2 * 1024 * 1024,
  resume: 8 * 1024 * 1024,
};

@Injectable()
export class StorageService {
  private readonly s3?: S3Client;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const region = this.config.get<string>("storage.awsRegion");
    const accessKeyId = this.config.get<string>("storage.awsAccessKeyId");
    const secretAccessKey = this.config.get<string>(
      "storage.awsSecretAccessKey",
    );

    if (region && accessKeyId && secretAccessKey) {
      this.s3 = new S3Client({
        region,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
    }
  }

  async upload(file: Express.Multer.File, kind: UploadKind, ownerId: string) {
    this.validate(file, kind);

    const bucket = this.config.get<string>("storage.awsBucket");
    const publicBaseUrl = this.config.get<string>("storage.publicBaseUrl");
    const key = `${kind}/${ownerId}/${randomUUID()}${extname(file.originalname)}`;

    if (this.s3 && bucket) {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      return {
        key,
        url: publicBaseUrl
          ? `${publicBaseUrl.replace(/\/$/, "")}/${key}`
          : `s3://${bucket}/${key}`,
        originalName: file.originalname,
      };
    }

    return {
      key,
      url: `local-storage://${key}`,
      originalName: file.originalname,
    };
  }

  async uploadMedia(input: {
    file: Express.Multer.File;
    kind: UploadKind;
    user: AuthenticatedUser;
    companyId?: string;
    metadata?: Prisma.InputJsonValue;
  }) {
    const upload = await this.upload(input.file, input.kind, input.user.sub);
    return this.prisma.mediaAsset.create({
      data: {
        key: upload.key,
        url: upload.url,
        originalName: upload.originalName,
        mimeType: input.file.mimetype,
        size: input.file.size,
        type: this.mediaType(input.kind),
        uploadedById: input.user.sub,
        companyId: input.companyId,
        metadata: input.metadata,
      },
    });
  }

  private validate(file: Express.Multer.File, kind: UploadKind) {
    if (!file) throw new BadRequestException("File is required.");
    if (!allowedMimeTypes[kind].includes(file.mimetype)) {
      throw new BadRequestException(`Invalid ${kind} file type.`);
    }
    if (file.size > maxFileSize[kind]) {
      throw new BadRequestException(
        `File exceeds ${maxFileSize[kind] / 1024 / 1024}MB limit.`,
      );
    }
  }

  private mediaType(kind: UploadKind) {
    const map: Record<UploadKind, MediaAssetType> = {
      certificate: MediaAssetType.CERTIFICATE,
      "company-logo": MediaAssetType.COMPANY_LOGO,
      "content-image": MediaAssetType.CONTENT_IMAGE,
      document: MediaAssetType.DOCUMENT,
      "profile-image": MediaAssetType.PROFILE_IMAGE,
      resume: MediaAssetType.RESUME,
    };
    return map[kind];
  }
}
