"use client";

import React, { useState } from "react";
import { Bookmark } from "lucide-react";

interface BookmarkButtonProps {
  jobId: string;
  initialIsSaved?: boolean;
  onToggle?: (isSaved: boolean) => void;
  className?: string;
}

export function BookmarkButton({
  jobId,
  initialIsSaved = false,
  onToggle,
  className = "",
}: BookmarkButtonProps) {
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoading(true);
    const targetState = !isSaved;

    try {
      const res = await fetch("/api/v1/candidate/saved-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          action: targetState ? "save" : "remove",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsSaved(targetState);
        if (onToggle) onToggle(targetState);
      }
    } catch (_) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isLoading}
      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
        isSaved
          ? "bg-amber-50 border-amber-300 text-amber-500 hover:bg-amber-100"
          : "bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50"
      } ${className}`}
      title={isSaved ? "Remove from saved jobs" : "Save this job"}
    >
      <Bookmark className={`h-5 w-5 ${isSaved ? "fill-amber-500 text-amber-500" : ""}`} />
    </button>
  );
}
