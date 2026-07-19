import { Body, Controller, Get, Param, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { AuthenticatedUser } from "../auth/types/authenticated-user.type";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { UpsertProfileDto } from "./dto/upsert-profile.dto";
import { ProfilesService } from "./profiles.service";

@ApiTags("Profiles")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("profiles")
export class ProfilesController {
  constructor(private readonly profiles: ProfilesService) {}

  @Get("me")
  me(@CurrentUser() user: AuthenticatedUser) {
    return this.profiles.findByUserId(user.sub);
  }

  @Put("me")
  upsertMe(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpsertProfileDto,
  ) {
    return this.profiles.upsert(user.sub, dto);
  }

  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  @UseGuards(RolesGuard)
  @Get(":userId")
  findForUser(@Param("userId") userId: string) {
    return this.profiles.findByUserId(userId);
  }
}
