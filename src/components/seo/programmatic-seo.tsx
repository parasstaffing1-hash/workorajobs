"use client";

import { AlertCircle, ArrowRight, Briefcase, DollarSign, HelpCircle, MapPin } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { type Job } from "@/data/jobs";

type SeoProps = {
  title: string;
  h1: string;
  description: string;
  contentMarkdown: string;
  jobs: Job[];
  salaryInsights: {
    median: string;
    low: string;
    high: string;
    currency: string;
  };
  requiredSkills: string[];
  similarJobs: Array<{ label: string; href: string }>;
  relatedSearches: Array<{ label: string; href: string }>;
  breadcrumbs: Array<{ label: string; href: string }>;
  faqs: Array<{ question: string; answer: string }>;
};

export function ProgrammaticSeo({
  h1,
  description,
  contentMarkdown,
  jobs,
  salaryInsights,
  requiredSkills,
  similarJobs,
  relatedSearches,
  breadcrumbs,
  faqs,
}: SeoProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(jobs.length / itemsPerPage);
  const currentJobs = jobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Generate breadcrumb schema
  const breadcrumbListSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((b, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: b.label,
      item: b.href.startsWith("http") ? b.href : `https://workorajobs.com${b.href}`,
    })),
  };

  // Generate FAQ schema
  const faqPageSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  // Generate JobPosting schemas
  const jobPostingSchemas = jobs.map((job) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description || `${job.title} role at ${job.company} in ${job.location}.`,
    datePosted: "2026-07-01",
    validThrough: "2026-12-31",
    employmentType: job.type === "Full-time" ? "FULL_TIME" : "PART_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
      sameAs: `https://workorajobs.com/company/${job.company.toLowerCase().replace(/\s+/g, "-")}-jobs`,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
        addressCountry: "US",
      },
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: {
        "@type": "QuantitativeValue",
        value: annualSalaryMidpoint(job.salary),
        unitText: "YEAR",
      },
    },
  }));

  function annualSalaryMidpoint(salary: string) {
    const matches = [...salary.matchAll(/\$(\d{2,3})(?:k)?/gi)].map((match) =>
      Number(match[1]),
    );
    if (!matches.length) return 90000;
    const midpoint = matches.reduce((total, value) => total + value, 0) / matches.length;
    return midpoint * 1000;
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 py-8">
      {/* Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />
      {jobPostingSchemas.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* BREADCRUMB UI */}
      <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
        {breadcrumbs.map((b, idx) => (
          <div key={b.href} className="flex items-center gap-1.5">
            <Link href={b.href} className="hover:text-primary transition-colors">
              {b.label}
            </Link>
            {idx < breadcrumbs.length - 1 && <ChevronRightIcon className="h-3 w-3" />}
          </div>
        ))}
      </nav>

      {/* HERO SECTION */}
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">{h1}</h1>
        <p className="text-base text-muted-foreground leading-6">{description}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* LEFT COLUMN: Live Jobs, Content, FAQs */}
        <div className="lg:col-span-8 space-y-8">
          {/* Live Filtered Jobs List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" /> Active Job Postings ({jobs.length})
              </h2>
              <span className="text-xs text-muted-foreground">Updated hourly</span>
            </div>

            {currentJobs.length > 0 ? (
              <div className="space-y-3">
                {currentJobs.map((job) => (
                  <Card key={job.id} className="p-5 border-border/70 bg-card hover:border-primary/50 transition-all flex flex-col justify-between md:flex-row md:items-center gap-4">
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-foreground">{job.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {job.location}
                        </span>
                        <span>•</span>
                        <span>{job.company}</span>
                        <span>•</span>
                        <span>{job.type}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
                      <span className="text-xs font-mono font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
                        {job.salary}
                      </span>
                      <Link href="/jobs" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                        Apply Now <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </Card>
                ))}

                {/* PAGINATION */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    >
                      Previous
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <Card className="p-8 text-center border-border/70 bg-secondary/10 space-y-2">
                <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto opacity-70" />
                <p className="text-xs text-muted-foreground font-semibold">No active jobs found for this exact criteria right now.</p>
                <p className="text-[11px] text-muted-foreground">Try broadening your target locations or keywords.</p>
              </Card>
            )}
          </div>

          {/* AI-Generated Sourcing Content Overview */}
          <Card className="p-6 border-border/70 bg-card space-y-4">
            <h2 className="text-base font-bold text-foreground">Market Overview & Career Guidance</h2>
            <div className="text-xs text-muted-foreground leading-6 space-y-3 whitespace-pre-line">
              {contentMarkdown}
            </div>
          </Card>

          {/* Dynamic FAQ Accordions */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4 text-accent" /> Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="rounded-xl border border-border/80 bg-secondary/20 p-4 space-y-1.5">
                  <h4 className="text-xs font-bold text-foreground">{faq.question}</h4>
                  <p className="text-xs text-muted-foreground leading-5">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Salary insights, Required skills, Related links */}
        <div className="lg:col-span-4 space-y-6">
          {/* Salary Insights */}
          <Card className="p-5 border-border/70 bg-card space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <DollarSign className="h-4 w-4 text-primary" /> Salary Insights
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground">Median Salary</span>
                <span className="font-bold text-primary">{salaryInsights.median} / yr</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground">Low Range</span>
                <span className="font-semibold text-foreground">{salaryInsights.low}</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground">High Range</span>
                <span className="font-semibold text-foreground">{salaryInsights.high}</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-4">
                Estimated based on similar roles posted on WorkoraJobs within this location tier.
              </p>
            </div>
          </Card>

          {/* Required Skills Badges */}
          <Card className="p-5 border-border/70 bg-card space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Required Stack Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {requiredSkills.map((skill) => (
                <Badge key={skill} className="bg-secondary text-primary border-border/80 text-[10px]">
                  {skill}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Similar Jobs */}
          <Card className="p-5 border-border/70 bg-card space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Explore Similar Job Roles</h3>
            <div className="space-y-2 text-xs">
              {similarJobs.map((link) => (
                <Link key={link.href} href={link.href} className="block text-primary hover:underline font-semibold leading-5">
                  {link.label}
                </Link>
              ))}
            </div>
          </Card>

          {/* Related Searches */}
          <Card className="p-5 border-border/70 bg-card space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Related Sourcing Keywords</h3>
            <div className="space-y-2 text-xs">
              {relatedSearches.map((link) => (
                <Link key={link.href} href={link.href} className="block text-muted-foreground hover:text-primary leading-5">
                  {link.label}
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
