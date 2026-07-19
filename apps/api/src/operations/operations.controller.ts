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
import { Roles } from "../common/decorators/roles.decorator";
import {
  CreateCapabilityDto,
  CreateSupportTicketDto,
  LogReplicationDto,
  QueryGraphDto,
  RecordHealthScoreDto,
  RegisterAgentDto,
  RegisterGaReleaseDto,
  ResolveIncidentDto,
  RunAgentDto,
  TriggerIncidentDto,
} from "./dto/operations.dto";
import { OperationsService } from "./operations.service";

@ApiTags("Operations (AIOps, BI, GRC, GA)")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("operations")
export class OperationsController {
  constructor(private readonly operations: OperationsService) {}

  @Post("incidents")
  triggerIncident(@Body() dto: TriggerIncidentDto) {
    return this.operations.triggerIncident(dto);
  }

  @Patch("incidents/:id")
  resolveIncident(@Param("id") id: string, @Body() dto: ResolveIncidentDto) {
    return this.operations.resolveIncident(id, dto);
  }

  @Get("incidents")
  getIncidents() {
    return this.operations.getIncidents();
  }

  @Post("graph/query")
  queryRelationships(@Body() dto: QueryGraphDto) {
    return this.operations.queryRelationships(dto);
  }

  @Post("agents")
  registerAgent(@Body() dto: RegisterAgentDto) {
    return this.operations.registerAgent(dto);
  }

  @Post("agents/:id/run")
  runAgent(@Param("id") id: string, @Body() dto: RunAgentDto) {
    return this.operations.runAgent(id, dto);
  }

  @Post("replication")
  logReplication(@Body() dto: LogReplicationDto) {
    return this.operations.logReplication(dto);
  }

  @Post("capabilities")
  createCapability(@Body() dto: CreateCapabilityDto) {
    return this.operations.createCapability(dto);
  }

  @Post("tickets")
  createSupportTicket(@Body() dto: CreateSupportTicketDto) {
    return this.operations.createSupportTicket(dto);
  }

  @Post("health-scores")
  recordHealthScore(@Body() dto: RecordHealthScoreDto) {
    return this.operations.recordHealthScore(dto);
  }

  @Post("releases")
  registerGaRelease(@Body() dto: RegisterGaReleaseDto) {
    return this.operations.registerGaRelease(dto);
  }
}
