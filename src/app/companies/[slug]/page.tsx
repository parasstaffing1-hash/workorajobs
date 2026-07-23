import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
  ArrowRight
} from "lucide-react";

import { companiesData, type Company } from "@/data/companies";
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
  const cleanSlug = slug.toLowerCase().trim().replace("-jobs", "");
  const company = companiesData.find(
    (c) => c.slug === cleanSlug || c.id === cleanSlug || c.ticker.toLowerCase() === cleanSlug
  );

  if (!company) {
    return {
      title: "Company Profile Not Found | WorkoraJobs",
      description: "Explore top technology companies and enterprise hiring platforms on WorkoraJobs.",
    };
  }

  const title = `${company.name} (${company.ticker}) Careers, Tech Stack & Company Profile | WorkoraJobs`;
  const description = `${company.shortDescription} View Glassdoor rating (${company.glassdoorRating}/5.0), workplace benefits, tech stack, and open vacancies at ${company.name}.`;
  const canonicalUrl = `${siteConfig.url}/companies/${company.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${company.name} - ${company.tagline}`,
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
  const cleanSlug = slug.toLowerCase().trim().replace("-jobs", "");
  
  const company = companiesData.find(
    (c) => c.slug === cleanSlug || c.id === cleanSlug || c.ticker.toLowerCase() === cleanSlug
  );

  if (!company) {
    return (
      <main className="min-h-screen py-16 bg-background">
        <div className="mx-auto max-w-3xl px-4 text-center space-y-4">
          <Building2 className="h-16 w-16 text-muted-foreground mx-auto opacity-50" />
          <h1 className="text-2xl font-bold text-foreground">Company Profile Not Found</h1>
          <p className="text-sm text-muted-foreground">
            We couldn't find a matching corporate profile for "{slug}".
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

  // Filter open jobs for this company
  const companyJobs = jobs.filter(
    (j) =>
      j.company.toLowerCase().includes(company.name.toLowerCase()) ||
      company.name.toLowerCase().includes(j.company.toLowerCase()) ||
      j.company.toLowerCase().includes(company.slug)
  );

  // Related Companies (same industry or exchange)
  const relatedCompanies = companiesData
    .filter((c) => c.id !== company.id && (c.industry === company.industry || c.stockExchange === company.stockExchange))
    .slice(0, 3);

  // Structured Data (JSON-LD)
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
    mainEntity: company.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <main className="min-h-screen py-10 bg-background">
      <JsonLd data={organizationSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/companies"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Company Directory
          </Link>

          <span className="text-xs text-muted-foreground font-medium">
            Stock Ticker: <strong className="text-primary font-mono">{company.ticker} ({company.stockExchange})</strong>
          </span>
        </div>

        {/* Hero Banner Card */}
        <div className="rounded-2xl border border-border/70 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.15),transparent_45%),linear-gradient(135deg,hsl(var(--card)),hsl(var(--secondary)/0.4))] p-6 sm:p-8 shadow-premium">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-border/80 bg-white p-2 shadow-xl grid place-items-center">
                {company.logoUrl ? (
                  <img
                    src={company.logoUrl}
                    alt={`${company.name} logo`}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-gradient-to-br from-primary via-blue-600 to-[hsl(var(--violet))] text-xl font-extrabold text-primary-foreground">
                    {company.logo}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                    {company.name}
                  </h1>
                  <Badge className="bg-secondary text-primary font-mono text-xs font-bold border-border/80">
                    {company.ticker}
                  </Badge>
                  {company.verified && (
                    <Badge className="flex items-center gap-1 text-xs text-green-500 border-green-500/30 bg-green-500/10">
                      <BadgeCheck className="h-3.5 w-3.5" /> Verified Enterprise
                    </Badge>
                  )}
                </div>
                <p className="text-xs font-semibold text-primary mt-1">{company.industry} • {company.subIndustry}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground max-w-2xl">
                  {company.tagline}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a href={company.careersUrl} target="_blank" rel="noreferrer">
                <Button variant="accent" size="sm" className="w-full sm:w-auto">
                  <Briefcase className="h-4 w-4 mr-1.5" />
                  Careers Portal
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </a>
              <a href={company.website} target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  <Globe className="h-4 w-4 mr-1.5" />
                  Website
                </Button>
              </a>
            </div>
          </div>

          {/* Core Metrics Grid */}
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border/60 pt-6 text-xs sm:grid-cols-4">
            <div className="rounded-xl border border-border/60 bg-secondary/30 p-3.5">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Headquarters</span>
              <span className="font-semibold text-foreground flex items-center gap-1 mt-1">
                <MapPin className="h-3.5 w-3.5 text-primary" /> {company.headquarters}
              </span>
            </div>
            <div className="rounded-xl border border-border/60 bg-secondary/30 p-3.5">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Workforce Size</span>
              <span className="font-semibold text-foreground flex items-center gap-1 mt-1">
                <Users className="h-3.5 w-3.5 text-primary" /> {company.employeeCount}
              </span>
            </div>
            <div className="rounded-xl border border-border/60 bg-secondary/30 p-3.5">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Glassdoor Rating</span>
              <span className="font-semibold text-foreground flex items-center gap-1 mt-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {company.glassdoorRating} ({company.reviewCount.toLocaleString()} reviews)
              </span>
            </div>
            <div className="rounded-xl border border-border/60 bg-secondary/30 p-3.5">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Market Cap</span>
              <span className="font-semibold text-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3.5 w-3.5 text-green-500" /> {company.marketCap} ({company.stockExchange})
              </span>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">



            {/* OPEN JOBS SECTION */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-foreground flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" /> Active Job Vacancies at {company.name}
                  <Badge className="bg-primary/20 text-primary">{companyJobs.length || company.openJobsCount}</Badge>
                </h2>
                <Link href={`/candidate/jobs?search=${encodeURIComponent(company.name)}`}>
                  <Button variant="outline" size="sm" className="text-xs">
                    Search All Roles
                  </Button>
                </Link>
              </div>

              {companyJobs.length > 0 ? (
                <div className="space-y-4">
                  {companyJobs.map((job) => (
                    <Card
                      key={job.id}
                      className="p-5 border-border/70 bg-card transition-all hover:border-primary/50 hover:shadow-md space-y-3"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-base font-bold text-foreground hover:text-primary transition-colors">
                            {job.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2 flex-wrap">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-primary" /> {job.location}
                            </span>
                            •
                            <span className="text-primary font-bold">{job.salary}</span>
                            •
                            <Badge className="text-[10px] bg-secondary text-foreground">{job.workMode}</Badge>
                          </p>
                        </div>

                        <Link href={`/jobs/${getJobSlug(job)}`}>
                          <Button size="sm" variant="accent" className="text-xs shrink-0">
                            Apply Now
                            <ArrowRight className="h-3.5 w-3.5 ml-1" />
                          </Button>
                        </Link>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {job.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded bg-secondary/80 px-2 py-0.5 text-[10px] font-medium text-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-6 text-center border-border/60 bg-secondary/10 space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Currently accepting direct candidate talent applications for open roles at {company.name}.
                  </p>
                  <a href={company.careersUrl} target="_blank" rel="noreferrer" className="inline-block">
                    <Button variant="accent" size="sm" className="text-xs mt-2">
                      Visit Official {company.name} Careers Portal →
                    </Button>
                  </a>
                </Card>
              )}
            </div>

            {/* Corporate Overview & Mission */}
            <Card className="p-6 border-border/70 bg-card space-y-4 shadow-sm">
              <h2 className="text-base font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" /> Corporate Overview & Culture
              </h2>
              <p className="text-xs leading-6 text-muted-foreground">
                {company.overview}
              </p>

              <div className="grid gap-3 sm:grid-cols-2 pt-2">
                <div className="rounded-xl border border-border/60 bg-secondary/20 p-4 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-primary">Company Mission</span>
                  <p className="text-xs leading-5 text-foreground">{company.mission}</p>
                </div>
                <div className="rounded-xl border border-border/60 bg-secondary/20 p-4 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-accent">Company Vision</span>
                  <p className="text-xs leading-5 text-foreground">{company.vision}</p>
                </div>
              </div>
            </Card>

            {/* Tech Stack */}
            <Card className="p-6 border-border/70 bg-card space-y-4 shadow-sm">
              <h2 className="text-base font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <Code2 className="h-4 w-4 text-accent" /> Engineering Tech Stack & Tools
              </h2>
              <p className="text-xs text-muted-foreground">
                Technologies, cloud platforms, and developer frameworks actively utilized by engineering teams at {company.name}.
              </p>
              <div className="flex flex-wrap gap-2 font-mono">
                {company.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg border border-border/80 bg-secondary/60 px-3.5 py-1.5 text-xs font-semibold text-primary shadow-sm hover:border-primary/40 transition-colors"
                  >
                    <code>{tech}</code>
                  </span>
                ))}
              </div>
            </Card>

            {/* Workplace Benefits */}
            <Card className="p-6 border-border/70 bg-card space-y-4 shadow-sm">
              <h2 className="text-base font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <HeartHandshake className="h-4 w-4 text-primary" /> Workplace Perks & Compensation Benefits
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {company.benefits.map((b, idx) => (
                  <div key={idx} className="rounded-xl border border-border/60 bg-secondary/20 p-4 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-[10px] font-bold text-accent uppercase">{b.category}</span>
                    </div>
                    <h3 className="text-xs font-bold text-foreground">{b.title}</h3>
                    <p className="text-[11px] leading-4 text-muted-foreground">{b.description}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Glassdoor Reviews */}
            {company.reviews.length > 0 && (
              <Card className="p-6 border-border/70 bg-card space-y-4 shadow-sm">
                <h2 className="text-base font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" /> Glassdoor Employee Reviews
                </h2>
                <div className="space-y-3">
                  {company.reviews.map((r) => (
                    <div key={r.id} className="rounded-xl border border-border/60 bg-secondary/20 p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-foreground">{r.role}</span>
                          <span className="text-[10px] text-muted-foreground block">{r.employmentStatus} • {r.date}</span>
                        </div>
                        <Badge className="bg-amber-400/10 text-amber-500 border-amber-400/30">
                          ★ {r.rating}.0
                        </Badge>
                      </div>
                      <div className="text-xs space-y-1 pt-2 border-t border-border/50">
                        <p className="text-green-500 font-medium">
                          <strong className="text-foreground">Pros:</strong> {r.pros}
                        </p>
                        <p className="text-muted-foreground">
                          <strong className="text-foreground">Cons:</strong> {r.cons}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Company FAQs */}
            {company.faqs.length > 0 && (
              <Card className="p-6 border-border/70 bg-card space-y-4 shadow-sm">
                <h2 className="text-base font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-primary" /> Frequently Asked Questions
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
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Quick Links Card */}
            <Card className="p-6 border-border/70 bg-card space-y-4 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Corporate Data & Links
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">Stock Ticker</span>
                  <span className="font-bold text-primary font-mono">{company.ticker}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">Exchange</span>
                  <span className="font-semibold text-foreground">{company.stockExchange}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">ISIN</span>
                  <span className="font-mono text-[11px] text-foreground">{company.isin || "N/A"}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">Country</span>
                  <span className="font-semibold text-foreground">{company.country}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">Founded</span>
                  <span className="font-semibold text-foreground">{company.foundedYear}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-muted-foreground">Hiring Status</span>
                  <span className="font-bold text-green-500">{company.hiringStatus}</span>
                </div>
              </div>

              <div className="pt-2">
                <a href={company.careersUrl} target="_blank" rel="noreferrer" className="block w-full">
                  <Button variant="accent" size="sm" className="w-full text-xs">
                    Search Open Careers
                    <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                  </Button>
                </a>
              </div>
            </Card>

            {/* Related Employers */}
            {relatedCompanies.length > 0 && (
              <Card className="p-6 border-border/70 bg-card space-y-4 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Similar {company.industry} Companies
                </h3>
                <div className="space-y-3">
                  {relatedCompanies.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/companies/${rel.slug}`}
                      className="flex items-center justify-between rounded-xl border border-border/60 bg-secondary/20 p-3 hover:border-primary/40 hover:bg-secondary/40 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-border/80 bg-white p-1 grid place-items-center">
                          {rel.logoUrl ? (
                            <img src={rel.logoUrl} alt={`${rel.name} logo`} className="h-full w-full object-contain" />
                          ) : (
                            <span className="text-xs font-bold text-primary">{rel.logo}</span>
                          )}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                            {rel.name}
                          </h4>
                          <span className="text-[10px] text-muted-foreground font-mono">{rel.ticker} • {rel.stockExchange}</span>
                        </div>
                      </div>
                      <ArrowLeft className="h-3.5 w-3.5 rotate-180 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
