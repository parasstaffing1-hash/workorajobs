"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Download,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Moon,
  Sun,
  Filter,
  Save,
} from "lucide-react";
import { CandidateCard, CandidateCardData } from "@/components/candidates/CandidateCard";
import { InviteCandidateModal } from "@/components/candidates/InviteCandidateModal";
import { AuthAlert } from "@/components/auth/AuthAlert";

export default function EmployerCandidateSearchPage() {
  const [candidates, setCandidates] = useState<CandidateCardData[]>([]);
  const [savedSearches, setSavedSearches] = useState<any[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("ALL");
  const [maxSalary, setMaxSalary] = useState<number | undefined>(undefined);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [activeInviteCandidate, setActiveInviteCandidate] = useState<CandidateCardData | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);

  const fetchCandidates = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
      });
      if (searchQuery.trim()) params.append("query", searchQuery.trim());
      if (location.trim()) params.append("location", location.trim());
      if (noticePeriod !== "ALL") params.append("noticePeriod", noticePeriod);
      if (maxSalary) params.append("maxSalary", maxSalary.toString());

      const res = await fetch(`/api/v1/employer/candidates/search?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setCandidates(data.candidates || []);
        setTotalPages(data.totalPages || 1);
        setSavedSearches(data.savedSearches || []);
      } else {
        throw new Error(data.error || "Failed to search candidates.");
      }
    } catch (err: any) {
      setAlert({ type: "error", message: err.message || "Error searching candidates." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [currentPage, noticePeriod]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCandidates();
  };

  const handleSaveSearchAlert = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await fetch("/api/v1/employer/candidates/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save_search",
          title: `Search: ${searchQuery}`,
          filters: { query: searchQuery, location, noticePeriod },
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAlert({ type: "success", message: "Candidate search criteria saved for alerts!" });
        setTimeout(() => setAlert(null), 3000);
      }
    } catch (_) {}
  };

  const handleSendInvite = async (candidateUserId: string, jobId: string, message: string) => {
    const res = await fetch("/api/v1/employer/candidates/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "invite_candidate",
        candidateUserId,
        jobId,
        message,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to send job invitation.");
    }

    setAlert({ type: "success", message: "Job invitation successfully sent to candidate!" });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleExportCsv = () => {
    window.open("/api/v1/employer/candidates/search/export", "_blank");
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8 ${
        isDark ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation Header */}
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

        {/* Page Header Banner */}
        <div
          className={`p-6 sm:p-8 rounded-2xl border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              <Users className="h-7 w-7 text-blue-600" />
              <h1 className="text-xl sm:text-2xl font-bold">
                Enterprise Candidate Sourcing &amp; Talent Pool
              </h1>
            </div>
            <p className={`mt-1 text-xs sm:text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Search verified job seekers by skills, experience, location, notice period, and send direct job invitations.
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

        {/* Search & Granular Filters Panel */}
        <form
          onSubmit={handleSearchSubmit}
          className={`p-6 rounded-2xl border shadow-sm space-y-4 ${
            isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search candidates by skills (React, Python), headline, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full h-10 pl-10 pr-4 rounded-xl border text-xs focus:outline-none focus:border-blue-600 ${
                  isDark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-300"
                }`}
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto h-10 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer shrink-0"
            >
              Search Talent
            </button>

            {searchQuery.trim() && (
              <button
                type="button"
                onClick={handleSaveSearchAlert}
                className="h-10 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Save className="h-4 w-4 text-amber-600" />
                <span>Save Search</span>
              </button>
            )}
          </div>

          {/* Secondary Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100 dark:border-slate-700">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Location</label>
              <input
                type="text"
                placeholder="e.g. San Francisco / Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={`w-full h-9 px-3 rounded-xl border text-xs ${
                  isDark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-300"
                }`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Notice Period</label>
              <select
                value={noticePeriod}
                onChange={(e) => setNoticePeriod(e.target.value)}
                className={`w-full h-9 px-3 rounded-xl border text-xs font-bold ${
                  isDark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-800"
                }`}
              >
                <option value="ALL">All Notice Periods</option>
                <option value="Immediate">Immediate Joiner</option>
                <option value="15 Days">15 Days</option>
                <option value="30 Days">30 Days</option>
                <option value="60 Days">60 Days</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Max Expected Salary ($/yr)</label>
              <input
                type="number"
                placeholder="e.g. 150000"
                value={maxSalary || ""}
                onChange={(e) => setMaxSalary(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                className={`w-full h-9 px-3 rounded-xl border text-xs ${
                  isDark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-300"
                }`}
              />
            </div>
          </div>
        </form>

        {/* Candidate List Results Grid */}
        {isLoading ? (
          <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 text-sm">
            Searching candidate database...
          </div>
        ) : candidates.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 text-sm space-y-2">
            <Users className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-900 dark:text-white">No Candidates Match Your Filters</h3>
            <p className="text-xs">Try broadening your search query or removing notice period filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidates.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  onInviteToApply={(cand) => setActiveInviteCandidate(cand)}
                  isDark={isDark}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <p className="text-xs font-semibold text-slate-500">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-1 h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-1 h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Invite Modal */}
        <InviteCandidateModal
          candidate={activeInviteCandidate}
          isOpen={!!activeInviteCandidate}
          onClose={() => setActiveInviteCandidate(null)}
          onSendInvite={handleSendInvite}
        />
      </div>
    </div>
  );
}
