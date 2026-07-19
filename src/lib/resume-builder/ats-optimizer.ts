import { type ResumeData } from "./validation";

export interface AtsAuditResult {
  atsScore: number;
  readabilityScore: number;
  formattingScore: number;
  keywordScore: number;
  warnings: {
    category: "danger" | "warning" | "info";
    message: string;
    actionableFix: string;
  }[];
  suggestions: string[];
}

export class AtsOptimizerEngine {
  /**
   * Evaluates and audits a resume against ATS-compatibility parameters deterministically
   */
  auditResume(data: ResumeData, targetJobText?: string): AtsAuditResult {
    const warnings: AtsAuditResult["warnings"] = [];
    const suggestions: string[] = [];
    
    let readabilityPoints = 100;
    let formattingPoints = 100;
    let keywordPoints = 100;

    // --- 1. Contact Information Audits ---
    if (!data.personalInfo.email) {
      formattingPoints -= 25;
      warnings.push({
        category: "danger",
        message: "Missing contact email address.",
        actionableFix: "Add a professional email address to the contact header."
      });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.personalInfo.email)) {
      formattingPoints -= 15;
      warnings.push({
        category: "warning",
        message: "Email address format appears invalid.",
        actionableFix: "Ensure your email matches standard user@domain.com formatting."
      });
    }

    if (!data.personalInfo.phone) {
      formattingPoints -= 10;
      warnings.push({
        category: "warning",
        message: "No phone number provided.",
        actionableFix: "Add your contact phone number to prevent candidate filter dropouts."
      });
    }

    if (!data.personalInfo.socialLinks?.linkedin) {
      formattingPoints -= 10;
      warnings.push({
        category: "info",
        message: "No LinkedIn profile linked.",
        actionableFix: "Add your LinkedIn URL; over 85% of recruiters cross-reference profiles."
      });
    }

    // --- 2. Validation: Grammar Placeholders & Text Checks ---
    const placeholderRegex = /\[.*?\]|placeholder|lorem\s+ipsum|insert\s+here|company\s+name|job\s+title/i;
    
    if (placeholderRegex.test(data.personalInfo.fullName) || placeholderRegex.test(data.personalInfo.title || "")) {
      readabilityPoints -= 20;
      warnings.push({
        category: "danger",
        message: "Placeholder template strings detected in personal info.",
        actionableFix: "Replace bracketed fields and placeholder names with actual profile details."
      });
    }

    if (data.summary && placeholderRegex.test(data.summary)) {
      readabilityPoints -= 15;
      warnings.push({
        category: "danger",
        message: "Placeholder text found in Professional Summary.",
        actionableFix: "Rewrite the summary to remove placeholder template sentences."
      });
    }

    // --- 3. Experience Validation ---
    if (data.workExperiences.length === 0) {
      readabilityPoints -= 30;
      warnings.push({
        category: "danger",
        message: "No professional work experiences registered.",
        actionableFix: "Add at least one relevant job experience with bullet points."
      });
    } else {
      const companies = new Set<string>();
      
      data.workExperiences.forEach((exp, idx) => {
        // Overlap / duplicates check
        const compKey = `${exp.company.toLowerCase()}-${exp.role.toLowerCase()}`;
        if (companies.has(compKey)) {
          readabilityPoints -= 10;
          warnings.push({
            category: "warning",
            message: `Duplicate experience entry: ${exp.role} at ${exp.company}.`,
            actionableFix: "Merge or remove duplicate job history entries."
          });
        }
        companies.add(compKey);

        // Date consistency check
        if (exp.startDate && exp.endDate && !exp.isCurrent) {
          const start = new Date(exp.startDate);
          const end = new Date(exp.endDate);
          if (start > end) {
            formattingPoints -= 15;
            warnings.push({
              category: "danger",
              message: `Inconsistent dates at ${exp.company}: Start Date is after End Date.`,
              actionableFix: "Correct the timeline order of your employment dates."
            });
          }
        }

        // Description / Bullet checks
        if (exp.bullets.length === 0) {
          readabilityPoints -= 10;
          warnings.push({
            category: "warning",
            message: `No achievements listed for ${exp.role} at ${exp.company}.`,
            actionableFix: "Draft at least 3 bullet points focused on quantified impact achievements."
          });
        } else {
          exp.bullets.forEach((bullet, bIdx) => {
            if (bullet.length > 250) {
              readabilityPoints -= 5;
              warnings.push({
                category: "warning",
                message: `Bullet #${bIdx + 1} at ${exp.company} is too long (${bullet.length} chars).`,
                actionableFix: "Break up long paragraphs into single sentence bullet points (under 200 chars)."
              });
            }
            if (placeholderRegex.test(bullet)) {
              readabilityPoints -= 5;
              warnings.push({
                category: "danger",
                message: `Placeholder text found in bullet points at ${exp.company}.`,
                actionableFix: "Review and replace placeholder content."
              });
            }
          });
        }
      });
    }

    // --- 4. Skills & Formatting ---
    if (data.skills.length === 0) {
      formattingPoints -= 20;
      warnings.push({
        category: "danger",
        message: "Skills list is empty.",
        actionableFix: "List core technical competencies to match ATS indexing filters."
      });
    } else {
      const skillsSet = new Set<string>();
      data.skills.forEach(s => {
        const nameKey = s.name.toLowerCase().trim();
        if (skillsSet.has(nameKey)) {
          formattingPoints -= 5;
          warnings.push({
            category: "info",
            message: `Duplicate skill tag detected: "${s.name}".`,
            actionableFix: "Remove duplicate entries from the competencies section."
          });
        }
        skillsSet.add(nameKey);
      });
    }

    // --- 5. Broken links validation ---
    const linkFields = [
      data.personalInfo.socialLinks?.linkedin,
      data.personalInfo.socialLinks?.portfolio,
      data.personalInfo.socialLinks?.github
    ];
    linkFields.forEach(link => {
      if (link && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/i.test(link)) {
        formattingPoints -= 5;
        warnings.push({
          category: "warning",
          message: `Linked profile "${link}" has an invalid URL format.`,
          actionableFix: "Correct your URL prefix (e.g. use https://linkedin.com/...)."
        });
      }
    });

    // --- 6. Keyword Coverage scoring ---
    if (targetJobText) {
      const cleanJobText = targetJobText.toLowerCase();
      const skillsWords = data.skills.map(s => s.name.toLowerCase());
      
      let matchedCount = 0;
      skillsWords.forEach(skill => {
        if (cleanJobText.includes(skill)) {
          matchedCount++;
        }
      });

      const coverageRatio = skillsWords.length > 0 ? matchedCount / Math.min(10, skillsWords.length) : 0;
      keywordPoints = Math.round(Math.min(100, coverageRatio * 100));

      if (matchedCount < 3) {
        suggestions.push("Tailor technical skills and competencies tags to match terms listed in the job post description.");
      }
    } else {
      keywordPoints = 75; // Baseline default if no description provided
    }

    // Calculate final scores
    const atsScore = Math.round(
      (Math.max(0, readabilityPoints) * 0.4) +
      (Math.max(0, formattingPoints) * 0.4) +
      (Math.max(0, keywordPoints) * 0.2)
    );

    // Dynamic suggestions
    if (readabilityPoints < 85) {
      suggestions.push("Improve readability by simplifying paragraphs and editing text length limits.");
    }
    if (formattingPoints < 85) {
      suggestions.push("Enforce formatting standards: correct date chronologies, links, and missing headers.");
    }
    if (warnings.length === 0) {
      suggestions.push("Your profile matches top-tier corporate recruiter parsing templates perfectly!");
    }

    return {
      atsScore,
      readabilityScore: Math.max(0, readabilityPoints),
      formattingScore: Math.max(0, formattingPoints),
      keywordScore: Math.max(0, keywordPoints),
      warnings,
      suggestions
    };
  }
}
