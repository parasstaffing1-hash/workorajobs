import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { AuthenticatedUser } from "../auth/types/authenticated-user.type";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { AtsService } from "./ats.service";
import {
  CreateHiringStageDto,
  UpdateApplicationStageDto,
} from "./dto/hiring-stage.dto";
import { ResumeIndexDto } from "./dto/resume-index.dto";

@ApiTags("ATS")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.RECRUITER, UserRole.ADMIN)
@Controller("ats")
export class AtsController {
  constructor(private readonly ats: AtsService) {}

  @Get("pipeline")
  pipeline(
    @CurrentUser() user: AuthenticatedUser,
    @Query("jobId") jobId?: string,
  ) {
    return this.ats.pipeline(user, jobId);
  }

  @Post("jobs/:jobId/stages")
  createStage(
    @CurrentUser() user: AuthenticatedUser,
    @Param("jobId") jobId: string,
    @Body() dto: CreateHiringStageDto,
  ) {
    return this.ats.createStage(user, jobId, dto);
  }

  @Patch("applications/:applicationId/stage")
  updateStage(
    @CurrentUser() user: AuthenticatedUser,
    @Param("applicationId") applicationId: string,
    @Body() dto: UpdateApplicationStageDto,
  ) {
    return this.ats.updateApplicationStage(user, applicationId, dto);
  }

  @Get("resumes")
  resumes(@CurrentUser() user: AuthenticatedUser) {
    return this.ats.resumeDatabase(user);
  }

  @Post("resumes/:candidateProfileId/index")
  indexResume(
    @CurrentUser() user: AuthenticatedUser,
    @Param("candidateProfileId") candidateProfileId: string,
    @Body() dto: ResumeIndexDto,
  ) {
    return this.ats.indexResume(user, candidateProfileId, dto);
  }

  @Get("candidates/:candidateProfileId/timeline")
  timeline(@Param("candidateProfileId") candidateProfileId: string) {
    return this.ats.candidateTimeline(candidateProfileId);
  }

  @Get("candidates/:candidateProfileId/duplicates")
  duplicates(@Param("candidateProfileId") candidateProfileId: string) {
    return this.ats.duplicates(candidateProfileId);
  }
}
