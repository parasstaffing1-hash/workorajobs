'use client';

import { useState } from 'react';
import { PlatformShell } from "@/components/platform/platform-shell";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { crmLeads, crmNav } from "@/data/platform";
import { createMetadata } from "@/lib/site";
import { Button } from "@/components/ui/button";

export default function CrmLeadsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<string | null>(null);

  const filteredLeads = crmLeads.filter((lead) => {
    const matchesSearch = lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter ? lead.status === filter : true;
    return matchesSearch && matchesFilter;
  });

  const handleAction = (company: string) => {
    alert(`Performing action for ${company}`);
  };
  return (
    <PlatformShell
      badge="CRM"
      description="Track lead source, qualification status, notes and next actions."
      nav={crmNav}
      title="Lead Management"
    >
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Search leads..."
          className="w-full rounded-md border border-border p-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-2">
            {['Qualified', 'Nurturing', 'Won'].map(status => (
                <button key={status} onClick={() => setFilter(filter === status ? null : status)} className={`px-2 py-1 rounded text-sm ${filter === status ? 'bg-primary text-white' : 'bg-secondary'}`}>
                    {status}
                </button>
            ))}
        </div>
        <WorkflowCard title="Leads">
          <div className="grid gap-2">
            {filteredLeads.map((lead) => (
              <div key={lead.company} className="flex justify-between items-center p-3 border rounded shadow-sm">
                <div>
                  <h3 className="font-semibold">{lead.company}</h3>
                  <p className="text-sm text-muted-foreground">{lead.contact} · {lead.status}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleAction(lead.company)}>Action</Button>
              </div>
            ))}
          </div>
        </WorkflowCard>
      </div>
    </PlatformShell>
  );
}
