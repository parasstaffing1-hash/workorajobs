"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, X, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { validateResumeFile, formatFileSize } from "@/lib/resumes/resume-validation";
import { FormInput } from "@/components/auth/FormInput";

interface ResumeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

export function ResumeUploadModal({
  isOpen,
  onClose,
  onUploadSuccess,
}: ResumeUploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  if (!isOpen) return null;

  const handleFileSelect = (file: File) => {
    setError("");
    const validation = validateResumeFile(file.name, file.size, file.type);
    if (!validation.valid) {
      setError(validation.error || "File validation failed.");
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
    if (!title) {
      const cleanTitle = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9 -]/g, " ");
      setTitle(cleanTitle);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select a PDF or DOCX resume file to upload.");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      if (title) formData.append("title", title);
      formData.append("isDefault", isDefault ? "true" : "false");

      const res = await fetch("/api/v1/candidate/resumes", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload resume.");
      }

      onUploadSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Error uploading resume file.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UploadCloud className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">Upload Resume</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Drag and Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
              isDragOver
                ? "border-blue-600 bg-blue-50/50"
                : selectedFile
                ? "border-emerald-300 bg-emerald-50/30"
                : "border-slate-300 hover:border-blue-400 bg-slate-50/50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
            />

            {selectedFile ? (
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <p className="font-bold text-slate-900 text-sm truncate max-w-xs mx-auto">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-slate-500 font-mono">
                  {formatFileSize(selectedFile.size)}
                </p>
                <p className="text-[11px] text-blue-600 font-semibold hover:underline pt-1">
                  Click to choose a different file
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <UploadCloud className="h-10 w-10 text-slate-400 mx-auto" />
                <p className="font-semibold text-slate-900 text-sm">
                  Drag &amp; drop your resume here, or{" "}
                  <span className="text-blue-600 underline">browse files</span>
                </p>
                <p className="text-xs text-slate-500">
                  Supports PDF (.pdf) and Word documents (.docx, .doc) up to 10 MB.
                </p>
              </div>
            )}
          </div>

          <FormInput
            label="Resume Label / Title"
            placeholder="e.g. Senior Frontend Engineer Resume (2026)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label className="flex items-center gap-2 cursor-pointer select-none pt-1">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-xs font-semibold text-slate-700">
              Set as my primary default resume for 1-click applications
            </span>
          </label>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 h-10 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !selectedFile}
              className="px-6 h-10 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20 disabled:opacity-60 cursor-pointer"
            >
              {isUploading ? "Uploading File..." : "Upload Resume"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
