"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  CheckCircle2,
} from "lucide-react";
import { ResumeCard, ResumeCardData } from "@/components/resumes/ResumeCard";
import { ResumeUploadModal } from "@/components/resumes/ResumeUploadModal";
import { ResumeReplaceModal } from "@/components/resumes/ResumeReplaceModal";
import { ResumePreviewModal } from "@/components/resumes/ResumePreviewModal";
import { ResumeVersionHistoryModal } from "@/components/resumes/ResumeVersionHistoryModal";
import { AuthAlert } from "@/components/auth/AuthAlert";

export default function CandidateResumesPage() {
  const [resumes, setResumes] = useState<ResumeCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedForReplace, setSelectedForReplace] = useState<ResumeCardData | null>(null);
  const [selectedForPreview, setSelectedForPreview] = useState<ResumeCardData | null>(null);
  const [selectedForHistory, setSelectedForHistory] = useState<ResumeCardData | null>(null);

  const fetchResumes = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/candidate/resumes");
      const data = await res.json();
      if (data.success && data.resumes) {
        setResumes(data.resumes);
      } else {
        throw new Error(data.error || "Failed to load candidate resumes.");
      }
    } catch (err: any) {
      setAlert({
        type: "error",
        message: err.message || "Error loading candidate resumes.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleSetDefault = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/candidate/resumes/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "default" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to set default.");

      setAlert({
        type: "success",
        message: "Primary default resume updated successfully!",
      });
      fetchResumes();
      setTimeout(() => setAlert(null), 3000);
    } catch (err: any) {
      setAlert({ type: "error", message: err.message || "Error setting default resume." });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resume and all its version history?")) return;

    try {
      const res = await fetch(`/api/v1/candidate/resumes/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to delete resume.");

      setAlert({
        type: "success",
        message: "Resume deleted successfully.",
      });
      fetchResumes();
      setTimeout(() => setAlert(null), 3000);
    } catch (err: any) {
      setAlert({ type: "error", message: err.message || "Error deleting resume." });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/candidate/profile"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Candidate Profile</span>
          </Link>

          <Link
            href="/ats-analyzer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
          >
            <Sparkles className="h-4 w-4" />
            <span>Test ATS Match Score</span>
          </Link>
        </div>

        {/* Page Banner Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="h-7 w-7 text-blue-600" />
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Enterprise Resume Management
              </h1>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Upload multiple PDF/DOCX resumes, set primary default for 1-click applications, and track version history.
            </p>
          </div>

          <button
            onClick={() => setIsUploadOpen(true)}
            className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-md shadow-blue-500/20 cursor-pointer shrink-0"
          >
            <UploadCloud className="h-4 w-4" />
            <span>Upload New Resume</span>
          </button>
        </div>

        {alert && <AuthAlert type={alert.type} message={alert.message} />}

        {/* Resume List Grid */}
        {isLoading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
            Loading candidate resumes...
          </div>
        ) : resumes.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4">
            <UploadCloud className="h-12 w-12 text-slate-300 mx-auto" />
            <div>
              <h3 className="font-bold text-slate-900 text-base">No Resumes Uploaded Yet</h3>
              <p className="text-xs text-slate-500 mt-1">
                Upload your first PDF or DOCX resume to start applying to enterprise jobs.
              </p>
            </div>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-sm cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Upload Resume Now</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resumes.map((resume) => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                onSetDefault={handleSetDefault}
                onPreview={(r) => setSelectedForPreview(r)}
                onReplace={(r) => setSelectedForReplace(r)}
                onVersionHistory={(r) => setSelectedForHistory(r)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Modals */}
        <ResumeUploadModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          onUploadSuccess={() => {
            setAlert({ type: "success", message: "Resume uploaded successfully!" });
            fetchResumes();
            setTimeout(() => setAlert(null), 3000);
          }}
        />

        <ResumeReplaceModal
          resume={selectedForReplace}
          isOpen={!!selectedForReplace}
          onClose={() => setSelectedForReplace(null)}
          onReplaceSuccess={() => {
            setAlert({ type: "success", message: "Resume updated with a new version!" });
            fetchResumes();
            setTimeout(() => setAlert(null), 3000);
          }}
        />

        <ResumePreviewModal
          resume={selectedForPreview}
          isOpen={!!selectedForPreview}
          onClose={() => setSelectedForPreview(null)}
        />

        <ResumeVersionHistoryModal
          resume={selectedForHistory}
          isOpen={!!selectedForHistory}
          onClose={() => setSelectedForHistory(null)}
        />
      </div>
    </div>
  );
}
