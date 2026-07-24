"use client";

import React, { useState } from "react";
import {
  User,
  MapPin,
  Clock,
  DollarSign,
  Bookmark,
  Send,
  Briefcase,
  ExternalLink,
  GraduationCap,
} from "lucide-react";

export interface CandidateCardData {
  id: string;
  userId: string;
  name: string;
  email?: string;
  photoUrl?: string;
  headline: string;
  summary?: string;
  location: string;
  skills: string[];
  experienceYrs: number;
  expectedSalary?: number;
  noticePeriod: string;
  education?: string;
}

interface CandidateCardProps {
  candidate: CandidateCardData;
  onInviteToApply: (candidate: CandidateCardData) => void;
  isDark?: boolean;
}

export function CandidateCard({
  candidate,
  onInviteToApply,
  isDark = false,
}: CandidateCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <div
      className={`rounded-2xl border p-6 shadow-sm hover:shadow-md transition-all duration-200 space-y-4 ${
        isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-extrabold text-xl flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
            {candidate.photoUrl ? (
              <img src={candidate.photoUrl} alt={candidate.name} className="w-full h-full object-cover rounded-2xl" />
            ) : (
              candidate.name.charAt(0)
            )}
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-base hover:text-blue-600">{candidate.name}</h3>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">{candidate.headline}</p>

            <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap pt-0.5">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                {candidate.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                Notice: <strong className="text-slate-800 dark:text-slate-200">{candidate.noticePeriod}</strong>
              </span>
              {candidate.expectedSalary && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                    Expected: <strong className="text-slate-800 dark:text-slate-200">${candidate.expectedSalary.toLocaleString()}/yr</strong>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsBookmarked(!isBookmarked)}
          className={`p-2 rounded-xl border cursor-pointer shrink-0 transition-colors ${
            isBookmarked
              ? "bg-amber-50 border-amber-300 text-amber-600"
              : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400"
          }`}
          title="Bookmark candidate"
        >
          <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-amber-400" : ""}`} />
        </button>
      </div>

      {/* Skills Badges */}
      {candidate.skills && candidate.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {candidate.skills.map((skill, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Summary / Education Preview */}
      {candidate.summary && (
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
          {candidate.summary}
        </p>
      )}

      {/* Footer Actions */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-3 text-xs">
        {candidate.education ? (
          <span className="flex items-center gap-1 text-slate-500 font-medium">
            <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
            {candidate.education}
          </span>
        ) : (
          <span className="text-slate-400">Verified Candidate</span>
        )}

        <button
          onClick={() => onInviteToApply(candidate)}
          className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer"
        >
          <Send className="h-3.5 w-3.5" />
          <span>Invite to Apply</span>
        </button>
      </div>
    </div>
  );
}
