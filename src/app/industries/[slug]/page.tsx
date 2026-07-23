import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  Building2, 
  MapPin, 
  Users, 
  Briefcase, 
  ArrowLeft, 
  TrendingUp, 
  CheckCircle2, 
  Code2, 
  ExternalLink,
  HelpCircle,
  ArrowRight,
  Globe
} from "lucide-react";

import { findIndustryBySlug, industriesData } from "@/data/industries";
import { companiesData } from "@/data/companies";
import { jobs, getJobSlug } from "@/data/jobs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return industriesData.map((ind) => ({
    slug: ind.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const industry = findIndustryBySlug(slug);

  if (!industry) {
    return {
      title: "Industry Sector Not Found | WorkoraJobs",
      description: "Explore top enterprise hiring sectors on WorkoraJobs.",
    };
  }

  const title = `${industry.name} Jobs, Enterprise Employers & Tech Stack | WorkoraJobs`;
  const description = `${industry.shortDescription} Explore open vacancies, salary ranges (${industry.averageSalaryRange}), top employers, and required skills in ${industry.name}.`;
  const canonicalUrl = `${siteConfig.url}/industries/${industry.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${industry.name} Sector - Careers & Market Insights`,
      description,
      url: canonicalUrl,
      type: "website",
    },
  };
}

export default async function DynamicIndustryPage({ params }: Props) {
  const { slug } = await params;
  const industry = findIndustryBySlug(slug);

  if (!industry) {
    return (
      <main className="min-h-screen py-16 bg-background">
        <div className="mx-auto max-w-3xl px-4 text-center space-y-4">
          <Building2 className="h-16 w-16 text-muted-foreground mx-auto opacity-50" />
          <h1 className="text-2xl font-bold text-foreground">Industry Sector Not Found</h1>
          <p className="text-sm text-muted-foreground">
            We couldn't find a matching industry sector for "{slug}".
          </p>
          <div>
            <Link href="/industries">
              <Button variant="accent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Browse All Industry Sectors
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Filter matching companies & jobs
  const industryCompanies = companiesData.filter(
    (c) =>
      c.industry.toLowerCase().includes(industry.name.toLowerCase()) ||
      industry.name.toLowerCase().includes(c.industry.toLowerCase())
  );

  const industryJobs = jobs.filter((j) =>
    industryCompanies.some(
      (c) => c.name.toLowerCase().includes(j.company.toLowerCase()) || j.company.toLowerCase().includes(c.name.toLowerCase())
    )
  );

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Industries", item: `${siteConfig.url}/industries` },
      { "@type": "ListItem", position: 3, name: industry.name, item: `${siteConfig.url}/industries/${industry.slug}` },
    ],
  };

  return (
    <main className="min-h-screen py-10 bg-background">
      <JsonLd data={breadcrumbSchema} />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/industries"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Industries
          </Link>
          <Badge className="bg-primary/20 text-primary font-semibold text-xs">
            Sector Growth: {industry.growthRate}
          </Badge>
        </div>

        {/* Hero Card */}
        <div className="rounded-2xl border border-border/70 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.15),transparent_45%),linear-gradient(135deg,hsl(var(--card)),hsl(var(--secondary)/0.4))] p-6 sm:p-8 shadow-premium">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                  {industry.name}
                </h1>
                <Badge className="bg-secondary text-foreground font-semibold text-xs">
                  {industry.category}
                </Badge>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground max-w-3xl">
                {industry.tagline}
              </p>
            </div>

            <Link href={`/jobs?search=${encodeURIComponent(industry.name)}`}>
              <Button variant="accent" size="sm" className="w-full sm:w-auto shrink-0">
                <Briefcase className="h-4 w-4 mr-1.5" />
                Search All Roles
              </Button>
            </Link>
          </div>

          {/* Key Industry Metrics */}
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border/60 pt-6 text-xs sm:grid-cols-4">
            <div className="rounded-xl border border-border/60 bg-secondary/30 p-3.5">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Salary Range</span>
              <span className="font-bold text-primary flex items-center gap-1 mt-1">
                {industry.averageSalaryRange.split(' ')[0]}
              </span>
            </div>
            <div className="rounded-xl border border-border/60 bg-secondary/30 p-3.5">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Active Employers</span>
              <span className="font-bold text-foreground flex items-center gap-1 mt-1">
                <Building2 className="h-3.5 w-3.5 text-primary" /> {industryCompanies.length || industry.topCompanies.length} Enterprise Leaders
              </span>
            </div>
            <div className="rounded-xl border border-border/60 bg-secondary/30 p-3.5">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Open Roles</span>
              <span className="font-bold text-foreground flex items-center gap-1 mt-1">
                <Briefcase className="h-3.5 w-3.5 text-primary" /> {industry.openJobsCount}+ Openings
              </span>
            </div>
            <div className="rounded-xl border border-border/60 bg-secondary/30 p-3.5">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Primary Tech Stack</span>
              <span className="font-mono text-xs font-semibold text-foreground mt-1 block truncate">
                {industry.keySkills.slice(0, 3).join(", ")}
              </span>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <Card className="p-6 border-border/70 bg-card space-y-4 shadow-sm">
              <h2 className="text-base font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" /> Sector Market Overview
              </h2>
              <p className="text-xs leading-6 text-muted-foreground">
                {industry.overview}
              </p>
            </Card>

            {/* Active Jobs in Industry */}
            <div className="space-y-4">
              <h2 className="text-lg font-extrabold text-foreground flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" /> Active Openings in {industry.name}
              </h2>

              {industryJobs.length > 0 ? (
                <div className="space-y-4">
                  {industryJobs.map((job) => (
                    <Card key={job.id} className="p-5 border-border/70 bg-card space-y-3 hover:border-primary/40 transition-all">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-base font-bold text-foreground hover:text-primary transition-colors">
                            {job.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-foreground">{job.company}</span>
                            •
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-primary" /> {job.location}
                            </span>
                            •
                            <span className="text-primary font-bold">{job.salary}</span>
                          </p>
                        </div>
                        <Link href={`/jobs/${getJobSlug(job)}`}>
                          <Button size="sm" variant="accent" className="text-xs shrink-0">
                            Apply Role <ArrowRight className="h-3.5 w-3.5 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-6 text-center border-border/60 bg-secondary/10 space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Direct candidate hiring applications open for enterprise companies in {industry.name}.
                  </p>
                  <Link href={`/jobs?search=${encodeURIComponent(industry.name)}`}>
                    <Button variant="accent" size="sm" className="text-xs mt-2">
                      Search Active Opportunities →
                    </Button>
                  </Link>
                </Card>
              )}
            </div>

            {/* In-Demand Tech Stacks */}
            <Card className="p-6 border-border/70 bg-card space-y-4 shadow-sm">
              <h2 className="text-base font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <Code2 className="h-4 w-4 text-accent" /> Key In-Demand Technical Skills
              </h2>
              <div className="flex flex-wrap gap-2 font-mono">
                {industry.keySkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg border border-border/80 bg-secondary/60 px-3.5 py-1.5 text-xs font-semibold text-primary shadow-sm"
                  >
                    <code>{skill}</code>
                  </span>
                ))}
              </div>
            </Card>

            {/* Sector FAQs */}
            {industry.faqs.length > 0 && (
              <Card className="p-6 border-border/70 bg-card space-y-4 shadow-sm">
                <h2 className="text-base font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-primary" /> Industry Sector FAQs
                </h2>
                <div className="space-y-3">
                  {industry.faqs.map((faq, idx) => (
                    <div key={idx} className="rounded-xl border border-border/60 bg-secondary/15 p-4 space-y-1">
                      <h3 className="text-xs font-bold text-foreground flex items-center gap-2">
                        <span className="text-primary font-mono">Q.</span> {faq.question}
                      </h3>
                      <p className="text-xs leading-5 text-muted-foreground pl-5">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Hiring Leaders */}
            <Card className="p-6 border-border/70 bg-card space-y-4 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Top Hiring Employers
              </h3>
              <div className="space-y-2.5">
                {industryCompanies.length > 0
                  ? industryCompanies.map((c) => (
                      <Link
                        key={c.id}
                        href={`/companies/${c.slug}`}
                        className="flex items-center justify-between rounded-xl border border-border/60 bg-secondary/20 p-3 hover:border-primary/40 hover:bg-secondary/40 transition-all group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-border/80 bg-white p-1 grid place-items-center">
                            {c.logoUrl ? (
                              <img src={c.logoUrl} alt={`${c.name} logo`} className="h-full w-full object-contain" />
                            ) : (
                              <span className="text-xs font-bold text-primary">{c.logo}</span>
                            )}
                          </div>
                          <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                            {c.name}
                          </span>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </Link>
                    ))
                  : industry.topCompanies.map((compName) => (
                      <div key={compName} className="rounded-xl border border-border/60 bg-secondary/20 p-3 text-xs font-bold text-foreground">
                        {compName}
                      </div>
                    ))}
              </div>
            </Card>

            {/* Hiring Hubs */}
            <Card className="p-6 border-border/70 bg-card space-y-3 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Key Hiring Hotspots
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {industry.hiringHotspots.map((city) => (
                  <Badge key={city} className="bg-secondary text-foreground text-[11px]">
                    <MapPin className="h-3 w-3 mr-1 text-primary" /> {city}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
