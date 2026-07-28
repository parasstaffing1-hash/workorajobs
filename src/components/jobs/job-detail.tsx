"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Flag,
  Globe2,
  GraduationCap,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Job, jobs, getJobSlug, slugify } from "@/data/jobs";
import { siteConfig } from "@/lib/site";

type JobDetailProps = {
  job: Job;
};

export function JobDetail({ job }: JobDetailProps) {
  const [reported, setReported] = useState(false);
  const [applied, setApplied] = useState(false);

  const jobSlug = getJobSlug(job);
  const canonicalUrl = `${siteConfig.url}/jobs/${jobSlug}`;
  const isExpired = Boolean(job.isClosed);
  const datePosted = job.datePostedIso || "2026-07-01T00:00:00Z";
  const validThrough = job.validThroughIso || "2026-12-31T23:59:59Z";
  const salaryRange = parseSalaryRange(job.salary);

  // Filter 3 related active jobs
  const relatedJobs = jobs
    .filter((j) => j.id !== job.id && !j.isClosed)
    .slice(0, 3);
  const relatedCompanies = Array.from(
    new Set(
      jobs
        .filter((j) => j.id !== job.id && j.company !== job.company && !j.isClosed)
        .map((j) => j.company)
    )
  ).slice(0, 4);

  // JobPosting JSON-LD Schema
  const jobPostingSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: [
      job.description,
      job.responsibilities?.length ? `Responsibilities: ${job.responsibilities.join("; ")}` : "",
      job.requiredSkills?.length ? `Required skills: ${job.requiredSkills.join(", ")}` : "",
    ].filter(Boolean).join("\n\n"),
    url: canonicalUrl,
    identifier: {
      "@type": "PropertyValue",
      name: "WorkoraJobs",
      value: job.id,
    },
    datePosted,
    validThrough,
    employmentType: mapEmploymentType(job.type),
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
      sameAs: `${siteConfig.url}/companies/${slugify(job.company)}`,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
        addressCountry: job.location.includes("Remote") ? "Global" : "US",
      },
    },
    jobLocationType: job.workMode === "Remote" ? "TELECOMMUTE" : undefined,
    applicantLocationRequirements: job.workMode === "Remote"
      ? { "@type": "Country", name: "Worldwide" }
      : undefined,
    baseSalary: salaryRange
      ? {
          "@type": "MonetaryAmount",
          currency: "USD",
          value: {
            "@type": "QuantitativeValue",
            ...(salaryRange.min !== salaryRange.max
              ? { minValue: salaryRange.min, maxValue: salaryRange.max }
              : { value: salaryRange.min }),
            unitText: "YEAR",
          },
        }
      : undefined,
    occupationalCategory: job.department,
    qualifications: job.education,
    responsibilities: job.responsibilities?.join("; "),
    skills: job.requiredSkills.join(", "),
    directApply: true,
  };

  // Breadcrumbs JSON-LD Schema
  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${siteConfig.url}/`,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Jobs",
        "item": `${siteConfig.url}/jobs`,
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": job.title,
        "item": canonicalUrl,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: buildJobFaqs(job).map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <main className="min-h-screen pt-28 pb-20 bg-background text-foreground">
      {/* Inject Schemas only if job is active */}
      {!isExpired && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      {!isExpired && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <Container>
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/jobs" className="hover:text-foreground transition-colors">
            Jobs
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate max-w-xs">{job.title}</span>
        </nav>

        {/* Expired Job Alert Banner */}
        {isExpired && (
          <div className="mb-8 p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 flex-shrink-0 text-amber-500" />
              <div>
                <h2 className="font-semibold text-sm sm:text-base">Position Closed</h2>
                <p className="text-xs sm:text-sm text-amber-600/90 dark:text-amber-400/90">
                  This position is no longer accepting applications. Explore related active opportunities below.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Job Header Container */}
        <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border/80 shadow-sm mb-10 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-500 flex items-center justify-center font-bold text-xl flex-shrink-0">
                {job.company.charAt(0)}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge className="text-blue-500 border-blue-500/30">
                    {job.type}
                  </Badge>
                  <Badge>{job.workMode}</Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Verified Listing
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
                  {job.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground">
                  <Link
                    href={`/companies/${slugify(job.company)}`}
                    className="flex items-center gap-1.5 hover:text-blue-500 font-medium transition-colors"
                  >
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    {job.company}
                  </Link>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    {job.salary}
                  </span>
                </div>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                variant={isExpired ? "secondary" : "primary"}
                disabled={isExpired || applied}
                onClick={() => setApplied(true)}
                className="h-11 px-8 rounded-xl font-medium"
              >
                {isExpired ? "Position Closed" : applied ? "Application Submitted" : "Apply Now"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setReported(true)}
                disabled={reported}
                className="h-11 px-4 rounded-xl text-muted-foreground hover:text-destructive"
              >
                <Flag className="w-4 h-4 mr-1.5" />
                {reported ? "Reported" : "Report Job"}
              </Button>
            </div>
          </div>
        </div>

        {/* Grid Layout: Job Content & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Job Description Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <section className="p-6 rounded-2xl bg-card border border-border/60">
              <h2 className="text-lg font-bold mb-4">Job Overview</h2>
              <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </section>

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <section className="p-6 rounded-2xl bg-card border border-border/60">
                <h2 className="text-lg font-bold mb-4">Key Responsibilities</h2>
                <ul className="space-y-3">
                  {job.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Required & Preferred Skills */}
            <section className="p-6 rounded-2xl bg-card border border-border/60">
              <h2 className="text-lg font-bold mb-4">Required Skills & Capabilities</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {job.requiredSkills.map((skill) => (
                  <Badge key={skill} className="px-3 py-1 text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>

              {job.preferredSkills && job.preferredSkills.length > 0 && (
                <>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">Preferred Qualifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.preferredSkills.map((skill) => (
                      <Badge key={skill} className="px-3 py-1 text-xs opacity-80">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </>
              )}
            </section>

            {/* FAQ */}
            <section className="p-6 rounded-2xl bg-card border border-border/60">
              <h2 className="text-lg font-bold mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {buildJobFaqs(job).map((faq) => (
                  <div key={faq.question} className="space-y-1">
                    <h3 className="text-sm font-semibold text-foreground">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Specs & Metadata */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-card border border-border/60 space-y-4">
              <h3 className="font-bold text-base border-b border-border/50 pb-3">
                Job Specifications
              </h3>

              <div className="space-y-3.5 text-xs sm:text-sm">
                <div className="flex justify-between items-center text-muted-foreground">
                  <span className="flex items-center gap-2"><Briefcase className="w-4 h-4" /> Department</span>
                  <span className="font-medium text-foreground">{job.department}</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span className="flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Experience</span>
                  <span className="font-medium text-foreground truncate max-w-[150px]">{job.experience}</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Date Posted</span>
                  <span className="font-medium text-foreground">{job.posted}</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Reference ID</span>
                  <span className="font-mono text-xs font-semibold text-foreground">{job.id}</span>
                </div>
              </div>
            </div>

            {/* Verification Status Card */}
            <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs leading-relaxed flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block mb-0.5">Verified Listing</span>
                This position was audited and verified on July 22, 2026. Official cross-border employment contract standards apply.
              </div>
            </div>
          </div>
        </div>

        {/* Related Active Jobs Section */}
        {relatedJobs.length > 0 && (
          <section className="mt-16 pt-10 border-t border-border/60">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                Related Active Opportunities
              </h2>
              <Link href="/jobs" className="text-xs sm:text-sm font-semibold text-blue-500 hover:underline">
                View All Jobs →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedJobs.map((rJob) => (
                <Link
                  key={rJob.id}
                  href={`/jobs/${getJobSlug(rJob)}`}
                  className="p-6 rounded-2xl bg-card border border-border/60 hover:border-blue-500/40 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <Badge className="mb-3 text-xs">
                      {rJob.type}
                    </Badge>
                    <h3 className="font-bold text-base group-hover:text-blue-500 transition-colors mb-2 line-clamp-1">
                      {rJob.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-4">{rJob.company} • {rJob.location}</p>
                  </div>
                  <div className="text-xs font-semibold text-emerald-500">
                    {rJob.salary}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
        {relatedCompanies.length > 0 && (
          <section className="mt-10 pt-10 border-t border-border/60">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
              Related Companies Hiring Similar Talent
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedCompanies.map((company) => (
                <Link
                  key={company}
                  href={`/companies/${slugify(company)}`}
                  className="rounded-2xl bg-card border border-border/60 p-4 text-sm font-semibold hover:border-blue-500/40 hover:text-blue-500 transition-colors"
                >
                  {company}
                </Link>
              ))}
            </div>
          </section>
        )}
      </Container>
    </main>
  );
}

function mapEmploymentType(type: Job["type"]): string {
  if (type === "Contract") return "CONTRACTOR";
  if (type === "Internship") return "INTERN";
  return "FULL_TIME";
}

function parseSalaryRange(salary: string): { min: number; max: number } | null {
  const matches = [...salary.matchAll(/(?:\$|USD\s*)?(\d{2,3}(?:,\d{3})+|\d{2,3})\s*k?/gi)].map((match) => {
    const value = Number(match[1].replace(/,/g, ""));
    const usesThousandsSuffix = /k/i.test(match[0]);
    return usesThousandsSuffix && value < 1000 ? value * 1000 : value;
  });

  if (!matches.length) return null;
  return {
    min: Math.min(...matches),
    max: Math.max(...matches),
  };
}

function buildJobFaqs(job: Job): Array<{ question: string; answer: string }> {
  return [
    {
      question: `What skills are required for the ${job.title} role?`,
      answer: `The main required skills for this role are ${job.requiredSkills.join(", ")}.`,
    },
    {
      question: `Is the ${job.title} role remote or on-site?`,
      answer: `This listing is marked as ${job.workMode} and is based in ${job.location}.`,
    },
    {
      question: `When does this ${job.company} job expire?`,
      answer: `The listed application validity date is ${job.validThroughIso || "not specified by the employer"}.`,
    },
  ];
}
