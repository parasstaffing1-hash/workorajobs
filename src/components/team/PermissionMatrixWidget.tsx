"use client";

import React from "react";
import { Check, X, ShieldCheck } from "lucide-react";
import { ALL_PERMISSIONS, ROLE_CONFIGS, EmployerRole } from "@/lib/team/team-rbac-config";

interface PermissionMatrixWidgetProps {
  isDark?: boolean;
}

export function PermissionMatrixWidget({ isDark = false }: PermissionMatrixWidgetProps) {
  const roles: EmployerRole[] = ["OWNER", "ADMIN", "HR_MANAGER", "RECRUITER", "HIRING_MANAGER", "INTERVIEWER"];

  return (
    <div
      className={`rounded-2xl border overflow-hidden shadow-sm space-y-4 p-6 ${
        isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-blue-600" />
        <h2 className="text-base font-bold">Enterprise RBAC Permission Access Matrix</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className={`border-b font-bold uppercase tracking-wider ${
              isDark ? "bg-slate-900/60 border-slate-700 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"
            }`}>
              <th className="p-3">Feature Capability</th>
              {roles.map((r) => (
                <th key={r} className="p-3 text-center">
                  {ROLE_CONFIGS[r].label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-medium">
            {ALL_PERMISSIONS.map((perm) => (
              <tr key={perm.key} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="p-3">
                  <span className="font-bold text-slate-900 dark:text-white">{perm.label}</span>
                  <p className="text-[11px] text-slate-400">{perm.desc}</p>
                </td>

                {roles.map((role) => {
                  const hasAccess = ROLE_CONFIGS[role].defaultPermissions.includes(perm.key);

                  return (
                    <td key={role} className="p-3 text-center">
                      {hasAccess ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-400">
                          <X className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
