"use client";

import React, { useState } from "react";
import {
  X,
  FileText,
  MessageSquare,
  Star,
  Tag,
  Clock,
  Send,
  Download,
  ExternalLink,
  UserCheck,
  Building2,
  Mail,
  Phone,
} from "lucide-react";

interface CandidateDrawerModalProps {
  applicant: any | null;
  isOpen: boolean;
  onClose: () => void;
  onAddNote: (applicationId: string, content: string) => Promise<void>;
  onAddRating: (
    applicationId: string,
    rating: number,
    recommendation: string,
    feedback: string
  ) => Promise<void>;
  onAddTag: (applicationId: string, tag: string) => Promise<void>;
}

export function CandidateDrawerModal({
  applicant,
  isOpen,
  onClose,
  onAddNote,
  onAddRating,
  onAddTag,
}: CandidateDrawerModalProps) {
  if (!isOpen || !applicant) return null;

  const [activeTab, setActiveTab] = useState<"OVERVIEW" | "RESUME" | "NOTES" | "FEEDBACK" | "TIMELINE">("OVERVIEW");
  const [noteContent, setNoteContent] = useState("");
  const [starRating, setStarRating] = useState(4);
  const [recommendation, setRecommendation] = useState("HIRE");
  const [feedbackText, setFeedbackText] = useState("");
  const [newTag, setNewTag] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    setIsSubmitting(true);
    try {
      await onAddNote(applicant.id, noteContent);
      setNoteContent("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onAddRating(applicant.id, starRating, recommendation, feedbackText);
      setFeedbackText("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    onAddTag(applicant.id, newTag);
    setNewTag("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end">
      <div className="bg-white dark:bg-slate-800 w-full max-w-2xl h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-700 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-start justify-between bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md shadow-blue-500/20">
              {applicant.candidate.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {applicant.candidate.name}
              </h2>
              <p className="text-xs text-slate-500 font-semibold">{applicant.candidate.headline}</p>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {applicant.candidate.email}</span>
                {applicant.candidate.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {applicant.candidate.phone}</span>}
              </div>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 dark:border-slate-700 px-6 gap-2 text-xs font-bold overflow-x-auto">
          {[
            { id: "OVERVIEW", label: "Overview" },
            { id: "RESUME", label: "Resume Preview" },
            { id: "NOTES", label: `Notes (${applicant.notesCount || 0})` },
            { id: "FEEDBACK", label: "Scorecard" },
            { id: "TIMELINE", label: "Timeline Audit" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600 font-extrabold"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === "OVERVIEW" && (
            <div className="space-y-6">
              {/* Job Applied */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[11px] uppercase font-bold text-slate-400">Position Applied For</span>
                <p className="font-bold text-sm text-slate-900 dark:text-white">{applicant.job?.title}</p>
                <p className="text-xs text-slate-500">{applicant.job?.location} • {applicant.job?.workMode}</p>
              </div>

              {/* Tags Manager */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Candidate Tags</span>
                <form onSubmit={handleTagSubmit} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Add tag (e.g. Top Talent, Immediate Joiner)..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="h-9 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs flex-1"
                  />
                  <button type="submit" className="px-3 h-9 rounded-xl bg-slate-900 text-white text-xs font-bold">
                    Add Tag
                  </button>
                </form>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(applicant.tags || []).map((t: any) => (
                    <span key={t.id} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                      {t.tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Candidate Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  {(applicant.candidate.skills || []).map((s: string, idx: number) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "RESUME" && (
            <div className="h-full flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">{applicant.resumeTitle}</span>
                {applicant.resumeUrl && (
                  <a
                    href={applicant.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                  >
                    <Download className="h-3.5 w-3.5" /> Download Resume
                  </a>
                )}
              </div>

              {applicant.resumeUrl ? (
                <iframe
                  src={applicant.resumeUrl}
                  className="w-full h-[450px] rounded-xl border border-slate-200"
                  title="Resume Preview"
                />
              ) : (
                <div className="p-12 text-center bg-slate-50 rounded-xl text-xs text-slate-500">
                  No online resume preview available.
                </div>
              )}
            </div>
          )}

          {activeTab === "NOTES" && (
            <div className="space-y-6">
              <form onSubmit={handleNoteSubmit} className="space-y-2">
                <textarea
                  rows={3}
                  placeholder="Add internal recruiter comment or notes..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 h-9 rounded-xl bg-blue-600 text-white font-bold text-xs"
                >
                  Save Internal Note
                </button>
              </form>

              <div className="space-y-3 pt-4 border-t border-slate-200">
                {(applicant.notes || []).map((note: any) => (
                  <div key={note.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{note.author?.name || "Recruiter"}</span>
                      <span className="text-[11px] text-slate-400">{new Date(note.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300">{note.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "FEEDBACK" && (
            <form onSubmit={handleRatingSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Interview Star Rating (1 to 5)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setStarRating(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= starRating ? "fill-amber-400 text-amber-400" : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Hiring Recommendation
                </label>
                <select
                  value={recommendation}
                  onChange={(e) => setRecommendation(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-bold"
                >
                  <option value="STRONG_HIRE">Strong Hire</option>
                  <option value="HIRE">Hire</option>
                  <option value="HOLD">Hold / Neutral</option>
                  <option value="NO_HIRE">No Hire</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Detailed Feedback Notes
                </label>
                <textarea
                  rows={4}
                  placeholder="Assess technical skills, culture fit, communication..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 rounded-xl bg-blue-600 text-white font-bold text-xs"
              >
                Submit Scorecard Rating
              </button>
            </form>
          )}

          {activeTab === "TIMELINE" && (
            <div className="relative border-l-2 border-slate-200 ml-4 space-y-4 pt-2">
              {(applicant.statusHistory || []).map((hist: any) => (
                <div key={hist.id} className="relative pl-5 text-xs">
                  <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-blue-600 border-2 border-white" />
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{hist.fromStatus} &rarr; {hist.toStatus}</span>
                      <span className="text-[11px] font-mono text-slate-400">{new Date(hist.createdAt).toLocaleString()}</span>
                    </div>
                    {hist.note && <p className="text-slate-600">{hist.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
