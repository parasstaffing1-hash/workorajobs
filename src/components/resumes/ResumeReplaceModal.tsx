"use client";

import React, { useState, useRef } from "react";
import { RefreshCw, X, CheckCircle2, AlertCircle } from "lucide-react";
import { validateResumeFile, formatFileSize } from "@/lib/resumes/resume-validation";
import { ResumeCardData } from "./ResumeCard";

interface ResumeReplaceModalProps {
  resume: ResumeCardData | null;
  isOpen: boolean;
  onClose: () => void;
  onReplaceSuccess: () => void;
}

export function ResumeReplaceModal({
  resume,
  isOpen,
  onClose,
  onReplaceSuccess,
}: ResumeReplaceModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [changeSummary, setChangeSummary] = useState("");
  const [error, setError] = useState("");
  const [isReplacing, setIsReplacing] = useState(false);

  if (!isOpen || !resume) return null;

  const handleFileSelect = (file: File) => {
    setError("");
    const validation = validateResumeFile(file.name, file.size, file.type);
    if (!validation.valid) {
      setError(validation.error || "File validation failed.");
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select a new PDF or DOCX file.");
      return;
    }

    setIsReplacing(true);
    setError("");

    try {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = async () => {
        try {
          const base64Data = (reader.result as string).split(",")[1];
          const res = await fetch(`/api/v1/candidate/resumes/${resume.id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "replace",
              base64Data,
              fileName: selectedFile.name,
              fileType: selectedFile.type,
              changeSummary: changeSummary.trim() || `Updated to version ${resume.version + 1}.0`,
            }),
          });

          const data = await res.json();
          if (!res.ok || !data.success) {
            throw new Error(data.error || "Failed to replace resume.");
          }

          onReplaceSuccess();
          onClose();
        } catch (err: any) {
          setError(err.message || "Error replacing resume file.");
        } finally {
          setIsReplacing(false);
        }
      };
    } catch (err: any) {
      setError(err.message || "Error reading file.");
      setIsReplacing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Replace Resume (Version {resume.version + 1}.0)
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-600">
            Uploading a new file will update <span className="font-bold text-slate-900">{resume.title}</span> and create version <span className="font-mono font-bold text-blue-600">v{resume.version + 1}.0</span> in history.
          </p>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center cursor-pointer hover:border-blue-400 bg-slate-50/50"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
            />

            {selectedFile ? (
              <div className="space-y-1">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
                <p className="font-bold text-slate-900 text-xs">{selectedFile.name}</p>
                <p className="text-[11px] text-slate-500 font-mono">{formatFileSize(selectedFile.size)}</p>
              </div>
            ) : (
              <p className="text-xs font-semibold text-blue-600">Click to select new resume file (.pdf, .docx)</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Version Change Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Updated work history for 2026, added Next.js certification"
              value={changeSummary}
              onChange={(e) => setChangeSummary(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 h-9 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isReplacing || !selectedFile}
              className="px-5 h-9 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 disabled:opacity-60 cursor-pointer"
            >
              {isReplacing ? "Uploading..." : `Create Version ${resume.version + 1}.0`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
