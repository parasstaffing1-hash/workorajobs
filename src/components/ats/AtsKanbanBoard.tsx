"use client";

import React from "react";
import { Star, MessageSquare, Tag, ArrowRight, User } from "lucide-react";
import { AtsStageBadge } from "./AtsStageBadge";

interface AtsKanbanBoardProps {
  stages: Array<{ key: string; label: string }>;
  pipeline: Record<string, any[]>;
  onMoveStage: (applicationId: string, newStage: string) => void;
  onSelectCandidate: (applicant: any) => void;
  isDark?: boolean;
}

export function AtsKanbanBoard({
  stages,
  pipeline,
  onMoveStage,
  onSelectCandidate,
  isDark = false,
}: AtsKanbanBoardProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin">
      {stages.map((stage) => {
        const items = pipeline[stage.key] || [];

        return (
          <div
            key={stage.key}
            className={`w-72 shrink-0 rounded-2xl border p-4 flex flex-col max-h-[75vh] ${
              isDark ? "bg-slate-800/80 border-slate-700" : "bg-slate-100/70 border-slate-200"
            }`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-700 mb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  {stage.label}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-100 text-blue-800">
                  {items.length}
                </span>
              </div>
            </div>

            {/* Candidates Column List */}
            <div className="space-y-3 overflow-y-auto pr-1 flex-1">
              {items.length === 0 ? (
                <div className="p-6 text-center text-[11px] font-semibold text-slate-400 border border-dashed border-slate-300 rounded-xl">
                  No applicants in {stage.label}
                </div>
              ) : (
                items.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3"
                    onClick={() => onSelectCandidate(app)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {app.candidate.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white hover:text-blue-600">
                            {app.candidate.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate max-w-[140px]">
                            {app.candidate.headline}
                          </p>
                        </div>
                      </div>

                      {app.averageRating && (
                        <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">
                          <Star className="h-3 w-3 fill-amber-400" />
                          {app.averageRating}
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-500 space-y-0.5">
                      <p className="font-semibold text-slate-700 dark:text-slate-300">{app.job?.title}</p>
                      <p>{new Date(app.appliedAt).toLocaleDateString()}</p>
                    </div>

                    {/* Quick Move Stage Trigger */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-medium">Shift stage:</span>
                      <select
                        value={stage.key}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          e.stopPropagation();
                          onMoveStage(app.id, e.target.value);
                        }}
                        className="h-7 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
                      >
                        {stages.map((s) => (
                          <option key={s.key} value={s.key}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
