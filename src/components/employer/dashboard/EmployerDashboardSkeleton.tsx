"use client";

import React from "react";

export function EmployerDashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />

      {/* Stats Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
      </div>

      {/* Widgets Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-60 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
        <div className="h-60 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
      </div>
    </div>
  );
}
