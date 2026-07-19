"use client";
import { Upload } from "lucide-react";
import { useState } from "react";

import { PlatformShell } from "@/components/platform/platform-shell";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { employerNav } from "@/data/platform";


export default function EmployerCompanyPage() {
  const [name, setName] = useState("Northstar Cloud");
  const [industry, setIndustry] = useState("Technology");
  const [size, setSize] = useState("201-500");
  const [website, setWebsite] = useState("https://northstar.example");
  const [description, setDescription] = useState("Enterprise cloud platform hiring global product and engineering teams.");

  return (
    <PlatformShell
      badge="Employer"
      description="Company profile, logo upload, public hiring identity and employer settings."
      nav={employerNav}
      title="Company Profile"
    >
      <WorkflowCard title="Company details">
        <div className="grid gap-4 md:grid-cols-2">
          <Input value={name} onChange={(e) => setName(e.target.value)} aria-label="Company name" />
          <Input value={industry} onChange={(e) => setIndustry(e.target.value)} aria-label="Industry" />
          <Input value={size} onChange={(e) => setSize(e.target.value)} aria-label="Company size" />
          <Input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            aria-label="Website"
          />
          <Textarea
            className="md:col-span-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            aria-label="Description"
          />
          <Button type="button" onClick={() => alert("Profile saved!")}>Save profile</Button>
          <Button type="button" variant="outline" onClick={() => alert("Upload logo clicked")}>
            <Upload aria-hidden="true" className="h-4 w-4" />
            Upload logo
          </Button>
        </div>
      </WorkflowCard>
    </PlatformShell>
  );
}
