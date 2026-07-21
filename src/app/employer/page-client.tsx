"use client";

import { Plus } from "lucide-react";
import Link from "next/link";

import { MetricGrid } from "@/components/platform/metric-grid";
import { PlatformShell } from "@/components/platform/platform-shell";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { ButtonLink } from "@/components/ui/button";
import {

  employerJobs,
  employerMetrics,
  employerNav,
  platformNotifications,
} from "@/data/platform";


export default function EmployerDashboardPage() {
  return (
    <PlatformShell
      badge="Employer"
      description="Manage company hiring, job activity, applicants, interviews, notifications and billing operations."
      nav={employerNav}
      title="Employer Dashboard"
    >
      <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Link href="/employer/jobs" className="block">
            <div className="animated-sheen p-5 rounded-lg border border-border/70 shadow-sm transition-[border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-1 hover:border-primary/20 hover:shadow-premium bg-card">
              <p className="text-sm text-muted-foreground">{employerMetrics[0].label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight">{employerMetrics[0].value}</p>
              <p className="mt-2 text-xs text-primary">{employerMetrics[0].delta}</p>
            </div>
          </Link>
          <Link href="/employer/applicants" className="block">
            <div className="animated-sheen p-5 rounded-lg border border-border/70 shadow-sm transition-[border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-1 hover:border-primary/20 hover:shadow-premium bg-card">
              <p className="text-sm text-muted-foreground">{employerMetrics[1].label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight">{employerMetrics[1].value}</p>
              <p className="mt-2 text-xs text-primary">{employerMetrics[1].delta}</p>
            </div>
          </Link>
          <Link href="/employer/applicants" className="block">
            <div className="animated-sheen p-5 rounded-lg border border-border/70 shadow-sm transition-[border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-1 hover:border-primary/20 hover:shadow-premium bg-card">
              <p className="text-sm text-muted-foreground">{employerMetrics[2].label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight">{employerMetrics[2].value}</p>
              <p className="mt-2 text-xs text-primary">{employerMetrics[2].delta}</p>
            </div>
          </Link>
          <Link href="/employer/calendar" className="block">
            <div className="animated-sheen p-5 rounded-lg border border-border/70 shadow-sm transition-[border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-1 hover:border-primary/20 hover:shadow-premium bg-card">
              <p className="text-sm text-muted-foreground">{employerMetrics[3].label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight">{employerMetrics[3].value}</p>
              <p className="mt-2 text-xs text-primary">{employerMetrics[3].delta}</p>
            </div>
          </Link>
        </div>
        <WorkflowCard
          action={
            <ButtonLink href="/employer/jobs/new" size="sm">
              <Plus aria-hidden="true" className="h-4 w-4" />
              Create job
            </ButtonLink>
          }
          title="Active hiring"
        >
          <div className="grid gap-3">
            {employerJobs.map((job) => (
              <div
                className="grid gap-2 rounded-md border border-border p-4 md:grid-cols-5"
                key={job.title}
              >
                <strong className="md:col-span-2">{job.title}</strong>
                <span className="text-sm text-muted-foreground">
                  {job.status}
                </span>
                <span className="text-sm text-muted-foreground">
                  {job.applicants} applicants
                </span>
                <span className="text-sm text-muted-foreground">
                  {job.location}
                </span>
              </div>
            ))}
          </div>
        </WorkflowCard>
        <WorkflowCard title="Employer notifications">
          <ul className="space-y-3 text-sm text-muted-foreground">
            {platformNotifications.map((item) => (
              <li className="rounded-md bg-secondary px-3 py-2" key={item}>
                {item}
              </li>
            ))}
          </ul>
        </WorkflowCard>
      </div>
    </PlatformShell>
  );
}
