"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  ChevronLeft,
  ChevronRight,
  Code2,
  Filter,
  Globe,
  MapPin,
  RefreshCw,
  Search,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { CompanyDetailDrawer } from "@/components/company/company-detail-drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { companiesData, type Company } from "@/data/companies";
import { cn } from "@/lib/utils";

const alphabet = [
  "All",
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
  "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
];

const exchangeOptions = ["All", "NSE", "BSE", "NASDAQ", "NYSE"];

const countryOptions = ["All", "India", "United States"];

const industryOptions = [
  "All",
  "Information Technology",
  "Banking & Finance",
  "Energy & Oil",
  "Automotive & Transport",
  "Healthcare & Pharmaceuticals",
  "FMCG & Consumer Goods",
  "E-Commerce & Cloud",
  "Telecommunications",
  "Infrastructure & Engineering",
];

const sizeOptions = ["All", "5,000-10,000", "10,000+"];

export function CompanyDirectory({ className }: { className?: string }) {
  const [companies, setCompanies] = useState<Company[]>(companiesData);
  const [search, setSearch] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [selectedExchange, setSelectedExchange] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedSize, setSelectedSize] = useState("All");
  const [selectedLetter, setSelectedLetter] = useState("All");
  const [sortOrder, setSortOrder] = useState<"name_asc" | "rating_desc" | "employees_desc">("name_asc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 24;


  // Drawer state
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Filter & Sort companies instantly
  useEffect(() => {
    let result = [...companiesData];

    // Search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.ticker.toLowerCase().includes(q) ||
          c.industry.toLowerCase().includes(q) ||
          c.subIndustry.toLowerCase().includes(q) ||
          c.tagline.toLowerCase().includes(q) ||
          c.techStack.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Industry
    if (selectedIndustry !== "All") {
      result = result.filter((c) =>
        c.industry.toLowerCase().includes(selectedIndustry.toLowerCase())
      );
    }

    // Stock Exchange
    if (selectedExchange !== "All") {
      result = result.filter(
        (c) => c.stockExchange.toUpperCase() === selectedExchange.toUpperCase()
      );
    }

    // Country
    if (selectedCountry !== "All") {
      result = result.filter((c) =>
        c.country.toLowerCase().includes(selectedCountry.toLowerCase())
      );
    }

    // Size
    if (selectedSize !== "All") {
      result = result.filter((c) => c.size.includes(selectedSize));
    }

    // Letter
    if (selectedLetter !== "All") {
      result = result.filter((c) =>
        c.name.trim().toUpperCase().startsWith(selectedLetter)
      );
    }

    // Sort
    if (sortOrder === "rating_desc") {
      result.sort((a, b) => b.glassdoorRating - a.glassdoorRating);
    } else if (sortOrder === "employees_desc") {
      result.sort((a, b) => {
        const getNum = (str: string) => parseInt(str.replace(/[^0-9]/g, "") || "0", 10);
        return getNum(b.employeeCount) - getNum(a.employeeCount);
      });
    } else {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    setCompanies(result);
    setCurrentPage(1); // Reset to page 1 on filter change
  }, [search, selectedIndustry, selectedExchange, selectedCountry, selectedSize, selectedLetter, sortOrder]);

  const resetFilters = () => {
    setSearch("");
    setSelectedIndustry("All");
    setSelectedExchange("All");
    setSelectedCountry("All");
    setSelectedSize("All");
    setSelectedLetter("All");
    setSortOrder("name_asc");
    setCurrentPage(1);
  };

  const handleOpenCompany = (company: Company) => {
    setSelectedCompany(company);
    setIsDrawerOpen(true);
  };

  // Pagination calculations
  const totalPages = Math.ceil(companies.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedCompanies = companies.slice(startIndex, startIndex + pageSize);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Banner Header */}
      <div className="rounded-2xl border border-border/70 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.15),transparent_45%),linear-gradient(135deg,hsl(var(--card)),hsl(var(--secondary)/0.4))] p-6 sm:p-8 shadow-premium">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-primary/20 text-primary border-primary/30 font-semibold">
                Company Directory
              </Badge>

              <Badge className="bg-accent/15 text-accent border-accent/30 font-semibold">
                {companiesData.length} Verified Global Blue-Chips
              </Badge>
            </div>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Enterprise Employers & Stock Exchange Leaders
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-3xl">
              Inspect corporate profiles, tech stack architectures, Glassdoor ratings, workplace benefits, stock tickers, and open career opportunities for top companies in India and the US.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="text-xs font-semibold"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Reset Filters
            </Button>
          </div>
        </div>

        {/* A-Z Alphabet Filter Navigation Bar */}
        <div className="mt-6 border-t border-border/60 pt-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
            A-Z Alphabet Filter
          </span>
          <div className="flex flex-wrap gap-1">
            {alphabet.map((letter) => {
              const active = selectedLetter === letter;
              return (
                <button
                  key={letter}
                  type="button"
                  onClick={() => setSelectedLetter(letter)}
                  className={`h-7 w-7 rounded-md text-xs font-bold transition-all ${
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter Controls Toolbar */}
      <div className="grid gap-4 rounded-xl border border-border/70 bg-card p-4 sm:p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
        {/* Search Bar */}
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search company, ticker (e.g. AAPL, MSFT, RELIANCE)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        {/* Stock Exchange Filter */}
        <div>
          <Select
            value={selectedExchange}
            onChange={(e) => setSelectedExchange(e.target.value)}
            className="text-xs"
          >
            <option value="All">All Exchanges (NSE, NASDAQ...)</option>
            {exchangeOptions.slice(1).map((ex) => (
              <option key={ex} value={ex}>
                {ex} Exchange
              </option>
            ))}
          </Select>
        </div>

        {/* Country Filter */}
        <div>
          <Select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="text-xs"
          >
            <option value="All">All Countries</option>
            {countryOptions.slice(1).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>

        {/* Sorting Dropdown */}
        <div>
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="text-xs font-medium"
          >
            <option value="name_asc">Alphabetical (A-Z)</option>
            <option value="rating_desc">Highest Glassdoor Rating</option>
            <option value="employees_desc">Largest Workforce</option>
          </Select>
        </div>
      </div>

      {/* Secondary Industry & Size Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          <span className="font-bold text-muted-foreground shrink-0">Industry:</span>
          {industryOptions.map((ind) => {
            const active = selectedIndustry === ind;
            return (
              <button
                key={ind}
                type="button"
                onClick={() => setSelectedIndustry(ind)}
                className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap transition-all ${
                  active
                    ? "bg-primary/20 text-primary border border-primary/40"
                    : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {ind}
              </button>
            );
          })}
        </div>

        <div className="text-xs font-bold text-muted-foreground shrink-0">
          Showing <span className="text-foreground">{companies.length}</span> companies
        </div>
      </div>

      {/* Company Cards Grid */}
      {paginatedCompanies.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedCompanies.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
            >
              <Card className="group relative flex h-full flex-col justify-between overflow-hidden border-border/70 bg-card p-5 transition-all hover:border-primary/40 hover:shadow-lg">
                <div>
                  {/* Card Header: Logo, Name, Ticker, Exchange */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-border/80 bg-white p-1.5 shadow-sm grid place-items-center">
                        {company.logoUrl ? (
                          <img
                            src={company.logoUrl}
                            alt={`${company.name} logo`}
                            className="h-full w-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-primary via-blue-600 to-[hsl(var(--violet))] text-xs font-extrabold text-primary-foreground">
                            {company.logo}
                          </div>
                        )}
                      </div>

                      <div>

                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Link href={`/companies/${company.slug}`} className="hover:underline">
                            <h3 className="font-bold text-foreground text-sm tracking-tight group-hover:text-primary transition-colors">
                              {company.name}
                            </h3>
                          </Link>
                          {company.verified && (
                            <BadgeCheck className="h-4 w-4 text-green-500 shrink-0" aria-label="Verified Enterprise" />
                          )}

                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{company.industry}</p>
                      </div>
                    </div>

                    {/* Stock Ticker Badge */}
                    <div className="flex flex-col items-end shrink-0">
                      <Badge className="bg-secondary text-primary font-mono text-[11px] font-bold border-border/80">
                        {company.ticker}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground font-semibold mt-1">
                        {company.stockExchange}
                      </span>
                    </div>
                  </div>

                  {/* Tagline */}
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                    {company.tagline}
                  </p>

                  {/* Tech Stack Code Badges */}
                  <div className="mt-4 flex flex-wrap gap-1.5 font-mono text-[11px]">
                    {company.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="rounded bg-secondary/80 px-2 py-0.5 font-medium text-foreground text-[10px]"
                      >
                        {tech}
                      </span>
                    ))}
                    {company.techStack.length > 4 && (
                      <span className="rounded bg-secondary/50 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        +{company.techStack.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer: Metadata + Actions */}
                <div className="mt-5 border-t border-border/60 pt-4 space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-primary shrink-0" />
                      <span className="truncate">{company.country}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-primary shrink-0" />
                      <span className="truncate">{company.employeeCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
                      <span className="font-bold text-foreground">{company.glassdoorRating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => handleOpenCompany(company)}
                      className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
                    >
                      Quick Overview
                    </button>

                    <Link href={`/companies/${company.slug}`}>
                      <Button size="sm" variant="accent" className="text-xs h-8">
                        View Profile
                        <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-border/70 bg-card p-12 text-center shadow-sm space-y-3">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
          <h3 className="text-base font-bold text-foreground">No Companies Match Filters</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Try resetting your search query, alphabet letter filter, or stock exchange selection.
          </p>
          <Button variant="outline" size="sm" onClick={resetFilters} className="text-xs">
            Reset All Filters
          </Button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border/70 pt-6">
          <span className="text-xs text-muted-foreground">
            Page <strong className="text-foreground">{currentPage}</strong> of <strong className="text-foreground">{totalPages}</strong>
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="text-xs"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setCurrentPage(p)}
                  className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${
                    currentPage === p
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="text-xs"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Lateral Quick Detail Drawer */}
      <CompanyDetailDrawer
        company={selectedCompany}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
