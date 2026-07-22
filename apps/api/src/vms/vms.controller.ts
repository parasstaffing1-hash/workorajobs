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
import * as PrismaClientPkg from "@prisma/client";
const UserRole = PrismaClientPkg.UserRole || { ADMIN: "ADMIN", RECRUITER: "RECRUITER", CANDIDATE: "CANDIDATE", EMPLOYER: "EMPLOYER" };


import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { AuthenticatedUser } from "../auth/types/authenticated-user.type";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import {
  AddVendorMemberDto,
  CreateRequisitionDto,
  DistributeRequisitionDto,
  RegisterVendorDto,
  SubmitCandidateDto,
  UpdateRequisitionDto,
  UpdateSubmissionStatusDto,
} from "./dto/vms.dto";
import { VmsService } from "./vms.service";

@ApiTags("VMS")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.RECRUITER)
@Controller("vms")
export class VmsController {
  constructor(private readonly vms: VmsService) {}

  @Post("vendors")
  registerVendor(@Body() dto: RegisterVendorDto) {
    return this.vms.registerVendor(dto);
  }

  @Get("vendors")
  getVendors() {
    return this.vms.getVendors();
  }

  @Get("vendors/:id")
  getVendorById(@Param("id") id: string) {
    return this.vms.getVendorById(id);
  }

  @Post("vendors/:id/members")
  addVendorMember(@Param("id") id: string, @Body() dto: AddVendorMemberDto) {
    return this.vms.addVendorMember(id, dto);
  }

  @Get("vendors/:id/scorecard")
  getScorecard(@Param("id") id: string) {
    return this.vms.getScorecard(id);
  }

  @Post("requisitions")
  createRequisition(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateRequisitionDto,
  ) {
    return this.vms.createRequisition(user, dto);
  }

  @Patch("requisitions/:id")
  updateRequisition(@Param("id") id: string, @Body() dto: UpdateRequisitionDto) {
    return this.vms.updateRequisition(id, dto);
  }

  @Get("requisitions")
  getRequisitions(@Query("companyId") companyId?: string) {
    return this.vms.getRequisitions(companyId);
  }

  @Get("requisitions/:id")
  getRequisitionById(@Param("id") id: string) {
    return this.vms.getRequisitionById(id);
  }

  @Post("requisitions/:id/distribute")
  distributeRequisition(
    @Param("id") id: string,
    @Body() dto: DistributeRequisitionDto,
  ) {
    return this.vms.distributeRequisition(id, dto);
  }

  @Post("submissions")
  submitCandidate(@Body() dto: SubmitCandidateDto) {
    return this.vms.submitCandidate(dto);
  }

  @Get("submissions")
  getSubmissions(
    @Query("vendorId") vendorId?: string,
    @Query("requisitionId") requisitionId?: string,
  ) {
    return this.vms.getSubmissions(vendorId, requisitionId);
  }

  @Patch("submissions/:id/status")
  updateSubmissionStatus(
    @Param("id") id: string,
    @Body() dto: UpdateSubmissionStatusDto,
  ) {
    return this.vms.updateSubmissionStatus(id, dto);
  }

  @Get("analytics")
  getAnalytics() {
    return this.vms.getAnalytics();
  }
}
