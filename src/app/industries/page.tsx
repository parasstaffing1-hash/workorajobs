import Image from "next/image";

import { Section } from "@/components/layout/section";
import { CtaBand } from "@/components/marketing/cta-band";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { PageHero } from "@/components/marketing/page-hero";
import { industries } from "@/data/marketing";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({
  title: "Industries",
  description:
    "Discover the industries Workora Jobs is positioned to support with global staffing.",
  path: "/industries",
});

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        description="Workora is designed for specialized teams that need disciplined recruiting across fast-moving, high-trust sectors."
        eyebrow="Industries"
        title="Talent coverage for the roles shaping modern work."
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Image
            alt="Professionals collaborating in a modern workspace"
            className="rounded-lg border border-border/70 object-cover shadow-premium"
            height={720}
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=85"
            width={980}
          />
          <FeatureGrid features={industries} />
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
