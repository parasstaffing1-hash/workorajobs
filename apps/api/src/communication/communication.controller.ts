import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { CommunicationService } from "./communication.service";
import {
  CommunicationProviderDto,
  SendCommunicationDto,
} from "./dto/communication.dto";

@ApiTags("Communication")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.RECRUITER)
@Controller("communication")
export class CommunicationController {
  constructor(private readonly communication: CommunicationService) {}

  @Get("notifications")
  notificationCenter(@Query("userId") userId?: string) {
    return this.communication.notificationCenter(userId);
  }

  @Get("providers")
  providers() {
    return this.communication.providers();
  }

  @Post("providers")
  upsertProvider(@Body() dto: CommunicationProviderDto) {
    return this.communication.upsertProvider(dto);
  }

  @Get("deliveries")
  deliveries() {
    return this.communication.deliveries();
  }

  @Post("send")
  send(@Body() dto: SendCommunicationDto) {
    return this.communication.send(dto);
  }
}
