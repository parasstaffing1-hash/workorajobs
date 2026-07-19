import { Brain } from "lucide-react";

import { AiToolLaunchButton } from "@/components/ai/ai-tool-launch-button";
import { AiToolsWorkbench } from "@/components/ai/ai-tools-workbench";
import { PlatformShell } from "@/components/platform/platform-shell";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { Badge } from "@/components/ui/badge";
import { recruiterAiTools, recruiterNav } from "@/data/platform";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({
  title: "Recruiter AI Tools",
  path: "/recruiter/ai",
});

export default function RecruiterAiPage() {
  return (
    <PlatformShell
      badge="Recruiter"
      description="Use Workora AI surfaces for resume analysis, scoring, matching, skill gaps, job descriptions, interview questions and summaries."
      nav={recruiterNav}
      title="AI Hiring Assistant"
    >
      <div className="space-y-6">
        <AiToolsWorkbench />
        <WorkflowCard title="Available AI workflows">
          <div className="grid gap-3 md:grid-cols-2">
            {recruiterAiTools.map((tool) => (
              <div
                className="rounded-md border border-border/70 bg-background/70 p-4 transition-colors hover:border-primary/30"
                key={tool.name}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Brain
                      aria-hidden="true"
                      className="h-4 w-4 text-primary"
                    />
                    <h2 className="text-sm font-semibold">{tool.name}</h2>
                  </div>
                  <Badge>{tool.status}</Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {tool.description}
                </p>
                <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                  <p className="rounded-md border border-border/70 px-3 py-2 font-medium">
                    {tool.endpoint}
                  </p>
                  <p>Inputs: {tool.input}</p>
                  <p>Output: {tool.output}</p>
                </div>
                <AiToolLaunchButton
                  className="mt-4 w-full"
                  size="sm"
                  targetPath="/recruiter/ai"
                  toolName={tool.name}
                  variant="outline"
                />
              </div>
            ))}
          </div>
        </WorkflowCard>
      </div>
    </PlatformShell>
  );
}
