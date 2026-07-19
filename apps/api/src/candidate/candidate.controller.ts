import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { AuthenticatedUser } from "../auth/types/authenticated-user.type";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { CandidateService } from "./candidate.service";
import { CandidateProfileDto } from "./dto/candidate-profile.dto";
import {
  CertificationDto,
  EducationDto,
  ExperienceDto,
  LanguageDto,
  SkillDto,
} from "./dto/candidate-section.dto";

@ApiTags("Candidate Platform")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.CANDIDATE, UserRole.ADMIN)
@Controller("candidate")
export class CandidateController {
  constructor(private readonly candidate: CandidateService) {}

  @Get("dashboard")
  dashboard(@CurrentUser() user: AuthenticatedUser) {
    return this.candidate.dashboard(user);
  }

  @Get("profile")
  profile(@CurrentUser() user: AuthenticatedUser) {
    return this.candidate.getProfile(user.sub);
  }

  @Put("profile")
  updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CandidateProfileDto,
  ) {
    return this.candidate.updateProfile(user, dto);
  }

  @Post("resume")
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file"))
  uploadResume(
    @CurrentUser() user: AuthenticatedUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.candidate.uploadResume(user, file);
  }

  @Post("resumes")
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file"))
  uploadResumeVersion(
    @CurrentUser() user: AuthenticatedUser,
    @UploadedFile() file: Express.Multer.File,
    @Body("name") name?: string,
  ) {
    return this.candidate.uploadResumeVersion(user, file, name);
  }

  @Get("resumes")
  getResumeVersions(@CurrentUser() user: AuthenticatedUser) {
    return this.candidate.getResumeVersions(user.sub);
  }

  @Delete("resumes/:id")
  deleteResumeVersion(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
  ) {
    return this.candidate.deleteResumeVersion(user, id);
  }

  @Put("resumes/:id/primary")
  setPrimaryResume(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
  ) {
    return this.candidate.setPrimaryResume(user, id);
  }

  @Post("resumes/:id/parse")
  parseResume(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
  ) {
    return this.candidate.parseResumeWithGemini(user, id);
  }

  @Post("optimize-bullet")
  optimizeBullet(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: { bulletText: string; jobTitle?: string },
  ) {
    return this.candidate.optimizeBullet(user, dto.bulletText, dto.jobTitle);
  }

  @Post("tailor-resume")
  tailorResume(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: { resumeText: string; jobDescription: string },
  ) {
    return this.candidate.tailorResume(user, dto.resumeText, dto.jobDescription);
  }

  @Get("resume")
  resume(@CurrentUser() user: AuthenticatedUser) {
    return this.candidate.resume(user.sub);
  }

  @Post("education")
  education(@CurrentUser() user: AuthenticatedUser, @Body() dto: EducationDto) {
    return this.candidate.addEducation(user, dto);
  }

  @Post("experience")
  experience(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ExperienceDto,
  ) {
    return this.candidate.addExperience(user, dto);
  }

  @Post("skills")
  skill(@CurrentUser() user: AuthenticatedUser, @Body() dto: SkillDto) {
    return this.candidate.addSkill(user, dto);
  }

  @Post("certifications")
  certification(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CertificationDto,
  ) {
    return this.candidate.addCertification(user, dto);
  }

  @Post("languages")
  language(@CurrentUser() user: AuthenticatedUser, @Body() dto: LanguageDto) {
    return this.candidate.addLanguage(user, dto);
  }

  @Get("saved-jobs")
  savedJobs(@CurrentUser() user: AuthenticatedUser) {
    return this.candidate.savedJobs(user);
  }

  @Post("saved-jobs/:jobId")
  saveJob(
    @CurrentUser() user: AuthenticatedUser,
    @Param("jobId") jobId: string,
  ) {
    return this.candidate.saveJob(user, jobId);
  }

  @Delete("saved-jobs/:jobId")
  unsaveJob(
    @CurrentUser() user: AuthenticatedUser,
    @Param("jobId") jobId: string,
  ) {
    return this.candidate.unsaveJob(user, jobId);
  }

  @Get("applied-jobs")
  appliedJobs(@CurrentUser() user: AuthenticatedUser) {
    return this.candidate.appliedJobs(user);
  }

  @Get("applications/:applicationId/timeline")
  timeline(
    @CurrentUser() user: AuthenticatedUser,
    @Param("applicationId") applicationId: string,
  ) {
    return this.candidate.timeline(user, applicationId);
  }
}
