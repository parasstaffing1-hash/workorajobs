"use client";

import {
  CheckCircle2,
  Clipboard,
  Download,
  Eye,
  FileCode,
  FileJson,
  Layers,
  Plus,
  Printer,
  RotateCcw,
  Sparkles,
  Trash2,
  Upload,
  WandSparkles,
  ChevronDown,
  ChevronUp,
  EyeOff,
  GripVertical,
  Undo2,
  Redo2,
  Settings,
  HelpCircle,
  Check
} from "lucide-react";
import { useCallback, useEffect, useState, useRef } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export type ExperienceItem = {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
};

export type EducationItem = {
  id: string;
  degree: string;
  institution: string;
  location: string;
  year: string;
  details: string;
};

export type ProjectItem = {
  id: string;
  name: string;
  role: string;
  link: string;
  techStack: string;
  description: string;
};

export type BuilderForm = {
  name: string;
  targetRole: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  seniority: string;
  years: string;
  summary: string;
  targetJob: string;
  experiences: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  skills: string[];
  certifications: string[];
  template: "modern" | "minimal" | "classic" | "tech" | "executive" | "creative" | "consultant" | "management" | "academic" | "graduate";
};

export type ResumeResult = {
  atsScore: number;
  impactScore: number;
  keywordScore: number;
  structureScore: number;
  headline: string;
  summary: string;
  keywordMatches: string[];
  keywordGaps: string[];
  suggestions: string[];
  resumeText: string;
};

const defaultForm: BuilderForm = {
  name: "Aisha Rahman",
  targetRole: "Senior Product Designer",
  email: "aisha.rahman@example.com",
  phone: "+1 (416) 555-0198",
  location: "Toronto, Canada",
  linkedin: "linkedin.com/in/aisharahman",
  portfolio: "aisha.design",
  seniority: "Senior",
  years: "8",
  summary:
    "Senior Product Designer with 8+ years of experience building scalable enterprise SaaS platforms, design systems, and user-centered workflow engines. Proven track record of improving candidate engagement by 31% and accelerating cross-functional delivery speed.",
  targetJob:
    "Senior Product Designer for a global staffing platform. Must have enterprise SaaS, UX research, design systems, accessibility, analytics dashboards, stakeholder management and collaboration with product, data and engineering teams.",
  template: "modern",
  experiences: [
    {
      id: "exp-1",
      title: "Senior Product Designer",
      company: "Northstar Cloud",
      location: "Toronto, ON",
      startDate: "2022",
      endDate: "Present",
      current: true,
      bullets: [
        "Led discovery and prototyping for enterprise HR dashboards used by 14 recruiting teams nationwide.",
        "Improved candidate task completion rate by 31% through accessibility-first workflow redesigns.",
        "Built and maintained a multi-brand Figma design system that reduced feature delivery time by 22%.",
        "Partnered with product and engineering leaders to launch real-time hiring analytics dashboards.",
      ],
    },
    {
      id: "exp-2",
      title: "Product Designer",
      company: "Atlas Finance Solutions",
      location: "Vancouver, BC",
      startDate: "2018",
      endDate: "2022",
      current: false,
      bullets: [
        "Designed end-to-end B2B compliance workflows serving over 40,000 active financial managers.",
        "Conducted 50+ remote usability tests to refine complex multi-step transaction forms.",
        "Collaborated closely with backend engineers to establish standardized component specifications.",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "B.Des. Interaction Design",
      institution: "OCAD University",
      location: "Toronto, ON",
      year: "2018",
      details: "Honors Graduate. Focus on User Experience & Digital Product Systems.",
    },
  ],
  projects: [
    {
      id: "proj-1",
      name: "Accessible Design Token Suite",
      role: "Lead Creator",
      link: "github.com/aisha/design-tokens",
      techStack: "Figma, Style Dictionary, React",
      description: "An open-source token generator for contrast-compliant UI themes.",
    },
  ],
  skills: [
    "Figma",
    "UX Research",
    "Design Systems",
    "Accessibility (WCAG)",
    "Prototyping",
    "Stakeholder Management",
    "Analytics Dashboards",
    "B2B SaaS",
    "Product Strategy",
    "Usability Testing",
    "User Flows",
    "Wireframing",
  ],
  certifications: [
    "Certified Professional in Accessibility Core Competencies (CPACC)",
    "Enterprise Design Thinking Practitioner - IBM",
  ],
};

const stopWords = new Set([
  "and", "the", "for", "with", "from", "must", "have", "role", "team", "teams", "this", "that", "will", "into", "across", "used", "using", "candidate", "candidates", "working", "their", "about", "ability",
]);

function titleCase(str: string) {
  return str.replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

function safeFileName(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "resume";
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

function extractDynamicKeywords(targetJobText: string, userSkills: string[]): string[] {
  if (!targetJobText.trim()) return userSkills.slice(0, 10);

  const rawWords = targetJobText
    .toLowerCase()
    .replace(/[^a-z0-9+#.-]+/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));

  const phrases: string[] = [];
  for (let i = 0; i < rawWords.length - 1; i++) {
    const p = `${rawWords[i]} ${rawWords[i + 1]}`;
    if (!stopWords.has(rawWords[i]) && !stopWords.has(rawWords[i + 1])) {
      phrases.push(p);
    }
  }

  const counts = new Map<string, number>();
  [...phrases, ...rawWords].forEach((item) => {
    counts.set(item, (counts.get(item) || 0) + 1);
  });

  const sorted = [...counts.entries()]
    .filter(([item]) => item.length > 3)
    .sort((a, b) => b[1] - a[1])
    .map(([item]) => titleCase(item));

  const uniqueList = Array.from(new Set([...sorted, ...userSkills]));
  return uniqueList.slice(0, 16);
}

function calculateResumeResult(form: BuilderForm): ResumeResult {
  const fullCandidateText = [
    form.targetRole,
    form.summary,
    ...form.skills,
    ...form.experiences.flatMap((e) => [e.title, e.company, ...e.bullets]),
    ...form.education.flatMap((ed) => [ed.degree, ed.institution, ed.details]),
    ...form.projects.flatMap((p) => [p.name, p.techStack, p.description]),
    ...form.certifications,
  ]
    .join(" ")
    .toLowerCase();

  const targetKeywords = extractDynamicKeywords(form.targetJob, form.skills);
  const matches = targetKeywords.filter((kw) =>
    fullCandidateText.includes(kw.toLowerCase()),
  );
  const gaps = targetKeywords.filter(
    (kw) => !fullCandidateText.includes(kw.toLowerCase()),
  );

  const keywordScore = targetKeywords.length
    ? Math.round((matches.length / targetKeywords.length) * 100)
    : 80;

  const hasMetrics = /\b\d+%|\b\d+x|\$\d+|\b\d{2,}\b/.test(fullCandidateText);
  const totalBullets = form.experiences.reduce(
    (acc, e) => acc + e.bullets.length,
    0,
  );
  const impactScore = Math.min(
    98,
    Math.max(50, 45 + totalBullets * 6 + (hasMetrics ? 20 : 0)),
  );

  const structureScore =
    form.name && form.email && form.experiences.length && form.skills.length
      ? 95
      : 70;

  const atsScore = Math.round(
    keywordScore * 0.45 + impactScore * 0.35 + structureScore * 0.2,
  );

  const headline = `${form.seniority ? `${form.seniority} ` : ""}${
    form.targetRole || "Professional"
  } | ${form.skills.slice(0, 4).join(" · ")}`;

  const suggestions: string[] = [];
  if (gaps.length > 0) {
    suggestions.push(
      `Add evidence for missing job keywords: ${gaps.slice(0, 3).join(", ")}.`,
    );
  } else {
    suggestions.push(
      "Keyword alignment is strong! Ensure metrics support each skill claim.",
    );
  }

  if (!hasMetrics) {
    suggestions.push(
      "Include quantifiable results (e.g., %, $, team size, timeline impact) in bullet points.",
    );
  } else {
    suggestions.push(
      "Metrics detected! Position key metric wins near the top of recent work experience.",
    );
  }

  if (form.experiences.length < 2) {
    suggestions.push(
      "Add at least 2 distinct work experience roles to demonstrate career progression.",
    );
  }

  suggestions.push(
    "Ensure section headings match standard ATS norms (SUMMARY, EXPERIENCE, EDUCATION, SKILLS).",
  );

  const contactLine = [
    form.email,
    form.phone,
    form.location,
    form.linkedin,
    form.portfolio,
  ]
    .filter(Boolean)
    .join(" | ");

  const resumeText = [
    form.name.toUpperCase(),
    headline,
    contactLine,
    "",
    "PROFESSIONAL SUMMARY",
    form.summary || "Add professional summary...",
    "",
    "CORE SKILLS",
    form.skills.join(" | "),
    "",
    "EXPERIENCE",
    ...form.experiences.flatMap((exp) => [
      `${exp.title.toUpperCase()} - ${exp.company} (${exp.startDate} - ${
        exp.current ? "Present" : exp.endDate
      })`,
      `${exp.location}`,
      ...exp.bullets.map((b) => `- ${b}`),
      "",
    ]),
    "PROJECTS",
    ...form.projects.flatMap((p) => [
      `${p.name} (${p.role}) - ${p.techStack}`,
      `- ${p.description}`,
      "",
    ]),
    "EDUCATION & CERTIFICATIONS",
    ...form.education.map(
      (ed) => `- ${ed.degree}, ${ed.institution} (${ed.year}) - ${ed.details}`,
    ),
    ...form.certifications.map((c) => `- ${c}`),
  ].join("\n");

  return {
    atsScore,
    impactScore,
    keywordScore,
    structureScore,
    headline,
    summary: form.summary || "",
    keywordMatches: matches,
    keywordGaps: gaps,
    suggestions,
    resumeText,
  };
}

export function AiResumeBuilder({ className }: { className?: string }) {
  const [form, setForm] = useState<BuilderForm>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("workora_cv_builder_state");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return defaultForm;
  });

  const [result, setResult] = useState<ResumeResult>(() =>
    calculateResumeResult(form),
  );

  const [activeTab, setActiveTab] = useState<"builder" | "preview" | "ats">("builder");
  const [statusMsg, setStatusMsg] = useState("");
  const [newSkillText, setNewSkillText] = useState("");
  
  // Section Reordering and Visibility States
  const [sectionOrder, setSectionOrder] = useState<string[]>([
    "summary",
    "skills",
    "experience",
    "education",
    "projects",
    "certifications"
  ]);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    contact: true,
    summary: true,
    skills: false,
    experience: false,
    education: false,
    projects: false,
    certifications: false,
  });

  const [sectionVisibility, setSectionVisibility] = useState<Record<string, boolean>>({
    summary: true,
    skills: true,
    experience: true,
    education: true,
    projects: true,
    certifications: true,
  });

  // Undo/Redo State History Stacks
  const [undoStack, setUndoStack] = useState<BuilderForm[]>([]);
  const [redoStack, setRedoStack] = useState<BuilderForm[]>([]);
  
  // Drag and Drop Dragged Items
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null);
  const [dragOverSectionId, setDragOverSectionId] = useState<string | null>(null);

  // Recalculate results & trigger autosave
  useEffect(() => {
    setResult(calculateResumeResult(form));
    if (typeof window !== "undefined") {
      localStorage.setItem("workora_cv_builder_state", JSON.stringify(form));
      setStatusMsg("Changes autosaved locally.");
    }
  }, [form]);

  // Bind Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "z") {
        e.preventDefault();
        handleUndo();
      }
      if (e.altKey && e.key === "y") {
        e.preventDefault();
        handleRedo();
      }
      if (e.altKey && e.key === "s") {
        e.preventDefault();
        downloadJson();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undoStack, redoStack, form]);

  const pushToUndo = (currentForm: BuilderForm) => {
    setUndoStack((prev) => [...prev, JSON.parse(JSON.stringify(currentForm))].slice(-20));
    setRedoStack([]);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setRedoStack((prev) => [...prev, JSON.parse(JSON.stringify(form))].slice(-20));
    setUndoStack((prev) => prev.slice(0, -1));
    setForm(previous);
    setStatusMsg("Action undone.");
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack((prev) => [...prev, JSON.parse(JSON.stringify(form))].slice(-20));
    setRedoStack((prev) => prev.slice(0, -1));
    setForm(next);
    setStatusMsg("Action redone.");
  };

  const updateField = useCallback(
    <K extends keyof BuilderForm>(field: K, value: BuilderForm[K]) => {
      setForm((prev) => {
        pushToUndo(prev);
        return { ...prev, [field]: value };
      });
    },
    [form],
  );

  const toggleSectionExpand = (secId: string) => {
    setExpandedSections(prev => ({ ...prev, [secId]: !prev[secId] }));
  };

  const toggleSectionVisibility = (secId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSectionVisibility(prev => ({ ...prev, [secId]: !prev[secId] }));
  };

  // Section Drag & Drop handlers
  const handleSectionDragStart = (e: React.DragEvent, id: string) => {
    setDraggedSectionId(id);
    e.dataTransfer.setData("text/plain", id);
  };

  const handleSectionDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggedSectionId !== id) {
      setDragOverSectionId(id);
    }
  };

  const handleSectionDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    setDragOverSectionId(null);
    if (!draggedSectionId || draggedSectionId === targetId) return;

    const currentOrder = [...sectionOrder];
    const draggedIdx = currentOrder.indexOf(draggedSectionId);
    const targetIdx = currentOrder.indexOf(targetId);

    if (draggedIdx !== -1 && targetIdx !== -1) {
      currentOrder.splice(draggedIdx, 1);
      currentOrder.splice(targetIdx, 0, draggedSectionId);
      setSectionOrder(currentOrder);
      setStatusMsg("Section order rearranged.");
    }
    setDraggedSectionId(null);
  };

  // Reset to Sample
  const resetSample = () => {
    pushToUndo(form);
    setForm(defaultForm);
    setSectionOrder(["summary", "skills", "experience", "education", "projects", "certifications"]);
    setStatusMsg("Sample CV data restored.");
  };

  // Add items list handlers
  const addExperience = () => {
    const newItem: ExperienceItem = {
      id: `exp-${Date.now()}`,
      title: "Role Title",
      company: "Company Name",
      location: "Location",
      startDate: "2023",
      endDate: "Present",
      current: true,
      bullets: ["Delivered role initiatives with measurable candidate and business impact."],
    };
    updateField("experiences", [...form.experiences, newItem]);
  };

  const removeExperience = (id: string) => {
    updateField("experiences", form.experiences.filter((item) => item.id !== id));
  };

  const updateExperience = (id: string, key: keyof ExperienceItem, value: unknown) => {
    updateField("experiences", form.experiences.map((item) => item.id === id ? { ...item, [key]: value } : item));
  };

  const addExpBullet = (expId: string) => {
    updateField("experiences", form.experiences.map((exp) => exp.id === expId ? { ...exp, bullets: [...exp.bullets, "New outcome bullet point"] } : exp));
  };

  const updateExpBullet = (expId: string, index: number, text: string) => {
    updateField("experiences", form.experiences.map((exp) => {
      if (exp.id === expId) {
        const bulletsCopy = [...exp.bullets];
        bulletsCopy[index] = text;
        return { ...exp, bullets: bulletsCopy };
      }
      return exp;
    }));
  };

  const removeExpBullet = (expId: string, index: number) => {
    updateField("experiences", form.experiences.map((exp) => {
      if (exp.id === expId) {
        return { ...exp, bullets: exp.bullets.filter((_, i) => i !== index) };
      }
      return exp;
    }));
  };

  const addSkill = () => {
    if (newSkillText.trim() && !form.skills.includes(newSkillText.trim())) {
      updateField("skills", [...form.skills, newSkillText.trim()]);
    }
    setNewSkillText("");
  };

  const removeSkill = (skill: string) => {
    updateField("skills", form.skills.filter((s) => s !== skill));
  };

  // Exports & downloads
  const downloadTxt = () => {
    const fileName = safeFileName(form.name);
    const blob = new Blob([result.resumeText], { type: "text/plain" });
    downloadBlob(blob, `${fileName}-resume.txt`);
  };

  const downloadJson = () => {
    const fileName = safeFileName(form.name);
    const blob = new Blob([JSON.stringify(form, null, 2)], { type: "application/json" });
    downloadBlob(blob, `${fileName}-cv-data.json`);
  };

  const handleJsonImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.name) {
          setForm(parsed);
          setStatusMsg("Imported CV data successfully.");
        }
      } catch {
        setStatusMsg("Invalid JSON backup file.");
      }
    };
    reader.readAsText(file);
  };

  const handleOpenPreviewTab = () => {
    const id = "resume-" + Date.now().toString() + Math.random().toString(36).substr(2, 4);
    const payload = {
      title: "Generated Resume",
      originalUrl: "/resume-builder",
      inputs: { form, result },
      resultText: result.resumeText,
      subMetrics: {
        overall: result.atsScore,
        ats: result.keywordScore,
        content: result.impactScore,
        formatting: result.structureScore,
        keyword: result.keywordScore,
        skills: result.atsScore,
        experience: result.atsScore,
      }
    };
    localStorage.setItem(`workora_tool_result_${id}`, JSON.stringify(payload));
    window.open(`/tools/resume-generator/result?id=${id}`, "_blank");
  };

  // Recursive section rendering for templates
  const getTemplateHeadingClass = (template: string) => {
    switch (template) {
      case "classic":
        return "text-slate-900 border-slate-350 font-serif";
      case "executive":
        return "text-blue-900 border-blue-200 font-serif";
      case "academic":
        return "text-black border-black/45 font-serif";
      case "minimal":
        return "text-slate-750 border-slate-200";
      case "creative":
        return "text-pink-600 border-pink-200";
      case "tech":
        return "text-indigo-400 border-indigo-900/60";
      case "consultant":
        return "text-emerald-700 border-emerald-250";
      case "management":
        return "text-violet-700 border-violet-250";
      case "graduate":
        return "text-sky-600 border-sky-250";
      default:
        return "text-primary border-border";
    }
  };

  const getTemplateTextClass = (template: string) => {
    if (template === "classic" || template === "executive" || template === "academic") {
      return "text-slate-800 font-serif";
    }
    return "text-muted-foreground";
  };

  const getTemplateSkillTagClass = (template: string) => {
    switch (template) {
      case "classic":
      case "executive":
      case "academic":
        return "bg-slate-100 text-slate-900 font-serif border-slate-200";
      case "minimal":
        return "border-foreground/20 text-foreground";
      case "creative":
        return "bg-pink-500/10 text-pink-600 border-pink-200";
      case "tech":
        return "bg-indigo-500/10 text-indigo-450 border-indigo-500/20";
      case "consultant":
        return "bg-emerald-500/10 text-emerald-700 border-emerald-200";
      case "management":
        return "bg-violet-500/10 text-violet-700 border-violet-200";
      case "graduate":
        return "bg-sky-500/10 text-sky-600 border-sky-200";
      default:
        return "bg-secondary/70 text-foreground border-border";
    }
  };

  const renderTemplateSection = (sectionId: string, template: string) => {
    if (!sectionVisibility[sectionId]) return null;

    const headingClass = getTemplateHeadingClass(template);
    const textClass = getTemplateTextClass(template);
    const skillClass = getTemplateSkillTagClass(template);

    if (sectionId === "summary") {
      if (!form.summary) return null;
      return (
        <section key="summary" className="space-y-1.5">
          <h2 className={cn("text-xs font-bold uppercase tracking-widest border-b pb-1", headingClass)}>
            Professional Summary
          </h2>
          <p className={cn("text-xs leading-relaxed", textClass)}>
            {form.summary}
          </p>
        </section>
      );
    }

    if (sectionId === "skills") {
      if (form.skills.length === 0) return null;
      return (
        <section key="skills" className="space-y-2">
          <h2 className={cn("text-xs font-bold uppercase tracking-widest border-b pb-1", headingClass)}>
            Core Competencies
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {form.skills.map((s) => (
              <span key={s} className={cn("rounded px-2.5 py-0.5 text-xs font-semibold border", skillClass)}>
                {s}
              </span>
            ))}
          </div>
        </section>
      );
    }

    if (sectionId === "experience") {
      if (form.experiences.length === 0) return null;
      return (
        <section key="experience" className="space-y-3">
          <h2 className={cn("text-xs font-bold uppercase tracking-widest border-b pb-1", headingClass)}>
            Professional Experience
          </h2>
          <div className="space-y-4">
            {form.experiences.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <h3 className={cn("text-xs font-bold", template === "classic" || template === "executive" || template === "academic" ? "text-slate-900 font-serif text-sm" : "text-foreground")}>
                    {exp.title} — {exp.company}
                  </h3>
                  <span className="text-[10px] font-semibold text-muted-foreground">
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate} | {exp.location}
                  </span>
                </div>
                <ul className="list-disc pl-4 space-y-1 text-xs text-muted-foreground">
                  {exp.bullets.map((b, idx) => (
                    <li key={idx} className={cn(textClass)}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      );
    }

    if (sectionId === "education") {
      if (form.education.length === 0) return null;
      return (
        <section key="education" className="space-y-3">
          <h2 className={cn("text-xs font-bold uppercase tracking-widest border-b pb-1", headingClass)}>
            Education & Academics
          </h2>
          <div className="space-y-3">
            {form.education.map((ed) => (
              <div key={ed.id} className="space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <h3 className={cn("text-xs font-bold", template === "classic" || template === "executive" || template === "academic" ? "text-slate-900 font-serif text-sm" : "text-foreground")}>
                    {ed.degree}
                  </h3>
                  <span className="text-[10px] font-semibold text-muted-foreground">
                    {ed.year} | {ed.location}
                  </span>
                </div>
                <p className="text-xs font-semibold text-muted-foreground">{ed.institution}</p>
                {ed.details && <p className="text-xs text-muted-foreground italic">{ed.details}</p>}
              </div>
            ))}
          </div>
        </section>
      );
    }

    if (sectionId === "projects") {
      if (form.projects.length === 0) return null;
      return (
        <section key="projects" className="space-y-3">
          <h2 className={cn("text-xs font-bold uppercase tracking-widest border-b pb-1", headingClass)}>
            Key Projects
          </h2>
          <div className="space-y-3">
            {form.projects.map((proj) => (
              <div key={proj.id} className="space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <h3 className={cn("text-xs font-bold", template === "classic" || template === "executive" || template === "academic" ? "text-slate-900 font-serif text-sm" : "text-foreground")}>
                    {proj.name} ({proj.role})
                  </h3>
                  <span className="text-[10px] font-medium text-primary">{proj.link}</span>
                </div>
                <p className="text-[10px] text-muted-foreground font-mono">Tech Stack: {proj.techStack}</p>
                <p className="text-xs text-muted-foreground">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      );
    }

    if (sectionId === "certifications") {
      if (form.certifications.length === 0) return null;
      return (
        <section key="certifications" className="space-y-2">
          <h2 className={cn("text-xs font-bold uppercase tracking-widest border-b pb-1", headingClass)}>
            Certifications
          </h2>
          <ul className="list-disc pl-4 space-y-1 text-xs text-muted-foreground">
            {form.certifications.map((c, idx) => (
              <li key={idx} className={cn(textClass)}>{c}</li>
            ))}
          </ul>
        </section>
      );
    }

    return null;
  };

  return (
    <Card className="overflow-hidden border border-border/70 p-0 shadow-premium bg-card">
      
      {/* Top Banner Toolbar */}
      <div className="border-b border-border/70 bg-gradient-to-r from-primary/5 via-secondary/10 to-transparent p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/20 text-primary hover:bg-primary/30">CV Builder Studio</Badge>
              <Badge className="text-xs border border-border/80 bg-secondary/70 text-foreground">Interactive Sidebar</Badge>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">Enterprise drag-and-drop resume builder</h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={handleUndo} disabled={undoStack.length === 0} variant="outline" size="sm" title="Undo (Alt + Z)">
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button onClick={handleRedo} disabled={redoStack.length === 0} variant="outline" size="sm" title="Redo (Alt + Y)">
              <Redo2 className="h-4 w-4" />
            </Button>
            <Button onClick={resetSample} variant="outline" size="sm">
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Reset Default
            </Button>
            <Button onClick={downloadJson} variant="outline" size="sm" title="Backup (Alt + S)">
              <FileJson className="h-3.5 w-3.5 mr-1.5" /> Export JSON
            </Button>
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-secondary">
              <Upload className="h-3.5 w-3.5 text-muted-foreground mr-1" /> Import JSON
              <input type="file" accept=".json" onChange={handleJsonImport} className="hidden" />
            </label>
          </div>
        </div>

        {/* Shortcuts & Status Display */}
        <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3 text-[11px] text-muted-foreground">
          <div className="flex gap-4">
            <span>⌨️ Undo: <kbd className="px-1 border rounded bg-secondary">Alt+Z</kbd></span>
            <span>⌨️ Redo: <kbd className="px-1 border rounded bg-secondary">Alt+Y</kbd></span>
            <span>⌨️ Save Backup: <kbd className="px-1 border rounded bg-secondary">Alt+S</kbd></span>
          </div>
          {statusMsg && <div className="text-emerald-500 font-semibold flex items-center gap-1"><Check className="h-3 w-3" /> {statusMsg}</div>}
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid lg:grid-cols-12 min-h-[680px]">
        
        {/* Left Column: Drag & Drop Section Sidebar (span 5) */}
        <div className="lg:col-span-5 border-r border-border/70 bg-secondary/10 p-5 space-y-4 max-h-[850px] overflow-y-auto">
          <div className="flex justify-between items-center pb-2 border-b border-border/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Sidebar Sections</h3>
            <span className="text-[10px] text-slate-500">Drag to reorder layout</span>
          </div>

          <div className="space-y-2">
            
            {/* 1. Contact Info section (fixed at top) */}
            <div className="border border-border/80 rounded-xl bg-card overflow-hidden">
              <div 
                className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-secondary/40 transition-all"
                onClick={() => toggleSectionExpand("contact")}
              >
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-slate-500" />
                  <span className="text-xs font-bold text-slate-200">Contact & Header Details</span>
                </div>
                {expandedSections["contact"] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>

              {expandedSections["contact"] && (
                <div className="p-4 border-t border-border/60 bg-secondary/5 space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Full Name</label>
                      <Input value={form.name} onChange={(e) => updateField("name", e.target.value)} className="mt-1 h-8 text-xs" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Target Job Title</label>
                      <Input value={form.targetRole} onChange={(e) => updateField("targetRole", e.target.value)} className="mt-1 h-8 text-xs" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Email</label>
                      <Input value={form.email} onChange={(e) => updateField("email", e.target.value)} className="mt-1 h-8 text-xs" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Phone</label>
                      <Input value={form.phone} onChange={(e) => updateField("phone", e.target.value)} className="mt-1 h-8 text-xs" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Location</label>
                      <Input value={form.location} onChange={(e) => updateField("location", e.target.value)} className="mt-1 h-8 text-xs" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Experience (Yrs)</label>
                      <Input value={form.years} onChange={(e) => updateField("years", e.target.value)} className="mt-1 h-8 text-xs" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">LinkedIn Profile</label>
                      <Input value={form.linkedin} onChange={(e) => updateField("linkedin", e.target.value)} className="mt-1 h-8 text-xs" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Portfolio Website</label>
                      <Input value={form.portfolio} onChange={(e) => updateField("portfolio", e.target.value)} className="mt-1 h-8 text-xs" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Draggable Dynamic Sections */}
            {sectionOrder.map((secId) => {
              const isExpanded = expandedSections[secId];
              const isVisible = sectionVisibility[secId];
              const isOver = dragOverSectionId === secId;

              return (
                <div 
                  key={secId}
                  className={cn(
                    "border rounded-xl bg-card overflow-hidden transition-all duration-200",
                    isOver ? "border-primary ring-1 ring-primary/20" : "border-border/85"
                  )}
                  draggable
                  onDragStart={(e) => handleSectionDragStart(e, secId)}
                  onDragOver={(e) => handleSectionDragOver(e, secId)}
                  onDrop={(e) => handleSectionDrop(e, secId)}
                >
                  <div 
                    className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-secondary/40"
                    onClick={() => toggleSectionExpand(secId)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="cursor-grab p-1 text-slate-500 hover:text-slate-400">
                        <GripVertical className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                        {secId === "summary" && "Professional Summary"}
                        {secId === "skills" && "Core Skills"}
                        {secId === "experience" && "Work Experience"}
                        {secId === "education" && "Education"}
                        {secId === "projects" && "Projects"}
                        {secId === "certifications" && "Certifications"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => toggleSectionVisibility(secId, e)}
                        className="text-slate-500 hover:text-slate-350 p-1 rounded"
                        title={isVisible ? "Hide section in preview" : "Show section in preview"}
                      >
                        {isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-rose-500" />}
                      </button>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
                    </div>
                  </div>

                  {/* Section forms updates */}
                  {isExpanded && (
                    <div className="p-4 border-t border-border/60 bg-secondary/5 space-y-4">
                      
                      {/* Summary Section Editor */}
                      {secId === "summary" && (
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Professional Bio Statement</label>
                          <Textarea 
                            value={form.summary}
                            onChange={(e) => updateField("summary", e.target.value)}
                            rows={4}
                            className="mt-1 text-xs"
                          />
                        </div>
                      )}

                      {/* Skills Section Editor */}
                      {secId === "skills" && (
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <Input 
                              placeholder="New Skill tag" 
                              value={newSkillText} 
                              onChange={(e) => setNewSkillText(e.target.value)} 
                              onKeyDown={(e) => e.key === "Enter" && addSkill()}
                              className="h-8 text-xs"
                            />
                            <Button onClick={addSkill} size="sm">Add</Button>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {form.skills.map(s => (
                              <Badge key={s} className="bg-secondary text-foreground flex items-center gap-1 text-[10px] py-1 border border-border">
                                {s}
                                <button onClick={() => removeSkill(s)} className="text-muted-foreground hover:text-red-500 font-bold">×</button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Work Experience Editor */}
                      {secId === "experience" && (
                        <div className="space-y-4">
                          {form.experiences.map((exp, idx) => (
                            <div key={exp.id} className="p-3 border border-border/80 rounded-xl bg-slate-900/40 space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-500">Position #{idx + 1}</span>
                                <button onClick={() => removeExperience(exp.id)} className="text-red-400 hover:text-red-500 text-xs flex items-center gap-1">
                                  <Trash2 className="h-3 w-3" /> Remove
                                </button>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <Input value={exp.title} placeholder="Role Title" onChange={(e) => updateExperience(exp.id, "title", e.target.value)} className="h-8 text-xs" />
                                <Input value={exp.company} placeholder="Company" onChange={(e) => updateExperience(exp.id, "company", e.target.value)} className="h-8 text-xs" />
                              </div>
                              <div className="grid grid-cols-3 gap-1.5">
                                <Input value={exp.startDate} placeholder="Start Date" onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)} className="h-8 text-xs" />
                                <Input value={exp.endDate} placeholder="End Date" disabled={exp.current} onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)} className="h-8 text-xs" />
                                <label className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase justify-center cursor-pointer">
                                  <input type="checkbox" checked={exp.current} onChange={(e) => updateExperience(exp.id, "current", e.target.checked)} />
                                  Present
                                </label>
                              </div>
                              <Input value={exp.location} placeholder="Location" onChange={(e) => updateExperience(exp.id, "location", e.target.value)} className="h-8 text-xs" />
                              
                              {/* Bullets */}
                              <div className="space-y-1.5">
                                <div className="text-[10px] font-bold text-slate-400 uppercase">Outcomes & Achievements</div>
                                {exp.bullets.map((b, bIdx) => (
                                  <div key={bIdx} className="flex gap-1 items-start">
                                    <textarea 
                                      value={b} 
                                      onChange={(e) => updateExpBullet(exp.id, bIdx, e.target.value)}
                                      className="flex-1 text-[11px] p-1.5 border border-border/80 bg-slate-950 rounded resize-none focus:outline-none"
                                      rows={2}
                                    />
                                    <button onClick={() => removeExpBullet(exp.id, bIdx)} className="text-slate-500 hover:text-red-400 p-1">×</button>
                                  </div>
                                ))}
                                <Button onClick={() => addExpBullet(exp.id)} variant="ghost" size="sm" className="h-7 text-[10px] px-2 text-slate-400">
                                  <Plus className="h-3 w-3 mr-1" /> Add Bullet point
                                </Button>
                              </div>
                            </div>
                          ))}
                          <Button onClick={addExperience} size="sm" className="w-full">
                            <Plus className="h-3.5 w-3.5 mr-1" /> Add Experience Position
                          </Button>
                        </div>
                      )}

                      {/* Education Editor */}
                      {secId === "education" && (
                        <div className="space-y-3">
                          {form.education.map((ed) => (
                            <div key={ed.id} className="p-3 border border-border/80 rounded-xl bg-slate-900/40 space-y-2">
                              <Input value={ed.degree} placeholder="Degree" onChange={(e) => {
                                updateField("education", form.education.map(item => item.id === ed.id ? { ...item, degree: e.target.value } : item));
                              }} className="h-8 text-xs" />
                              <Input value={ed.institution} placeholder="Institution" onChange={(e) => {
                                updateField("education", form.education.map(item => item.id === ed.id ? { ...item, institution: e.target.value } : item));
                              }} className="h-8 text-xs" />
                              <div className="grid grid-cols-2 gap-2">
                                <Input value={ed.year} placeholder="Year" onChange={(e) => {
                                  updateField("education", form.education.map(item => item.id === ed.id ? { ...item, year: e.target.value } : item));
                                }} className="h-8 text-xs" />
                                <Input value={ed.location} placeholder="Location" onChange={(e) => {
                                  updateField("education", form.education.map(item => item.id === ed.id ? { ...item, location: e.target.value } : item));
                                }} className="h-8 text-xs" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Projects Editor */}
                      {secId === "projects" && (
                        <div className="space-y-3">
                          {form.projects.map((proj) => (
                            <div key={proj.id} className="p-3 border border-border/80 rounded-xl bg-slate-900/40 space-y-2">
                              <Input value={proj.name} placeholder="Project Name" onChange={(e) => {
                                updateField("projects", form.projects.map(item => item.id === proj.id ? { ...item, name: e.target.value } : item));
                              }} className="h-8 text-xs" />
                              <Input value={proj.link} placeholder="Link" onChange={(e) => {
                                updateField("projects", form.projects.map(item => item.id === proj.id ? { ...item, link: e.target.value } : item));
                              }} className="h-8 text-xs" />
                              <Textarea value={proj.description} placeholder="Description" onChange={(e) => {
                                updateField("projects", form.projects.map(item => item.id === proj.id ? { ...item, description: e.target.value } : item));
                              }} rows={3} className="text-xs" />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Certifications Editor */}
                      {secId === "certifications" && (
                        <div className="space-y-2">
                          {form.certifications.map((c, idx) => (
                            <div key={idx} className="flex gap-1.5 items-center">
                              <Input value={c} onChange={(e) => {
                                const certs = [...form.certifications];
                                certs[idx] = e.target.value;
                                updateField("certifications", certs);
                              }} className="h-8 text-xs" />
                              <button onClick={() => {
                                updateField("certifications", form.certifications.filter((_, i) => i !== idx));
                              }} className="text-slate-500 hover:text-red-400 p-1">×</button>
                            </div>
                          ))}
                          <Button onClick={() => updateField("certifications", [...form.certifications, "New Certificate Name"])} variant="ghost" size="sm" className="h-7 text-[10px] text-slate-400">
                            <Plus className="h-3 w-3 mr-1" /> Add Certificate
                          </Button>
                        </div>
                      )}

                    </div>
                  )}
                </div>
              );
            })}

          </div>
        </div>

        {/* Right Column: Live Document Preview (span 7) */}
        <div className="lg:col-span-7 p-6 bg-slate-950/20 max-h-[850px] overflow-y-auto space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/70 bg-card p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Layers className="h-4 w-4 text-primary" /> Template Layout:
              </span>
              <Select
                className="h-8 text-xs w-[180px] bg-secondary"
                value={form.template}
                onChange={(e) => updateField("template", e.target.value as any)}
              >
                <option value="modern">Modern Executive</option>
                <option value="classic">Classic Serif</option>
                <option value="executive">Executive Leadership</option>
                <option value="minimal">Minimalist Grid</option>
                <option value="creative">Creative Modernist</option>
                <option value="tech">Technical / Developer</option>
                <option value="consultant">Consultant Portfolio</option>
                <option value="management">Product Management</option>
                <option value="academic">Academic CV</option>
                <option value="graduate">Fresh Graduate</option>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={handleOpenPreviewTab} size="sm" variant="accent">
                <Eye className="h-3.5 w-3.5 mr-1" /> Preview Tab
              </Button>
              <Button onClick={() => window.print()} size="sm" variant="outline">
                <Printer className="h-3.5 w-3.5 mr-1" /> PDF
              </Button>
              <Button onClick={downloadTxt} size="sm" variant="outline">
                <Download className="h-3.5 w-3.5 mr-1" /> TXT
              </Button>
            </div>
          </div>

          {/* Actual CV Preview Rendering */}
          <style dangerouslySetInnerHTML={{ __html: `
            @media print {
              body {
                background: white !important;
                color: black !important;
              }
              header, footer, nav, aside, button, select, input, textarea, .border-b, .bg-secondary, .lg:col-span-5, .lg:col-span-7 > div:first-child {
                display: none !important;
              }
              .lg:col-span-7 {
                padding: 0 !important;
                background: transparent !important;
                max-height: none !important;
                overflow: visible !important;
              }
              #resume-sheet-preview {
                border: none !important;
                box-shadow: none !important;
                padding: 0 !important;
                margin: 0 !important;
                width: 100% !important;
                max-width: 100% !important;
                color: #000000 !important;
              }
              #resume-sheet-preview * {
                color: #000000 !important;
              }
            }
          ` }} />
          <div id="resume-sheet-preview" className="mx-auto max-w-4xl rounded-xl border border-border/80 bg-card p-8 shadow-2xl transition-all min-h-[700px]">
            
            {/* Single Column Sans-Serif templates (modern, minimal, creative, consultant, management, graduate) */}
            {(form.template === "modern" || form.template === "minimal" || form.template === "creative" || form.template === "consultant" || form.template === "management" || form.template === "graduate") && (
              <div className={cn(
                "space-y-6 font-sans text-foreground",
                form.template === "minimal" ? "space-y-4" : ""
              )}>
                <div className={cn(
                  "pb-4",
                  form.template === "modern" ? "border-b-2 border-primary" :
                  form.template === "creative" ? "border-b-2 border-pink-500" :
                  form.template === "consultant" ? "border-b-2 border-emerald-600" :
                  form.template === "management" ? "border-b-2 border-violet-600" :
                  form.template === "graduate" ? "border-b-2 border-sky-500" :
                  "border-b border-border"
                )}>
                  <h1 className={cn(
                    "text-3xl font-bold uppercase tracking-tight text-foreground",
                    form.template === "minimal" ? "text-2xl font-black text-center" : ""
                  )}>
                    {form.name}
                  </h1>
                  <p className={cn(
                    "mt-1 text-sm font-bold",
                    form.template === "minimal" ? "text-center text-muted-foreground text-xs tracking-widest uppercase" : "",
                    form.template === "modern" ? "text-primary" :
                    form.template === "creative" ? "text-pink-500" :
                    form.template === "consultant" ? "text-emerald-600" :
                    form.template === "management" ? "text-violet-600" :
                    form.template === "graduate" ? "text-sky-500" :
                    "text-primary"
                  )}>
                    {result.headline}
                  </p>
                  <p className={cn(
                    "mt-2 text-xs text-muted-foreground",
                    form.template === "minimal" ? "text-center" : ""
                  )}>
                    {[form.email, form.phone, form.location, form.linkedin, form.portfolio]
                      .filter(Boolean)
                      .join(form.template === "minimal" ? " | " : " • ")}
                  </p>
                </div>
                {sectionOrder.map(sectionId => renderTemplateSection(sectionId, form.template))}
              </div>
            )}

            {/* Serif templates (classic, executive, academic) */}
            {(form.template === "classic" || form.template === "executive" || form.template === "academic") && (
              <div className="space-y-6 font-serif text-slate-900 leading-relaxed">
                <div className="text-center border-b border-slate-350 pb-3">
                  <h1 className={cn(
                    "text-3xl font-normal text-slate-900",
                    form.template === "executive" ? "text-4xl font-semibold" : "",
                    form.template === "academic" ? "text-3xl font-bold tracking-tight" : ""
                  )}>{form.name}</h1>
                  <p className="mt-1 text-xs italic text-slate-600">{form.targetRole}</p>
                  <p className="mt-2 text-[11px] text-slate-500 font-sans">
                    {[form.email, form.phone, form.location, form.linkedin, form.portfolio]
                      .filter(Boolean)
                      .join("   •   ")}
                  </p>
                </div>
                {sectionOrder.map(sectionId => renderTemplateSection(sectionId, form.template))}
              </div>
            )}

            {/* Tech Template (Split layout) */}
            {form.template === "tech" && (
              <div className="grid md:grid-cols-[1fr_260px] gap-6 text-foreground font-sans">
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-extrabold text-foreground">{form.name}</h1>
                    <p className="mt-1 text-sm font-semibold text-indigo-400">{form.targetRole}</p>
                  </div>
                  {sectionOrder
                    .filter(id => id !== "skills" && id !== "certifications")
                    .map(sectionId => renderTemplateSection(sectionId, "tech"))}
                </div>

                <div className="border-l border-indigo-900/30 pl-6 space-y-6">
                  <div className="space-y-1 text-xs text-muted-foreground leading-relaxed">
                    <p>📧 {form.email}</p>
                    <p>📞 {form.phone}</p>
                    <p>📍 {form.location}</p>
                    <p>🔗 {form.linkedin}</p>
                    <p>🌐 {form.portfolio}</p>
                  </div>
                  {sectionVisibility["skills"] && renderTemplateSection("skills", "tech")}
                  {sectionVisibility["certifications"] && renderTemplateSection("certifications", "tech")}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

    </Card>
  );
}
