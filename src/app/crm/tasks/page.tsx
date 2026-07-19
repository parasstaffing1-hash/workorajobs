'use client';

import { useState } from 'react';
import { PlatformShell } from "@/components/platform/platform-shell";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { crmNav, recruiterTasks } from "@/data/platform";
import { createMetadata } from "@/lib/site";
import { Button } from "@/components/ui/button";

export default function CrmTasksPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<string | null>(null);

  const filteredTasks = recruiterTasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter ? task.status === filter : true;
    return matchesSearch && matchesFilter;
  });

  const handleAction = (taskTitle: string) => {
    alert(`Performing action for task: ${taskTitle}`);
  };
  return (
    <PlatformShell
      badge="CRM"
      description="Manage follow-up tasks, reminders and sales activity."
      nav={crmNav}
      title="Follow-up Tasks"
    >
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Search tasks..."
          className="w-full rounded-md border border-border p-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-2">
            {['In progress', 'Queued'].map(status => (
                <button key={status} onClick={() => setFilter(filter === status ? null : status)} className={`px-2 py-1 rounded text-sm ${filter === status ? 'bg-primary text-white' : 'bg-secondary'}`}>
                    {status}
                </button>
            ))}
        </div>
        <WorkflowCard title="Tasks">
          <div className="grid gap-2">
            {filteredTasks.map((task) => (
              <div key={task.title} className="flex justify-between items-center p-3 border rounded shadow-sm">
                <div>
                  <h3 className="font-semibold">{task.title}</h3>
                  <p className="text-sm text-muted-foreground">{task.due} · {task.priority}</p>
                </div>
                <div className="flex gap-2 items-center">
                    <span className="text-sm font-medium text-primary">{task.status}</span>
                    <Button variant="outline" size="sm" onClick={() => handleAction(task.title)}>Action</Button>
                </div>
              </div>
            ))}
          </div>
        </WorkflowCard>
      </div>
    </PlatformShell>
  );
}
