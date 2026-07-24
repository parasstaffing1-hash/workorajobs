"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  Users,
  FileCheck,
  Calendar,
  Plus,
  Moon,
  Sun,
} from "lucide-react";
import { EmployerStatCard } from "@/components/employer/dashboard/EmployerStatCard";
import { HiringFunnelWidget } from "@/components/employer/dashboard/HiringFunnelWidget";
import { ApplicationTrendChart } from "@/components/employer/dashboard/ApplicationTrendChart";
import { TopJobsPerformanceWidget } from "@/components/employer/dashboard/TopJobsPerformanceWidget";
import { EmployerActivityWidget } from "@/components/employer/dashboard/EmployerActivityWidget";
import { EmployerQuickActionsWidget } from "@/components/employer/dashboard/EmployerQuickActionsWidget";
import { EmployerDashboardSkeleton } from "@/components/employer/dashboard/EmployerDashboardSkeleton";
import { AuthAlert } from "@/components/auth/AuthAlert";

export default function EmployerDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);

  const fetchDashboardMetrics = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/employer/dashboard");
      const json = await res.json();
      if (json.success) {
        setData(json);
      } else {
        throw new Error(json.error || "Failed to load employer dashboard metrics.");
      }
    } catch (err: any) {
      setAlert({ type: "error", message: err.message || "Error loading dashboard metrics." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardMetrics();
  }, []);

  const companyName = data?.company?.name || data?.companyName || "Employer Portal";
  const companyLogo = data?.company?.logoUrl || data?.companyLogo;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8 ${
        isDark ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation & Dark Mode Toggle Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md shadow-blue-500/20">
              {companyLogo ? (
                <img src={companyLogo} alt={companyName} className="w-full h-full object-cover rounded-xl" />
              ) : (
                companyName.charAt(0) || "E"
              )}
            </div>
            <div>
              <h1 className="font-bold text-sm text-slate-900 dark:text-white">
                {companyName}
              </h1>
              <span className="text-[11px] text-slate-400 font-semibold">Enterprise Hiring Command Center</span>
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

            <Link
              href="/employer/jobs/create"
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Post New Job</span>
            </Link>
          </div>
        </div>

        {alert && <AuthAlert type={alert.type} message={alert.message} />}

        {isLoading || !data ? (
          <EmployerDashboardSkeleton />
        ) : (
          <div className="space-y-8">
            {/* Quick Actions Panel */}
            <EmployerQuickActionsWidget isDark={isDark} />

            {/* Stat Counter Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <EmployerStatCard
                title="Total Job Postings"
                value={data.stats?.totalJobs || 0}
                subtitle={`${data.stats?.activeJobs || 0} Live • ${data.stats?.draftJobs || 0} Drafts`}
                icon={<Briefcase className="h-5 w-5" />}
                color="blue"
                isDark={isDark}
              />

              <EmployerStatCard
                title="Total Applications"
                value={data.stats?.totalApplications || 0}
                subtitle={`+${data.stats?.todayApplications || 0} Received Today`}
                icon={<Users className="h-5 w-5" />}
                color="indigo"
                isDark={isDark}
              />

              <EmployerStatCard
                title="Interviews Scheduled"
                value={data.stats?.interviewsScheduled || 0}
                subtitle="Active technical & HR rounds"
                icon={<Calendar className="h-5 w-5" />}
                color="amber"
                isDark={isDark}
              />

              <EmployerStatCard
                title="Live Active Postings"
                value={data.stats?.activeJobs || 0}
                subtitle={`${data.stats?.closedJobs || 0} Archived / Closed`}
                icon={<FileCheck className="h-5 w-5" />}
                color="emerald"
                isDark={isDark}
              />
            </div>

            {/* Charts Section: Hiring Funnel & 14-Day Application Trend */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <HiringFunnelWidget funnel={data.hiringFunnel || data.funnel} isDark={isDark} />
              <ApplicationTrendChart data={data.applicationTrend || data.applicationTrends} isDark={isDark} />
            </div>

            {/* Widgets Section: Top Jobs & Recent Activity Audit */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TopJobsPerformanceWidget jobs={data.topJobs} isDark={isDark} />
              <EmployerActivityWidget activity={data.recentLogs || data.recentActivity} isDark={isDark} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
