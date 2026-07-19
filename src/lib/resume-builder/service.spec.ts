import { ResumeBuilderService } from "./service";
import { type ResumeData } from "./validation";

describe("ResumeBuilderService", () => {
  let service: ResumeBuilderService;

  beforeEach(() => {
    service = new ResumeBuilderService();
  });

  const mockResumeData: ResumeData = {
    personalInfo: {
      fullName: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "+1 (555) 019-9988",
      socialLinks: {
        linkedin: "https://linkedin.com/in/janedoe",
        github: "https://github.com/janedoe",
        portfolio: "https://janedoe.me",
      },
    },
    summary: "Senior Full Stack Engineer with 6 years experience architecting cloud pipelines.",
    workExperiences: [
      {
        id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        role: "Senior Full Stack Engineer",
        company: "Workora",
        location: "Toronto, ON",
        startDate: "2021-06",
        isCurrent: true,
        bullets: [
          "Architected real-time talent search indexing pipeline in NestJS, boosting search speeds by 38%.",
          "Collaborated with design teams to enforce strict WCAG 2.1 AA accessibility standards.",
        ],
      },
    ],
    education: [
      {
        id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12",
        degree: "B.Sc. in Computer Science",
        institution: "University of Toronto",
        year: "2020",
      } as any,
    ],
    skills: [
      { name: "TypeScript", level: "Expert" },
      { name: "React", level: "Advanced" },
      { name: "Node.js", level: "Advanced" },
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

  it("should validate valid resume data successfully", () => {
    const parsed = service.validateResumeData(mockResumeData);
    expect(parsed.personalInfo.fullName).toBe("Jane Doe");
    expect(parsed.skills).toHaveLength(3);
  });

  it("should fail validation on invalid email or missing name", () => {
    const invalidData = {
      ...mockResumeData,
      personalInfo: {
        fullName: "",
        email: "invalid-email",
      },
    };

    expect(() => service.validateResumeData(invalidData)).toThrow();
  });

  it("should score a complete resume highly in the ATS evaluation", () => {
    const evaluation = service.evaluateAtsScore(mockResumeData);
    expect(evaluation.score).toBeGreaterThanOrEqual(80);
    expect(evaluation.formattingCheck.hasContactInfo).toBe(true);
    expect(evaluation.keywordMatches).toContain("typescript");
  });

  it("should generate proper suggestions for incomplete profiles", () => {
    const incompleteData: ResumeData = {
      personalInfo: {
        fullName: "John Doe",
        email: "john.doe@example.com",
      },
      workExperiences: [],
      education: [],
      skills: [],
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

    const evaluation = service.evaluateAtsScore(incompleteData);
    expect(evaluation.score).toBeLessThan(50);
    expect(evaluation.suggestions).toContainEqual(
      expect.stringContaining("LinkedIn profile link")
    );
    expect(evaluation.suggestions).toContainEqual(
      expect.stringContaining("Add your professional work history")
    );
  });
});
