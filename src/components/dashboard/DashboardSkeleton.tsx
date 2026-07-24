"use client";

import React from "react";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Banner Skeleton */}
      <div className="h-32 bg-slate-200 rounded-2xl w-full" />

      {/* Analytics Metric Cards Grid Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-24 bg-slate-200 rounded-2xl" />
        ))}
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="h-64 bg-slate-200 rounded-2xl w-full" />
          <div className="h-80 bg-slate-200 rounded-2xl w-full" />
        </div>
        <div className="space-y-8">
          <div className="h-48 bg-slate-200 rounded-2xl w-full" />
          <div className="h-48 bg-slate-200 rounded-2xl w-full" />
        </div>
      </div>
    </div>
  );
}
