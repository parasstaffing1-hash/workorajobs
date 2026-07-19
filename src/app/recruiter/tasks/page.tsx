"use client";

import { useState } from "react";
import { CheckCircle2, Clock, ChevronDown, ChevronUp } from "lucide-react";

import { PlatformShell } from "@/components/platform/platform-shell";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { Button } from "@/components/ui/button";
import { recruiterNav, recruiterTasks } from "@/data/platform";


export default function RecruiterTasksPage() {
  return (
    <PlatformShell
      badge="Recruiter"
      description="Manage recruiter tasks, reminders, notes and workflow follow-ups."
      nav={recruiterNav}
      title="Task Management"
    >
      <WorkflowCard title="Task queue">
        <div className="grid gap-3">
          {recruiterTasks.map((task) => {
            const [expanded, setExpanded] = useState(false);
            return (
              <div
                className="grid gap-4 rounded-md border border-border p-4 lg:grid-cols-[1fr_auto] cursor-pointer"
                key={task.title}
                onClick={() => setExpanded(!expanded)}
              >
                <div>
                  <div className="flex justify-between items-center">
                    <h2 className="font-semibold">{task.title}</h2>
                    {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                  {expanded && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {task.due} · {task.priority} priority · {task.status}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); alert("Remind clicked!"); }}>
                    <Clock aria-hidden="true" className="h-4 w-4" />
                    Remind
                  </Button>
                  <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); alert("Complete clicked!"); }}>
                    <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
                    Complete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </WorkflowCard>
    </PlatformShell>
  );
}
