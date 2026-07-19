import type { Job } from "@/data/jobs";

export type ParsedResume = {
  name: string;
  email: string;
  phone: string;
  skills: string[];
  yearsOfExperience: number | null;
  currentJobTitle: string;
  previousJobTitles: string[];
  education: string[];
  certifications: string[];
  preferredLocation: string;
  languages: string[];
  keywords: string[];
  rawText: string;
};

export type ResumeMatchResult = {
  job: Job;
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  reasons: string[];
  missing: string[];
};

export type ResumeFileValidation = {
  ok: boolean;
  message: string;
};

type PdfTextItem = {
  str?: string;
};

type PdfPage = {
  getTextContent: () => Promise<{ items: PdfTextItem[] }>;
};

type PdfDocumentProxy = {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PdfPage>;
};

type PdfModule = {
  getDocument: (source: {
    data: Uint8Array;
    disableWorker?: boolean;
    isEvalSupported?: boolean;
  }) => { promise: Promise<PdfDocumentProxy> };
};

type MammothModule = {
  extractRawText: (input: {
    arrayBuffer: ArrayBuffer;
  }) => Promise<{ value: string }>;
};

const maxResumeSize = 5 * 1024 * 1024;

const knownSkills = [
  "accessibility",
  "analytics",
  "analytics dashboards",
  "apac",
  "api",
  "ats",
  "audit",
  "automation",
  "aws",
  "b2b",
  "b2b saas",
  "compliance",
  "customer success",
  "data analysis",
  "dashboards",
  "dbt",
  "design systems",
  "distributed systems",
  "docker",
  "enterprise",
  "figma",
  "fintech",
  "gainsight",
  "graphql",
  "healthcare",
  "kafka",
  "node.js",
  "n8n",
  "openai",
  "operations",
  "payroll",
  "postgresql",
  "product design",
  "prototyping",
  "python",
  "react",
  "redis",
  "research",
  "retention",
  "recruiting",
  "salesforce",
  "sap",
  "sql",
  "stakeholder management",
  "tableau",
  "typescript",
  "ux research",
  "vendor management",
  "workday",
  "zapier",
];

const knownTitles = [
  "senior product designer",
  "product designer",
  "staff backend engineer",
  "backend engineer",
  "data analyst",
  "customer success manager",
  "global payroll operations lead",
  "payroll operations lead",
  "recruiting operations specialist",
  "recruiter",
  "talent acquisition partner",
  "operations lead",
];

const stopWords = new Set([
  "and",
  "the",
  "for",
  "with",
  "from",
  "into",
  "that",
  "this",
  "your",
  "resume",
  "experience",
  "work",
  "team",
  "teams",
]);

export function validateResumeFile(file: File): ResumeFileValidation {
  const extension = file.name.toLowerCase().split(".").pop() ?? "";
  const validExtension = extension === "pdf" || extension === "docx";

  if (!validExtension) {
    return { ok: false, message: "Upload a PDF or DOCX resume." };
  }

  if (file.size > maxResumeSize) {
    return { ok: false, message: "Resume must be 5 MB or smaller." };
  }

  return { ok: true, message: "" };
}

export async function extractResumeText(file: File): Promise<string> {
  const extension = file.name.toLowerCase().split(".").pop() ?? "";
  const arrayBuffer = await file.arrayBuffer();

  if (extension === "pdf") {
    return extractPdfText(arrayBuffer);
  }

  if (extension === "docx") {
    return extractDocxText(arrayBuffer);
  }

  throw new Error("Unsupported resume file type.");
}

async function extractPdfText(arrayBuffer: ArrayBuffer) {
  const pdfjs = (await import("pdfjs-dist/legacy/build/pdf.mjs")) as PdfModule;
  const document = await pdfjs.getDocument({
    data: new Uint8Array(arrayBuffer),
    disableWorker: true,
    isEvalSupported: false,
  }).promise;
  const pageText: string[] = [];

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    pageText.push(
      content.items
        .map((item) => item.str ?? "")
        .filter(Boolean)
        .join(" "),
    );
  }

  const text = pageText.join("\n").trim();

  if (!text) {
    throw new Error("No readable text found in this PDF.");
  }

  return text;
}

async function extractDocxText(arrayBuffer: ArrayBuffer) {
  const mammoth = (await import("mammoth")) as MammothModule;
  const result = await mammoth.extractRawText({ arrayBuffer });
  const text = result.value.trim();

  if (!text) {
    throw new Error("No readable text found in this DOCX.");
  }

  return text;
}

export function parseResume(text: string): ParsedResume {
  const normalized = text.replace(/\r/g, "\n");
  const lines = normalized
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const lowerText = normalized.toLowerCase();
  const email =
    normalized.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? "";
  const phone =
    normalized.match(/(?:\+?\d[\d\s().-]{7,}\d)/)?.[0]?.trim() ?? "";
  const skills = knownSkills.filter((skill) => lowerText.includes(skill));
  const titleMatches = knownTitles.filter((title) => lowerText.includes(title));
  const yearsOfExperience = extractYears(normalized);
  const education = lines.filter((line) =>
    /\b(university|college|b\.|m\.|mba|degree|certified professional|bachelor|master|phd)\b/i.test(
      line,
    ),
  );
  const certifications = lines.filter((line) =>
    /\b(certified|certification|certificate|aws|pmp|scrum|ccna|cissp)\b/i.test(
      line,
    ),
  );
  const preferredLocation =
    lines
      .find((line) =>
        /\b(remote|hybrid|on-site|onsite|canada|europe|singapore|london|global)\b/i.test(
          line,
        ),
      )
      ?.replace(/^location:\s*/i, "") ?? "";
  const languages =
    normalized
      .match(
        /\b(english|spanish|french|german|hindi|arabic|mandarin|japanese)\b/gi,
      )
      ?.map((language) => titleCase(language.toLowerCase())) ?? [];
  const keywords = unique([
    ...skills,
    ...titleMatches,
    ...tokenize(normalized).filter((word) => word.length > 3),
  ]).slice(0, 28);
  const name =
    lines.find((line) => {
      const withoutSymbols = line.replace(/[^a-z\s'-]/gi, "").trim();
      return (
        withoutSymbols.length >= 3 &&
        withoutSymbols.split(/\s+/).length <= 4 &&
        !line.includes("@") &&
        !/\d/.test(line)
      );
    }) ?? "";

  return {
    name,
    email,
    phone,
    skills: skills.map(titleCase),
    yearsOfExperience,
    currentJobTitle: titleMatches[0] ? titleCase(titleMatches[0]) : "",
    previousJobTitles: titleMatches.slice(1).map(titleCase),
    education,
    certifications,
    preferredLocation,
    languages: unique(languages),
    keywords,
    rawText: normalized,
  };
}

export function matchJobsToResume(
  parsedResume: ParsedResume,
  jobList: Job[],
): ResumeMatchResult[] {
  return jobList
    .map((job) => {
      const requiredSkills = normalizeTerms(job.requiredSkills);
      const preferredSkills = normalizeTerms(job.preferredSkills);
      const resumeSkills = normalizeTerms(parsedResume.skills);
      const resumeKeywords = normalizeTerms(parsedResume.keywords);
      const resumeTitle = parsedResume.currentJobTitle.toLowerCase();
      const matchedRequired = requiredSkills.filter((skill) =>
        includesTerm(resumeSkills, resumeKeywords, skill),
      );
      const matchedPreferred = preferredSkills.filter((skill) =>
        includesTerm(resumeSkills, resumeKeywords, skill),
      );
      const allJobSkills = unique([...requiredSkills, ...preferredSkills]);
      const matchedSkills = unique([
        ...matchedRequired,
        ...matchedPreferred,
      ]).map(titleCase);
      const missingSkills = allJobSkills
        .filter(
          (skill) =>
            !matchedSkills.map((item) => item.toLowerCase()).includes(skill),
        )
        .map(titleCase);
      const skillScore = allJobSkills.length
        ? (matchedSkills.length / allJobSkills.length) * 100
        : 0;
      const experienceScore = calculateExperienceScore(parsedResume, job);
      const jobTitleScore = calculateTitleScore(resumeTitle, job);
      const educationScore = calculateEducationScore(parsedResume, job);
      const locationScore = calculateLocationScore(parsedResume, job);
      const certificationScore = calculateCertificationScore(parsedResume, job);
      const score = Math.round(
        skillScore * 0.5 +
          experienceScore * 0.2 +
          jobTitleScore * 0.1 +
          educationScore * 0.05 +
          locationScore * 0.1 +
          certificationScore * 0.05,
      );
      const reasons = buildReasons({
        experienceScore,
        job,
        jobTitleScore,
        locationScore,
        matchedRequired,
        matchedSkills,
      });

      return {
        job,
        score: clamp(score),
        matchedSkills,
        missingSkills,
        reasons,
        missing: missingSkills.slice(0, 5),
      };
    })
    .sort((a, b) => b.score - a.score);
}

function tokenize(value: string) {
  return (
    value
      .toLowerCase()
      .match(/[a-z][a-z0-9+#.-]{1,}/g)
      ?.filter((word) => !stopWords.has(word)) ?? []
  );
}

function normalizeTerms(terms: string[]) {
  return unique(terms.map((term) => term.toLowerCase().trim()).filter(Boolean));
}

function includesTerm(skills: string[], keywords: string[], term: string) {
  return (
    skills.includes(term) ||
    keywords.includes(term) ||
    keywords.some((keyword) => keyword.includes(term) || term.includes(keyword))
  );
}

function extractYears(value: string) {
  const matches = [...value.matchAll(/\b(\d{1,2})\+?\s*(?:years|yrs)\b/gi)].map(
    (match) => Number(match[1]),
  );

  return matches.length ? Math.max(...matches) : null;
}

function calculateExperienceScore(parsedResume: ParsedResume, job: Job) {
  const requiredYears = Number(job.experience.match(/\d+/)?.[0] ?? "0");

  if (!requiredYears) return 75;
  if (parsedResume.yearsOfExperience === null) return 50;

  return clamp((parsedResume.yearsOfExperience / requiredYears) * 100);
}

function calculateTitleScore(resumeTitle: string, job: Job) {
  const jobTitle = job.title.toLowerCase();

  if (!resumeTitle) return 35;
  if (jobTitle.includes(resumeTitle) || resumeTitle.includes(jobTitle)) {
    return 100;
  }

  const resumeTokens = tokenize(resumeTitle);
  const jobTokens = tokenize(jobTitle);
  const overlap = jobTokens.filter((token) => resumeTokens.includes(token));

  return jobTokens.length
    ? clamp((overlap.length / jobTokens.length) * 100)
    : 0;
}

function calculateEducationScore(parsedResume: ParsedResume, job: Job) {
  if (!job.education) return 80;
  if (!parsedResume.education.length) return 45;

  const educationText = parsedResume.education.join(" ").toLowerCase();
  const jobEducationTokens = tokenize(job.education);
  const overlap = jobEducationTokens.filter((token) =>
    educationText.includes(token),
  );

  return overlap.length ? 90 : 70;
}

function calculateLocationScore(parsedResume: ParsedResume, job: Job) {
  const preferred = parsedResume.preferredLocation.toLowerCase();
  const jobLocation = `${job.location} ${job.workMode}`.toLowerCase();

  if (!preferred) return job.workMode === "Remote" ? 85 : 60;
  if (preferred.includes("remote") && job.workMode === "Remote") return 100;
  if (preferred.includes(job.workMode.toLowerCase())) return 90;
  if (
    preferred
      .split(/[,|]/)
      .map((item) => item.trim())
      .filter(Boolean)
      .some((item) => jobLocation.includes(item))
  ) {
    return 95;
  }

  return 50;
}

function calculateCertificationScore(parsedResume: ParsedResume, job: Job) {
  if (!parsedResume.certifications.length) return 50;

  const certificationText = parsedResume.certifications.join(" ").toLowerCase();
  const relevantTerms = [
    ...job.requiredSkills,
    ...job.preferredSkills,
    ...job.keywords,
  ]
    .map((term) => term.toLowerCase())
    .filter((term) => certificationText.includes(term));

  return relevantTerms.length ? 95 : 70;
}

function buildReasons({
  experienceScore,
  job,
  jobTitleScore,
  locationScore,
  matchedRequired,
  matchedSkills,
}: {
  experienceScore: number;
  job: Job;
  jobTitleScore: number;
  locationScore: number;
  matchedRequired: string[];
  matchedSkills: string[];
}) {
  const reasons: string[] = [];

  matchedSkills.slice(0, 3).forEach((skill) => {
    reasons.push(`Your ${skill} experience matches.`);
  });

  matchedRequired.slice(0, 2).forEach((skill) => {
    reasons.push(`Required ${titleCase(skill)} found.`);
  });

  if (experienceScore >= 80) {
    reasons.push("Experience requirement satisfied.");
  }

  if (jobTitleScore >= 70) {
    reasons.push("Your current title aligns with this role.");
  }

  if (locationScore >= 80) {
    reasons.push(`${job.workMode} preference aligns with this role.`);
  }

  return unique(reasons).slice(0, 6);
}

function titleCase(value: string) {
  return value.replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

function unique(items: string[]) {
  return [...new Set(items.filter(Boolean))];
}

function clamp(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)));
}
