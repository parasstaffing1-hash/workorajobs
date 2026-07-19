import { Injectable } from "@nestjs/common";
import { DeliveryStatus, NotificationType, Prisma } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";
import {
  CommunicationProviderDto,
  SendCommunicationDto,
} from "./dto/communication.dto";

@Injectable()
export class CommunicationService {
  constructor(private readonly prisma: PrismaService) {}

  notificationCenter(userId?: string) {
    return this.prisma.notification.findMany({
      include: { deliveries: true, user: { include: { profile: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
      where: { userId },
    });
  }

  providers() {
    return this.prisma.communicationProvider.findMany({
      orderBy: [{ channel: "asc" }, { name: "asc" }],
    });
  }

  upsertProvider(dto: CommunicationProviderDto) {
    return this.prisma.communicationProvider.upsert({
      create: {
        channel: dto.channel,
        name: dto.name,
        enabled: dto.enabled ?? false,
        config: dto.config as Prisma.InputJsonValue | undefined,
      },
      update: {
        enabled: dto.enabled,
        config: dto.config as Prisma.InputJsonValue | undefined,
      },
      where: {
        channel_name: {
          channel: dto.channel,
          name: dto.name,
        },
      },
    });
  }

  deliveries() {
    return this.prisma.notificationDelivery.findMany({
      include: { notification: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  }

  async send(dto: SendCommunicationDto) {
    const notification = dto.userId
      ? await this.prisma.notification.create({
          data: {
            userId: dto.userId,
            type: NotificationType.STATUS_CHANGE_NOTIFICATION,
            title: dto.title,
            body: dto.body,
            metadata: dto.payload as Prisma.InputJsonValue | undefined,
          },
        })
      : null;

    const provider = await this.prisma.communicationProvider.findFirst({
      where: { channel: dto.channel, enabled: true },
    });

    return this.prisma.notificationDelivery.create({
      data: {
        notificationId: notification?.id,
        channel: dto.channel,
        recipient: dto.recipient,
        status: provider ? DeliveryStatus.QUEUED : DeliveryStatus.FAILED,
        provider: provider?.name,
        payload: {
          title: dto.title,
          body: dto.body,
          mode: provider
            ? "provider-configured"
            : "provider-configuration-required",
          ...dto.payload,
        },
        error: provider ? undefined : "No enabled provider for channel.",
      },
    });
  }
}
