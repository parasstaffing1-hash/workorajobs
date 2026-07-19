"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Copy, 
  Download, 
  RotateCcw,
  Sparkles, 
  CheckCircle,
  AlertTriangle,
  FileText,
  Search,
  Check
} from "lucide-react";
import { ToolShell } from "../tool-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

// Preset Roles Data
const ROLE_PRESETS = [
  {
    name: "Software Engineer",
    titles: ["Software Engineer", "Software Developer", "Full Stack Developer", "SWE"],
    skills: ["TypeScript", "React", "Node.js", "JavaScript"],
    excludes: ["Manager", "Intern", "Director"]
  },
  {
    name: "Java Developer",
    titles: ["Java Developer", "Java Engineer", "J2EE Developer", "Java Consultant"],
    skills: ["Java", "Spring Boot", "Microservices", "Hibernate"],
    excludes: ["PHP", "Intern"]
  },
  {
    name: "DevOps Engineer",
    titles: ["DevOps Engineer", "DevOps Specialist", "Site Reliability Engineer", "SRE"],
    skills: ["Docker", "Kubernetes", "AWS", "Terraform", "CI/CD"],
    excludes: ["QA", "Intern"]
  },
  {
    name: "Recruiter",
    titles: ["Technical Recruiter", "Recruiter", "Talent Acquisition Partner", "Sourcer"],
    skills: ["Sourcing", "ATS", "Interviewing", "Cold Reachout"],
    excludes: ["Sales Coordinator"]
  }
];

export default function BooleanSearchBuilderTool() {
  const [titles, setTitles] = useState<string[]>(["Software Engineer"]);
  const [skills, setSkills] = useState<string[]>(["TypeScript", "React"]);
  const [excludes, setExcludes] = useState<string[]>(["Intern"]);
  
  const [newTitle, setNewTitle] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [newExclude, setNewExclude] = useState("");

  const [platform, setPlatform] = useState<"standard" | "linkedin" | "google">("standard");
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);

  // Generate string deterministically
  useEffect(() => {
    const formattedTitles = titles.map(t => t.trim().includes(" ") ? `"${t.trim()}"` : t.trim()).filter(Boolean);
    const formattedSkills = skills.map(s => s.trim().includes(" ") ? `"${s.trim()}"` : s.trim()).filter(Boolean);
    const formattedExcludes = excludes.map(e => e.trim().includes(" ") ? `"${e.trim()}"` : e.trim()).filter(Boolean);

    let parts: string[] = [];

    // Title group
    if (formattedTitles.length > 0) {
      if (formattedTitles.length === 1) {
        parts.push(formattedTitles[0]);
      } else {
        parts.push(`(${formattedTitles.join(" OR ")})`);
      }
    }

    // Skills group
    if (formattedSkills.length > 0) {
      if (formattedSkills.length === 1) {
        parts.push(formattedSkills[0]);
      } else {
        parts.push(`(${formattedSkills.join(" AND ")})`);
      }
    }

    let finalQuery = parts.join(" AND ");

    // Excludes group
    if (formattedExcludes.length > 0) {
      const excludeStr = formattedExcludes.length === 1 
        ? formattedExcludes[0] 
        : `(${formattedExcludes.join(" OR ")})`;

      if (platform === "google") {
        // Google uses minus sign prefix for exclusion
        finalQuery += ` -${excludeStr}`;
      } else {
        // Standard uses NOT operator
        finalQuery += finalQuery ? ` NOT ${excludeStr}` : `NOT ${excludeStr}`;
      }
    }

    setQuery(finalQuery);
  }, [titles, skills, excludes, platform]);

  const loadPreset = (presetName: string) => {
    const preset = ROLE_PRESETS.find(p => p.name === presetName);
    if (preset) {
      setTitles(preset.titles);
      setSkills(preset.skills);
      setExcludes(preset.excludes);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(query);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([query], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "boolean-query.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolShell
      tool={{
        slug: "boolean-search",
        name: "Boolean String Generator",
        description: "Visually construct optimized boolean search strings for recruiters.",
        category: "recruiter",
        keywords: []
      }}
      onReset={() => {
        setTitles(["Software Engineer"]);
        setSkills(["TypeScript", "React"]);
        setExcludes(["Intern"]);
      }}
    >
      <div className="space-y-6">
        {/* Preset Selectors */}
        <div className="bg-secondary/30 p-4 rounded-md space-y-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase">Load Preset Template</span>
          <div className="flex flex-wrap gap-2">
            {ROLE_PRESETS.map((p) => (
              <Button
                key={p.name}
                variant="outline"
                size="sm"
                onClick={() => loadPreset(p.name)}
              >
                {p.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Builder Panels */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Job Titles Group */}
          <Card className="p-4 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary">Job Titles</h3>
            <div className="space-y-2">
              <div className="flex gap-1">
                <Input
                  placeholder="Add job title..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newTitle.trim()) {
                      setTitles([...titles, newTitle.trim()]);
                      setNewTitle("");
                    }
                  }}
                />
                <Button 
                  size="icon" 
                  onClick={() => {
                    if (newTitle.trim()) {
                      setTitles([...titles, newTitle.trim()]);
                      setNewTitle("");
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
                {titles.map((t, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-secondary/30 p-2 rounded text-xs font-medium text-foreground">
                    <span>{t}</span>
                    <button onClick={() => setTitles(titles.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700">
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Core Skills Group */}
          <Card className="p-4 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-green-500">Required Skills</h3>
            <div className="space-y-2">
              <div className="flex gap-1">
                <Input
                  placeholder="Add skill..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newSkill.trim()) {
                      setSkills([...skills, newSkill.trim()]);
                      setNewSkill("");
                    }
                  }}
                />
                <Button 
                  size="icon"
                  onClick={() => {
                    if (newSkill.trim()) {
                      setSkills([...skills, newSkill.trim()]);
                      setNewSkill("");
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
                {skills.map((s, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-secondary/30 p-2 rounded text-xs font-medium text-foreground">
                    <span>{s}</span>
                    <button onClick={() => setSkills(skills.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700">
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Excluded Keywords Group */}
          <Card className="p-4 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-red-500">Excluded (NOT)</h3>
            <div className="space-y-2">
              <div className="flex gap-1">
                <Input
                  placeholder="Add exclusion..."
                  value={newExclude}
                  onChange={(e) => setNewExclude(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newExclude.trim()) {
                      setExcludes([...excludes, newExclude.trim()]);
                      setNewExclude("");
                    }
                  }}
                />
                <Button 
                  size="icon"
                  onClick={() => {
                    if (newExclude.trim()) {
                      setExcludes([...excludes, newExclude.trim()]);
                      setNewExclude("");
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
                {excludes.map((e, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-secondary/30 p-2 rounded text-xs font-medium text-foreground">
                    <span>{e}</span>
                    <button onClick={() => setExcludes(excludes.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700">
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Sourcing Platform Selectors */}
        <div className="flex gap-4 border-b border-border/70 pb-3">
          <button
            onClick={() => setPlatform("standard")}
            className={`text-sm font-semibold pb-1.5 border-b-2 transition-all ${
              platform === "standard" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Standard Boolean
          </button>
          <button
            onClick={() => setPlatform("google")}
            className={`text-sm font-semibold pb-1.5 border-b-2 transition-all ${
              platform === "google" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Google search (implicit space)
          </button>
        </div>

        {/* Live Query Output Display */}
        {query && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Boolean Search String</label>
            <div className="p-4 bg-secondary/40 border border-border/70 rounded-md font-mono text-sm leading-relaxed text-foreground select-all break-all">
              {query}
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4" /> Export TXT
              </Button>
              <Button variant="primary" size="sm" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy String"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
