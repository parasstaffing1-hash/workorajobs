"use client";

import {
  Award,
  BookOpen,
  CheckCircle2,
  Compass,
  GraduationCap,
  MapPin,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

import { triggerConfetti } from "@/components/ai/gamification-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function CareerRoadmap() {
  const [currentRole, setCurrentRole] = useState("Product Designer");
  const [targetRole, setTargetRole] = useState("Lead Product Architect / Head of UX");
  const [timeframe, setTimeframe] = useState<"6" | "12" | "24">("12");

  const milestones = [
    {
      period: "Months 1 - 3",
      title: "Design System Architecture & WCAG Mastery",
      skills: ["Figma Design Tokens", "WCAG 2.1 AA Compliance", "Storybook Integration"],
      courses: ["Google UX Leadership Specialization", "Interaction Design Foundation Certificate"],
      project: "Build a multi-brand open-source token suite.",
      salaryEst: "$125,000",
    },
    {
      period: "Months 4 - 6",
      title: "Data-Driven UX Research & Analytics Integration",
      skills: ["Mixpanel/Amplitude Analytics", "Quantitative Usability Testing", "A/B Test Design"],
      courses: ["Reforge Product Strategy Program"],
      project: "Redesign core conversion funnel, targeting +25% completion boost.",
      salaryEst: "$140,000",
    },
    {
      period: "Months 7 - 12",
      title: "Cross-Functional Leadership & Executive Alignment",
      skills: ["Stakeholder Management", "UX Budgeting & Hiring", "Product Strategy"],
      courses: ["CPACC Accessibility Certification"],
      project: "Lead cross-functional UX team of 6 designers & researchers.",
      salaryEst: "$160,000+",
    },
  ];

  return (
    <Card className="p-6 sm:p-8 border border-border/80 shadow-md bg-card space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-violet-500" />
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              AI Career Roadmap Generator
            </h2>
            <Badge className="bg-violet-500/10 text-violet-600 border-violet-500/20 text-[10px]">
              6 / 12 / 24 Month Pathways
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Generate customized 6, 12, or 24 month career growth pathways covering skills, certifications, books, and salary targets.
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex gap-1.5 rounded-xl border border-border/80 bg-secondary/30 p-1">
          <Button
            onClick={() => setTimeframe("6")}
            variant={timeframe === "6" ? "accent" : "ghost"}
            size="sm"
            className="text-xs h-8"
          >
            6 Months
          </Button>
          <Button
            onClick={() => setTimeframe("12")}
            variant={timeframe === "12" ? "accent" : "ghost"}
            size="sm"
            className="text-xs h-8"
          >
            12 Months
          </Button>
          <Button
            onClick={() => setTimeframe("24")}
            variant={timeframe === "24" ? "accent" : "ghost"}
            size="sm"
            className="text-xs h-8"
          >
            24 Months
          </Button>
        </div>
      </div>

      {/* Role inputs */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold text-foreground">Current Position</label>
          <Input
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value)}
            className="mt-1.5 text-xs"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-foreground">Target Role (12-Month Vision)</label>
          <Input
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="mt-1.5 text-xs font-medium"
          />
        </div>
      </div>

      {/* Milestone Cards Timeline */}
      <div className="space-y-4 pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Step-by-Step Growth Progression
        </h4>

        <div className="relative border-l-2 border-primary/30 ml-4 pl-6 space-y-6">
          {milestones.map((m, idx) => (
            <div key={idx} className="relative space-y-2">
              {/* Dot */}
              <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-primary border-4 border-background shadow-sm" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] w-fit">
                  {m.period}
                </Badge>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  Target Band: {m.salaryEst}
                </span>
              </div>

              <h5 className="font-bold text-sm text-foreground">{m.title}</h5>

              <div className="grid gap-3 sm:grid-cols-2 pt-1 text-xs">
                <div className="rounded-xl border border-border/80 bg-secondary/20 p-3 space-y-1.5">
                  <span className="font-semibold text-muted-foreground flex items-center gap-1 text-[11px]">
                    <Sparkles className="h-3.5 w-3.5 text-violet-500" /> Target Skills
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {m.skills.map((s) => (
                      <Badge key={s} className="text-[10px] bg-background border-border/70 text-foreground">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-border/80 bg-secondary/20 p-3 space-y-1.5">
                  <span className="font-semibold text-muted-foreground flex items-center gap-1 text-[11px]">
                    <GraduationCap className="h-3.5 w-3.5 text-blue-500" /> Recommended Certifications
                  </span>
                  <p className="text-[11px] text-foreground font-medium">{m.courses.join(" · ")}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
