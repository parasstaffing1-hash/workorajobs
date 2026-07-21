"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, BookmarkCheck, FileText, Send, Trash2, ArrowRight } from "lucide-react";

import { PlatformShell } from "@/components/platform/platform-shell";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { jobs } from "@/data/jobs";
import { candidateNav } from "@/data/platform";


export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  
  // Apply Modal state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<typeof jobs[0] | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [selectedResume] = useState("Daniel_Okoro_Resume_2026.pdf");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("workora_saved_jobs");
    const applied = localStorage.getItem("workora_applied_jobs");
    if (saved) setSavedJobs(JSON.parse(saved));
    if (applied) setAppliedJobs(JSON.parse(applied));
  }, []);

  // Sync state to localStorage
  const syncSavedJobs = (newSaved: string[]) => {
    setSavedJobs(newSaved);
    localStorage.setItem("workora_saved_jobs", JSON.stringify(newSaved));
  };

  const syncAppliedJobs = (newApplied: string[]) => {
    setAppliedJobs(newApplied);
    localStorage.setItem("workora_applied_jobs", JSON.stringify(newApplied));
  };

  // Get job details for saved jobs
  const savedJobsDetails = jobs.filter((job) => savedJobs.includes(job.id));

  // Remove from saved list
  const handleRemoveSaved = (id: string) => {
    const updated = savedJobs.filter((jobId) => jobId !== id);
    syncSavedJobs(updated);
  };

  // Open Apply Modal
  const handleOpenApply = (job: typeof jobs[0]) => {
    setSelectedJob(job);
    setCoverLetter("");
    setApplySuccess(false);
    setApplyModalOpen(true);
  };

  // Submit Application
  const handleSubmitApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newApplied = [...appliedJobs, selectedJob.id];
      syncAppliedJobs(newApplied);

      // Create a timeline event log
      const appHistory = {
        jobId: selectedJob.id,
        appliedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        status: "Applied",
        coverLetter: coverLetter
      };
      
      const savedHistory = localStorage.getItem("workora_application_history") || "{}";
      const parsedHistory = JSON.parse(savedHistory);
      parsedHistory[selectedJob.id] = appHistory;
      localStorage.setItem("workora_application_history", JSON.stringify(parsedHistory));

      setIsSubmitting(false);
      setApplySuccess(true);

      // Close modal after showing success screen
      setTimeout(() => {
        setApplyModalOpen(false);
        setApplySuccess(false);
      }, 1500);
    }, 1200);
  };

  return (
    <PlatformShell
      badge="Candidate"
      description="View, manage and quick-apply to your saved jobs. Applying dynamically moves jobs to your active applications list."
      nav={candidateNav}
      title="Saved Jobs"
    >
      <div className="grid gap-4">
        {savedJobsDetails.length > 0 ? (
          savedJobsDetails.map((job) => {
            const isApplied = appliedJobs.includes(job.id);

            return (
              <WorkflowCard key={job.id} title={job.title}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {job.company} · <span className="text-muted-foreground font-normal">{job.location} · {job.salary}</span>
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge>{job.type}</Badge>
                      <Badge>{job.workMode}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0 self-end sm:self-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSaved(job.id)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>

                    <Button 
                      type="button"
                      size="sm"
                      disabled={isApplied}
                      onClick={() => handleOpenApply(job)}
                      className={isApplied ? "bg-green-600/10 text-green-600 border border-green-600/20" : ""}
                    >
                      {isApplied ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          Applied
                        </>
                      ) : (
                        "Apply now"
                      )}
                    </Button>
                  </div>
                </div>
              </WorkflowCard>
            );
          })
        ) : (
          <div className="text-center py-12 glass-panel rounded-lg border border-border/70">
            <BookmarkCheck className="h-10 w-10 text-muted-foreground mx-auto" />
            <h4 className="text-sm font-bold text-foreground mt-3">No Saved Jobs Yet</h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Save jobs you are interested in while exploring opportunities on the platform.
            </p>
            <Link 
              href="/candidate/jobs" 
              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline mt-4"
            >
              Explore job opportunities
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* APPLY FLOW MODAL */}
      {/* ==================================================== */}
      <Modal
        open={applyModalOpen}
        title={selectedJob ? `Apply to ${selectedJob.company}` : "Apply to Job"}
        onClose={() => setApplyModalOpen(false)}
      >
        {applySuccess ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-foreground">Application Submitted!</h4>
            <p className="text-xs text-muted-foreground">
              Your application for <strong>{selectedJob?.title}</strong> was sent successfully.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitApply} className="space-y-4">
            <div className="p-3 rounded-lg border border-border bg-secondary/10 flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-foreground">Resume Selected</p>
                <p className="text-[10px] text-muted-foreground">{selectedResume}</p>
              </div>
              <span className="text-[10px] bg-green-500/10 text-green-600 px-2 py-0.5 rounded font-bold">
                Default
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                Cover Letter / Intro Note (Optional)
              </label>
              <Textarea
                className="h-28 text-xs"
                placeholder="Briefly state why you're a great fit for this role..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <Button 
                variant="secondary" 
                type="button" 
                onClick={() => setApplyModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit" 
                disabled={isSubmitting}
                className="flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    Submit Application
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </PlatformShell>
  );
}
