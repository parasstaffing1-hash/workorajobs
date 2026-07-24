"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  Plus,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { JobCardEmployer, EmployerJobItemData } from "@/components/jobs/JobCardEmployer";
import { AuthAlert } from "@/components/auth/AuthAlert";

export default function EmployerJobsDashboardPage() {
  const [jobs, setJobs] = useState<EmployerJobItemData[]>([]);
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
      });
      if (activeTab !== "ALL") params.append("status", activeTab);
      if (searchQuery.trim()) params.append("query", searchQuery.trim());

      const res = await fetch(`/api/v1/employer/jobs?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setJobs(data.jobs || []);
        setTotalPages(data.totalPages || 1);
      } else {
        throw new Error(data.error || "Failed to load job postings.");
      }
    } catch (err: any) {
      setAlert({ type: "error", message: err.message || "Error loading jobs." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [currentPage, activeTab, searchQuery]);

  const handleDuplicate = async (jobId: string) => {
    try {
      const res = await fetch(`/api/v1/employer/jobs/${jobId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "duplicate" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAlert({ type: "success", message: "Job duplicated into a new draft!" });
        fetchJobs();
        setTimeout(() => setAlert(null), 3000);
      }
    } catch (_) {}
  };

  const handleChangeStatus = async (jobId: string, status: string) => {
    try {
      const res = await fetch(`/api/v1/employer/jobs/${jobId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "change_status", status }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAlert({ type: "success", message: `Job status updated to ${status}!` });
        fetchJobs();
        setTimeout(() => setAlert(null), 3000);
      }
    } catch (_) {}
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job posting?")) return;
    try {
      const res = await fetch(`/api/v1/employer/jobs/${jobId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete" }),
      });
      if (res.ok) {
        setAlert({ type: "success", message: "Job deleted successfully." });
        fetchJobs();
        setTimeout(() => setAlert(null), 3000);
      }
    } catch (_) {}
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/employer/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Employer Dashboard</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-7 w-7 text-blue-600" />
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Job Postings Management
              </h1>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Create, edit, duplicate, and manage active tech job postings and applicants.
            </p>
          </div>

          <Link
            href="/employer/jobs/create"
            className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Job</span>
          </Link>
        </div>

        {alert && <AuthAlert type={alert.type} message={alert.message} />}

        {/* Search & Tabs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search jobs by title, department, or location..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none">
            {[
              { id: "ALL", label: "All Postings" },
              { id: "PUBLISHED", label: "Live & Active" },
              { id: "DRAFT", label: "Drafts" },
              { id: "PAUSED", label: "Paused" },
              { id: "CLOSED", label: "Closed" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-2 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white border-blue-600 font-bold shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Job Cards Grid */}
        {isLoading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
            Loading job postings...
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4">
            <Briefcase className="h-12 w-12 text-slate-300 mx-auto" />
            <div>
              <h3 className="font-bold text-slate-900 text-base">No Job Postings Found</h3>
              <p className="text-xs text-slate-500 mt-1">
                You haven't created any job postings matching the active filter.
              </p>
            </div>
            <Link
              href="/employer/jobs/create"
              className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-sm"
            >
              Post First Tech Job &rarr;
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <JobCardEmployer
                key={job.id}
                job={job}
                onDuplicate={handleDuplicate}
                onChangeStatus={handleChangeStatus}
                onDelete={handleDelete}
              />
            ))}

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <p className="text-xs font-semibold text-slate-500">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-1 h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-1 h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
