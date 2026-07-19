"use client";

import {
  Award,
  Calendar,
  CheckCircle2,
  Copy,
  FileText,
  Rocket,
  Search,
  Share2,
  Sparkles,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import { useState } from "react";

import { triggerConfetti } from "@/components/ai/gamification-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function LinkedinOptimizer() {
  const [profileUrl, setProfileUrl] = useState("linkedin.com/in/aisharahman");
  const [targetRole, setTargetRole] = useState("Senior Product Designer");
  const [currentHeadline, setCurrentHeadline] = useState(
    "Product Designer at Northstar Cloud | UX & Design Systems",
  );
  const [experienceText, setExperienceText] = useState(
    "Led discovery and prototyping for enterprise HR dashboards used by 14 recruiting teams. Improved candidate task completion rate by 31% through accessibility redesigns.",
  );

  const [activeTab, setActiveTab] = useState<"audit" | "headline" | "about" | "strategy">("audit");

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const headlines = [
    `Senior Product Designer @ Northstar Cloud | Enterprise SaaS & Design Systems | Scaling UX for 40k+ Users`,
    `Senior Product Designer | Accessibility (WCAG) & Design Tokens Lead | Ex-Atlas Finance | +31% Engagement Rate`,
    `Building High-Impact Product Workflows | Senior Product Designer | UX Research · System Architecture · SaaS`,
  ];

  const generatedAbout = `Senior Product Designer with 8+ years of experience crafting enterprise SaaS platforms, accessibility-first design systems, and data-driven workflow engines.

🚀 KEY HIGHLIGHTS:
• Improved candidate task completion by 31% via accessibility redesigns.
• Built & scaled multi-brand Figma design token system, cutting feature delivery cycles by 22%.
• Led design for B2B financial compliance tools serving over 40,000 active managers.

Core Competencies: UX Research, Design Systems (WCAG AA), B2B SaaS Architecture, Usability Testing, Prototyping, and Stakeholder Management.`;

  const creatorCalendar = [
    { day: "Monday", postType: "Case Study Breakdown", topic: "How we reduced feature delivery time by 22% using Figma design tokens." },
    { day: "Wednesday", postType: "Industry Insight", topic: "3 common accessibility mistakes in modern enterprise SaaS dashboards." },
    { day: "Friday", postType: "Career Milestone", topic: "Reflections on leading cross-functional UX research with 50+ users." },
  ];

  const copyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <Card className="p-6 sm:p-8 border border-border/80 shadow-md bg-card space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              LinkedIn Profile & Recruiter SEO Optimizer
            </h2>
            <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px]">
              Rank #1 in Recruiter Search
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Optimize your profile completeness, generate high-converting headlines, and boost recruiter search visibility.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-1.5 rounded-xl border border-border/80 bg-secondary/30 p-1">
          <Button
            onClick={() => setActiveTab("audit")}
            variant={activeTab === "audit" ? "accent" : "ghost"}
            size="sm"
            className="text-xs h-8"
          >
            Audit & Score
          </Button>
          <Button
            onClick={() => setActiveTab("headline")}
            variant={activeTab === "headline" ? "accent" : "ghost"}
            size="sm"
            className="text-xs h-8"
          >
            Headlines
          </Button>
          <Button
            onClick={() => setActiveTab("about")}
            variant={activeTab === "about" ? "accent" : "ghost"}
            size="sm"
            className="text-xs h-8"
          >
            About Writer
          </Button>
          <Button
            onClick={() => setActiveTab("strategy")}
            variant={activeTab === "strategy" ? "accent" : "ghost"}
            size="sm"
            className="text-xs h-8"
          >
            Posting Strategy
          </Button>
        </div>
      </div>

      {/* Inputs Header */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold text-foreground">Target Role / Keyword Focus</label>
          <Input
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Senior Product Designer"
            className="mt-1.5 text-xs"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-foreground">LinkedIn Profile URL</label>
          <Input
            value={profileUrl}
            onChange={(e) => setProfileUrl(e.target.value)}
            placeholder="linkedin.com/in/username"
            className="mt-1.5 text-xs"
          />
        </div>
      </div>

      {/* Tab 1: Audit & Score */}
      {activeTab === "audit" && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border/80 bg-secondary/20 p-4 text-center space-y-1">
              <span className="text-xs font-semibold text-muted-foreground">Profile Completeness</span>
              <div className="text-2xl font-black text-emerald-500">92%</div>
              <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">All-Star Status</Badge>
            </div>
            <div className="rounded-xl border border-border/80 bg-secondary/20 p-4 text-center space-y-1">
              <span className="text-xs font-semibold text-muted-foreground">Recruiter Search Placement</span>
              <div className="text-2xl font-black text-primary">Top 3%</div>
              <Badge className="bg-primary/10 text-primary text-[10px]">High Recruiter Intent</Badge>
            </div>
            <div className="rounded-xl border border-border/80 bg-secondary/20 p-4 text-center space-y-1">
              <span className="text-xs font-semibold text-muted-foreground">Keyword Density Score</span>
              <div className="text-2xl font-black text-amber-500">88 / 100</div>
              <Badge className="bg-amber-500/10 text-amber-600 text-[10px]">Strong Focus</Badge>
            </div>
          </div>

          <div className="rounded-xl border border-border/80 p-4 space-y-3 bg-secondary/10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Recruiter Optimization Recommendations
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span><strong>Headline Keyword Fix:</strong> Include your primary target role ("Senior Product Designer") in the first 40 characters for mobile search previews.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span><strong>Featured Section:</strong> Attach your interactive portfolio or top Figma case study link to convert recruiter profile views into interviews.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span><strong>Skills Endorsements:</strong> Ensure your top 3 endorsed skills match exact recruiter Boolean search strings (Figma, Design Systems, Accessibility).</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 2: Headlines */}
      {activeTab === "headline" && (
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            3 High-Converting Headline Options
          </h4>
          <div className="space-y-3">
            {headlines.map((headline, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-border/80 bg-secondary/20 text-xs"
              >
                <div className="font-medium text-foreground">{headline}</div>
                <Button
                  onClick={() => copyText(headline, idx)}
                  variant="outline"
                  size="sm"
                  className="text-xs shrink-0"
                >
                  {copiedIndex === idx ? "Copied!" : "Copy"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: About */}
      {activeTab === "about" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              High-Impact About Section Writer
            </h4>
            <Button onClick={() => copyText(generatedAbout, 99)} variant="outline" size="sm" className="text-xs">
              {copiedIndex === 99 ? "Copied!" : "Copy About Section"}
            </Button>
          </div>
          <Textarea
            value={generatedAbout}
            readOnly
            rows={10}
            className="font-sans text-xs leading-relaxed p-4 bg-secondary/10 border-border/80 rounded-xl"
          />
        </div>
      )}

      {/* Tab 4: Creator Strategy */}
      {activeTab === "strategy" && (
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-primary" /> Weekly LinkedIn Thought Leadership Posting Calendar
          </h4>
          <div className="grid gap-3 sm:grid-cols-3">
            {creatorCalendar.map((item) => (
              <div key={item.day} className="rounded-xl border border-border/80 bg-secondary/20 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-primary">{item.day}</span>
                  <Badge className="text-[9px] bg-secondary border-border/70">{item.postType}</Badge>
                </div>
                <p className="text-xs text-foreground font-medium leading-normal">{item.topic}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
