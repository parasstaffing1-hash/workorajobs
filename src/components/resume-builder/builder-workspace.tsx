"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Download, 
  Upload, 
  Printer, 
  FileText, 
  Sparkles, 
  Undo2, 
  Redo2, 
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  FolderOpen
} from "lucide-react";
import { ResumeData, ResumeDataSchema } from "@/lib/resume-builder/validation";
import { ACTION_VERBS, SUGGESTED_SKILLS, DEGREES, COUNTRIES, LANGUAGES, PRESETS_STYLES } from "@/lib/resume-builder/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: "John Doe",
    title: "Senior Full Stack Engineer",
    email: "john.doe@example.com",
    phone: "+1 (555) 019-2834",
    location: "San Francisco, CA",
    socialLinks: {
      linkedin: "https://linkedin.com/in/johndoe",
      github: "https://github.com/johndoe",
      portfolio: "https://johndoe.dev",
      twitter: ""
    }
  },
  summary: "Results-driven software engineer with 8+ years of experience specializing in high-performance web applications, cloud infrastructure, and developer toolkits. Proven track record of improving site loading speeds by 40% and leading remote developer squads.",
  workExperiences: [
    {
      id: "w1",
      role: "Lead Software Architect",
      company: "Stripe",
      location: "San Francisco, CA",
      startDate: "2021-06",
      endDate: "",
      isCurrent: true,
      description: "Spearheaded the migration of core payment settlement pages to modern React Server Components, resulting in a 35% decrease in client bundle sizes.",
      bullets: [
        "Led a distributed team of 8 senior developers building API integrations.",
        "Optimized database query indexes, lowering median API response latency to 140ms.",
        "Scaled background queue handling pipelines to support 15,000 transactions per second."
      ]
    }
  ],
  education: [
    {
      id: "e1",
      degree: "B.S. in Computer Science",
      institution: "Stanford University",
      location: "Stanford, CA",
      startDate: "2012-09",
      endDate: "2016-06",
      gpa: "3.85",
      details: "Specialized in distributed systems and database management structures."
    }
  ],
  skills: [
    { name: "TypeScript", level: "Expert", category: "Languages" },
    { name: "React", level: "Expert", category: "Frontend" },
    { name: "Next.js", level: "Advanced", category: "Frontend" },
    { name: "Node.js", level: "Expert", category: "Backend" },
    { name: "PostgreSQL", level: "Advanced", category: "Database" },
    { name: "Docker", level: "Advanced", category: "DevOps" }
  ],
  projects: [
    {
      id: "p1",
      name: "Open Source Payment Wrapper",
      role: "Creator",
      url: "https://github.com/johndoe/wrapper",
      techStack: ["TypeScript", "Next.js", "Redis"],
      description: "A lightweight, secure SDK to integrate multiple gateway processors using uniform REST adapters.",
      bullets: [
        "Received 1,200+ stars on GitHub and handles active requests from 40 production apps.",
        "Documented developer integration guide decreasing developer onboarding friction."
      ]
    }
  ],
  certifications: [
    {
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services (AWS)",
      issueDate: "2023-04",
      expiryDate: "2026-04",
      credentialId: "AWS-CSA-9908",
      url: ""
    }
  ],
  achievements: ["Delivered keynote speech at tech conference on Next.js hydration optimizations.", "Won internal Stripe engineering hackathon (2022)."],
  awards: [{ title: "Outstanding Dev Award", issuer: "TechCorp", date: "2020" }],
  languages: [{ language: "English", proficiency: "Native" }, { language: "Spanish", proficiency: "Conversational" }],
  volunteer: [],
  publications: [],
  patents: [],
  research: [],
  training: [],
  internships: [],
  references: [],
  customSections: []
};

export function BuilderWorkspace() {
  const [data, setData] = useState<ResumeData>(initialResumeData);
  const [history, setHistory] = useState<ResumeData[]>([]);
  const [redoStack, setRedoStack] = useState<ResumeData[]>([]);
  const [activeSection, setActiveSection] = useState("personalInfo");
  const [styleConfig, setStyleConfig] = useState({
    fontFamily: "sans",
    fontSize: "md",
    themeColor: "#2563eb",
    lineHeight: "normal",
    pageSize: "A4",
    marginSize: "normal"
  });

  // Load from localstorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("workora-cv-builder-draft");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const validated = ResumeDataSchema.parse(parsed);
        setData(validated);
      } catch (e) {}
    }
  }, []);

  // Autosave
  const updateState = (newData: ResumeData) => {
    setHistory(prev => [...prev.slice(-19), data]); // Max history 20
    setRedoStack([]);
    setData(newData);
    localStorage.setItem("workora-cv-builder-draft", JSON.stringify(newData));
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, data]);
    setData(previous);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    setHistory(prev => [...prev, data]);
    setData(next);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        const validated = ResumeDataSchema.parse(parsed);
        updateState(validated);
      } catch (err) {
        alert("Failed to parse or validate import JSON file.");
      }
    };
    reader.readAsText(file);
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.personalInfo.fullName.replace(/\s+/g, "_")}_resume.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportTxt = () => {
    let txt = `==================================================\n`;
    txt += `${data.personalInfo.fullName.toUpperCase()}\n`;
    if (data.personalInfo.title) {
      txt += `${data.personalInfo.title}\n`;
    }
    txt += `==================================================\n`;
    txt += `Email: ${data.personalInfo.email}\n`;
    if (data.personalInfo.phone) txt += `Phone: ${data.personalInfo.phone}\n`;
    if (data.personalInfo.location) txt += `Location: ${data.personalInfo.location}\n`;
    if (data.personalInfo.socialLinks?.linkedin) txt += `LinkedIn: ${data.personalInfo.socialLinks.linkedin}\n`;
    if (data.personalInfo.socialLinks?.portfolio) txt += `Portfolio: ${data.personalInfo.socialLinks.portfolio}\n`;
    txt += `\n`;

    if (data.summary) {
      txt += `--------------------------------------------------\n`;
      txt += `PROFESSIONAL SUMMARY\n`;
      txt += `--------------------------------------------------\n`;
      txt += `${data.summary}\n\n`;
    }

    if (data.workExperiences.length > 0) {
      txt += `--------------------------------------------------\n`;
      txt += `WORK EXPERIENCE\n`;
      txt += `--------------------------------------------------\n`;
      data.workExperiences.forEach((exp) => {
        txt += `${exp.role} | ${exp.company}\n`;
        txt += `${exp.startDate} - ${exp.isCurrent ? "Present" : exp.endDate}`;
        if (exp.location) txt += ` | ${exp.location}`;
        txt += `\n`;
        if (exp.description) txt += `${exp.description}\n`;
        exp.bullets.forEach((bullet) => {
          txt += `- ${bullet}\n`;
        });
        txt += `\n`;
      });
    }

    if (data.education.length > 0) {
      txt += `--------------------------------------------------\n`;
      txt += `EDUCATION\n`;
      txt += `--------------------------------------------------\n`;
      data.education.forEach((ed) => {
        txt += `${ed.degree} | ${ed.institution}\n`;
        txt += `${ed.endDate || "Graduated"}`;
        if (ed.location) txt += ` | ${ed.location}`;
        if (ed.gpa) txt += ` | GPA: ${ed.gpa}`;
        txt += `\n\n`;
      });
    }

    if (data.skills.length > 0) {
      txt += `--------------------------------------------------\n`;
      txt += `KEY SKILLS\n`;
      txt += `--------------------------------------------------\n`;
      txt += data.skills.map((s) => s.name).join(", ") + `\n`;
    }

    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.personalInfo.fullName.replace(/\s+/g, "_")}_resume.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ATS audit logic
  const calculateAtsScore = () => {
    let score = 30; // base score for starting
    if (data.personalInfo.fullName) score += 10;
    if (data.personalInfo.email) score += 10;
    if (data.personalInfo.phone) score += 5;
    if (data.summary) score += 10;
    if (data.workExperiences.length > 0) score += 15;
    if (data.education.length > 0) score += 10;
    if (data.skills.length >= 5) score += 10;
    return Math.min(100, score);
  };

  const atsScore = calculateAtsScore();

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Full-Width Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card/80 border border-border/70 p-4 rounded-xl backdrop-blur-xl shadow-sm print:hidden">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          <h2 className="text-xl font-bold tracking-tight text-foreground">CV Builder Studio</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleUndo} disabled={history.length === 0} title="Undo">
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleRedo} disabled={redoStack.length === 0} title="Redo">
            <Redo2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => updateState(initialResumeData)} title="Reset Workspace">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold border border-border/70 bg-card hover:bg-secondary transition-colors">
            <Upload className="h-4 w-4 text-muted-foreground" />
            Import JSON
            <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
          </label>
          <Button variant="outline" size="sm" onClick={handleExportJson}>
            <Download className="h-4 w-4" />
            Export JSON
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportTxt}>
            <FileText className="h-4 w-4" />
            Export TXT
          </Button>
          <Button variant="primary" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
            Print / Save PDF
          </Button>
        </div>
      </div>

      {/* Main Responsive Workspace Flex Layout */}
      <div className="flex flex-col lg:flex-row items-start gap-8 w-full justify-center">
        {/* Left Editor Pane (Limited to 400px width) */}
        <div className="w-full lg:w-[400px] lg:max-w-[400px] shrink-0 space-y-6">
          {/* ATS & Completeness Overview */}
          <div className="bg-secondary/30 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 border border-border/50">
          <div className="space-y-1 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">ATS Compatibility Score:</span>
              <span className="text-lg font-bold text-primary">{atsScore}%</span>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden min-w-[200px]">
              <div className="bg-primary h-full transition-all" style={{ width: `${atsScore}%` }} />
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Format OK
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Contact Details Included
            </div>
          </div>
        </div>

        {/* Dynamic Form Sections */}
        <div className="glass-panel p-6 rounded-lg border border-border/70 space-y-6">
          <div className="flex flex-wrap gap-2 border-b border-border/50 pb-4">
            {["personalInfo", "summary", "experience", "education", "skills", "projects", "certifications", "languages"].map((sec) => (
              <button
                key={sec}
                onClick={() => setActiveSection(sec)}
                className={cn(
                  "px-3 py-1.5 rounded text-xs font-semibold capitalize transition-all",
                  activeSection === sec 
                    ? "bg-primary text-primary-foreground shadow"
                    : "bg-secondary/40 text-muted-foreground hover:bg-secondary/80"
                )}
              >
                {sec === "personalInfo" ? "Personal Info" : sec}
              </button>
            ))}
          </div>

          {/* Personal Info Form */}
          {activeSection === "personalInfo" && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Full Name</label>
                  <Input
                    value={data.personalInfo.fullName}
                    onChange={(e) => updateState({
                      ...data,
                      personalInfo: { ...data.personalInfo, fullName: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Job Title</label>
                  <Input
                    value={data.personalInfo.title}
                    onChange={(e) => updateState({
                      ...data,
                      personalInfo: { ...data.personalInfo, title: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Email Address</label>
                  <Input
                    type="email"
                    value={data.personalInfo.email}
                    onChange={(e) => updateState({
                      ...data,
                      personalInfo: { ...data.personalInfo, email: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Phone Number</label>
                  <Input
                    value={data.personalInfo.phone}
                    onChange={(e) => updateState({
                      ...data,
                      personalInfo: { ...data.personalInfo, phone: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Location (City, State/Country)</label>
                  <Input
                    value={data.personalInfo.location}
                    onChange={(e) => updateState({
                      ...data,
                      personalInfo: { ...data.personalInfo, location: e.target.value }
                    })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Summary Form */}
          {activeSection === "summary" && (
            <div className="space-y-4">
              <label className="text-xs font-bold text-muted-foreground uppercase block">Professional Summary</label>
              <Textarea
                className="min-h-[150px] leading-relaxed"
                placeholder="Write a powerful statement describing your career achievements..."
                value={data.summary}
                onChange={(e) => updateState({ ...data, summary: e.target.value })}
              />
            </div>
          )}

          {/* Work Experience Form */}
          {activeSection === "experience" && (
            <div className="space-y-6">
              {data.workExperiences.map((exp, idx) => (
                <div key={exp.id} className="p-4 bg-secondary/20 rounded-lg border border-border/50 relative space-y-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 text-red-500 hover:bg-red-500/10"
                    onClick={() => {
                      const updated = data.workExperiences.filter(item => item.id !== exp.id);
                      updateState({ ...data, workExperiences: updated });
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Job Title / Role</label>
                      <Input
                        value={exp.role}
                        onChange={(e) => {
                          const updated = [...data.workExperiences];
                          updated[idx].role = e.target.value;
                          updateState({ ...data, workExperiences: updated });
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Company Name</label>
                      <Input
                        value={exp.company}
                        onChange={(e) => {
                          const updated = [...data.workExperiences];
                          updated[idx].company = e.target.value;
                          updateState({ ...data, workExperiences: updated });
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Start Date</label>
                      <Input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => {
                          const updated = [...data.workExperiences];
                          updated[idx].startDate = e.target.value;
                          updateState({ ...data, workExperiences: updated });
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-muted-foreground uppercase">End Date</label>
                      <Input
                        type="month"
                        value={exp.endDate}
                        disabled={exp.isCurrent}
                        onChange={(e) => {
                          const updated = [...data.workExperiences];
                          updated[idx].endDate = e.target.value;
                          updateState({ ...data, workExperiences: updated });
                        }}
                      />
                    </div>
                    <label className="flex items-center gap-2 text-xs sm:col-span-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={exp.isCurrent}
                        onChange={(e) => {
                          const updated = [...data.workExperiences];
                          updated[idx].isCurrent = e.target.checked;
                          if (e.target.checked) updated[idx].endDate = "";
                          updateState({ ...data, workExperiences: updated });
                        }}
                      />
                      I currently work here
                    </label>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newExp = {
                    id: Math.random().toString(),
                    role: "New Role",
                    company: "New Company",
                    startDate: "",
                    endDate: "",
                    isCurrent: false,
                    bullets: []
                  };
                  updateState({ ...data, workExperiences: [...data.workExperiences, newExp] });
                }}
              >
                <Plus className="h-4 w-4" /> Add Experience Entry
              </Button>
            </div>
          )}

          {/* Education Form */}
          {activeSection === "education" && (
            <div className="space-y-6">
              {data.education.map((ed, idx) => (
                <div key={ed.id} className="p-4 bg-secondary/20 rounded-lg border border-border/50 relative space-y-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 text-red-500 hover:bg-red-500/10"
                    onClick={() => {
                      const updated = data.education.filter(item => item.id !== ed.id);
                      updateState({ ...data, education: updated });
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Degree / Qualification</label>
                      <Input
                        value={ed.degree}
                        onChange={(e) => {
                          const updated = [...data.education];
                          updated[idx].degree = e.target.value;
                          updateState({ ...data, education: updated });
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Institution / School</label>
                      <Input
                        value={ed.institution}
                        onChange={(e) => {
                          const updated = [...data.education];
                          updated[idx].institution = e.target.value;
                          updateState({ ...data, education: updated });
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-muted-foreground uppercase">Graduation Date</label>
                      <Input
                        type="month"
                        value={ed.endDate || ""}
                        onChange={(e) => {
                          const updated = [...data.education];
                          updated[idx].endDate = e.target.value;
                          updateState({ ...data, education: updated });
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-muted-foreground uppercase">GPA / Grade (Optional)</label>
                      <Input
                        value={ed.gpa || ""}
                        placeholder="e.g. 3.9/4.0"
                        onChange={(e) => {
                          const updated = [...data.education];
                          updated[idx].gpa = e.target.value;
                          updateState({ ...data, education: updated });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newEd = {
                    id: Math.random().toString(),
                    degree: "Degree / Course Name",
                    institution: "School Name",
                    endDate: ""
                  };
                  updateState({ ...data, education: [...data.education, newEd] });
                }}
              >
                <Plus className="h-4 w-4" /> Add Education Entry
              </Button>
            </div>
          )}

          {/* Skills Form */}
          {activeSection === "skills" && (
            <div className="space-y-4">
              <label className="text-xs font-bold text-muted-foreground uppercase block">Skills List</label>
              <div className="flex flex-wrap gap-2 p-3 bg-secondary/20 rounded border border-border/70">
                {data.skills.map((s, idx) => (
                  <span key={idx} className="flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 px-2 py-1 rounded text-xs font-semibold">
                    {s.name}
                    <button
                      className="text-red-500 hover:text-red-700 ml-1"
                      onClick={() => {
                        const updated = data.skills.filter((_, i) => i !== idx);
                        updateState({ ...data, skills: updated });
                      }}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  id="skill-input"
                  className="flex-1 bg-background border border-border/70 rounded px-3 py-1 text-sm"
                  placeholder="Enter a new skill..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const val = e.currentTarget.value.trim();
                      if (val) {
                        updateState({ ...data, skills: [...data.skills, { name: val }] });
                        e.currentTarget.value = "";
                      }
                    }
                  }}
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    const inputEl = document.getElementById("skill-input") as HTMLInputElement;
                    const val = inputEl?.value.trim();
                    if (val) {
                      updateState({ ...data, skills: [...data.skills, { name: val }] });
                      inputEl.value = "";
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Live Preview Panel (occupies rest of screen on desktop, centered) */}
      <div className="flex-1 w-full space-y-4 print:w-full">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-3 print:hidden">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">LIVE PREVIEW</span>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS_STYLES.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setStyleConfig({
                  ...styleConfig,
                  fontFamily: preset.fontFamily,
                  fontSize: preset.fontSize,
                  themeColor: preset.themeColor,
                  lineHeight: preset.lineHeight
                })}
                className="text-xs px-2.5 py-1 rounded border border-border/70 bg-card hover:bg-secondary transition-all"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Outer centered canvas workspace */}
        <div className="w-full flex-1 min-w-0 flex justify-center bg-secondary/15 p-4 sm:p-8 rounded-xl border border-border/50 overflow-x-auto">
          {/* Output Document Layout A4 Grid */}
          <div 
            className={cn(
              "bg-white text-slate-800 p-8 sm:p-12 shadow-2xl rounded-lg border border-slate-200 aspect-[1/1.41] w-full max-w-[800px] leading-relaxed transition-all",
              styleConfig.fontFamily === "serif" && "font-serif",
              styleConfig.fontFamily === "mono" && "font-mono",
              styleConfig.fontFamily === "sans" && "font-sans",
              styleConfig.fontSize === "sm" && "text-xs",
              styleConfig.fontSize === "md" && "text-sm",
              styleConfig.fontSize === "lg" && "text-base"
            )}
            style={{ minHeight: "297mm" }}
          >
            {/* Header */}
            <div className="border-b-2 pb-4 mb-6" style={{ borderColor: styleConfig.themeColor }}>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 uppercase">
              {data.personalInfo.fullName}
            </h1>
            {data.personalInfo.title && (
              <p className="font-semibold mt-1" style={{ color: styleConfig.themeColor }}>
                {data.personalInfo.title}
              </p>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs mt-2 text-slate-500">
              {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
              {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
              {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
              {data.personalInfo.socialLinks?.linkedin && <span>{data.personalInfo.socialLinks.linkedin}</span>}
              {data.personalInfo.socialLinks?.portfolio && <span>{data.personalInfo.socialLinks.portfolio}</span>}
            </div>
          </div>

          {/* Professional Summary */}
          {data.summary && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ color: styleConfig.themeColor, borderColor: "#e2e8f0" }}>
                Professional Summary
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">{data.summary}</p>
            </div>
          )}

          {/* Experience */}
          {data.workExperiences.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-3" style={{ color: styleConfig.themeColor, borderColor: "#e2e8f0" }}>
                Work Experience
              </h2>
              <div className="space-y-4">
                {data.workExperiences.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-slate-800">{exp.role}</h3>
                      <span className="text-xs text-slate-500 font-medium">
                        {exp.startDate} – {exp.isCurrent ? "Present" : exp.endDate}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-slate-600">
                      {exp.company} {exp.location && `• ${exp.location}`}
                    </div>
                    {exp.description && <p className="text-slate-600 text-sm mt-1">{exp.description}</p>}
                    {exp.bullets.length > 0 && (
                      <ul className="list-disc pl-5 text-sm text-slate-600 mt-1 space-y-0.5">
                        {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-3" style={{ color: styleConfig.themeColor, borderColor: "#e2e8f0" }}>
                Education
              </h2>
              <div className="space-y-3">
                {data.education.map((ed) => (
                  <div key={ed.id} className="space-y-0.5">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-slate-800">{ed.degree}</h3>
                      <span className="text-xs text-slate-500 font-medium">{ed.endDate}</span>
                    </div>
                    <div className="text-xs font-medium text-slate-600">
                      {ed.institution} {ed.location && `• ${ed.location}`}
                    </div>
                    {ed.gpa && <p className="text-xs text-slate-500">GPA: {ed.gpa}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {data.skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ color: styleConfig.themeColor, borderColor: "#e2e8f0" }}>
                Key Skills
              </h2>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {data.skills.map((s, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded text-xs font-medium">
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
</div>
  );
}
