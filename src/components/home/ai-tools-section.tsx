"use client";

import {
  FileText,
  Search,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Target,
  PenTool,
  Clock,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";
import { Badge } from "@/components/ui/badge";

export function AiToolsSection() {
  const tools = [
    {
      title: "AI Resume Builder",
      description: "Build ATS-compliant, recruiter-ready resumes in minutes with AI precision.",
      badge: "✦ AI Core",
      badgeVariant: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
      icon: FileText,
      gradient: "from-blue-600 via-indigo-600 to-purple-600",
      features: [
        "100% ATS Compliance Guarantee",
        "Deterministic Format Engine",
        "Instant PDF & Word Export",
      ],
      ctaText: "Launch Resume Builder",
      href: "/resume-builder",
      isComingSoon: false,
    },
    {
      title: "Boolean Search Generator",
      description: "Generate complex recruiter X-Ray search strings for LinkedIn, Google, and GitHub.",
      badge: "✦ Recruiter Essential",
      badgeVariant: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
      icon: Search,
      gradient: "from-purple-600 via-pink-600 to-rose-600",
      features: [
        "LinkedIn & Google X-Ray Strings",
        "OR/AND Operator Nesting",
        "One-Click Copy & Export",
      ],
      ctaText: "Generate Boolean Strings",
      href: "/tools/boolean-search",
      isComingSoon: false,
    },
    {
      title: "ATS Resume Checker",
      description: "Scan your resume against ATS algorithms to find format flaws & parse errors.",
      badge: "✦ Popular",
      badgeVariant: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
      icon: Target,
      gradient: "from-emerald-600 via-teal-600 to-sky-600",
      features: [
        "Instant ATS Parse Score",
        "Formatting & Font Diagnostics",
        "Actionable Optimization Tips",
      ],
      ctaText: "Check ATS Score",
      href: "/prep",
      isComingSoon: false,
    },
    {
      title: "Resume Keyword Optimizer",
      description: "Extract high-impact job description keywords to align your profile for top matches.",
      badge: "✦ Pro Tool",
      badgeVariant: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
      icon: Layers,
      gradient: "from-amber-500 via-orange-600 to-red-600",
      features: [
        "Job Description Keyword Extraction",
        "Skills Gap Analysis",
        "Match Rate Percentage Meter",
      ],
      ctaText: "Optimize Keywords",
      href: "/tools",
      isComingSoon: false,
    },
    {
      title: "Cover Letter Builder",
      description: "Draft tailored, executive cover letters matching specific job descriptions automatically.",
      badge: "✦ Coming Soon",
      badgeVariant: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30",
      icon: PenTool,
      gradient: "from-slate-600 via-zinc-600 to-neutral-700",
      features: [
        "Company-Tailored Messaging",
        "Tone & Executive Style Controls",
        "1-Click Alignment Sync",
      ],
      ctaText: "Notify Me When Live",
      href: "#",
      isComingSoon: true,
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-slate-50/50 dark:bg-slate-950/40 border-y border-slate-200/60 dark:border-white/5">
      {/* Background Subtle Mesh */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-transparent blur-[140px] pointer-events-none" />

      <Container className="relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-4 border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Staffing & Candidate Toolkit</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
            Supercharge your hiring <br className="hidden sm:inline" />
            with <span className="text-gradient-hero">AI-Powered Tools.</span>
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            Purpose-built intelligent engines for recruiters, candidates, and hiring managers. Guaranteed precision, zero hallucinations.
          </p>
        </div>

        {/* Tools Cards Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {tools.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <StaggerItem key={idx} className="flex flex-col h-full">
                <div className="glass-hero-card card-motion-3d rounded-2xl p-6 sm:p-7 flex flex-col justify-between h-full border border-slate-200/80 dark:border-white/10 hover:border-blue-500/50 relative overflow-hidden group">
                  
                  {/* Subtle Gradient Accent Top Border */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${tool.gradient}`} />

                  <div>
                    {/* Header Row */}
                    <div className="flex items-center justify-between mb-5">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${tool.gradient} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200`}>
                        <Icon className="w-6 h-6" />
                      </div>

                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${tool.badgeVariant}`}>
                        {tool.badge}
                      </span>
                    </div>

                    {/* Card Title & Description */}
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-500 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                      {tool.description}
                    </p>

                    {/* Feature List */}
                    <div className="space-y-2.5 mb-8 pt-4 border-t border-slate-200/50 dark:border-white/5">
                      {tool.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Action Button */}
                  <div>
                    {tool.isComingSoon ? (
                      <button
                        disabled
                        className="w-full h-11 px-4 rounded-xl bg-slate-200/70 dark:bg-slate-800/70 text-slate-400 dark:text-slate-500 font-medium text-xs flex items-center justify-center gap-2 cursor-not-allowed"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>{tool.ctaText}</span>
                      </button>
                    ) : (
                      <Link
                        href={tool.href}
                        className="w-full h-11 px-4 rounded-xl bg-slate-900 hover:bg-blue-600 dark:bg-slate-800 dark:hover:bg-blue-600 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-sm hover:shadow-lg transition-all duration-200 group/btn btn-ripple-container"
                      >
                        <span>{tool.ctaText}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform duration-200" />
                      </Link>
                    )}
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </Container>
    </section>
  );
}
