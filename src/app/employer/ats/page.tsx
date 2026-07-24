"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  LayoutGrid,
  List,
  Search,
  Download,
  Filter,
  ArrowLeft,
  Moon,
  Sun,
  Briefcase,
} from "lucide-react";
import { AtsKanbanBoard } from "@/components/ats/AtsKanbanBoard";
import { AtsApplicantTable } from "@/components/ats/AtsApplicantTable";
import { CandidateDrawerModal } from "@/components/ats/CandidateDrawerModal";
import { AuthAlert } from "@/components/auth/AuthAlert";

export default function EmployerAtsDashboardPage() {
  const [viewMode, setViewMode] = useState<"KANBAN" | "TABLE">("KANBAN");
  const [stages, setStages] = useState<any[]>([]);
  const [pipeline, setPipeline] = useState<Record<string, any[]>>({});
  const [totalCount, setTotalCount] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJobId, setSelectedJobId] = useState("ALL");
  const [jobs, setJobs] = useState<any[]>([]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeCandidate, setActiveCandidate] = useState<any | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);

  const fetchAtsData = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedJobId !== "ALL") params.append("jobId", selectedJobId);
      if (searchQuery.trim()) params.append("query", searchQuery.trim());

      const res = await fetch(`/api/v1/employer/ats?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setStages(data.stages || []);
        setPipeline(data.pipeline || {});
        setTotalCount(data.totalCount || 0);
      } else {
        throw new Error(data.error || "Failed to load ATS pipeline.");
      }
    } catch (err: any) {
      setAlert({ type: "error", message: err.message || "Error loading ATS data." });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployerJobs = async () => {
    try {
      const res = await fetch("/api/v1/employer/jobs?limit=50");
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs || []);
      }
    } catch (_) {}
  };

  useEffect(() => {
    fetchEmployerJobs();
  }, []);

  useEffect(() => {
    fetchAtsData();
  }, [selectedJobId, searchQuery]);

  const handleMoveStage = async (applicationId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/v1/employer/ats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "move_stage", applicationId, newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAlert({ type: "success", message: `Moved applicant to ${newStatus}` });
        fetchAtsData();
        setTimeout(() => setAlert(null), 3000);
      }
    } catch (_) {}
  };

  const handleAddNote = async (applicationId: string, content: string) => {
    const res = await fetch("/api/v1/employer/ats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add_note", applicationId, content }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      setAlert({ type: "success", message: "Note added successfully!" });
      fetchAtsData();
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleAddRating = async (
    applicationId: string,
    rating: number,
    recommendation: string,
    feedback: string
  ) => {
    const res = await fetch("/api/v1/employer/ats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "add_rating",
        applicationId,
        rating,
        recommendation,
        feedback,
      }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      setAlert({ type: "success", message: "Scorecard feedback submitted!" });
      fetchAtsData();
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleAddTag = async (applicationId: string, tag: string) => {
    const res = await fetch("/api/v1/employer/ats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add_tag", applicationId, tag }),
    });
    if (res.ok) {
      fetchAtsData();
    }
  };

  const handleExportCsv = () => {
    window.open(`/api/v1/employer/ats/export?jobId=${selectedJobId}`, "_blank");
  };

  const allFlatApplicants = Object.values(pipeline).flat();

  return (
    <div
      className={`min-h-screen transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8 ${
        isDark ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation Bar */}
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
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
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
                Enterprise Applicant Tracking System (ATS)
              </h1>
            </div>
            <p className={`mt-1 text-xs sm:text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Manage recruitment pipeline stages, candidate scorecards, interview feedback, and notes.
            </p>
          </div>

          <div className="flex items-center gap-3">
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

        {/* Controls Bar */}
        <div
          className={`p-4 rounded-2xl border shadow-sm space-y-4 ${
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search candidates by name, email, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full h-10 pl-10 pr-4 rounded-xl border text-xs focus:outline-none focus:border-blue-600 ${
                  isDark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-300"
                }`}
              />
            </div>

            {/* Filter by Job */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className={`h-10 px-3 rounded-xl border text-xs font-bold cursor-pointer ${
                  isDark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-800"
                }`}
              >
                <option value="ALL">All Active Jobs ({jobs.length})</option>
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title}
                  </option>
                ))}
              </select>

              {/* View Switcher Tabs */}
              <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 p-1 bg-slate-100 dark:bg-slate-900">
                <button
                  onClick={() => setViewMode("KANBAN")}
                  className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer ${
                    viewMode === "KANBAN"
                      ? "bg-white dark:bg-slate-800 shadow-sm text-blue-600"
                      : "text-slate-500"
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                  <span className="hidden sm:inline">Kanban</span>
                </button>
                <button
                  onClick={() => setViewMode("TABLE")}
                  className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer ${
                    viewMode === "TABLE"
                      ? "bg-white dark:bg-slate-800 shadow-sm text-blue-600"
                      : "text-slate-500"
                  }`}
                >
                  <List className="h-4 w-4" />
                  <span className="hidden sm:inline">Table</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main View Area */}
        {isLoading ? (
          <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 text-sm">
            Loading ATS candidate pipeline...
          </div>
        ) : viewMode === "KANBAN" ? (
          <AtsKanbanBoard
            stages={stages}
            pipeline={pipeline}
            onMoveStage={handleMoveStage}
            onSelectCandidate={(cand) => setActiveCandidate(cand)}
            isDark={isDark}
          />
        ) : (
          <AtsApplicantTable
            applicants={allFlatApplicants}
            stages={stages}
            selectedIds={selectedIds}
            onToggleSelect={(id) =>
              setSelectedIds((prev) =>
                prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
              )
            }
            onToggleSelectAll={() =>
              setSelectedIds(
                selectedIds.length === allFlatApplicants.length
                  ? []
                  : allFlatApplicants.map((a) => a.id)
              )
            }
            onMoveStage={handleMoveStage}
            onSelectCandidate={(cand) => setActiveCandidate(cand)}
            isDark={isDark}
          />
        )}

        {/* Candidate Detail Drawer */}
        <CandidateDrawerModal
          applicant={activeCandidate}
          isOpen={!!activeCandidate}
          onClose={() => setActiveCandidate(null)}
          onAddNote={handleAddNote}
          onAddRating={handleAddRating}
          onAddTag={handleAddTag}
        />
      </div>
    </div>
  );
}
