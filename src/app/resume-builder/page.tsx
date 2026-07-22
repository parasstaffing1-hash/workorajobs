import {
  ArrowRight,
  FileText,
  Gauge,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { BuilderWorkspace } from "@/components/resume-builder/builder-workspace";
import { Section } from "@/components/layout/section";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({
  title: "Free AI Resume Builder | ATS-Friendly Resumes",
  description:
    "Create deterministic, ATS-friendly professional resumes designed for high conversion.",
  path: "/resume-builder",
});

const builderHighlights = [
  {
    title: "ATS-ready structure",
    description:
      "Create clean sections, keyword coverage and plain-text output that works well with applicant tracking systems.",
    icon: Gauge,
  },
  {
    title: "Stronger impact bullets",
    description:
      "Turn responsibilities into action-led achievements with clearer scope, outcomes and hiring-manager relevance.",
    icon: Sparkles,
  },
  {
    title: "Private by default",
    description:
      "Everything runs locally in the browser. No resume data is sent to an external AI API.",
    icon: ShieldCheck,
  },
];

export default function ResumeBuilderPage() {
  return (
    <>
      <PageHero
        description="Build, tailor, and download a polished resume with live ATS guidance. Your draft stays private in your browser."
        eyebrow="Free AI Resume Builder"
        title="Build the resume that gets you to the interview."
      >
        <ButtonLink href="#builder" size="lg" variant="accent">
          Start building
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </ButtonLink>
      </PageHero>

      <Section
        className="bg-secondary/40 py-12 sm:py-16"
        eyebrow="Resume Studio"
        title="Everything you need, in one focused workspace."
        description="Edit every section, match a target job, customize the design, and export an ATS-friendly PDF without creating an account."
        id="builder"
      >
        <BuilderWorkspace />
      </Section>

      <Section
        eyebrow="What it improves"
        title="A premium resume workflow for serious candidates."
        description="The builder focuses on clarity, evidence and ATS compatibility instead of generic resume filler."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {builderHighlights.map((item) => {
            const Icon = item.icon;

            return (
              <Card className="p-6" key={item.title}>
                <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </div>
                <h2 className="mt-6 text-lg font-semibold">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </Card>
            );
          })}
        </div>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href="/jobs" variant="primary">
            Browse matching jobs
            <FileText aria-hidden="true" className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink href="/services" variant="outline">
            Explore services
          </ButtonLink>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
