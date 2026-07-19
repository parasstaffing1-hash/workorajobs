import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserRole, InterviewStatus } from "@prisma/client";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { AuthenticatedUser } from "../auth/types/authenticated-user.type";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { RecruitmentWorkflowService } from "./recruitment-workflow.service";
import {
  InterviewScheduleDto,
  InterviewRescheduleDto,
  InterviewCancelDto,
} from "./dto/interview-schedule.dto";
import { FeedbackScorecardDto } from "./dto/feedback-scorecard.dto";
import { CreateOfferDto, OfferApprovalDto, OfferResponseDto } from "./dto/offer.dto";

@ApiTags("Recruitment Workflow")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("recruitment-workflow")
export class RecruitmentWorkflowController {
  constructor(private readonly service: RecruitmentWorkflowService) {}

  @Roles(UserRole.RECRUITER, UserRole.ADMIN, UserRole.EMPLOYER)
  @Post("interviews/schedule/:applicationId")
  schedule(
    @CurrentUser() user: AuthenticatedUser,
    @Param("applicationId") applicationId: string,
    @Body() dto: InterviewScheduleDto,
  ) {
    return this.service.scheduleInterview(user, applicationId, dto);
  }

  @Roles(UserRole.RECRUITER, UserRole.ADMIN, UserRole.EMPLOYER)
  @Post("interviews/:interviewId/reschedule")
  reschedule(
    @CurrentUser() user: AuthenticatedUser,
    @Param("interviewId") interviewId: string,
    @Body() dto: InterviewRescheduleDto,
  ) {
    return this.service.rescheduleInterview(user, interviewId, dto);
  }

  @Roles(UserRole.RECRUITER, UserRole.ADMIN, UserRole.EMPLOYER)
  @Post("interviews/:interviewId/cancel")
  cancel(
    @CurrentUser() user: AuthenticatedUser,
    @Param("interviewId") interviewId: string,
    @Body() dto: InterviewCancelDto,
  ) {
    return this.service.cancelInterview(user, interviewId, dto);
  }

  @Roles(UserRole.RECRUITER, UserRole.ADMIN, UserRole.EMPLOYER)
  @Post("interviews/:interviewId/feedback")
  feedback(
    @CurrentUser() user: AuthenticatedUser,
    @Param("interviewId") interviewId: string,
    @Body() dto: FeedbackScorecardDto,
  ) {
    return this.service.submitFeedback(user, interviewId, dto);
  }

  @Roles(UserRole.RECRUITER, UserRole.ADMIN, UserRole.EMPLOYER)
  @Post("offers")
  createOffer(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateOfferDto,
  ) {
    return this.service.createOffer(user, dto);
  }

  @Roles(UserRole.RECRUITER, UserRole.ADMIN, UserRole.EMPLOYER)
  @Post("offers/:offerId/approve")
  approveOffer(
    @CurrentUser() user: AuthenticatedUser,
    @Param("offerId") offerId: string,
    @Body() dto: OfferApprovalDto,
  ) {
    return this.service.approveOffer(user, offerId, dto);
  }

  @Roles(UserRole.RECRUITER, UserRole.ADMIN, UserRole.EMPLOYER)
  @Post("offers/:offerId/send")
  sendOffer(
    @CurrentUser() user: AuthenticatedUser,
    @Param("offerId") offerId: string,
  ) {
    return this.service.sendOffer(user, offerId);
  }

  @Roles(UserRole.RECRUITER, UserRole.ADMIN, UserRole.EMPLOYER, UserRole.CANDIDATE)
  @Post("offers/:offerId/respond")
  respondToOffer(
    @Param("offerId") offerId: string,
    @Body() dto: OfferResponseDto,
  ) {
    return this.service.respondToOffer(offerId, dto);
  }

  @Roles(UserRole.RECRUITER, UserRole.ADMIN, UserRole.EMPLOYER)
  @Post("offers/:offerId/withdraw")
  withdrawOffer(
    @CurrentUser() user: AuthenticatedUser,
    @Param("offerId") offerId: string,
  ) {
    return this.service.withdrawOffer(user, offerId);
  }

  @Roles(UserRole.RECRUITER, UserRole.ADMIN, UserRole.EMPLOYER)
  @Get("interviews")
  getInterviews(
    @Query("status") status?: InterviewStatus,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("sortBy") sortBy?: string,
    @Query("sortOrder") sortOrder?: "asc" | "desc",
  ) {
    return this.service.getInterviews({ status, page, limit, sortBy, sortOrder });
  }

  @Roles(UserRole.RECRUITER, UserRole.ADMIN, UserRole.EMPLOYER)
  @Get("offers")
  getOffers(
    @Query("status") status?: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
  ) {
    return this.service.getOffers({ status, page, limit });
  }

  @Roles(UserRole.RECRUITER, UserRole.ADMIN, UserRole.EMPLOYER)
  @Get("analytics")
  getAnalytics() {
    return this.service.getDashboardAnalytics();
  }

  @Roles(UserRole.RECRUITER, UserRole.ADMIN, UserRole.EMPLOYER)
  @Post("interviews/batch-cancel")
  batchCancel(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: { interviewIds: string[]; reason: string },
  ) {
    return this.service.batchCancelInterviews(user, body.interviewIds, body.reason);
  }
}
