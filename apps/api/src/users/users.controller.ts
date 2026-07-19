import { Body, Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";

import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { AuthenticatedUser } from "../auth/types/authenticated-user.type";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";

@ApiTags("Users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get("me")
  me(@CurrentUser() user: AuthenticatedUser) {
    return this.users.findById(user.sub);
  }

  @Patch("me")
  updateMe(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateUserDto) {
    return this.users.updateSelf(user.sub, dto);
  }

  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  @UseGuards(RolesGuard)
  @Get()
  list() {
    return this.users.list();
  }

  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  @UseGuards(RolesGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.users.findById(id);
  }
}
