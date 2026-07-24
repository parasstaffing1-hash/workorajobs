"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  Sparkles,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Star,
  Search,
  Plus,
  Lock,
} from "lucide-react";
import { SignInGatewayModal } from "@/components/auth/SignInGatewayModal";
import { JoinNowGatewayModal } from "@/components/auth/JoinNowGatewayModal";

export default function ForEmployersLandingPage() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isJoinNowOpen, setIsJoinNowOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* HERO SECTION */}
        <div className="text-center space-y-6 pt-12 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <Sparkles className="h-4 w-4" />
            Workora ATS Enterprise Hiring Suite
          </span>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Hire Faster &amp; Build Top Teams with <span className="text-blue-600">Workora ATS</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            All-in-one recruitment platform for enterprise teams. Streamline job postings, candidate sourcing, applicant tracking, team scorecards, and hiring analytics.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/employer/jobs/create"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-500/25 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Post a Job</span>
            </Link>

            <button
              onClick={() => setIsSignInOpen(true)}
              className="h-12 px-6 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-50 cursor-pointer"
            >
              Employer Login
            </button>

            <button
              onClick={() => setIsJoinNowOpen(true)}
              className="h-12 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 cursor-pointer"
            >
              Create Employer Account
            </button>
          </div>
        </div>

        {/* ATS FEATURES GRID */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black">Built for High-Growth Enterprise Teams</h2>
            <p className="text-xs text-slate-500">Everything you need to source, track, and hire candidate talent.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-base">Drag &amp; Drop ATS Pipeline</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Visual Kanban board &amp; table views across 8 recruitment stages from Applied to Offer and Hired.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-base">Verified Talent Search</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Filter millions of candidate profiles by skills, experience, notice period, location, and salary requirements.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-base">Hiring Funnel Analytics</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Track job impressions, conversion rates, applicant acquisition channels, average time-to-hire, and cost-per-hire.
              </p>
            </div>
          </div>
        </div>

        {/* PRICING TIERS */}
        <div className="space-y-8 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black">Simple, Transparent Enterprise Pricing</h2>
            <p className="text-xs text-slate-500">No hidden fees. Scale as your hiring team expands.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-bold text-base">Starter</h3>
              <p className="text-2xl font-black">$0 <span className="text-xs font-normal text-slate-400">/ month</span></p>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> 3 Active Job Postings</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Basic ATS Pipeline</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Standard Email Support</li>
              </ul>
              <button
                onClick={() => setIsJoinNowOpen(true)}
                className="w-full h-10 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold"
              >
                Get Started Free
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-gradient-to-b from-blue-600 to-indigo-700 text-white space-y-4 shadow-xl shadow-blue-500/20 relative">
              <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-900 uppercase">
                Most Popular
              </span>
              <h3 className="font-bold text-base">Growth Pro</h3>
              <p className="text-2xl font-black">$199 <span className="text-xs font-normal text-blue-200">/ month</span></p>
              <ul className="text-xs space-y-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Unlimited Job Postings</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Unlimited ATS Pipeline &amp; Drawers</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Candidate Search &amp; Direct Invites</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> 5 Team Member Seats &amp; RBAC</li>
              </ul>
              <button
                onClick={() => setIsJoinNowOpen(true)}
                className="w-full h-10 rounded-xl bg-white text-blue-600 font-bold text-xs shadow-md"
              >
                Start 14-Day Free Trial
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-bold text-base">Enterprise Scale</h3>
              <p className="text-2xl font-black">Custom <span className="text-xs font-normal text-slate-400">/ annual</span></p>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Custom Candidate Match AI</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Dedicated Account Manager</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Custom ATS &amp; HRIS Webhook API</li>
              </ul>
              <Link
                href="/contact"
                className="block w-full py-2.5 rounded-xl text-center border border-slate-300 dark:border-slate-700 text-xs font-bold"
              >
                Contact Enterprise Sales
              </Link>
            </div>
          </div>
        </div>

        {/* MODALS */}
        <SignInGatewayModal
          isOpen={isSignInOpen}
          onClose={() => setIsSignInOpen(false)}
          onOpenJoinNow={() => {
            setIsSignInOpen(false);
            setIsJoinNowOpen(true);
          }}
        />

        <JoinNowGatewayModal
          isOpen={isJoinNowOpen}
          onClose={() => setIsJoinNowOpen(false)}
          initialRole="EMPLOYER"
          onOpenSignIn={() => {
            setIsJoinNowOpen(false);
            setIsSignInOpen(true);
          }}
        />
      </div>
    </div>
  );
}
