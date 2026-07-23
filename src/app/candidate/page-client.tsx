"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Bell, 
  ArrowRight,
  User,
  Briefcase
} from "lucide-react";

import { PlatformShell } from "@/components/platform/platform-shell";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { MetricGrid } from "@/components/platform/metric-grid";
import { jobs } from "@/data/jobs";
import { candidateNav } from "@/data/platform";


type TimelineItem = {
  label: string;
  date: string;
  tone: string;
};

type AppHistoryItem = {
  jobId: string;
  appliedAt: string;
  status: string;
};

export default function CandidateDashboardPage() {
  const [savedJobsCount, setSavedJobsCount] = useState(0);
  const [appliedJobsCount, setAppliedJobsCount] = useState(0);
  const [recentApplications, setRecentApplications] = useState<TimelineItem[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("workora_saved_jobs");
    const applied = localStorage.getItem("workora_applied_jobs");
    const history = localStorage.getItem("workora_application_history");
    
    const parsedSaved = saved ? JSON.parse(saved) : [];
    const parsedApplied = applied ? JSON.parse(applied) : [];

    setSavedJobsCount(parsedSaved.length);
    setAppliedJobsCount(parsedApplied.length);

    // Map history to timeline list
    const parsedHistory: Record<string, AppHistoryItem> = history ? JSON.parse(history) : {};


    const timelineItems = Object.values(parsedHistory).map((app) => {
      const job = jobs.find(j => j.id === app.jobId);
      return {
        label: job ? `${job.title} at ${job.company}` : "Application Updated",
        date: app.appliedAt,
        tone: app.status
      };
    });

    setRecentApplications(timelineItems);

    // Dynamic notifications list matching action events
    const initialNotifications = [
      `Application submitted for ${jobs[0].title}`,
      "Interview scheduled with Northstar Cloud",
      "Profile updated successfully",
      "Global Payroll Operations Lead has closed"
    ];
    
    // Add custom notifications if user has applied to new jobs
    const newNotifications = [...initialNotifications];
    if (parsedApplied.length > 1) {
      const lastJobId = parsedApplied[parsedApplied.length - 1];
      const lastJob = jobs.find(j => j.id === lastJobId);
      if (lastJob) {
        newNotifications.unshift(`Successfully applied to ${lastJob.title} at ${lastJob.company}!`);
      }
    }
    setNotifications(newNotifications);
  }, []);

  const dynamicMetrics = [
    {
      label: "Profile completion",
      value: "86%",
      delta: "Resume and skills complete",
      href: "/candidate/profile"
    },
    { 
      label: "Saved jobs", 
      value: String(savedJobsCount), 
      delta: "Saved for quick-apply",
      href: "/candidate/saved-jobs"
    },
    { 
      label: "Applications", 
      value: String(appliedJobsCount), 
      delta: "Active hiring processes",
      href: "/candidate/applications"
    },
    { 
      label: "Notifications", 
      value: String(notifications.length), 
      delta: "Unread updates",
      href: "/candidate/notifications"
    },
  ];

  return (
    <PlatformShell
      badge="Candidate"
      description="Track profile completion, saved jobs, active applications, timeline updates and system notifications."
      nav={candidateNav}
      title="Candidate Dashboard"
    >
      <div className="space-y-6">
        {/* Metric Cards Grid */}
        <MetricGrid metrics={dynamicMetrics} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Quick Links / Tasks */}
          <WorkflowCard title="Hiring Hub Quick Links">
            <div className="space-y-3.5 pt-1.5">
              
              <Link 
                href="/candidate/profile"
                className="flex items-center gap-3.5 p-3 rounded-lg border border-border bg-secondary/15 hover:bg-secondary/40 transition-colors text-xs font-semibold text-foreground group"
              >
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p>Complete & View LinkedIn Profile</p>
                  <p className="text-[10px] text-muted-foreground font-normal mt-0.5">86% done - add more certifications to boost visibility</p>
                </div>
                <ArrowRight className="h-4.5 w-4.5 ml-auto text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link 
                href="/candidate/jobs"
                className="flex items-center gap-3.5 p-3 rounded-lg border border-border bg-secondary/15 hover:bg-secondary/40 transition-colors text-xs font-semibold text-foreground group"
              >
                <Briefcase className="h-5 w-5 text-primary" />
                <div>
                  <p>Explore Job Openings</p>
                  <p className="text-[10px] text-muted-foreground font-normal mt-0.5">Search 100+ matching roles for Product Management and Design</p>
                </div>
                <ArrowRight className="h-4.5 w-4.5 ml-auto text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </Link>

            </div>
          </WorkflowCard>

          {/* Timeline Updates */}
          <WorkflowCard title="Application timeline">
            <div className="grid gap-3">
              {recentApplications.length > 0 ? (
                recentApplications.map((item, idx) => (
                  <Link
                    href="/candidate/applications"
                    className="flex items-center justify-between rounded-md border border-border p-3.5 hover:bg-secondary/15 transition-colors"
                    key={`${item.label}-${idx}`}
                  >
                    <div className="min-w-0 flex-1">
                      <strong className="text-xs text-foreground truncate block">{item.label}</strong>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{item.date}</p>
                    </div>
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded shrink-0">
                      {item.tone}
                    </span>
                  </Link>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-xs text-muted-foreground">No active applications currently.</p>
                </div>
              )}
            </div>
          </WorkflowCard>

          {/* Notifications Card */}
          <div className="md:col-span-2">
            <WorkflowCard title="Notifications">
              <div className="space-y-2.5 max-h-64 overflow-y-auto">
                {notifications.map((item, idx) => (
                  <Link 
                    href="/candidate/notifications"
                    className="flex items-start gap-3 rounded-md bg-secondary/50 border border-border/40 px-3.5 py-3 text-xs text-muted-foreground hover:bg-secondary/80 transition-colors" 
                    key={idx}
                  >
                    <Bell className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </Link>
                ))}
              </div>
            </WorkflowCard>
          </div>

        </div>
      </div>
    </PlatformShell>
  );
}
