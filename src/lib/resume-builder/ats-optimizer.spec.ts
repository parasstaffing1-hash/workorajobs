import { AtsOptimizerEngine } from "./ats-optimizer";
import { type ResumeData } from "./validation";

describe("AtsOptimizerEngine", () => {
  let optimizer: AtsOptimizerEngine;

  beforeEach(() => {
    optimizer = new AtsOptimizerEngine();
  });

  const baseResumeData: ResumeData = {
    personalInfo: {
      fullName: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "+1 (555) 019-9988",
      socialLinks: {
        linkedin: "https://linkedin.com/in/janedoe"
      }
    },
    summary: "Experienced staff developer.",
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

  it("should return a high ATS score for a complete, well-formed resume", () => {
    const result = optimizer.auditResume(baseResumeData);
    expect(result.atsScore).toBeGreaterThanOrEqual(80);
    expect(result.warnings.filter(w => w.category === "danger")).toHaveLength(0);
  });

  it("should detect duplicate skills and flag them with warnings", () => {
    const duplicateSkillsData = {
      ...baseResumeData,
      skills: [{ name: "TypeScript" }, { name: "TypeScript" }]
    };
    const result = optimizer.auditResume(duplicateSkillsData);
    expect(result.warnings.some(w => w.message.includes("Duplicate skill"))).toBe(true);
  });

  it("should catch date chronologies where start date is after end date", () => {
    const invalidDatesData = {
      ...baseResumeData,
      workExperiences: [
        {
          id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
          role: "Lead Dev",
          company: "Workora",
          startDate: "2023-01",
          endDate: "2021-01",
          isCurrent: false,
          bullets: ["Developed parser engines."]
        }
      ]
    };
    const result = optimizer.auditResume(invalidDatesData);
    expect(result.warnings.some(w => w.message.includes("Inconsistent dates"))).toBe(true);
  });

  it("should flag template placeholders like lorem ipsum", () => {
    const placeholderData = {
      ...baseResumeData,
      summary: "This is a placeholder sentence with lorem ipsum."
    };
    const result = optimizer.auditResume(placeholderData);
    expect(result.warnings.some(w => w.message.includes("Placeholder text found"))).toBe(true);
  });
});
