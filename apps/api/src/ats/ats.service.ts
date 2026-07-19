import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  ApplicationStatus,
  HiringStageType,
  Prisma,
  UserRole,
} from "@prisma/client";

import { AuditService } from "../audit/audit.service";
import { AuthenticatedUser } from "../auth/types/authenticated-user.type";
import { PrismaService } from "../prisma/prisma.service";
import {
  CreateHiringStageDto,
  UpdateApplicationStageDto,
} from "./dto/hiring-stage.dto";
import { ResumeIndexDto } from "./dto/resume-index.dto";

@Injectable()
export class AtsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async pipeline(user: AuthenticatedUser, jobId?: string) {
    const where = await this.jobScope(user, jobId);
    return this.prisma.job.findMany({
      include: {
        company: true,
        hiringStages: {
          include: {
            currentApplications: {
              include: {
                candidate: {
                  include: {
                    profile: true,
                    candidateProfile: { include: { skills: true } },
                  },
                },
              },
              orderBy: { updatedAt: "desc" },
            },
          },
          orderBy: { position: "asc" },
        },
        applications: {
          include: {
            candidate: {
              include: {
                profile: true,
                candidateProfile: { include: { skills: true } },
              },
            },
            currentStage: true,
          },
          orderBy: { updatedAt: "desc" },
        },
      },
      orderBy: { updatedAt: "desc" },
      where,
    });
  }

  async createStage(
    user: AuthenticatedUser,
    jobId: string,
    dto: CreateHiringStageDto,
  ) {
    await this.assertRecruiterJob(user, jobId);
    return this.prisma.hiringStage.create({
      data: {
        jobId,
        name: dto.name,
        type: dto.type,
        position: dto.position,
      },
    });
  }

  async updateApplicationStage(
    user: AuthenticatedUser,
    applicationId: string,
    dto: UpdateApplicationStageDto,
  ) {
    const application = await this.prisma.jobApplication.findUnique({
      include: { job: true },
      where: { id: applicationId },
    });
    if (!application) throw new NotFoundException("Application not found.");
    await this.assertRecruiterJob(user, application.jobId);

    const stage = await this.prisma.hiringStage.findUnique({
      where: { id: dto.stageId },
    });
    if (!stage || stage.jobId !== application.jobId) {
      throw new BadRequestException("Stage does not belong to this job.");
    }

    const status = dto.status ?? this.statusForStage(stage.type);
    const updated = await this.prisma.jobApplication.update({
      data: {
        currentStageId: stage.id,
        status,
        timeline: {
          create: {
            status,
            note: dto.note ?? `Moved to ${stage.name}.`,
          },
        },
        stageHistory: {
          create: {
            stageId: stage.id,
            changedById: user.sub,
            status,
            note: dto.note,
          },
        },
      },
      include: {
        currentStage: true,
        job: true,
        candidate: { include: { profile: true } },
      },
      where: { id: applicationId },
    });

    await this.audit.record({
      actorId: user.sub,
      action: "ats.application.stage.updated",
      entity: "JobApplication",
      entityId: applicationId,
      metadata: { stageId: stage.id, status },
    });
    return updated;
  }

  resumeDatabase(user: AuthenticatedUser) {
    const where: Prisma.CandidateProfileWhereInput =
      user.role === UserRole.ADMIN
        ? {}
        : {
            OR: [
              { assignedRecruiterId: user.sub },
              { recruiterAssignments: { some: { recruiterId: user.sub } } },
            ],
          };
    return this.prisma.candidateProfile.findMany({
      include: {
        user: { include: { profile: true } },
        skills: true,
        certifications: true,
        resumeIndex: true,
      },
      orderBy: { updatedAt: "desc" },
      where,
    });
  }

  async indexResume(
    user: AuthenticatedUser,
    candidateProfileId: string,
    dto: ResumeIndexDto,
  ) {
    const profile = await this.prisma.candidateProfile.findUnique({
      include: {
        user: { include: { profile: true } },
        skills: true,
        certifications: true,
        education: true,
        experience: true,
      },
      where: { id: candidateProfileId },
    });
    if (!profile) throw new NotFoundException("Candidate profile not found.");

    const rawText = dto.rawText ?? this.profileText(profile);
    const keywords = this.unique([
      ...(dto.keywords ?? []),
      ...this.extractKeywords(rawText),
    ]).slice(0, 80);
    const skills = this.unique([
      ...(dto.skills ?? []),
      ...profile.skills.map((skill) => skill.name),
    ]);

    const indexed = await this.prisma.resumeIndex.upsert({
      create: {
        candidateProfileId,
        rawText,
        keywords,
        skills,
        certifications:
          dto.certifications ??
          profile.certifications.map((certification) => certification.name),
        education:
          dto.education ??
          profile.education.map((education) => education.degree),
      },
      update: {
        rawText,
        keywords,
        skills,
        certifications:
          dto.certifications ??
          profile.certifications.map((certification) => certification.name),
        education:
          dto.education ??
          profile.education.map((education) => education.degree),
        indexedAt: new Date(),
      },
      where: { candidateProfileId },
    });

    await this.audit.record({
      actorId: user.sub,
      action: "ats.resume.indexed",
      entity: "CandidateProfile",
      entityId: candidateProfileId,
    });
    return indexed;
  }

  async candidateTimeline(candidateProfileId: string) {
    const profile = await this.prisma.candidateProfile.findUnique({
      include: {
        user: { include: { profile: true } },
        notes: { include: { author: { include: { profile: true } } } },
        ratings: true,
        tags: { include: { tag: true } },
        resumeIndex: true,
        aiArtifacts: { orderBy: { createdAt: "desc" } },
      },
      where: { id: candidateProfileId },
    });
    if (!profile) throw new NotFoundException("Candidate profile not found.");

    const applications = await this.prisma.jobApplication.findMany({
      include: {
        job: { include: { company: true } },
        currentStage: true,
        timeline: true,
        stageHistory: {
          include: { stage: true, changedBy: { include: { profile: true } } },
        },
        interviews: true,
      },
      orderBy: { updatedAt: "desc" },
      where: { candidateId: profile.userId },
    });

    return { profile, applications };
  }

  duplicates(candidateProfileId: string) {
    return this.prisma.candidateDuplicate.findMany({
      include: {
        primaryCandidateProfile: {
          include: { user: { include: { profile: true } } },
        },
        duplicateCandidateProfile: {
          include: { user: { include: { profile: true } } },
        },
      },
      where: {
        OR: [
          { primaryCandidateProfileId: candidateProfileId },
          { duplicateCandidateProfileId: candidateProfileId },
        ],
      },
    });
  }

  private async assertRecruiterJob(user: AuthenticatedUser, jobId: string) {
    const job = await this.prisma.job.findFirst({
      where:
        user.role === UserRole.ADMIN
          ? { id: jobId }
          : {
              id: jobId,
              OR: [
                { assignedRecruiterId: user.sub },
                { recruiterAssignments: { some: { recruiterId: user.sub } } },
              ],
            },
    });
    if (!job) throw new ForbiddenException("Recruiter job access is required.");
    return job;
  }

  private async jobScope(user: AuthenticatedUser, jobId?: string) {
    const base: Prisma.JobWhereInput = jobId ? { id: jobId } : {};
    if (user.role === UserRole.ADMIN) return base;
    return {
      ...base,
      OR: [
        { assignedRecruiterId: user.sub },
        { recruiterAssignments: { some: { recruiterId: user.sub } } },
      ],
    };
  }

  private statusForStage(stageType: HiringStageType) {
    const map: Record<HiringStageType, ApplicationStatus> = {
      APPLIED: ApplicationStatus.SUBMITTED,
      SCREENING: ApplicationStatus.REVIEWING,
      INTERVIEW: ApplicationStatus.INTERVIEW_SCHEDULED,
      OFFER: ApplicationStatus.OFFERED,
      REJECTED: ApplicationStatus.REJECTED,
      HIRED: ApplicationStatus.HIRED,
    };
    return map[stageType];
  }

  private profileText(profile: {
    user: {
      email: string;
      profile: {
        firstName: string;
        lastName: string;
        headline: string | null;
      } | null;
    };
    skills: { name: string }[];
    certifications: { name: string }[];
    education: {
      degree: string;
      institution: string;
      fieldOfStudy: string | null;
    }[];
    experience: {
      title: string;
      company: string;
      description: string | null;
    }[];
  }) {
    return [
      profile.user.email,
      profile.user.profile?.firstName,
      profile.user.profile?.lastName,
      profile.user.profile?.headline,
      ...profile.skills.map((skill) => skill.name),
      ...profile.certifications.map((certification) => certification.name),
      ...profile.education.flatMap((education) => [
        education.degree,
        education.institution,
        education.fieldOfStudy,
      ]),
      ...profile.experience.flatMap((experience) => [
        experience.title,
        experience.company,
        experience.description,
      ]),
    ]
      .filter(Boolean)
      .join(" ");
  }

  private extractKeywords(text: string) {
    return (
      text
        .toLowerCase()
        .match(/[a-z][a-z0-9+#.-]{2,}/g)
        ?.filter((term) => !this.stopWords.has(term)) ?? []
    );
  }

  private unique(values: string[]) {
    return Array.from(
      new Set(values.map((value) => value.trim()).filter(Boolean)),
    );
  }

  private readonly stopWords = new Set([
    "and",
    "for",
    "the",
    "with",
    "from",
    "this",
    "that",
    "your",
    "you",
    "are",
    "was",
    "were",
  ]);
}
