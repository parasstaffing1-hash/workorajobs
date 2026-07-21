import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export function HeroBadge() {
  return (
    <Link
      href="/recruiter"
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-hero-card hover:bg-white/80 dark:hover:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 shadow-sm transition-all duration-200 group cursor-pointer mb-6"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
      </span>
      
      <span className="text-xs font-medium tracking-tight text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-blue-500 fill-blue-500/20" />
        <span className="font-semibold text-slate-900 dark:text-white">Workora 2.0</span>
        <span className="text-slate-400 dark:text-slate-500">•</span>
        <span>AI Intelligence Staffing Engine</span>
      </span>

      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all duration-200" />
    </Link>
  );
}
