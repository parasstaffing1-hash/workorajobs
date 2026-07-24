"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Briefcase, Search, Filter, Sparkles, Send } from "lucide-react";
import { ApplicationCard, ApplicationCardData } from "@/components/applications/ApplicationCard";
import { ApplicationTimelineModal } from "@/components/applications/ApplicationTimelineModal";
import { WithdrawModal } from "@/components/applications/WithdrawModal";
import { AuthAlert } from "@/components/auth/AuthAlert";

export default function CandidateApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationCardData[]>([]);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);

  const [selectedForTimeline, setSelectedForTimeline] = useState<ApplicationCardData | null>(null);
  const [selectedForWithdraw, setSelectedForWithdraw] = useState<ApplicationCardData | null>(null);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/v1/candidate/applications?status=${activeFilter}`);
      const data = await res.json();
      if (data.success && data.applications) {
        setApplications(data.applications);
      } else {
        throw new Error(data.error || "Failed to load applications.");
      }
    } catch (err: any) {
      setAlert({
        type: "error",
        message: err.message || "Error loading applications history.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [activeFilter]);

  const filteredApps = applications.filter((app) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      app.job.title.toLowerCase().includes(q) ||
      app.job.company?.name.toLowerCase().includes(q) ||
      app.status.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/candidate/profile"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Candidate Profile</span>
          </Link>

          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
          >
            <Search className="h-4 w-4" />
            <span>Browse Active Tech Jobs</span>
          </Link>
        </div>

        {/* Page Banner Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <Send className="h-7 w-7 text-blue-600" />
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Application History &amp; Status Funnel
              </h1>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Track your submitted job applications, interview schedules, offers, and real-time recruitment status timelines.
            </p>
          </div>
        </div>

        {alert && <AuthAlert type={alert.type} message={alert.message} />}

        {/* Filter Tabs & Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search applications by role title or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="text-xs font-semibold text-slate-500 whitespace-nowrap">
              Showing {filteredApps.length} applications
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none">
            {[
              { id: "ALL", label: "All Applications" },
              { id: "APPLIED", label: "Applied" },
              { id: "UNDER_REVIEW", label: "Under Review" },
              { id: "INTERVIEW_SCHEDULED", label: "Interviews" },
              { id: "OFFER_EXTENDED", label: "Offers" },
              { id: "HIRED", label: "Hired" },
              { id: "WITHDRAWN", label: "Withdrawn" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === tab.id
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Application Cards List */}
        {isLoading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
            Loading application history...
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4">
            <Briefcase className="h-12 w-12 text-slate-300 mx-auto" />
            <div>
              <h3 className="font-bold text-slate-900 text-base">No Applications Found</h3>
              <p className="text-xs text-slate-500 mt-1">
                You haven't submitted any job applications matching the selected filter.
              </p>
            </div>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-sm"
            >
              Explore Job Postings &rarr;
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApps.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                onViewTimeline={(a) => setSelectedForTimeline(a)}
                onWithdraw={(a) => setSelectedForWithdraw(a)}
              />
            ))}
          </div>
        )}

        {/* Timeline Modal */}
        <ApplicationTimelineModal
          application={selectedForTimeline}
          isOpen={!!selectedForTimeline}
          onClose={() => setSelectedForTimeline(null)}
        />

        {/* Withdraw Modal */}
        <WithdrawModal
          application={selectedForWithdraw}
          isOpen={!!selectedForWithdraw}
          onClose={() => setSelectedForWithdraw(null)}
          onWithdrawSuccess={() => {
            setAlert({ type: "success", message: "Application withdrawn successfully." });
            fetchApplications();
            setTimeout(() => setAlert(null), 3000);
          }}
        />
      </div>
    </div>
  );
}
