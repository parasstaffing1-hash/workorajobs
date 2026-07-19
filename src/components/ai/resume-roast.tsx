"use client";

import {
  Flame,
  Laugh,
  RefreshCw,
  Share2,
  ShieldAlert,
  Sparkles,
  Zap,
} from "lucide-react";
import { useState } from "react";

import { triggerConfetti } from "@/components/ai/gamification-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export type RoastMode = "Humorous" | "Professional" | "Recruiter" | "Brutal Honesty";

export function ResumeRoast() {
  const [resumeText, setResumeText] = useState(
    "Senior Product Designer with 8+ years of experience. Experienced in UI/UX, Figma, HTML, CSS, agile workflows, and stakeholder management. Responsible for creating designs and leading teams.",
  );
  const [mode, setMode] = useState<RoastMode>("Brutal Honesty");
  const [isRoasting, setIsRoasting] = useState(false);

  const [roastOutput, setRoastOutput] = useState({
    roastTitle: "The 'Responsible For Everything, Quantified Nothing' Special",
    roastBullets: [
      "🔥 'Responsible for creating designs' — That's like a chef saying they're responsible for making food. What actually happened? Did users love it or quit in frustration?",
      "🔥 Zero hard metrics detected in 8 years of experience. Did your designs boost revenue by $5M or cost the company $5M? Tell the truth!",
      "🔥 Keyword stuffing 'Figma, HTML, CSS' without showing a single architectural system win.",
    ],
    fixes: [
      "Replace 'Responsible for creating designs' with 'Architected 14 enterprise SaaS workflows, improving task speed by 31%'.",
      "Add at least 3 hard metrics (%, $, team size, time saved) per role.",
    ],
  });

  const handleRoast = () => {
    setIsRoasting(true);
    setTimeout(() => {
      setIsRoasting(false);
      triggerConfetti();
    }, 800);
  };

  return (
    <Card className="p-6 sm:p-8 border border-amber-500/30 bg-card shadow-md space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-amber-500 animate-pulse" />
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Viral AI Resume Roast
            </h2>
            <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]">
              Viral Mode
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Get your resume roasted with zero sugarcoating. Choose your roast mode: Humorous, Professional, Recruiter, or Brutal Honesty.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground shrink-0">Mode:</span>
          <Select
            value={mode}
            onChange={(e) => setMode(e.target.value as RoastMode)}
            className="w-44 text-xs font-bold text-amber-600 dark:text-amber-400"
          >
            <option value="Brutal Honesty">🔥 Brutal Honesty</option>
            <option value="Humorous">😂 Humorous</option>
            <option value="Recruiter">💼 Recruiter Eye</option>
            <option value="Professional">👔 Professional Critique</option>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Input Text */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-foreground">Paste Resume Bullets / Text</label>
            <Textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows={8}
              className="mt-1.5 text-xs bg-secondary/10 border-border/80"
            />
          </div>

          <Button
            onClick={handleRoast}
            disabled={isRoasting}
            className="w-full bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs py-2.5 shadow-sm"
          >
            {isRoasting ? "Roasting Resume..." : `Roast My Resume (${mode} Mode)`}
          </Button>
        </div>

        {/* Roast Output Card */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <Laugh className="h-4 w-4" /> Roast Assessment: {mode}
              </span>
              <Button size="sm" variant="outline" className="text-xs h-7 border-amber-500/30 text-amber-700 dark:text-amber-400">
                <Share2 className="h-3 w-3 mr-1" /> Share Card
              </Button>
            </div>
            <h4 className="font-extrabold text-base text-foreground">{roastOutput.roastTitle}</h4>

            <div className="space-y-2.5 pt-1">
              {roastOutput.roastBullets.map((bullet, i) => (
                <p key={i} className="text-xs leading-relaxed text-foreground font-medium">
                  {bullet}
                </p>
              ))}
            </div>
          </div>

          {/* Actionable Fixes */}
          <div className="rounded-xl border border-border/80 p-4 space-y-2 bg-secondary/20">
            <h5 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Instant Score Fixes:
            </h5>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              {roastOutput.fixes.map((fix, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>{fix}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}
