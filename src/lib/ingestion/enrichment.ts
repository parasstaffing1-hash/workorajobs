import { RawJobPayload, ProcessedJobPayload } from "./types";
import { generateJobFingerprint } from "./fingerprint";

export class JobEnrichmentEngine {
  /**
   * Enriches raw job payload with tech stack, category, seniority, and salary estimates
   */
  static async enrich(rawJob: RawJobPayload): Promise<ProcessedJobPayload> {
    const fingerprintHash = generateJobFingerprint(rawJob);

    // Rule-based tech stack extraction
    const techStack = this.extractTechStack(`${rawJob.title} ${rawJob.description}`);
    const seniority = this.extractSeniority(rawJob.title);
    const category = this.extractCategory(rawJob.title, rawJob.department);
    const industry = "Technology & Software";

    // Estimated salary if missing
    let salaryMin = rawJob.salaryMin;
    let salaryMax = rawJob.salaryMax;
    if (!salaryMin || salaryMin === 0) {
      if (seniority === "Senior Level" || seniority === "Lead / Staff") {
        salaryMin = 130000;
        salaryMax = 180000;
      } else if (seniority === "Entry Level / Intern") {
        salaryMin = 60000;
        salaryMax = 90000;
      } else {
        salaryMin = 95000;
        salaryMax = 140000;
      }
    }

    return {
      ...rawJob,
      salaryMin,
      salaryMax,
      fingerprintHash,
      category,
      industry,
      techStack,
      seniority,
      isAiEnriched: true,
      isValid: true,
    };
  }

  private static extractTechStack(text: string): string[] {
    const keywords = [
      "React", "TypeScript", "Next.js", "Node.js", "Python", "PostgreSQL",
      "Docker", "Kubernetes", "AWS", "GraphQL", "Tailwind CSS", "Go", "Java",
      "PyTorch", "TensorFlow", "Rust", "Swift", "Kotlin", "Redis", "Kafka"
    ];
    const found: string[] = [];
    const lowerText = text.toLowerCase();
    keywords.forEach((kw) => {
      if (lowerText.includes(kw.toLowerCase())) {
        found.push(kw);
      }
    });
    return Array.from(new Set(found));
  }

  private static extractSeniority(title: string): string {
    const lower = title.toLowerCase();
    if (lower.includes("intern") || lower.includes("junior") || lower.includes("entry")) {
      return "Entry Level / Intern";
    }
    if (lower.includes("lead") || lower.includes("staff") || lower.includes("principal") || lower.includes("director") || lower.includes("vp")) {
      return "Lead / Staff";
    }
    if (lower.includes("senior") || lower.includes("sr")) {
      return "Senior Level";
    }
    return "Mid Level";
  }

  private static extractCategory(title: string, department?: string): string {
    const lower = `${title} ${department || ""}`.toLowerCase();
    if (lower.includes("design") || lower.includes("ux") || lower.includes("ui")) return "Design & Creative";
    if (lower.includes("product") && !lower.includes("engineer")) return "Product Management";
    if (lower.includes("data") || lower.includes("ai") || lower.includes("machine learning")) return "Data & AI";
    if (lower.includes("sales") || lower.includes("account")) return "Sales & BD";
    if (lower.includes("marketing") || lower.includes("growth")) return "Marketing";
    return "Engineering & Software Architecture";
  }
}
