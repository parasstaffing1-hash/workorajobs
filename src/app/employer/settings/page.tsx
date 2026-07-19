"use client";
import { PlatformShell } from "@/components/platform/platform-shell";
import { useState } from "react";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { employerNav } from "@/data/platform";


export default function EmployerSettingsPage() {
  const [email, setEmail] = useState("careers@northstar.example");
  const [autoReply, setAutoReply] = useState("Auto replies enabled");

  return (
    <PlatformShell
      badge="Employer"
      description="Company settings, billing controls and subscription operations."
      nav={employerNav}
      title="Settings"
    >
      <div className="grid gap-6">
        <WorkflowCard title="Hiring settings">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Hiring contact email"
            />
            <Input
              value={autoReply}
              onChange={(e) => setAutoReply(e.target.value)}
              aria-label="Auto reply setting"
            />
            <Button type="button" onClick={() => alert("Settings saved!")}>Save settings</Button>
          </div>
        </WorkflowCard>
        <WorkflowCard title="Billing and subscription">
          <p className="text-sm text-muted-foreground">
            Billing and subscription management connect to the production
            billing service when Stripe environment variables are configured.
          </p>
        </WorkflowCard>
      </div>
    </PlatformShell>
  );
}
