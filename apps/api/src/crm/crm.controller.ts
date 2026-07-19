import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { AuthenticatedUser } from "../auth/types/authenticated-user.type";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { CrmService } from "./crm.service";
import {
  CreateClientDto,
  CreateContactDto,
  CreateCrmNoteDto,
  CreateCrmTaskDto,
  CreateLeadDto,
  CreateOpportunityDto,
  UpdateLeadDto,
} from "./dto/crm.dto";

@ApiTags("CRM")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.RECRUITER)
@Controller("crm")
export class CrmController {
  constructor(private readonly crm: CrmService) {}

  @Get("dashboard")
  dashboard() {
    return this.crm.dashboard();
  }

  @Get("leads")
  leads() {
    return this.crm.leads();
  }

  @Post("leads")
  createLead(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateLeadDto,
  ) {
    return this.crm.createLead(user, dto);
  }

  @Patch("leads/:id")
  updateLead(@Param("id") id: string, @Body() dto: UpdateLeadDto) {
    return this.crm.updateLead(id, dto);
  }

  @Get("clients")
  clients() {
    return this.crm.clients();
  }

  @Post("clients")
  createClient(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateClientDto,
  ) {
    return this.crm.createClient(user, dto);
  }

  @Get("contacts")
  contacts() {
    return this.crm.contacts();
  }

  @Post("contacts")
  createContact(@Body() dto: CreateContactDto) {
    return this.crm.createContact(dto);
  }

  @Get("opportunities")
  opportunities() {
    return this.crm.opportunities();
  }

  @Post("opportunities")
  createOpportunity(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateOpportunityDto,
  ) {
    return this.crm.createOpportunity(user, dto);
  }

  @Get("notes")
  notes() {
    return this.crm.notes();
  }

  @Post("notes")
  createNote(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateCrmNoteDto,
  ) {
    return this.crm.createNote(user, dto);
  }

  @Get("tasks")
  tasks() {
    return this.crm.tasks();
  }

  @Post("tasks")
  createTask(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateCrmTaskDto,
  ) {
    return this.crm.createTask(user, dto);
  }

  @Get("pipeline")
  pipeline() {
    return this.crm.pipeline();
  }

  @Get("activity")
  activity() {
    return this.crm.activity();
  }

  @Get("companies")
  companyRecords() {
    return this.crm.companyRecords();
  }
}
