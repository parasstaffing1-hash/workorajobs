"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, XCircle } from "lucide-react";

import { PlatformShell } from "@/components/platform/platform-shell";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { Button } from "@/components/ui/button";
import { jobs } from "@/data/jobs";
import { candidateNav } from "@/data/platform";

type AppHistoryItem = {
  jobId: string;
  appliedAt: string;
  status: string;
};

export default function CandidateApplicationsPage() {
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [appHistory, setAppHistory] = useState<Record<string, AppHistoryItem>>({});
  const [expandedApp, setExpandedApp] = useState<string | null>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    const applied = localStorage.getItem("workora_applied_jobs");
    const history = localStorage.getItem("workora_application_history");
    
    if (applied) {
      const parsedApplied = JSON.parse(applied);
      setAppliedJobs(parsedApplied);
    } else {
      // Initialize with default application from seed data if first time
      const initialApplied = ["wj-001"];
      setAppliedJobs(initialApplied);
      localStorage.setItem("workora_applied_jobs", JSON.stringify(initialApplied));
    }

    if (history) {
      setAppHistory(JSON.parse(history));
    } else {
      // Default initial history for seeded item wj-001
      const initialHistory = {
        "wj-001": {
          jobId: "wj-001",
          appliedAt: "Jul 10, 2026",
          status: "Shortlisted"
        }
      };
      setAppHistory(initialHistory);
      localStorage.setItem("workora_application_history", JSON.stringify(initialHistory));
    }
  }, []);

  // Sync state to localStorage
  const syncAppliedJobs = (newApplied: string[]) => {
    setAppliedJobs(newApplied);
    localStorage.setItem("workora_applied_jobs", JSON.stringify(newApplied));
  };

  // Withdraw Application Handler
  const handleWithdraw = (jobId: string) => {
    const confirm = window.confirm("Are you sure you want to withdraw your application for this position?");
    if (!confirm) return;

    const updated = appliedJobs.filter((id) => id !== jobId);
    syncAppliedJobs(updated);

    // Clean up history
    const updatedHistory = { ...appHistory };
    delete updatedHistory[jobId];
    setAppHistory(updatedHistory);
    localStorage.setItem("workora_application_history", JSON.stringify(updatedHistory));
  };

  // Get job details for applied jobs
  const appliedJobsDetails = jobs.filter((job) => appliedJobs.includes(job.id));

  return (
    <PlatformShell
      badge="Candidate"
      description="Track the status of your active job applications and recruitment stages. Withdrawing will remove the application from your pipeline."
      nav={candidateNav}
      title="Applications"
    >
      <div className="grid gap-6">
        {appliedJobsDetails.length > 0 ? (
          appliedJobsDetails.map((job) => {
            const details = appHistory[job.id] || {
              appliedAt: "Recent",
              status: "Applied"
            };

            // Custom timeline matching status
            const timelineSteps = [
              { label: "Application submitted", date: details.appliedAt, done: true },
              { label: "Recruiter review", date: "Jul 11, 2026", done: details.status !== "Applied" },
              { 
                label: details.status === "Interview scheduled" ? "Interview scheduled" : "Shortlisted", 
                date: details.status === "Interview scheduled" ? "Jul 16, 2026" : "Jul 12, 2026", 
                done: details.status === "Shortlisted" || details.status === "Interview scheduled" 
              }
            ];

            return (
              <WorkflowCard key={job.id} title={job.title}>
                <div className="border-b border-border/50 pb-4 mb-4">
                  <p className="text-sm font-semibold text-foreground">
                    {job.company} · <span className="text-muted-foreground font-normal">{job.location} · {job.salary}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Application status: <span className="text-primary font-bold">{details.status}</span>
                  </p>
                </div>

                <div className="space-y-3.5 mt-3">
                  <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpandedApp(expandedApp === job.id ? null : job.id)}>
                    <p className="text-xs font-bold text-foreground">Timeline</p>
                    <span className="text-xs text-muted-foreground">{expandedApp === job.id ? "Collapse" : "Expand"}</span>
                  </div>
                  {expandedApp === job.id && (
                    <div className="grid gap-3">
                      {timelineSteps.map((step) => (
                        <div
                          className={`rounded-md border p-3 flex justify-between items-center ${
                            step.done ? "border-primary/20 bg-primary/5" : "border-border/60 opacity-60 bg-secondary/10"
                          }`}
                          key={step.label}
                        >
                          <div>
                            <strong className="text-xs text-foreground">{step.label}</strong>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{step.date}</p>
                          </div>
                          {step.done ? (
                            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                              Complete
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                              Pending
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-5 flex justify-end">
                  <Button 
                    type="button" 
                    variant="outline"
                    size="sm"
                    onClick={() => handleWithdraw(job.id)}
                    className="text-xs text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/5"
                  >
                    Withdraw application
                  </Button>
                </div>
              </WorkflowCard>
            );
          })
        ) : (
          <div className="text-center py-12 glass-panel rounded-lg border border-border/70">
            <XCircle className="h-10 w-10 text-muted-foreground mx-auto" />
            <h4 className="text-sm font-bold text-foreground mt-3">No Active Applications</h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              You haven't submitted any job applications yet. Go to Find Jobs to get started.
            </p>
            <Link 
              href="/candidate/jobs" 
              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline mt-4"
            >
              Search and apply for jobs
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>
    </PlatformShell>
  );
}
