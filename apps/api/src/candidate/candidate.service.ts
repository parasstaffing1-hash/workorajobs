import { Injectable, NotFoundException } from "@nestjs/common";
import { NotificationType } from "@prisma/client";

import { AuthenticatedUser } from "../auth/types/authenticated-user.type";
import { NotificationsService } from "../notifications/notifications.service";
import { PrismaService } from "../prisma/prisma.service";
import { StorageService } from "../storage/storage.service";
import { CandidateProfileDto } from "./dto/candidate-profile.dto";
import {
  CertificationDto,
  EducationDto,
  ExperienceDto,
  LanguageDto,
  SkillDto,
} from "./dto/candidate-section.dto";

type CompletionDraft = Partial<CandidateProfileDto> & {
  resumeUrl?: string;
};

import { Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { NotificationType, EmploymentType } from "@prisma/client";
import { GoogleGenAI, Type } from "@google/genai";
import * as fs from "node:fs";
import * as path from "node:path";

import { AuthenticatedUser } from "../auth/types/authenticated-user.type";
import { NotificationsService } from "../notifications/notifications.service";
import { PrismaService } from "../prisma/prisma.service";
import { StorageService } from "../storage/storage.service";
import { AuditService } from "../audit/audit.service";
import { QueueService } from "../common/queue/queue.service";
import { CandidateProfileDto } from "./dto/candidate-profile.dto";
import {
  CertificationDto,
  EducationDto,
  ExperienceDto,
  LanguageDto,
  SkillDto,
} from "./dto/candidate-section.dto";

type CompletionDraft = Partial<CandidateProfileDto> & {
  resumeUrl?: string;
};

async function extractTextFromBuffer(buffer: Buffer, fileName: string): Promise<string> {
  const extension = fileName.toLowerCase().split('.').pop();
  if (extension === 'pdf') {
    try {
      const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs') as any;
      const document = await pdfjs.getDocument({
        data: new Uint8Array(buffer),
        disableWorker: true,
        isEvalSupported: false,
      }).promise;
      const pageText: string[] = [];
      for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
        const page = await document.getPage(pageNumber);
        const content = await page.getTextContent();
        pageText.push(
          content.items
            .map((item: any) => item.str ?? "")
            .filter(Boolean)
            .join(" ")
        );
      }
      return pageText.join("\n").trim();
    } catch (err) {
      console.error('PDF text extraction failed, returning simple string representation', err);
      return buffer.toString('utf-8');
    }
  } else if (extension === 'docx') {
    try {
      const mammoth = await import('mammoth') as any;
      const result = await mammoth.extractRawText({ buffer });
      return result.value.trim();
    } catch (err) {
      console.error('DOCX text extraction failed, returning simple string representation', err);
      return buffer.toString('utf-8');
    }
  } else {
    return buffer.toString('utf-8');
  }
}

function parseEmploymentType(val?: string): EmploymentType | undefined {
  if (!val) return undefined;
  const cleaned = val.toUpperCase().replace('-', '_').replace(' ', '_');
  if (cleaned === 'FULL_TIME') return EmploymentType.FULL_TIME;
  if (cleaned === 'PART_TIME') return EmploymentType.PART_TIME;
  if (cleaned === 'CONTRACT') return EmploymentType.CONTRACT;
  if (cleaned === 'TEMPORARY') return EmploymentType.TEMPORARY;
  if (cleaned === 'INTERNSHIP') return EmploymentType.INTERNSHIP;
  return undefined;
}

function parseDate(dateStr?: string): Date | undefined {
  if (!dateStr) return undefined;
  const timestamp = Date.parse(dateStr);
  return isNaN(timestamp) ? undefined : new Date(timestamp);
}

@Injectable()
export class CandidateService implements OnModuleInit {
  private readonly ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly notifications: NotificationsService,
    private readonly audit: AuditService,
    private readonly queue: QueueService,
  ) {}

  onModuleInit() {
    this.queue.registerWorker("candidate-resume-parse", async (data: { userId: string; resumeId: string }) => {
      try {
        const user = { sub: data.userId } as AuthenticatedUser;
        await this.parseResumeWithGemini(user, data.resumeId);
      } catch (err) {
        console.error("Background resume parsing failed:", err);
      }
    });
  }

  async dashboard(user: AuthenticatedUser) {
    const profile = await this.ensureProfile(user.sub);
    const [savedJobs, applications, notifications] = await Promise.all([
      this.prisma.savedJob.count({ where: { candidateProfileId: profile.id } }),
      this.prisma.jobApplication.count({ where: { candidateId: user.sub } }),
      this.prisma.notification.count({
        where: { userId: user.sub, readAt: null },
      }),
    ]);
    return {
      profile,
      metrics: {
        completionScore: profile.completionScore,
        savedJobs,
        applications,
        unreadNotifications: notifications,
      },
    };
  }

  async getProfile(userId: string) {
    return this.ensureProfile(userId);
  }

  async updateProfile(user: AuthenticatedUser, dto: CandidateProfileDto) {
    const profile = await this.ensureProfile(user.sub);
    const updated = await this.prisma.candidateProfile.update({
      data: {
        ...dto,
        completionScore: await this.computeCompletionScore(profile.id, dto),
      },
      include: this.profileIncludes(),
      where: { id: profile.id },
    });
    await this.notifications.create({
      userId: user.sub,
      type: NotificationType.PROFILE_UPDATED,
      title: "Profile updated",
      body: "Your candidate profile was updated.",
    });
    await this.audit.record({
      actorId: user.sub,
      action: "update_profile",
      entity: "CandidateProfile",
      entityId: profile.id,
      metadata: { fields: Object.keys(dto) },
    });
    return updated;
  }

  async uploadResume(user: AuthenticatedUser, file: Express.Multer.File) {
    const profile = await this.ensureProfile(user.sub);
    const upload = await this.storage.upload(file, "resume", user.sub);
    
    // Save locally to support parsing
    const localPath = path.join("/tmp/resumes", upload.key);
    fs.mkdirSync(path.dirname(localPath), { recursive: true });
    fs.writeFileSync(localPath, file.buffer);

    const updated = await this.prisma.candidateProfile.update({
      data: {
        resumeUrl: upload.url,
        resumeKey: upload.key,
        resumeOriginalName: upload.originalName,
        completionScore: await this.computeCompletionScore(profile.id, {
          resumeUrl: upload.url,
        }),
      },
      where: { id: profile.id },
    });

    // Also register in resume versions
    const version = await this.prisma.resumeVersion.create({
      data: {
        candidateProfileId: profile.id,
        name: upload.originalName,
        resumeUrl: upload.url,
        resumeKey: upload.key,
        resumeOriginalName: upload.originalName,
        isPrimary: true,
      }
    });

    await this.audit.record({
      actorId: user.sub,
      action: "upload_resume",
      entity: "CandidateProfile",
      entityId: profile.id,
      metadata: { key: upload.key, originalName: upload.originalName, versionId: version.id },
    });

    // Enqueue background processing
    await this.queue.add("candidate-resume-parse", { userId: user.sub, resumeId: version.id });

    return updated;
  }

  async uploadResumeVersion(user: AuthenticatedUser, file: Express.Multer.File, name?: string) {
    const profile = await this.ensureProfile(user.sub);
    const upload = await this.storage.upload(file, "resume", user.sub);
    
    // Save locally to support parsing
    const localPath = path.join("/tmp/resumes", upload.key);
    fs.mkdirSync(path.dirname(localPath), { recursive: true });
    fs.writeFileSync(localPath, file.buffer);

    // Check if this is the first resume
    const count = await this.prisma.resumeVersion.count({ where: { candidateProfileId: profile.id } });
    const isPrimary = count === 0;

    const version = await this.prisma.resumeVersion.create({
      data: {
        candidateProfileId: profile.id,
        name: name || upload.originalName,
        resumeUrl: upload.url,
        resumeKey: upload.key,
        resumeOriginalName: upload.originalName,
        isPrimary,
      }
    });

    if (isPrimary) {
      await this.prisma.candidateProfile.update({
        data: {
          resumeUrl: upload.url,
          resumeKey: upload.key,
          resumeOriginalName: upload.originalName,
          completionScore: await this.computeCompletionScore(profile.id, {
            resumeUrl: upload.url,
          }),
        },
        where: { id: profile.id },
      });
    }

    await this.audit.record({
      actorId: user.sub,
      action: "upload_resume_version",
      entity: "ResumeVersion",
      entityId: version.id,
      metadata: { key: upload.key, isPrimary },
    });

    // Enqueue background processing
    await this.queue.add("candidate-resume-parse", { userId: user.sub, resumeId: version.id });

    return version;
  }

  async getResumeVersions(userId: string) {
    const profile = await this.ensureProfile(userId);
    return this.prisma.resumeVersion.findMany({
      where: { candidateProfileId: profile.id },
      orderBy: { createdAt: "desc" },
    });
  }

  async deleteResumeVersion(user: AuthenticatedUser, id: string) {
    const profile = await this.ensureProfile(user.sub);
    const version = await this.prisma.resumeVersion.findFirst({
      where: { id, candidateProfileId: profile.id },
    });
    if (!version) throw new NotFoundException("Resume version not found.");

    await this.prisma.resumeVersion.delete({ where: { id } });

    await this.audit.record({
      actorId: user.sub,
      action: "delete_resume_version",
      entity: "ResumeVersion",
      entityId: id,
    });

    // If it was primary, reset candidate profile fields to another primary or null
    if (version.isPrimary) {
      const nextPrimary = await this.prisma.resumeVersion.findFirst({
        where: { candidateProfileId: profile.id },
        orderBy: { createdAt: "desc" },
      });
      if (nextPrimary) {
        await this.prisma.resumeVersion.update({
          data: { isPrimary: true },
          where: { id: nextPrimary.id },
        });
        await this.prisma.candidateProfile.update({
          data: {
            resumeUrl: nextPrimary.resumeUrl,
            resumeKey: nextPrimary.resumeKey,
            resumeOriginalName: nextPrimary.resumeOriginalName,
          },
          where: { id: profile.id },
        });
      } else {
        await this.prisma.candidateProfile.update({
          data: {
            resumeUrl: null,
            resumeKey: null,
            resumeOriginalName: null,
          },
          where: { id: profile.id },
        });
      }
    }

    return { success: true };
  }

  async setPrimaryResume(user: AuthenticatedUser, id: string) {
    const profile = await this.ensureProfile(user.sub);
    const version = await this.prisma.resumeVersion.findFirst({
      where: { id, candidateProfileId: profile.id },
    });
    if (!version) throw new NotFoundException("Resume version not found.");

    await this.prisma.resumeVersion.updateMany({
      data: { isPrimary: false },
      where: { candidateProfileId: profile.id },
    });

    const updated = await this.prisma.resumeVersion.update({
      data: { isPrimary: true },
      where: { id },
    });

    await this.prisma.candidateProfile.update({
      data: {
        resumeUrl: version.resumeUrl,
        resumeKey: version.resumeKey,
        resumeOriginalName: version.resumeOriginalName,
        completionScore: await this.computeCompletionScore(profile.id, {
          resumeUrl: version.resumeUrl,
        }),
      },
      where: { id: profile.id },
    });

    await this.audit.record({
      actorId: user.sub,
      action: "set_primary_resume",
      entity: "ResumeVersion",
      entityId: id,
    });

    return updated;
  }

  async parseResumeWithGemini(user: AuthenticatedUser, resumeId: string) {
    const profile = await this.ensureProfile(user.sub);
    const version = await this.prisma.resumeVersion.findFirst({
      where: { id: resumeId, candidateProfileId: profile.id },
    });
    if (!version) throw new NotFoundException("Resume version not found.");

    const localPath = path.join("/tmp/resumes", version.resumeKey);
    if (!fs.existsSync(localPath)) {
      throw new NotFoundException("Local resume file not found to parse.");
    }

    const buffer = fs.readFileSync(localPath);
    const extractedText = await extractTextFromBuffer(buffer, version.resumeOriginalName);

    // Call Gemini 3.5-flash to parse the text
    const systemPrompt = `You are a professional resume parser. Extract structured details from the following resume text.
Always return your response in clean JSON conforming exactly to the following typescript interface schema:
{
  "headline"?: string;
  "bio"?: string;
  "location"?: string;
  "preferredLocation"?: string;
  "preferredJobType"?: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "TEMPORARY" | "INTERNSHIP";
  "yearsOfExperience"?: number;
  "skills": string[];
  "languages": { "name": string; "proficiency": string }[];
  "certifications": { "name": string; "issuer"?: string; "issuedAt"?: string; "expiresAt"?: string }[];
  "education": { "institution": string; "degree": string; "fieldOfStudy"?: string; "startDate"?: string; "endDate"?: string }[];
  "experience": { "company": string; "title": string; "location"?: string; "startDate"?: string; "endDate"?: string; "current": boolean; "description"?: string }[];
}
Ensure all JSON is valid, keys are lowercase as shown, and the response is clean JSON.`;

    const response = await this.ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: extractedText,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");

    // Clear existing experiences, educations, skills to prevent clutter (optional but professional on full re-parse)
    await Promise.all([
      this.prisma.candidateExperience.deleteMany({ where: { candidateProfileId: profile.id } }),
      this.prisma.candidateEducation.deleteMany({ where: { candidateProfileId: profile.id } }),
      this.prisma.candidateSkill.deleteMany({ where: { candidateProfileId: profile.id } }),
      this.prisma.candidateCertification.deleteMany({ where: { candidateProfileId: profile.id } }),
      this.prisma.candidateLanguage.deleteMany({ where: { candidateProfileId: profile.id } }),
    ]);

    // Update Profile core fields
    await this.prisma.candidateProfile.update({
      data: {
        headline: parsed.headline || profile.headline,
        bio: parsed.bio || profile.bio,
        location: parsed.location || profile.location,
        preferredLocation: parsed.preferredLocation || profile.preferredLocation,
        preferredJobType: parseEmploymentType(parsed.preferredJobType) || profile.preferredJobType,
        yearsOfExperience: parsed.yearsOfExperience || profile.yearsOfExperience,
      },
      where: { id: profile.id },
    });

    // Populate Experiences
    if (parsed.experience && Array.isArray(parsed.experience)) {
      for (const exp of parsed.experience) {
        await this.prisma.candidateExperience.create({
          data: {
            candidateProfileId: profile.id,
            company: exp.company,
            title: exp.title,
            location: exp.location,
            startDate: parseDate(exp.startDate),
            endDate: parseDate(exp.endDate),
            current: exp.current || false,
            description: exp.description,
          },
        });
      }
    }

    // Populate Education
    if (parsed.education && Array.isArray(parsed.education)) {
      for (const edu of parsed.education) {
        await this.prisma.candidateEducation.create({
          data: {
            candidateProfileId: profile.id,
            institution: edu.institution,
            degree: edu.degree,
            fieldOfStudy: edu.fieldOfStudy,
            startDate: parseDate(edu.startDate),
            endDate: parseDate(edu.endDate),
          },
        });
      }
    }

    // Populate Skills
    if (parsed.skills && Array.isArray(parsed.skills)) {
      for (const skill of parsed.skills) {
        await this.prisma.candidateSkill.create({
          data: {
            candidateProfileId: profile.id,
            name: skill,
            level: "ADVANCED",
          },
        });
      }
    }

    // Populate Certifications
    if (parsed.certifications && Array.isArray(parsed.certifications)) {
      for (const cert of parsed.certifications) {
        await this.prisma.candidateCertification.create({
          data: {
            candidateProfileId: profile.id,
            name: cert.name,
            issuer: cert.issuer,
            issuedAt: parseDate(cert.issuedAt),
            expiresAt: parseDate(cert.expiresAt),
          },
        });
      }
    }

    // Populate Languages
    if (parsed.languages && Array.isArray(parsed.languages)) {
      for (const lang of parsed.languages) {
        await this.prisma.candidateLanguage.create({
          data: {
            candidateProfileId: profile.id,
            name: lang.name,
            proficiency: lang.proficiency || "PROFICIENT",
          },
        });
      }
    }

    // Update Resume Index for search
    await this.prisma.resumeIndex.upsert({
      where: { candidateProfileId: profile.id },
      create: {
        candidateProfileId: profile.id,
        rawText: extractedText,
        keywords: parsed.skills ?? [],
        skills: parsed.skills ?? [],
        certifications: (parsed.certifications ?? []).map((c: any) => c.name),
        education: (parsed.education ?? []).map((e: any) => `${e.institution} - ${e.degree}`),
      },
      update: {
        rawText: extractedText,
        keywords: parsed.skills ?? [],
        skills: parsed.skills ?? [],
        certifications: (parsed.certifications ?? []).map((c: any) => c.name),
        education: (parsed.education ?? []).map((e: any) => `${e.institution} - ${e.degree}`),
        indexedAt: new Date(),
      }
    });

    const updatedProfile = await this.prisma.candidateProfile.findUnique({
      include: this.profileIncludes(),
      where: { id: profile.id },
    });

    // Update Completion Score
    if (updatedProfile) {
      await this.prisma.candidateProfile.update({
        data: {
          completionScore: await this.computeCompletionScore(profile.id),
        },
        where: { id: profile.id },
      });
    }

    await this.audit.record({
      actorId: user.sub,
      action: "parse_resume_success",
      entity: "ResumeVersion",
      entityId: resumeId,
    });

    return this.prisma.candidateProfile.findUnique({
      include: this.profileIncludes(),
      where: { id: profile.id },
    });
  }

  async optimizeBullet(user: AuthenticatedUser, bulletText: string, jobTitle?: string) {
    const prompt = `Optimize the following resume work experience bullet point to be result-oriented, professional, and impactful.
Always start with a strong action verb, highlight achievements, quantify results where possible, and match the target industry style.
${jobTitle ? `Targeting role/title: ${jobTitle}` : ""}
Original bullet point: "${bulletText}"
Optimized bullet point:`;

    const response = await this.ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const optimizedText = response.text?.trim().replace(/^["']|["']$/g, "") || bulletText;

    await this.audit.record({
      actorId: user.sub,
      action: "optimize_bullet",
      entity: "CandidateProfile",
      metadata: { original: bulletText, optimized: optimizedText },
    });

    return { optimizedText };
  }

  async tailorResume(user: AuthenticatedUser, resumeText: string, jobDescription: string) {
    const prompt = `You are an expert HR tailoring assistant. Analyze the resume text and the job description.
Provide specific tailoring suggestions, rewrite parts of the resume to align perfectly with key phrases from the job description, and list 3-5 concrete recommendations or skill gaps to address.
Return your response in clean JSON conforming exactly to this format:
{
  "tailoredText": "The tailored version of the resume or profile summary...",
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"]
}
Resume text: "${resumeText}"
Job Description: "${jobDescription}"`;

    const response = await this.ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");

    await this.audit.record({
      actorId: user.sub,
      action: "tailor_resume",
      entity: "CandidateProfile",
      metadata: { gapsCount: parsed.recommendations?.length ?? 0 },
    });

    return {
      tailoredText: parsed.tailoredText || resumeText,
      recommendations: parsed.recommendations || [],
    };
  }

  async getPublicProfile(profileId: string) {
    return this.prisma.candidateProfile.findUnique({
      include: {
        education: true,
        experience: true,
        skills: true,
        certifications: true,
        languages: true,
      },
      where: { id: profileId },
    });
  }

  async resume(userId: string) {
    const profile = await this.ensureProfile(userId);
    return {
      resumeUrl: profile.resumeUrl,
      resumeKey: profile.resumeKey,
      resumeOriginalName: profile.resumeOriginalName,
    };
  }

  async addEducation(user: AuthenticatedUser, dto: EducationDto) {
    const profile = await this.ensureProfile(user.sub);
    return this.prisma.candidateEducation.create({
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        candidateProfileId: profile.id,
      },
    });
  }

  async addExperience(user: AuthenticatedUser, dto: ExperienceDto) {
    const profile = await this.ensureProfile(user.sub);
    return this.prisma.candidateExperience.create({
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        candidateProfileId: profile.id,
      },
    });
  }

  async addSkill(user: AuthenticatedUser, dto: SkillDto) {
    const profile = await this.ensureProfile(user.sub);
    return this.prisma.candidateSkill.upsert({
      create: { ...dto, candidateProfileId: profile.id },
      update: { level: dto.level },
      where: {
        candidateProfileId_name: {
          candidateProfileId: profile.id,
          name: dto.name,
        },
      },
    });
  }

  async addCertification(user: AuthenticatedUser, dto: CertificationDto) {
    const profile = await this.ensureProfile(user.sub);
    return this.prisma.candidateCertification.create({
      data: {
        ...dto,
        issuedAt: dto.issuedAt ? new Date(dto.issuedAt) : undefined,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
        candidateProfileId: profile.id,
      },
    });
  }

  async addLanguage(user: AuthenticatedUser, dto: LanguageDto) {
    const profile = await this.ensureProfile(user.sub);
    return this.prisma.candidateLanguage.upsert({
      create: { ...dto, candidateProfileId: profile.id },
      update: { proficiency: dto.proficiency },
      where: {
        candidateProfileId_name: {
          candidateProfileId: profile.id,
          name: dto.name,
        },
      },
    });
  }

  async saveJob(user: AuthenticatedUser, jobId: string) {
    const profile = await this.ensureProfile(user.sub);
    await this.prisma.jobAnalytics.upsert({
      create: { jobId, saves: 1 },
      update: { saves: { increment: 1 } },
      where: { jobId },
    });
    return this.prisma.savedJob.upsert({
      create: { candidateProfileId: profile.id, jobId },
      update: {},
      where: {
        candidateProfileId_jobId: {
          candidateProfileId: profile.id,
          jobId,
        },
      },
    });
  }

  async unsaveJob(user: AuthenticatedUser, jobId: string) {
    const profile = await this.ensureProfile(user.sub);
    await this.prisma.savedJob.deleteMany({
      where: { candidateProfileId: profile.id, jobId },
    });
    return { success: true };
  }

  async savedJobs(user: AuthenticatedUser) {
    const profile = await this.ensureProfile(user.sub);
    return this.prisma.savedJob.findMany({
      include: { job: { include: { company: true } } },
      orderBy: { createdAt: "desc" },
      where: { candidateProfileId: profile.id },
    });
  }

  appliedJobs(user: AuthenticatedUser) {
    return this.prisma.jobApplication.findMany({
      include: {
        job: { include: { company: true } },
        timeline: true,
        interviews: true,
      },
      orderBy: { createdAt: "desc" },
      where: { candidateId: user.sub },
    });
  }

  async timeline(user: AuthenticatedUser, applicationId: string) {
    const application = await this.prisma.jobApplication.findFirst({
      include: { timeline: { orderBy: { createdAt: "asc" } } },
      where: { id: applicationId, candidateId: user.sub },
    });
    if (!application) throw new NotFoundException("Application not found.");
    return application.timeline;
  }

  async ensureProfile(userId: string) {
    const existing = await this.prisma.candidateProfile.findUnique({
      include: this.profileIncludes(),
      where: { userId },
    });
    if (existing) return existing;
    return this.prisma.candidateProfile.create({
      data: { userId },
      include: this.profileIncludes(),
    });
  }

  private async computeCompletionScore(
    profileId: string,
    draft: CompletionDraft = {},
  ) {
    const profile = await this.prisma.candidateProfile.findUnique({
      include: this.profileIncludes(),
      where: { id: profileId },
    });
    if (!profile) return 0;
    const checks = [
      draft.resumeUrl ?? profile.resumeUrl,
      draft.linkedinUrl ?? profile.linkedinUrl,
      draft.portfolioUrl ?? profile.portfolioUrl,
      draft.preferredLocation ?? profile.preferredLocation,
      draft.preferredJobType ?? profile.preferredJobType,
      draft.availability ?? profile.availability,
      profile.education.length > 0,
      profile.experience.length > 0,
      profile.skills.length > 0,
      profile.languages.length > 0,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }

  private profileIncludes() {
    return {
      education: true,
      experience: true,
      skills: true,
      certifications: true,
      languages: true,
    } as const;
  }
}
