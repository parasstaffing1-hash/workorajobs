import {
  ArrowRight,
  Brain,
  FileText,
  FileSearch,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";

import { AiToolLaunchButton } from "@/components/ai/ai-tool-launch-button";
import { AiToolsWorkbench } from "@/components/ai/ai-tools-workbench";
import { Section } from "@/components/layout/section";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { recruiterAiTools } from "@/data/platform";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({
  title: "AI Tools",
  description:
    "Responsible AI recruiting tools and a local AI resume builder for resume analysis, scoring, candidate matching, job descriptions, interview questions and hiring assistance.",
  path: "/ai-tools",
});

const integrationSteps = [
  {
    title: "Browser-local execution",
    description:
      "Each tool generates deterministic artifacts in the browser without API keys, backend calls or external AI services.",
    icon: Workflow,
  },
  {
    title: "Future endpoint-ready",
    description:
      "The UI keeps future integration points visible while the current experience remains fully usable offline.",
    icon: Sparkles,
  },
  {
    title: "Human review by design",
    description:
      "AI output stays positioned as recruiter support, not an automated hiring decision.",
    icon: ShieldCheck,
  },
];

export default function AiToolsPage() {
  return (
    <>
      <PageHero
        description="AI recruiting surfaces for resume analysis, scoring, candidate matching, job-description drafting, interview questions and hiring assistance."
        eyebrow="AI Tools"
        title="Responsible AI tools for faster, clearer hiring decisions."
      />

      <Section
        eyebrow="Workbench"
        title="Run an AI hiring workflow."
        description="Generate resume analysis, scoring, matching, Boolean search strings, job descriptions, interview questions and summaries locally in the browser."
      >
        <div className="space-y-6">
          <AiToolsWorkbench />
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/resume-builder" variant="accent">
              Open AI resume builder
              <FileText aria-hidden="true" className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/recruiter/ai" variant="outline">
              Open recruiter AI workspace
            </ButtonLink>
          </div>
        </div>
      </Section>

      <Section
        className="bg-secondary/40"
        eyebrow="Tool library"
        title="Local AI workflows with clear future integration points."
        description="These cards preserve the product surface while every workflow runs without API credentials today."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {recruiterAiTools.map((tool) => (
            <Card className="flex min-h-72 flex-col p-6" key={tool.name}>
              <div className="flex items-center justify-between gap-3">
                <div className="animated-sheen grid h-11 w-11 place-items-center rounded-lg border border-primary/20 bg-primary/10 text-primary shadow-sm">
                  <Brain aria-hidden="true" className="h-5 w-5" />
                </div>
                <Badge>{tool.status}</Badge>
              </div>
              <h2 className="mt-6 text-lg font-semibold tracking-tight">
                {tool.name}
              </h2>
              <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">
                {tool.description}
              </p>
              <div className="mt-5 space-y-2 text-xs text-muted-foreground">
                <p className="rounded-md border border-border/70 bg-background/70 px-3 py-2 font-medium">
                  {tool.endpoint}
                </p>
                <p>Inputs: {tool.input}</p>
                <p>Output: {tool.output}</p>
              </div>
              <AiToolLaunchButton
                className="mt-5 w-full"
                size="sm"
                targetPath="/ai-tools"
                toolName={tool.name}
                variant="outline"
              />
            </Card>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Integration path"
        title="Clear placeholders for the next implementation pass."
        description="Production execution needs authenticated client calls, environment credentials and review workflows."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {integrationSteps.map((step) => {
            const Icon = step.icon;

            return (
              <Card className="p-6" key={step.title}>
                <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </div>
                <h2 className="mt-6 text-lg font-semibold">{step.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </Card>
            );
          })}
        </div>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href="/recruiter/ai" variant="accent">
            Open recruiter AI workspace
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink href="/services" variant="outline">
            View services
          </ButtonLink>
        </div>
      </Section>

      <Section
        eyebrow="Responsible AI"
        title="AI supports recruiters. It does not replace judgment."
        description="Workora keeps generated analysis framed around evidence, follow-up questions and structured review."
      >
        <Card className="mx-auto max-w-3xl p-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
              <FileSearch aria-hidden="true" className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Review-ready AI artifacts
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Resume analysis, candidate summaries and interview prompts are
                designed to become auditable artifacts tied to candidates, jobs
                and applications through the existing API contract.
              </p>
            </div>
          </div>
        </Card>
      </Section>

      <CtaBand />
    </>
  );
}
