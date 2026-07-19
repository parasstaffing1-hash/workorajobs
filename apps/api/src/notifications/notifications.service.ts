import { Injectable } from "@nestjs/common";
import { NotificationType, Prisma } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  create(input: {
    userId: string;
    type: NotificationType;
    title: string;
    body: string;
    metadata?: Prisma.InputJsonValue;
  }) {
    return this.prisma.notification.create({
      data: input,
    });
  }

  list(userId: string) {
    return this.prisma.notification.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        userId,
      },
    });
  }

  markRead(userId: string, id: string) {
    return this.prisma.notification.updateMany({
      data: {
        readAt: new Date(),
      },
      where: {
        id,
        userId,
      },
    });
  }
}
