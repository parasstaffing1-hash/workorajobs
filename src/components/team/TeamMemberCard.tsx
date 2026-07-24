"use client";

import React from "react";
import { User, Mail, Building2, Clock, ShieldAlert, MoreVertical, Trash2, Ban, CheckCircle2 } from "lucide-react";
import { RoleBadge } from "./RoleBadge";
import { EmployerRole } from "@/lib/team/team-rbac-config";

export interface TeamMemberData {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: EmployerRole;
  department: string;
  status: string;
  permissions: string[];
  lastLogin: string;
  joinedAt: string;
}

interface TeamMemberCardProps {
  member: TeamMemberData;
  onEditRole: (member: TeamMemberData) => void;
  onToggleSuspend: (memberId: string) => void;
  onRemove: (memberId: string) => void;
  isDark?: boolean;
}

export function TeamMemberCard({
  member,
  onEditRole,
  onToggleSuspend,
  onRemove,
  isDark = false,
}: TeamMemberCardProps) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all duration-200 space-y-4 ${
        isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
            {member.name.charAt(0).toUpperCase()}
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm hover:text-blue-600">{member.name}</h3>
              {member.status === "SUSPENDED" ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-100 text-red-800 border border-red-300">
                  Suspended
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Active
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Mail className="h-3 w-3 text-slate-400" />
              {member.email}
            </p>
          </div>
        </div>

        <RoleBadge role={member.role} />
      </div>

      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between text-xs flex-wrap gap-2">
        <div className="flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-400">
          <Building2 className="h-3.5 w-3.5 text-slate-400" />
          <span>Department:</span>
          <span className="font-bold text-slate-900 dark:text-white">{member.department}</span>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
          <Clock className="h-3 w-3" />
          <span>Last login {new Date(member.lastLogin).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2 text-xs">
        <button
          onClick={() => onEditRole(member)}
          className="font-bold text-blue-600 hover:underline cursor-pointer"
        >
          Manage Role &amp; Scope
        </button>

        {member.role !== "OWNER" && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSuspend(member.id)}
              className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:text-amber-600 hover:bg-amber-50 cursor-pointer"
              title={member.status === "SUSPENDED" ? "Reactivate Access" : "Suspend Access"}
            >
              <Ban className="h-4 w-4" />
            </button>

            <button
              onClick={() => onRemove(member.id)}
              className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
              title="Remove Team Member"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
