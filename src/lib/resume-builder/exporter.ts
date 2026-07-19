import { type ResumeData, ResumeDataSchema } from "./validation";
import { EnterpriseTemplatesEngine } from "./templates";

export class ResumeExporter {
  private templatesEngine = new EnterpriseTemplatesEngine();

  /**
   * Export to raw HTML with styles
   */
  exportToHtml(data: ResumeData, templateId: string): string {
    return this.templatesEngine.compileTemplate(data, templateId);
  }

  /**
   * Export to Markdown string
   */
  exportToMarkdown(data: ResumeData): string {
    const contactLine = [
      data.personalInfo.email,
      data.personalInfo.phone,
      data.personalInfo.location,
      data.personalInfo.socialLinks?.linkedin,
      data.personalInfo.socialLinks?.portfolio
    ].filter(Boolean).join("  |  ");

    const lines: string[] = [
      `# ${data.personalInfo.fullName}`,
      data.personalInfo.title ? `### ${data.personalInfo.title}` : "",
      contactLine,
      "",
      "---",
      ""
    ];

    if (data.summary) {
      lines.push("## Professional Summary", data.summary, "");
    }

    if (data.skills.length > 0) {
      lines.push("## Core Competencies");
      const list = data.skills.map(s => `- **${s.name}**${s.level ? ` (${s.level})` : ""}`).join("\n");
      lines.push(list, "");
    }

    if (data.workExperiences.length > 0) {
      lines.push("## Professional Experience");
      data.workExperiences.forEach(exp => {
        lines.push(
          `### ${exp.role} — ${exp.company}`,
          `*${exp.startDate} – ${exp.isCurrent ? "Present" : exp.endDate} | ${exp.location || ""}*`,
          exp.description ? exp.description : "",
          exp.bullets.map(b => `- ${b}`).join("\n"),
          ""
        );
      });
    }

    if (data.education.length > 0) {
      lines.push("## Education");
      data.education.forEach(ed => {
        lines.push(
          `### ${ed.degree}`,
          `**${ed.institution}** *(${ed.endDate || ed.startDate || "Graduated"})*`,
          ed.details ? `*${ed.details}*` : "",
          ""
        );
      });
    }

    if (data.projects.length > 0) {
      lines.push("## Projects");
      data.projects.forEach(proj => {
        lines.push(
          `### ${proj.name} ${proj.role ? `(${proj.role})` : ""}`,
          proj.url ? `Link: [${proj.url}](${proj.url})` : "",
          proj.techStack.length > 0 ? `*Stack: ${proj.techStack.join(", ")}*` : "",
          proj.description ? proj.description : "",
          proj.bullets && proj.bullets.length > 0 ? proj.bullets.map(b => `- ${b}`).join("\n") : "",
          ""
        );
      });
    }

    if (data.certifications.length > 0) {
      lines.push("## Certifications");
      data.certifications.forEach(c => {
        lines.push(`- **${c.name}** – ${c.issuer} ${c.issueDate ? `(${c.issueDate})` : ""}`);
      });
    }

    return lines.join("\n");
  }

  /**
   * Exports CV data structure to JSON string backup
   */
  exportToJson(data: ResumeData): string {
    return JSON.stringify(data, null, 2);
  }

  /**
   * Imports and validates CV backup JSON string
   */
  importFromJson(jsonStr: string): ResumeData {
    const raw = JSON.parse(jsonStr);
    return ResumeDataSchema.parse(raw);
  }
}
