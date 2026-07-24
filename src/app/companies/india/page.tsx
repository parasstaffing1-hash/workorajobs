import { ArrowRight, Building2 } from "lucide-react";
import Link from "next/link";

import { CompanyDirectory } from "@/components/company/company-directory";
import { Section } from "@/components/layout/section";
import { PageHero } from "@/components/marketing/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({
  title: "India Company Directory & Employers | WorkoraJobs",
  description:
    "Explore top Indian public corporations, Nifty 50 tech leaders, DPIIT startups, and major Indian employers on WorkoraJobs.",
  path: "/companies/india",
});

export default function IndiaCompaniesPage() {
  return (
    <>
      <PageHero
        description="Search top Indian enterprises, IT services leaders, fintech unicorns, and major employers headquartered in India."
        eyebrow="India Directory"
        title="Indian Companies & Employers"
      >
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href="/companies" size="lg" variant="outline">
            All Companies
          </ButtonLink>
          <ButtonLink href="/jobs?country=IN" size="lg" variant="accent">
            View Jobs in India
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </ButtonLink>
        </div>
      </PageHero>

      <Section
        id="directory"
        eyebrow="Indian Employers"
        title="Explore Indian NSE/BSE Public & Tech Enterprises"
        description="Browse corporate profiles, verified career links, headquarters, and tech stacks for Indian-headquartered businesses."
      >
        <CompanyDirectory />
      </Section>
    </>
  );
}
