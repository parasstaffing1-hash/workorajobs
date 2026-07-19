"use client";

import {
  Check,
  Clipboard,
  Copy,
  Download,
  FileText,
  Loader2,
  RefreshCw,
  Sparkles,
  Wand2,
} from "lucide-react";
import { useState } from "react";

import { triggerConfetti } from "@/components/ai/gamification-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export type CoverLetterTone =
  | "Professional"
  | "Executive"
  | "Friendly"
  | "Technical"
  | "Consulting"
  | "Finance"
  | "Startup"
  | "Government"
  | "Healthcare"
  | "Academic";

const COVER_LETTER_TONES: CoverLetterTone[] = [
  "Professional",
  "Executive",
  "Friendly",
  "Technical",
  "Consulting",
  "Finance",
  "Startup",
  "Government",
  "Healthcare",
  "Academic",
];

export function CoverLetterBuilder() {
  const [jobTitle, setJobTitle] = useState("Senior Product Designer");
  const [companyName, setCompanyName] = useState("Northstar Cloud");
  const [hiringManager, setHiringManager] = useState("Sarah Jenkins");
  const [tone, setTone] = useState<CoverLetterTone>("Professional");
  const [jobDescription, setJobDescription] = useState(
    "Looking for a Senior Product Designer with expertise in enterprise SaaS, accessibility, design systems, and user research to lead core HR workflows.",
  );
  const [keyAchievements, setKeyAchievements] = useState(
    "Led design system redacting feature delivery by 22%. Improved candidate task completion by 31%. Designed B2B compliance tools for 40k managers.",
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [outputLetter, setOutputLetter] = useState(
    `Dear ${hiringManager || "Hiring Team"},\n\nI am writing to express my strong enthusiasm for the ${jobTitle} position at ${companyName}. With a proven track record in building scalable enterprise SaaS workflows and driving measurable user impact, I am eager to contribute to your design and product strategy.\n\nThroughout my career, I have prioritized user-centered design, accessibility (WCAG AA), and robust design system architecture. Recently, I led key design initiatives that improved user task completion by 31% and reduced overall feature delivery timelines by 22%.\n\n${companyName}'s focus on innovation and high-quality product experiences aligns perfectly with my expertise. I look forward to the opportunity to discuss how my design background can help accelerate your key goals.\n\nSincerely,\nAisha Rahman`,
  );

  const handleGenerateResult = (text: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 4);
    const payload = {
      title: "Cover Letter Result",
      originalUrl: "/ai-tools?tool=cover-letter-builder",
      inputs: {
        jobTitle,
        companyName,
        hiringManager,
        tone,
        jobDescription,
        keyAchievements,
      },
      resultText: text,
    };
    localStorage.setItem(`workora_tool_result_${id}`, JSON.stringify(payload));
    window.open(`/tools/cover-letter-generator/result?id=${id}`, "_blank");
    setOutputLetter(text);
  };

  const generateLetter = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Generate a 1-page human-sounding, ATS-friendly cover letter in a ${tone} tone for the role of ${jobTitle} at ${companyName}. Hiring manager: ${hiringManager}. Key achievements: ${keyAchievements}. Job requirements: ${jobDescription}. Avoid clichés and buzzwords.`,
          systemPrompt: `You are an executive cover letter writer producing high-converting, human-sounding cover letters in a ${tone} tone.`,
          model: "local-offline",
        }),
      });
      const data = await res.json();
      if (data.text) {
        handleGenerateResult(data.text);
      }
      triggerConfetti();
    } catch {
      // Keep existing letter on error
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTxt = () => {
    const blob = new Blob([outputLetter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Cover_Letter_${companyName.replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 sm:p-8 border border-border/80 shadow-md bg-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                AI Cover Letter Engine
              </h2>
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                ATS Optimized
              </Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Generate human-sounding, high-converting cover letters customized across 10 industry tones.
            </p>
          </div>

          {/* Tone Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground shrink-0">Tone:</span>
            <Select
              value={tone}
              onChange={(e) => setTone(e.target.value as CoverLetterTone)}
              className="w-44 text-xs font-medium"
            >
              {COVER_LETTER_TONES.map((t) => (
                <option key={t} value={t}>
                  {t} Tone
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          {/* Controls Form */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground">Target Job Title</label>
              <Input
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Product Designer"
                className="mt-1.5 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground">Company Name</label>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Stripe"
                  className="mt-1.5 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground">Hiring Manager</label>
                <Input
                  value={hiringManager}
                  onChange={(e) => setHiringManager(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="mt-1.5 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">Key Achievements to Emphasize</label>
              <Textarea
                value={keyAchievements}
                onChange={(e) => setKeyAchievements(e.target.value)}
                rows={3}
                className="mt-1.5 text-xs"
                placeholder="List top 2-3 metric wins or projects..."
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">Job Description Snippet</label>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={3}
                className="mt-1.5 text-xs"
                placeholder="Paste key job requirements..."
              />
            </div>

            <Button
              onClick={generateLetter}
              disabled={isGenerating}
              className="w-full bg-primary text-primary-foreground font-semibold text-xs py-2.5 shadow-sm"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Tailoring Cover Letter...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" /> Generate {tone} Cover Letter
                </>
              )}
            </Button>
          </div>

          {/* Letter Preview & Output */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-primary" /> Live 1-Page Letter Preview
              </span>

              <div className="flex gap-2">
                <Button onClick={copyToClipboard} variant="outline" size="sm" className="text-xs h-8">
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button onClick={downloadTxt} variant="outline" size="sm" className="text-xs h-8">
                  <Download className="h-3.5 w-3.5 mr-1" /> TXT Export
                </Button>
              </div>
            </div>

            <Textarea
              value={outputLetter}
              onChange={(e) => setOutputLetter(e.target.value)}
              rows={14}
              className="flex-1 font-serif text-sm leading-relaxed p-4 bg-secondary/10 border-border/70 rounded-xl resize-none"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
