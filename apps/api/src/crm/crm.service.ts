import { Injectable } from "@nestjs/common";
import { CrmActivityType, Prisma, SalesStage } from "@prisma/client";

import { AuthenticatedUser } from "../auth/types/authenticated-user.type";
import { PrismaService } from "../prisma/prisma.service";
import {
  CreateClientDto,
  CreateContactDto,
  CreateCrmNoteDto,
  CreateCrmTaskDto,
  CreateLeadDto,
  CreateOpportunityDto,
  UpdateLeadDto,
} from "./dto/crm.dto";

@Injectable()
export class CrmService {
  constructor(private readonly prisma: PrismaService) {}

  async dashboard() {
    const [leads, clients, contacts, opportunities, pipeline, tasks] =
      await Promise.all([
        this.prisma.crmLead.count(),
        this.prisma.crmClient.count(),
        this.prisma.crmContact.count(),
        this.prisma.salesOpportunity.count(),
        this.prisma.salesOpportunity.groupBy({
          by: ["stage"],
          _count: { _all: true },
          _sum: { value: true },
        }),
        this.prisma.crmTask.count({ where: { status: { not: "DONE" } } }),
      ]);
    return {
      metrics: { leads, clients, contacts, opportunities, openTasks: tasks },
      pipeline: pipeline.map((item) => ({
        stage: item.stage,
        count: item._count._all,
        value: item._sum.value ?? 0,
      })),
    };
  }

  leads() {
    return this.prisma.crmLead.findMany({
      include: { owner: { include: { profile: true } }, tasks: true },
      orderBy: { updatedAt: "desc" },
      take: 100,
    });
  }

  async createLead(user: AuthenticatedUser, dto: CreateLeadDto) {
    const lead = await this.prisma.crmLead.create({
      data: {
        ...dto,
        ownerId: user.sub,
      },
    });
    await this.recordActivity(user, {
      leadId: lead.id,
      type: CrmActivityType.STATUS_CHANGE,
      title: `Lead created: ${lead.companyName}`,
    });
    return lead;
  }

  updateLead(id: string, dto: UpdateLeadDto) {
    return this.prisma.crmLead.update({
      data: dto,
      where: { id },
    });
  }

  clients() {
    return this.prisma.crmClient.findMany({
      include: {
        company: true,
        owner: { include: { profile: true } },
        contacts: true,
        opportunities: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 100,
    });
  }

  createClient(user: AuthenticatedUser, dto: CreateClientDto) {
    return this.prisma.crmClient.create({
      data: {
        ...dto,
        ownerId: user.sub,
      },
    });
  }

  contacts() {
    return this.prisma.crmContact.findMany({
      include: { client: true },
      orderBy: { updatedAt: "desc" },
      take: 100,
    });
  }

  createContact(dto: CreateContactDto) {
    return this.prisma.crmContact.create({ data: dto });
  }

  opportunities() {
    return this.prisma.salesOpportunity.findMany({
      include: { client: true, owner: { include: { profile: true } } },
      orderBy: { updatedAt: "desc" },
      take: 100,
    });
  }

  createOpportunity(user: AuthenticatedUser, dto: CreateOpportunityDto) {
    return this.prisma.salesOpportunity.create({
      data: {
        clientId: dto.clientId,
        ownerId: user.sub,
        name: dto.name,
        stage: dto.stage ?? SalesStage.PROSPECTING,
        value: dto.value,
        closeDate: dto.closeDate ? new Date(dto.closeDate) : undefined,
      },
    });
  }

  notes() {
    return this.prisma.crmNote.findMany({
      include: {
        author: { include: { profile: true } },
        lead: true,
        client: true,
        contact: true,
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  }

  createNote(user: AuthenticatedUser, dto: CreateCrmNoteDto) {
    return this.prisma.crmNote.create({
      data: {
        ...dto,
        authorId: user.sub,
      },
    });
  }

  tasks() {
    return this.prisma.crmTask.findMany({
      include: {
        owner: { include: { profile: true } },
        lead: true,
        client: true,
        contact: true,
      },
      orderBy: [{ dueAt: "asc" }, { updatedAt: "desc" }],
      take: 100,
    });
  }

  createTask(user: AuthenticatedUser, dto: CreateCrmTaskDto) {
    return this.prisma.crmTask.create({
      data: {
        ...dto,
        ownerId: user.sub,
        dueAt: dto.dueAt ? new Date(dto.dueAt) : undefined,
      },
    });
  }

  pipeline() {
    return this.prisma.salesOpportunity.groupBy({
      by: ["stage"],
      _count: { _all: true },
      _sum: { value: true },
    });
  }

  activity() {
    return this.prisma.crmActivity.findMany({
      include: {
        actor: { include: { profile: true } },
        lead: true,
        client: true,
        contact: true,
        opportunity: true,
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  }

  companyRecords() {
    return this.prisma.company.findMany({
      include: { crmClients: true, jobs: true, subscriptions: true },
      orderBy: { updatedAt: "desc" },
      take: 100,
    });
  }

  private recordActivity(
    user: AuthenticatedUser,
    input: {
      leadId?: string;
      clientId?: string;
      contactId?: string;
      opportunityId?: string;
      type: CrmActivityType;
      title: string;
      metadata?: Prisma.InputJsonValue;
    },
  ) {
    return this.prisma.crmActivity.create({
      data: {
        ...input,
        actorId: user.sub,
      },
    });
  }
}
