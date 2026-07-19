import { Injectable, Logger } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { Request } from "express";

import { PrismaService } from "../prisma/prisma.service";

type AuditInput = {
  actorId?: string;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Prisma.InputJsonValue;
  request?: Request;
};

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async record(input: AuditInput) {
    try {
      await this.prisma.auditLog.create({
        data: {
          actorId: input.actorId,
          action: input.action,
          entity: input.entity,
          entityId: input.entityId,
          metadata: input.metadata,
          ipAddress: input.request?.ip,
          userAgent: input.request?.headers["user-agent"],
        },
      });
    } catch (error) {
      this.logger.warn(
        `Audit log write failed: ${error instanceof Error ? error.message : "unknown error"}`,
      );
    }
  }
}
