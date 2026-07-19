"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Code2,
  ExternalLink,
  Globe,
  HeartHandshake,
  MapPin,
  MessageSquare,
  Star,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Company } from "@/data/companies";
import { type Job } from "@/data/jobs";

type CompanyDetailDrawerProps = {
  company: Company | null;
  isOpen: boolean;
  onClose: () => void;
};

export function CompanyDetailDrawer({
  company,
  isOpen,
  onClose,
}: CompanyDetailDrawerProps) {
  const [companyJobs, setCompanyJobs] = useState<Job[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "benefits" | "reviews" | "jobs">("overview");

  // Fetch company jobs when company changes
  useEffect(() => {
    if (!company) return;

    setIsLoadingJobs(true);
    fetch(`/api/jobs?company=${encodeURIComponent(company.name)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.jobs) {
          setCompanyJobs(data.jobs);
        }
      })
      .catch(() => {
        // Fallback
      })
      .finally(() => {
        setIsLoadingJobs(false);
      });
  }, [company]);

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!company) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-md"
          />

          {/* Lateral Drawer Content */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative z-10 flex h-full w-full max-w-2xl flex-col border-l border-border/70 bg-card shadow-2xl"
          >
            {/* Header Toolbar */}
            <div className="flex items-center justify-between border-b border-border/70 bg-secondary/30 px-6 py-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary/20 text-primary">Company Profile</Badge>
                {company.verified && (
                  <Badge className="flex items-center gap-1 text-xs text-green-500 border-green-500/30 bg-green-500/10">
                    <BadgeCheck className="h-3.5 w-3.5" /> Verified Employer
                  </Badge>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Close details"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Brand Banner Header */}
              <div className="rounded-xl border border-border/70 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.15),transparent_45%),linear-gradient(135deg,hsl(var(--card)),hsl(var(--secondary)/0.4))] p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  {/* Avatar Initials Badge */}
                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl border border-primary/30 bg-gradient-to-br from-primary via-blue-600 to-[hsl(var(--violet))] text-xl font-bold text-primary-foreground shadow-lg">
                    {company.logo}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold tracking-tight text-foreground">
                        {company.name}
                      </h2>
                    </div>
                    <p className="mt-1 text-xs font-semibold text-primary">{company.industry}</p>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">{company.tagline}</p>
                  </div>
                </div>

                {/* Meta Details Pills */}
                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border/60 pt-4 text-xs sm:grid-cols-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">Headquarters</span>
                    <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-primary" /> {company.headquarters}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">Company Size</span>
                    <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                      <Users className="h-3 w-3 text-primary" /> {company.size}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">Glassdoor Rating</span>
                    <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {company.glassdoorRating} ({company.reviewCount})
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">Founded</span>
                    <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                      <Calendar className="h-3 w-3 text-primary" /> {company.foundedYear}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    Visit Official Website
                    <ExternalLink className="h-3 w-3" />
                  </a>

                  <Link href={`/candidate/jobs?search=${encodeURIComponent(company.name)}`}>
                    <Button size="sm" variant="accent" className="text-xs">
                      <Briefcase className="h-3.5 w-3.5" />
                      View {company.openJobsCount} Open Jobs
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-1.5 border-b border-border/70 pb-2">
                {(
                  [
                    { id: "overview", label: "Overview & Tech Stack", icon: Building2 },
                    { id: "benefits", label: `Benefits (${company.benefits.length})`, icon: HeartHandshake },
                    { id: "reviews", label: `Reviews (${company.reviews.length})`, icon: MessageSquare },
                    { id: "jobs", label: `Open Jobs (${companyJobs.length || company.openJobsCount})`, icon: Briefcase },
                  ] as const
                ).map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                        active
                          ? "bg-primary/10 text-primary shadow-sm"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* TAB 1: OVERVIEW & TECH STACK */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="rounded-xl border border-border/70 bg-card p-5">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                      About {company.name}
                    </h3>
                    <p className="mt-3 text-xs leading-6 text-muted-foreground">
                      {company.overview}
                    </p>
                  </div>

                  {/* Tech Stack Code Badges in JetBrains Mono / Monospace */}
                  <div className="rounded-xl border border-border/70 bg-card p-5">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                      <Code2 className="h-4 w-4 text-accent" /> Engineering Tech Stack
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Core frameworks, infrastructure, and design tools powering products at {company.name}.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 font-mono text-xs">
                      {company.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md border border-border/80 bg-secondary/60 px-3 py-1.5 text-xs font-semibold text-primary shadow-sm hover:border-primary/40 transition-colors"
                        >
                          <code>{tech}</code>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: WORKPLACE BENEFITS */}
              {activeTab === "benefits" && (
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground">
                    Verified workplace perks, compensation structure, and health benefits offered by {company.name}.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {company.benefits.map((benefit, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-border/70 bg-secondary/15 p-4 space-y-1.5"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                          <span className="text-[10px] uppercase font-bold text-accent">
                            {benefit.category}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-foreground">{benefit.title}</h4>
                        <p className="text-[11px] leading-4 text-muted-foreground">
                          {benefit.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: GLASSDOOR REVIEWS */}
              {activeTab === "reviews" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
                    <div>
                      <span className="text-2xl font-bold text-foreground">{company.glassdoorRating}</span>
                      <span className="text-xs text-muted-foreground"> out of 5.0 rating</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {company.reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="rounded-xl border border-border/70 bg-card p-4 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-foreground">{rev.role}</span>
                            <span className="text-[10px] text-muted-foreground block">{rev.employmentStatus} • {rev.date}</span>
                          </div>
                          <span className="text-xs font-extrabold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                            ★ {rev.rating}.0
                          </span>
                        </div>
                        <div className="text-xs space-y-1 pt-1 border-t border-border/50">
                          <p className="text-green-500 font-medium">
                            <span className="font-bold text-foreground">Pros:</span> {rev.pros}
                          </p>
                          <p className="text-muted-foreground">
                            <span className="font-bold text-foreground">Cons:</span> {rev.cons}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: OPEN HIRING OPPORTUNITIES */}
              {activeTab === "jobs" && (
                <div className="space-y-4">
                  {isLoadingJobs ? (
                    <div className="space-y-3">
                      {[1, 2].map((i) => (
                        <div key={i} className="h-24 rounded-xl border border-border/60 bg-secondary/30 animate-pulse" />
                      ))}
                    </div>
                  ) : companyJobs.length > 0 ? (
                    <div className="space-y-3">
                      {companyJobs.map((job) => (
                        <div
                          key={job.id}
                          className="rounded-xl border border-border/70 bg-card p-4 transition-all hover:border-primary/40 hover:bg-secondary/15"
                        >
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <h4 className="text-sm font-bold text-foreground">{job.title}</h4>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {job.location} • <span className="text-primary font-semibold">{job.salary}</span>
                              </p>
                            </div>
                            <Link href={`/candidate/jobs?search=${encodeURIComponent(job.title)}`}>
                              <Button size="sm" variant="accent" className="text-xs shrink-0">
                                Apply Role
                                <ArrowRight className="h-3.5 w-3.5" />
                              </Button>
                            </Link>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-1.5">
                            <Badge className="text-[10px]">{job.type}</Badge>
                            <Badge className="text-[10px]">{job.workMode}</Badge>
                            {job.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="rounded bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 rounded-xl border border-border/60 bg-secondary/10">
                      <p className="text-xs text-muted-foreground">No open roles currently listed for this company.</p>
                      <Link href="/candidate/jobs" className="mt-2 inline-block text-xs font-bold text-primary hover:underline">
                        Explore all job vacancies →
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
