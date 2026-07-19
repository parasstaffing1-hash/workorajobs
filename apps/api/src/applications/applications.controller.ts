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
import { ApplicationsService } from "./applications.service";
import { ApplyJobDto } from "./dto/apply-job.dto";
import { ChangeApplicationStatusDto } from "./dto/change-application-status.dto";
import { ScheduleInterviewDto } from "./dto/schedule-interview.dto";

@ApiTags("Applications")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class ApplicationsController {
  constructor(private readonly applications: ApplicationsService) {}

  @Roles(UserRole.CANDIDATE, UserRole.ADMIN)
  @Post("applications/jobs/:jobId")
  apply(
    @CurrentUser() user: AuthenticatedUser,
    @Param("jobId") jobId: string,
    @Body() dto: ApplyJobDto,
  ) {
    return this.applications.apply(user, jobId, dto);
  }

  @Roles(UserRole.CANDIDATE, UserRole.ADMIN)
  @Post("applications/:applicationId/withdraw")
  withdraw(
    @CurrentUser() user: AuthenticatedUser,
    @Param("applicationId") applicationId: string,
  ) {
    return this.applications.withdraw(user, applicationId);
  }

  @Roles(UserRole.CANDIDATE, UserRole.ADMIN)
  @Get("applications/:applicationId")
  get(
    @CurrentUser() user: AuthenticatedUser,
    @Param("applicationId") applicationId: string,
  ) {
    return this.applications.getCandidateApplication(user, applicationId);
  }

  @Roles(UserRole.EMPLOYER, UserRole.ADMIN, UserRole.RECRUITER)
  @Patch("employer/applications/:applicationId/status")
  status(
    @CurrentUser() user: AuthenticatedUser,
    @Param("applicationId") applicationId: string,
    @Body() dto: ChangeApplicationStatusDto,
  ) {
    return this.applications.changeStatus(user, applicationId, dto);
  }

  @Roles(UserRole.EMPLOYER, UserRole.ADMIN, UserRole.RECRUITER)
  @Post("employer/applications/:applicationId/shortlist")
  shortlist(
    @CurrentUser() user: AuthenticatedUser,
    @Param("applicationId") applicationId: string,
  ) {
    return this.applications.shortlist(user, applicationId);
  }

  @Roles(UserRole.EMPLOYER, UserRole.ADMIN, UserRole.RECRUITER)
  @Post("employer/applications/:applicationId/reject")
  reject(
    @CurrentUser() user: AuthenticatedUser,
    @Param("applicationId") applicationId: string,
  ) {
    return this.applications.reject(user, applicationId);
  }

  @Roles(UserRole.EMPLOYER, UserRole.ADMIN, UserRole.RECRUITER)
  @Post("employer/applications/:applicationId/interviews")
  scheduleInterview(
    @CurrentUser() user: AuthenticatedUser,
    @Param("applicationId") applicationId: string,
    @Body() dto: ScheduleInterviewDto,
  ) {
    return this.applications.scheduleInterview(user, applicationId, dto);
  }
}
