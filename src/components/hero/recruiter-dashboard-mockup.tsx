"use client";

import { useState } from "react";
import { Sparkles, CheckCircle2, Search, SlidersHorizontal, ArrowUpRight, UserCheck, ShieldCheck } from "lucide-react";

export function RecruiterDashboardMockup() {
  const [activeTab, setActiveTab] = useState<"candidates" | "match" | "outreach">("candidates");

  const candidates = [
    {
      name: "Alex Rivera",
      role: "Staff Frontend Architect",
      company: "Ex-Stripe",
      match: "99%",
      stage: "Offer Stage",
      skills: ["React 19", "Next.js", "TypeScript"],
      stageColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    },
    {
      name: "Elena Rostova",
      role: "Senior AI Infrastructure Engineer",
      company: "Ex-Vercel",
      match: "98%",
      stage: "Technical Interview",
      skills: ["PyTorch", "CUDA", "LLMs"],
      stageColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
    },
    {
      name: "Marcus Vance",
      role: "Principal Product Designer",
      company: "Ex-Apple",
      match: "96%",
      stage: "Screening Cleared",
      skills: ["Figma Systems", "Interaction", "Prototyping"],
      stageColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto mt-4 mb-16 relative z-10">
      <div className="glass-dashboard-mockup rounded-2xl shadow-2xl overflow-hidden border border-slate-200/80 dark:border-white/10 group transition-all duration-300">
        
        {/* Mockup Top Window Bar */}
        <div className="h-11 bg-slate-100/80 dark:bg-slate-900/80 border-b border-slate-200/60 dark:border-white/10 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-3 text-xs font-mono text-slate-400 dark:text-slate-500 hidden sm:inline">
              workora.app/recruiter/pipeline
            </span>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-slate-800/60 p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setActiveTab("candidates")}
              className={`px-3 py-1 rounded-md transition-all duration-200 cursor-pointer ${
                activeTab === "candidates"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Candidates
            </button>
            <button
              onClick={() => setActiveTab("match")}
              className={`px-3 py-1 rounded-md transition-all duration-200 cursor-pointer ${
                activeTab === "match"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Match Engine
            </button>
            <button
              onClick={() => setActiveTab("outreach")}
              className={`px-3 py-1 rounded-md transition-all duration-200 cursor-pointer ${
                activeTab === "outreach"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Outreach
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[11px] font-mono text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
              <Sparkles className="w-3 h-3" />
              <span>AI Synced</span>
            </span>
          </div>
        </div>

        {/* Mockup Toolbar Header */}
        <div className="p-4 bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200/50 dark:border-white/5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                readOnly
                value="Filter talent pool..."
                className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 rounded-lg text-xs text-slate-600 dark:text-slate-300 focus:outline-none"
              />
            </div>
            <button className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Pipeline total:</span>
            <span className="font-semibold text-slate-900 dark:text-white bg-slate-200/60 dark:bg-slate-800 px-2 py-0.5 rounded">
              14 Active Candidates
            </span>
          </div>
        </div>

        {/* Dashboard Content Container */}
        <div className="p-4 sm:p-6 space-y-3">
          {activeTab === "candidates" && (
            <div className="space-y-2.5">
              {candidates.map((c, i) => (
                <div
                  key={i}
                  className="p-3.5 sm:p-4 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-white/5 hover:border-blue-500/40 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group/row"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-md">
                      {c.name.split(" ").map((n) => n[0]).join("")}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white group-hover/row:text-blue-500 transition-colors">
                          {c.name}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                          {c.company}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {c.role}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {c.skills.map((s, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md border border-slate-200/50 dark:border-white/5"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-white/5">
                    <div className="text-right">
                      <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>{c.match} Match</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border inline-block mt-1 font-medium ${c.stageColor}`}>
                        {c.stage}
                      </span>
                    </div>

                    <button className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer">
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "match" && (
            <div className="p-8 text-center bg-white/40 dark:bg-slate-900/40 rounded-xl border border-slate-200/50 dark:border-white/5 space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 mx-auto flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-white">AI Semantic Match Engine</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Analyzing candidates across 45+ technical parameters including GitHub commit density, code quality benchmarks, and role domain fit.
              </p>
            </div>
          )}

          {activeTab === "outreach" && (
            <div className="p-8 text-center bg-white/40 dark:bg-slate-900/40 rounded-xl border border-slate-200/50 dark:border-white/5 space-y-3">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-500 mx-auto flex items-center justify-center">
                <UserCheck className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-white">Automated Recruiter Sequences</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Smart personalized outreach sequence triggered automatically when candidate match exceeds 95%.
              </p>
            </div>
          )}
        </div>

        {/* Dashboard Footer Banner */}
        <div className="p-3 bg-slate-100/60 dark:bg-slate-900/60 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Deterministic verification active</span>
          </div>
          <span className="font-mono text-[10px]">Lighthouse 95+ Standard</span>
        </div>
      </div>
    </div>
  );
}
