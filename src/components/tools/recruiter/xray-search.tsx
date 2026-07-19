"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Copy, 
  Download, 
  RotateCcw,
  Sparkles, 
  Check,
  Search,
  Globe
} from "lucide-react";
import { ToolShell } from "../tool-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function XRaySearchBuilderTool() {
  const [platform, setPlatform] = useState<"linkedin" | "github" | "stackoverflow" | "custom">("linkedin");
  const [customSite, setCustomSite] = useState("behance.net");
  const [titles, setTitles] = useState<string[]>(["Software Engineer"]);
  const [skills, setSkills] = useState<string[]>(["React"]);
  const [locations, setLocations] = useState<string[]>(["San Francisco", "California"]);
  const [excludes, setExcludes] = useState<string[]>(["Intern"]);

  const [newTitle, setNewTitle] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newExclude, setNewExclude] = useState("");

  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let siteTerm = "";
    if (platform === "linkedin") siteTerm = "site:linkedin.com/in/ or site:linkedin.com/pub/";
    else if (platform === "github") siteTerm = "site:github.com";
    else if (platform === "stackoverflow") siteTerm = "site:stackoverflow.com/users";
    else siteTerm = `site:${customSite}`;

    const formattedTitles = titles.map(t => `"${t.trim()}"`).filter(Boolean);
    const formattedSkills = skills.map(s => `"${s.trim()}"`).filter(Boolean);
    const formattedLocations = locations.map(l => `"${l.trim()}"`).filter(Boolean);
    const formattedExcludes = excludes.map(e => `-${e.trim()}`).filter(Boolean);

    let parts: string[] = [siteTerm];

    // Titles
    if (formattedTitles.length > 0) {
      parts.push(formattedTitles.length === 1 ? formattedTitles[0] : `(${formattedTitles.join(" OR ")})`);
    }

    // Skills
    if (formattedSkills.length > 0) {
      parts.push(formattedSkills.length === 1 ? formattedSkills[0] : `(${formattedSkills.join(" AND ")})`);
    }

    // Locations
    if (formattedLocations.length > 0 && platform !== "github") {
      parts.push(formattedLocations.length === 1 ? formattedLocations[0] : `(${formattedLocations.join(" OR ")})`);
    }

    // Excludes
    if (formattedExcludes.length > 0) {
      parts.push(...formattedExcludes);
    }

    setQuery(parts.join(" "));
  }, [platform, customSite, titles, skills, locations, excludes]);

  const handleCopy = () => {
    navigator.clipboard.writeText(query);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolShell
      tool={{
        slug: "xray-search",
        name: "X-Ray Search Builder",
        description: "Generate site-specific Google search strings to find resumes and profiles directly.",
        category: "recruiter",
        keywords: []
      }}
      onReset={() => {
        setTitles(["Software Engineer"]);
        setSkills(["React"]);
        setLocations(["San Francisco"]);
        setExcludes(["Intern"]);
      }}
    >
      <div className="space-y-6">
        {/* Platform Selection */}
        <div className="bg-secondary/30 p-4 rounded-md space-y-3">
          <span className="text-xs font-semibold text-muted-foreground uppercase block">Target Platform</span>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "linkedin", label: "LinkedIn Profiles" },
              { id: "github", label: "GitHub Users" },
              { id: "stackoverflow", label: "Stack Overflow" },
              { id: "custom", label: "Custom Website" }
            ].map((p) => (
              <Button
                key={p.id}
                variant={platform === p.id ? "primary" : "outline"}
                size="sm"
                onClick={() => setPlatform(p.id as any)}
              >
                {p.label}
              </Button>
            ))}
          </div>

          {platform === "custom" && (
            <div className="flex gap-2 max-w-sm mt-3">
              <span className="flex items-center text-sm font-mono text-muted-foreground bg-secondary px-3 border border-border/70 border-r-0 rounded-l">site:</span>
              <Input
                className="rounded-l-none font-mono"
                placeholder="e.g. behance.net"
                value={customSite}
                onChange={(e) => setCustomSite(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Input Fields */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Job Titles */}
          <Card className="p-4 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary">Job Titles</h3>
            <div className="space-y-2">
              <div className="flex gap-1">
                <Input
                  placeholder="e.g. Software Engineer"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newTitle.trim()) {
                      setTitles([...titles, newTitle.trim()]);
                      setNewTitle("");
                    }
                  }}
                />
                <Button size="icon" onClick={() => { if (newTitle.trim()) { setTitles([...titles, newTitle.trim()]); setNewTitle(""); } }}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-1 max-h-[120px] overflow-y-auto">
                {titles.map((t, i) => (
                  <div key={i} className="flex justify-between items-center bg-secondary/30 px-2 py-1 rounded text-xs font-semibold">
                    <span>{t}</span>
                    <button onClick={() => setTitles(titles.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700">&times;</button>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Required Skills */}
          <Card className="p-4 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-green-500">Skills</h3>
            <div className="space-y-2">
              <div className="flex gap-1">
                <Input
                  placeholder="e.g. React"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newSkill.trim()) {
                      setSkills([...skills, newSkill.trim()]);
                      setNewSkill("");
                    }
                  }}
                />
                <Button size="icon" onClick={() => { if (newSkill.trim()) { setSkills([...skills, newSkill.trim()]); setNewSkill(""); } }}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-1 max-h-[120px] overflow-y-auto">
                {skills.map((s, i) => (
                  <div key={i} className="flex justify-between items-center bg-secondary/30 px-2 py-1 rounded text-xs font-semibold">
                    <span>{s}</span>
                    <button onClick={() => setSkills(skills.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700">&times;</button>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Locations */}
          <Card className="p-4 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-yellow-500">Locations</h3>
            <div className="space-y-2">
              <div className="flex gap-1">
                <Input
                  placeholder="e.g. San Francisco"
                  value={newLocation}
                  disabled={platform === "github"}
                  onChange={(e) => setNewLocation(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newLocation.trim()) {
                      setLocations([...locations, newLocation.trim()]);
                      setNewLocation("");
                    }
                  }}
                />
                <Button size="icon" disabled={platform === "github"} onClick={() => { if (newLocation.trim()) { setLocations([...locations, newLocation.trim()]); setNewLocation(""); } }}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-1 max-h-[120px] overflow-y-auto">
                {locations.map((l, i) => (
                  <div key={i} className="flex justify-between items-center bg-secondary/30 px-2 py-1 rounded text-xs font-semibold">
                    <span>{l}</span>
                    <button onClick={() => setLocations(locations.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700">&times;</button>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Excluded Keywords */}
          <Card className="p-4 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-red-500">Exclusions</h3>
            <div className="space-y-2">
              <div className="flex gap-1">
                <Input
                  placeholder="e.g. Intern"
                  value={newExclude}
                  onChange={(e) => setNewExclude(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newExclude.trim()) {
                      setExcludes([...excludes, newExclude.trim()]);
                      setNewExclude("");
                    }
                  }}
                />
                <Button size="icon" onClick={() => { if (newExclude.trim()) { setExcludes([...excludes, newExclude.trim()]); setNewExclude(""); } }}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-1 max-h-[120px] overflow-y-auto">
                {excludes.map((ex, i) => (
                  <div key={i} className="flex justify-between items-center bg-secondary/30 px-2 py-1 rounded text-xs font-semibold">
                    <span>{ex}</span>
                    <button onClick={() => setExcludes(excludes.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700">&times;</button>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Live Query Display */}
        {query && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Google X-Ray Query String</label>
            <div className="p-4 bg-secondary/40 border border-border/70 rounded-md font-mono text-sm leading-relaxed text-foreground select-all break-all">
              {query}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="primary" size="sm" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy X-Ray String"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
