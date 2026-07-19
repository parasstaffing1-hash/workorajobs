import { ResumeEngine } from "./engine";
import { type ResumeData } from "./validation";

describe("ResumeEngine", () => {
  let engine: ResumeEngine;

  beforeEach(() => {
    engine = new ResumeEngine();
  });

  const mockResumeData: ResumeData = {
    personalInfo: {
      fullName: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "+1 (555) 019-9988",
      title: "Staff Developer"
    },
    summary: "Professional summary bio.",
    workExperiences: [
      {
        id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        role: "Lead dev",
        company: "Workora",
        startDate: "2022-03",
        isCurrent: true,
        bullets: [
          "Developed core search parsing algorithms.",
        ],
      },
    ],
    education: [
      {
        id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12",
        degree: "B.Sc.",
        institution: "U of T",
        year: "2020"
      } as any
    ],
    skills: [
      { name: "TypeScript", level: "Expert" }
    ],
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
    customSections: [],
  };

  it("should translate date strings to human-readable month names correctly", () => {
    expect(engine.formatDate("2022-03")).toBe("March 2022");
    expect(engine.formatDate("present")).toBe("Present");
    expect(engine.formatDate(undefined)).toBe("Present");
  });

  it("should compile a full HTML document containing header details", () => {
    const html = engine.generateHtml(mockResumeData, "modern");
    expect(html).toContain("Jane Doe");
    expect(html).toContain("jane.doe@example.com");
    expect(html).toContain("Professional summary");
    expect(html).toContain("Core Competencies");
  });

  it("should enforce the specified sectionOrder in the output HTML", () => {
    const htmlFirst = engine.generateHtml(mockResumeData, "modern", {
      sectionOrder: ["skills", "summary"]
    });
    
    const skillsIndex = htmlFirst.indexOf("Core Competencies");
    const summaryIndex = htmlFirst.indexOf("Professional Summary");
    
    expect(skillsIndex).toBeGreaterThan(-1);
    expect(summaryIndex).toBeGreaterThan(-1);
    expect(skillsIndex).toBeLessThan(summaryIndex);
  });
});
