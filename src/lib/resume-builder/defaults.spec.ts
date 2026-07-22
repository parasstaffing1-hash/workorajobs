import { createSampleResumeData, parseResumeDraft } from "./defaults";
import { ResumeDataSchema } from "./validation";

describe("resume builder defaults", () => {
  it("ships a sample that can be saved and restored without data loss", () => {
    const sample = createSampleResumeData();
    const restored = parseResumeDraft(JSON.parse(JSON.stringify(sample)));

    expect(ResumeDataSchema.parse(restored)).toEqual(sample);
    expect(restored.workExperiences).toHaveLength(2);
    expect(restored.projects[0].url).toMatch(/^https:\/\//);
  });

  it("repairs a legacy draft with missing entry ids and section arrays", () => {
    const restored = parseResumeDraft({
      personalInfo: {
        fullName: "Legacy Candidate",
        email: "legacy@example.com",
      },
      workExperiences: [
        {
          role: "Engineer",
          company: "Workora",
          startDate: "2020-01",
          isCurrent: true,
          bullets: ["Built a reliable hiring workflow."],
        },
      ],
    });

    expect(restored.workExperiences[0].id).toBeTruthy();
    expect(restored.education).toEqual([]);
    expect(restored.projects).toEqual([]);
  });

  it("restores an in-progress draft without discarding incomplete fields", () => {
    const restored = parseResumeDraft({
      personalInfo: {
        fullName: "Candidate",
        email: "candidate@",
        socialLinks: { linkedin: "linkedin.com/in/candidate" },
      },
      workExperiences: [
        {
          id: "draft-role",
          role: "",
          company: "",
          startDate: "",
          isCurrent: false,
          bullets: [""],
        },
      ],
    });

    expect(restored.personalInfo.email).toBe("candidate@");
    expect(restored.personalInfo.socialLinks?.linkedin).toBe(
      "linkedin.com/in/candidate",
    );
    expect(restored.workExperiences[0].role).toBe("");
  });
});
