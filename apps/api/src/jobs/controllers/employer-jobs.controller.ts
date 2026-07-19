import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";

import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { AuthenticatedUser } from "../../auth/types/authenticated-user.type";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { CreateJobDto } from "../dto/create-job.dto";
import { UpdateJobDto } from "../dto/update-job.dto";
import { JobsService } from "../jobs.service";

@ApiTags("Employer Jobs")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.EMPLOYER, UserRole.ADMIN, UserRole.RECRUITER)
@Controller("employer/jobs")
export class EmployerJobsController {
  constructor(private readonly jobs: JobsService) {}

  @Get()
  list(@CurrentUser() user: AuthenticatedUser) {
    return this.jobs.listEmployerJobs(user);
  }

  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateJobDto) {
    return this.jobs.create(user, dto);
  }

  @Get("drafts")
  drafts(@CurrentUser() user: AuthenticatedUser) {
    return this.jobs.drafts(user);
  }

  @Get("calendar")
  calendar(@CurrentUser() user: AuthenticatedUser) {
    return this.jobs.interviewCalendar(user);
  }

  @Get(":id")
  get(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return this.jobs.getEmployerJob(user, id);
  }

  @Patch(":id")
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
    @Body() dto: UpdateJobDto,
  ) {
    return this.jobs.update(user, id, dto);
  }

  @Delete(":id")
  remove(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return this.jobs.remove(user, id);
  }

  @Post(":id/duplicate")
  duplicate(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return this.jobs.duplicate(user, id);
  }

  @Post(":id/publish")
  publish(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return this.jobs.publish(user, id);
  }

  @Post(":id/close")
  close(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return this.jobs.close(user, id);
  }

  @Get(":id/analytics")
  analytics(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return this.jobs.analytics(user, id);
  }

  @Get(":id/applicants")
  applicants(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return this.jobs.applicants(user, id);
  }
}
