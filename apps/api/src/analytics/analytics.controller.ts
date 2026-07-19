import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { AuthenticatedUser } from "../auth/types/authenticated-user.type";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { AnalyticsService } from "./analytics.service";
import { CreateReportDto, CsvExportDto } from "./dto/analytics.dto";

@ApiTags("Analytics")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.RECRUITER, UserRole.EMPLOYER)
@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Get("hiring")
  hiring(@CurrentUser() user: AuthenticatedUser) {
    return this.analytics.hiringAnalytics(user);
  }

  @Get("employers")
  employers(@CurrentUser() user: AuthenticatedUser) {
    return this.analytics.employerAnalytics(user);
  }

  @Get("candidates")
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  candidates() {
    return this.analytics.candidateAnalytics();
  }

  @Get("recruiters")
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  recruiters() {
    return this.analytics.recruiterPerformance();
  }

  @Get("funnel")
  funnel(@CurrentUser() user: AuthenticatedUser) {
    return this.analytics.conversionFunnel(user);
  }

  @Get("reports")
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  reports() {
    return this.analytics.reports();
  }

  @Post("reports")
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  createReport(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateReportDto,
  ) {
    return this.analytics.createReport(user, dto);
  }

  @Post("exports")
  @Roles(UserRole.ADMIN, UserRole.RECRUITER, UserRole.EMPLOYER)
  createCsvExport(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CsvExportDto,
  ) {
    return this.analytics.createCsvExport(user, dto);
  }
}
