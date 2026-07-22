export interface ParsedResumeData {
  name?: string;
  email?: string;
  phone?: string;
  skills: string[];
  experienceYears?: number;
  education?: string;
  certifications: string[];
  location?: string;
}

export class ResumeParser {
  /**
   * Rule-based regex resume text parser with zero external API dependencies
   */
  static parseText(plainText: string): ParsedResumeData {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;

    const emails = plainText.match(emailRegex) || [];
    const phones = plainText.match(phoneRegex) || [];

    const commonSkills = [
      "React", "TypeScript", "Next.js", "Node.js", "Python", "PostgreSQL",
      "Docker", "Kubernetes", "AWS", "GraphQL", "Tailwind CSS", "Go", "Java",
      "PyTorch", "TensorFlow", "Rust", "Swift", "Kotlin", "Redis", "Kafka", "SQL", "Git"
    ];

    const lower = plainText.toLowerCase();
    const extractedSkills = commonSkills.filter((skill) => lower.includes(skill.toLowerCase()));

    // Rule-based name extraction (first line heuristic)
    const lines = plainText.split("\n").map((l) => l.trim()).filter(Boolean);
    const candidateName = lines.length > 0 && lines[0].length < 40 ? lines[0] : undefined;

    return {
      name: candidateName,
      email: emails[0],
      phone: phones[0],
      skills: extractedSkills,
      experienceYears: lower.includes("5+ years") ? 5 : lower.includes("3+ years") ? 3 : 2,
      education: lower.includes("bachelor") ? "Bachelor's Degree" : lower.includes("master") ? "Master's Degree" : undefined,
      certifications: lower.includes("aws certified") ? ["AWS Certified Solutions Architect"] : [],
    };
  }
}
