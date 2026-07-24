"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  Search,
  ShieldCheck,
  ArrowLeft,
  Moon,
  Sun,
  Building2,
} from "lucide-react";
import { TeamMemberCard, TeamMemberData } from "@/components/team/TeamMemberCard";
import { InviteMemberModal } from "@/components/team/InviteMemberModal";
import { PermissionMatrixWidget } from "@/components/team/PermissionMatrixWidget";
import { AuthAlert } from "@/components/auth/AuthAlert";
import { EmployerRole } from "@/lib/team/team-rbac-config";

export default function EmployerTeamPage() {
  const [activeTab, setActiveTab] = useState<"MEMBERS" | "MATRIX">("MEMBERS");
  const [members, setMembers] = useState<TeamMemberData[]>([]);
  const [companyName, setCompanyName] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMemberData | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);

  const fetchTeamMembers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/employer/team");
      const json = await res.json();
      if (json.success) {
        setMembers(json.members || []);
        setCompanyName(json.companyName || "");
      } else {
        throw new Error(json.error || "Failed to fetch team members.");
      }
    } catch (err: any) {
      setAlert({ type: "error", message: err.message || "Error loading team." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleInvite = async (
    email: string,
    role: EmployerRole,
    department: string,
    permissions: string[]
  ) => {
    const res = await fetch("/api/v1/employer/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role, department, permissions }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Failed to invite member.");
    }

    setAlert({ type: "success", message: `Team invitation sent to ${email}!` });
    fetchTeamMembers();
    setTimeout(() => setAlert(null), 3000);
  };

  const handleToggleSuspend = async (memberId: string) => {
    try {
      const res = await fetch(`/api/v1/employer/team/${memberId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "suspend" }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setAlert({ type: "success", message: json.message });
        fetchTeamMembers();
        setTimeout(() => setAlert(null), 3000);
      }
    } catch (_) {}
  };

  const handleRemove = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this member from the workspace?")) return;
    try {
      const res = await fetch(`/api/v1/employer/team/${memberId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "remove" }),
      });
      if (res.ok) {
        setAlert({ type: "success", message: "Member removed." });
        fetchTeamMembers();
        setTimeout(() => setAlert(null), 3000);
      }
    } catch (_) {}
  };

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === "ALL" || m.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div
      className={`min-h-screen transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8 ${
        isDark ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/employer/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Employer Dashboard</span>
          </Link>

          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
              isDark ? "bg-slate-800 border-slate-700 text-amber-400" : "bg-white border-slate-200 text-slate-700"
            }`}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>

        {/* Page Header */}
        <div
          className={`p-6 sm:p-8 rounded-2xl border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              <Users className="h-7 w-7 text-blue-600" />
              <h1 className="text-xl sm:text-2xl font-bold">
                Team &amp; Enterprise RBAC Management
              </h1>
            </div>
            <p className={`mt-1 text-xs sm:text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Manage team members, assign departments, configure roles (Owner, Admin, HR, Recruiter, Interviewer).
            </p>
          </div>

          <button
            onClick={() => setIsInviteOpen(true)}
            className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer shrink-0"
          >
            <UserPlus className="h-4 w-4" />
            <span>Invite Team Member</span>
          </button>
        </div>

        {alert && <AuthAlert type={alert.type} message={alert.message} />}

        {/* Tab & Controls Bar */}
        <div
          className={`p-4 rounded-2xl border shadow-sm space-y-4 ${
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 border-b-2 sm:border-b-0 border-slate-200 dark:border-slate-700 pb-2 sm:pb-0">
              <button
                onClick={() => setActiveTab("MEMBERS")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "MEMBERS"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                Team Members ({members.length})
              </button>
              <button
                onClick={() => setActiveTab("MATRIX")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "MATRIX"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                Permission Matrix
              </button>
            </div>

            {activeTab === "MEMBERS" && (
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full h-9 pl-9 pr-3 rounded-xl border text-xs focus:outline-none focus:border-blue-600 ${
                      isDark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-300"
                    }`}
                  />
                </div>

                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className={`h-9 px-3 rounded-xl border text-xs font-bold cursor-pointer ${
                    isDark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-300"
                  }`}
                >
                  <option value="ALL">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Product">Product</option>
                  <option value="Human Resources">HR</option>
                  <option value="Sales & Marketing">Sales</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Tab Views */}
        {isLoading ? (
          <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 text-sm">
            Loading team members...
          </div>
        ) : activeTab === "MEMBERS" ? (
          filteredMembers.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 text-sm">
              No team members match your criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMembers.map((member) => (
                <TeamMemberCard
                  key={member.id}
                  member={member}
                  onEditRole={(m) => setIsInviteOpen(true)}
                  onToggleSuspend={handleToggleSuspend}
                  onRemove={handleRemove}
                  isDark={isDark}
                />
              ))}
            </div>
          )
        ) : (
          <PermissionMatrixWidget isDark={isDark} />
        )}

        {/* Invite Modal */}
        <InviteMemberModal
          isOpen={isInviteOpen}
          onClose={() => setIsInviteOpen(false)}
          onInvite={handleInvite}
        />
      </div>
    </div>
  );
}
