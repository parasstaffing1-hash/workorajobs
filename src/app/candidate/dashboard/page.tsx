"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Moon,
  Sun,
  RefreshCw,
  User,
  FileText,
  Send,
  ShieldCheck,
} from "lucide-react";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { AnalyticsOverviewWidget } from "@/components/dashboard/AnalyticsOverviewWidget";
import { AnalyticsChartWidget } from "@/components/dashboard/AnalyticsChartWidget";
import { RecommendedJobsWidget } from "@/components/dashboard/RecommendedJobsWidget";
import { SavedJobsWidget } from "@/components/dashboard/SavedJobsWidget";
import { RecentlyViewedWidget } from "@/components/dashboard/RecentlyViewedWidget";
import { DashboardProfileWidget } from "@/components/dashboard/DashboardProfileWidget";
import { DashboardResumeWidget } from "@/components/dashboard/DashboardResumeWidget";
import { UpcomingInterviewsWidget } from "@/components/dashboard/UpcomingInterviewsWidget";
import { NotificationsWidget } from "@/components/dashboard/NotificationsWidget";
import { RecentActivityWidget } from "@/components/dashboard/RecentActivityWidget";
import { AuthAlert } from "@/components/auth/AuthAlert";

export default function CandidateDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/candidate/dashboard");
      const json = await res.json();
      if (json.success && json.dashboard) {
        setData(json.dashboard);
      } else {
        throw new Error(json.error || "Failed to load dashboard metrics.");
      }
    } catch (err: any) {
      setAlert({
        type: "error",
        message: err.message || "Error loading dashboard metrics.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8 ${
        isDark ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Candidate Dashboard</h1>
              <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Real-time job application analytics, interview schedule, and ATS profile metrics.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Link Navigation */}
            <div className="flex items-center gap-2">
              <Link
                href="/candidate/profile"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                Profile
              </Link>
              <Link
                href="/candidate/resumes"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                Resumes
              </Link>
              <Link
                href="/candidate/applications"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                Applications
              </Link>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isDark
                  ? "bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Refresh */}
            <button
              onClick={fetchDashboardData}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isDark
                  ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
              title="Refresh Dashboard Data"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {alert && <AuthAlert type={alert.type} message={alert.message} />}

        {/* Dashboard Content */}
        {isLoading || !data ? (
          <DashboardSkeleton />
        ) : (
          <div className="space-y-8">
            {/* 1. Analytics Overview Metric Cards */}
            <AnalyticsOverviewWidget stats={data.stats} isDark={isDark} />

            {/* Main 2-Column Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Main Column (2/3) */}
              <div className="lg:col-span-2 space-y-8">
                {/* Application Trend Bar Chart */}
                <AnalyticsChartWidget trendData={data.applicationTrend} isDark={isDark} />

                {/* Recommended Jobs for Candidate */}
                <RecommendedJobsWidget
                  jobs={data.recommendedJobs}
                  isDark={isDark}
                  onApplied={fetchDashboardData}
                />

                {/* Saved Jobs Widget */}
                <SavedJobsWidget jobs={data.savedJobs} isDark={isDark} />

                {/* Recently Viewed Jobs */}
                <RecentlyViewedWidget jobs={data.recentlyViewed} isDark={isDark} />
              </div>

              {/* Right Sidebar Column (1/3) */}
              <div className="space-y-8">
                {/* Profile Completion Score */}
                <DashboardProfileWidget report={data.profileReport} isDark={isDark} />

                {/* Primary Default Resume Status */}
                <DashboardResumeWidget resume={data.defaultResume} isDark={isDark} />

                {/* Upcoming Scheduled Interviews */}
                <UpcomingInterviewsWidget interviews={data.upcomingInterviews} isDark={isDark} />

                {/* Notifications & Alerts Feed */}
                <NotificationsWidget notifications={data.notifications} isDark={isDark} />

                {/* Candidate Activity Audit Log */}
                <RecentActivityWidget activities={data.recentActivity} isDark={isDark} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
