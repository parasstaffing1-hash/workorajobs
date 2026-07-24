"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bookmark,
  Search,
  Filter,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  FolderPlus,
  SlidersHorizontal,
} from "lucide-react";
import { SavedJobCard, SavedJobItemData } from "@/components/saved-jobs/SavedJobCard";
import { FolderSidebar, FolderItem } from "@/components/saved-jobs/FolderSidebar";
import { CreateFolderModal } from "@/components/saved-jobs/CreateFolderModal";
import { MoveToFolderModal } from "@/components/saved-jobs/MoveToFolderModal";
import { AuthAlert } from "@/components/auth/AuthAlert";

export default function CandidateSavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<SavedJobItemData[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [totalSaved, setTotalSaved] = useState(0);
  const [unorganizedCount, setUnorganizedCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters & Search & Sort
  const [activeFolderId, setActiveFolderId] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [workModeFilter, setWorkModeFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState<"RECENTLY_SAVED" | "COMPANY_AZ" | "POSTED_DATE">("RECENTLY_SAVED");

  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);

  // Modals
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [selectedForMove, setSelectedForMove] = useState<SavedJobItemData | null>(null);

  const fetchFolders = async () => {
    try {
      const res = await fetch("/api/v1/candidate/saved-jobs/folders");
      const data = await res.json();
      if (data.success) {
        setFolders(data.folders || []);
        setTotalSaved(data.totalSaved || 0);
        setUnorganizedCount(data.unorganizedCount || 0);
      }
    } catch (_) {}
  };

  const fetchSavedJobs = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        sortBy,
      });

      if (activeFolderId && activeFolderId !== "ALL") params.append("folderId", activeFolderId);
      if (searchQuery.trim()) params.append("query", searchQuery.trim());
      if (workModeFilter && workModeFilter !== "ALL") params.append("workMode", workModeFilter);

      const res = await fetch(`/api/v1/candidate/saved-jobs?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setSavedJobs(data.savedJobs || []);
        setTotalPages(data.totalPages || 1);
      } else {
        throw new Error(data.error || "Failed to load saved jobs.");
      }
    } catch (err: any) {
      setAlert({
        type: "error",
        message: err.message || "Error loading saved jobs.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  useEffect(() => {
    fetchSavedJobs();
  }, [currentPage, activeFolderId, searchQuery, workModeFilter, sortBy]);

  const handleUnsave = async (jobId: string) => {
    try {
      const res = await fetch("/api/v1/candidate/saved-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, action: "remove" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAlert({ type: "success", message: "Job removed from saved list." });
        fetchSavedJobs();
        fetchFolders();
        setTimeout(() => setAlert(null), 3000);
      }
    } catch (err: any) {
      setAlert({ type: "error", message: err.message || "Error removing saved job." });
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (!confirm("Are you sure you want to delete this folder? Saved jobs will be moved to Unorganized.")) return;

    try {
      const res = await fetch(`/api/v1/candidate/saved-jobs/folders/${folderId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setAlert({ type: "success", message: "Folder deleted successfully." });
        fetchFolders();
        if (activeFolderId === folderId) setActiveFolderId("ALL");
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
            href="/candidate/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>

          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
          >
            <Search className="h-4 w-4" />
            <span>Browse Active Jobs</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <Bookmark className="h-7 w-7 text-amber-500 fill-amber-500" />
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Bookmarked Jobs &amp; Collections
              </h1>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Manage your saved job postings, organize them into folders, and submit 1-click applications.
            </p>
          </div>

          <button
            onClick={() => setIsCreateFolderOpen(true)}
            className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-md shadow-blue-500/20 cursor-pointer shrink-0"
          >
            <FolderPlus className="h-4 w-4" />
            <span>New Folder</span>
          </button>
        </div>

        {alert && <AuthAlert type={alert.type} message={alert.message} />}

        {/* Layout Grid: Folders Sidebar (1/3) + Saved Jobs List (2/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Folders Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <FolderSidebar
              folders={folders}
              totalSaved={totalSaved}
              unorganizedCount={unorganizedCount}
              activeFolderId={activeFolderId}
              onSelectFolder={(id) => {
                setActiveFolderId(id);
                setCurrentPage(1);
              }}
              onCreateFolderClick={() => setIsCreateFolderOpen(true)}
              onDeleteFolder={handleDeleteFolder}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search, Sort & Filters Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search saved jobs by title, company, or location..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>

                {/* Sort Selector */}
                <div className="flex items-center gap-2 shrink-0">
                  <SlidersHorizontal className="h-4 w-4 text-slate-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value as any);
                      setCurrentPage(1);
                    }}
                    className="h-10 px-3 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-600"
                  >
                    <option value="RECENTLY_SAVED">Sort by: Recently Saved</option>
                    <option value="POSTED_DATE">Sort by: Posting Date</option>
                    <option value="COMPANY_AZ">Sort by: Company (A-Z)</option>
                  </select>
                </div>
              </div>

              {/* Work Mode Filter Pills */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Work Mode:
                </span>
                {["ALL", "Remote", "Hybrid", "On-site"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      setWorkModeFilter(mode);
                      setCurrentPage(1);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      workModeFilter === mode
                        ? "bg-blue-600 text-white font-bold"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Saved Jobs List */}
            {isLoading ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
                Loading saved jobs...
              </div>
            ) : savedJobs.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4">
                <Bookmark className="h-12 w-12 text-slate-300 mx-auto" />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">No Saved Jobs Found</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    No bookmarked jobs match your active folder or search filters.
                  </p>
                </div>
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-sm"
                >
                  Explore Tech Jobs &rarr;
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {savedJobs.map((item) => (
                  <SavedJobCard
                    key={item.id}
                    item={item}
                    onMoveToFolder={(i) => setSelectedForMove(i)}
                    onUnsave={handleUnsave}
                  />
                ))}

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

        {/* Create Folder Modal */}
        <CreateFolderModal
          isOpen={isCreateFolderOpen}
          onClose={() => setIsCreateFolderOpen(false)}
          onCreateSuccess={() => {
            setAlert({ type: "success", message: "Folder created successfully!" });
            fetchFolders();
            setTimeout(() => setAlert(null), 3000);
          }}
        />

        {/* Move To Folder Modal */}
        <MoveToFolderModal
          item={selectedForMove}
          folders={folders}
          isOpen={!!selectedForMove}
          onClose={() => setSelectedForMove(null)}
          onMoveSuccess={() => {
            setAlert({ type: "success", message: "Saved job folder updated!" });
            fetchSavedJobs();
            fetchFolders();
            setTimeout(() => setAlert(null), 3000);
          }}
        />
      </div>
    </div>
  );
}
