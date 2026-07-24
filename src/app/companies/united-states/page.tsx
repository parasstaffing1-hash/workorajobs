import { ArrowRight, Building2 } from "lucide-react";
import Link from "next/link";

import { CompanyDirectory } from "@/components/company/company-directory";
import { Section } from "@/components/layout/section";
import { PageHero } from "@/components/marketing/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({
  title: "United States Company Directory & Employers | WorkoraJobs",
  description:
    "Explore top United States public corporations, Silicon Valley tech leaders, private employers, and unicorns hiring on WorkoraJobs.",
  path: "/companies/united-states",
});

export default function USCompaniesPage() {
  return (
    <>
      <PageHero
        description="Search active US operating companies, Fortune 500 tech leaders, and US-headquartered employers."
        eyebrow="United States Directory"
        title="United States Companies & Employers"
      >
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href="/companies" size="lg" variant="outline">
            All Companies
          </ButtonLink>
          <ButtonLink href="/jobs?country=US" size="lg" variant="accent">
            View US Jobs
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </ButtonLink>
        </div>
      </PageHero>

      <Section
        id="directory"
        eyebrow="United States Employers"
        title="Explore US Public, Private & Tech Employers"
        description="Browse corporate profiles, verified career links, headquarters, and tech stacks for US-headquartered businesses."
      >
        <CompanyDirectory />
      </Section>
    </>
  );
}
