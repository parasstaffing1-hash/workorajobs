"use client";

import { Check, X, Sparkles } from "lucide-react";
import { Container } from "@/components/layout/container";

export function BenefitsComparison() {
  const criteria = [
    {
      name: "Time-to-Hire",
      workora: "14.8 minutes (AI Matches)",
      agency: "30 - 60 days",
      inHouse: "45 - 90 days",
    },
    {
      name: "Candidate Pre-Vetting",
      workora: "100% Code & Domain Verified",
      agency: "Manual Resume Screening",
      inHouse: "Basic Keyword Filters",
    },
    {
      name: "Placement Cost",
      workora: "Zero Commission Markup",
      agency: "20% - 30% First Year Salary",
      inHouse: "High Internal Overhead",
    },
    {
      name: "ATS Compliance Engine",
      workora: "Deterministic Rule Validation",
      agency: "Unpredictable Manual Prep",
      inHouse: "Legacy Software Filters",
    },
    {
      name: "Boolean String Generator",
      workora: "Built-In Instant X-Ray Tool",
      agency: "Manual Recruiter Strings",
      inHouse: "Basic Search Queries",
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-slate-50/50 dark:bg-slate-950/40">
      <Container className="relative z-10">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-4 border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Why Leading Teams Choose Workora</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
            Compare the <span className="text-gradient-hero">Staffing Ecosystem.</span>
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            See how Workora's AI staffing platform compares against traditional recruitment agencies and manual in-house sourcing.
          </p>
        </div>

        {/* Comparison Table Grid */}
        <div className="w-full overflow-x-auto rounded-3xl border border-slate-200/80 dark:border-white/10 glass-hero-card shadow-xl">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-white/10 bg-slate-100/60 dark:bg-slate-900/60">
                <th className="p-5 text-sm font-bold text-slate-900 dark:text-white w-1/4">Feature / Metric</th>
                <th className="p-5 text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 border-x border-blue-500/20 w-1/3">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Workora Staffing Engine</span>
                  </div>
                </th>
                <th className="p-5 text-sm font-semibold text-slate-600 dark:text-slate-400 w-1/4">Traditional Agencies</th>
                <th className="p-5 text-sm font-semibold text-slate-600 dark:text-slate-400 w-1/4">Manual Sourcing</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200/60 dark:divide-white/5 text-xs sm:text-sm">
              {criteria.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                  <td className="p-5 font-semibold text-slate-900 dark:text-white">{row.name}</td>
                  
                  {/* Workora Column (Highlight) */}
                  <td className="p-5 font-bold text-blue-600 dark:text-blue-400 bg-blue-500/5 border-x border-blue-500/20">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{row.workora}</span>
                    </div>
                  </td>

                  <td className="p-5 text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <X className="w-4 h-4 text-rose-500/80 shrink-0" />
                      <span>{row.agency}</span>
                    </div>
                  </td>

                  <td className="p-5 text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <X className="w-4 h-4 text-rose-500/80 shrink-0" />
                      <span>{row.inHouse}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </Container>
    </section>
  );
}
