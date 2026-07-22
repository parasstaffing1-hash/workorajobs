import { BadRequestException, ForbiddenException, Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { Prisma, TaskStatus as PrismaTaskStatus, UserRole as PrismaUserRole, RecruiterRole as PrismaRecruiterRole, RecruiterStatus as PrismaRecruiterStatus } from "@prisma/client";

const UserRole = PrismaUserRole || {
  RECRUITER: "RECRUITER" as any,
  EMPLOYER: "EMPLOYER" as any,
  ADMIN: "ADMIN" as any,
};

const RecruiterRole = PrismaRecruiterRole || {
  OWNER: "OWNER" as any,
  ADMIN: "ADMIN" as any,
  STANDARD: "STANDARD" as any,
};


const RecruiterStatus = PrismaRecruiterStatus || {
  ACTIVE: "ACTIVE" as any,
  SUSPENDED: "SUSPENDED" as any,
  PENDING: "PENDING" as any,
};

const TaskStatus = PrismaTaskStatus || {
  PENDING: "PENDING" as any,
  IN_PROGRESS: "IN_PROGRESS" as any,
  COMPLETED: "COMPLETED" as any,
};

import { AuditService } from "../audit/audit.service";
import { AuthenticatedUser } from "../auth/types/authenticated-user.type";
import { PrismaService } from "../prisma/prisma.service";
import { QueueService } from "../common/queue/queue.service";
import { RegisterRecruiterDto, UpdateRecruiterProfileDto, AssignCompanyDto } from "./dto/recruiter-profile.dto";
import { CreateHiringTeamDto, AddTeamMemberDto, InviteTeamMemberDto } from "./dto/hiring-team.dto";
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

@Injectable()
export class RecruiterService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly queue: QueueService,
  ) {}

  onModuleInit() {
    // Register background queue workers for enterprise recruiter features
    this.queue.registerWorker("recruiter-invitations", async (data) => {
      await this.processRecruiterInvitation(data);
    });

    this.queue.registerWorker("activity-processing", async (data) => {
      await this.processRecruiterActivityLog(data);
    });
  }

  async dashboard(user: AuthenticatedUser) {
    const recruiterScoped = this.recruiterScoped(user);
    const [assignedJobs, assignedCandidates, openTasks, interviews, pipeline] =
      await Promise.all([
        this.prisma.job.count({
          where: recruiterScoped ? { assignedRecruiterId: user.sub } : {},
        }),
        this.prisma.candidateProfile.count({
          where: recruiterScoped ? { assignedRecruiterId: user.sub } : {},
        }),
        this.prisma.recruiterTask.count({
          where: {
            recruiterId: recruiterScoped ? user.sub : undefined,
            status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] },
          },
        }),
        this.prisma.interview.count({
          where: recruiterScoped
            ? {
                OR: [
                  { scheduledById: user.sub },
                  {
                    application: {
                      job: {
                        assignedRecruiterId: user.sub,
                      },
                    },
                  },
                ],
                startsAt: { gte: new Date() },
              }
            : { startsAt: { gte: new Date() } },
        }),
        this.prisma.jobApplication.groupBy({
          by: ["status"],
          _count: { _all: true },
          where: recruiterScoped
            ? { job: { assignedRecruiterId: user.sub } }
            : undefined,
        }),
      ]);

    return {
      metrics: {
        assignedJobs,
        assignedCandidates,
        openTasks,
        upcomingInterviews: interviews,
      },
      pipeline: pipeline.map((item) => ({
        status: item.status,
        count: item._count._all,
      })),
    };
  }

  listAssignedJobs(user: AuthenticatedUser) {
    return this.prisma.job.findMany({
      include: {
        company: true,
        analytics: true,
        _count: { select: { applications: true } },
      },
      orderBy: { updatedAt: "desc" },
      where: this.recruiterScoped(user)
        ? {
            OR: [
              { assignedRecruiterId: user.sub },
              { recruiterAssignments: { some: { recruiterId: user.sub } } },
            ],
          }
        : {},
    });
  }

  listAssignedCandidates(user: AuthenticatedUser) {
    return this.prisma.candidateProfile.findMany({
      include: this.candidateInclude(),
      orderBy: { updatedAt: "desc" },
      where: this.recruiterScoped(user)
        ? {
            OR: [
              { assignedRecruiterId: user.sub },
              { recruiterAssignments: { some: { recruiterId: user.sub } } },
            ],
          }
        : {},
    });
  }

  async searchCandidates(query: CandidateSearchDto) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 20);
    const where = this.buildCandidateWhere(query);
    const needsBooleanPass = Boolean(query.booleanQuery);

    const [items, total] = await Promise.all([
      this.prisma.candidateProfile.findMany({
        include: this.candidateInclude(),
        orderBy: { updatedAt: "desc" },
        skip: needsBooleanPass ? 0 : (page - 1) * limit,
        take: needsBooleanPass ? 100 : limit,
        where,
      }),
      this.prisma.candidateProfile.count({ where }),
    ]);

    const filtered = needsBooleanPass
      ? items.filter((candidate) =>
          this.matchesBooleanQuery(candidate, query.booleanQuery),
        )
      : items;

    return {
      items: needsBooleanPass
        ? filtered.slice((page - 1) * limit, page * limit)
        : filtered,
      pagination: {
        page,
        limit,
        total: needsBooleanPass ? filtered.length : total,
        pages: Math.ceil((needsBooleanPass ? filtered.length : total) / limit),
      },
    };
  }

  listSavedSearches(user: AuthenticatedUser) {
    return this.prisma.savedSearch.findMany({
      orderBy: { updatedAt: "desc" },
      where: { recruiterId: user.sub },
    });
  }

  createSavedSearch(user: AuthenticatedUser, dto: CreateSavedSearchDto) {
    return this.prisma.savedSearch.create({
      data: {
        name: dto.name,
        query: dto.query,
        filters: dto.filters as Prisma.InputJsonValue | undefined,
        recruiterId: user.sub,
      },
    });
  }

  listTasks(user: AuthenticatedUser) {
    return this.prisma.recruiterTask.findMany({
      include: {
        relatedJob: true,
        relatedCandidateProfile: {
          include: { user: { include: { profile: true } } },
        },
        relatedApplication: { include: { job: true, candidate: true } },
      },
      orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }],
      where: this.recruiterScoped(user) ? { recruiterId: user.sub } : {},
    });
  }

  createTask(user: AuthenticatedUser, dto: CreateRecruiterTaskDto) {
    return this.prisma.recruiterTask.create({
      data: {
        title: dto.title,
        description: dto.description,
        dueAt: dto.dueAt ? new Date(dto.dueAt) : undefined,
        priority: dto.priority,
        relatedJobId: dto.relatedJobId,
        relatedCandidateProfileId: dto.relatedCandidateProfileId,
        relatedApplicationId: dto.relatedApplicationId,
        recruiterId: user.sub,
      },
    });
  }

  async updateTask(
    user: AuthenticatedUser,
    id: string,
    dto: UpdateRecruiterTaskDto,
  ) {
    const task = await this.prisma.recruiterTask.findFirst({
      where: this.recruiterScoped(user)
        ? { id, recruiterId: user.sub }
        : { id },
    });
    if (!task) throw new NotFoundException("Recruiter task not found.");

    return this.prisma.recruiterTask.update({
      data: {
        title: dto.title,
        description: dto.description,
        dueAt: dto.dueAt ? new Date(dto.dueAt) : undefined,
        priority: dto.priority,
        status: dto.status,
        relatedJobId: dto.relatedJobId,
        relatedCandidateProfileId: dto.relatedCandidateProfileId,
        relatedApplicationId: dto.relatedApplicationId,
      },
      where: { id },
    });
  }

  calendar(user: AuthenticatedUser) {
    return this.prisma.interview.findMany({
      include: {
        application: {
          include: {
            candidate: { include: { profile: true, candidateProfile: true } },
            job: { include: { company: true } },
          },
        },
      },
      orderBy: { startsAt: "asc" },
      where: this.recruiterScoped(user)
        ? {
            OR: [
              { scheduledById: user.sub },
              { application: { job: { assignedRecruiterId: user.sub } } },
            ],
          }
        : {},
    });
  }

  async activity(user: AuthenticatedUser) {
    const recruiterWhere = this.recruiterScoped(user)
      ? { changedById: user.sub }
      : {};
    const [stageChanges, notes, tasks] = await Promise.all([
      this.prisma.applicationStageHistory.findMany({
        include: {
          application: { include: { job: true, candidate: true } },
          stage: true,
          changedBy: { include: { profile: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
        where: recruiterWhere,
      }),
      this.prisma.candidateNote.findMany({
        include: {
          candidateProfile: {
            include: { user: { include: { profile: true } } },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
        where: this.recruiterScoped(user) ? { authorId: user.sub } : {},
      }),
      this.prisma.recruiterTask.findMany({
        orderBy: { updatedAt: "desc" },
        take: 20,
        where: this.recruiterScoped(user) ? { recruiterId: user.sub } : {},
      }),
    ]);

    return { stageChanges, notes, tasks };
  }

  async addNote(
    user: AuthenticatedUser,
    candidateProfileId: string,
    dto: CandidateNoteDto,
  ) {
    await this.assertCandidateProfile(candidateProfileId);
    const note = await this.prisma.candidateNote.create({
      data: {
        candidateProfileId,
        authorId: user.sub,
        body: dto.body,
      },
    });
    await this.audit.record({
      actorId: user.sub,
      action: "recruiter.candidate.note.created",
      entity: "CandidateProfile",
      entityId: candidateProfileId,
    });
    return note;
  }

  async tagCandidate(
    user: AuthenticatedUser,
    candidateProfileId: string,
    dto: CandidateTagDto,
  ) {
    await this.assertCandidateProfile(candidateProfileId);
    const tag = await this.prisma.candidateTag.upsert({
      create: { name: dto.name, color: dto.color },
      update: { color: dto.color },
      where: { name: dto.name },
    });
    return this.prisma.candidateProfileTag.upsert({
      create: {
        candidateProfileId,
        tagId: tag.id,
        assignedById: user.sub,
      },
      update: {
        assignedById: user.sub,
      },
      where: {
        candidateProfileId_tagId: {
          candidateProfileId,
          tagId: tag.id,
        },
      },
    });
  }

  async rateCandidate(
    user: AuthenticatedUser,
    candidateProfileId: string,
    dto: CandidateRatingDto,
  ) {
    await this.assertCandidateProfile(candidateProfileId);
    const rating = await this.prisma.candidateRating.create({
      data: {
        candidateProfileId,
        jobId: dto.jobId,
        recruiterId: user.sub,
        score: dto.score,
        notes: dto.notes,
      },
    });
    await this.audit.record({
      actorId: user.sub,
      action: "recruiter.candidate.rated",
      entity: "CandidateProfile",
      entityId: candidateProfileId,
      metadata: { score: dto.score, jobId: dto.jobId },
    });
    return rating;
  }

  private async assertCandidateProfile(candidateProfileId: string) {
    const profile = await this.prisma.candidateProfile.findUnique({
      where: { id: candidateProfileId },
    });
    if (!profile) throw new NotFoundException("Candidate profile not found.");
    return profile;
  }

  private buildCandidateWhere(query: CandidateSearchDto) {
    const keyword = query.keyword ?? this.firstBooleanTerm(query.booleanQuery);
    const contains = (value?: string) =>
      value ? { contains: value, mode: "insensitive" as const } : undefined;
    const where: Prisma.CandidateProfileWhereInput = {
      preferredLocation: contains(query.location),
      availability: contains(query.availability),
      preferredJobType: query.employmentType,
      salaryExpectationMin: query.salaryMin
        ? { gte: Number(query.salaryMin) }
        : undefined,
      salaryExpectationMax: query.salaryMax
        ? { lte: Number(query.salaryMax) }
        : undefined,
      skills: query.skill
        ? { some: { name: contains(query.skill) } }
        : undefined,
      certifications: query.certification
        ? { some: { name: contains(query.certification) } }
        : undefined,
      education: query.education
        ? {
            some: {
              OR: [
                { institution: contains(query.education) },
                { degree: contains(query.education) },
                { fieldOfStudy: contains(query.education) },
              ],
            },
          }
        : undefined,
      OR: keyword
        ? [
            { user: { email: contains(keyword) } },
            { user: { profile: { is: { firstName: contains(keyword) } } } },
            { user: { profile: { is: { lastName: contains(keyword) } } } },
            { user: { profile: { is: { headline: contains(keyword) } } } },
            { skills: { some: { name: contains(keyword) } } },
            { certifications: { some: { name: contains(keyword) } } },
            { resumeIndex: { is: { keywords: { has: keyword } } } },
          ]
        : undefined,
    };
    return where;
  }

  private matchesBooleanQuery(candidate: unknown, query?: string) {
    if (!query) return true;
    const terms = query
      .match(/"[^"]+"|\S+/g)
      ?.map((term) => term.replaceAll('"', "").trim())
      .filter(
        (term) => term && !["AND", "OR", "NOT"].includes(term.toUpperCase()),
      );
    if (!terms?.length) return true;

    const haystack = JSON.stringify(candidate).toLowerCase();
    if (query.toUpperCase().includes(" OR ")) {
      return terms.some((term) => haystack.includes(term.toLowerCase()));
    }
    return terms.every((term) => haystack.includes(term.toLowerCase()));
  }

  private firstBooleanTerm(query?: string) {
    return query
      ?.match(/"[^"]+"|\S+/g)
      ?.map((term) => term.replaceAll('"', "").trim())
      .find(
        (term) => term && !["AND", "OR", "NOT"].includes(term.toUpperCase()),
      );
  }

  private recruiterScoped(user: AuthenticatedUser) {
    return user.role !== UserRole.ADMIN;
  }

  private candidateInclude() {
    return {
      user: { include: { profile: true } },
      skills: true,
      certifications: true,
      education: true,
      experience: true,
      languages: true,
      resumeIndex: true,
      tags: { include: { tag: true } },
      ratings: true,
      notes: { orderBy: { createdAt: "desc" as const }, take: 3 },
    } as const;
  }

  // Helper to obtain company context for the active User
  async getCompanyForUser(user: AuthenticatedUser) {
    if (user.role === UserRole.ADMIN) {
      return null;
    }
    if (user.role === UserRole.EMPLOYER) {
      const company = await this.prisma.company.findFirst({
        where: { ownerId: user.sub },
      });
      if (!company) {
        throw new NotFoundException("Company profile not found.");
      }
      return company;
    }
    if (user.role === UserRole.RECRUITER) {
      const profile = await this.prisma.recruiterProfile.findUnique({
        where: { userId: user.sub },
      });
      if (!profile || !profile.companyId) {
        throw new ForbiddenException("Recruiter profile not created or assigned to any company.");
      }
      const company = await this.prisma.company.findUnique({
        where: { id: profile.companyId },
      });
      if (!company) {
        throw new NotFoundException("Company not found.");
      }
      return company;
    }
    throw new ForbiddenException("Invalid role context for company access.");
  }

  // Get active recruiter profile
  async getProfile(user: AuthenticatedUser) {
    const profile = await this.prisma.recruiterProfile.findUnique({
      where: { userId: user.sub },
      include: {
        user: { include: { profile: true } },
        company: true,
      },
    });
    if (!profile) {
      throw new NotFoundException("Recruiter profile not found.");
    }
    return profile;
  }

  // Register recruiter
  async registerRecruiter(user: AuthenticatedUser, dto: RegisterRecruiterDto) {
    const existing = await this.prisma.recruiterProfile.findUnique({
      where: { userId: user.sub },
    });
    if (existing) {
      throw new BadRequestException("Recruiter profile already exists.");
    }

    const profile = await this.prisma.recruiterProfile.create({
      data: {
        userId: user.sub,
        companyId: dto.companyId,
        title: dto.title,
        phone: dto.phone,
        status: RecruiterStatus.PENDING,
        role: RecruiterRole.RECRUITER,
      },
      include: { company: true },
    });

    await this.audit.record({
      actorId: user.sub,
      action: "recruiter.registered",
      entity: "RecruiterProfile",
      entityId: profile.id,
      metadata: { companyId: dto.companyId },
    });

    // Enqueue background processing
    await this.queue.add("activity-processing", {
      actorId: user.sub,
      action: "REGISTERED",
      details: "Recruiter registered onto Workora",
    });

    return profile;
  }

  // Update profile
  async updateProfile(user: AuthenticatedUser, dto: UpdateRecruiterProfileDto) {
    const profile = await this.prisma.recruiterProfile.findUnique({
      where: { userId: user.sub },
    });
    if (!profile) {
      throw new NotFoundException("Recruiter profile not found.");
    }

    const updated = await this.prisma.recruiterProfile.update({
      where: { userId: user.sub },
      data: {
        title: dto.title,
        phone: dto.phone,
        profilePicture: dto.profilePicture,
        status: dto.status,
        role: dto.role,
      },
    });

    await this.audit.record({
      actorId: user.sub,
      action: "recruiter.profile.updated",
      entity: "RecruiterProfile",
      entityId: profile.id,
    });

    return updated;
  }

  // Assign company
  async assignCompany(user: AuthenticatedUser, dto: AssignCompanyDto) {
    const profile = await this.prisma.recruiterProfile.findUnique({
      where: { userId: user.sub },
    });
    if (!profile) {
      throw new NotFoundException("Recruiter profile not found. Please register first.");
    }

    const updated = await this.prisma.recruiterProfile.update({
      where: { userId: user.sub },
      data: { companyId: dto.companyId },
    });

    await this.audit.record({
      actorId: user.sub,
      action: "recruiter.company.assigned",
      entity: "RecruiterProfile",
      entityId: profile.id,
      metadata: { companyId: dto.companyId },
    });

    return updated;
  }

  // List recruiters belonging to the company
  async listCompanyRecruiters(user: AuthenticatedUser) {
    const company = await this.getCompanyForUser(user);
    if (!company) {
      return this.prisma.recruiterProfile.findMany({
        include: { user: { include: { profile: true } } },
      });
    }

    return this.prisma.recruiterProfile.findMany({
      where: { companyId: company.id },
      include: { user: { include: { profile: true } } },
    });
  }

  // Update recruiter in company (requires admin/owner or role authority)
  async updateCompanyRecruiter(user: AuthenticatedUser, recruiterId: string, dto: UpdateRecruiterProfileDto) {
    const company = await this.getCompanyForUser(user);
    const target = await this.prisma.recruiterProfile.findUnique({
      where: { id: recruiterId },
    });
    if (!target) {
      throw new NotFoundException("Target recruiter profile not found.");
    }

    if (company && target.companyId !== company.id) {
      throw new ForbiddenException("Recruiter belongs to another company.");
    }

    // Role verification: ensure updater is OWNER or ADMIN if updating target roles
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.EMPLOYER) {
      const activeProfile = await this.prisma.recruiterProfile.findUnique({
        where: { userId: user.sub },
      });
      if (!activeProfile || (activeProfile.role !== RecruiterRole.OWNER && activeProfile.role !== RecruiterRole.ADMIN)) {
        throw new ForbiddenException("Only company admins or owners can update recruiter roles/statuses.");
      }
    }

    const updated = await this.prisma.recruiterProfile.update({
      where: { id: recruiterId },
      data: {
        status: dto.status,
        role: dto.role,
      },
    });

    await this.audit.record({
      actorId: user.sub,
      action: "recruiter.company.member.updated",
      entity: "RecruiterProfile",
      entityId: recruiterId,
      metadata: { role: dto.role, status: dto.status },
    });

    return updated;
  }

  // -------------------------
  // HIRING TEAMS
  // -------------------------

  async createHiringTeam(user: AuthenticatedUser, dto: CreateHiringTeamDto) {
    const company = await this.getCompanyForUser(user);
    if (!company) {
      throw new BadRequestException("Company context required to create hiring team.");
    }

    const team = await this.prisma.hiringTeam.create({
      data: {
        companyId: company.id,
        name: dto.name,
        ownerId: user.sub,
      },
    });

    // Auto-join owner as OWNER
    await this.prisma.hiringTeamMember.create({
      data: {
        teamId: team.id,
        userId: user.sub,
        role: RecruiterRole.OWNER,
      },
    });

    await this.audit.record({
      actorId: user.sub,
      action: "hiring_team.created",
      entity: "HiringTeam",
      entityId: team.id,
      metadata: { name: dto.name },
    });

    return team;
  }

  async listHiringTeams(user: AuthenticatedUser) {
    const company = await this.getCompanyForUser(user);
    if (!company) {
      return this.prisma.hiringTeam.findMany({
        include: { members: { include: { user: { include: { profile: true } } } } },
      });
    }

    return this.prisma.hiringTeam.findMany({
      where: { companyId: company.id },
      include: {
        members: {
          include: {
            user: { include: { profile: true, recruiterProfile: true } },
          },
        },
        invitations: true,
      },
    });
  }

  async getHiringTeam(user: AuthenticatedUser, teamId: string) {
    const company = await this.getCompanyForUser(user);
    const team = await this.prisma.hiringTeam.findUnique({
      where: { id: teamId },
      include: {
        members: { include: { user: { include: { profile: true, recruiterProfile: true } } } },
        invitations: true,
      },
    });

    if (!team) throw new NotFoundException("Hiring team not found.");
    if (company && team.companyId !== company.id) {
      throw new ForbiddenException("This team does not belong to your company.");
    }

    return team;
  }

  async updateHiringTeam(user: AuthenticatedUser, teamId: string, name: string) {
    const team = await this.getHiringTeam(user, teamId);
    // Only owner of team, company admin or system admin can edit team
    if (user.role !== UserRole.ADMIN && team.ownerId !== user.sub) {
      throw new ForbiddenException("Only the team owner or admins can modify this team.");
    }

    const updated = await this.prisma.hiringTeam.update({
      where: { id: teamId },
      data: { name },
    });

    await this.audit.record({
      actorId: user.sub,
      action: "hiring_team.updated",
      entity: "HiringTeam",
      entityId: teamId,
      metadata: { name },
    });

    return updated;
  }

  async deleteHiringTeam(user: AuthenticatedUser, teamId: string) {
    const team = await this.getHiringTeam(user, teamId);
    if (user.role !== UserRole.ADMIN && team.ownerId !== user.sub) {
      throw new ForbiddenException("Only the team owner or admins can delete this team.");
    }

    await this.prisma.hiringTeam.delete({
      where: { id: teamId },
    });

    await this.audit.record({
      actorId: user.sub,
      action: "hiring_team.deleted",
      entity: "HiringTeam",
      entityId: teamId,
    });

    return { success: true };
  }

  async addTeamMember(user: AuthenticatedUser, teamId: string, dto: AddTeamMemberDto) {
    const team = await this.getHiringTeam(user, teamId);
    if (user.role !== UserRole.ADMIN && team.ownerId !== user.sub) {
      throw new ForbiddenException("Only the team owner or admins can add members directly.");
    }

    const member = await this.prisma.hiringTeamMember.upsert({
      create: {
        teamId,
        userId: dto.userId,
        role: dto.role,
      },
      update: {
        role: dto.role,
      },
      where: {
        teamId_userId: {
          teamId,
          userId: dto.userId,
        },
      },
    });

    await this.audit.record({
      actorId: user.sub,
      action: "hiring_team.member.added",
      entity: "HiringTeam",
      entityId: teamId,
      metadata: { userId: dto.userId, role: dto.role },
    });

    return member;
  }

  async removeTeamMember(user: AuthenticatedUser, teamId: string, memberId: string) {
    const team = await this.getHiringTeam(user, teamId);
    if (user.role !== UserRole.ADMIN && team.ownerId !== user.sub && user.sub !== memberId) {
      throw new ForbiddenException("Only the team owner or admins can remove members.");
    }

    // Don't allow removing the owner unless the team is deleted or ownership transferred
    if (team.ownerId === memberId) {
      throw new BadRequestException("Cannot remove the team owner. Transer ownership or delete the team.");
    }

    await this.prisma.hiringTeamMember.delete({
      where: {
        teamId_userId: {
          teamId,
          userId: memberId,
        },
      },
    });

    await this.audit.record({
      actorId: user.sub,
      action: "hiring_team.member.removed",
      entity: "HiringTeam",
      entityId: teamId,
      metadata: { userId: memberId },
    });

    return { success: true };
  }

  async inviteTeamMember(user: AuthenticatedUser, teamId: string, dto: InviteTeamMemberDto) {
    const team = await this.getHiringTeam(user, teamId);
    if (user.role !== UserRole.ADMIN && team.ownerId !== user.sub) {
      throw new ForbiddenException("Only team owners or admins can invite new members.");
    }

    const token = `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    const invitation = await this.prisma.hiringTeamInvitation.create({
      data: {
        teamId,
        email: dto.email.toLowerCase(),
        role: dto.role,
        token,
        status: "PENDING",
        invitedById: user.sub,
        expiresAt,
      },
    });

    await this.audit.record({
      actorId: user.sub,
      action: "hiring_team.member.invited",
      entity: "HiringTeam",
      entityId: teamId,
      metadata: { email: dto.email, role: dto.role, invitationId: invitation.id },
    });

    // Enqueue BullMQ worker style background job
    await this.queue.add("recruiter-invitations", {
      invitationId: invitation.id,
      email: dto.email,
      role: dto.role,
      teamName: team.name,
      senderName: user.email,
    });

    return invitation;
  }

  async listTeamInvitations(user: AuthenticatedUser, teamId: string) {
    const team = await this.getHiringTeam(user, teamId);
    return this.prisma.hiringTeamInvitation.findMany({
      where: { teamId: team.id },
      include: { invitedBy: { include: { profile: true } } },
    });
  }

  async acceptTeamInvitation(token: string, user: AuthenticatedUser) {
    const invitation = await this.prisma.hiringTeamInvitation.findUnique({
      where: { token },
      include: { team: true },
    });

    if (!invitation) {
      throw new NotFoundException("Invitation not found.");
    }

    if (invitation.status !== "PENDING") {
      throw new BadRequestException(`Invitation is already ${invitation.status.toLowerCase()}.`);
    }

    if (invitation.expiresAt < new Date()) {
      await this.prisma.hiringTeamInvitation.update({
        where: { id: invitation.id },
        data: { status: "EXPIRED" },
      });
      throw new BadRequestException("Invitation token has expired.");
    }

    // Add as member
    const member = await this.prisma.hiringTeamMember.create({
      data: {
        teamId: invitation.teamId,
        userId: user.sub,
        role: invitation.role,
      },
    });

    // Auto assign company to recruiter profile if not yet set
    await this.prisma.recruiterProfile.upsert({
      create: {
        userId: user.sub,
        companyId: invitation.team.companyId,
        status: RecruiterStatus.ACTIVE,
        role: invitation.role,
      },
      update: {
        companyId: invitation.team.companyId,
        role: invitation.role,
      },
      where: { userId: user.sub },
    });

    // Mark invitation accepted
    await this.prisma.hiringTeamInvitation.update({
      where: { id: invitation.id },
      data: { status: "ACCEPTED" },
    });

    await this.audit.record({
      actorId: user.sub,
      action: "hiring_team.invitation.accepted",
      entity: "HiringTeam",
      entityId: invitation.teamId,
      metadata: { invitationId: invitation.id },
    });

    return member;
  }

  // -------------------------
  // BACKGROUND PROCESSORS
  // -------------------------

  private async processRecruiterInvitation(data: any) {
    console.log(`[Worker] Processing recruiter invitation for ${data.email} to join ${data.teamName}...`);
    // Here we can trigger notification systems, sync with email, etc.
    // In our enterprise setup, we can also write logs or queue notification
    await this.queue.add("notification-queue", {
      recipientEmail: data.email,
      type: "RECRUITER_INVITATION",
      subject: `Invitation to join ${data.teamName} on Workora`,
      body: `Hi there, you have been invited by ${data.senderName} to join the hiring team "${data.teamName}" on Workora as a ${data.role}.`,
    });
  }

  private async processRecruiterActivityLog(data: any) {
    console.log(`[Worker] Recording recruiter activity in background:`, data);
    // In background, we could push this to a reporting engine or clickhouse/redis analytics.
  }
}

