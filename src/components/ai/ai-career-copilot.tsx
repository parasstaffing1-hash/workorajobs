"use client";

import {
  BellRing,
  Bot,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Gauge,
  GraduationCap,
  Mail,
  Radar,
  RefreshCw,
  Save,
  Search,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  careerCopilotFeatures,
  companyIntelligence,
  jobSources,
  type CompanyIntel,
} from "@/data/career-copilot";
import { jobs, type Job } from "@/data/jobs";
import { cn } from "@/lib/utils";

type CandidateProfile = {
  targetRole: string;
  skills: string;
  resumeText: string;
  preferredLocations: string;
  salaryExpectation: string;
  experienceYears: string;
  remotePreference: "Remote" | "Hybrid" | "On-site" | "Any";
  visaSponsorship: "Required" | "Preferred" | "Not needed";
  careerGoal: string;
};

type JobMatch = {
  job: Job;
  company: CompanyIntel;
  matchScore: number;
  skillScore: number;
  experienceScore: number;
  salaryScore: number;
  locationScore: number;
  visaScore: number;
  remoteScore: number;
  industryScore: number;
  missingSkills: string[];
  improvements: string[];
  interviewProbability: number;
  scamRisk: number;
};

const sampleProfile: CandidateProfile = {
  targetRole: "Senior Product Designer",
  skills:
    "Figma, UX research, design systems, accessibility, analytics dashboards, B2B SaaS, stakeholder management, prototyping",
  resumeText:
    "Senior Product Designer with 8 years of experience building enterprise SaaS hiring workflows. Led design systems, accessibility improvements, research programs and analytics dashboards for recruiting operations teams. Improved candidate task completion by 31%.",
  preferredLocations: "Remote, Europe, Canada",
  salaryExpectation: "130000",
  experienceYears: "8",
  remotePreference: "Remote",
  visaSponsorship: "Preferred",
  careerGoal:
    "Move into a design leadership role at a global AI hiring or workflow automation company.",
};

const preferredTerms = [
  "accessibility",
  "analytics dashboards",
  "automation",
  "b2b",
  "compliance",
  "data",
  "design systems",
  "distributed systems",
  "enterprise",
  "figma",
  "fintech",
  "global",
  "healthcare",
  "node.js",
  "operations",
  "payroll",
  "prototyping",
  "recruiting",
  "research",
  "saas",
  "sql",
  "stakeholder management",
  "ux research",
];

const stopWords = new Set([
  "and",
  "the",
  "for",
  "with",
  "from",
  "into",
  "this",
  "that",
  "role",
  "roles",
  "team",
  "teams",
  "work",
  "working",
  "years",
]);

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, Math.round(value)));
}

function tokenize(value: string) {
  return (
    value
      .toLowerCase()
      .match(/[a-z][a-z0-9+#.-]{1,}/g)
      ?.filter((term) => !stopWords.has(term)) ?? []
  );
}

function unique(items: string[], limit = 20) {
  return [...new Set(items.filter(Boolean))].slice(0, limit);
}

function profileTerms(profile: CandidateProfile) {
  const source =
    `${profile.targetRole} ${profile.skills} ${profile.resumeText} ${profile.careerGoal}`.toLowerCase();
  const phrases = preferredTerms.filter((term) => source.includes(term));
  return unique([...phrases, ...tokenize(source)], 28);
}

function jobTerms(job: Job) {
  return unique(
    [
      job.title,
      job.company,
      job.location,
      job.department,
      job.type,
      ...job.tags,
    ].flatMap(tokenize),
    24,
  );
}

function annualSalaryMidpoint(salary: string) {
  const matches = [...salary.matchAll(/\$(\d{2,3})(?:k)?/gi)].map((match) =>
    Number(match[1]),
  );

  if (!matches.length) return 0;

  const midpoint =
    matches.reduce((total, value) => total + value, 0) / matches.length;

  if (salary.toLowerCase().includes("/hr")) {
    return midpoint * 2080;
  }

  return midpoint * 1000;
}

function salaryExpectation(value: string) {
  const numeric = Number(value.replace(/[^0-9]/g, ""));
  return numeric > 0 ? numeric : 120000;
}

function overlapScore(a: string[], b: string[]) {
  if (!b.length) return 68;
  const aSet = new Set(a);
  const matched = b.filter((term) => aSet.has(term)).length;
  return clamp((matched / b.length) * 100 + 24);
}

function sentenceList(items: string[], fallback: string) {
  if (!items.length) return fallback;
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function companyFor(job: Job) {
  return (
    companyIntelligence.find((company) => company.company === job.company) ??
    companyIntelligence[0]
  );
}

function analyzeJob(profile: CandidateProfile, job: Job): JobMatch {
  const candidateTerms = profileTerms(profile);
  const termsForJob = jobTerms(job);
  const company = companyFor(job);
  const expectedSalary = salaryExpectation(profile.salaryExpectation);
  const jobSalary = annualSalaryMidpoint(job.salary);
  const locationText =
    `${profile.preferredLocations} ${profile.remotePreference}`.toLowerCase();
  const jobLocationText = `${job.location} ${job.type}`.toLowerCase();
  const skillScore = overlapScore(candidateTerms, termsForJob);
  const salaryScore = jobSalary
    ? clamp(100 - Math.abs(expectedSalary - jobSalary) / 1700, 35, 98)
    : 62;
  const remoteScore =
    profile.remotePreference === "Any"
      ? 92
      : jobLocationText.includes(profile.remotePreference.toLowerCase())
        ? 96
        : jobLocationText.includes("remote") &&
            profile.remotePreference !== "On-site"
          ? 90
          : 58;
  const locationScore = profile.preferredLocations
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
    .some((location) => jobLocationText.includes(location))
    ? 95
    : jobLocationText.includes("remote") && locationText.includes("remote")
      ? 90
      : 60;
  const experienceYears = Number(profile.experienceYears) || 4;
  const seniorRole = /senior|staff|lead|principal/i.test(job.title);
  const experienceScore = seniorRole
    ? clamp(experienceYears * 11 + 14, 45, 96)
    : clamp(82 + experienceYears * 2, 50, 98);
  const visaScore =
    profile.visaSponsorship === "Required"
      ? job.location.toLowerCase().includes("remote")
        ? 78
        : 58
      : profile.visaSponsorship === "Preferred"
        ? 82
        : 94;
  const industryScore = overlapScore(
    candidateTerms,
    tokenize(
      `${job.department} ${job.tags.join(" ")} ${company.techStack.join(" ")}`,
    ),
  );
  const matchScore = clamp(
    skillScore * 0.32 +
      experienceScore * 0.16 +
      salaryScore * 0.14 +
      locationScore * 0.12 +
      visaScore * 0.08 +
      remoteScore * 0.1 +
      industryScore * 0.08,
  );
  const missingSkills = termsForJob
    .filter((term) => !candidateTerms.includes(term) && term.length > 3)
    .slice(0, 5);
  const improvements = [
    missingSkills.length
      ? `Add stronger evidence for ${sentenceList(missingSkills.slice(0, 3), "role keywords")}.`
      : "Keep the resume focused on measurable achievements.",
    `Tailor the summary toward ${job.department.toLowerCase()} impact at ${job.company}.`,
    "Add a short proof point for scope, ownership and business outcome.",
  ];
  const scamRisk = clamp(
    company.scamProbability + (jobSalary ? 0 : 14),
    1,
    100,
  );

  return {
    job,
    company,
    matchScore,
    skillScore,
    experienceScore,
    salaryScore,
    locationScore,
    visaScore,
    remoteScore,
    industryScore,
    missingSkills,
    improvements,
    interviewProbability: clamp(matchScore * 0.72 + skillScore * 0.18),
    scamRisk,
  };
}

function resumeAnalysis(profile: CandidateProfile, topMatch: JobMatch) {
  const terms = profileTerms(profile);
  const hasMetrics = /\b\d+%|\b\d+x|\$\d+|\b\d{2,}\b/.test(profile.resumeText);
  const keywordScore = overlapScore(terms, jobTerms(topMatch.job));
  const atsScore = clamp(keywordScore * 0.54 + (hasMetrics ? 28 : 12) + 14);
  const impactScore = hasMetrics ? 91 : 67;

  return {
    atsScore,
    impactScore,
    keywords: terms.slice(0, 10),
    gaps: topMatch.missingSkills,
    suggestions: [
      "Mirror the target job title in the resume headline when the experience is accurate.",
      hasMetrics
        ? "Keep quantified outcomes near the top of each role."
        : "Add metrics such as revenue, time saved, conversion lift or team scale.",
      `Add a tailored skills block for ${sentenceList(topMatch.missingSkills.slice(0, 3), "the target role")}.`,
    ],
  };
}

function salaryRange(profile: CandidateProfile, topMatch: JobMatch) {
  const expected = salaryExpectation(profile.salaryExpectation);
  const market = annualSalaryMidpoint(topMatch.job.salary) || expected;
  const low = Math.round(Math.min(expected, market) * 0.94);
  const high = Math.round(Math.max(expected, market) * 1.12);

  return {
    low,
    high,
    note:
      expected > market
        ? "Your expectation is above this role midpoint. Lead with impact evidence and scope."
        : "Your expectation is within the visible market band. Preserve negotiation room.",
  };
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

function ScoreBar({
  label,
  value,
  tone = "primary",
}: {
  label: string;
  value: number;
  tone?: "primary" | "accent" | "violet";
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{value}%</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full",
            tone === "accent"
              ? "bg-accent"
              : tone === "violet"
                ? "bg-[hsl(var(--violet))]"
                : "bg-primary",
          )}
          style={{ width: `${clamp(value)}%` }}
        />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <Card className="p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p>
    </Card>
  );
}

export function AiCareerCopilot() {
  const [profile, setProfile] = useState<CandidateProfile>(sampleProfile);
  const [message, setMessage] = useState("Career Copilot loaded locally.");

  const matches = useMemo(
    () =>
      jobs
        .map((job) => analyzeJob(profile, job))
        .sort((a, b) => b.matchScore - a.matchScore),
    [profile],
  );
  const topMatch = matches[0];
  const resume = useMemo(
    () => resumeAnalysis(profile, topMatch),
    [profile, topMatch],
  );
  const salary = useMemo(
    () => salaryRange(profile, topMatch),
    [profile, topMatch],
  );
  const savedMemory = {
    careerGoal: profile.careerGoal,
    preferredLocations: profile.preferredLocations,
    preferredSalary: profile.salaryExpectation,
    remotePreference: profile.remotePreference,
    targetRole: profile.targetRole,
    visaSponsorship: profile.visaSponsorship,
  };
  const roadmap = unique(
    [
      ...topMatch.missingSkills,
      "portfolio proof",
      "interview stories",
      "salary narrative",
      "company research",
    ],
    5,
  );

  function updateProfile<K extends keyof CandidateProfile>(
    key: K,
    value: CandidateProfile[K],
  ) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  function resetSample() {
    setProfile(sampleProfile);
    setMessage("Sample candidate profile restored.");
  }

  function saveMemory() {
    window.localStorage.setItem(
      "workora-career-copilot-memory",
      JSON.stringify(savedMemory),
    );
    setMessage("Personal AI memory saved locally in this browser.");
  }

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden p-0">
        <div className="grid gap-0 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="p-5 sm:p-8">
            <Badge>AI Career Copilot</Badge>
            <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
              Your browser-local career command center.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              Discover jobs, score fit, improve your resume, prepare for
              interviews, inspect companies and save preference memory without
              sending data to an external AI API.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <StatCard
                detail="Demo roles scored with skill, salary, location and visa signals."
                label="Jobs ranked"
                value={`${matches.length}`}
              />
              <StatCard
                detail={`Top recommendation: ${topMatch.job.company}.`}
                label="Best match"
                value={`${topMatch.matchScore}%`}
              />
              <StatCard
                detail="Estimated from target role, resume text and job keywords."
                label="Resume score"
                value={`${resume.atsScore}%`}
              />
            </div>
          </div>
          <div className="border-t border-border/70 bg-[hsl(var(--navy))] p-5 text-white sm:p-8 lg:border-l lg:border-t-0">
            <div className="flex items-center gap-3">
              <div className="animated-sheen grid h-12 w-12 place-items-center rounded-lg bg-white/10">
                <Bot aria-hidden="true" className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">AI assistant sidebar</p>
                <p className="text-sm text-white/60">
                  Personalized plan generated locally.
                </p>
              </div>
            </div>
            <div className="mt-8 space-y-4">
              {[
                `Apply first to ${topMatch.job.company} if the role matches your current availability.`,
                `Improve resume evidence for ${sentenceList(topMatch.missingSkills.slice(0, 3), "the missing job keywords")}.`,
                `Prepare STAR stories around ${sentenceList(roadmap.slice(0, 3), "your highest-value gaps")}.`,
              ].map((item) => (
                <div
                  className="rounded-lg border border-white/10 bg-white/[0.06] p-4"
                  key={item}
                >
                  <p className="text-white/78 text-sm leading-6">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-lg border border-white/10 bg-white/[0.06] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                Status
              </p>
              <p className="mt-3 text-sm leading-6 text-white/75">
                Browser-local intelligence is active. Live crawling, embeddings,
                auth memory and one-click apply need backend credentials and
                provider approvals.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
        <Card className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Badge>Profile memory</Badge>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight">
                Personalize the Copilot.
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                These fields power recommendations and can be saved locally as a
                future authenticated-memory contract.
              </p>
            </div>
            <Button
              onClick={resetSample}
              size="sm"
              type="button"
              variant="outline"
            >
              <RefreshCw aria-hidden="true" className="h-4 w-4" />
              Reset
            </Button>
          </div>
          <div className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm font-medium">
              Target role
              <Input
                value={profile.targetRole}
                onChange={(event) =>
                  updateProfile("targetRole", event.target.value)
                }
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Skills
              <Textarea
                className="min-h-24"
                value={profile.skills}
                onChange={(event) =>
                  updateProfile("skills", event.target.value)
                }
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Resume snapshot
              <Textarea
                className="min-h-32"
                value={profile.resumeText}
                onChange={(event) =>
                  updateProfile("resumeText", event.target.value)
                }
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                Preferred locations
                <Input
                  value={profile.preferredLocations}
                  onChange={(event) =>
                    updateProfile("preferredLocations", event.target.value)
                  }
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Salary expectation
                <Input
                  inputMode="numeric"
                  value={profile.salaryExpectation}
                  onChange={(event) =>
                    updateProfile("salaryExpectation", event.target.value)
                  }
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Years of experience
                <Input
                  inputMode="numeric"
                  value={profile.experienceYears}
                  onChange={(event) =>
                    updateProfile("experienceYears", event.target.value)
                  }
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Remote preference
                <Select
                  value={profile.remotePreference}
                  onChange={(event) =>
                    updateProfile(
                      "remotePreference",
                      event.target
                        .value as CandidateProfile["remotePreference"],
                    )
                  }
                >
                  <option>Remote</option>
                  <option>Hybrid</option>
                  <option>On-site</option>
                  <option>Any</option>
                </Select>
              </label>
              <label className="grid gap-2 text-sm font-medium sm:col-span-2">
                Visa sponsorship
                <Select
                  value={profile.visaSponsorship}
                  onChange={(event) =>
                    updateProfile(
                      "visaSponsorship",
                      event.target.value as CandidateProfile["visaSponsorship"],
                    )
                  }
                >
                  <option>Required</option>
                  <option>Preferred</option>
                  <option>Not needed</option>
                </Select>
              </label>
            </div>
            <label className="grid gap-2 text-sm font-medium">
              Career goal
              <Textarea
                className="min-h-24"
                value={profile.careerGoal}
                onChange={(event) =>
                  updateProfile("careerGoal", event.target.value)
                }
              />
            </label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button onClick={saveMemory} type="button" variant="accent">
                <Save aria-hidden="true" className="h-4 w-4" />
                Save AI memory
              </Button>
              <div
                className="rounded-md border border-primary/20 bg-primary/10 px-3 py-2 text-sm text-primary"
                role="status"
              >
                {message}
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Badge>AI job match engine</Badge>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight">
                  Ranked opportunities.
                </h2>
              </div>
              <Search aria-hidden="true" className="h-5 w-5 text-primary" />
            </div>
            <div className="mt-6 space-y-4">
              {matches.slice(0, 4).map((match) => (
                <div
                  className="rounded-lg border border-border/70 bg-background/70 p-4"
                  key={match.job.id}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold">
                          {match.job.title}
                        </h3>
                        <Badge>{match.matchScore}% match</Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {match.job.company} - {match.job.location} -{" "}
                        {match.job.salary}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {match.job.tags.map((tag) => (
                          <span
                            className="rounded-md border border-border/70 bg-card/70 px-2.5 py-1 text-xs font-medium text-muted-foreground"
                            key={tag}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="grid min-w-36 gap-1 text-sm">
                      <span className="text-muted-foreground">
                        Interview probability
                      </span>
                      <span className="text-2xl font-semibold">
                        {match.interviewProbability}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    <ScoreBar label="Skill" value={match.skillScore} />
                    <ScoreBar
                      label="Salary"
                      value={match.salaryScore}
                      tone="accent"
                    />
                    <ScoreBar label="Location" value={match.locationScore} />
                    <ScoreBar
                      label="Visa"
                      value={match.visaScore}
                      tone="violet"
                    />
                  </div>
                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-semibold">Missing skills</p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {sentenceList(
                          match.missingSkills,
                          "No major gaps found",
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Resume action</p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {match.improvements[0]}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-5">
              <div className="flex items-center gap-3">
                <Gauge aria-hidden="true" className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">Resume intelligence</h2>
              </div>
              <div className="mt-5 space-y-4">
                <ScoreBar label="ATS compatibility" value={resume.atsScore} />
                <ScoreBar
                  label="Impact evidence"
                  value={resume.impactScore}
                  tone="accent"
                />
                <div>
                  <p className="text-sm font-semibold">Keyword matches</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {resume.keywords.slice(0, 8).map((term) => (
                      <span
                        className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                        key={term}
                      >
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
                <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
                  {resume.suggestions.map((item) => (
                    <li className="flex gap-2" key={item}>
                      <CheckCircle2
                        aria-hidden="true"
                        className="mt-1 h-4 w-4 shrink-0 text-primary"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-3">
                <WalletCards
                  aria-hidden="true"
                  className="h-5 w-5 text-accent"
                />
                <h2 className="font-semibold">Salary analyzer</h2>
              </div>
              <p className="mt-5 text-3xl font-semibold tracking-tight">
                {formatCurrency(salary.low)} - {formatCurrency(salary.high)}
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {salary.note}
              </p>
              <div className="mt-6 space-y-3">
                <ScoreBar
                  label="Market demand"
                  value={topMatch.industryScore}
                  tone="violet"
                />
                <ScoreBar
                  label="Offer probability"
                  value={topMatch.interviewProbability}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="p-5 sm:p-6 xl:col-span-2">
          <div className="flex items-center gap-3">
            <Building2 aria-hidden="true" className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold tracking-tight">
              Company intelligence
            </h2>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {matches.slice(0, 4).map((match) => (
              <div
                className="rounded-lg border border-border/70 bg-background/70 p-4"
                key={match.company.company}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{match.company.company}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {match.company.summary}
                    </p>
                  </div>
                  <Badge>{match.company.rating}/5</Badge>
                </div>
                <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                  <p>Hiring trend: {match.company.hiringTrend}</p>
                  <p>
                    Interview difficulty: {match.company.interviewDifficulty}
                  </p>
                  <p>Layoff signal: {match.company.layoffHistory}</p>
                  <p>Scam probability: {match.scamRisk}%</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {match.company.techStack.slice(0, 4).map((item) => (
                    <span
                      className="rounded-md border border-border/70 bg-card/70 px-2.5 py-1 text-xs font-medium text-muted-foreground"
                      key={item}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <ShieldAlert aria-hidden="true" className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-semibold tracking-tight">
              Scam detection
            </h2>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Local screening checks company confidence, salary realism, duplicate
            style signals and missing metadata.
          </p>
          <div className="mt-6 space-y-4">
            {matches.slice(0, 3).map((match) => (
              <div key={match.job.id}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium">{match.job.company}</span>
                  <span className="text-muted-foreground">
                    {match.scamRisk}% risk
                  </span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${match.scamRisk}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <GraduationCap
              aria-hidden="true"
              className="h-5 w-5 text-primary"
            />
            <h2 className="text-xl font-semibold tracking-tight">
              Career coach
            </h2>
          </div>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-muted-foreground">
            {roadmap.map((item, index) => (
              <li className="flex gap-3" key={item}>
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-primary/10 text-xs font-semibold text-primary">
                  {index + 1}
                </span>
                <span>
                  Build proof around {item} for the next 30 days and add one
                  measurable resume bullet.
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <BriefcaseBusiness
              aria-hidden="true"
              className="h-5 w-5 text-primary"
            />
            <h2 className="text-xl font-semibold tracking-tight">
              Interview assistant
            </h2>
          </div>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-muted-foreground">
            {[
              `Tell me about a time you delivered ${topMatch.job.department.toLowerCase()} impact at enterprise scale.`,
              `What would you improve in ${topMatch.job.company}'s hiring or product workflow?`,
              `Use STAR to explain your strongest evidence for ${sentenceList(resume.keywords.slice(0, 2), "the role")}.`,
            ].map((item) => (
              <li className="flex gap-2" key={item}>
                <Sparkles
                  aria-hidden="true"
                  className="mt-1 h-4 w-4 shrink-0 text-primary"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <BellRing aria-hidden="true" className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-semibold tracking-tight">
              Smart notifications
            </h2>
          </div>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-muted-foreground">
            {[
              `New ${profile.targetRole} jobs above 80% match.`,
              `Application deadline approaching for ${topMatch.job.company}.`,
              "Resume score changed after keyword updates.",
              "Recruiter outreach draft ready for top-matched company.",
            ].map((item) => (
              <li className="flex gap-2" key={item}>
                <Mail
                  aria-hidden="true"
                  className="mt-1 h-4 w-4 shrink-0 text-primary"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <Radar aria-hidden="true" className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold tracking-tight">
              Job discovery connectors
            </h2>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {jobSources.map((source) => (
              <div
                className="rounded-lg border border-border/70 bg-background/70 p-4"
                key={source.name}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{source.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {source.category}
                    </p>
                  </div>
                  <Badge>{source.status}</Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {source.coverage}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <TrendingUp aria-hidden="true" className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-semibold tracking-tight">
              Production roadmap status
            </h2>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {careerCopilotFeatures.map((feature) => (
              <div
                className="rounded-lg border border-border/70 bg-background/70 p-4"
                key={feature.title}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold">{feature.title}</h3>
                  <Badge>{feature.status}</Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
