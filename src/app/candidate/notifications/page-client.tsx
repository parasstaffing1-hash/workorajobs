"use client";

import { useState } from 'react';
import { PlatformShell } from "@/components/platform/platform-shell";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { candidateNav, platformNotifications } from "@/data/platform";



export default function CandidateNotificationsPage() {
  const [notifications, setNotifications] = useState(platformNotifications);
  return (
    <PlatformShell
      badge="Candidate"
      description="Application submitted, withdrawn, interview and profile update notifications."
      nav={candidateNav}
      title="Notifications"
    >
      <WorkflowCard title="Recent updates">
        <div className="grid gap-3">
          {notifications.map((notification, index) => (
            <div
              className="rounded-md border border-border p-4 text-sm text-muted-foreground flex justify-between items-center"
              key={index}
            >
              {notification}
              <button 
                onClick={() => setNotifications(notifications.filter((_, i) => i !== index))}
                className="text-xs text-destructive hover:underline"
              >
                Dismiss
              </button>
            </div>
          ))}
        </div>
      </WorkflowCard>
    </PlatformShell>
  );
}
