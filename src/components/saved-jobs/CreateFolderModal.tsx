"use client";

import React, { useState } from "react";
import { FolderPlus, X, AlertCircle } from "lucide-react";
import { FormInput } from "@/components/auth/FormInput";

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSuccess: () => void;
}

export function CreateFolderModal({
  isOpen,
  onClose,
  onCreateSuccess,
}: CreateFolderModalProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("blue");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter a collection folder name.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/v1/candidate/saved-jobs/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), color }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create folder.");
      }

      setName("");
      onCreateSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Error creating folder.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderPlus className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">New Collection Folder</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <FormInput
            label="Folder Name"
            placeholder="e.g. Remote Tech Lead, High Salary, Top Priority"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Folder Tag Color
            </label>
            <div className="flex items-center gap-3">
              {["blue", "purple", "emerald", "amber", "rose"].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${
                    color === c ? "scale-110 ring-2 ring-blue-600 ring-offset-2" : ""
                  }`}
                  style={{
                    backgroundColor:
                      c === "blue"
                        ? "#2563eb"
                        : c === "purple"
                        ? "#9333ea"
                        : c === "emerald"
                        ? "#10b981"
                        : c === "amber"
                        ? "#f59e0b"
                        : "#f43f5e",
                  }}
                />
              ))}
            </div>
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
              {isSubmitting ? "Creating..." : "Create Folder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
