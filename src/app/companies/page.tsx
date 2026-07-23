import { ArrowRight } from "lucide-react";

import { CompanyDirectory } from "@/components/company/company-directory";
import { Section } from "@/components/layout/section";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({
  title: "Company Directory | WorkoraJobs",
  description:
    "Explore top enterprise market leaders, technology stacks, workplace benefits, stock exchanges, and corporate profiles on WorkoraJobs.",
  path: "/companies",
});

export default function CompaniesPage() {
  return (
    <>
      <PageHero
        description="Discover leading enterprise employers across Information Technology, Banking, Energy, Automotive, FMCG, and Infrastructure."
        eyebrow="Company Directory"
        title="Company Directory"
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
        title="Filter by Industry, Country & Tech Stack"
        description="Explore corporate profiles, tech stack tools, Glassdoor ratings, workplace benefits, and active job vacancies in real-time."
      >
        <CompanyDirectory />
      </Section>


      <CtaBand />
    </>
  );
}

