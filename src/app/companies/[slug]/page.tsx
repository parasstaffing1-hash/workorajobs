import { Metadata } from "next";
import Link from "next/link";
import { 
  Building2, 
  MapPin, 
  Users, 
  Calendar, 
  Globe, 
  ExternalLink, 
  Star, 
  BadgeCheck, 
  Code2, 
  HeartHandshake, 
  CheckCircle2, 
  Briefcase, 
  ArrowLeft,
  MessageSquare,
  DollarSign,
  TrendingUp,
  HelpCircle,
  Share2,
  Sparkles,
  ArrowRight,
  Clock,
  GraduationCap,
  FileText
} from "lucide-react";

import { CompanyLogo } from "@/components/company/company-logo";
import { findCompanyBySlug, companiesData } from "@/data/companies";
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
  return companiesData.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const company = findCompanyBySlug(slug);

  if (!company) {
    return {
      title: "Company Profile Not Found | WorkoraJobs",
      description: "Explore top technology companies and enterprise hiring platforms on WorkoraJobs.",
    };
  }

  const title = `${company.name} Jobs, Careers and Remote Opportunities | WorkoraJobs`;
  const description = `Explore verified ${company.name} jobs, career opportunities, internships, hiring locations and remote roles. View the latest ${company.name} openings on WorkoraJobs.`;
  const canonicalUrl = `${siteConfig.url}/companies/${company.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${company.name} Jobs & Careers - WorkoraJobs`,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@workorajobs",
    },
  };
}

export default async function EnterpriseCompanyPage({ params }: Props) {
  const { slug } = await params;
  const company = findCompanyBySlug(slug);

  if (!company) {
    return (
      <main className="min-h-screen py-16 bg-background">
        <div className="mx-auto max-w-3xl px-4 text-center space-y-4">
          <Building2 className="h-16 w-16 text-muted-foreground mx-auto opacity-50" />
          <h1 className="text-2xl font-bold text-foreground">Company Profile Not Found</h1>
          <p className="text-sm text-muted-foreground">
            We couldn't find a company profile matching "{slug}".
          </p>
          <div>
            <Link href="/companies">
              <Button variant="accent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Browse All Enterprise Companies
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Find active jobs for this company
  const companyJobs = jobs.filter(
    (j) => j.company.toLowerCase().includes(company.name.toLowerCase()) || company.name.toLowerCase().includes(j.company.toLowerCase())
  );

  // Similar companies in same industry
  const similarCompanies = companiesData
    .filter((c) => c.slug !== company.slug && c.industry === company.industry)
    .slice(0, 4);

  // Structured Data Schemas
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/companies/${company.slug}#organization`,
    name: company.name,
    legalName: company.legalName,
    url: company.website,
    logo: company.logoUrl || `${siteConfig.url}/workora-jobs-logo-scraped.png`,
    sameAs: Object.values(company.socialLinks || {}).filter(Boolean),
    knowsAbout: company.techStack,
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      value: company.employeeCount,
    },
    location: {
      "@type": "Place",
      address: company.headquarters,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: company.glassdoorRating,
      reviewCount: company.reviewCount,
      bestRating: "5",
      worstRating: "1",
    },
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteConfig.url}/companies/${company.slug}#webpage`,
    url: `${siteConfig.url}/companies/${company.slug}`,
    name: `${company.name} Jobs and Careers`,
    description: `Explore verified ${company.name} jobs, career opportunities, internships, hiring locations and remote roles.`,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Companies", item: `${siteConfig.url}/companies` },
      { "@type": "ListItem", position: 3, name: company.name, item: `${siteConfig.url}/companies/${company.slug}` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: company.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <main className="min-h-screen py-10 bg-background">
      <JsonLd data={organizationSchema} />
      <JsonLd data={webPageSchema} />
      <JsonLd data={breadcrumbSchema} />
      {company.faqs.length > 0 && <JsonLd data={faqSchema} />}

      <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-8">
        {/* Navigation Breadcrumb & Last Updated */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <Link
            href="/companies"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Company Directory
          </Link>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-primary" /> Last updated: July 2026
            </span>
            •
            <span className="font-medium">
              Ticker: <strong className="text-primary font-mono">{company.ticker} ({company.stockExchange})</strong>
            </span>
          </div>
        </div>

        {/* Hero Banner Card */}
        <div className="rounded-2xl border border-border/70 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.15),transparent_45%),linear-gradient(135deg,hsl(var(--card)),hsl(var(--secondary)/0.4))] p-6 sm:p-8 shadow-premium">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-border/80 bg-white p-2 shadow-xl grid place-items-center">
                <CompanyLogo company={company} size="lg" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Single H1 Tag per SEO instructions */}
                  <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                    {company.name} Jobs and Careers
                  </h1>
                  {company.verified && (
                    <BadgeCheck className="h-5 w-5 text-green-500 shrink-0" aria-label="Verified Employer" />
                  )}
                </div>
                <p className="mt-1 text-xs font-semibold text-primary">
                  {company.legalName} • {company.industry}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground max-w-2xl">
                  {company.tagline}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 sm:flex-row md:flex-col shrink-0">
              <a href={company.careersUrl} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="accent" className="w-full">
                  Official Careers Portal
                  <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                </Button>
              </a>
              <a href={company.website} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline" className="w-full">
                  Official Website
                  <Globe className="h-3.5 w-3.5 ml-1.5" />
                </Button>
              </a>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border/60 pt-6 text-xs sm:grid-cols-4">
            <div className="rounded-xl border border-border/60 bg-secondary/30 p-3.5">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Headquarters</span>
              <span className="font-bold text-foreground flex items-center gap-1 mt-1">
                <MapPin className="h-3.5 w-3.5 text-primary" /> {company.headquarters}
              </span>
            </div>
            <div className="rounded-xl border border-border/60 bg-secondary/30 p-3.5">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Global Workforce</span>
              <span className="font-bold text-foreground flex items-center gap-1 mt-1">
                <Users className="h-3.5 w-3.5 text-primary" /> {company.employeeCount}
              </span>
            </div>
            <div className="rounded-xl border border-border/60 bg-secondary/30 p-3.5">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Glassdoor Rating</span>
              <span className="font-bold text-amber-500 flex items-center gap-1 mt-1">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> {company.glassdoorRating} / 5.0 ({company.reviewCount} reviews)
              </span>
            </div>
            <div className="rounded-xl border border-border/60 bg-secondary/30 p-3.5">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Verified Openings</span>
              <span className="font-bold text-primary flex items-center gap-1 mt-1">
                <Briefcase className="h-3.5 w-3.5" /> {companyJobs.length > 0 ? `${companyJobs.length} Active Roles` : "Portal Active"}
              </span>
            </div>
          </div>
        </div>

        {/* Content Layout Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Section 1: About Company */}
            <Card className="p-6 border-border/70 bg-card space-y-4 shadow-sm">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" /> About {company.name}
              </h2>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {company.overview}
              </p>
              <div className="rounded-xl border border-border/60 bg-secondary/20 p-4 space-y-2 text-xs">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <HeartHandshake className="h-4 w-4 text-primary" /> Work Culture & Work Environment
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {company.name} fosters a high-impact, collaborative work culture focused on innovation, integrity, and career progression. Employees benefit from global talent mapping, structured performance scorecards, and continuous learning programs.
                </p>
              </div>
            </Card>

            {/* Section 2: Latest Jobs */}
            <div className="space-y-4">
              <h2 className="text-lg font-extrabold text-foreground flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" /> Latest jobs at {company.name}
              </h2>

              {companyJobs.length > 0 ? (
                <div className="space-y-3">
                  {companyJobs.map((job) => (
                    <Card key={job.id} className="p-5 border-border/70 bg-card space-y-3 hover:border-primary/40 transition-all">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <Link href={`/jobs/${getJobSlug(job)}`} className="hover:underline">
                            <h3 className="text-base font-bold text-foreground hover:text-primary transition-colors">
                              {job.title}
                            </h3>
                          </Link>
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
                <Card className="p-6 text-center border-border/60 bg-secondary/10 space-y-3">
                  <p className="text-xs text-muted-foreground font-medium">
                    There are currently no verified {company.name} jobs listed on WorkoraJobs. Explore similar companies and related opportunities below.
                  </p>
                  <div>
                    <a href={company.careersUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="text-xs">
                        View Direct Jobs on {company.name} Careers <ExternalLink className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </a>
                  </div>
                </Card>
              )}
            </div>

            {/* Section 3: Popular Job Categories */}
            <Card className="p-6 border-border/70 bg-card space-y-4 shadow-sm">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Code2 className="h-5 w-5 text-primary" /> Popular job categories at {company.name}
              </h2>
              <div className="flex flex-wrap gap-2 text-xs">
                <Link
                  href={`/jobs?search=${encodeURIComponent(company.name + " software engineering")}`}
                  className="rounded-lg border border-border/80 bg-secondary/40 px-3 py-1.5 font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors"
                >
                  Software engineering jobs at {company.name}
                </Link>
                <Link
                  href={`/jobs?search=${encodeURIComponent(company.name + " product manager")}`}
                  className="rounded-lg border border-border/80 bg-secondary/40 px-3 py-1.5 font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors"
                >
                  Product management jobs at {company.name}
                </Link>
                <Link
                  href={`/jobs?search=${encodeURIComponent(company.name + " data science")}`}
                  className="rounded-lg border border-border/80 bg-secondary/40 px-3 py-1.5 font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors"
                >
                  Data science & AI roles at {company.name}
                </Link>
              </div>
            </Card>

            {/* Section 4: Hiring Locations */}
            <Card className="p-6 border-border/70 bg-card space-y-4 shadow-sm">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" /> Hiring locations
              </h2>
              <p className="text-xs text-muted-foreground">
                {company.name} actively hires across major global tech hubs and regional operational centers:
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <Link
                  href={`/jobs?search=${encodeURIComponent(company.name + " India")}`}
                  className="rounded-lg border border-border/80 bg-secondary/40 px-3 py-1.5 font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors"
                >
                  {company.name} jobs in India
                </Link>
                <Link
                  href={`/jobs?search=${encodeURIComponent(company.name + " United States")}`}
                  className="rounded-lg border border-border/80 bg-secondary/40 px-3 py-1.5 font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors"
                >
                  {company.name} jobs in United States
                </Link>
                <Link
                  href={`/jobs?search=${encodeURIComponent(company.name + " Europe")}`}
                  className="rounded-lg border border-border/80 bg-secondary/40 px-3 py-1.5 font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors"
                >
                  {company.name} jobs in Europe
                </Link>
              </div>
            </Card>

            {/* Section 5: Remote Opportunities */}
            <Card className="p-6 border-border/70 bg-card space-y-4 shadow-sm">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" /> Remote opportunities
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {company.remoteFriendly
                  ? `${company.name} supports remote work flexibility and distributed hiring for eligible engineering, product, and enterprise functions.`
                  : `${company.name} operates primarily on-site and hybrid office models across its global headquarters and regional research centers.`}
              </p>
              <div>
                <Link
                  href={`/remote-jobs?search=${encodeURIComponent(company.name)}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  Explore remote jobs at {company.name} →
                </Link>
              </div>
            </Card>

            {/* Section 6: Internships and Graduate Roles */}
            <Card className="p-6 border-border/70 bg-card space-y-4 shadow-sm">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" /> Internships and graduate roles
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {company.name} offers structured summer internships, co-ops, and university graduate trainee programs across engineering, business operations, and research disciplines.
              </p>
              <div>
                <Link
                  href={`/internship-jobs?search=${encodeURIComponent(company.name)}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  Explore internship opportunities at {company.name} →
                </Link>
              </div>
            </Card>

            {/* Section 7: How to Apply */}
            <Card className="p-6 border-border/70 bg-card space-y-4 shadow-sm">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" /> How to apply for jobs at {company.name}
              </h2>
              <div className="space-y-3 text-xs text-muted-foreground">
                <div className="flex items-start gap-2">
                  <span className="rounded-full bg-primary/20 text-primary h-5 w-5 flex items-center justify-center text-[11px] font-bold shrink-0">1</span>
                  <p>Browse verified openings listed above or visit {company.name}'s official portal at <a href={company.careersUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">{company.careersUrl}</a>.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="rounded-full bg-primary/20 text-primary h-5 w-5 flex items-center justify-center text-[11px] font-bold shrink-0">2</span>
                  <p>Tailor your resume to match the required technical skills ({company.techStack.slice(0, 4).join(", ")}) and highlight relevant accomplishments.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="rounded-full bg-primary/20 text-primary h-5 w-5 flex items-center justify-center text-[11px] font-bold shrink-0">3</span>
                  <p>Submit your application directly online to receive automated status updates and recruiter follow-ups.</p>
                </div>
              </div>
            </Card>

            {/* Section 8: Frequently Asked Questions */}
            {company.faqs.length > 0 && (
              <Card className="p-6 border-border/70 bg-card space-y-4 shadow-sm">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" /> Frequently asked questions
                </h2>
                <div className="space-y-3">
                  {company.faqs.map((faq, idx) => (
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

            {/* Section 9: Similar Companies */}
            {similarCompanies.length > 0 && (
              <Card className="p-6 border-border/70 bg-card space-y-4 shadow-sm">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" /> Similar companies in {company.industry}
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {similarCompanies.map((sim) => (
                    <Link
                      key={sim.id}
                      href={`/companies/${sim.slug}`}
                      className="flex items-center justify-between rounded-xl border border-border/60 bg-secondary/20 p-3 hover:border-primary/40 hover:bg-secondary/40 transition-all group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-border/80 bg-white p-1 grid place-items-center">
                          <CompanyLogo company={sim} size="sm" />
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                            {sim.name}
                          </h3>
                          <p className="text-[10px] text-muted-foreground">{sim.headquarters}</p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tech Stack */}
            <Card className="p-6 border-border/70 bg-card space-y-4 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <Code2 className="h-4 w-4 text-primary" /> In-Demand Tech Stack
              </h3>
              <div className="flex flex-wrap gap-1.5 font-mono">
                {company.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg border border-border/80 bg-secondary/60 px-2.5 py-1 text-[11px] font-semibold text-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </Card>

            {/* Workplace Benefits */}
            <Card className="p-6 border-border/70 bg-card space-y-4 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" /> Verified Workplace Benefits
              </h3>
              <div className="space-y-2.5">
                {company.benefits.map((b, idx) => (
                  <div key={idx} className="rounded-xl border border-border/60 bg-secondary/20 p-3 text-xs space-y-1">
                    <span className="font-bold text-foreground block">{b.title}</span>
                    <span className="text-muted-foreground block text-[11px] leading-normal">{b.description}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
