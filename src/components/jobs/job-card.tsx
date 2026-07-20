"use client";

import { useState } from "react";
import {
  MapPin,
  Clock,
  DollarSign,
  Bookmark,
  Sparkles,
  CheckCircle2,
  Building2,
  ArrowUpRight,
  Send,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import type { Job } from "@/data/jobs";
import type { ResumeMatchResult } from "@/lib/resume-match";
import { cn } from "@/lib/utils";

type JobCardProps = {
  job: Job;
  match?: ResumeMatchResult | null;
  onApply?: (job: Job) => void;
};

export function JobCard({ job, match, onApply }: JobCardProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const { toast } = useToast();

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarked((prev) => !prev);
    toast(
      !bookmarked
        ? `Saved "${job.title}" to your bookmarks`
        : `Removed "${job.title}" from your bookmarks`,
      !bookmarked ? "success" : "info"
    );
  };

  const matchBadgeClass = (score: number) => {
    if (score >= 95) {
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    }
    if (score >= 80) {
      return "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400";
    }
    if (score >= 60) {
      return "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400";
    }
    return "border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800 text-slate-500";
  };

  return (
    <Card className="glass-hero-card card-motion-3d rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-white/10 hover:border-blue-500/50 shadow-sm transition-all duration-200 group relative overflow-hidden">
      
      {/* Top Specular Line Accent */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        
        {/* Left Info Column */}
        <div className="flex-1 space-y-4">
          
          {/* Company Avatar & Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5">
              {/* Company Logo Avatar */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-md shrink-0 group-hover:scale-105 transition-transform duration-200">
                {job.company.substring(0, 2).toUpperCase()}
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                  {job.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {job.company}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {job.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {job.posted}
                  </span>
                </div>
              </div>
            </div>

            {/* Bookmark Button */}
            <button
              type="button"
              onClick={handleBookmarkToggle}
              aria-label={bookmarked ? "Remove bookmark" : "Bookmark job"}
              className={cn(
                "p-2.5 rounded-xl border transition-all duration-200 cursor-pointer active:scale-95 shrink-0",
                bookmarked
                  ? "bg-amber-500/10 text-amber-500 border-amber-500/30 shadow-xs"
                  : "bg-slate-100/70 dark:bg-slate-800/70 text-slate-400 border-slate-200/60 dark:border-white/5 hover:text-amber-500 hover:border-amber-500/30"
              )}
            >
              <Bookmark className={cn("w-4 h-4", bookmarked && "fill-amber-500")} />
            </button>
          </div>

          {/* Badges Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {/* Work Mode / Remote Badge */}
            <span className={cn(
              "text-xs px-2.5 py-1 rounded-full border font-medium flex items-center gap-1.5",
              job.workMode === "Remote"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10"
            )}>
              {job.workMode === "Remote" && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              )}
              {job.workMode}
            </span>

            {/* Job Type Badge */}
            <span className={cn(
              "text-xs px-2.5 py-1 rounded-full border font-medium",
              job.type === "Internship"
                ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30"
                : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
            )}>
              {job.type}
            </span>

            {/* Department Badge */}
            <span className="text-xs px-2.5 py-1 rounded-full border border-slate-200/80 dark:border-white/10 bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300">
              {job.department}
            </span>

            {/* AI Resume Match Badge */}
            {match && (
              <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1", matchBadgeClass(match.score))}>
                <Sparkles className="w-3 h-3" />
                {match.score}% Match
              </span>
            )}
          </div>

          {/* Skill Tag Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {job.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-white/5 hover:border-blue-400/50 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* AI Resume Match Diagnostics Detail Block */}
          {match && (
            <div className="mt-4 p-4 rounded-xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200/60 dark:border-white/5 space-y-3">
              <div className="grid gap-3 sm:grid-cols-3 text-xs">
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white block mb-1">Matched Skills</span>
                  <div className="flex flex-wrap gap-1">
                    {(match.matchedSkills.length ? match.matchedSkills.slice(0, 5) : ["Manual Review"]).map((skill) => (
                      <span key={skill} className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded text-[10px] font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-slate-900 dark:text-white block mb-1">Skill Gaps</span>
                  <div className="flex flex-wrap gap-1">
                    {(match.missingSkills.length ? match.missingSkills.slice(0, 5) : ["None"]).map((skill) => (
                      <span key={skill} className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded text-[10px] font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-slate-900 dark:text-white block mb-1">Match Insights</span>
                  <ul className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                    {match.reasons.slice(0, 2).map((reason, rIdx) => (
                      <li key={rIdx} className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span className="truncate">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Salary & Action Column */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-200/60 dark:border-white/5 min-w-[180px]">
          
          {/* Salary Pill Badge */}
          <div className="text-left lg:text-right">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-sm border border-emerald-500/20 font-mono">
              <DollarSign className="w-4 h-4" />
              <span>{job.salary}</span>
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">Verified Compensation</span>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-2 w-full sm:w-auto lg:w-full">
            <Link
              href={`/candidate/jobs?search=${encodeURIComponent(job.title)}`}
              className="flex-1 lg:w-full"
            >
              <button
                type="button"
                onClick={() => onApply && onApply(job)}
                className="w-full h-10 px-4 rounded-xl bg-slate-900 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all duration-200 cursor-pointer active:scale-95 btn-ripple-container"
              >
                <span>Quick Apply</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </Link>

            <Link href={`/jobs/${job.id}`}>
              <button
                type="button"
                className="h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer border border-slate-200/60 dark:border-white/5 shrink-0"
                aria-label="Preview job"
              >
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

        </div>

      </div>
    </Card>
  );
}

export function JobCardSkeleton() {
  return (
    <Card className="rounded-2xl p-6 border border-slate-200/80 dark:border-white/10 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-48 rounded-md" />
            <Skeleton className="h-3 w-36 rounded-md" />
          </div>
        </div>
        <Skeleton className="w-9 h-9 rounded-xl" />
      </div>

      <div className="flex gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>

      <div className="flex gap-2">
        <Skeleton className="h-5 w-16 rounded-md" />
        <Skeleton className="h-5 w-20 rounded-md" />
        <Skeleton className="h-5 w-14 rounded-md" />
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
        <Skeleton className="h-6 w-32 rounded-xl" />
        <Skeleton className="h-10 w-28 rounded-xl" />
      </div>
    </Card>
  );
}
