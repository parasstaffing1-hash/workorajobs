import { ArrowRight, CheckCircle2, FileText } from "lucide-react";

import { Section } from "@/components/layout/section";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { candidateBenefits } from "@/data/marketing";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({
  title: "Candidates",
  description:
    "Discover the candidate-centered experience Workora Jobs is designed to support.",
  path: "/candidates",
});

export default function CandidatesPage() {
  return (
    <>
      <PageHero
        description="A respectful public experience for global talent seeking roles with clearer expectations, communication and momentum."
        eyebrow="For candidates"
        title="Find opportunities with a hiring process that respects your time."
      >
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href="/resume-builder" size="lg" variant="accent">
            Build your resume
            <FileText aria-hidden="true" className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink href="/career-copilot" size="lg" variant="primary">
            Launch career copilot
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink href="/jobs" size="lg" variant="outline">
            Browse jobs
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </ButtonLink>
        </div>
      </PageHero>
      <Section
        eyebrow="Candidate experience"
        title="A better way to explore global work."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {candidateBenefits.map((benefit) => (
            <Card className="flex gap-4 p-6" key={benefit}>
              <CheckCircle2
                aria-hidden="true"
                className="h-6 w-6 shrink-0 text-primary"
              />
              <div>
                <h2 className="font-semibold">{benefit}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Built for transparent expectations, respectful communication
                  and sharper role-fit context.
                </p>
              </div>
            </Card>
          ))}
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
