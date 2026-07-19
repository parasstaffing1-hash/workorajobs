import { ArrowRight, Bot, ShieldCheck, Sparkles } from "lucide-react";

import { AiCareerCopilot } from "@/components/ai/ai-career-copilot";
import { Section } from "@/components/layout/section";
import { PageHero } from "@/components/marketing/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createMetadata, siteConfig } from "@/lib/site";

export const metadata = createMetadata({
  title: "AI Career Copilot",
  description:
    "Use Workora Jobs AI Career Copilot to discover jobs, score role fit, improve resumes, prepare interviews, analyze salary, inspect companies and plan career growth.",
  path: "/career-copilot",
});

const pillars = [
  {
    title: "Personal job intelligence",
    description:
      "Scores opportunities across skills, salary, location, visa, remote fit, company signals and interview probability.",
    icon: Sparkles,
  },
  {
    title: "Resume and interview engine",
    description:
      "Turns resume evidence into ATS guidance, missing-keyword insights, STAR prompts and role-specific preparation.",
    icon: Bot,
  },
  {
    title: "Trust and safety layer",
    description:
      "Surfaces scam probability, duplicate-style risk, company context and integration status before a candidate applies.",
    icon: ShieldCheck,
  },
];

export default function CareerCopilotPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          applicationCategory: "BusinessApplication",
          description:
            "AI-powered career copilot for job discovery, resume intelligence, job matching, interview preparation and career planning.",
          name: "Workora Jobs AI Career Copilot",
          operatingSystem: "Web",
          url: `${siteConfig.url}/career-copilot`,
        }}
      />
      <PageHero
        description="A premium AI-powered career workspace for discovering jobs, optimizing resumes, preparing interviews, evaluating companies and planning your next move."
        eyebrow="AI Career Copilot"
        title="A smarter command center for your entire job search."
      >
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href="#copilot" size="lg" variant="accent">
            Launch Copilot
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink href="/resume-builder" size="lg" variant="outline">
            Open Resume Builder
          </ButtonLink>
        </div>
      </PageHero>

      <Section
        className="bg-secondary/40"
        eyebrow="Intelligence layers"
        title="Everything a serious candidate needs before applying."
        description="The current version runs deterministic intelligence locally in the browser while preserving integration points for crawlers, embeddings, notifications and one-click apply."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;

            return (
              <Card className="p-6" key={pillar.title}>
                <div className="animated-sheen grid h-12 w-12 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </div>
                <h2 className="mt-6 text-lg font-semibold">{pillar.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {pillar.description}
                </p>
              </Card>
            );
          })}
        </div>
      </Section>

      <Section
        id="copilot"
        eyebrow="Live workspace"
        title="Run the AI Career Copilot."
        description="Adjust the sample profile and watch recommendations, resume guidance, salary analysis and interview prep update instantly."
      >
        <AiCareerCopilot />
      </Section>
    </>
  );
}
