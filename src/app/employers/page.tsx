import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Section } from "@/components/layout/section";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { employerBenefits } from "@/data/marketing";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({
  title: "Hire Top Talent in India | Employer Solutions",
  description:
    "Post jobs, access pre-vetted candidate profiles, and streamline global hiring.",
  path: "/employers",
});;

export default function EmployersPage() {
  return (
    <>
      <PageHero
        description="A public employer experience for teams that want structured global hiring without adding operational drag."
        eyebrow="For employers"
        title="Hire with better signal, better structure and better candidate trust."
      >
        <ButtonLink href="/contact" size="lg">
          Plan hiring support
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </ButtonLink>
      </PageHero>
      <Section
        description="Workora bridges strategic headcount planning and candidate-ready execution."
        eyebrow="Employer outcomes"
        title="What hiring teams can expect."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {employerBenefits.map((benefit) => (
            <Card className="flex gap-4 p-6" key={benefit}>
              <CheckCircle2
                aria-hidden="true"
                className="h-6 w-6 shrink-0 text-primary"
              />
              <div>
                <h2 className="font-semibold">{benefit}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Designed to create better signal, faster alignment and more
                  confident hiring decisions.
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
