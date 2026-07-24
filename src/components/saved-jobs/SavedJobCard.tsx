"use client";

import React from "react";
import Link from "next/link";
import {
  Bookmark,
  MapPin,
  Building2,
  Clock,
  Folder,
  Trash2,
  Edit3,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { OneClickApplyButton } from "@/components/applications/OneClickApplyButton";

export interface SavedJobItemData {
  id: string;
  savedJobId: string;
  jobId: string;
  title: string;
  location: string;
  type: string;
  workMode: string;
  salary?: string;
  postedAt: string;
  company: {
    id: string;
    name: string;
    logoUrl?: string;
    industry?: string;
    headquartersCity?: string;
  };
  folder?: {
    id: string;
    name: string;
    color?: string;
  } | null;
  notes?: string | null;
  savedAt: string;
}

interface SavedJobCardProps {
  item: SavedJobItemData;
  onMoveToFolder: (item: SavedJobItemData) => void;
  onUnsave: (jobId: string) => void;
}

export function SavedJobCard({
  item,
  onMoveToFolder,
  onUnsave,
}: SavedJobCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all duration-200 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/80 shrink-0 overflow-hidden flex items-center justify-center font-bold text-slate-700 text-lg">
            {item.company.logoUrl ? (
              <img src={item.company.logoUrl} alt={item.company.name} className="w-full h-full object-cover" />
            ) : (
              item.company.name.charAt(0)
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-slate-900 text-base hover:text-blue-600">
                <Link href={`/jobs/${item.jobId}`}>{item.title}</Link>
              </h3>

              {item.folder && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  <Folder className="h-3 w-3 text-blue-600" />
                  {item.folder.name}
                </span>
              )}
            </div>

            <p className="text-xs font-semibold text-slate-700">{item.company.name}</p>

            <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap pt-0.5">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                {item.location} ({item.workMode})
              </span>
              {item.salary && <span>• {item.salary}</span>}
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                Saved {new Date(item.savedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Unsave action */}
        <button
          onClick={() => onUnsave(item.jobId)}
          className="p-2 rounded-xl border border-slate-200 text-amber-500 hover:bg-amber-50 hover:border-amber-300 transition-colors cursor-pointer shrink-0"
          title="Remove from Saved Jobs"
        >
          <Bookmark className="h-5 w-5 fill-amber-500" />
        </button>
      </div>

      {item.notes && (
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 font-medium">
          <span className="text-slate-400 uppercase font-bold text-[10px] block mb-0.5">Note:</span>
          {item.notes}
        </div>
      )}

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap text-xs">
        <button
          onClick={() => onMoveToFolder(item)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold transition-colors cursor-pointer"
        >
          <Folder className="h-3.5 w-3.5 text-blue-600" />
          <span>{item.folder ? "Change Folder / Notes" : "Organize into Folder"}</span>
        </button>

        <div className="flex items-center gap-2">
          <Link
            href={`/jobs/${item.jobId}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold"
          >
            <span>View Job</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>

          <OneClickApplyButton jobId={item.jobId} className="h-9 px-4" />
        </div>
      </div>
    </div>
  );
}
