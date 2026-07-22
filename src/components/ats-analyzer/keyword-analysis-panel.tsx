"use client";

import { CheckCircle2, XCircle, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface KeywordAnalysisPanelProps {
  matchedKeywords: string[];
  missingKeywords: string[];
}

export function KeywordAnalysisPanel({
  matchedKeywords,
  missingKeywords,
}: KeywordAnalysisPanelProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Matched Keywords */}
      <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-4">
        <div className="flex items-center gap-2 text-emerald-500 font-bold text-base">
          <CheckCircle2 className="w-5 h-5" />
          Matched Keywords ({matchedKeywords.length})
        </div>
        <p className="text-xs text-muted-foreground">
          Skills and terms found in both your resume and the target job description.
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          {matchedKeywords.map((kw) => (
            <Badge key={kw} className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs px-3 py-1">
              {kw}
            </Badge>
          ))}
        </div>
      </div>

      {/* Missing Keywords */}
      <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-4">
        <div className="flex items-center gap-2 text-destructive font-bold text-base">
          <XCircle className="w-5 h-5" />
          Missing Keywords ({missingKeywords.length})
        </div>
        <p className="text-xs text-muted-foreground">
          Recommended keywords present in the job posting but missing from your resume draft.
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          {missingKeywords.map((kw) => (
            <Badge key={kw} className="bg-destructive/10 text-destructive border-destructive/20 text-xs px-3 py-1">
              + {kw}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
