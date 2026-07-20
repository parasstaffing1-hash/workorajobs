"use client";

import { useState } from "react";
import {
  Shield,
  Lock,
  CheckCircle2,
  Building,
  Award,
  Star,
  Quote,
  Sparkles,
  Server,
  Key,
  Users,
  Briefcase,
  ChevronRight,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { AnimatedCounter } from "@/components/ui/counter";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";

export function PremiumTrustSection() {
  const [testimonialTab, setTestimonialTab] = useState<"recruiters" | "candidates">("recruiters");

  const logos = [
    { name: "Vercel", label: "VERCEL" },
    { name: "Stripe", label: "STRIPE" },
    { name: "Apple", label: "APPLE" },
    { name: "Microsoft", label: "MICROSOFT" },
    { name: "OpenAI", label: "OPENAI" },
    { name: "Snowflake", label: "SNOWFLAKE" },
    { name: "Datadog", label: "DATADOG" },
    { name: "Figma", label: "FIGMA" },
  ];

  const stats = [
    { value: 2480, suffix: "+", label: "Vetted Tech Talent", desc: "Top 2% pre-screened engineers & designers" },
    { value: 98.4, suffix: "%", label: "Match Precision", desc: "Deterministic AI skills verification" },
    { value: 14.8, suffix: "m", label: "Avg Time-to-Hire", desc: "Accelerating hiring pipelines by 4x" },
    { value: 42, prefix: "$", suffix: "M+", label: "Placed Salaries", desc: "Annualized compensation routed" },
  ];

  const recruiterTestimonials = [
    {
      quote: "Workora reduced our engineering time-to-hire from 45 days down to 12 days. The AI match accuracy was spot-on for our Staff React roles.",
      name: "Sarah Jenkins",
      title: "VP of Talent Acquisition",
      company: "Ex-Stripe / GrowthTech",
      avatar: "SJ",
      stars: 5,
    },
    {
      quote: "The Boolean search string generator and candidate pre-vetting saved our recruiting team over 20 hours per week in manual screening.",
      name: "David Chen",
      title: "Head of Global Sourcing",
      company: "Scale AI Partner",
      avatar: "DC",
      stars: 5,
    },
  ];

  const candidateTestimonials = [
    {
      quote: "I uploaded my resume and matched with a Senior Staff role at a top Series-C company in under 48 hours. The experience was seamless.",
      name: "Marcus Thorne",
      title: "Principal Systems Engineer",
      company: "Hired at CloudScale",
      avatar: "MT",
      stars: 5,
    },
    {
      quote: "Workora's ATS resume builder ensured my resume passed recruiter screens without getting filtered by legacy parsing software.",
      name: "Amara Patel",
      title: "Lead Product Designer",
      company: "Hired at FinTech AI",
      avatar: "AP",
      stars: 5,
    },
  ];

  const securityBadges = [
    { icon: Shield, title: "SOC 2 Type II", desc: "Audited & Certified" },
    { icon: Lock, title: "256-bit AES", desc: "End-to-End Encryption" },
    { icon: Key, title: "SAML 2.0 & SSO", desc: "Okta & Google Auth" },
    { icon: Server, title: "GDPR Compliant", desc: "EU Data Privacy Standard" },
  ];

  const enterpriseBadges = [
    { title: "99.99% Uptime SLA", desc: "High availability enterprise infrastructure" },
    { title: "Role-Based Access Control", desc: "Granular administrative team permissions" },
    { title: "Audit Log Streaming", desc: "Real-time compliance tracking & export" },
    { title: "Dedicated Support", desc: "24/7 priority SLA response manager" },
  ];

  const activeTestimonials = testimonialTab === "recruiters" ? recruiterTestimonials : candidateTestimonials;

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      {/* Stripe-style Ambient Beam Overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

      <Container className="relative z-10">
        
        {/* 1. Client Logos Carousel / Marquee */}
        <div className="mb-20 text-center">
          <span className="text-xs uppercase tracking-widest font-mono text-slate-600 dark:text-slate-400 block mb-8 font-semibold">
            Trusted by hiring leaders at world-class technology companies
          </span>

          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
            {logos.map((logo, idx) => (
              <span
                key={idx}
                className="font-bold text-sm sm:text-base tracking-wider text-slate-800 dark:text-slate-200 hover:text-blue-500 transition-colors duration-200"
              >
                {logo.label}
              </span>
            ))}
          </div>
        </div>

        {/* 2. Hiring Statistics Grid with Animated Counters */}
        <div className="mb-24 p-8 sm:p-10 rounded-3xl glass-hero-card border border-slate-200/80 dark:border-white/10 shadow-xl">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-2">
              Measured Velocity & Scale
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Proven results across modern staffing pipelines.
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, idx) => (
              <div key={idx} className="space-y-1.5 border-l-2 border-blue-500/40 pl-4">
                <div className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
                  <AnimatedCounter
                    value={s.value}
                    prefix={s.prefix}
                    suffix={s.suffix}
                    durationMs={1400}
                  />
                </div>
                <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">{s.label}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Recruiter & Candidate Testimonials */}
        <div className="mb-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-widest block mb-2">
                Verified Social Proof
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Loved by recruiters and candidate talent.
              </h3>
            </div>

            {/* Testimonial Switcher Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/60 dark:border-white/5 text-xs font-medium w-fit">
              <button
                onClick={() => setTestimonialTab("recruiters")}
                className={`px-4 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                  testimonialTab === "recruiters"
                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                  Recruiters
                </span>
              </button>
              <button
                onClick={() => setTestimonialTab("candidates")}
                className={`px-4 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                  testimonialTab === "candidates"
                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-purple-500" />
                  Candidates
                </span>
              </button>
            </div>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {activeTestimonials.map((t, idx) => (
              <StaggerItem key={idx}>
                <div className="glass-hero-card card-motion-3d rounded-2xl p-7 border border-slate-200/80 dark:border-white/10 shadow-sm hover:border-blue-500/40 flex flex-col justify-between h-full space-y-6">
                  <div>
                    <div className="flex items-center gap-1 mb-4 text-amber-400">
                      {[...Array(t.stars)].map((_, sIdx) => (
                        <Star key={sIdx} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>

                    <p className="text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed italic">
                      "{t.quote}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-slate-200/50 dark:border-white/5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                      {t.avatar}
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{t.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{t.title} • <span className="font-semibold text-blue-500">{t.company}</span></p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* 4. Security & Enterprise-Ready Badges (Stripe-Grade Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8 border-t border-slate-200/60 dark:border-white/5">
          {/* Security Standards */}
          <div className="p-8 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/60 dark:border-white/5">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-blue-500" />
              <h4 className="font-bold text-lg text-slate-900 dark:text-white">Bank-Grade Security Standards</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {securityBadges.map((b, idx) => {
                const Icon = b.icon;
                return (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/50 dark:border-white/5">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900 dark:text-white">{b.title}</h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{b.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Enterprise Ready Capabilities */}
          <div className="p-8 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/60 dark:border-white/5">
            <div className="flex items-center gap-2 mb-6">
              <Building className="w-5 h-5 text-purple-500" />
              <h4 className="font-bold text-lg text-slate-900 dark:text-white">Enterprise Infrastructure</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {enterpriseBadges.map((b, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/50 dark:border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">{b.title}</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </Container>
    </section>
  );
}
