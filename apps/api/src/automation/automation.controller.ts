import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
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
import { AutomationService } from "./automation.service";
import {
  AutomationEventDto,
  CreateAutomationWebhookDto,
} from "./dto/automation.dto";

@ApiTags("Automation")
@Controller("automation")
export class AutomationController {
  constructor(private readonly automation: AutomationService) {}

  @Post("webhooks/:eventType")
  triggerPublic(
    @Param("eventType") eventType: string,
    @Body() dto: AutomationEventDto,
    @Headers("x-workora-automation-secret") secret?: string,
  ) {
    return this.automation.triggerPublic(eventType, dto, secret);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RECRUITER, UserRole.ADMIN)
  @Post("reusable/:eventType")
  triggerReusable(
    @CurrentUser() user: AuthenticatedUser,
    @Param("eventType") eventType: string,
    @Body() dto: AutomationEventDto,
  ) {
    return this.automation.triggerReusable(user, eventType, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get("webhooks")
  webhooks() {
    return this.automation.listWebhooks();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post("webhooks")
  createWebhook(@Body() dto: CreateAutomationWebhookDto) {
    return this.automation.createWebhook(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RECRUITER, UserRole.ADMIN)
  @Get("runs")
  runs() {
    return this.automation.listRuns();
  }
}
