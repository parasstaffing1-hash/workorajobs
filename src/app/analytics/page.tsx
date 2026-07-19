"use client";
import { MetricGrid } from "@/components/platform/metric-grid";
import { PlatformShell } from "@/components/platform/platform-shell";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { analyticsMetrics, analyticsNav, salesPipeline } from "@/data/platform";


export default function AnalyticsPage() {
  return (
    <PlatformShell
      badge="Analytics"
      description="Explore hiring analytics, employer analytics, candidate analytics, recruiter performance and conversion funnels."
      nav={analyticsNav}
      title="Analytics"
    >
      <div className="space-y-6">
        <MetricGrid metrics={analyticsMetrics} />
        <WorkflowCard title="Conversion funnel">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {salesPipeline.map((stage) => (
              <div
                className="cursor-pointer rounded-md border border-border p-4 transition-colors hover:border-primary"
                key={stage.stage}
                onClick={() => alert(`Details for: ${stage.stage}`)}
              >
                <p className="text-sm text-muted-foreground">{stage.stage}</p>
                <p className="mt-2 text-2xl font-semibold">{stage.count}</p>
                <p className="mt-1 text-xs text-primary">{stage.value}</p>
              </div>
            ))}
          </div>
        </WorkflowCard>
      </div>
    </PlatformShell>
  );
}
