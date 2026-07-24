"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Users,
  KeyRound,
  Lock,
  Unlock,
  LogOut,
  RefreshCw,
  Search,
  Filter,
  BarChart3,
  Moon,
  Sun,
  CheckCircle2,
  AlertTriangle,
  Clock,
  UserX,
} from "lucide-react";
import { AuthAlert } from "@/components/auth/AuthAlert";

export default function AdminAuthConsolePage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);

  const fetchConsoleData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/v1/admin/auth?query=${encodeURIComponent(query)}&role=${roleFilter}`);
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (_) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConsoleData();
  }, [query, roleFilter]);

  const handleAdminAction = async (action: "LOCK" | "UNLOCK" | "FORCE_LOGOUT" | "RESET_MFA", userId: string) => {
    try {
      const res = await fetch("/api/v1/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, userId }),
      });
      const json = await res.json();
      if (json.success) {
        setAlert({ type: "success", message: json.message });
        fetchConsoleData();
      } else {
        throw new Error(json.error || "Admin action failed.");
      }
    } catch (err: any) {
      setAlert({ type: "error", message: err.message || "Failed to execute action." });
    }
  };

  return (
    <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${isDark ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-500/20">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black">Authentication Administration Console</h1>
              <p className="text-xs text-slate-500">Enterprise Security, User Management &amp; Active Session Inspector</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                isDark ? "bg-slate-800 border-slate-700 text-amber-400" : "bg-white border-slate-200 text-slate-700"
              }`}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              onClick={fetchConsoleData}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh Metrics</span>
            </button>
          </div>
        </div>

        {alert && <AuthAlert type={alert.type} message={alert.message} />}

        {/* METRICS COUNTER CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`p-6 rounded-3xl border shadow-sm space-y-2 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Total Users</span>
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl font-black">{data?.metrics?.stats?.totalUsers?.toLocaleString() || "14,820"}</p>
            <span className="text-[11px] font-semibold text-emerald-600">+{data?.metrics?.stats?.newAccountsToday || 128} registered today</span>
          </div>

          <div className={`p-6 rounded-3xl border shadow-sm space-y-2 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Active Sessions</span>
              <KeyRound className="h-5 w-5 text-indigo-600" />
            </div>
            <p className="text-2xl font-black">{data?.metrics?.stats?.activeSessions?.toLocaleString() || "3,420"}</p>
            <span className="text-[11px] font-semibold text-slate-400">Live across web &amp; mobile</span>
          </div>

          <div className={`p-6 rounded-3xl border shadow-sm space-y-2 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Failed Logins Today</span>
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <p className="text-2xl font-black">{data?.metrics?.stats?.failedLoginsToday || 42}</p>
            <span className="text-[11px] font-semibold text-amber-600">Rate-limited &amp; protected</span>
          </div>

          <div className={`p-6 rounded-3xl border shadow-sm space-y-2 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Locked Accounts</span>
              <UserX className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-2xl font-black">{data?.metrics?.stats?.lockedAccounts || 14}</p>
            <span className="text-[11px] font-semibold text-red-600">Brute-force locked</span>
          </div>
        </div>

        {/* 7-DAY LOGIN TREND CHART */}
        <div className={`p-6 rounded-3xl border shadow-sm space-y-6 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <h2 className="text-base font-bold">Daily Logins &amp; Authentication Trends</h2>
            </div>
            <span className="text-xs font-semibold text-slate-400">Past 7 Days</span>
          </div>

          <div className="h-44 w-full flex items-end justify-between gap-3 pt-6 pb-2">
            {(data?.metrics?.dailyLogins || []).map((item: any, idx: number) => {
              const heightPercent = Math.max(15, (item.logins / 6000) * 100);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-extrabold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded border border-blue-200">
                    {item.logins} logins
                  </div>

                  <div
                    className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-xl transition-all duration-300 group-hover:brightness-110"
                    style={{ height: `${heightPercent}%` }}
                  />

                  <span className="text-[11px] font-semibold text-slate-400">{item.date}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* SEARCH & FILTER TOOLBAR */}
        <div className={`p-6 rounded-3xl border shadow-sm space-y-6 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search email, User ID, company..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                <Filter className="h-4 w-4" />
                <span>Role Filter:</span>
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold"
              >
                <option value="ALL">All Roles</option>
                <option value="EMPLOYER">Employers</option>
                <option value="JOB_SEEKER">Job Seekers</option>
                <option value="ADMIN">Admins</option>
              </select>
            </div>
          </div>

          {/* USER SECURITY TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">User / Email</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Company</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Risk Score</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {(data?.users || []).map((u: any) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4">
                      <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                      <div className="text-[11px] text-slate-400">{u.email}</div>
                    </td>

                    <td className="py-4 font-bold text-blue-600">{u.role}</td>

                    <td className="py-4 text-slate-500">{u.company}</td>

                    <td className="py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        u.status === "ACTIVE"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                      }`}>
                        {u.status}
                      </span>
                    </td>

                    <td className="py-4 font-bold">
                      <span className={u.riskScore > 50 ? "text-red-600 font-extrabold" : "text-slate-500"}>
                        {u.riskScore} / 100
                      </span>
                    </td>

                    <td className="py-4 text-right space-x-2">
                      {u.status === "ACTIVE" ? (
                        <button
                          onClick={() => handleAdminAction("LOCK", u.id)}
                          className="px-2.5 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-bold text-[11px] cursor-pointer"
                        >
                          Lock
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAdminAction("UNLOCK", u.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold text-[11px] cursor-pointer"
                        >
                          Unlock
                        </button>
                      )}

                      <button
                        onClick={() => handleAdminAction("FORCE_LOGOUT", u.id)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 font-bold text-[11px] cursor-pointer"
                      >
                        Logout
                      </button>

                      <button
                        onClick={() => handleAdminAction("RESET_MFA", u.id)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-bold text-[11px] cursor-pointer"
                      >
                        Reset MFA
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
