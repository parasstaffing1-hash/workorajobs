"use client";
import { Download } from "lucide-react";

import { PlatformShell } from "@/components/platform/platform-shell";
import { RecordList } from "@/components/platform/record-list";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { Button } from "@/components/ui/button";
import { analyticsNav, reports } from "@/data/platform";


export default function AnalyticsReportsPage() {
  return (
    <PlatformShell
      badge="Analytics"
      description="Generate reports and CSV exports for hiring, employers, candidates and recruiter performance."
      nav={analyticsNav}
      title="Reports"
    >
      <WorkflowCard
        action={
          <Button size="sm">
            <Download aria-hidden="true" className="h-4 w-4" />
            CSV
          </Button>
        }
        title="Reports"
      >
        <RecordList
          items={reports.map((report) => ({
            title: report.name,
            meta: report.type,
            value: report.status,
            onClick: () => alert(`Downloading ${report.name}`),
          }))}
        />
      </WorkflowCard>
    </PlatformShell>
  );
}
