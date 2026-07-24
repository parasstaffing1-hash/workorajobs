"use client";

import React, { useState, useEffect } from "react";
import { Folder, X, CheckCircle2, AlertCircle } from "lucide-react";
import { SavedJobItemData } from "./SavedJobCard";
import { FolderItem } from "./FolderSidebar";

interface MoveToFolderModalProps {
  item: SavedJobItemData | null;
  folders: FolderItem[];
  isOpen: boolean;
  onClose: () => void;
  onMoveSuccess: () => void;
}

export function MoveToFolderModal({
  item,
  folders,
  isOpen,
  onClose,
  onMoveSuccess,
}: MoveToFolderModalProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (item) {
      setSelectedFolderId(item.folder?.id || "");
      setNotes(item.notes || "");
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/v1/candidate/saved-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: item.jobId,
          folderId: selectedFolderId || null,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update folder assignment.");
      }

      onMoveSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Error updating saved job.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Folder className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">Organize Saved Job</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-600 font-medium">
            Organizing <span className="font-bold text-slate-900">{item.title}</span> at{" "}
            <span className="font-bold text-slate-900">{item.company.name}</span>
          </p>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Select Collection Folder
            </label>
            <select
              value={selectedFolderId}
              onChange={(e) => setSelectedFolderId(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-xs focus:outline-none focus:border-blue-600 font-semibold text-slate-800"
            >
              <option value="">Unorganized (No Folder)</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  📁 {f.name} ({f.count} jobs)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Personal Notes (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Great tech stack, target for Q3 application..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-600"
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
              disabled={isSubmitting}
              className="px-5 h-9 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
