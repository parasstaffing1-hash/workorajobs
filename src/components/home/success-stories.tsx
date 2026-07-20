"use client";

import { Building2, ArrowUpRight, TrendingUp, Clock, Users, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";

export function SuccessStories() {
  const caseStudies = [
    {
      company: "CloudScale Systems",
      logo: "CS",
      gradient: "from-blue-600 to-indigo-600",
      title: "Hired 12 Staff Infrastructure Engineers in 14 Days",
      metrics: [
        { label: "Time-to-Hire Reduction", value: "72%", icon: Clock },
        { label: "AI Match Precision", value: "99.1%", icon: TrendingUp },
        { label: "Candidates Placed", value: "12 Roles", icon: Users },
      ],
      quote: "Workora's recruiter workbench allowed us to source, screen, and issue offers to elite Staff Engineers faster than any traditional staffing agency we've worked with.",
      author: "David Chen",
      role: "VP of Engineering @ CloudScale",
      tag: "Series C Scaleup",
    },
    {
      company: "FinTech AI Solutions",
      logo: "FA",
      gradient: "from-purple-600 to-pink-600",
      title: "Built Core AI Research Team with Zero Placement Fees",
      metrics: [
        { label: "Recruiting Cost Saved", value: "$180k+", icon: TrendingUp },
        { label: "ATS Resume Pass Rate", value: "98.5%", icon: ShieldCheck },
        { label: "Roles Filled", value: "8 Researchers", icon: Users },
      ],
      quote: "The Boolean search string generator and resume match diagnostics gave us surgical precision when building our ML research team.",
      author: "Amara Patel",
      role: "Head of AI Talent @ FinTech AI",
      tag: "AI Enterprise",
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-slate-900 text-white">
      {/* Specular Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-transparent blur-[140px] pointer-events-none" />

      <Container className="relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest block mb-2 font-mono">
              Proven Enterprise Success
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              Real hiring stories from <br className="hidden sm:inline" />
              <span className="text-gradient-hero">high-growth tech teams.</span>
            </h2>
          </div>

          <Link href="/companies">
            <button
              type="button"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer group"
            >
              <span>Explore All Employer Stories</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </button>
          </Link>
        </div>

        {/* Case Studies Grid */}
        <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {caseStudies.map((cs, idx) => (
            <StaggerItem key={idx}>
              <div className="glass-card-enterprise rounded-3xl p-8 border border-white/10 hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between h-full space-y-8 group">
                
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${cs.gradient} text-white font-bold text-xs flex items-center justify-center shadow-md shrink-0`}>
                        {cs.logo}
                      </div>

                      <div>
                        <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {cs.company}
                        </h3>
                        <span className="text-[11px] text-slate-400 font-mono">{cs.tag}</span>
                      </div>
                    </div>

                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      Verified Case Study
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="text-xl sm:text-2xl font-bold text-white mb-6 group-hover:text-blue-400 transition-colors">
                    "{cs.title}"
                  </h4>

                  {/* Key Metrics Strip */}
                  <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5 mb-6">
                    {cs.metrics.map((m, mIdx) => {
                      const Icon = m.icon;
                      return (
                        <div key={mIdx} className="space-y-1">
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <Icon className="w-3 h-3 text-blue-400" />
                            <span className="truncate">{m.label}</span>
                          </div>
                          <span className="text-lg sm:text-xl font-bold text-white font-mono block">
                            {m.value}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Quote */}
                  <p className="text-slate-300 text-sm leading-relaxed italic mb-4">
                    "{cs.quote}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{cs.author}</span>
                    <span className="text-slate-400">{cs.role}</span>
                  </div>

                  <Link href="/contact">
                    <span className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1">
                      Read Story →
                    </span>
                  </Link>
                </div>

              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

      </Container>
    </section>
  );
}
