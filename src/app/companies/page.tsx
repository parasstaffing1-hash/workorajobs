import { ArrowRight } from "lucide-react";

import { CompanyDirectory } from "@/components/company/company-directory";
import { Section } from "@/components/layout/section";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({
  title: "Browse Companies",
  description:
    "Explore top enterprise tech companies, tech stacks, Glassdoor reviews, workplace benefits, and active hiring opportunities.",
  path: "/companies",
});

export default function CompaniesPage() {
  return (
    <>
      <PageHero
        description="Discover top engineering employers, modern tech stacks, workplace benefits, Glassdoor reviews, and verified hiring opportunities."
        eyebrow="Browse by Company"
        title="Find the right company culture and engineering team."
      >
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href="#directory" size="lg" variant="accent">
            Explore Directory
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink href="/jobs" size="lg" variant="outline">
            Search All Jobs
          </ButtonLink>
        </div>
      </PageHero>

      <Section
        id="directory"
        eyebrow="Company Directory"
        title="Filter by tech stack, industry & headquarters."
        description="Inspect employer culture, workplace benefits, employee ratings, and active hiring roles in real-time."
      >
        <CompanyDirectory />
      </Section>

      <CtaBand />
    </>
  );
}
