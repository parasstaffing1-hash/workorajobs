"use client";

import { ArrowRight, LayoutDashboard, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function HeroCTA() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-6 mb-12 relative z-20">
      {/* Primary CTA */}
      <Link
        href="/jobs"
        className="w-full sm:w-auto h-12 px-7 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-blue-500/20 hover:shadow-blue-500/35 transition-all duration-200 group active:scale-[0.98] glow-btn-primary"
      >
        <span>Explore Talent Pool</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
      </Link>

      {/* Secondary CTA */}
      <Link
        href="/recruiter"
        className="w-full sm:w-auto h-12 px-7 rounded-xl glass-hero-card text-slate-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md hover:border-blue-400/50 dark:hover:border-blue-500/40 transition-all duration-200 group active:scale-[0.98]"
      >
        <LayoutDashboard className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform duration-200" />
        <span>View Recruiter Portal</span>
      </Link>

      {/* Trust pill note */}
      <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 ml-2">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>100% Pre-Vetted Candidates</span>
      </div>
    </div>
  );
}
