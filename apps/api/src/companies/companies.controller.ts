import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { UserRole, VerificationStatus } from "@prisma/client";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { AuthenticatedUser } from "../auth/types/authenticated-user.type";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { CompaniesService } from "./companies.service";
import { CompanySettingsDto } from "./dto/company-settings.dto";
import { SaveCandidateDto } from "./dto/save-candidate.dto";
import { UpsertCompanyDto } from "./dto/upsert-company.dto";
import { RequestVerificationDto, ReviewVerificationDto } from "./dto/company-verification.dto";

@ApiTags("Employer Company")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.EMPLOYER, UserRole.ADMIN, UserRole.RECRUITER)
@Controller("employer")
export class CompaniesController {
  constructor(private readonly companies: CompaniesService) {}

  @Get("dashboard")
  dashboard(@CurrentUser() user: AuthenticatedUser) {
    return this.companies.dashboard(user);
  }

  @Get("company")
  company(@CurrentUser() user: AuthenticatedUser) {
    return this.companies.getOwnedCompany(user);
  }

  @Post("company")
  upsert(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpsertCompanyDto,
  ) {
    return this.companies.upsert(user, dto);
  }

  @Patch("company/settings")
  settings(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CompanySettingsDto,
  ) {
    return this.companies.updateSettings(user, dto);
  }

  @Post("company/logo")
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file"))
  logo(
    @CurrentUser() user: AuthenticatedUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.companies.uploadLogo(user, file);
  }

  @Get("saved-candidates")
  savedCandidates(@CurrentUser() user: AuthenticatedUser) {
    return this.companies.savedCandidates(user);
  }

  @Post("saved-candidates/:candidateProfileId")
  saveCandidate(
    @CurrentUser() user: AuthenticatedUser,
    @Param("candidateProfileId") candidateProfileId: string,
    @Body() dto: SaveCandidateDto,
  ) {
    return this.companies.saveCandidate(user, candidateProfileId, dto);
  }

  @Post("company/banner")
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file"))
  banner(
    @CurrentUser() user: AuthenticatedUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.companies.uploadBanner(user, file);
  }

  @Post("company/verification")
  requestVerification(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: RequestVerificationDto,
  ) {
    return this.companies.requestVerification(user, dto);
  }

  @Get("company/verification")
  getVerificationStatus(@CurrentUser() user: AuthenticatedUser) {
    return this.companies.getVerificationStatus(user);
  }

  @Get("admin/verifications")
  @Roles(UserRole.ADMIN)
  listVerificationsQueue(
    @CurrentUser() user: AuthenticatedUser,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("status") status?: VerificationStatus,
  ) {
    return this.companies.listVerificationsQueue(user, Number(page || 1), Number(limit || 20), status);
  }

  @Patch("admin/verifications/:id")
  @Roles(UserRole.ADMIN)
  reviewVerification(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
    @Body() dto: ReviewVerificationDto,
  ) {
    return this.companies.reviewVerification(user, id, dto);
  }
}
