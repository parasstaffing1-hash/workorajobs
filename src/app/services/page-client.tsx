"use client";

import { useState } from "react";
import { Section } from "@/components/layout/section";
import { CtaBand } from "@/components/marketing/cta-band";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { PageHero } from "@/components/marketing/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { services } from "@/data/marketing";
import { recruiterAiTools } from "@/data/platform";


export default function ServicesPage() {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  return (
    <>
      <PageHero
        description="A premium public services architecture for employers that need reliable hiring motion across regions, role types and skill markets."
        eyebrow="Services"
        title="Global recruiting services designed for enterprise standards."
      />
      <Section>
        <FeatureGrid features={services} />
      </Section>
      <Section
        className="bg-secondary/40"
        eyebrow="Hiring tools"
        title="Hiring workflow tools built into the platform."
        description="The UI exposes resume analysis, scoring, matching and assistant surfaces that work in the browser today and remain ready for future backend endpoints."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {recruiterAiTools.slice(0, 3).map((tool) => (
            <Card
              className="cursor-pointer p-6 transition-colors hover:border-primary"
              key={tool.name}
              onClick={() => alert(`Details for Tool: ${tool.name}`)}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {tool.status}
              </p>
              <h2 className="mt-4 text-lg font-semibold">{tool.name}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {tool.description}
              </p>
              <p className="mt-4 rounded-md border border-border/70 bg-background/70 px-3 py-2 text-xs font-medium text-muted-foreground">
                {tool.endpoint}
              </p>
            </Card>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <ButtonLink href="/jobs" variant="accent">
            Browse Jobs
          </ButtonLink>
        </div>
      </Section>
      <Section
        eyebrow="Engagement model"
        title="Clear support from role definition to close."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            "Role calibration and hiring scorecards",
            "Talent market mapping and sourcing strategy",
            "Screening workflows and stakeholder-ready shortlists",
          ].map((item) => (
            <Card
              className="cursor-pointer p-6 transition-colors hover:border-primary"
              key={item}
              onClick={() => alert(`Details for: ${item}`)}
            >
              <h2 className="text-lg font-semibold">{item}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Designed to support executive-ready alignment, calibrated
                recruiting motion and measurable candidate quality.
              </p>
            </Card>
          ))}
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
