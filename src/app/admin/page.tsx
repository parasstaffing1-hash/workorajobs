'use client';
import { useState } from "react";
import { ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";

import { MetricGrid } from "@/components/platform/metric-grid";
import { PlatformShell } from "@/components/platform/platform-shell";
import { RecordList } from "@/components/platform/record-list";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { ButtonLink } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import {
  adminMetrics,
  adminNav,
  adminTimeline,
  systemStats,
} from "@/data/platform";

export default function AdminDashboardPage() {
  const [isStatsExpanded, setIsStatsExpanded] = useState(true);
  return (
    <PlatformShell
      badge="Admin"
      description="Executive controls for platform operations, system health, users, revenue, audit activity and production readiness."
      nav={adminNav}
      title="Executive Dashboard"
    >
      <div className="space-y-6">
        <MetricGrid metrics={adminMetrics} />
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={() => setIsStatsExpanded(!isStatsExpanded)}
            className="flex w-full items-center justify-between"
          >
            <h3 className="text-lg font-semibold">System Statistics</h3>
            {isStatsExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          {isStatsExpanded && <MetricGrid metrics={systemStats} />}
        </div>
        <WorkflowCard
          action={
            <ButtonLink href="/admin/settings" size="sm" variant="secondary">
              <ShieldCheck aria-hidden="true" className="h-4 w-4" />
              Settings
            </ButtonLink>
          }
          title="Activity timeline"
        >
          <RecordList
            items={adminTimeline.map((item) => ({
              title: item,
              meta: "Production audit stream",
            }))}
          />
        </WorkflowCard>
      </div>
    </PlatformShell>
  );
}
