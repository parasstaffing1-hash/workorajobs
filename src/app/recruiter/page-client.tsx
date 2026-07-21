"use client";

import { useRouter } from "next/navigation";
import { Brain, CalendarCheck, Search } from "lucide-react";

import { MetricGrid } from "@/components/platform/metric-grid";
import { PlatformShell } from "@/components/platform/platform-shell";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { ButtonLink } from "@/components/ui/button";
import {

  recruiterAiTools,
  recruiterCandidates,
  recruiterMetrics,
  recruiterNav,
  recruiterPipeline,
  recruiterTasks,
} from "@/data/platform";

export default function RecruiterDashboardPage() {
  const router = useRouter();
  return (
    <PlatformShell
      badge="Recruiter"
      description="Coordinate assigned jobs, candidate pipelines, interviews, tasks, AI insights and automation."
      nav={recruiterNav}
      title="Recruiter Dashboard"
    >
      <div className="space-y-6">
        <MetricGrid metrics={recruiterMetrics} />
        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <WorkflowCard
            action={
              <ButtonLink href="/recruiter/search" size="sm">
                <Search aria-hidden="true" className="h-4 w-4" />
                Search
              </ButtonLink>
            }
            title="Priority candidates"
          >
            <div className="grid gap-3">
              {recruiterCandidates.map((candidate) => (
                <div
                  className="grid cursor-pointer gap-3 rounded-md border border-border p-4 transition-all hover:border-primary hover:shadow-md md:grid-cols-[1fr_auto]"
                  key={candidate.name}
                  onClick={() => router.push("/recruiter/candidates")}
                >
                  <div>
                    <h2 className="font-semibold">{candidate.name}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {candidate.headline} / {candidate.location}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-primary">
                      {candidate.match}
                    </span>{" "}
                    match / {candidate.stage}
                  </div>
                </div>
              ))}
            </div>
          </WorkflowCard>
          <WorkflowCard
            action={
              <ButtonLink href="/recruiter/ai" size="sm" variant="secondary">
                <Brain aria-hidden="true" className="h-4 w-4" />
                AI tools
              </ButtonLink>
            }
            title="Open tasks"
          >
            <div className="grid gap-3">
              {recruiterTasks.map((task) => (
                <div
                  className="cursor-pointer rounded-md bg-secondary px-3 py-3 text-sm transition-all hover:bg-secondary/80"
                  key={task.title}
                  onClick={() => router.push("/recruiter/tasks")}
                >
                  <div className="font-medium">{task.title}</div>
                  <div className="mt-1 text-muted-foreground">
                    {task.due} / {task.priority} / {task.status}
                  </div>
                </div>
              ))}
            </div>
          </WorkflowCard>
        </div>
        <WorkflowCard
          action={
            <ButtonLink href="/recruiter/ai" size="sm" variant="accent">
              <Brain aria-hidden="true" className="h-4 w-4" />
              Open AI tools
            </ButtonLink>
          }
          title="AI tools"
        >
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {recruiterAiTools.slice(0, 4).map((tool) => (
              <div
                className="cursor-pointer rounded-md border border-border/70 bg-background/70 p-4 transition-all hover:border-primary hover:shadow-md"
                key={tool.name}
                onClick={() => router.push("/recruiter/ai")}
              >
                <p className="text-sm font-semibold">{tool.name}</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  {tool.endpoint}
                </p>
              </div>
            ))}
          </div>
        </WorkflowCard>
        <WorkflowCard
          action={
            <ButtonLink href="/recruiter/calendar" size="sm" variant="outline">
              <CalendarCheck aria-hidden="true" className="h-4 w-4" />
              Calendar
            </ButtonLink>
          }
          title="ATS pipeline"
        >
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {recruiterPipeline.map((stage) => (
              <div
                className="cursor-pointer rounded-md border border-border p-4 transition-all hover:border-primary hover:shadow-md"
                key={stage.stage}
                onClick={() => router.push("/recruiter/pipeline")}
              >
                <p className="text-sm text-muted-foreground">{stage.stage}</p>
                <p className="mt-2 text-2xl font-semibold">{stage.count}</p>
                <p className="mt-1 text-xs text-primary">{stage.tone}</p>
              </div>
            ))}
          </div>
        </WorkflowCard>
      </div>
    </PlatformShell>
  );
}
