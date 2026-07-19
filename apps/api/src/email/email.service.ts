import { Injectable, Logger } from "@nestjs/common";
import { EmailTemplateType } from "@prisma/client";

import { AuthenticatedUser } from "../auth/types/authenticated-user.type";
import { PrismaService } from "../prisma/prisma.service";
import { EmailTemplateDto } from "./dto/email-template.dto";

type EmailInput = {
  to: string;
  subject: string;
  body: string;
};

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly prisma: PrismaService) {}

  async send(input: EmailInput) {
    this.logger.log(`Email queued to ${input.to}: ${input.subject}`);
    return {
      queued: true,
      provider: "email-outbox",
      ...input,
    };
  }

  applicationConfirmation(to: string, jobTitle: string) {
    return this.send({
      to,
      subject: `Application received for ${jobTitle}`,
      body: `Your application for ${jobTitle} was submitted successfully.`,
    });
  }

  interviewInvitation(to: string, jobTitle: string, startsAt: Date) {
    return this.send({
      to,
      subject: `Interview scheduled for ${jobTitle}`,
      body: `Your interview for ${jobTitle} is scheduled for ${startsAt.toISOString()}.`,
    });
  }

  applicationStatus(to: string, jobTitle: string, status: string) {
    return this.send({
      to,
      subject: `Application update for ${jobTitle}`,
      body: `Your application status for ${jobTitle} changed to ${status}.`,
    });
  }

  offerEmail(to: string, jobTitle: string) {
    return this.send({
      to,
      subject: `Offer details for ${jobTitle}`,
      body: `Congratulations. Offer details for ${jobTitle} are ready for review.`,
    });
  }

  rejectionEmail(to: string, jobTitle: string) {
    return this.send({
      to,
      subject: `Application update for ${jobTitle}`,
      body: `Thank you for your interest in ${jobTitle}. We will not be moving forward at this time.`,
    });
  }

  reminderEmail(to: string, subject: string, body: string) {
    return this.send({ to, subject, body });
  }

  listTemplates() {
    return this.prisma.emailTemplate.findMany({
      orderBy: [{ type: "asc" }, { name: "asc" }],
    });
  }

  upsertTemplate(user: AuthenticatedUser, dto: EmailTemplateDto) {
    return this.prisma.emailTemplate.upsert({
      create: {
        ...dto,
        active: dto.active ?? true,
        createdById: user.sub,
      },
      update: {
        subject: dto.subject,
        body: dto.body,
        active: dto.active ?? true,
      },
      where: {
        type_name: {
          type: dto.type,
          name: dto.name,
        },
      },
    });
  }

  async renderTemplate(
    type: EmailTemplateType,
    variables: Record<string, string>,
  ) {
    const template = await this.prisma.emailTemplate.findFirst({
      orderBy: { updatedAt: "desc" },
      where: { type, active: true },
    });
    if (!template) return null;
    return {
      subject: this.interpolate(template.subject, variables),
      body: this.interpolate(template.body, variables),
    };
  }

  private interpolate(template: string, variables: Record<string, string>) {
    return template.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
      return variables[key] ?? "";
    });
  }
}
