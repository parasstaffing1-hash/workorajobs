import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { AuthenticatedUser } from "../auth/types/authenticated-user.type";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { AiService } from "./ai.service";
import { AiRequestDto } from "./dto/ai-request.dto";

@ApiTags("AI")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.RECRUITER, UserRole.EMPLOYER, UserRole.ADMIN)
@Controller("ai")
export class AiController {
  constructor(private readonly ai: AiService) {}

  @Post("resume-analysis")
  resumeAnalysis(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AiRequestDto,
  ) {
    return this.ai.resumeAnalysis(user, dto);
  }

  @Post("resume-score")
  resumeScore(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AiRequestDto,
  ) {
    return this.ai.resumeScore(user, dto);
  }

  @Post("candidate-match")
  candidateMatch(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AiRequestDto,
  ) {
    return this.ai.candidateMatch(user, dto);
  }

  @Post("skill-gap")
  skillGap(@CurrentUser() user: AuthenticatedUser, @Body() dto: AiRequestDto) {
    return this.ai.skillGap(user, dto);
  }

  @Post("job-description")
  jobDescription(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AiRequestDto,
  ) {
    return this.ai.jobDescription(user, dto);
  }

  @Post("interview-questions")
  interviewQuestions(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AiRequestDto,
  ) {
    return this.ai.interviewQuestions(user, dto);
  }

  @Post("candidate-summary")
  candidateSummary(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AiRequestDto,
  ) {
    return this.ai.candidateSummary(user, dto);
  }

  @Post("hiring-assistant")
  hiringAssistant(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AiRequestDto,
  ) {
    return this.ai.hiringAssistant(user, dto);
  }
}
