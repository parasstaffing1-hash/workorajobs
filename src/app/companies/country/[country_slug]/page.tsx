import { ArrowRight, Building2, Globe, MapPin, Search, Star } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CompanyDirectory } from "@/components/company/company-directory";
import { Section } from "@/components/layout/section";
import { PageHero } from "@/components/marketing/page-hero";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { companiesData } from "@/data/companies";
import { ISO_COUNTRY_MAP, normalizeCountryInfo } from "@/lib/global-import/country-discovery";
import { createMetadata } from "@/lib/site";

interface CountryPageProps {
  params: Promise<{
    country_slug: string;
  }>;
}

export async function generateMetadata(props: CountryPageProps) {
  const { country_slug } = await props.params;
  const norm = normalizeCountryInfo(country_slug, country_slug);

  return createMetadata({
    title: `${norm.name} Companies & Employers Directory | WorkoraJobs`,
    description: `Explore top verified ${norm.name} operating companies, public corporations, startups, and hiring locations on WorkoraJobs.`,
    path: `/companies/country/${norm.slug}`,
  });
}

export default async function DynamicCountryDirectoryPage(props: CountryPageProps) {
  const { country_slug } = await props.params;
  const norm = normalizeCountryInfo(country_slug, country_slug);

  // Calculate WorkoraJobs Database Counts (not source counts)
  const countryCompanies = companiesData.filter(
    (c) =>
      c.country.toLowerCase().includes(norm.name.toLowerCase()) ||
      (c.countryCode && c.countryCode.toLowerCase() === norm.alpha2.toLowerCase())
  );

  return (
    <>
      <PageHero
        description={`Explore verified ${norm.name} operating companies, headquarters, official careers portals, and tech stacks tracked in the WorkoraJobs directory.`}
        eyebrow={`${norm.name} Directory`}
        title={`${norm.name} Companies & Employers`}
      >
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href="/companies" size="lg" variant="outline">
            All Global Companies
          </ButtonLink>
          <ButtonLink href={`/jobs?country=${norm.alpha2}`} size="lg" variant="accent">
            View Jobs in {norm.name}
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </ButtonLink>
        </div>
      </PageHero>

      <Section
        id="directory"
        eyebrow={`${norm.name} Employers`}
        title={`Verified ${norm.name} Employers (${countryCompanies.length} Active in Database)`}
        description={`Browse canonical company profiles, verified careers links, headquarters, and tech stacks for ${norm.name}-headquartered businesses.`}
      >
        <CompanyDirectory />
      </Section>
    </>
  );
}
