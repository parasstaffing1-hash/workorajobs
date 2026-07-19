import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { AuthenticatedUser } from "../auth/types/authenticated-user.type";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { AdminService } from "./admin.service";
import {
  AssignRoleDto,
  ContentPageDto,
  MaintenanceModeDto,
  PlatformPermissionDto,
  PlatformRoleDto,
  UpsertFeatureFlagDto,
  UpsertSystemSettingDto,
} from "./dto/admin.dto";

@ApiTags("Admin")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("admin")
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get("dashboard")
  dashboard() {
    return this.admin.dashboard();
  }

  @Get("statistics")
  statistics() {
    return this.admin.statistics();
  }

  @Get("users")
  users(@Query("role") role?: UserRole) {
    return this.admin.users(role);
  }

  @Get("jobs")
  jobs() {
    return this.admin.jobs();
  }

  @Get("applications")
  applications() {
    return this.admin.applications();
  }

  @Get("roles")
  roles() {
    return this.admin.roles();
  }

  @Post("roles")
  upsertRole(@Body() dto: PlatformRoleDto) {
    return this.admin.upsertRole(dto);
  }

  @Get("permissions")
  permissions() {
    return this.admin.permissions();
  }

  @Post("permissions")
  upsertPermission(@Body() dto: PlatformPermissionDto) {
    return this.admin.upsertPermission(dto);
  }

  @Post("role-assignments")
  assignRole(@Body() dto: AssignRoleDto) {
    return this.admin.assignRole(dto);
  }

  @Get("audit-logs")
  auditLogs() {
    return this.admin.auditLogs();
  }

  @Get("activity")
  activityTimeline() {
    return this.admin.activityTimeline();
  }

  @Get("search")
  search(@Query("q") q?: string) {
    return this.admin.globalSearch(q);
  }

  @Get("content")
  content() {
    return this.admin.content();
  }

  @Post("content")
  upsertContent(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ContentPageDto,
  ) {
    return this.admin.upsertContent(user, dto);
  }

  @Get("media")
  media() {
    return this.admin.media();
  }

  @Get("settings")
  settings() {
    return this.admin.settings();
  }

  @Post("settings")
  upsertSetting(@Body() dto: UpsertSystemSettingDto) {
    return this.admin.upsertSetting(dto);
  }

  @Get("feature-flags")
  featureFlags() {
    return this.admin.featureFlags();
  }

  @Post("feature-flags")
  upsertFeatureFlag(@Body() dto: UpsertFeatureFlagDto) {
    return this.admin.upsertFeatureFlag(dto);
  }

  @Post("maintenance")
  maintenance(@Body() dto: MaintenanceModeDto) {
    return this.admin.maintenance(dto);
  }
}
