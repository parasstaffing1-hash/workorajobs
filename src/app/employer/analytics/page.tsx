"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Eye,
  Users,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  Printer,
  ArrowLeft,
  Moon,
  Sun,
  PieChart,
  Filter,
} from "lucide-react";
import { EmployerStatCard } from "@/components/employer/dashboard/EmployerStatCard";
import { HiringFunnelWidget } from "@/components/employer/dashboard/HiringFunnelWidget";
import { AuthAlert } from "@/components/auth/AuthAlert";
import { TimeRange } from "@/lib/employer/employer-analytics-service";

export default function EmployerAnalyticsPage() {
  const [range, setRange] = useState<TimeRange>("MONTHLY");
  const [data, setData] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/v1/employer/analytics?range=${range}`);
      const json = await res.json();
      if (json.success) {
        setData(json);
      } else {
        throw new Error(json.error || "Failed to load analytics report.");
      }
    } catch (err: any) {
      setAlert({ type: "error", message: err.message || "Error loading analytics." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [range]);

  const handleExportCsv = () => {
    window.open(`/api/v1/employer/analytics/export?range=${range}`, "_blank");
  };

  const handleExportPdf = () => {
    window.print();
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8 ${
        isDark ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation */}
        <div className="flex items-center justify-between print:hidden">
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
              <BarChart3 className="h-7 w-7 text-blue-600" />
              <h1 className="text-xl sm:text-2xl font-bold">
                Enterprise Recruitment Analytics &amp; Reports
              </h1>
            </div>
            <p className={`mt-1 text-xs sm:text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Measure impressions, conversion rates, applicant acquisition channels, time-to-hire, and cost-per-hire.
            </p>
          </div>

          <div className="flex items-center gap-3 print:hidden">
            <button
              onClick={handleExportPdf}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              <Printer className="h-4 w-4 text-purple-600" />
              <span>Export PDF / Print</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              <Download className="h-4 w-4 text-emerald-600" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {alert && <AuthAlert type={alert.type} message={alert.message} />}

        {/* Time Granularity Filter Bar */}
        <div
          className={`p-4 rounded-2xl border shadow-sm flex items-center justify-between print:hidden ${
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          }`}
        >
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Analytics Timeframe</span>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
            {(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"] as TimeRange[]).map((t) => (
              <button
                key={t}
                onClick={() => setRange(t)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  range === t
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {isLoading || !data ? (
          <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 text-sm">
            Calculating analytics metrics...
          </div>
        ) : (
          <div className="space-y-8">
            {/* Top Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <EmployerStatCard
                title="Job Impressions & Views"
                value={data.metrics.totalViews.toLocaleString()}
                subtitle="Candidate page views"
                icon={<Eye className="h-5 w-5" />}
                color="blue"
                isDark={isDark}
              />

              <EmployerStatCard
                title="Candidate Applications"
                value={data.metrics.totalApplications.toLocaleString()}
                subtitle={`Conversion: ${data.metrics.conversionRate}`}
                icon={<Users className="h-5 w-5" />}
                color="indigo"
                isDark={isDark}
              />

              <EmployerStatCard
                title="Average Time To Hire"
                value={data.metrics.timeToHire}
                subtitle="From job post to hired"
                icon={<Clock className="h-5 w-5" />}
                color="amber"
                isDark={isDark}
              />

              <EmployerStatCard
                title="Cost Per Hire"
                value={data.metrics.costPerHire}
                subtitle="Recruitment cost benchmark"
                icon={<DollarSign className="h-5 w-5" />}
                color="emerald"
                isDark={isDark}
              />
            </div>

            {/* Funnel & Channels Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <HiringFunnelWidget funnel={data.funnel} isDark={isDark} />

              {/* Applicant Channel Sources Widget */}
              <div
                className={`rounded-2xl border p-6 shadow-sm space-y-6 ${
                  isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-purple-600" />
                  <h2 className="text-base font-bold">Applicant Acquisition Channels</h2>
                </div>

                <div className="space-y-4">
                  {data.sources.map((source: any) => (
                    <div key={source.channel} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span>{source.channel}</span>
                        <span>{source.count} candidates</span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                        <div
                          className={`h-full ${source.color} transition-all rounded-full`}
                          style={{
                            width: `${Math.max(
                              8,
                              Math.round((source.count / Math.max(1, data.metrics.totalApplications)) * 100)
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Jobs Performance Detailed Table */}
            <div
              className={`rounded-2xl border overflow-hidden shadow-sm p-6 space-y-4 ${
                isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
              }`}
            >
              <h2 className="text-base font-bold">Detailed Job Listing Performance Report</h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className={`border-b font-bold uppercase tracking-wider ${
                      isDark ? "bg-slate-900/60 border-slate-700 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"
                    }`}>
                      <th className="p-3">Job Title</th>
                      <th className="p-3 text-right">Job Views</th>
                      <th className="p-3 text-right">Applications</th>
                      <th className="p-3 text-right">Conversion Rate</th>
                      <th className="p-3 text-center">Posting Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-medium">
                    {data.topPerformingJobs.map((j: any) => (
                      <tr key={j.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="p-3 font-bold text-slate-900 dark:text-white">{j.title}</td>
                        <td className="p-3 text-right text-slate-500">{j.views}</td>
                        <td className="p-3 text-right font-extrabold text-blue-600">{j.applications}</td>
                        <td className="p-3 text-right font-bold text-emerald-600">{j.conversionRate}</td>
                        <td className="p-3 text-center">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                            {j.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
