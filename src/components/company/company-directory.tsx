"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Code2,
  Filter,
  RefreshCw,
  Search,
  Star,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

import { CompanyDetailDrawer } from "@/components/company/company-detail-drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { type Company } from "@/data/companies";
import { cn } from "@/lib/utils";

const industryOptions = [
  "All",
  "Cloud & Enterprise SaaS",
  "Fintech & Banking",
  "Global HR & Payroll",
  "HealthTech & Analytics",
  "E-Commerce & Retail SaaS",
  "AI & Recruiting Automation",
];

const sizeOptions = ["All", "50-100", "100-250", "250-500", "500-1,000", "1,000-5,000"];

const hqOptions = ["All", "Canada", "Singapore", "USA", "UK"];

export function CompanyDirectory({ className }: { className?: string }) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [selectedSize, setSelectedSize] = useState("All");
  const [selectedHq, setSelectedHq] = useState("All");

  // Drawer state
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Fetch companies API
  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (selectedIndustry !== "All") params.set("industry", selectedIndustry);
    if (selectedSize !== "All") params.set("size", selectedSize);
    if (selectedHq !== "All") params.set("headquarters", selectedHq);

    fetch(`/api/companies?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.companies) {
          setCompanies(data.companies);
        }
      })
      .catch(() => {
        // Fallback
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [search, selectedIndustry, selectedSize, selectedHq]);

  const resetFilters = () => {
    setSearch("");
    setSelectedIndustry("All");
    setSelectedSize("All");
    setSelectedHq("All");
  };

  const handleOpenCompany = (company: Company) => {
    setSelectedCompany(company);
    setIsDrawerOpen(true);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header Banner */}
      <div className="rounded-2xl border border-border/70 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.15),transparent_45%),linear-gradient(135deg,hsl(var(--card)),hsl(var(--secondary)/0.4))] p-6 sm:p-8 shadow-premium">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/20 text-primary">Employer Directory</Badge>
              <Badge className="text-xs bg-secondary/80 text-foreground border-border">
                Verified Hiring Companies
              </Badge>
            </div>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Browse Top Companies & Engineering Stacks.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Explore employer workplace culture, tech stacks, Glassdoor reviews, benefits, and open positions across industry leaders.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-primary/20 bg-primary/10 p-3 text-center">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Verified Organizations</span>
              <span className="text-xl font-extrabold text-primary">100% Audited</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Layout: Filter Sidebar & Company Cards */}
      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        {/* Advanced Filter Sidebar */}
        <Card className="p-5 space-y-5 h-fit sticky top-20 border-border/70 bg-card">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" /> Filter Directory
            </h3>
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" /> Reset
            </button>
          </div>

          {/* Search Input */}
          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block">
              Search Companies or Tech
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Name, React, AWS, Fintech..."
                className="pl-9 text-xs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Industry Filter */}
          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block">
              Industry Domain
            </label>
            <Select
              className="text-xs"
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
            >
              {industryOptions.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </Select>
          </div>

          {/* Company Size */}
          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block">
              Company Size
            </label>
            <Select
              className="text-xs"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              {sizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size === "All" ? "All Sizes" : `${size} employees`}
                </option>
              ))}
            </Select>
          </div>

          {/* Headquarters / Region */}
          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block">
              Headquarters Region
            </label>
            <Select
              className="text-xs"
              value={selectedHq}
              onChange={(e) => setSelectedHq(e.target.value)}
            >
              {hqOptions.map((hq) => (
                <option key={hq} value={hq}>
                  {hq === "All" ? "All Locations" : hq}
                </option>
              ))}
            </Select>
          </div>

          {/* Result Counter */}
          <div className="rounded-lg bg-secondary/40 p-3 text-center text-xs font-semibold text-muted-foreground border border-border/50">
            Showing <strong className="text-foreground">{companies.length}</strong> company profiles
          </div>
        </Card>

        {/* Company Cards Grid & Loading / Empty States */}
        <div className="space-y-4">
          {isLoading ? (
            /* Custom Shimmering Skeleton Loader Grid */
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-64 rounded-2xl border border-border/60 bg-secondary/20 animate-pulse p-6 space-y-4"
                >
                  <div className="flex gap-3">
                    <div className="h-12 w-12 rounded-xl bg-secondary/60" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-1/2 rounded bg-secondary/60" />
                      <div className="h-3 w-1/3 rounded bg-secondary/40" />
                    </div>
                  </div>
                  <div className="h-10 rounded bg-secondary/40" />
                  <div className="h-8 rounded bg-secondary/60" />
                </div>
              ))}
            </div>
          ) : companies.length > 0 ? (
            /* Company Cards Grid with Framer Motion Stagger */
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.08 },
                },
              }}
              className="grid gap-4 md:grid-cols-2"
            >
              {companies.map((company) => (
                <motion.div
                  key={company.id}
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  whileHover={{ y: -3, scale: 1.01 }}
                  transition={{ duration: 0.25 }}
                >
                  <Card
                    onClick={() => handleOpenCompany(company)}
                    className="group relative flex h-full cursor-pointer flex-col justify-between overflow-hidden border-border/70 bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-premium"
                  >
                    {/* TOP SECTION: Logo, Brand Name, Verified Badge, Industry */}
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {/* Company Initials Avatar */}
                          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-primary/20 bg-gradient-to-br from-primary/90 to-blue-600 text-base font-bold text-primary-foreground shadow-sm group-hover:scale-105 transition-transform">
                            {company.logo}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                                {company.name}
                              </h3>
                              {company.verified && (
                                <BadgeCheck className="h-4 w-4 text-green-500 shrink-0" />
                              )}
                            </div>
                            <p className="text-xs font-medium text-muted-foreground">
                              {company.headquarters}
                            </p>
                          </div>
                        </div>

                        <Badge className="text-[10px] text-primary border-primary/30 bg-primary/5">
                          {company.industry}
                        </Badge>
                      </div>

                      <p className="mt-3 text-xs leading-5 text-muted-foreground line-clamp-2">
                        {company.tagline}
                      </p>

                      {/* MIDDLE SECTION: JetBrains Mono / Code Badges Tech Stack & Company Size */}
                      <div className="mt-4 space-y-2 border-t border-border/50 pt-3">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Code2 className="h-3.5 w-3.5 text-accent shrink-0" />
                          <span className="text-[11px] font-semibold text-foreground">Tech Stack:</span>
                        </div>
                        <div className="flex flex-wrap gap-1 font-mono text-[11px]">
                          {company.techStack.slice(0, 5).map((tech) => (
                            <span
                              key={tech}
                              className="rounded bg-secondary/80 px-2 py-0.5 font-medium text-primary border border-border/60"
                            >
                              <code>{tech}</code>
                            </span>
                          ))}
                          {company.techStack.length > 5 && (
                            <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground font-mono">
                              +{company.techStack.length - 5}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                          <span className="flex items-center gap-1 text-[11px]">
                            <Users className="h-3 w-3 text-primary" /> {company.size}
                          </span>
                          <span className="flex items-center gap-1 text-[11px]">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {company.glassdoorRating} ({company.reviewCount})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* BOTTOM SECTION: Hiring Indicator & Explore Button */}
                    <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-3">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                        </span>
                        <span className="text-xs font-bold text-foreground">
                          {company.openJobsCount} Open Job{company.openJobsCount === 1 ? "" : "s"}
                        </span>
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs font-bold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                      >
                        Explore Profile
                        <ArrowRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* Empty State */
            <Card className="p-12 text-center space-y-4 border-border/70 bg-card">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto opacity-60" />
              <h3 className="text-base font-bold text-foreground">No Companies Match Filters</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                No company profiles found matching your current search and filter criteria. Try adjusting your search keywords.
              </p>
              <Button onClick={resetFilters} variant="outline" size="sm">
                <RefreshCw className="h-3.5 w-3.5" />
                Reset Filters
              </Button>
            </Card>
          )}
        </div>
      </div>

      {/* Dynamic Detail Drawer */}
      <CompanyDetailDrawer
        company={selectedCompany}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
