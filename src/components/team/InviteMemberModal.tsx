"use client";

import React, { useState } from "react";
import { X, UserPlus, ShieldCheck, Mail, Building2 } from "lucide-react";
import { FormInput } from "@/components/auth/FormInput";
import { EmployerRole, ROLE_CONFIGS, ALL_PERMISSIONS } from "@/lib/team/team-rbac-config";

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (email: string, role: EmployerRole, department: string, permissions: string[]) => Promise<void>;
}

export function InviteMemberModal({ isOpen, onClose, onInvite }: InviteMemberModalProps) {
  if (!isOpen) return null;

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<EmployerRole>("RECRUITER");
  const [department, setDepartment] = useState("Engineering");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    ROLE_CONFIGS.RECRUITER.defaultPermissions
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleRoleChange = (newRole: EmployerRole) => {
    setRole(newRole);
    setSelectedPermissions(ROLE_CONFIGS[newRole]?.defaultPermissions || []);
  };

  const handleTogglePermission = (permKey: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permKey) ? prev.filter((p) => p !== permKey) : [...prev, permKey]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter member email address.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await onInvite(email, role, department, selectedPermissions);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to invite member.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <UserPlus className="h-5 w-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Invite Team Member
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 font-semibold text-xs border border-red-200">
              {error}
            </div>
          )}

          <FormInput
            label="Business Email Address"
            type="email"
            placeholder="colleague@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Employer Role
              </label>
              <select
                value={role}
                onChange={(e) => handleRoleChange(e.target.value as EmployerRole)}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
              >
                <option value="ADMIN">Admin</option>
                <option value="HR_MANAGER">HR Manager</option>
                <option value="RECRUITER">Talent Recruiter</option>
                <option value="HIRING_MANAGER">Hiring Manager</option>
                <option value="INTERVIEWER">Interviewer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
              >
                <option value="Engineering">Engineering</option>
                <option value="Product">Product &amp; Design</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Sales & Marketing">Sales &amp; Marketing</option>
                <option value="Operations">Operations</option>
              </select>
            </div>
          </div>

          {/* Role Description */}
          <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-300 font-medium">
            {ROLE_CONFIGS[role]?.description}
          </div>

          {/* Granular RBAC Permissions Checkboxes */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Granular Feature Scope
            </span>
            <div className="space-y-1.5">
              {ALL_PERMISSIONS.map((perm) => (
                <label key={perm.key} className="flex items-start gap-2 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(perm.key)}
                    onChange={() => handleTogglePermission(perm.key)}
                    className="mt-0.5 rounded text-blue-600"
                  />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{perm.label}</span>
                    <p className="text-[11px] text-slate-400">{perm.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 h-10 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 h-10 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-md shadow-blue-500/20"
            >
              {isSubmitting ? "Inviting..." : "Send Invitation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
