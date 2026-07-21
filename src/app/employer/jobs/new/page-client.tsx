"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";

import { PlatformShell } from "@/components/platform/platform-shell";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { employerNav } from "@/data/platform";


export default function CreateJobPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("Full time");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [description, setDescription] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !location || !description) {
      alert("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);
    setSuccess(false);

    try {
      // Simulate database save & trigger n8n event
      const payload = {
        title,
        category,
        location,
        type: employmentType,
        salary: `${salaryMin ? `$${salaryMin}` : ""}${salaryMax ? ` - $${salaryMax}` : ""}`,
        description,
        posted: "Just posted",
      };

      await fetch("/api/n8n/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "job_created",
          payload,
        }),
      });

      setSuccess(true);
      // Reset form
      setTitle("");
      setCategory("");
      setLocation("");
      setSalaryMin("");
      setSalaryMax("");
      setDescription("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PlatformShell
      badge="Employer"
      description="Create a job draft with compensation, search filters, remote policy and publishing controls."
      nav={employerNav}
      title="Create Job"
    >
      <WorkflowCard title="Job details">
        <form onSubmit={handlePublish} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">Job Title *</label>
            <Input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Architect"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">Category *</label>
            <Input
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Engineering"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">Location *</label>
            <Input
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Remote, Europe"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">Employment Type</label>
            <Select value={employmentType} onChange={(e) => setEmploymentType(e.target.value)}>
              <option>Full time</option>
              <option>Contract</option>
              <option>Part time</option>
              <option>Internship</option>
            </Select>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">Salary Min</label>
            <Input
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
              placeholder="e.g. 120k"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">Salary Max</label>
            <Input
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
              placeholder="e.g. 160k"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-foreground mb-1 block">Description *</label>
            <Textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a comprehensive job description..."
            />
          </div>

          {success && (
            <div className="md:col-span-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 flex items-center gap-3 text-emerald-500 text-sm font-semibold">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              Job published successfully! An N8N webhook trigger has been dispatched.
            </div>
          )}

          <div className="md:col-span-2 flex gap-3 mt-2">
            <Button disabled={isSubmitting} type="submit" variant="accent" className="font-bold flex items-center gap-2">
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Publish Job
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setTitle("Staff Software Engineer");
                setCategory("Engineering");
                setLocation("San Francisco, CA");
                setEmploymentType("Full time");
                setSalaryMin("150k");
                setSalaryMax("210k");
                setDescription("Design and build scalable platform components for modern cloud hosting architectures.");
              }}
            >
              Fill Sample Data
            </Button>
          </div>
        </form>
      </WorkflowCard>
    </PlatformShell>
  );
}
