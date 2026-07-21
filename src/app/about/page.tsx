import Image from "next/image";

import { Section } from "@/components/layout/section";
import { CtaBand } from "@/components/marketing/cta-band";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { PageHero } from "@/components/marketing/page-hero";
import { Card } from "@/components/ui/card";
import { values } from "@/data/marketing";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({
  title: "About Us | AI-Powered Global Staffing Platform",
  description:
    "Learn about WorkoraJobs and its trust-first approach to global staffing.",
  path: "/about",
});;

export default function AboutPage() {
  return (
    <>
      <PageHero
        description="Workora Jobs is positioned as an AI-powered global staffing platform where enterprise hiring discipline meets candidate-centered design."
        eyebrow="About Workora"
        title="A recruitment brand built for clarity, trust and global momentum."
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-balance text-3xl font-semibold tracking-tight">
              Hiring across borders should feel structured, not chaotic.
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Workora sets the tone for structured sourcing, candidate
              communication, workforce intelligence and global recruiting
              operations that feel premium from the first touch.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {["Trust", "Accessibility", "Velocity", "Quality"].map((item) => (
                <Card className="p-5" key={item}>
                  <p className="text-2xl font-semibold">{item}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    A first-class product principle.
                  </p>
                </Card>
              ))}
            </div>
          </div>
          <Image
            alt="Global team planning hiring strategy"
            className="rounded-lg border border-border/70 object-cover shadow-premium"
            height={760}
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=85"
            width={980}
          />
        </div>
      </Section>
      <Section
        className="bg-secondary/40"
        description="These principles shape the Workora experience across public pages and role-based product surfaces."
        eyebrow="Values"
        title="The operating ideas behind Workora."
      >
        <FeatureGrid features={values} />
      </Section>
      <CtaBand />
    </>
  );
}
