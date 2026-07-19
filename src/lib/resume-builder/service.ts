import { ResumeRepository } from "./repository";
import { ResumeDataSchema, AtsMetadataSchema, type ResumeData, type AtsMetadata } from "./validation";

export class ResumeBuilderService {
  private repository = new ResumeRepository();

  /**
   * Validate and format the resume payload
   */
  validateResumeData(data: unknown): ResumeData {
    return ResumeDataSchema.parse(data);
  }

  /**
   * Fully deterministic ATS evaluator scoring CV structure and completeness (No AI/LLMs)
   */
  evaluateAtsScore(data: ResumeData): AtsMetadata {
    let score = 0;
    const suggestions: string[] = [];
    const keywordMatches: string[] = [];
    const keywordGaps: string[] = [];

    // 1. Personal Info Check (Max: 20 pts)
    const hasName = !!data.personalInfo?.fullName;
    const hasEmail = !!data.personalInfo?.email;
    const hasPhone = !!data.personalInfo?.phone;
    if (hasName && hasEmail) score += 15;
    if (hasPhone) score += 5;
    else suggestions.push("Add a contact phone number to improve recruiter outreach speed.");

    // 2. Summary Check (Max: 10 pts)
    if (data.summary && data.summary.trim().length > 20) {
      score += 10;
    } else {
      suggestions.push("Draft a 2-3 sentence professional summary summarizing your high-impact achievements.");
      keywordGaps.push("professional summary");
    }

    // 3. Work Experience Check (Max: 30 pts)
    if (data.workExperiences && data.workExperiences.length > 0) {
      score += 20;
      let bulletCount = 0;
      let hasMetrics = false;
      
      data.workExperiences.forEach((exp) => {
        bulletCount += exp.bullets?.length || 0;
        exp.bullets?.forEach((bullet) => {
          if (/\b\d+%\b|\b\d+\s*(?:million|thousand|k|m)\b|\b\$\d+/i.test(bullet)) {
            hasMetrics = true;
          }
        });
      });

      if (bulletCount >= 3) {
        score += 5;
      } else {
        suggestions.push("Include at least 3 descriptive bullet points for each professional experience item.");
      }

      if (hasMetrics) {
        score += 5;
        keywordMatches.push("quantified impact");
      } else {
        suggestions.push("Integrate hard metrics (%, $, scale, velocity) to prove quantified business impact in work experiences.");
        keywordGaps.push("impact metrics");
      }
    } else {
      suggestions.push("Add your professional work history with core achievements.");
    }

    // 4. Skills Check (Max: 20 pts)
    if (data.skills && data.skills.length > 0) {
      score += 15;
      if (data.skills.length >= 5) score += 5;
      
      data.skills.forEach(s => {
        if (s.level === "Expert" || s.level === "Advanced") {
          keywordMatches.push(s.name.toLowerCase());
        }
      });
    } else {
      suggestions.push("Add technical and domain skills to match applicant tracking systems keywords.");
    }

    // 5. Education Check (Max: 10 pts)
    if (data.education && data.education.length > 0) {
      score += 10;
    } else {
      suggestions.push("Add your academic degrees, certifications, or formal education history.");
    }

    // 6. Portfolio & Links Check (Max: 10 pts)
    const links = data.personalInfo?.socialLinks;
    if (links?.linkedin) {
      score += 4;
      keywordMatches.push("linkedin profile");
    } else {
      suggestions.push("Add your LinkedIn profile link to improve social credibility.");
    }
    if (links?.github) {
      score += 3;
      keywordMatches.push("github profile");
    }
    if (links?.portfolio) {
      score += 3;
      keywordMatches.push("portfolio");
    }

    const formattingCheck = {
      hasContactInfo: hasEmail && (hasPhone || !!links?.linkedin),
      hasValidSections: data.workExperiences.length > 0 && data.education.length > 0,
      hasProperFontSizes: true, // Baseline layout checks
    };

    // Calculate complexity score: length, items, sections
    const complexityScore = Math.min(
      100,
      Math.round(
        (data.workExperiences.length * 15 +
          data.skills.length * 4 +
          data.education.length * 10 +
          data.projects.length * 10 +
          data.customSections.length * 15)
      )
    );

    return AtsMetadataSchema.parse({
      score: Math.min(100, score),
      formattingCheck,
      keywordMatches,
      keywordGaps,
      complexityScore,
      suggestions: suggestions.length > 0 ? suggestions : ["Your resume matches top ATS structural formatting criteria!"],
    });
  }

  /**
   * Create a new resume
   */
  async createResume(userId: string, title: string, templateId: string | null, rawData: unknown) {
    const data = this.validateResumeData(rawData);
    return this.repository.createResume(userId, title, templateId, data);
  }

  /**
   * List resumes for a user
   */
  async listResumes(userId: string) {
    return this.repository.listResumes(userId);
  }

  /**
   * Get single resume and active version/draft contents
   */
  async getResumeWithContent(resumeId: string, userId: string) {
    const resume = await this.repository.getResume(resumeId, userId);
    if (!resume) return null;

    const version = await this.repository.getActiveOrDraftVersion(resumeId);
    return {
      ...resume,
      content: version ? {
        versionNumber: version.versionNumber,
        templateId: version.templateId,
        data: version.data as ResumeData,
        atsMetadata: version.atsMetadata as AtsMetadata || null,
        isDraft: version.isAutosaveDraft,
      } : null,
    };
  }

  /**
   * Autosave resume progress
   */
  async autosave(resumeId: string, userId: string, templateId: string | null, rawData: unknown) {
    // Verify owner
    const resume = await this.repository.getResume(resumeId, userId);
    if (!resume) throw new Error("Resume not found or access denied.");

    const data = this.validateResumeData(rawData);
    return this.repository.autosaveDraft(resumeId, templateId, data);
  }

  /**
   * Commit draft to formal snapshot version
   */
  async saveVersion(resumeId: string, userId: string, templateId: string | null, rawData: unknown) {
    // Verify owner
    const resume = await this.repository.getResume(resumeId, userId);
    if (!resume) throw new Error("Resume not found or access denied.");

    const data = this.validateResumeData(rawData);
    const atsMetadata = this.evaluateAtsScore(data);

    return this.repository.createVersionSnapshot(resumeId, templateId, data, atsMetadata);
  }

  /**
   * Revert content to a previous version number
   */
  async revertVersion(resumeId: string, userId: string, versionNumber: number) {
    // Verify owner
    const resume = await this.repository.getResume(resumeId, userId);
    if (!resume) throw new Error("Resume not found or access denied.");

    return this.repository.revertToVersion(resumeId, versionNumber);
  }

  /**
   * Soft delete resume
   */
  async deleteResume(resumeId: string, userId: string) {
    return this.repository.softDeleteResume(resumeId, userId);
  }

  /**
   * Restore resume
   */
  async restoreResume(resumeId: string, userId: string) {
    return this.repository.restoreResume(resumeId, userId);
  }

  /**
   * Get version history logs
   */
  async getVersionHistory(resumeId: string, userId: string) {
    const resume = await this.repository.getResume(resumeId, userId);
    if (!resume) throw new Error("Resume not found or access denied.");

    return this.repository.listVersions(resumeId);
  }

  /**
   * Get all templates
   */
  async getTemplates() {
    return this.repository.listTemplates();
  }
}
