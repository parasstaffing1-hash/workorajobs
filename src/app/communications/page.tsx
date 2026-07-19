"use client";
import { Send, Plus } from "lucide-react";
import { useState } from "react";

import { PlatformShell } from "@/components/platform/platform-shell";
import { RecordList } from "@/components/platform/record-list";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { Button } from "@/components/ui/button";
import {
  adminNav,
  communicationProviders,
  platformNotifications,
} from "@/data/platform";


export default function CommunicationsPage() {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const handleCompose = () => {
    alert("Compose functionality triggered");
  };

  return (
    <PlatformShell
      badge="Comms"
      description="Coordinate notification center, email templates, SMS, WhatsApp and push provider structures."
      nav={adminNav}
      title="Communication Center"
    >
      <div className="space-y-6">
        <WorkflowCard
          action={
            <Button size="sm" onClick={handleCompose}>
              <Plus aria-hidden="true" className="h-4 w-4" />
              Compose
            </Button>
          }
          title="Providers"
        >
          <RecordList
            items={communicationProviders.map((provider) => ({
              title: provider.channel,
              meta: provider.provider,
              value: provider.status,
              onClick: () => setActiveItem(`Provider: ${provider.channel}`),
            }))}
          />
        </WorkflowCard>
        <WorkflowCard title="Notification center">
          <RecordList
            items={platformNotifications.map((item) => ({
              title: item,
              meta: "In-app notification",
              onClick: () => setActiveItem(`Notification: ${item}`),
            }))}
          />
        </WorkflowCard>
      </div>
    </PlatformShell>
  );
}
