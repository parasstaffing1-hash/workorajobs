import {
  ArrowRight,
  FileText,
  Gauge,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { AiResumeBuilder } from "@/components/ai/ai-resume-builder";
import { ThemeSelector } from "@/components/theme/theme-selector";
import { Section } from "@/components/layout/section";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({
  title: "AI Resume Builder",
  description:
    "Build a polished, ATS-ready resume locally in the browser with Workora Jobs AI resume builder.",
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
        description="Build a premium, ATS-ready resume with local AI-style guidance, keyword matching, impact rewriting and downloadable output."
        eyebrow="AI Resume Builder"
        title="Create a resume that looks sharp and reads like evidence."
      >
        <ButtonLink href="#builder" size="lg" variant="accent">
          Start building
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </ButtonLink>
      </PageHero>

      <Section
        className="bg-secondary/40"
        eyebrow="Builder"
        title="Tailor your resume to the role."
        description="Paste a target job description, add your experience and generate a polished resume draft without any backend or external AI call."
        id="builder"
      >
        <AiResumeBuilder />
        <ThemeSelector />
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
          <ButtonLink href="/ai-tools" variant="outline">
            Explore AI tools
          </ButtonLink>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
