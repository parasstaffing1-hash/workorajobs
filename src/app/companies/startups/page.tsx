import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

import { CompanyDirectory } from "@/components/company/company-directory";
import { Section } from "@/components/layout/section";
import { PageHero } from "@/components/marketing/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({
  title: "High-Growth Startups & Tech Directory | WorkoraJobs",
  description:
    "Discover verified high-growth startups, AI innovators, fintech leaders, and unicorn tech employers on WorkoraJobs.",
  path: "/companies/startups",
});

export default function StartupsDirectoryPage() {
  return (
    <>
      <PageHero
        description="Search top seed, series A, late-stage, and unicorn tech startups hiring remotely and across global tech hubs."
        eyebrow="Startup Directory"
        title="High-Growth Startups & Tech Companies"
      >
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href="/companies/unicorns" size="lg" variant="accent">
            View Unicorns
            <Sparkles aria-hidden="true" className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink href="/companies" size="lg" variant="outline">
            All Companies
          </ButtonLink>
        </div>
      </PageHero>

      <Section
        id="directory"
        eyebrow="Startup Directory"
        title="Filter Top Tech & AI Startups"
        description="Explore verified careers portals, tech stacks, funding stages, and startup employer profiles."
      >
        <CompanyDirectory />
      </Section>
    </>
  );
}
