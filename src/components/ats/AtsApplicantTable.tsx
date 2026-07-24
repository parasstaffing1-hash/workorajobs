"use client";

import React from "react";
import { Star, FileText, ChevronRight, CheckSquare, Square } from "lucide-react";
import { AtsStageBadge } from "./AtsStageBadge";

interface AtsApplicantTableProps {
  applicants: any[];
  stages: Array<{ key: string; label: string }>;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onMoveStage: (applicationId: string, newStage: string) => void;
  onSelectCandidate: (applicant: any) => void;
  isDark?: boolean;
}

export function AtsApplicantTable({
  applicants,
  stages,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onMoveStage,
  onSelectCandidate,
  isDark = false,
}: AtsApplicantTableProps) {
  const allSelected = applicants.length > 0 && selectedIds.length === applicants.length;

  return (
    <div
      className={`rounded-2xl border overflow-hidden shadow-sm ${
        isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className={`border-b font-bold uppercase tracking-wider ${
              isDark ? "bg-slate-900/60 border-slate-700 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"
            }`}>
              <th className="p-4 w-10 text-center">
                <button onClick={onToggleSelectAll} className="cursor-pointer">
                  {allSelected ? (
                    <CheckSquare className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Square className="h-4 w-4 text-slate-400" />
                  )}
                </button>
              </th>
              <th className="p-4">Candidate Name</th>
              <th className="p-4">Job Applied</th>
              <th className="p-4">Current Stage</th>
              <th className="p-4">Applied Date</th>
              <th className="p-4">Rating</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {applicants.map((app) => {
              const isSelected = selectedIds.includes(app.id);

              return (
                <tr
                  key={app.id}
                  className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                    isSelected ? (isDark ? "bg-slate-700/80" : "bg-blue-50/50") : ""
                  }`}
                >
                  <td className="p-4 text-center">
                    <button onClick={() => onToggleSelect(app.id)} className="cursor-pointer">
                      {isSelected ? (
                        <CheckSquare className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Square className="h-4 w-4 text-slate-400" />
                      )}
                    </button>
                  </td>

                  <td className="p-4">
                    <div
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => onSelectCandidate(app)}
                    >
                      <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center shrink-0">
                        {app.candidate.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white hover:text-blue-600">
                          {app.candidate.name}
                        </p>
                        <p className="text-[11px] text-slate-500">{app.candidate.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{app.job?.title}</p>
                    <p className="text-[11px] text-slate-400">{app.job?.location}</p>
                  </td>

                  <td className="p-4">
                    <select
                      value={app.stageKey}
                      onChange={(e) => onMoveStage(app.id, e.target.value)}
                      className="h-8 px-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold cursor-pointer"
                    >
                      {stages.map((s) => (
                        <option key={s.key} value={s.key}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="p-4 text-slate-500">
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </td>

                  <td className="p-4">
                    {app.averageRating ? (
                      <span className="inline-flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                        <Star className="h-3.5 w-3.5 fill-amber-400" />
                        {app.averageRating}
                      </span>
                    ) : (
                      <span className="text-slate-400">Not rated</span>
                    )}
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => onSelectCandidate(app)}
                      className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      <span>Review</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
