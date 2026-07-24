"use client";

import React from "react";
import { Folder, FolderPlus, Bookmark, Layers, Trash2 } from "lucide-react";

export interface FolderItem {
  id: string;
  name: string;
  color: string;
  count: number;
}

interface FolderSidebarProps {
  folders: FolderItem[];
  totalSaved: number;
  unorganizedCount: number;
  activeFolderId: string;
  onSelectFolder: (folderId: string) => void;
  onCreateFolderClick: () => void;
  onDeleteFolder: (folderId: string) => void;
}

export function FolderSidebar({
  folders,
  totalSaved,
  unorganizedCount,
  activeFolderId,
  onSelectFolder,
  onCreateFolderClick,
  onDeleteFolder,
}: FolderSidebarProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-blue-600" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Folders &amp; Collections
          </h2>
        </div>

        <button
          onClick={onCreateFolderClick}
          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
          title="Create New Collection Folder"
        >
          <FolderPlus className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-1 text-xs font-semibold">
        {/* All Saved */}
        <button
          onClick={() => onSelectFolder("ALL")}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
            activeFolderId === "ALL"
              ? "bg-blue-600 text-white font-bold shadow-sm"
              : "text-slate-700 hover:bg-slate-50"
          }`}
        >
          <div className="flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            <span>All Saved Jobs</span>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${
            activeFolderId === "ALL" ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-600"
          }`}>
            {totalSaved}
          </span>
        </button>

        {/* Custom Folders */}
        {folders.map((folder) => {
          const isActive = activeFolderId === folder.id;
          return (
            <div key={folder.id} className="group flex items-center justify-between">
              <button
                onClick={() => onSelectFolder(folder.id)}
                className={`flex-1 flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white font-bold shadow-sm"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Folder className="h-4 w-4 shrink-0 text-blue-500" />
                  <span className="truncate">{folder.name}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                  isActive ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-600"
                }`}>
                  {folder.count}
                </span>
              </button>

              <button
                onClick={() => onDeleteFolder(folder.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-red-600 transition-opacity cursor-pointer"
                title="Delete Folder"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}

        {/* Unorganized */}
        <button
          onClick={() => onSelectFolder("UNORGANIZED")}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
            activeFolderId === "UNORGANIZED"
              ? "bg-blue-600 text-white font-bold shadow-sm"
              : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          <div className="flex items-center gap-2">
            <Folder className="h-4 w-4 text-slate-400" />
            <span>Unorganized</span>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${
            activeFolderId === "UNORGANIZED" ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-600"
          }`}>
            {unorganizedCount}
          </span>
        </button>
      </div>
    </div>
  );
}
