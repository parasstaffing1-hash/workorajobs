'use client';

import { PlatformShell } from "@/components/platform/platform-shell";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { crmNav, salesPipeline } from "@/data/platform";
import { createMetadata } from "@/lib/site";

export default function CrmPipelinePage() {
  const handleStageClick = (stage: string, value: string) => {
    alert(`Stage: ${stage}, Total Value: ${value}`);
  };
  return (
    <PlatformShell
      badge="CRM"
      description="Review opportunity stages, weighted value and account movement."
      nav={crmNav}
      title="Sales Pipeline"
    >
      <WorkflowCard title="Pipeline stages">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {salesPipeline.map((stage) => (
            <div
              className="rounded-md border border-border p-4 cursor-pointer hover:bg-muted transition"
              key={stage.stage}
              onClick={() => handleStageClick(stage.stage, stage.value)}
            >
              <p className="text-sm text-muted-foreground">{stage.stage}</p>
              <p className="mt-2 text-2xl font-semibold">{stage.count}</p>
              <p className="mt-1 text-xs text-primary">{stage.value}</p>
            </div>
          ))}
        </div>
      </WorkflowCard>
    </PlatformShell>
  );
}
