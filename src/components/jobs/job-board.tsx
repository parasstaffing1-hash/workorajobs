"use client";

import {
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  MapPin,
  Search,
  UploadCloud,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";

import { JobCard } from "@/components/jobs/job-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  jobDepartments,
  jobs,
  type Job,
} from "@/data/jobs";
import {
  extractResumeText,
  matchJobsToResume,
  parseResume,
  validateResumeFile,
  type ParsedResume,
  type ResumeMatchResult,
} from "@/lib/resume-match";
import { cn } from "@/lib/utils";

type UploadStatus = "idle" | "uploading" | "success" | "error";

type JobListItem = {
  job: Job;
  match: ResumeMatchResult | null;
};

const matchThresholds = [
  { label: "All matches", value: "All" },
  { label: "90%+", value: "90" },
  { label: "80%+", value: "80" },
  { label: "70%+", value: "70" },
  { label: "50%+", value: "50" },
];

const jobTypeFilters = ["All Types", "Full-time", "Contract", "Remote"];
const workModeFilters = ["All Modes", "Remote", "Hybrid", "On-site"];

function matchBadgeClass(score: number) {
  if (score >= 95) {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
  }

  if (score >= 80) {
    return "border-primary/30 bg-primary/10 text-primary";
  }

  if (score >= 60) {
    return "border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300";
  }

  return "border-border/70 bg-secondary/70 text-muted-foreground";
}

function jobHaystack(job: ResumeMatchResult["job"]) {
  return [
    job.title,
    job.company,
    job.location,
    job.type,
    job.workMode,
    job.department,
    job.tags.join(" "),
    job.requiredSkills.join(" "),
    job.preferredSkills.join(" "),
    job.description,
    job.responsibilities.join(" "),
    job.keywords.join(" "),
  ]
    .join(" ")
    .toLowerCase();
}

export function JobBoard() {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All");
  const [jobType, setJobType] = useState("All Types");
  const [matchThreshold, setMatchThreshold] = useState("All");
  const [workMode, setWorkMode] = useState("All Modes");
  const [sortDirection, setSortDirection] = useState("Highest Match");
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resumeMatches = useMemo(() => {
    return parsedResume ? matchJobsToResume(parsedResume, jobs) : [];
  }, [parsedResume]);

  const filteredJobs = useMemo(() => {
    const baseItems: JobListItem[] = (parsedResume
      ? resumeMatches.map((match) => ({ job: match.job, match }))
      : jobs.map((job) => ({ job, match: null }))).filter((item) => item.job.type !== "Internship");
    const minimumScore =
      matchThreshold === "All" ? null : Number(matchThreshold);
    const normalizedQuery = query.trim().toLowerCase();

    const filtered = baseItems.filter((item) => {
      const job = item.job;
      const matchesDepartment =
        department === "All" || job.department === department;
      const matchesType =
        jobType === "All Types" || job.type.toLowerCase() === jobType.toLowerCase();
      const matchesMode = workMode === "All Modes" || job.workMode === workMode;
      const matchesQuery =
        !normalizedQuery || jobHaystack(job).includes(normalizedQuery);
      const matchesThreshold =
        minimumScore === null ||
        (item.match !== null && item.match.score >= minimumScore);

      return (
        matchesDepartment &&
        matchesType &&
        matchesMode &&
        matchesQuery &&
        matchesThreshold
      );
    });

    if (!parsedResume) return filtered;

    return [...filtered].sort((a, b) =>
      sortDirection === "Lowest Match"
        ? (a.match?.score ?? 0) - (b.match?.score ?? 0)
        : (b.match?.score ?? 0) - (a.match?.score ?? 0),
    );
  }, [
    department,
    jobType,
    matchThreshold,
    parsedResume,
    query,
    resumeMatches,
    sortDirection,
    workMode,
  ]);

  async function processResume(file: File) {
    const validation = validateResumeFile(file);

    if (!validation.ok) {
      setUploadStatus("error");
      setUploadProgress(0);
      setUploadMessage(validation.message);
      return;
    }

    setUploadStatus("uploading");
    setUploadProgress(18);
    setUploadMessage("Uploading resume...");
    setResumeFileName(file.name);

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 160));
      setUploadProgress(42);
      setUploadMessage("Extracting resume text...");
      const text = await extractResumeText(file);
      setUploadProgress(76);
      setUploadMessage("Parsing skills and experience...");
      const parsed = parseResume(text);
      setParsedResume(parsed);
      setUploadProgress(100);
      setUploadStatus("success");
      setUploadMessage("Resume matched successfully.");
    } catch {
      setParsedResume(null);
      setUploadStatus("error");
      setUploadProgress(0);
      setUploadMessage(
        "Could not extract text from this resume. Try another PDF or DOCX file.",
      );
    }
  }

  function handleFileSelection(fileList: FileList | null) {
    const [file] = Array.from(fileList ?? []);

    if (file) {
      void processResume(file);
    }
  }

  function clearResume() {
    setParsedResume(null);
    setResumeFileName("");
    setUploadStatus("idle");
    setUploadProgress(0);
    setUploadMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-8">
      {/* RESUME MATCH CARD */}
      <Card className="p-5">
        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div className="min-w-0">
            <Badge className="bg-primary/20 text-primary">Resume Match</Badge>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">
              Find Jobs That Match Your Resume
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Upload your resume and instantly see the jobs most relevant to
              your skills and experience.
            </p>
            <div className="mt-5 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
              <span className="inline-flex items-center gap-2">
                <FileText aria-hidden="true" className="h-4 w-4 text-primary" />
                PDF
              </span>
              <span className="inline-flex items-center gap-2">
                <FileText aria-hidden="true" className="h-4 w-4 text-primary" />
                DOCX
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2
                  aria-hidden="true"
                  className="h-4 w-4 text-primary"
                />
                Max 5 MB
              </span>
            </div>
          </div>

          <div className="min-w-0">
            <input
              ref={fileInputRef}
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="sr-only"
              onChange={(event) => handleFileSelection(event.target.files)}
              type="file"
            />
            <button
              aria-label="Upload resume as PDF or DOCX"
              className={cn(
                "grid w-full place-items-center rounded-lg border border-dashed p-6 text-center transition-[background,border-color,box-shadow] focus-visible:shadow-focus-ring",
                dragActive
                  ? "border-primary bg-primary/10"
                  : "border-border/80 bg-background/70 hover:border-primary/40 hover:bg-card",
              )}
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={(event) => {
                event.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={(event) => {
                event.preventDefault();
                setDragActive(false);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setDragActive(true);
              }}
              onDrop={(event) => {
                event.preventDefault();
                setDragActive(false);
                handleFileSelection(event.dataTransfer.files);
              }}
              type="button"
            >
              <span className="animated-sheen grid h-12 w-12 place-items-center rounded-lg bg-primary/10 text-primary">
                <UploadCloud aria-hidden="true" className="h-5 w-5" />
              </span>
              <span className="mt-4 font-semibold">
                {resumeFileName || "Upload Resume"}
              </span>
              <span className="mt-2 text-sm text-muted-foreground">
                Drag and drop a PDF or DOCX here, or browse files.
              </span>
            </button>

            {uploadStatus !== "idle" ? (
              <div className="mt-4 rounded-lg border border-border/70 bg-background/70 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div
                    className={cn(
                      "inline-flex items-center gap-2 text-sm font-medium",
                      uploadStatus === "error"
                        ? "text-destructive"
                        : "text-primary",
                    )}
                    role="status"
                  >
                    {uploadStatus === "error" ? (
                      <XCircle aria-hidden="true" className="h-4 w-4" />
                    ) : (
                      <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
                    )}
                    {uploadMessage}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      size="sm"
                      type="button"
                      variant="outline"
                    >
                      Replace resume
                    </Button>
                    {parsedResume ? (
                      <Button
                        onClick={clearResume}
                        size="sm"
                        type="button"
                        variant="ghost"
                      >
                        Remove
                      </Button>
                    ) : null}
                  </div>
                </div>
                {uploadStatus === "uploading" ? (
                  <div className="mt-4 h-2 rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-[width] duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                ) : null}
                {parsedResume ? (
                  <div className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                    <p>Name: {parsedResume.name || "Not detected"}</p>
                    <p>Email: {parsedResume.email || "Not detected"}</p>
                    <p>
                      Experience:{" "}
                      {parsedResume.yearsOfExperience !== null
                        ? `${parsedResume.yearsOfExperience}+ years`
                        : "Not detected"}
                    </p>
                    <p>
                      Skills:{" "}
                      {parsedResume.skills.slice(0, 5).join(", ") ||
                        "Not detected"}
                    </p>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </Card>

      {/* FILTER CONTROL BAR WITH JOB TYPE & INTERNSHIPS */}
      <div className="glass-panel grid gap-3 rounded-lg border border-border/70 p-4 shadow-premium lg:grid-cols-[1fr_150px_140px_140px_140px_150px_auto]">
        <label className="relative block">
          <span className="sr-only">Search roles</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-muted-foreground"
          />
          <Input
            className="pl-10"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title, company, location or skill"
            value={query}
          />
        </label>
        <label>
          <span className="sr-only">Job Type</span>
          <Select
            onChange={(event) => setJobType(event.target.value)}
            value={jobType}
          >
            {jobTypeFilters.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
        </label>
        <label>
          <span className="sr-only">Department</span>
          <Select
            onChange={(event) => setDepartment(event.target.value)}
            value={department}
          >
            {jobDepartments.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
        </label>
        <label>
          <span className="sr-only">Resume match threshold</span>
          <Select
            disabled={!parsedResume}
            onChange={(event) => setMatchThreshold(event.target.value)}
            value={matchThreshold}
          >
            {matchThresholds.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
        </label>
        <label>
          <span className="sr-only">Work mode</span>
          <Select
            onChange={(event) => setWorkMode(event.target.value)}
            value={workMode}
          >
            {workModeFilters.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
        </label>
        <label>
          <span className="sr-only">Match sorting</span>
          <Select
            disabled={!parsedResume}
            onChange={(event) => setSortDirection(event.target.value)}
            value={sortDirection}
          >
            <option>Highest Match</option>
            <option>Lowest Match</option>
          </Select>
        </label>
        <Button
          onClick={() => {
            setQuery("");
            setDepartment("All");
            setJobType("All Types");
            setMatchThreshold("All");
            setWorkMode("All Modes");
            setSortDirection("Highest Match");
          }}
          type="button"
          variant="secondary"
        >
          Reset
        </Button>
      </div>

      {/* JOB LIST GRID */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground">All Active Openings</h3>
        <div className="grid gap-4">
          {filteredJobs.map((item) => {
            const { job, match } = item;
            return <JobCard key={job.id} job={job} match={match} />;
          })}
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground space-y-3">
          <p>No roles match that search. Try another department or keyword.</p>
          <Button onClick={() => setJobType("All Types")} variant="outline" size="sm">
            Show All Job Listings
          </Button>
        </Card>
      ) : null}
    </div>
  );
}
