"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, CheckCircle2, Bookmark, BookmarkCheck, FileText, Send } from "lucide-react";

import { PlatformShell } from "@/components/platform/platform-shell";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { jobs } from "@/data/jobs";
import { candidateNav } from "@/data/platform";

export default function CandidateJobsPage() {
  // State for jobs data and filters
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [typeFilter, setTypeFilter] = useState("Any type");
  const [remoteFilter, setRemoteFilter] = useState("Any location");
  const [filteredJobs, setFilteredJobs] = useState(jobs);

  // Saved / Applied Job States
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

  // Apply Modal State
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<typeof jobs[0] | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [selectedResume, setSelectedResume] = useState("Daniel_Okoro_Resume_2026.pdf");
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

  // Search Handler
  const handleSearch = useCallback(() => {
    const result = jobs.filter((job) => {
      const matchKeyword =
        !keyword ||
        job.title.toLowerCase().includes(keyword.toLowerCase()) ||
        job.company.toLowerCase().includes(keyword.toLowerCase()) ||
        job.description.toLowerCase().includes(keyword.toLowerCase()) ||
        job.tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase()));

      const matchLocation =
        !location || job.location.toLowerCase().includes(location.toLowerCase());

      const matchType =
        typeFilter === "Any type" ||
        job.type.toLowerCase().replace("-", "") === typeFilter.toLowerCase().replace("-", "");

      const matchRemote =
        remoteFilter === "Any location" ||
        job.workMode.toLowerCase() === remoteFilter.toLowerCase();

      return matchKeyword && matchLocation && matchType && matchRemote;
    });

    setFilteredJobs(result);
  }, [keyword, location, typeFilter, remoteFilter]);

  // Run search when filters change (for real-time experience)
  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  // Toggle Save Job
  const toggleSaveJob = (id: string) => {
    if (savedJobs.includes(id)) {
      syncSavedJobs(savedJobs.filter((jobId) => jobId !== id));
    } else {
      syncSavedJobs([...savedJobs, id]);
    }
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
      description="Search, filter, save and apply to open jobs. Actions dynamically update your dashboard metrics."
      nav={candidateNav}
      title="Find Jobs"
    >
      <WorkflowCard title="Search filters">
        <div className="grid gap-3 md:grid-cols-5">
          <Input 
            placeholder="Keyword (e.g. Design, Engineer)" 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            aria-label="Keyword search" 
          />
          <Input 
            placeholder="Location (e.g. Europe, Canada)" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            aria-label="Location search" 
          />
          <Select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            aria-label="Employment type"
          >
            <option value="Any type">Any type</option>
            <option value="Full-time">Full time</option>
            <option value="Contract">Contract</option>
          </Select>
          <Select 
            value={remoteFilter}
            onChange={(e) => setRemoteFilter(e.target.value)}
            aria-label="Remote filter"
          >
            <option value="Any location">Any location</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </Select>
          <Button type="button" onClick={handleSearch}>
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
      </WorkflowCard>

      <div className="mt-6 grid gap-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => {
            const isSaved = savedJobs.includes(job.id);
            const isApplied = appliedJobs.includes(job.id);

            return (
              <WorkflowCard key={job.id} title={job.title}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-1.5">
                    <p className="text-sm font-semibold text-foreground">
                      {job.company} · <span className="text-muted-foreground font-normal">{job.location} · {job.salary}</span>
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2 max-w-2xl">
                      {job.description}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1.5">
                      <Badge>{job.type}</Badge>
                      <Badge>{job.workMode}</Badge>
                      {job.tags.map((tag) => (
                        <Badge key={tag} className="bg-secondary/60 text-secondary-foreground">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0 self-end lg:self-center">
                    <Button 
                      variant={isSaved ? "outline" : "secondary"} 
                      type="button"
                      size="sm"
                      onClick={() => toggleSaveJob(job.id)}
                      className={isSaved ? "text-green-600 border-green-600/30 hover:border-green-600/50" : ""}
                    >
                      {isSaved ? (
                        <>
                          <BookmarkCheck className="h-4 w-4" />
                          Saved
                        </>
                      ) : (
                        <>
                          <Bookmark className="h-4 w-4" />
                          Save
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      type="button"
                      size="sm"
                      disabled={isApplied}
                      onClick={() => handleOpenApply(job)}
                      className={isApplied ? "bg-green-600/10 text-green-600 border border-green-600/20 hover:bg-green-600/20" : ""}
                    >
                      {isApplied ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          Applied
                        </>
                      ) : (
                        "Apply"
                      )}
                    </Button>
                  </div>
                </div>
              </WorkflowCard>
            );
          })
        ) : (
          <div className="text-center py-10 glass-panel rounded-lg border border-border/70">
            <p className="text-sm text-muted-foreground">No jobs match your search filters.</p>
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
                <Select 
                  className="mt-1 text-xs h-8"
                  value={selectedResume}
                  onChange={(e) => setSelectedResume(e.target.value)}
                >
                  <option value="Daniel_Okoro_Resume_2026.pdf">Daniel_Okoro_Resume_2026.pdf (Primary)</option>
                  <option value="Daniel_Okoro_Senior_Design_Resume.pdf">Daniel_Okoro_Senior_Design_Resume.pdf</option>
                  <option value="Workora_CV_Builder_Draft.pdf">Workora_CV_Builder_Draft.pdf</option>
                </Select>
              </div>
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
