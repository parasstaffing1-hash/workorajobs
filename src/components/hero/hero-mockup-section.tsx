"use client";

import dynamic from "next/dynamic";

const RecruiterDashboardMockup = dynamic(
  () =>
    import("@/components/hero/recruiter-dashboard-mockup").then(
      (mod) => mod.RecruiterDashboardMockup
    ),
  {
    loading: () => (
      <div className="w-full max-w-5xl h-[420px] mx-auto rounded-2xl glass-dashboard-mockup animate-pulse my-10 border border-slate-200/50 dark:border-white/5" />
    ),
    ssr: false,
  }
);

const FloatingJobCards = dynamic(
  () =>
    import("@/components/hero/floating-job-cards").then(
      (mod) => mod.FloatingJobCards
    ),
  {
    ssr: false,
  }
);

export function HeroMockupSection() {
  return (
    <div className="relative w-full max-w-5xl mx-auto">
      <FloatingJobCards />
      <RecruiterDashboardMockup />
    </div>
  );
}
