import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  AutomationEventType,
  AutomationRunStatus,
  Prisma,
} from "@prisma/client";
import * as bcrypt from "bcryptjs";

import { AuthenticatedUser } from "../auth/types/authenticated-user.type";
import { PrismaService } from "../prisma/prisma.service";
import {
  AutomationEventDto,
  CreateAutomationWebhookDto,
} from "./dto/automation.dto";

@Injectable()
export class AutomationService {
  private readonly logger = new Logger(AutomationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  listWebhooks() {
    return this.prisma.automationWebhook.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async createWebhook(dto: CreateAutomationWebhookDto) {
    return this.prisma.automationWebhook.create({
      data: {
        eventType: dto.eventType,
        name: dto.name,
        targetUrl: dto.targetUrl,
        active: dto.active ?? true,
        secretHash: dto.secret ? await bcrypt.hash(dto.secret, 12) : undefined,
      },
    });
  }

  listRuns() {
    return this.prisma.automationRun.findMany({
      include: { webhook: true, actor: { include: { profile: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  }

  async triggerPublic(
    eventTypeParam: string,
    dto: AutomationEventDto,
    secret?: string,
  ) {
    const eventType = this.parseEventType(eventTypeParam);
    return this.dispatch(eventType, dto.payload, secret);
  }

  async triggerReusable(
    user: AuthenticatedUser,
    eventTypeParam: string,
    dto: AutomationEventDto,
  ) {
    const eventType = this.parseEventType(eventTypeParam);
    return this.dispatch(eventType, dto.payload, undefined, user.sub);
  }

  private async dispatch(
    eventType: AutomationEventType,
    payload: Record<string, unknown>,
    secret?: string,
    actorId?: string,
  ) {
    const webhooks = await this.authorizedWebhooks(eventType, secret);
    if (!webhooks.length) {
      const run = await this.prisma.automationRun.create({
        data: {
          eventType,
          actorId,
          payload: payload as Prisma.InputJsonValue,
          status: AutomationRunStatus.SKIPPED,
          response: {
            reason:
              "No active webhook is configured. Set N8N_BASE_URL or a webhook target URL to execute this automation.",
          },
        },
      });
      return { delivered: 0, runs: [run] };
    }

    const runs = await Promise.all(
      webhooks.map((webhook) =>
        this.executeWebhook(eventType, payload, webhook, actorId),
      ),
    );
    return { delivered: runs.length, runs };
  }

  private async authorizedWebhooks(
    eventType: AutomationEventType,
    secret?: string,
  ) {
    const webhooks = await this.prisma.automationWebhook.findMany({
      where: { active: true, eventType },
    });

    const authorized = [];
    for (const webhook of webhooks) {
      if (!webhook.secretHash) {
        authorized.push(webhook);
        continue;
      }
      if (secret && (await bcrypt.compare(secret, webhook.secretHash))) {
        authorized.push(webhook);
      }
    }

    if (webhooks.length && webhooks.some((webhook) => webhook.secretHash)) {
      if (!authorized.length) {
        throw new ForbiddenException("Invalid automation webhook secret.");
      }
    }

    return authorized;
  }

  private async executeWebhook(
    eventType: AutomationEventType,
    payload: Record<string, unknown>,
    webhook: { id: string; targetUrl: string | null },
    actorId?: string,
  ) {
    const targetUrl = this.targetUrl(eventType, webhook.targetUrl);
    if (!targetUrl) {
      return this.prisma.automationRun.create({
        data: {
          webhookId: webhook.id,
          eventType,
          actorId,
          payload: payload as Prisma.InputJsonValue,
          status: AutomationRunStatus.SKIPPED,
          response: {
            reason:
              "Webhook target is not configured. Add targetUrl or N8N_BASE_URL.",
          },
        },
      });
    }

    try {
      const response = await fetch(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Workora-Automation-Event": eventType,
        },
        body: JSON.stringify(payload),
      });
      const text = await response.text();
      return this.prisma.automationRun.create({
        data: {
          webhookId: webhook.id,
          eventType,
          actorId,
          payload: payload as Prisma.InputJsonValue,
          status: response.ok
            ? AutomationRunStatus.SUCCEEDED
            : AutomationRunStatus.FAILED,
          response: {
            status: response.status,
            body: text.slice(0, 4000),
          },
        },
      });
    } catch (error) {
      this.logger.warn(
        `Automation webhook failed: ${error instanceof Error ? error.message : "unknown error"}`,
      );
      return this.prisma.automationRun.create({
        data: {
          webhookId: webhook.id,
          eventType,
          actorId,
          payload: payload as Prisma.InputJsonValue,
          status: AutomationRunStatus.FAILED,
          error: error instanceof Error ? error.message : "unknown error",
        },
      });
    }
  }

  private targetUrl(eventType: AutomationEventType, explicit?: string | null) {
    if (explicit) return explicit;
    const baseUrl = this.config.get<string>("automation.n8nBaseUrl");
    if (!baseUrl) return null;
    return `${baseUrl.replace(/\/$/, "")}/webhook/${eventType.toLowerCase()}`;
  }

  private parseEventType(value: string) {
    if (
      !Object.values(AutomationEventType).includes(value as AutomationEventType)
    ) {
      throw new BadRequestException("Unsupported automation event type.");
    }
    return value as AutomationEventType;
  }
}
