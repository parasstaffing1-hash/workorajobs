"use client";

import { CheckCircle2, Loader2, MessageSquare, Star, Tag } from "lucide-react";
import { useState } from "react";

import { PlatformShell } from "@/components/platform/platform-shell";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { recruiterNav } from "@/data/platform";

// Initial candidates list in component state to support status updates
const initialCandidates = [
  {
    id: "cand-001",
    name: "Daniel Okoro",
    headline: "Senior Product Manager",
    location: "Toronto, Canada",
    match: "78%",
    stage: "Recruiter screen",
    tags: ["High intent", "Product systems"],
    email: "daniel.okoro@workora.com",
  },
  {
    id: "cand-002",
    name: "Priya Raman",
    headline: "Staff Backend Engineer",
    location: "Bengaluru, India",
    match: "91%",
    stage: "Interview",
    tags: ["Cloud", "Distributed systems"],
    email: "priya.raman@workora.com",
  },
  {
    id: "cand-003",
    name: "Marcus Lee",
    headline: "Global Payroll Lead",
    location: "Singapore",
    match: "84%",
    stage: "Offer",
    tags: ["Payroll", "APAC"],
    email: "marcus.lee@workora.com",
  },
];

const availableStages = ["Applied", "Recruiter screen", "Interview", "Offer"];

export default function RecruiterCandidatesPage() {
  const [candidates, setCandidates] = useState(initialCandidates);
  const [updatingCandidateId, setUpdatingCandidateId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  const handleStageChange = async (candidateId: string, newStage: string) => {
    const candidate = candidates.find((c) => c.id === candidateId);
    if (!candidate) return;

    const previousStage = candidate.stage;
    setUpdatingCandidateId(candidateId);
    setStatusMessage("");

    // Update state locally
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, stage: newStage } : c))
    );

    try {
      // Map new stage to correct sequence template parameter
      let sequenceTemplate = "welcome";
      if (newStage === "Recruiter screen") sequenceTemplate = "screening_tips";
      else if (newStage === "Interview") sequenceTemplate = "interview_invite";
      else if (newStage === "Offer") sequenceTemplate = "offer_extended";

      const payload = {
        candidate: {
          id: candidate.id,
          name: candidate.name,
          email: candidate.email,
          headline: candidate.headline,
          previousStatus: previousStage,
          newStatus: newStage,
          sequenceTemplate,
        },
      };

      const res = await fetch("/api/n8n/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "application_status_changed",
          payload,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage(`Stage for ${candidate.name} updated. Webhook sequence '${sequenceTemplate}' dispatched.`);
        setTimeout(() => setStatusMessage(""), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingCandidateId(null);
    }
  };

  return (
    <PlatformShell
      badge="Recruiter"
      description="Review assigned candidates, profile signals, notes, tags, ratings and stage context."
      nav={recruiterNav}
      title="Candidate Database"
    >
      {statusMessage && (
        <div className="mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 flex items-center gap-3 text-emerald-500 text-xs font-semibold">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          {statusMessage}
        </div>
      )}

      <WorkflowCard title="Candidate records">
        <div className="grid gap-3">
          {candidates.map((candidate) => (
            <div
              className="grid gap-4 rounded-md border border-border p-4 lg:grid-cols-[1fr_auto]"
              key={candidate.id}
            >
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-foreground">{candidate.name}</h2>
                  {updatingCandidateId === candidate.id && (
                    <Loader2 className="h-4.5 w-4.5 text-primary animate-spin" />
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {candidate.headline} · {candidate.location} ·{" "}
                  <span className="font-semibold text-primary">{candidate.stage}</span>
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {candidate.tags.map((tag) => (
                    <span
                      className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground"
                      key={tag}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Change Stage</label>
                  <Select
                    className="h-9 text-xs w-36"
                    value={candidate.stage}
                    onChange={(e) => handleStageChange(candidate.id, e.target.value)}
                  >
                    {availableStages.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="flex gap-2 self-end">
                  <Button size="sm" variant="secondary">
                    <Star aria-hidden="true" className="h-4 w-4" />
                    Rate
                  </Button>
                  <Button size="sm" variant="outline">
                    <Tag aria-hidden="true" className="h-4 w-4" />
                    Tag
                  </Button>
                  <Button size="sm" variant="ghost">
                    <MessageSquare aria-hidden="true" className="h-4 w-4" />
                    Note
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </WorkflowCard>
    </PlatformShell>
  );
}
