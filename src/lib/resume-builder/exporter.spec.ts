import { ResumeExporter } from "./exporter";
import { type ResumeData } from "./validation";

describe("ResumeExporter", () => {
  let exporter: ResumeExporter;

  beforeEach(() => {
    exporter = new ResumeExporter();
  });

  const baseResumeData: ResumeData = {
    personalInfo: {
      fullName: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "+1 (555) 019-9988"
    },
    summary: "Professional summary bio.",
    workExperiences: [
      {
        id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        role: "Lead Dev",
        company: "Workora",
        startDate: "2021-01",
        endDate: "2023-01",
        isCurrent: false,
        bullets: ["Developed parser engines."]
      }
    ],
    education: [],
    skills: [{ name: "TypeScript" }, { name: "React" }],
    projects: [],
    certifications: [],
    achievements: [],
    awards: [],
    languages: [],
    volunteer: [],
    publications: [],
    patents: [],
    research: [],
    training: [],
    internships: [],
    references: [],
    customSections: []
  };

  it("should compile resume data to structured markdown format correctly", () => {
    const markdown = exporter.exportToMarkdown(baseResumeData);
    expect(markdown).toContain("# Jane Doe");
    expect(markdown).toContain("## Professional Summary");
    expect(markdown).toContain("jane.doe@example.com");
  });

  it("should backup data to JSON and import/validate successfully", () => {
    const jsonStr = exporter.exportToJson(baseResumeData);
    const parsed = exporter.importFromJson(jsonStr);
    expect(parsed.personalInfo.fullName).toBe("Jane Doe");
    expect(parsed.skills).toHaveLength(2);
  });
});
