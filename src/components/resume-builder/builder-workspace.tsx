"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Copy,
  Download,
  FileText,
  Plus,
  Printer,
  Redo2,
  RotateCcw,
  Sparkles,
  Trash2,
  Undo2,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AtsOptimizerEngine } from "@/lib/resume-builder/ats-optimizer";
import { ACTION_VERBS, PRESETS_STYLES, SUGGESTED_SKILLS } from "@/lib/resume-builder/constants";
import {
  createEmptyResumeData,
  createResumeEntryId,
  createSampleResumeData,
  parseResumeDraft,
} from "@/lib/resume-builder/defaults";
import type { ResumeData } from "@/lib/resume-builder/validation";
import { cn } from "@/lib/utils";

const DRAFT_STORAGE_KEY = "workora-cv-builder-draft";
const SETTINGS_STORAGE_KEY = "workora-cv-builder-settings";
const optimizer = new AtsOptimizerEngine();

type EditorSection =
  | "personalInfo"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "languages"
  | "target";

type StyleConfig = {
  presetId: string;
  fontFamily: string;
  fontSize: string;
  themeColor: string;
  lineHeight: string;
  pageSize: "A4" | "Letter";
};

const defaultStyle: StyleConfig = {
  presetId: "modern",
  fontFamily: "sans",
  fontSize: "md",
  themeColor: "#2563eb",
  lineHeight: "normal",
  pageSize: "A4",
};

const sections: Array<{ id: EditorSection; label: string; shortLabel: string }> = [
  { id: "personalInfo", label: "Personal details", shortLabel: "Details" },
  { id: "summary", label: "Professional summary", shortLabel: "Summary" },
  { id: "experience", label: "Work experience", shortLabel: "Experience" },
  { id: "education", label: "Education", shortLabel: "Education" },
  { id: "skills", label: "Skills", shortLabel: "Skills" },
  { id: "projects", label: "Projects", shortLabel: "Projects" },
  { id: "certifications", label: "Certifications", shortLabel: "Certificates" },
  { id: "languages", label: "Languages", shortLabel: "Languages" },
  { id: "target", label: "ATS job match", shortLabel: "ATS match" },
];

function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block space-y-1.5", className)}>
      <span className="flex items-center justify-between gap-3 text-xs font-semibold text-foreground">
        {label}
        {hint ? <span className="font-normal text-muted-foreground">{hint}</span> : null}
      </span>
      {children}
    </label>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-border/70 pb-4">
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}

function EntryHeader({
  title,
  subtitle,
  onDelete,
}: {
  title: string;
  subtitle: string;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/60 pb-3">
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <Button
        aria-label={`Delete ${title}`}
        className="h-9 w-9 text-red-600 hover:bg-red-500/10 hover:text-red-700"
        onClick={onDelete}
        size="icon"
        type="button"
        variant="ghost"
      >
        <Trash2 aria-hidden="true" className="h-4 w-4" />
      </Button>
    </div>
  );
}

function formatMonth(value?: string) {
  if (!value) return "";
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return value;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, 1);
  return new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(date);
}

function displayUrl(value: string) {
  return value.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function filenameFor(data: ResumeData, extension: string) {
  const base = data.personalInfo.fullName.trim() || "Workora_Resume";
  return `${base.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "")}_Resume.${extension}`;
}

function downloadFile(contents: string, type: string, filename: string) {
  const blob = new Blob([contents], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

function resumeToPlainText(data: ResumeData) {
  const lines: string[] = [];
  lines.push(data.personalInfo.fullName.toUpperCase());
  if (data.personalInfo.title) lines.push(data.personalInfo.title);
  lines.push(
    [
      data.personalInfo.email,
      data.personalInfo.phone,
      data.personalInfo.location,
      data.personalInfo.socialLinks?.linkedin,
      data.personalInfo.socialLinks?.portfolio,
    ]
      .filter(Boolean)
      .join(" | "),
  );

  if (data.summary) lines.push("", "PROFESSIONAL SUMMARY", data.summary);
  if (data.workExperiences.length) {
    lines.push("", "WORK EXPERIENCE");
    data.workExperiences.forEach((entry) => {
      lines.push(
        "",
        `${entry.role} | ${entry.company}`,
        `${formatMonth(entry.startDate)} - ${entry.isCurrent ? "Present" : formatMonth(entry.endDate)}${entry.location ? ` | ${entry.location}` : ""}`,
      );
      if (entry.description) lines.push(entry.description);
      entry.bullets.filter(Boolean).forEach((bullet) => lines.push(`- ${bullet}`));
    });
  }
  if (data.education.length) {
    lines.push("", "EDUCATION");
    data.education.forEach((entry) => {
      lines.push(
        "",
        `${entry.degree} | ${entry.institution}`,
        [formatMonth(entry.startDate), formatMonth(entry.endDate), entry.location, entry.gpa && `GPA: ${entry.gpa}`]
          .filter(Boolean)
          .join(" | "),
      );
      if (entry.details) lines.push(entry.details);
    });
  }
  if (data.skills.length) lines.push("", "SKILLS", data.skills.map((skill) => skill.name).join(", "));
  if (data.projects.length) {
    lines.push("", "PROJECTS");
    data.projects.forEach((project) => {
      lines.push("", `${project.name}${project.role ? ` | ${project.role}` : ""}`);
      if (project.url) lines.push(project.url);
      if (project.techStack.length) lines.push(`Technologies: ${project.techStack.join(", ")}`);
      if (project.description) lines.push(project.description);
      project.bullets.filter(Boolean).forEach((bullet) => lines.push(`- ${bullet}`));
    });
  }
  if (data.certifications.length) {
    lines.push("", "CERTIFICATIONS");
    data.certifications.forEach((certificate) =>
      lines.push(
        `- ${certificate.name} | ${certificate.issuer}${certificate.issueDate ? ` | ${formatMonth(certificate.issueDate)}` : ""}`,
      ),
    );
  }
  if (data.languages.length) {
    lines.push("", "LANGUAGES", data.languages.map((item) => `${item.language} (${item.proficiency})`).join(", "));
  }

  return lines.filter((line, index) => line || lines[index - 1]).join("\n").trim();
}

function getSectionStatus(data: ResumeData, section: EditorSection, targetJob: string) {
  switch (section) {
    case "personalInfo":
      return Boolean(data.personalInfo.fullName && data.personalInfo.email && data.personalInfo.phone);
    case "summary":
      return Boolean(data.summary && data.summary.trim().length >= 80);
    case "experience":
      return data.workExperiences.some((entry) => entry.role && entry.company && entry.bullets.some(Boolean));
    case "education":
      return data.education.some((entry) => entry.degree && entry.institution);
    case "skills":
      return data.skills.length >= 5;
    case "projects":
      return data.projects.length > 0;
    case "certifications":
      return data.certifications.length > 0;
    case "languages":
      return data.languages.length > 0;
    case "target":
      return targetJob.trim().length >= 100;
  }
}

function getCompletion(data: ResumeData) {
  const checks = [
    data.personalInfo.fullName,
    data.personalInfo.email,
    data.personalInfo.phone,
    data.personalInfo.location,
    data.personalInfo.title,
    data.summary && data.summary.length >= 80,
    data.workExperiences.length > 0,
    data.workExperiences.some((entry) => entry.bullets.length >= 2),
    data.education.length > 0,
    data.skills.length >= 5,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export function BuilderWorkspace() {
  const [data, setData] = useState<ResumeData>(() => createEmptyResumeData());
  const [history, setHistory] = useState<ResumeData[]>([]);
  const [redoStack, setRedoStack] = useState<ResumeData[]>([]);
  const [activeSection, setActiveSection] = useState<EditorSection>("personalInfo");
  const [styleConfig, setStyleConfig] = useState<StyleConfig>(defaultStyle);
  const [targetJob, setTargetJob] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [saveStatus, setSaveStatus] = useState<"loading" | "saved" | "saving">("loading");
  const [notice, setNotice] = useState<{ tone: "success" | "error"; message: string } | null>(null);
  const hydrated = useRef(false);
  const importInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const savedDraft = window.localStorage.getItem(DRAFT_STORAGE_KEY);
      const savedSettings = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (savedDraft) setData(parseResumeDraft(JSON.parse(savedDraft)));
      else setData(createSampleResumeData());
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings) as Partial<StyleConfig> & { targetJob?: string };
        setStyleConfig((current) => ({ ...current, ...parsed }));
        if (typeof parsed.targetJob === "string") setTargetJob(parsed.targetJob);
      }
    } catch {
      setData(createSampleResumeData());
      setNotice({ tone: "error", message: "Your older draft could not be fully restored, so we loaded a safe sample." });
    } finally {
      hydrated.current = true;
      setSaveStatus("saved");
    }
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    setSaveStatus("saving");
    const timer = window.setTimeout(() => {
      window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data));
      window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({ ...styleConfig, targetJob }));
      setSaveStatus("saved");
    }, 400);
    return () => window.clearTimeout(timer);
  }, [data, styleConfig, targetJob]);

  const audit = useMemo(() => optimizer.auditResume(data, targetJob || undefined), [data, targetJob]);
  const completion = useMemo(() => getCompletion(data), [data]);
  const matchedSkills = useMemo(() => {
    const job = targetJob.toLowerCase();
    if (!job) return [];
    return data.skills.filter((skill) => job.includes(skill.name.toLowerCase()));
  }, [data.skills, targetJob]);

  const updateData = (updater: (current: ResumeData) => ResumeData) => {
    setData((current) => {
      const next = updater(current);
      if (next === current) return current;
      setHistory((items) => [...items.slice(-49), current]);
      setRedoStack([]);
      return next;
    });
  };

  const updatePersonal = (patch: Partial<ResumeData["personalInfo"]>) =>
    updateData((current) => ({ ...current, personalInfo: { ...current.personalInfo, ...patch } }));

  const updateSocial = (key: "linkedin" | "github" | "portfolio", value: string) =>
    updateData((current) => ({
      ...current,
      personalInfo: {
        ...current.personalInfo,
        socialLinks: { ...current.personalInfo.socialLinks, [key]: value },
      },
    }));

  const updateExperience = (index: number, patch: Partial<ResumeData["workExperiences"][number]>) =>
    updateData((current) => ({
      ...current,
      workExperiences: current.workExperiences.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    }));

  const updateEducation = (index: number, patch: Partial<ResumeData["education"][number]>) =>
    updateData((current) => ({
      ...current,
      education: current.education.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    }));

  const updateProject = (index: number, patch: Partial<ResumeData["projects"][number]>) =>
    updateData((current) => ({
      ...current,
      projects: current.projects.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    }));

  const handleUndo = () => {
    const previous = history.at(-1);
    if (!previous) return;
    setHistory((items) => items.slice(0, -1));
    setRedoStack((items) => [...items.slice(-49), data]);
    setData(previous);
  };

  const handleRedo = () => {
    const next = redoStack.at(-1);
    if (!next) return;
    setRedoStack((items) => items.slice(0, -1));
    setHistory((items) => [...items.slice(-49), data]);
    setData(next);
  };

  const replaceResume = (next: ResumeData, message: string) => {
    setHistory((items) => [...items.slice(-49), data]);
    setRedoStack([]);
    setData(next);
    setNotice({ tone: "success", message });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        replaceResume(parseResumeDraft(JSON.parse(String(reader.result))), "Resume imported and saved locally.");
      } catch {
        setNotice({ tone: "error", message: "That file is not a valid Workora resume backup." });
      } finally {
        event.target.value = "";
      }
    };
    reader.readAsText(file);
  };

  const handlePrint = () => {
    const previousTitle = document.title;
    document.title = filenameFor(data, "pdf").replace(/\.pdf$/, "");
    const restoreTitle = () => {
      document.title = previousTitle;
      window.removeEventListener("afterprint", restoreTitle);
    };
    window.addEventListener("afterprint", restoreTitle);
    window.print();
    window.setTimeout(restoreTitle, 2_000);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resumeToPlainText(data));
      setNotice({ tone: "success", message: "ATS-friendly resume text copied to your clipboard." });
    } catch {
      setNotice({ tone: "error", message: "Clipboard access was blocked by your browser." });
    }
  };

  const applyPreset = (presetId: string) => {
    const preset = PRESETS_STYLES.find((item) => item.id === presetId);
    if (!preset) return;
    setStyleConfig((current) => ({
      ...current,
      presetId: preset.id,
      fontFamily: preset.fontFamily,
      fontSize: preset.fontSize,
      themeColor: preset.themeColor,
      lineHeight: preset.lineHeight,
    }));
  };

  const addSkill = (name: string) => {
    const clean = name.trim();
    if (!clean || data.skills.some((skill) => skill.name.toLowerCase() === clean.toLowerCase())) return;
    updateData((current) => ({ ...current, skills: [...current.skills, { name: clean, level: "Advanced" }] }));
    setSkillInput("");
  };

  const previewFont = styleConfig.fontFamily === "serif" ? "Georgia, 'Times New Roman', serif" : styleConfig.fontFamily === "mono" ? "'Courier New', monospace" : "Inter, Arial, sans-serif";
  const previewSize = styleConfig.fontSize === "sm" ? "11px" : styleConfig.fontSize === "lg" ? "14px" : "12.5px";
  const previewLineHeight = styleConfig.lineHeight === "compact" ? 1.35 : styleConfig.lineHeight === "relaxed" ? 1.75 : 1.55;

  return (
    <div className="resume-builder-app mx-auto w-full max-w-[1440px] space-y-5 print:m-0 print:max-w-none">
      <style>{`@media print { @page { size: ${styleConfig.pageSize}; margin: 0; } }`}</style>

      <div className="resume-builder-chrome flex flex-col gap-4 rounded-2xl border border-border/70 bg-card/90 p-4 shadow-sm backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <Sparkles aria-hidden="true" className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold tracking-tight">Workora Resume Studio</h2>
            <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground" aria-live="polite">
              <span className={cn("h-2 w-2 rounded-full", saveStatus === "saving" ? "bg-amber-500" : "bg-emerald-500")} />
              {saveStatus === "loading" ? "Restoring draft…" : saveStatus === "saving" ? "Saving locally…" : "Saved privately in this browser"}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button aria-label="Undo last edit" disabled={!history.length} onClick={handleUndo} size="icon" title="Undo" type="button" variant="ghost">
            <Undo2 aria-hidden="true" className="h-4 w-4" />
          </Button>
          <Button aria-label="Redo last edit" disabled={!redoStack.length} onClick={handleRedo} size="icon" title="Redo" type="button" variant="ghost">
            <Redo2 aria-hidden="true" className="h-4 w-4" />
          </Button>
          <input ref={importInput} accept="application/json,.json" className="hidden" onChange={handleImport} type="file" />
          <Button onClick={() => importInput.current?.click()} size="sm" type="button" variant="outline">
            <Upload aria-hidden="true" className="h-4 w-4" /> Import
          </Button>
          <Button onClick={() => downloadFile(JSON.stringify(data, null, 2), "application/json", filenameFor(data, "json"))} size="sm" type="button" variant="outline">
            <Download aria-hidden="true" className="h-4 w-4" /> Backup
          </Button>
          <Button onClick={() => downloadFile(resumeToPlainText(data), "text/plain;charset=utf-8", filenameFor(data, "txt"))} size="sm" type="button" variant="outline">
            <FileText aria-hidden="true" className="h-4 w-4" /> Download TXT
          </Button>
          <Button onClick={handlePrint} size="sm" type="button">
            <Printer aria-hidden="true" className="h-4 w-4" /> Download PDF
          </Button>
        </div>
      </div>

      {notice ? (
        <div
          aria-live="polite"
          className={cn(
            "resume-builder-chrome flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm",
            notice.tone === "success" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200" : "border-red-500/30 bg-red-500/10 text-red-800 dark:text-red-200",
          )}
        >
          <span className="flex items-center gap-2">
            {notice.tone === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            {notice.message}
          </span>
          <button aria-label="Dismiss message" className="min-h-0 text-lg leading-none opacity-60 hover:opacity-100" onClick={() => setNotice(null)} type="button">×</button>
        </div>
      ) : null}

      <div className="resume-builder-chrome grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border/70 bg-card/80 p-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Resume strength</p>
              <p className="mt-1 text-2xl font-bold">{audit.atsScore}<span className="text-sm font-medium text-muted-foreground">/100</span></p>
            </div>
            <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", audit.atsScore >= 85 ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : audit.atsScore >= 65 ? "bg-amber-500/10 text-amber-700 dark:text-amber-300" : "bg-red-500/10 text-red-700 dark:text-red-300")}>{audit.atsScore >= 85 ? "Strong" : audit.atsScore >= 65 ? "Improving" : "Needs work"}</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${audit.atsScore}%` }} /></div>
        </div>
        <div className="rounded-xl border border-border/70 bg-card/80 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Profile complete</p>
          <p className="mt-1 text-2xl font-bold">{completion}%</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-violet-500 transition-all" style={{ width: `${completion}%` }} /></div>
        </div>
        <button className="min-h-[112px] rounded-xl border border-primary/20 bg-primary/5 p-4 text-left transition hover:border-primary/40 hover:bg-primary/10" onClick={() => setActiveSection("target")} type="button">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Target a job</p>
          <p className="mt-1 font-semibold">{targetJob ? `${matchedSkills.length} skills matched` : "Paste a job description"}</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">Get role-specific keyword coverage and actionable ATS guidance.</p>
        </button>
      </div>

      <div className="grid min-w-0 gap-6 xl:grid-cols-[430px_minmax(0,1fr)] xl:items-start">
        <aside className="resume-builder-chrome min-w-0 space-y-4 xl:sticky xl:top-24">
          <nav aria-label="Resume sections" className="flex gap-2 overflow-x-auto rounded-2xl border border-border/70 bg-card/90 p-2 shadow-sm xl:grid xl:grid-cols-3">
            {sections.map((section, index) => {
              const complete = getSectionStatus(data, section.id, targetJob);
              return (
                <button
                  aria-current={activeSection === section.id ? "step" : undefined}
                  className={cn(
                    "flex min-w-[108px] flex-col items-start rounded-xl border px-3 py-2.5 text-left transition xl:min-w-0",
                    activeSection === section.id ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-transparent text-muted-foreground hover:border-border hover:bg-secondary/70 hover:text-foreground",
                  )}
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  type="button"
                >
                  <span className="flex w-full items-center justify-between gap-2 text-[10px] font-semibold uppercase tracking-wider opacity-70">
                    {String(index + 1).padStart(2, "0")}
                    {complete ? <CheckCircle aria-label="Complete" className="h-3.5 w-3.5" /> : null}
                  </span>
                  <span className="mt-1 text-xs font-semibold text-current">{section.shortLabel}</span>
                </button>
              );
            })}
          </nav>

          <div className="rounded-2xl border border-border/70 bg-card/90 p-5 shadow-sm">
            {activeSection === "personalInfo" ? (
              <div className="space-y-5">
                <SectionHeading description="Use the contact details recruiters should use. Your data never leaves this browser." title="Personal details" />
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
                  <Field className="sm:col-span-2" label="Full name"><Input autoComplete="name" onChange={(event) => updatePersonal({ fullName: event.target.value })} placeholder="Alex Morgan" value={data.personalInfo.fullName} /></Field>
                  <Field className="sm:col-span-2" label="Professional title"><Input onChange={(event) => updatePersonal({ title: event.target.value })} placeholder="Senior Product Engineer" value={data.personalInfo.title ?? ""} /></Field>
                  <Field label="Email"><Input autoComplete="email" onChange={(event) => updatePersonal({ email: event.target.value })} placeholder="alex@example.com" type="email" value={data.personalInfo.email} /></Field>
                  <Field label="Phone"><Input autoComplete="tel" onChange={(event) => updatePersonal({ phone: event.target.value })} placeholder="+1 415 555 0147" value={data.personalInfo.phone ?? ""} /></Field>
                  <Field className="sm:col-span-2" label="Location"><Input autoComplete="address-level2" onChange={(event) => updatePersonal({ location: event.target.value })} placeholder="City, State or Country" value={data.personalInfo.location ?? ""} /></Field>
                  <Field className="sm:col-span-2" label="LinkedIn"><Input inputMode="url" onChange={(event) => updateSocial("linkedin", event.target.value)} placeholder="https://linkedin.com/in/yourname" value={data.personalInfo.socialLinks?.linkedin ?? ""} /></Field>
                  <Field className="sm:col-span-2" label="Portfolio"><Input inputMode="url" onChange={(event) => updateSocial("portfolio", event.target.value)} placeholder="https://yourportfolio.com" value={data.personalInfo.socialLinks?.portfolio ?? ""} /></Field>
                  <Field className="sm:col-span-2" label="GitHub"><Input inputMode="url" onChange={(event) => updateSocial("github", event.target.value)} placeholder="https://github.com/yourname" value={data.personalInfo.socialLinks?.github ?? ""} /></Field>
                </div>
              </div>
            ) : null}

            {activeSection === "summary" ? (
              <div className="space-y-5">
                <SectionHeading description="Lead with your specialty, experience, and two pieces of measurable evidence." title="Professional summary" />
                <Field hint={`${data.summary?.length ?? 0}/450`} label="Summary">
                  <Textarea className="min-h-44" maxLength={450} onChange={(event) => updateData((current) => ({ ...current, summary: event.target.value }))} placeholder="Product-minded engineer with 8+ years…" value={data.summary ?? ""} />
                </Field>
                <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 text-xs leading-5 text-muted-foreground">
                  <p className="font-semibold text-foreground">A strong formula</p>
                  <p className="mt-1">Role + years of experience + domain expertise + 1–2 quantified outcomes. Aim for 60–100 words.</p>
                </div>
              </div>
            ) : null}

            {activeSection === "experience" ? (
              <div className="space-y-5">
                <SectionHeading description="Show outcomes, scope, and evidence—not a list of responsibilities." title="Work experience" />
                {data.workExperiences.map((entry, index) => (
                  <div className="space-y-4 rounded-xl border border-border/70 bg-secondary/20 p-4" key={entry.id}>
                    <EntryHeader onDelete={() => updateData((current) => ({ ...current, workExperiences: current.workExperiences.filter((_, itemIndex) => itemIndex !== index) }))} subtitle={entry.company || "Company"} title={entry.role || `Experience ${index + 1}`} />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Job title"><Input onChange={(event) => updateExperience(index, { role: event.target.value })} placeholder="Senior Product Engineer" value={entry.role} /></Field>
                      <Field label="Company"><Input onChange={(event) => updateExperience(index, { company: event.target.value })} placeholder="Company name" value={entry.company} /></Field>
                      <Field label="Location"><Input onChange={(event) => updateExperience(index, { location: event.target.value })} placeholder="City or Remote" value={entry.location ?? ""} /></Field>
                      <div />
                      <Field label="Start date"><Input onChange={(event) => updateExperience(index, { startDate: event.target.value })} type="month" value={entry.startDate} /></Field>
                      <Field label="End date"><Input disabled={entry.isCurrent} onChange={(event) => updateExperience(index, { endDate: event.target.value })} type="month" value={entry.endDate ?? ""} /></Field>
                    </div>
                    <label className="flex cursor-pointer items-center gap-2 text-sm"><input checked={entry.isCurrent} className="h-4 w-4 rounded border-border text-primary" onChange={(event) => updateExperience(index, { isCurrent: event.target.checked, endDate: event.target.checked ? "" : entry.endDate })} type="checkbox" />I currently work here</label>
                    <Field label="Role overview"><Textarea className="min-h-20" onChange={(event) => updateExperience(index, { description: event.target.value })} placeholder="One sentence describing your scope and team…" value={entry.description ?? ""} /></Field>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-3"><p className="text-xs font-semibold">Impact bullets</p><span className="text-[11px] text-muted-foreground">Start with a verb, end with evidence</span></div>
                      {entry.bullets.map((bullet, bulletIndex) => (
                        <div className="flex items-start gap-2" key={`${entry.id}-bullet-${bulletIndex}`}>
                          <span className="mt-3 text-primary">•</span>
                          <Textarea className="min-h-20 flex-1" maxLength={280} onChange={(event) => updateExperience(index, { bullets: entry.bullets.map((item, itemIndex) => itemIndex === bulletIndex ? event.target.value : item) })} placeholder="Improved conversion by 28% by…" value={bullet} />
                          <Button aria-label="Remove achievement bullet" className="mt-1 h-9 w-9 text-muted-foreground hover:text-red-600" onClick={() => updateExperience(index, { bullets: entry.bullets.filter((_, itemIndex) => itemIndex !== bulletIndex) })} size="icon" type="button" variant="ghost"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      ))}
                      <Button onClick={() => updateExperience(index, { bullets: [...entry.bullets, ""] })} size="sm" type="button" variant="outline"><Plus className="h-4 w-4" /> Add achievement</Button>
                    </div>
                    <div className="flex flex-wrap gap-1.5"><span className="mr-1 py-1 text-[11px] font-semibold text-muted-foreground">Power verbs:</span>{ACTION_VERBS.slice(0, 6).map((verb) => <span className="rounded-full bg-secondary px-2 py-1 text-[11px]" key={verb}>{verb}</span>)}</div>
                  </div>
                ))}
                <Button className="w-full" onClick={() => updateData((current) => ({ ...current, workExperiences: [...current.workExperiences, { id: createResumeEntryId("work"), role: "", company: "", location: "", startDate: "", endDate: "", isCurrent: false, description: "", bullets: [""] }] }))} type="button" variant="outline"><Plus className="h-4 w-4" /> Add work experience</Button>
              </div>
            ) : null}

            {activeSection === "education" ? (
              <div className="space-y-5">
                <SectionHeading description="Add degrees, diplomas, bootcamps, or relevant formal education." title="Education" />
                {data.education.map((entry, index) => (
                  <div className="space-y-4 rounded-xl border border-border/70 bg-secondary/20 p-4" key={entry.id}>
                    <EntryHeader onDelete={() => updateData((current) => ({ ...current, education: current.education.filter((_, itemIndex) => itemIndex !== index) }))} subtitle={entry.institution || "Institution"} title={entry.degree || `Education ${index + 1}`} />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field className="sm:col-span-2" label="Degree or qualification"><Input onChange={(event) => updateEducation(index, { degree: event.target.value })} placeholder="B.S. in Computer Science" value={entry.degree} /></Field>
                      <Field className="sm:col-span-2" label="Institution"><Input onChange={(event) => updateEducation(index, { institution: event.target.value })} placeholder="University or school" value={entry.institution} /></Field>
                      <Field label="Location"><Input onChange={(event) => updateEducation(index, { location: event.target.value })} placeholder="City, Country" value={entry.location ?? ""} /></Field>
                      <Field label="GPA / grade" hint="Optional"><Input onChange={(event) => updateEducation(index, { gpa: event.target.value })} placeholder="3.8 / 4.0" value={entry.gpa ?? ""} /></Field>
                      <Field label="Start date"><Input onChange={(event) => updateEducation(index, { startDate: event.target.value })} type="month" value={entry.startDate ?? ""} /></Field>
                      <Field label="End date"><Input onChange={(event) => updateEducation(index, { endDate: event.target.value })} type="month" value={entry.endDate ?? ""} /></Field>
                    </div>
                    <Field label="Details" hint="Optional"><Textarea className="min-h-20" onChange={(event) => updateEducation(index, { details: event.target.value })} placeholder="Honors, specialization, relevant coursework…" value={entry.details ?? ""} /></Field>
                  </div>
                ))}
                <Button className="w-full" onClick={() => updateData((current) => ({ ...current, education: [...current.education, { id: createResumeEntryId("education"), degree: "", institution: "", location: "", startDate: "", endDate: "", gpa: "", details: "" }] }))} type="button" variant="outline"><Plus className="h-4 w-4" /> Add education</Button>
              </div>
            ) : null}

            {activeSection === "skills" ? (
              <div className="space-y-5">
                <SectionHeading description="Prioritize exact terms used in your target job description." title="Skills" />
                <div className="flex gap-2"><Input onChange={(event) => setSkillInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addSkill(skillInput); } }} placeholder="Add a skill" value={skillInput} /><Button onClick={() => addSkill(skillInput)} type="button"><Plus className="h-4 w-4" /> Add</Button></div>
                <div className="space-y-2">
                  {data.skills.map((skill, index) => (
                    <div className="grid grid-cols-[minmax(0,1fr)_130px_40px] items-center gap-2 rounded-xl border border-border/70 bg-secondary/20 p-2" key={`${skill.name}-${index}`}>
                      <Input aria-label={`Skill ${index + 1}`} className="h-9 min-h-9" onChange={(event) => updateData((current) => ({ ...current, skills: current.skills.map((item, itemIndex) => itemIndex === index ? { ...item, name: event.target.value } : item) }))} value={skill.name} />
                      <select aria-label={`Proficiency for ${skill.name}`} className="h-9 min-h-9 rounded-lg border border-border bg-background px-2 text-xs" onChange={(event) => updateData((current) => ({ ...current, skills: current.skills.map((item, itemIndex) => itemIndex === index ? { ...item, level: event.target.value as ResumeData["skills"][number]["level"] } : item) }))} value={skill.level ?? "Advanced"}><option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>Expert</option></select>
                      <Button aria-label={`Remove ${skill.name}`} className="h-9 w-9 text-muted-foreground hover:text-red-600" onClick={() => updateData((current) => ({ ...current, skills: current.skills.filter((_, itemIndex) => itemIndex !== index) }))} size="icon" type="button" variant="ghost"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </div>
                <div><p className="mb-2 text-xs font-semibold text-muted-foreground">Suggested skills</p><div className="flex flex-wrap gap-2">{SUGGESTED_SKILLS.filter((name) => !data.skills.some((skill) => skill.name.toLowerCase() === name.toLowerCase())).slice(0, 10).map((name) => <button className="min-h-0 rounded-full border border-border bg-background px-2.5 py-1 text-xs transition hover:border-primary hover:text-primary" key={name} onClick={() => addSkill(name)} type="button">+ {name}</button>)}</div></div>
              </div>
            ) : null}

            {activeSection === "projects" ? (
              <div className="space-y-5">
                <SectionHeading description="Projects are especially valuable for technical, creative, and early-career resumes." title="Projects" />
                {data.projects.map((project, index) => (
                  <div className="space-y-4 rounded-xl border border-border/70 bg-secondary/20 p-4" key={project.id}>
                    <EntryHeader onDelete={() => updateData((current) => ({ ...current, projects: current.projects.filter((_, itemIndex) => itemIndex !== index) }))} subtitle={project.role || "Project"} title={project.name || `Project ${index + 1}`} />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Project name"><Input onChange={(event) => updateProject(index, { name: event.target.value })} placeholder="Open Metrics Toolkit" value={project.name} /></Field>
                      <Field label="Your role"><Input onChange={(event) => updateProject(index, { role: event.target.value })} placeholder="Creator" value={project.role ?? ""} /></Field>
                      <Field className="sm:col-span-2" label="Project link"><Input inputMode="url" onChange={(event) => updateProject(index, { url: event.target.value })} placeholder="https://github.com/…" value={project.url ?? ""} /></Field>
                      <Field className="sm:col-span-2" hint="Comma separated" label="Technologies"><Input onChange={(event) => updateProject(index, { techStack: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) })} placeholder="TypeScript, React, PostgreSQL" value={project.techStack.join(", ")} /></Field>
                    </div>
                    <Field label="Overview"><Textarea className="min-h-20" onChange={(event) => updateProject(index, { description: event.target.value })} placeholder="What you built and who it helped…" value={project.description ?? ""} /></Field>
                    <div className="space-y-2">{project.bullets.map((bullet, bulletIndex) => <div className="flex items-start gap-2" key={`${project.id}-${bulletIndex}`}><Textarea className="min-h-20" onChange={(event) => updateProject(index, { bullets: project.bullets.map((item, itemIndex) => itemIndex === bulletIndex ? event.target.value : item) })} placeholder="Reached 1,400 users…" value={bullet} /><Button aria-label="Remove project bullet" className="h-9 w-9 text-muted-foreground hover:text-red-600" onClick={() => updateProject(index, { bullets: project.bullets.filter((_, itemIndex) => itemIndex !== bulletIndex) })} size="icon" type="button" variant="ghost"><Trash2 className="h-4 w-4" /></Button></div>)}<Button onClick={() => updateProject(index, { bullets: [...project.bullets, ""] })} size="sm" type="button" variant="outline"><Plus className="h-4 w-4" /> Add outcome</Button></div>
                  </div>
                ))}
                <Button className="w-full" onClick={() => updateData((current) => ({ ...current, projects: [...current.projects, { id: createResumeEntryId("project"), name: "", role: "", url: "", techStack: [], description: "", bullets: [""] }] }))} type="button" variant="outline"><Plus className="h-4 w-4" /> Add project</Button>
              </div>
            ) : null}

            {activeSection === "certifications" ? (
              <div className="space-y-5">
                <SectionHeading description="Include current, role-relevant licenses and professional certifications." title="Certifications" />
                {data.certifications.map((certificate, index) => (
                  <div className="space-y-4 rounded-xl border border-border/70 bg-secondary/20 p-4" key={`${certificate.name}-${index}`}>
                    <EntryHeader onDelete={() => updateData((current) => ({ ...current, certifications: current.certifications.filter((_, itemIndex) => itemIndex !== index) }))} subtitle={certificate.issuer || "Issuer"} title={certificate.name || `Certification ${index + 1}`} />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field className="sm:col-span-2" label="Certification"><Input onChange={(event) => updateData((current) => ({ ...current, certifications: current.certifications.map((item, itemIndex) => itemIndex === index ? { ...item, name: event.target.value } : item) }))} placeholder="AWS Solutions Architect" value={certificate.name} /></Field>
                      <Field className="sm:col-span-2" label="Issuing organization"><Input onChange={(event) => updateData((current) => ({ ...current, certifications: current.certifications.map((item, itemIndex) => itemIndex === index ? { ...item, issuer: event.target.value } : item) }))} placeholder="Amazon Web Services" value={certificate.issuer} /></Field>
                      <Field label="Issue date"><Input onChange={(event) => updateData((current) => ({ ...current, certifications: current.certifications.map((item, itemIndex) => itemIndex === index ? { ...item, issueDate: event.target.value } : item) }))} type="month" value={certificate.issueDate ?? ""} /></Field>
                      <Field label="Expiry date"><Input onChange={(event) => updateData((current) => ({ ...current, certifications: current.certifications.map((item, itemIndex) => itemIndex === index ? { ...item, expiryDate: event.target.value } : item) }))} type="month" value={certificate.expiryDate ?? ""} /></Field>
                      <Field className="sm:col-span-2" label="Credential ID" hint="Optional"><Input onChange={(event) => updateData((current) => ({ ...current, certifications: current.certifications.map((item, itemIndex) => itemIndex === index ? { ...item, credentialId: event.target.value } : item) }))} value={certificate.credentialId ?? ""} /></Field>
                      <Field className="sm:col-span-2" label="Credential URL" hint="Optional"><Input inputMode="url" onChange={(event) => updateData((current) => ({ ...current, certifications: current.certifications.map((item, itemIndex) => itemIndex === index ? { ...item, url: event.target.value } : item) }))} value={certificate.url ?? ""} /></Field>
                    </div>
                  </div>
                ))}
                <Button className="w-full" onClick={() => updateData((current) => ({ ...current, certifications: [...current.certifications, { name: "", issuer: "", issueDate: "", expiryDate: "", credentialId: "", url: "" }] }))} type="button" variant="outline"><Plus className="h-4 w-4" /> Add certification</Button>
              </div>
            ) : null}

            {activeSection === "languages" ? (
              <div className="space-y-5">
                <SectionHeading description="List languages that add value for the roles or regions you target." title="Languages" />
                {data.languages.map((item, index) => (
                  <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_40px] items-end gap-2" key={`${item.language}-${index}`}>
                    <Field label="Language"><Input onChange={(event) => updateData((current) => ({ ...current, languages: current.languages.map((language, itemIndex) => itemIndex === index ? { ...language, language: event.target.value } : language) }))} placeholder="English" value={item.language} /></Field>
                    <Field label="Proficiency"><Input onChange={(event) => updateData((current) => ({ ...current, languages: current.languages.map((language, itemIndex) => itemIndex === index ? { ...language, proficiency: event.target.value } : language) }))} placeholder="Native" value={item.proficiency} /></Field>
                    <Button aria-label={`Remove ${item.language || "language"}`} className="text-muted-foreground hover:text-red-600" onClick={() => updateData((current) => ({ ...current, languages: current.languages.filter((_, itemIndex) => itemIndex !== index) }))} size="icon" type="button" variant="ghost"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
                <Button className="w-full" onClick={() => updateData((current) => ({ ...current, languages: [...current.languages, { language: "", proficiency: "" }] }))} type="button" variant="outline"><Plus className="h-4 w-4" /> Add language</Button>
              </div>
            ) : null}

            {activeSection === "target" ? (
              <div className="space-y-5">
                <SectionHeading description="Paste the role description to compare its terminology with your resume. Analysis stays on your device." title="ATS job match" />
                <Field hint={`${targetJob.length} characters`} label="Target job description"><Textarea className="min-h-64" onChange={(event) => setTargetJob(event.target.value)} placeholder="Paste the complete job description here…" value={targetJob} /></Field>
                {targetJob ? (
                  <div className="grid grid-cols-3 gap-2 text-center"><div className="rounded-xl bg-secondary/70 p-3"><p className="text-lg font-bold">{audit.keywordScore}</p><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Keywords</p></div><div className="rounded-xl bg-secondary/70 p-3"><p className="text-lg font-bold">{audit.readabilityScore}</p><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Readability</p></div><div className="rounded-xl bg-secondary/70 p-3"><p className="text-lg font-bold">{audit.formattingScore}</p><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Structure</p></div></div>
                ) : null}
                {matchedSkills.length ? <div><p className="mb-2 text-xs font-semibold">Matched skills</p><div className="flex flex-wrap gap-2">{matchedSkills.map((skill) => <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300" key={skill.name}>{skill.name}</span>)}</div></div> : null}
                <div className="space-y-2"><p className="text-xs font-semibold">Recommended next fixes</p>{audit.warnings.slice(0, 5).map((warning, index) => <button className="w-full rounded-xl border border-border/70 bg-secondary/20 p-3 text-left text-xs transition hover:border-primary/40" key={`${warning.message}-${index}`} onClick={() => { const next = warning.message.includes("email") || warning.message.includes("phone") || warning.message.includes("LinkedIn") ? "personalInfo" : warning.message.includes("experience") || warning.message.includes("achievement") ? "experience" : warning.message.includes("skill") ? "skills" : "summary"; setActiveSection(next); }} type="button"><span className={cn("font-semibold", warning.category === "danger" ? "text-red-600" : warning.category === "warning" ? "text-amber-700 dark:text-amber-300" : "text-primary")}>{warning.message}</span><span className="mt-1 block leading-5 text-muted-foreground">{warning.actionableFix}</span></button>)}</div>
              </div>
            ) : null}
          </div>

          <div className="flex gap-2">
            <Button className="flex-1" onClick={() => replaceResume(createSampleResumeData(), "Professional sample restored.")} type="button" variant="outline"><RotateCcw className="h-4 w-4" /> Load sample</Button>
            <Button className="flex-1" onClick={() => { if (window.confirm("Start a blank resume? Your current draft can still be recovered with Undo.")) replaceResume(createEmptyResumeData(), "Blank resume ready."); }} type="button" variant="ghost">Start fresh</Button>
          </div>
        </aside>

        <section aria-label="Resume preview" className="min-w-0 space-y-3">
          <div className="resume-builder-chrome flex flex-col gap-3 rounded-2xl border border-border/70 bg-card/90 p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Live preview</p><p className="mt-0.5 text-xs text-muted-foreground">ATS-safe single-column layout</p></div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="text-xs font-medium text-muted-foreground"><span className="sr-only">Template</span><select aria-label="Resume template" className="h-9 min-h-9 rounded-lg border border-border bg-background px-3 text-xs text-foreground" onChange={(event) => applyPreset(event.target.value)} value={styleConfig.presetId}>{PRESETS_STYLES.map((preset) => <option key={preset.id} value={preset.id}>{preset.name}</option>)}</select></label>
              <label className="text-xs font-medium text-muted-foreground"><span className="sr-only">Page size</span><select aria-label="Page size" className="h-9 min-h-9 rounded-lg border border-border bg-background px-3 text-xs text-foreground" onChange={(event) => setStyleConfig((current) => ({ ...current, pageSize: event.target.value as "A4" | "Letter" }))} value={styleConfig.pageSize}><option value="A4">A4</option><option value="Letter">US Letter</option></select></label>
              <Button aria-label="Copy resume text" onClick={handleCopy} size="icon" title="Copy ATS text" type="button" variant="ghost"><Copy className="h-4 w-4" /></Button>
            </div>
          </div>

          <div className="resume-preview-stage overflow-x-auto rounded-2xl border border-border/70 bg-slate-200/60 p-3 shadow-inner dark:bg-slate-950/50 sm:p-6">
            <article
              className={cn("resume-print-root mx-auto w-full max-w-[816px] overflow-hidden bg-white text-slate-800 shadow-2xl", styleConfig.pageSize === "A4" ? "min-h-[1122px]" : "min-h-[1056px]")}
              style={{ fontFamily: previewFont, fontSize: previewSize, lineHeight: previewLineHeight, padding: styleConfig.pageSize === "A4" ? "48px 52px" : "48px 56px" }}
            >
              <header className="border-b-2 pb-4" style={{ borderColor: styleConfig.themeColor }}>
                <h1 className={cn("text-[30px] font-bold uppercase leading-tight tracking-[-0.025em] text-slate-950", !data.personalInfo.fullName && "resume-placeholder text-slate-300")}>{data.personalInfo.fullName || "Your Name"}</h1>
                <p className={cn("mt-1 text-[14px] font-semibold", !data.personalInfo.title && "resume-placeholder opacity-40")} style={{ color: styleConfig.themeColor }}>{data.personalInfo.title || "Your professional title"}</p>
                <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-[10.5px] text-slate-600">
                  {[data.personalInfo.email, data.personalInfo.phone, data.personalInfo.location].filter(Boolean).map((item) => <span key={item}>{item}</span>)}
                  {[data.personalInfo.socialLinks?.linkedin, data.personalInfo.socialLinks?.portfolio, data.personalInfo.socialLinks?.github].filter((item): item is string => Boolean(item)).map((item) => <span key={item}>{displayUrl(item)}</span>)}
                  {!data.personalInfo.email && !data.personalInfo.phone && !data.personalInfo.location ? <span className="resume-placeholder text-slate-300">email@example.com • phone • city</span> : null}
                </div>
              </header>

              {data.summary ? <section className="mt-5"><ResumePreviewHeading color={styleConfig.themeColor}>Professional summary</ResumePreviewHeading><p className="mt-2 text-[11.5px] text-slate-700">{data.summary}</p></section> : <section className="resume-placeholder mt-5"><ResumePreviewHeading color={styleConfig.themeColor}>Professional summary</ResumePreviewHeading><div className="mt-2 h-10 rounded bg-slate-100" /></section>}

              {data.workExperiences.length ? <section className="mt-5"><ResumePreviewHeading color={styleConfig.themeColor}>Professional experience</ResumePreviewHeading><div className="mt-3 space-y-4">{data.workExperiences.map((entry) => <div className="break-inside-avoid" key={entry.id}><div className="flex items-start justify-between gap-4"><div><h3 className="text-[12px] font-bold text-slate-900">{entry.role || "Role"}</h3><p className="text-[11px] font-semibold text-slate-600">{entry.company || "Company"}{entry.location ? ` • ${entry.location}` : ""}</p></div><p className="shrink-0 text-right text-[10px] font-medium text-slate-500">{formatMonth(entry.startDate)}{entry.startDate ? " – " : ""}{entry.isCurrent ? "Present" : formatMonth(entry.endDate)}</p></div>{entry.description ? <p className="mt-1 text-[11px] text-slate-600">{entry.description}</p> : null}{entry.bullets.some(Boolean) ? <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-[11px] text-slate-700">{entry.bullets.filter(Boolean).map((bullet, bulletIndex) => <li key={`${entry.id}-preview-${bulletIndex}`}>{bullet}</li>)}</ul> : null}</div>)}</div></section> : null}

              {data.skills.length ? <section className="mt-5"><ResumePreviewHeading color={styleConfig.themeColor}>Core skills</ResumePreviewHeading><p className="mt-2 text-[11px] text-slate-700">{data.skills.map((skill) => skill.name).filter(Boolean).join(" • ")}</p></section> : null}

              {data.projects.length ? <section className="mt-5"><ResumePreviewHeading color={styleConfig.themeColor}>Selected projects</ResumePreviewHeading><div className="mt-3 space-y-3">{data.projects.map((project) => <div className="break-inside-avoid" key={project.id}><div className="flex items-start justify-between gap-4"><h3 className="text-[12px] font-bold text-slate-900">{project.name || "Project"}{project.role ? <span className="font-medium text-slate-500"> — {project.role}</span> : null}</h3>{project.url ? <span className="text-[10px] text-slate-500">{displayUrl(project.url)}</span> : null}</div>{project.techStack.length ? <p className="mt-0.5 text-[9.5px] font-semibold uppercase tracking-wide text-slate-500">{project.techStack.join(" • ")}</p> : null}{project.description ? <p className="mt-1 text-[11px] text-slate-700">{project.description}</p> : null}{project.bullets.some(Boolean) ? <ul className="mt-1 list-disc pl-4 text-[11px] text-slate-700">{project.bullets.filter(Boolean).map((bullet, index) => <li key={index}>{bullet}</li>)}</ul> : null}</div>)}</div></section> : null}

              {data.education.length ? <section className="mt-5"><ResumePreviewHeading color={styleConfig.themeColor}>Education</ResumePreviewHeading><div className="mt-3 space-y-3">{data.education.map((entry) => <div className="break-inside-avoid" key={entry.id}><div className="flex items-start justify-between gap-4"><div><h3 className="text-[12px] font-bold text-slate-900">{entry.degree || "Degree"}</h3><p className="text-[11px] font-semibold text-slate-600">{entry.institution || "Institution"}{entry.location ? ` • ${entry.location}` : ""}</p></div><p className="shrink-0 text-[10px] font-medium text-slate-500">{formatMonth(entry.endDate)}</p></div>{entry.gpa || entry.details ? <p className="mt-1 text-[10.5px] text-slate-600">{[entry.gpa && `GPA: ${entry.gpa}`, entry.details].filter(Boolean).join(" • ")}</p> : null}</div>)}</div></section> : null}

              {data.certifications.length ? <section className="mt-5"><ResumePreviewHeading color={styleConfig.themeColor}>Certifications</ResumePreviewHeading><ul className="mt-2 space-y-1 text-[11px] text-slate-700">{data.certifications.map((certificate, index) => <li key={`${certificate.name}-${index}`}><strong className="text-slate-900">{certificate.name || "Certification"}</strong>{certificate.issuer ? ` — ${certificate.issuer}` : ""}{certificate.issueDate ? `, ${formatMonth(certificate.issueDate)}` : ""}</li>)}</ul></section> : null}

              {data.languages.length ? <section className="mt-5"><ResumePreviewHeading color={styleConfig.themeColor}>Languages</ResumePreviewHeading><p className="mt-2 text-[11px] text-slate-700">{data.languages.map((item) => `${item.language}${item.proficiency ? ` (${item.proficiency})` : ""}`).join(" • ")}</p></section> : null}
            </article>
          </div>
        </section>
      </div>
    </div>
  );
}

function ResumePreviewHeading({ children, color }: { children: React.ReactNode; color: string }) {
  return <h2 className="border-b border-slate-200 pb-1 text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color }}>{children}</h2>;
}
