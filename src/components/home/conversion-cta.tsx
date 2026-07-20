"use client";

import { ArrowRight, Briefcase, Sparkles, UserCheck, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/container";

export function ConversionCTA() {
  return (
    <section className="py-24 relative overflow-hidden bg-slate-950 text-white">
      {/* Ambient Radial Gradient Beams */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Recruiter CTA Box */}
          <div className="glass-card-enterprise rounded-3xl p-8 sm:p-10 border border-white/10 flex flex-col justify-between relative overflow-hidden group hover:border-blue-500/50 transition-all duration-300">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold mb-6 border border-blue-500/20">
                <Briefcase className="w-3.5 h-3.5" />
                <span>For Recruiters & Enterprise Teams</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
                Scale your engineering pipeline in days, not months.
              </h3>

              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                Access a pre-vetted talent pool of 2,480+ staff engineers, designers, and AI specialists. Automated match scoring and zero agency markup.
              </p>

              <ul className="space-y-3 mb-8 text-xs font-medium text-slate-300">
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Avg. 14.8m time-to-hire across technical roles</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% verified GitHub code quality & domain fit</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link href="/recruiter" className="flex-1">
                <button
                  type="button"
                  className="w-full h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all duration-200 cursor-pointer active:scale-98 btn-ripple-container"
                >
                  <span>Access Recruiter Workbench</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>

              <Link href="/contact" className="sm:w-auto">
                <button
                  type="button"
                  className="w-full h-12 px-5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-xs flex items-center justify-center border border-white/10 transition-colors cursor-pointer"
                >
                  Book Demo
                </button>
              </Link>
            </div>
          </div>

          {/* Candidate CTA Box */}
          <div className="glass-card-enterprise rounded-3xl p-8 sm:p-10 border border-white/10 flex flex-col justify-between relative overflow-hidden group hover:border-purple-500/50 transition-all duration-300">
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold mb-6 border border-purple-500/20">
                <UserCheck className="w-3.5 h-3.5" />
                <span>For Senior Candidates & Leaders</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
                Get matched directly with decision-makers.
              </h3>

              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                Skip traditional resume black holes. Use our deterministic AI Resume Builder to align your experience directly with high-paying remote roles.
              </p>

              <ul className="space-y-3 mb-8 text-xs font-medium text-slate-300">
                <li className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Instant 1-click ATS resume diagnostic & formatting</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Direct introductions to VPs of Engineering & CTOs</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link href="/jobs" className="flex-1">
                <button
                  type="button"
                  className="w-full h-12 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 transition-all duration-200 cursor-pointer active:scale-98 btn-ripple-container"
                >
                  <span>Explore Open Positions</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>

              <Link href="/resume-builder" className="sm:w-auto">
                <button
                  type="button"
                  className="w-full h-12 px-5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-xs flex items-center justify-center border border-white/10 transition-colors cursor-pointer"
                >
                  Build Resume
                </button>
              </Link>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
