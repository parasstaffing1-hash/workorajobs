"use client";

import { useState } from 'react';
import { PlatformShell } from "@/components/platform/platform-shell";
import { RecordList } from "@/components/platform/record-list";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { crmClients, crmNav } from "@/data/platform";

import { Button } from "@/components/ui/button";


export default function CrmClientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<string | null>(null);

  const filteredClients = crmClients.filter((client) => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter ? client.status === filter : true;
    return matchesSearch && matchesFilter;
  });

  const handleAction = (clientName: string) => {
    alert(`Performing action for ${clientName}`);
  };
  return (
    <PlatformShell
      badge="CRM"
      description="Manage client records, contacts, notes, active subscriptions and company context."
      nav={crmNav}
      title="Client Management"
    >
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Search clients..."
          className="w-full rounded-md border border-border p-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-2">
            {['Active', 'Proposal', 'Discovery'].map(status => (
                <button key={status} onClick={() => setFilter(filter === status ? null : status)} className={`px-2 py-1 rounded text-sm ${filter === status ? 'bg-primary text-white' : 'bg-secondary'}`}>
                    {status}
                </button>
            ))}
        </div>
        <WorkflowCard title="Clients">
          <div className="grid gap-2">
            {filteredClients.map((client) => (
              <div key={client.name} className="flex justify-between items-center p-3 border rounded shadow-sm">
                <div>
                  <h3 className="font-semibold">{client.name}</h3>
                  <p className="text-sm text-muted-foreground">{client.owner} · {client.status}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleAction(client.name)}>Action</Button>
              </div>
            ))}
          </div>
        </WorkflowCard>
      </div>
    </PlatformShell>
  );
}
