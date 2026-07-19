import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { TalentStore, AiMatchScore } from "./talent-store";

@Injectable()
export class CandidateMatchingService {
  private readonly logger = new Logger(CandidateMatchingService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Main match calculation method
  async calculateMatchScore(jobId: string, candidateProfileId: string): Promise<AiMatchScore> {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
    });
    if (!job) {
      throw new NotFoundException(`Job with ID ${jobId} not found.`);
    }

    const candidate = await this.prisma.candidateProfile.findUnique({
      where: { id: candidateProfileId },
      include: {
        skills: true,
        experience: true,
        education: true,
      },
    });
    if (!candidate) {
      throw new NotFoundException(`Candidate profile with ID ${candidateProfileId} not found.`);
    }

    // 1. Skill Gap Analysis
    // Extract keywords from job requirements/description
    const reqText = [job.requirements, job.description, job.title].filter(Boolean).join(" ").toLowerCase();
    const candidateSkills = candidate.skills.map(s => s.name.toLowerCase());
    
    // Simple heuristic extract potential requested skills
    const commonTechSkills = [
      "react", "vue", "angular", "node", "typescript", "javascript", "python", "go", "golang",
      "ruby", "rails", "php", "laravel", "java", "spring", "c#", "dotnet", "aws", "gcp",
      "azure", "docker", "kubernetes", "postgres", "mysql", "mongodb", "redis", "elasticsearch",
      "graphql", "rest", "ci/cd", "git", "scrum", "agile", "sql", "django", "flask", "terraform",
      "figma", "product management", "jira", "tableau", "spark", "hadoop", "machine learning", "ai",
    ];

    const requestedSkills = commonTechSkills.filter(s => reqText.includes(s));
    const matchedSkills = candidateSkills.filter(s => requestedSkills.some(rs => s.includes(rs) || rs.includes(s)));
    const skillGap = requestedSkills.filter(rs => !candidateSkills.some(s => s.includes(rs) || rs.includes(s)));

    // 2. Experience Matching
    // Map experience level from job
    // ENTRY_LEVEL, MID_LEVEL, SENIOR_LEVEL, LEAD, PRINCIPAL, DIRECTOR, EXECUTIVE, etc.
    let reqYrs = 0;
    if (job.experienceLevel === "ENTRY_LEVEL") reqYrs = 1;
    else if (job.experienceLevel === "MID_LEVEL") reqYrs = 3;
    else if (job.experienceLevel === "SENIOR") reqYrs = 5;
    else reqYrs = 8; // Lead / Director / etc.

    const candYrs = candidate.yearsOfExperience ?? 0;
    const experienceMatch = candYrs >= reqYrs;

    // 3. Location Matching
    // Check remote preference vs job remotePolicy
    const isRemoteFriendly = job.remotePolicy === "FULL_REMOTE" || job.remotePolicy === "HYBRID";
    const wantsRemote = candidate.remotePreference === "REMOTE" || candidate.remotePreference === "HYBRID";
    let locationMatch = false;

    if (isRemoteFriendly && wantsRemote) {
      locationMatch = true;
    } else {
      const candLoc = (candidate.location ?? "").toLowerCase();
      const jobLoc = (job.location ?? "").toLowerCase();
      if (candLoc.includes(jobLoc) || jobLoc.includes(candLoc) || candidate.preferredLocation?.toLowerCase().includes(jobLoc)) {
        locationMatch = true;
      }
    }

    // 4. Salary Compatibility
    let salaryCompatibility = true;
    const jobSalMin = job.salaryMin ?? 0;
    const jobSalMax = job.salaryMax ?? 999999;
    const candSalMin = candidate.salaryExpectationMin ?? 0;
    const candSalMax = candidate.salaryExpectationMax ?? 999999;

    if (candSalMin > jobSalMax || (candSalMax < jobSalMin && candSalMax > 0)) {
      salaryCompatibility = false;
    }

    // 5. Job-to-Candidate Match Score calculation
    let jobToCandidateScore = 50; // baseline
    if (matchedSkills.length > 0) jobToCandidateScore += Math.min(30, (matchedSkills.length / Math.max(1, requestedSkills.length)) * 30);
    if (experienceMatch) jobToCandidateScore += 10;
    if (locationMatch) jobToCandidateScore += 5;
    if (salaryCompatibility) jobToCandidateScore += 5;

    // 6. Candidate-to-Job Match Score calculation
    let candidateToJobScore = 50; // baseline
    if (locationMatch) candidateToJobScore += 15;
    if (salaryCompatibility) candidateToJobScore += 15;
    if (job.employmentType === candidate.preferredJobType) candidateToJobScore += 10;
    if (matchedSkills.length > 0) candidateToJobScore += 10;

    // Limit between 0 and 100
    jobToCandidateScore = Math.min(100, Math.max(0, Math.round(jobToCandidateScore)));
    candidateToJobScore = Math.min(100, Math.max(0, Math.round(candidateToJobScore)));

    // 7. Explainable Match Reasons
    const explainableReasons: string[] = [];
    if (matchedSkills.length > 0) {
      explainableReasons.push(`Candidate possesses key required skills: ${matchedSkills.join(", ")}.`);
    }
    if (experienceMatch) {
      explainableReasons.push(`Experience level matches the required ${reqYrs}+ years (${candYrs} years evidenced).`);
    } else {
      explainableReasons.push(`Gap in years of experience: Role prefers ${reqYrs}+ years, candidate has ${candYrs} years.`);
    }
    if (locationMatch) {
      explainableReasons.push(`Location is highly compatible with the company's ${job.remotePolicy} setup.`);
    } else {
      explainableReasons.push(`Potential location mismatch: candidate prefers ${candidate.remotePreference || "local"}, role is in ${job.location}.`);
    }
    if (salaryCompatibility) {
      explainableReasons.push(`Compensation expectations align with the budgeted salary range.`);
    } else {
      explainableReasons.push(`Salary mismatch: candidate expects ${candSalMin}-${candSalMax} USD, budget is ${jobSalMin}-${jobSalMax} USD.`);
    }

    const matchResult: AiMatchScore = {
      jobId,
      candidateProfileId,
      jobToCandidateScore,
      candidateToJobScore,
      skillGap,
      experienceMatch,
      locationMatch,
      salaryCompatibility,
      explainableReasons,
      updatedAt: new Date().toISOString(),
    };

    // Persist match score in the cache/store
    TalentStore.saveMatchScore(matchResult);

    return matchResult;
  }

  // Batch matching for high-performance pipelines
  async calculateBatchMatching(jobId: string, candidateProfileIds: string[]): Promise<AiMatchScore[]> {
    const results: AiMatchScore[] = [];
    for (const id of candidateProfileIds) {
      try {
        const score = await this.calculateMatchScore(jobId, id);
        results.push(score);
      } catch (err) {
        this.logger.error(`Failed matching calculation for ${id} on job ${jobId}:`, err);
      }
    }
    return results;
  }
}
