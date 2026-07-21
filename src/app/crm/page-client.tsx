"use client";

import { useState } from 'react';
import { MetricGrid } from "@/components/platform/metric-grid";
import { PlatformShell } from "@/components/platform/platform-shell";
import { RecordList } from "@/components/platform/record-list";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { crmLeads, crmMetrics, crmNav, salesPipeline } from "@/data/platform";



export default function CrmPage() {
  const [filter, setFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedLead, setExpandedLead] = useState<typeof crmLeads[0] | null>(null);

  const filteredLeads = crmLeads.filter((lead) => {
    const matchesFilter = filter ? lead.status === filter : true;
    const matchesSearch = lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <PlatformShell
      badge="CRM"
      description="Manage leads, clients, contacts, follow-ups, sales pipeline and company records."
      nav={crmNav}
      title="CRM Overview"
    >
      <div className="space-y-6">
        <MetricGrid metrics={crmMetrics} />
        
        <input
          type="text"
          placeholder="Search leads..."
          className="w-full rounded-md border border-border p-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex gap-2">
          {salesPipeline.map((p) => (
            <button
              key={p.stage}
              onClick={() => setFilter(filter === p.stage ? null : p.stage)}
              className={`rounded-md border p-2 text-xs ${filter === p.stage ? 'bg-primary text-white' : 'bg-card'}`}
            >
              {p.stage}
            </button>
          ))}
        </div>

        <WorkflowCard title="Priority leads">
          <div className="grid gap-3">
            {filteredLeads.map((lead) => (
              <div
                key={lead.company}
                className="interactive-border cursor-pointer rounded-md border p-4 shadow-sm transition hover:bg-muted"
                onClick={() => setExpandedLead(expandedLead === lead ? null : lead)}
              >
                <div className="flex justify-between">
                    <h2 className="font-semibold">{lead.company}</h2>
                    <span className="text-sm font-medium">{lead.status}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{lead.contact} · {lead.value}</p>
                {expandedLead === lead && (
                  <div className="mt-2 border-t pt-2 text-sm">
                    Details for {lead.company} (Expanded view)
                  </div>
                )}
              </div>
            ))}
          </div>
        </WorkflowCard>
      </div>
    </PlatformShell>
  );
}
