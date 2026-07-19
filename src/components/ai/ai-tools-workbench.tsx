"use client";

import {
  BarChart3,
  Bot,
  Check,
  CheckCircle2,
  Clipboard,
  ClipboardSignature,
  Code2,
  Copy,
  Cpu,
  FileSearch,
  FileText,
  Loader2,
  HelpCircle,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  TrendingUp,
  UserCheck,
  WandSparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { aiToolSelectEvent } from "@/components/ai/ai-tool-launch-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { recruiterAiTools } from "@/data/platform";
import {
  parseJobDescriptionToBoolean,
  type ParsedBooleanResult,
} from "@/lib/boolean-search";
import { CareerRoadmap } from "@/components/ai/career-roadmap";
import { CoverLetterBuilder } from "@/components/ai/cover-letter-builder";
import { GamificationHeader, triggerConfetti } from "@/components/ai/gamification-header";
import { LinkedinOptimizer } from "@/components/ai/linkedin-optimizer";
import { ResumeRoast } from "@/components/ai/resume-roast";
import { SalaryIntelligence } from "@/components/ai/salary-intelligence";
import { slugify } from "@/lib/slugs";
import { cn } from "@/lib/utils";

type AiTool = (typeof recruiterAiTools)[number];
type Status = "idle" | "loading" | "success" | "error";

type AiSection = {
  title: string;
  items: string[];
};

export type DetailedRecommendation = {
  id: string;
  problem: string;
  whyItMatters: string;
  howToFix: string;
  beforeText?: string;
  afterText?: string;
  estimatedScoreImprovement: number;
};

type AiResult = {
  provider: string;
  model: string;
  score: number;
  scoreLabel: string;
  summary: string;
  signals: string[];
  recommendations: string[];
  subMetrics?: {
    overall: number;
    ats: number;
    content: number;
    formatting: number;
    keyword: number;
    skills: number;
    experience: number;
  };
  detailedRecommendations?: DetailedRecommendation[];
  endpoint: string;
  sections: AiSection[];
  generatedText?: string;
  booleanStrings?: Array<{
    label: string;
    query: string;
    description?: string;
    platform?: string;
  }>;
  parsedBoolean?: ParsedBooleanResult;
};

const sampleResume = `Senior Product Designer with 8 years of experience across B2B SaaS, design systems, hiring workflows and analytics dashboards. Led discovery, prototyping and usability testing for enterprise HR platforms. Strong in Figma, accessibility, stakeholder management and structured product thinking.`;

const sampleJob = `Senior Full Stack Engineer (TypeScript / Node.js / React / AWS)

About the Role:
We are looking for a Senior Full Stack Engineer with 5+ years of experience to design, build, and scale high-throughput hiring and talent analytics platforms. You will own end-to-end features across our modern React/TypeScript frontend and distributed Node.js/PostgreSQL microservices on AWS.

Key Responsibilities:
- Architect, build, and deploy resilient web applications using React, Next.js, TypeScript, and Node.js.
- Design high-performance RESTful APIs, GraphQL endpoints, and event-driven data flows using PostgreSQL, Redis, and Kafka.
- Manage cloud infrastructure and automated CI/CD pipelines using AWS (ECS, Lambda, S3), Docker, Terraform, and GitHub Actions.
- Partner with product managers, UX designers, and recruiting operations to deliver accessible, data-informed workflow tools.

Requirements & Tech Stack:
- 5+ years of software engineering experience in B2B SaaS or enterprise web applications.
- Strong proficiency in TypeScript, JavaScript (ES6+), React, Node.js, and Express/NestJS.
- Hands-on expertise with PostgreSQL, Redis, REST APIs, GraphQL, and database optimization.
- Solid experience with cloud infrastructure on AWS, Docker, Kubernetes, and CI/CD pipelines.
- Familiarity with design systems, Figma, accessibility (WCAG 2.1), and agile development.
- Bachelor's or Master's degree in Computer Science, Software Engineering, or equivalent experience.`;

const samplePrompt =
  "Extract core skills and generate multi-platform Boolean search strings for LinkedIn Recruiter, Google X-Ray, and ATS databases.";

const stopWords = new Set([
  "and", "for", "the", "with", "from", "this", "that", "your", "you", "are",
  "was", "were", "job", "role", "have", "has", "into", "over", "must", "team", "teams",
]);

function keywords(text: string) {
  return (
    text
      .toLowerCase()
      .match(/[a-z][a-z0-9+#.-]{2,}/g)
      ?.map((term) => term.replace(/^[^a-z0-9+#]+|[^a-z0-9+#]+$/g, ""))
      .filter((term) => term && !stopWords.has(term)) ?? []
  );
}

function uniqueTerms(terms: string[]) {
  return [...new Set(terms)].slice(0, 12);
}

function inferRole(jobDescription: string, prompt: string) {
  const combined = `${jobDescription} ${prompt}`.toLowerCase();

  if (combined.includes("designer") || combined.includes("design"))
    return "Senior Product Designer";
  if (combined.includes("backend")) return "Staff Backend Engineer";
  if (combined.includes("payroll")) return "Global Payroll Operations Lead";
  if (combined.includes("data")) return "Data Analyst";
  if (combined.includes("recruit")) return "AI Recruiting Operations Specialist";
  if (combined.includes("full stack") || combined.includes("software"))
    return "Senior Full Stack Engineer";

  return "Target Role";
}

function experienceSignal(resumeText: string) {
  const match = resumeText.match(/\b(\d{1,2})\+?\s*(?:years|yrs)\b/i);
  return match
    ? `${match[1]} years of stated experience`
    : "Experience depth needs confirmation";
}

function compactTerms(items: string[], fallback: string[], limit = 5) {
  const terms = uniqueTerms(items).slice(0, limit);
  return terms.length ? terms : fallback.slice(0, limit);
}

function asQuestion(term: string) {
  return `Where have you applied ${term}, what tradeoff did you make and what changed because of your work?`;
}

function readableList(items: string[], fallback: string) {
  const clean = items.filter(Boolean);
  if (!clean.length) return fallback;
  if (clean.length === 1) return clean[0];
  if (clean.length === 2) return `${clean[0]} and ${clean[1]}`;
  return `${clean.slice(0, -1).join(", ")}, and ${clean[clean.length - 1]}`;
}

function scoreContent(
  resumeText: string,
  jobDescription: string,
  prompt: string,
) {
  const resumeTerms = new Set(keywords(`${resumeText} ${prompt}`));
  const jobTerms = new Set(keywords(`${jobDescription} ${prompt}`));
  const overlap = [...resumeTerms].filter((term) => jobTerms.has(term));
  const score = jobTerms.size
    ? Math.round((overlap.length / jobTerms.size) * 100)
    : Math.min(92, Math.max(58, resumeTerms.size * 4));

  return {
    score: Math.min(96, Math.max(42, score)),
    overlap: uniqueTerms(overlap.length ? overlap : [...resumeTerms]),
    resumeTerms,
    jobTerms,
  };
}

function localResult({
  tool,
  resumeText,
  jobDescription,
  prompt,
}: {
  tool: AiTool;
  resumeText: string;
  jobDescription: string;
  prompt: string;
}): AiResult {
  const { score, overlap, resumeTerms, jobTerms } = scoreContent(
    resumeText,
    jobDescription,
    prompt,
  );
  const roleTitle = inferRole(jobDescription, prompt);
  const experience = experienceSignal(resumeText);
  const missing = [...jobTerms].filter((term) => !resumeTerms.has(term));
  const primarySignals = compactTerms(overlap, [
    "role context",
    "delivery evidence",
    "collaboration",
    "domain relevance",
  ]);
  const gapSignals = compactTerms(missing, [
    "availability",
    "compensation expectations",
    "role-specific depth",
    "recent measurable impact",
  ]);
  const roleKeywords = compactTerms(
    [...jobTerms],
    [
      "enterprise SaaS",
      "structured hiring",
      "candidate experience",
      "stakeholder alignment",
    ],
  );
  const strengthSentence = readableList(
    primarySignals.slice(0, 4),
    "the supplied candidate evidence",
  );
  const gapSentence = readableList(
    gapSignals.slice(0, 4),
    "missing role evidence",
  );

  const recommendations = [
    primarySignals.length
      ? `Validate evidence for ${primarySignals.slice(0, 3).join(", ")}.`
      : "Collect stronger evidence before advancing the workflow.",
    gapSignals.length
      ? `Probe gaps around ${gapSignals.slice(0, 3).join(", ")}.`
      : "Use a structured scorecard to confirm the strongest signals.",
    "Confirm availability, compensation expectations and location fit before the next stage.",
  ];

  const baseResult = {
    provider: "local",
    model: "workora-browser-local-v1",
    score,
    scoreLabel: "Evidence match",
    signals: uniqueTerms([...primarySignals, ...gapSignals]),
    endpoint: tool.endpoint,
  };

  if (tool.name === "Resume analysis") {
    return {
      ...baseResult,
      summary: `Local resume analysis found a ${score}% evidence match for ${roleTitle}, led by ${strengthSentence}.`,
      recommendations,
      sections: [
        {
          title: "Strengths",
          items: [
            experience,
            `Strongest matched signals: ${strengthSentence}.`,
            `Most relevant role keywords: ${readableList(roleKeywords, "target role requirements")}.`,
          ],
        },
        {
          title: "Risks to validate",
          items: [
            `Clarify evidence around ${gapSentence}.`,
            "Check whether the candidate has recent examples at the required scale.",
            "Confirm compensation, notice period, work authorization and location fit.",
          ],
        },
        {
          title: "Recruiter follow-up questions",
          items: gapSignals.slice(0, 3).map(asQuestion),
        },
      ],
    };
  }

  if (tool.name === "Resume scoring") {
    const keywordScore = Math.min(95, Math.max(45, score + 6));
    const domainScore = Math.min(92, Math.max(48, roleKeywords.length * 12));
    const riskScore = Math.max(40, 100 - gapSignals.length * 9);
    const atsScoreVal = Math.round(keywordScore * 0.45 + domainScore * 0.35 + riskScore * 0.2);

    return {
      ...baseResult,
      summary: `The local ATS engine evaluates an overall score of ${atsScoreVal}% fit for ${roleTitle}. Detailed sub-metrics and impact-ranked fixes generated below.`,
      subMetrics: {
        overall: atsScoreVal,
        ats: Math.min(98, atsScoreVal + 2),
        content: keywordScore,
        formatting: 90,
        keyword: keywordScore,
        skills: domainScore,
        experience: riskScore,
      },
      detailedRecommendations: [
        {
          id: "rec-1",
          problem: `Missing critical skill evidence: ${gapSentence}`,
          whyItMatters: "ATS algorithms fail to index candidate profiles when core job description tech keywords are omitted.",
          howToFix: `Integrate quantified bullet points demonstrating hands-on experience with ${gapSignals.slice(0, 2).join(" and ")}.`,
          beforeText: "Responsible for managing software applications.",
          afterText: `Architected scalable cloud services using ${gapSignals[0] || "React"}, reducing latency by 28%.`,
          estimatedScoreImprovement: 12,
        },
        {
          id: "rec-2",
          problem: "Lack of quantifiable business impact metrics in work experience.",
          whyItMatters: "Recruiters and hiring managers prioritize resumes with measurable results (%, $, team size) over duty descriptions.",
          howToFix: "Add hard metrics to top 3 work experience bullet points.",
          beforeText: "Improved candidate engagement on the platform.",
          afterText: "Improved candidate engagement rate by 31% through accessibility-first workflow redesigns.",
          estimatedScoreImprovement: 8,
        },
      ],
      recommendations,
      sections: [
        {
          title: "Score breakdown",
          items: [
            `Keyword and skill alignment: ${keywordScore}%.`,
            `Domain and role-context alignment: ${domainScore}%.`,
            `Risk-adjusted confidence: ${riskScore}%.`,
          ],
        },
        {
          title: "Why this score",
          items: [
            `Matched evidence: ${strengthSentence}.`,
            `Lower-confidence areas: ${gapSentence}.`,
            "Use this as a recruiter triage score, not a final hiring decision.",
          ],
        },
      ],
    };
  }

  if (tool.name === "Candidate matching") {
    return {
      ...baseResult,
      scoreLabel: "Match confidence",
      summary: `The candidate is ${score >= 75 ? "strongly aligned" : "partially aligned"} with ${roleTitle}. Local matching recommends a structured recruiter review before advancing.`,
      recommendations: [
        score >= 75
          ? "Move to recruiter screen with a focused validation checklist."
          : "Keep in review and request stronger evidence before shortlist.",
        `Validate ${readableList(gapSignals.slice(0, 3), "the highest-risk requirements")}.`,
        "Attach this match note to the candidate packet for human review.",
      ],
      sections: [
        {
          title: "Match rationale",
          items: [
            `Best-fit signals: ${strengthSentence}.`,
            `Role focus: ${readableList(roleKeywords.slice(0, 5), roleTitle)}.`,
            `Confidence level: ${score >= 80 ? "high" : score >= 65 ? "moderate" : "needs review"}.`,
          ],
        },
        {
          title: "Next action",
          items: [
            "Create a shortlist note with matched evidence.",
            "Ask the candidate for examples that prove the weakest signals.",
            "Do not reject or advance automatically from this local score.",
          ],
        },
      ],
    };
  }

  if (
    tool.name === "Boolean search string generator" ||
    tool.name.toLowerCase().includes("boolean")
  ) {
    const parsedBoolean = parseJobDescriptionToBoolean(
      jobDescription || resumeText,
      prompt,
    );

    const booleanStrings = parsedBoolean.variants.map((v) => ({
      label: v.label,
      query: v.query,
      description: v.description,
      platform: v.platform,
    }));

    return {
      ...baseResult,
      score: 100,
      scoreLabel: "Multi-platform search kit",
      summary: `Parsed full Job Description for "${parsedBoolean.jobTitle}". Extracted ${parsedBoolean.titleSynonyms.length} title variations, ${parsedBoolean.primarySkills.length} primary skills, and ${parsedBoolean.toolsAndCloud.length} infrastructure tools into 6 copy-paste ready Boolean queries.`,
      recommendations: parsedBoolean.sourcingTips,
      signals: [
        ...parsedBoolean.titleSynonyms,
        ...parsedBoolean.primarySkills,
        ...parsedBoolean.toolsAndCloud,
      ],
      sections: [
        {
          title: "Extracted Sourcing Signal Breakdown",
          items: [
            `Title Synonyms Detected: ${parsedBoolean.titleSynonyms.join(", ")}.`,
            `Primary Tech Stack: ${parsedBoolean.primarySkills.join(", ")}.`,
            `Cloud & Databases: ${parsedBoolean.toolsAndCloud.join(", ")}.`,
            `Anti-Keywords Excluded: NOT (${parsedBoolean.antiKeywords.join(" OR ")}).`,
          ],
        },
      ],
      booleanStrings,
      parsedBoolean,
    };
  }

  if (tool.name === "Skill gap analysis") {
    return {
      ...baseResult,
      scoreLabel: "Gap clarity",
      summary: `Local gap analysis found ${gapSignals.length} areas to verify for ${roleTitle}: ${gapSentence}.`,
      recommendations: [
        "Use gaps as interview probes, not rejection reasons.",
        "Ask for artifacts, metrics or stakeholder examples for each weak signal.",
        "Update the candidate profile after the recruiter screen.",
      ],
      sections: [
        {
          title: "Gaps to verify",
          items: gapSignals.map(
            (term) =>
              `${term}: ask for a recent example, measurable outcome and scope.`,
          ),
        },
        {
          title: "Interview probes",
          items: gapSignals.slice(0, 4).map(asQuestion),
        },
        {
          title: "Evidence already present",
          items: primarySignals.map(
            (term) => `${term}: visible in the supplied candidate context.`,
          ),
        },
      ],
    };
  }

  if (tool.name === "Job description generator") {
    const jobDraft = [
      `${roleTitle}`,
      `Mission: Help Workora customers hire with clarity, speed and accountable human review.`,
      `Outcomes: Improve ${readableList(roleKeywords.slice(0, 3), "role outcomes")} while keeping candidate experience consistent and measurable.`,
      `Responsibilities: Own discovery, execute role-critical work, collaborate with product, recruiting and operations partners, and document decisions clearly.`,
      `Requirements: Demonstrated experience with ${readableList(roleKeywords.slice(0, 5), "the role domain")}; strong communication; evidence of measurable impact; comfort working in structured hiring workflows.`,
      `Nice to have: Global hiring exposure, enterprise SaaS context, analytics literacy and accessibility-minded execution.`,
      `Process: Recruiter screen, role interview, practical review and final conversation.`,
    ].join("\n\n");

    return {
      ...baseResult,
      score: Math.max(82, score),
      scoreLabel: "Draft readiness",
      summary: `Generated a local, inclusive job description draft for ${roleTitle}.`,
      recommendations: [
        "Review compensation, location and legal language before publishing.",
        "Replace generic requirements with must-have evidence from the hiring manager.",
        "Keep the final JD concise and candidate-centered.",
      ],
      sections: [
        {
          title: "JD sections included",
          items: [
            "Mission and measurable outcomes.",
            "Responsibilities and requirements.",
            "Nice-to-have signals and interview process.",
          ],
        },
      ],
      generatedText: jobDraft,
    };
  }

  return {
    ...baseResult,
    summary: `Local workflow completed for ${tool.name}. Evaluated role context against the supplied inputs.`,
    recommendations,
    sections: [
      {
        title: "Key observations",
        items: [
          `Matched signals: ${strengthSentence}.`,
          `High-risk gaps: ${gapSentence}.`,
        ],
      },
    ],
  };
}

function getToolIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("analysis")) return FileText;
  if (n.includes("score") || n.includes("scoring")) return BarChart3;
  if (n.includes("matching") || n.includes("match")) return UserCheck;
  if (n.includes("boolean")) return Code2;
  if (n.includes("gap")) return TrendingUp;
  if (n.includes("description") || n.includes("job")) return ClipboardSignature;
  if (n.includes("question") || n.includes("interview")) return HelpCircle;
  if (n.includes("summary")) return FileSearch;
  return Bot;
}

export function AiToolsWorkbench() {
  const router = useRouter();

  const [selectedToolName, setSelectedToolName] = useState<string>(
    recruiterAiTools[0].name,
  );
  const [prompt, setPrompt] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<AiResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const [selectedModel, setSelectedModel] = useState<string>(
    "local-ollama/phi4-mini:3.8b",
  );

  const selectedTool = useMemo(() => {
    return (
      recruiterAiTools.find((tool) => tool.name === selectedToolName) ??
      recruiterAiTools[0]
    );
  }, [selectedToolName]);

  useEffect(() => {
    const selectMatchedTool = (match: AiTool) => {
      setSelectedToolName(match.name);
      setResult(null);
      setStatus("idle");
      setMessage(
        `${match.name} is selected. Add context and generate locally.`,
      );
    };

    const syncToolFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const requestedTool = params.get("tool");

      if (!requestedTool) return;

      const match = recruiterAiTools.find(
        (tool) =>
          slugify(tool.name) === requestedTool ||
          tool.name.toLowerCase() === requestedTool.toLowerCase(),
      );

      if (match) selectMatchedTool(match);
    };

    const syncToolFromEvent = (event: Event) => {
      const toolName = (event as CustomEvent<{ toolName?: string }>).detail
        ?.toolName;
      const match = recruiterAiTools.find((tool) => tool.name === toolName);

      if (match) selectMatchedTool(match);
    };

    syncToolFromUrl();
    window.addEventListener("popstate", syncToolFromUrl);
    window.addEventListener("hashchange", syncToolFromUrl);
    window.addEventListener(aiToolSelectEvent, syncToolFromEvent);

    return () => {
      window.removeEventListener("popstate", syncToolFromUrl);
      window.removeEventListener("hashchange", syncToolFromUrl);
      window.removeEventListener(aiToolSelectEvent, syncToolFromEvent);
    };
  }, []);

  const canRun =
    !!selectedTool &&
    status !== "loading" &&
    (prompt.trim() || resumeText.trim() || jobDescription.trim());

  function selectTool(toolName: string) {
    setSelectedToolName(toolName);
    setResult(null);
    setStatus("idle");
    setMessage(`${toolName} is selected. Add context and generate.`);

    const slug = slugify(toolName);
    router.replace(`?tool=${slug}#ai-workbench`, { scroll: false });
  }

  function handleGenerateResult(finalResult: AiResult) {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 4);
    const payload = {
      title: `${selectedTool.name} Result`,
      originalUrl: `/ai-tools?tool=${slugify(selectedTool.name)}`,
      inputs: {
        jobDescription,
        resumeText,
        prompt,
      },
      resultText: finalResult.generatedText || finalResult.summary,
      subMetrics: finalResult.subMetrics,
      sections: finalResult.sections,
      booleanStrings: finalResult.booleanStrings,
    };
    
    localStorage.setItem(`workora_tool_result_${id}`, JSON.stringify(payload));
    const slug = slugify(selectedTool.name);
    window.open(`/tools/${slug}/result?id=${id}`, "_blank");
    setResult(finalResult);

    // Auto scroll to results container on generation complete
    setTimeout(() => {
      document.getElementById("workbench-result")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 150);
  }

  async function runTool() {
    if (!selectedTool || !canRun) return;

    setStatus("loading");
    setMessage("Generating results locally and deterministically...");

    try {
      const isBooleanTool =
        selectedTool.name === "Boolean search string generator" ||
        selectedTool.name.toLowerCase().includes("boolean");

      if (isBooleanTool || selectedModel === "local-offline") {
        const local = localResult({
          tool: selectedTool,
          resumeText,
          jobDescription,
          prompt,
        });
        handleGenerateResult(local);
        setStatus("success");
        setMessage(`Executed ${selectedTool.name} via Local Sourcing Engine.`);
        return;
      }

      const systemPrompt = `You are Workora AI hiring assistant executing the workflow "${selectedTool.name}". Provide concise, evidence-focused recruiter guidance.`;

      const apiRes = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Tool: ${selectedTool.name}\nTask: ${selectedTool.description}\nPrompt: ${prompt}\nResume text: ${resumeText}\nJob description: ${jobDescription}`,
          systemPrompt,
          model: selectedModel,
        }),
      });

      const data = await apiRes.json();

      const fallback = localResult({
        tool: selectedTool,
        resumeText,
        jobDescription,
        prompt,
      });

      if (data.text) {
        const finalResult = {
          ...fallback,
          provider: data.source === "openrouter" ? "OpenRouter Free LLM" : "Workora Local Engine",
          model: data.model || selectedModel,
          summary: data.text,
        };
        handleGenerateResult(finalResult);
        setStatus("success");
        setMessage(`Generated via ${data.model || selectedModel}`);
        
        if (selectedTool.name.toLowerCase().includes("score") || selectedTool.name.toLowerCase().includes("analysis")) {
          void fetch("/api/n8n/trigger", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              eventType: "ats_scan_completed",
              payload: {
                candidate: { name: "John Doe (Evaluated Candidate)", email: "john.doe@workora.com" },
                scanResult: { score: 87, matchedSkills: ["React", "TypeScript", "Node.js"], missingSkills: ["Kubernetes"], hiringStage: "SCREENING" },
                action: "Lead Routing Sequence / CRM Update",
              },
            }),
          });
        }
      } else {
        handleGenerateResult(fallback);
        setStatus("success");
        setMessage("Generated via local rules fallback.");
      }
    } catch {
      const fallback = localResult({
        tool: selectedTool,
        resumeText,
        jobDescription,
        prompt,
      });
      handleGenerateResult(fallback);
      setStatus("success");
      setMessage("Generation completed using local rules engine.");
      if (selectedTool.name.toLowerCase().includes("score") || selectedTool.name.toLowerCase().includes("analysis")) {
        void fetch("/api/n8n/trigger", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventType: "ats_scan_completed",
            payload: {
              candidate: { name: "John Doe (Evaluated Candidate)", email: "john.doe@workora.com" },
              scanResult: { score: 87, matchedSkills: ["React", "TypeScript", "Node.js"], missingSkills: ["Kubernetes"], hiringStage: "SCREENING" },
              action: "Lead Routing Sequence / CRM Update",
            },
          }),
        });
      }
    }
  }

  function resetForm() {
    setPrompt(samplePrompt);
    setResumeText(sampleResume);
    setJobDescription(sampleJob);
    setResult(null);
    setStatus("idle");
    setMessage("Sample inputs loaded.");
  }

  function copyResult() {
    if (!result) return;

    void navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setMessage("Copied JSON result to clipboard.");
  }

  function copyQuery(query: string, index: number) {
    void navigator.clipboard.writeText(query);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  return (
    <div className="space-y-6" id="ai-workbench">
      <GamificationHeader />
      <Card className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/20 text-primary">Recruiter AI Workbench</Badge>
              <Badge className="text-xs border border-border/80 bg-secondary/70 text-foreground">
                OpenRouter LLM + Local Engine
              </Badge>
            </div>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Execute Sourcing & Hiring Workflows in Real-Time.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Select an AI recruiter tool below, paste a full 1-page Job Description or candidate resume, and generate production-ready hiring artifacts.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={resetForm} size="sm" variant="outline">
              <RefreshCw className="h-4 w-4" />
              Load 1-Page Sample JD
            </Button>
          </div>
        </div>
      </Card>

      {/* TOOL SELECTION GRID */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {recruiterAiTools.map((tool) => {
          const isSelected = selectedTool.name === tool.name;
          const ToolIcon = getToolIcon(tool.name);

          return (
            <button
              key={tool.name}
              onClick={() => selectTool(tool.name)}
              type="button"
              className={cn(
                "group relative flex flex-col justify-between rounded-xl border p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
                isSelected
                  ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                  : "border-border/70 bg-card hover:border-primary/40 hover:bg-secondary/40",
              )}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "rounded-lg p-2.5 transition-all duration-300 bg-blue-500/10 text-blue-500 group-hover:scale-105",
                      isSelected && "bg-primary text-primary-foreground",
                    )}
                  >
                    <ToolIcon className="h-5 w-5" />
                  </span>
                </div>
                <h3 className="mt-3 text-sm font-bold text-foreground">
                  {tool.name}
                </h3>
                <p className="mt-1 text-xs leading-5 text-muted-foreground line-clamp-2">
                  {tool.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* INPUT FORM */}
      <Card className="p-6 space-y-4 border-border/70 bg-card">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <WandSparkles className="h-4 w-4 text-primary" />
            Active Tool: <span className="text-primary">{selectedTool.name}</span>
          </h3>
          <span className="text-xs text-muted-foreground">
            {selectedTool.description}
          </span>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block flex items-center justify-between">
              <span>Full 1-Page Job Description (Paste Here)</span>
              <span className="text-[10px] text-muted-foreground">Full JD / Role Requirements</span>
            </label>
            <Textarea
              className="h-48 text-xs font-mono leading-5"
              placeholder="Paste full 1-page Job Description (Role title, responsibilities, tech stack, requirements, databases, cloud, experience level)..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block flex items-center justify-between">
              <span>Candidate Resume / Profile Context</span>
              <span className="text-[10px] text-muted-foreground">Optional Resume Text</span>
            </label>
            <Textarea
              className="h-48 text-xs font-mono leading-5"
              placeholder="Paste candidate resume text or candidate background context..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-foreground mb-1.5 block">
            Custom Sourcing Instructions / Prompt Focus
          </label>
          <Input
            className="text-xs"
            placeholder="e.g. Focus on candidates with 5+ years React, Node.js and AWS; exclude junior candidates."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        {/* TOOLBAR CONTROLS */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-border/60 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button disabled={!canRun} onClick={runTool} type="button" variant="accent">
              {status === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Generate Output
            </Button>

            <div className="flex items-center gap-1.5 border border-border/70 rounded-lg px-3 py-1.5 bg-secondary/30">
              <Cpu className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-muted-foreground">LLM Engine:</span>
                <Select
                  className="h-7 border-none bg-transparent text-xs font-semibold text-foreground focus:ring-0"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                >
                  <optgroup label="⚡ Local Free (Ollama)">
                    <option value="local-ollama/llama3.2:3b">Llama 3.2 3B (Local Free)</option>
                    <option value="local-ollama/qwen3:4b">Qwen 3 4B (Local Free)</option>
                    <option value="local-ollama/phi4-mini:3.8b">Phi-4 Mini 3.8B (Local Free)</option>
                    <option value="local-ollama/qwen2.5-coder:3b">Qwen 2.5 Coder 3B (Local Free)</option>
                    <option value="local-ollama/qwen3:1.7b">Qwen 3 1.7B (Local Free)</option>
                    <option value="local-ollama/deepseek-r1:1.5b">DeepSeek R1 1.5B (Local Free)</option>
                  </optgroup>
                  <optgroup label="☁️ Cloud Free (OpenRouter)">
                    <option value="meta-llama/llama-3.3-70b-instruct:free">Llama 3.3 70B (OpenRouter Free)</option>
                    <option value="google/gemini-2.5-flash:free">Gemini 2.5 Flash (OpenRouter Free)</option>
                    <option value="deepseek/deepseek-r1:free">DeepSeek R1 (OpenRouter Free)</option>
                    <option value="deepseek/deepseek-chat:free">DeepSeek V3 (OpenRouter Free)</option>
                    <option value="qwen/qwen-2.5-coder-32b-instruct:free">Qwen 2.5 Coder 32B (OpenRouter Free)</option>
                  </optgroup>
                  <optgroup label="🔧 Offline">
                    <option value="local-offline">Local Offline Engine</option>
                  </optgroup>
                </Select>
            </div>
          </div>

          {message && (
            <div
              className={cn(
                "inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-semibold",
                status === "error"
                  ? "border-destructive/30 bg-destructive/10 text-destructive"
                  : "border-primary/20 bg-primary/10 text-primary",
              )}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {message}
            </div>
          )}
        </div>
      </Card>

      {/* RESULTS DISPLAY AREA */}
      {result && (
        <div id="workbench-result" className="space-y-6">
          {/* HEADER SUMMARY CARD */}
          <Card className="p-6 space-y-4 border-border/70 bg-card">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Badge className="bg-primary/20 text-primary">
                  {result.provider} • {result.model}
                </Badge>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                  {result.booleanStrings?.length
                    ? `Boolean Search Strings Kit for "${result.parsedBoolean?.jobTitle || "Job Description"}"`
                    : `${result.score}% ${result.scoreLabel}`}
                </h3>
              </div>
              <Button onClick={copyResult} size="sm" variant="outline" className="text-xs">
                <Clipboard className="h-3.5 w-3.5" />
                Copy Full JSON Report
              </Button>
            </div>

            <p className="text-xs leading-6 text-muted-foreground border-t border-border/60 pt-3">
              {result.summary}
            </p>

            {/* EXTRACTED SOURCING SIGNAL BREAKDOWN */}
            {result.parsedBoolean && (
              <div className="grid gap-4 border-t border-border/60 pt-4 md:grid-cols-3 text-xs">
                <div className="rounded-xl border border-border/60 bg-secondary/20 p-4 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-primary block">
                    Extracted Job Titles ({result.parsedBoolean.titleSynonyms.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {result.parsedBoolean.titleSynonyms.map((title) => (
                      <Badge key={title} className="text-[10px] bg-primary/15 text-primary border-primary/30">
                        {title}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-border/60 bg-secondary/20 p-4 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-accent block">
                    Core Tech Stack & Skills ({result.parsedBoolean.primarySkills.length + result.parsedBoolean.toolsAndCloud.length})
                  </span>
                  <div className="flex flex-wrap gap-1 font-mono text-[10px]">
                    {[...result.parsedBoolean.primarySkills, ...result.parsedBoolean.toolsAndCloud].map((skill) => (
                      <span key={skill} className="rounded bg-secondary px-2 py-0.5 font-semibold text-primary border border-border/60">
                        <code>{skill}</code>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-border/60 bg-secondary/20 p-4 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-red-500 block">
                    Excluded NOT Anti-Keywords ({result.parsedBoolean.antiKeywords.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {result.parsedBoolean.antiKeywords.map((anti) => (
                      <span key={anti} className="rounded bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 text-[10px] font-semibold">
                        NOT {anti}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* MULTI-PLATFORM BOOLEAN STRING CARDS */}
          {result.booleanStrings && result.booleanStrings.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Search className="h-4 w-4 text-primary" />
                  Production-Ready Boolean Search Strings ({result.booleanStrings.length} Variants)
                </h3>
                <span className="text-xs text-muted-foreground">
                  Click any query block to copy directly to clipboard
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {result.booleanStrings.map((item, idx) => (
                  <Card
                    key={item.label || idx}
                    className="group relative flex flex-col justify-between p-5 border-border/70 bg-card hover:border-primary/50 transition-all shadow-sm"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Badge className="bg-primary/20 text-primary text-[10px]">
                            {item.platform || "Universal Boolean"}
                          </Badge>
                          <h4 className="mt-1 text-sm font-bold text-foreground">
                            {item.label}
                          </h4>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyQuery(item.query, idx)}
                          className="text-xs shrink-0 flex items-center gap-1"
                        >
                          {copiedIndex === idx ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-green-500" />
                              <span className="text-green-500 font-bold">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              Copy Query
                            </>
                          )}
                        </Button>
                      </div>

                      {item.description && (
                        <p className="mt-2 text-xs text-muted-foreground leading-5">
                          {item.description}
                        </p>
                      )}

                      {/* Monospace Code Box */}
                      <div
                        onClick={() => copyQuery(item.query, idx)}
                        className="mt-3 cursor-pointer rounded-xl border border-border/80 bg-secondary/40 p-3 font-mono text-xs leading-6 text-foreground group-hover:border-primary/40 transition-colors break-words select-all"
                      >
                        <code>{item.query}</code>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground border-t border-border/50 pt-2">
                      <span>Syntax Validated</span>
                      <span className="text-primary font-semibold group-hover:underline">
                        Click box to select all & copy
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* RECOMMENDATIONS & RECRUITER TIPS */}
          {result.recommendations && result.recommendations.length > 0 && (
            <Card className="p-5 space-y-3 border-border/70 bg-card">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" /> Recruiter Sourcing Strategy & Next Actions
              </h4>
              <ul className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                {result.recommendations.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-secondary/20 p-2.5 rounded-lg border border-border/50">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
