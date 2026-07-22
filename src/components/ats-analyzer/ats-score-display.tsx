"use client";

import { Award, CheckCircle2, ShieldAlert, Sparkles } from "lucide-react";

interface ATSScoreDisplayProps {
  atsScore: number;
  keywordMatchScore: number;
  formattingScore: number;
  completenessScore: number;
}

export function ATSScoreDisplay({
  atsScore,
  keywordMatchScore,
  formattingScore,
  completenessScore,
}: ATSScoreDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500 border-emerald-500/30 bg-emerald-500/10";
    if (score >= 60) return "text-amber-500 border-amber-500/30 bg-amber-500/10";
    return "text-destructive border-destructive/30 bg-destructive/10";
  };

  return (
    <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/50">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Overall ATS Match Score
          </span>
          <h2 className="text-3xl font-bold tracking-tight mt-1 flex items-center gap-2">
            {atsScore}/100
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${getScoreColor(
                atsScore
              )}`}
            >
              {atsScore >= 80 ? "Strong Match" : atsScore >= 60 ? "Moderate Match" : "Needs Optimization"}
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span className="text-xs text-muted-foreground font-medium">
            Calculated via AI Keyword & Parser Audit
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-background border border-border/60 space-y-1">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Keyword Match</span>
            <span className="font-semibold text-foreground">{keywordMatchScore}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${keywordMatchScore}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-background border border-border/60 space-y-1">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Formatting Quality</span>
            <span className="font-semibold text-foreground">{formattingScore}%</span>
          </div>
          <div className="w-full h-full h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${formattingScore}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-background border border-border/60 space-y-1">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Section Completeness</span>
            <span className="font-semibold text-foreground">{completenessScore}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${completenessScore}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
