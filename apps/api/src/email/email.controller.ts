import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { AuthenticatedUser } from "../auth/types/authenticated-user.type";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { EmailTemplateDto } from "./dto/email-template.dto";
import { EmailService } from "./email.service";

@ApiTags("Email")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.RECRUITER, UserRole.ADMIN)
@Controller("email/templates")
export class EmailController {
  constructor(private readonly email: EmailService) {}

  @Get()
  listTemplates() {
    return this.email.listTemplates();
  }

  @Post()
  upsertTemplate(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: EmailTemplateDto,
  ) {
    return this.email.upsertTemplate(user, dto);
  }
}
