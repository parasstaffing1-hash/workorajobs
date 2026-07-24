"use client";

import React, { useState, useEffect } from "react";
import { X, Send, Briefcase, Sparkles } from "lucide-react";
import { CandidateCardData } from "./CandidateCard";

interface InviteCandidateModalProps {
  candidate: CandidateCardData | null;
  isOpen: boolean;
  onClose: () => void;
  onSendInvite: (candidateUserId: string, jobId: string, message: string) => Promise<void>;
}

export function InviteCandidateModal({
  candidate,
  isOpen,
  onClose,
  onSendInvite,
}: InviteCandidateModalProps) {
  if (!isOpen || !candidate) return null;

  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [customMessage, setCustomMessage] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployerJobs = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/v1/employer/jobs?status=PUBLISHED");
        const json = await res.json();
        if (json.success && json.jobs) {
          setJobs(json.jobs);
          if (json.jobs.length > 0) setSelectedJobId(json.jobs[0].id);
        }
      } catch (_) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployerJobs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobId) {
      setError("Please select an active job posting.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await onSendInvite(candidate.userId, selectedJobId, customMessage);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to send invitation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <Send className="h-5 w-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Invite {candidate.name} to Apply
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 font-semibold text-xs border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Select Active Job Role
            </label>
            {isLoading ? (
              <p className="text-xs text-slate-400">Loading active jobs...</p>
            ) : jobs.length === 0 ? (
              <p className="text-xs text-red-500 font-semibold">No published jobs available to invite candidate to.</p>
            ) : (
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
              >
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title} ({j.location})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Personalized Invitation Message
            </label>
            <textarea
              rows={4}
              placeholder={`Hi ${candidate.name}, we reviewed your background and think your skills in ${
                candidate.skills[0] || "tech"
              } are a great fit for our open position!`}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 h-10 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || jobs.length === 0}
              className="px-5 h-10 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-md shadow-blue-500/20 disabled:opacity-50"
            >
              {isSubmitting ? "Sending Invitation..." : "Send Job Invitation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
