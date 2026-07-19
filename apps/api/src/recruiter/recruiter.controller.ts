import {
  Body,
  Controller,
  Delete,
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
import {
  CandidateNoteDto,
  CandidateRatingDto,
  CandidateTagDto,
} from "./dto/candidate-collaboration.dto";
import { CandidateSearchDto } from "./dto/candidate-search.dto";
import {
  CreateRecruiterTaskDto,
  UpdateRecruiterTaskDto,
} from "./dto/recruiter-task.dto";
import { CreateSavedSearchDto } from "./dto/saved-search.dto";
import { RegisterRecruiterDto, UpdateRecruiterProfileDto, AssignCompanyDto } from "./dto/recruiter-profile.dto";
import { CreateHiringTeamDto, AddTeamMemberDto, InviteTeamMemberDto } from "./dto/hiring-team.dto";
import { RecruiterService } from "./recruiter.service";

@ApiTags("Recruiter")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.RECRUITER, UserRole.EMPLOYER, UserRole.ADMIN)
@Controller("recruiter")
export class RecruiterController {
  constructor(private readonly recruiter: RecruiterService) {}

  @Get("dashboard")
  dashboard(@CurrentUser() user: AuthenticatedUser) {
    return this.recruiter.dashboard(user);
  }

  @Get("jobs/assigned")
  assignedJobs(@CurrentUser() user: AuthenticatedUser) {
    return this.recruiter.listAssignedJobs(user);
  }

  @Get("candidates/assigned")
  assignedCandidates(@CurrentUser() user: AuthenticatedUser) {
    return this.recruiter.listAssignedCandidates(user);
  }

  @Get("candidates")
  searchCandidates(@Query() query: CandidateSearchDto) {
    return this.recruiter.searchCandidates(query);
  }

  @Get("saved-searches")
  savedSearches(@CurrentUser() user: AuthenticatedUser) {
    return this.recruiter.listSavedSearches(user);
  }

  @Post("saved-searches")
  createSavedSearch(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateSavedSearchDto,
  ) {
    return this.recruiter.createSavedSearch(user, dto);
  }

  @Get("tasks")
  tasks(@CurrentUser() user: AuthenticatedUser) {
    return this.recruiter.listTasks(user);
  }

  @Post("tasks")
  createTask(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateRecruiterTaskDto,
  ) {
    return this.recruiter.createTask(user, dto);
  }

  @Patch("tasks/:id")
  updateTask(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
    @Body() dto: UpdateRecruiterTaskDto,
  ) {
    return this.recruiter.updateTask(user, id, dto);
  }

  @Get("calendar")
  calendar(@CurrentUser() user: AuthenticatedUser) {
    return this.recruiter.calendar(user);
  }

  @Get("activity")
  activity(@CurrentUser() user: AuthenticatedUser) {
    return this.recruiter.activity(user);
  }

  @Post("candidates/:candidateProfileId/notes")
  addNote(
    @CurrentUser() user: AuthenticatedUser,
    @Param("candidateProfileId") candidateProfileId: string,
    @Body() dto: CandidateNoteDto,
  ) {
    return this.recruiter.addNote(user, candidateProfileId, dto);
  }

  @Post("candidates/:candidateProfileId/tags")
  tagCandidate(
    @CurrentUser() user: AuthenticatedUser,
    @Param("candidateProfileId") candidateProfileId: string,
    @Body() dto: CandidateTagDto,
  ) {
    return this.recruiter.tagCandidate(user, candidateProfileId, dto);
  }

  @Post("candidates/:candidateProfileId/ratings")
  rateCandidate(
    @CurrentUser() user: AuthenticatedUser,
    @Param("candidateProfileId") candidateProfileId: string,
    @Body() dto: CandidateRatingDto,
  ) {
    return this.recruiter.rateCandidate(user, candidateProfileId, dto);
  }

  // -------------------------
  // RECRUITER PROFILE ENDPOINTS
  // -------------------------

  @Get("profile")
  getProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.recruiter.getProfile(user);
  }

  @Post("register")
  registerRecruiter(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: RegisterRecruiterDto,
  ) {
    return this.recruiter.registerRecruiter(user, dto);
  }

  @Patch("profile")
  updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateRecruiterProfileDto,
  ) {
    return this.recruiter.updateProfile(user, dto);
  }

  @Post("company/assign")
  assignCompany(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AssignCompanyDto,
  ) {
    return this.recruiter.assignCompany(user, dto);
  }

  @Get("company/recruiters")
  listCompanyRecruiters(@CurrentUser() user: AuthenticatedUser) {
    return this.recruiter.listCompanyRecruiters(user);
  }

  @Patch("company/recruiters/:id")
  updateCompanyRecruiter(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") recruiterId: string,
    @Body() dto: UpdateRecruiterProfileDto,
  ) {
    return this.recruiter.updateCompanyRecruiter(user, recruiterId, dto);
  }

  // -------------------------
  // HIRING TEAMS ENDPOINTS
  // -------------------------

  @Post("teams")
  createHiringTeam(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateHiringTeamDto,
  ) {
    return this.recruiter.createHiringTeam(user, dto);
  }

  @Get("teams")
  listHiringTeams(@CurrentUser() user: AuthenticatedUser) {
    return this.recruiter.listHiringTeams(user);
  }

  @Get("teams/:id")
  getHiringTeam(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
  ) {
    return this.recruiter.getHiringTeam(user, id);
  }

  @Patch("teams/:id")
  updateHiringTeam(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
    @Body() dto: CreateHiringTeamDto, // Reuses creation name validation
  ) {
    return this.recruiter.updateHiringTeam(user, id, dto.name);
  }

  @Delete("teams/:id")
  deleteHiringTeam(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
  ) {
    return this.recruiter.deleteHiringTeam(user, id);
  }

  @Post("teams/:id/members")
  addTeamMember(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
    @Body() dto: AddTeamMemberDto,
  ) {
    return this.recruiter.addTeamMember(user, id, dto);
  }

  @Delete("teams/:id/members/:memberId")
  removeTeamMember(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
    @Param("memberId") memberId: string,
  ) {
    return this.recruiter.removeTeamMember(user, id, memberId);
  }

  @Post("teams/:id/invitations")
  inviteTeamMember(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
    @Body() dto: InviteTeamMemberDto,
  ) {
    return this.recruiter.inviteTeamMember(user, id, dto);
  }

  @Get("teams/:id/invitations")
  listTeamInvitations(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
  ) {
    return this.recruiter.listTeamInvitations(user, id);
  }

  @Post("teams/invitations/accept")
  acceptTeamInvitation(
    @Query("token") token: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.recruiter.acceptTeamInvitation(token, user);
  }
}
