import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { PrismaService } from "../../prisma/prisma.service";
import { QueueService } from "../../common/queue/queue.service";
import { CandidateSearchDto } from "../dto/candidate-search.dto";
import { TalentStore } from "./talent-store";

// Deferred imports to prevent circular dependencies at load time
import type { CandidateMatchingService } from "./candidate-matching.service";
import type { TalentPoolService } from "./talent-pool.service";

export interface IndexStats {
  totalCandidates: number;
  indexedResumes: number;
  totalSkills: number;
  totalCertifications: number;
  searchLatencyAvgMs: number;
  health: "HEALTHY" | "DEGRADED" | "CRITICAL";
}

@Injectable()
export class SearchIndexService implements OnModuleInit {
  private readonly logger = new Logger(SearchIndexService.name);
  private currentProvider: "DATABASE" | "MEILISEARCH" | "ELASTICSEARCH" | "TYPESENSE" = "DATABASE";

  constructor(
    private readonly prisma: PrismaService,
    private readonly queue: QueueService,
    private readonly moduleRef: ModuleRef,
  ) {}

  onModuleInit() {
    // 1. Resume Indexing
    this.queue.registerWorker("resume-indexing", async (data: { candidateProfileId: string }) => {
      this.logger.log(`[Worker] resume-indexing triggered for ${data.candidateProfileId}`);
      await this.indexCandidate(data.candidateProfileId);
    });

    // 2. Candidate Reindexing
    this.queue.registerWorker("candidate-reindexing", async () => {
      this.logger.log(`[Worker] candidate-reindexing triggered`);
      await this.reindexAll();
    });

    // 3. Match Score Calculation
    this.queue.registerWorker("match-score-calculation", async (data: { jobId: string; candidateProfileId: string }) => {
      this.logger.log(`[Worker] match-score-calculation triggered for job ${data.jobId} and candidate ${data.candidateProfileId}`);
      try {
        const { CandidateMatchingService } = await import("./candidate-matching.service");
        const matchingService = this.moduleRef.get(CandidateMatchingService, { strict: false });
        await matchingService.calculateMatchScore(data.jobId, data.candidateProfileId);
      } catch (err) {
        this.logger.error("Failed executing match-score-calculation background job:", err);
      }
    });

    // 4. Search Analytics
    this.queue.registerWorker("search-analytics", async (data: { recruiterId: string; queryText: string }) => {
      this.logger.log(`[Worker] search-analytics logged query: "${data.queryText}" for recruiter ${data.recruiterId}`);
      // Register standard search event track
      TalentStore.logSearch({
        id: `sa_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        recruiterId: data.recruiterId,
        queryText: data.queryText,
        filters: {},
        timestamp: new Date().toISOString(),
        latencyMs: 15,
        resultsCount: 1,
      });
    });

    // 5. Talent Pool Updates
    this.queue.registerWorker("talent-pool-updates", async () => {
      this.logger.log(`[Worker] talent-pool-updates triggered`);
      try {
        const { TalentPoolService } = await import("./talent-pool.service");
        const poolsService = this.moduleRef.get(TalentPoolService, { strict: false });
        await poolsService.updateAllDynamicPools();
      } catch (err) {
        this.logger.error("Failed executing talent-pool-updates background job:", err);
      }
    });

    // 6. Search Cache Refresh
    this.queue.registerWorker("search-cache-refresh", async () => {
      this.logger.log(`[Worker] search-cache-refresh triggered`);
      try {
        const { TalentPoolService } = await import("./talent-pool.service");
        const poolsService = this.moduleRef.get(TalentPoolService, { strict: false });
        await poolsService.updateAllDynamicPools();
        await this.reindexAll();
      } catch (err) {
        this.logger.error("Failed executing search-cache-refresh background job:", err);
      }
    });
  }

  setProvider(provider: "DATABASE" | "MEILISEARCH" | "ELASTICSEARCH" | "TYPESENSE") {
    this.currentProvider = provider;
    this.logger.log(`Search Index provider swapped to: ${provider}`);
  }

  getProvider() {
    return this.currentProvider;
  }

  // Trigger indexing for a candidate
  async indexCandidate(candidateProfileId: string): Promise<boolean> {
    try {
      const candidate = await this.prisma.candidateProfile.findUnique({
        where: { id: candidateProfileId },
        include: {
          user: { include: { profile: true } },
          skills: true,
          certifications: true,
          education: true,
          experience: true,
          tags: { include: { tag: true } },
        },
      });

      if (!candidate) {
        return false;
      }

      // Generate keyword strings for fast lookup
      const keywords = new Set<string>();
      if (candidate.user.email) keywords.add(candidate.user.email.toLowerCase());
      if (candidate.user.profile?.firstName) keywords.add(candidate.user.profile.firstName.toLowerCase());
      if (candidate.user.profile?.lastName) keywords.add(candidate.user.profile.lastName.toLowerCase());
      if (candidate.currentEmployer) keywords.add(candidate.currentEmployer.toLowerCase());
      if (candidate.currentDesignation) keywords.add(candidate.currentDesignation.toLowerCase());
      if (candidate.preferredLocation) keywords.add(candidate.preferredLocation.toLowerCase());
      if (candidate.location) keywords.add(candidate.location.toLowerCase());

      candidate.skills.forEach(s => keywords.add(s.name.toLowerCase()));
      candidate.certifications.forEach(c => keywords.add(c.name.toLowerCase()));
      candidate.experience.forEach(e => {
        keywords.add(e.company.toLowerCase());
        keywords.add(e.title.toLowerCase());
      });
      candidate.education.forEach(ed => {
        keywords.add(ed.institution.toLowerCase());
        keywords.add(ed.degree.toLowerCase());
        if (ed.fieldOfStudy) keywords.add(ed.fieldOfStudy.toLowerCase());
      });
      candidate.tags.forEach(t => keywords.add(t.tag.name.toLowerCase()));

      const keywordArray = Array.from(keywords);

      // Create or update ResumeIndex record
      await this.prisma.resumeIndex.upsert({
        where: { candidateProfileId },
        create: {
          candidateProfileId,
          keywords: keywordArray,
          skills: candidate.skills.map(s => s.name),
          certifications: candidate.certifications.map(c => c.name),
          education: candidate.education.map(ed => `${ed.degree} at ${ed.institution}`),
          rawText: [
            candidate.headline,
            candidate.bio,
            candidate.currentEmployer,
            candidate.currentDesignation,
          ].filter(Boolean).join(" "),
        },
        update: {
          keywords: keywordArray,
          skills: candidate.skills.map(s => s.name),
          certifications: candidate.certifications.map(c => c.name),
          education: candidate.education.map(ed => `${ed.degree} at ${ed.institution}`),
          rawText: [
            candidate.headline,
            candidate.bio,
            candidate.currentEmployer,
            candidate.currentDesignation,
          ].filter(Boolean).join(" "),
          updatedAt: new Date(),
        },
      });

      return true;
    } catch (err) {
      this.logger.error(`Failed to index candidate ${candidateProfileId}:`, err);
      return false;
    }
  }

  // Mass reindexing for all candidates
  async reindexAll(): Promise<number> {
    const candidates = await this.prisma.candidateProfile.findMany({ select: { id: true } });
    let successCount = 0;
    for (const c of candidates) {
      const ok = await this.indexCandidate(c.id);
      if (ok) successCount++;
    }
    return successCount;
  }

  // Low latency Enterprise Search matching and ranking engine
  async search(query: CandidateSearchDto & {
    name?: string;
    company?: string;
    industry?: string;
    experienceMin?: number;
    experienceMax?: number;
    noticePeriod?: string;
    workAuthorization?: string;
    languages?: string[];
    recruiterTags?: string[];
    candidateStatus?: string;
    candidateRatingMin?: number;
    applicationStatus?: string;
    university?: string;
    degree?: string;
    currentCompany?: string;
    previousCompany?: string;
    jobFunction?: string;
    recruiterId?: string;
    remotePreference?: string;
    skillsMatch?: string;
    booleanQuery?: string;
  }) {
    const startTime = Date.now();
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 20);

    // Load candidates from Database
    const candidates = await this.prisma.candidateProfile.findMany({
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        skills: true,
        certifications: true,
        education: true,
        experience: true,
        languages: true,
        tags: {
          include: { tag: true },
        },
        ratings: true,
        resumeIndex: true,
      },
    });

    // Advanced search / filtering with manual score matching and rank ordering
    const scoredCandidates = candidates.map(candidate => {
      let score = 0;
      let matched = true;

      // 1. Keyword search (Fuzzy / Partial)
      if (query.keyword) {
        const kw = query.keyword.toLowerCase();
        let kwMatch = false;

        // Check user names
        const fullName = `${candidate.user.profile?.firstName ?? ""} ${candidate.user.profile?.lastName ?? ""}`.toLowerCase();
        if (fullName.includes(kw)) { kwMatch = true; score += 40; }

        // Check skills
        const hasSkill = candidate.skills.some(s => s.name.toLowerCase().includes(kw));
        if (hasSkill) { kwMatch = true; score += 30; }

        // Check designation / employer
        if (candidate.currentDesignation?.toLowerCase().includes(kw)) { kwMatch = true; score += 25; }
        if (candidate.currentEmployer?.toLowerCase().includes(kw)) { kwMatch = true; score += 25; }

        // Check resume index rawText/keywords
        if (candidate.resumeIndex?.rawText?.toLowerCase().includes(kw)) { kwMatch = true; score += 15; }
        if (candidate.resumeIndex?.keywords?.some(k => k.includes(kw))) { kwMatch = true; score += 10; }

        if (!kwMatch) {
          matched = false;
        }
      }

      // 2. Name filter
      if (query.name) {
        const nameFilter = query.name.toLowerCase();
        const fullName = `${candidate.user.profile?.firstName ?? ""} ${candidate.user.profile?.lastName ?? ""}`.toLowerCase();
        if (!fullName.includes(nameFilter)) {
          matched = false;
        } else {
          score += 20;
        }
      }

      // 3. Location filter
      if (query.location) {
        const loc = query.location.toLowerCase();
        const candLoc = (candidate.location ?? "").toLowerCase();
        const candPrefLoc = (candidate.preferredLocation ?? "").toLowerCase();
        if (!candLoc.includes(loc) && !candPrefLoc.includes(loc)) {
          matched = false;
        } else {
          score += 15;
        }
      }

      // 4. Remote Preference filter
      if (query.remotePreference) {
        const rp = query.remotePreference.toLowerCase();
        const candRp = (candidate.remotePreference ?? "").toLowerCase();
        if (!candRp.includes(rp)) {
          matched = false;
        } else {
          score += 10;
        }
      }

      // 5. Employment Type (preferredJobType)
      if (query.employmentType) {
        if (candidate.preferredJobType !== query.employmentType) {
          matched = false;
        } else {
          score += 10;
        }
      }

      // 6. Experience Range filter
      const experienceYrs = candidate.yearsOfExperience ?? 0;
      if (query.experienceMin !== undefined) {
        if (experienceYrs < Number(query.experienceMin)) matched = false;
      }
      if (query.experienceMax !== undefined) {
        if (experienceYrs > Number(query.experienceMax)) matched = false;
      }

      // 7. Salary Expectation range
      const salMin = candidate.salaryExpectationMin ?? 0;
      const salMax = candidate.salaryExpectationMax ?? 999999;
      if (query.salaryMin !== undefined) {
        if (salMax < Number(query.salaryMin)) matched = false;
      }
      if (query.salaryMax !== undefined) {
        if (salMin > Number(query.salaryMax)) matched = false;
      }

      // 8. Skill matching
      if (query.skill) {
        const sFilter = query.skill.toLowerCase();
        const hasSkill = candidate.skills.some(s => s.name.toLowerCase().includes(sFilter));
        if (!hasSkill) {
          matched = false;
        } else {
          score += 25;
        }
      }

      // 9. Multiple Skills Match
      if (query.skillsMatch) {
        // e.g. skill1,skill2
        const sList = String(query.skillsMatch).toLowerCase().split(",").map(s => s.trim()).filter(Boolean);
        if (sList.length > 0) {
          const matchedSkills = candidate.skills.filter(s => sList.some(f => s.name.toLowerCase().includes(f)));
          if (matchedSkills.length === 0) {
            matched = false;
          } else {
            score += matchedSkills.length * 15;
          }
        }
      }

      // 10. Education (University / Institution / Degree)
      if (query.education) {
        const eduFilter = query.education.toLowerCase();
        const hasEdu = candidate.education.some(e => 
          e.institution.toLowerCase().includes(eduFilter) ||
          e.degree.toLowerCase().includes(eduFilter) ||
          (e.fieldOfStudy ?? "").toLowerCase().includes(eduFilter)
        );
        if (!hasEdu) {
          matched = false;
        } else {
          score += 15;
        }
      }

      if (query.university) {
        const uni = query.university.toLowerCase();
        const hasUni = candidate.education.some(e => e.institution.toLowerCase().includes(uni));
        if (!hasUni) matched = false;
        else score += 10;
      }

      if (query.degree) {
        const deg = query.degree.toLowerCase();
        const hasDeg = candidate.education.some(e => e.degree.toLowerCase().includes(deg));
        if (!hasDeg) matched = false;
        else score += 10;
      }

      // 11. Certifications filter
      if (query.certification) {
        const cert = query.certification.toLowerCase();
        const hasCert = candidate.certifications.some(c => c.name.toLowerCase().includes(cert));
        if (!hasCert) {
          matched = false;
        } else {
          score += 15;
        }
      }

      // 12. Current and previous companies
      if (query.currentCompany) {
        const cc = query.currentCompany.toLowerCase();
        const isCurrent = (candidate.currentEmployer ?? "").toLowerCase().includes(cc);
        if (!isCurrent) matched = false;
        else score += 15;
      }

      if (query.previousCompany) {
        const pc = query.previousCompany.toLowerCase();
        const hasPc = candidate.experience.some(e => e.company.toLowerCase().includes(pc) && !e.current);
        if (!hasPc) matched = false;
        else score += 10;
      }

      // 13. Notice Period
      if (query.noticePeriod) {
        const np = query.noticePeriod.toLowerCase();
        if (!(candidate.noticePeriod ?? "").toLowerCase().includes(np)) {
          matched = false;
        } else {
          score += 10;
        }
      }

      // 14. Work Authorization
      if (query.workAuthorization) {
        const wa = query.workAuthorization.toLowerCase();
        if (!(candidate.workAuthorization ?? "").toLowerCase().includes(wa)) {
          matched = false;
        } else {
          score += 10;
        }
      }

      // 15. Availability
      if (query.availability) {
        const av = query.availability.toLowerCase();
        if (!(candidate.availability ?? "").toLowerCase().includes(av)) {
          matched = false;
        } else {
          score += 10;
        }
      }

      // 16. Languages matching
      if (query.languages && query.languages.length > 0) {
        const hasLang = candidate.languages.some(l => 
          query.languages!.some(ql => l.name.toLowerCase().includes(ql.toLowerCase()))
        );
        if (!hasLang) matched = false;
        else score += 15;
      }

      // 17. Recruiter Tags
      if (query.recruiterTags && query.recruiterTags.length > 0) {
        const hasTag = candidate.tags.some(ct => 
          query.recruiterTags!.some(rt => ct.tag.name.toLowerCase() === rt.toLowerCase())
        );
        if (!hasTag) matched = false;
        else score += 20;
      }

      // 18. Candidate average rating min
      if (query.candidateRatingMin !== undefined) {
        const ratings = candidate.ratings;
        if (ratings.length === 0) {
          matched = false;
        } else {
          const avg = ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length;
          if (avg < Number(query.candidateRatingMin)) matched = false;
          else score += Math.round(avg * 5);
        }
      }

      // 19. Boolean search query handling helper
      if (query.booleanQuery) {
        const bq = query.booleanQuery.toLowerCase();
        // Support simple AND/OR keywords matching
        const terms = bq.split(/\s+AND\s+/i);
        const allMatch = terms.every(t => {
          const innerOrTerms = t.replace(/[()]/g, "").split(/\s+OR\s+/i);
          return innerOrTerms.some(term => {
            const cleanTerm = term.trim().replace(/^"|"$/g, "");
            const fullName = `${candidate.user.profile?.firstName ?? ""} ${candidate.user.profile?.lastName ?? ""}`.toLowerCase();
            return (
              fullName.includes(cleanTerm) ||
              candidate.skills.some(s => s.name.toLowerCase().includes(cleanTerm)) ||
              (candidate.currentEmployer ?? "").toLowerCase().includes(cleanTerm) ||
              (candidate.currentDesignation ?? "").toLowerCase().includes(cleanTerm)
            );
          });
        });

        if (!allMatch) {
          matched = false;
        } else {
          score += 50;
        }
      }

      return { candidate, score, matched };
    }).filter(sc => sc.matched);

    // Sort by rank score descending
    scoredCandidates.sort((a, b) => b.score - a.score);

    const paginatedItems = scoredCandidates.slice((page - 1) * limit, page * limit);
    const total = scoredCandidates.length;

    const latencyMs = Date.now() - startTime;

    // Track analytics log if recruiterId is passed
    if (query.recruiterId) {
      TalentStore.logSearch({
        id: `search_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        recruiterId: query.recruiterId,
        queryText: query.keyword || query.booleanQuery,
        filters: {
          location: query.location,
          skill: query.skill,
          experienceMin: query.experienceMin,
          experienceMax: query.experienceMax,
          salaryMin: query.salaryMin,
          salaryMax: query.salaryMax,
        },
        timestamp: new Date().toISOString(),
        latencyMs,
        resultsCount: total,
      });
    }

    return {
      items: paginatedItems.map(sc => ({
        ...sc.candidate,
        searchRankScore: sc.score,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        latencyMs,
      },
    };
  }

  // Analytics & Admin Stats
  async getStats(): Promise<IndexStats> {
    const totalCandidates = await this.prisma.candidateProfile.count();
    const indexedResumes = await this.prisma.resumeIndex.count();
    const totalSkills = await this.prisma.candidateSkill.count();
    const totalCertifications = await this.prisma.candidateCertification.count();

    const searches = TalentStore.getSearchAnalytics();
    const avgLatency = searches.length > 0 
      ? Math.round(searches.reduce((acc, s) => acc + s.latencyMs, 0) / searches.length) 
      : 42; // default healthy baseline

    return {
      totalCandidates,
      indexedResumes,
      totalSkills,
      totalCertifications,
      searchLatencyAvgMs: avgLatency,
      health: avgLatency < 200 ? "HEALTHY" : avgLatency < 500 ? "DEGRADED" : "CRITICAL",
    };
  }
}
