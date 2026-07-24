"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, ArrowRight, Building2, Briefcase, Sparkles, X, CheckCircle2, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface FeaturedJobCard {
  title: string;
  company: string;
  location: string;
  type: string;
  logoBg?: string;
}

export interface JobDiscoveryHeroProps {
  headline?: string;
  description?: string;
  searchPlaceholder?: string;
  popularSearches?: Array<{ label: string; href: string }>;
  featuredJobs?: FeaturedJobCard[];
  showJobCards?: boolean;
  showSkillChips?: boolean;
  showCareerPath?: boolean;
  enableMotion?: boolean;
  backgroundVariant?: "light" | "soft-blue" | "glass";
  className?: string;
}

const defaultPopularSearches = [
  { label: "Remote jobs", href: "/jobs?location=Remote" },
  { label: "Software engineering", href: "/jobs?q=Software+Engineer" },
  { label: "Data analyst", href: "/jobs?q=Data+Analyst" },
  { label: "Internships", href: "/internship-jobs" },
  { label: "Marketing", href: "/jobs?q=Marketing" },
  { label: "Product management", href: "/jobs?q=Product+Manager" },
];

const defaultFeaturedJobs: FeaturedJobCard[] = [
  {
    title: "Software Engineer",
    company: "Google",
    location: "Bengaluru, India",
    type: "Full-time",
    logoBg: "bg-blue-500",
  },
  {
    title: "Product Designer",
    company: "Apple",
    location: "Remote",
    type: "Full-time",
    logoBg: "bg-slate-800",
  },
  {
    title: "Data Analyst",
    company: "Microsoft",
    location: "Hyderabad, India",
    type: "Full-time",
    logoBg: "bg-teal-600",
  },
  {
    title: "Marketing Intern",
    company: "Meta",
    location: "Mumbai, India",
    type: "Internship",
    logoBg: "bg-indigo-600",
  },
];

const defaultSkillChips = [
  "Remote",
  "React",
  "Marketing",
  "Bengaluru",
  "Entry Level",
  "Data Science",
  "Product Design",
];

const animatedPlaceholders = [
  "Search software engineering jobs",
  "Find remote design roles",
  "Explore companies hiring now",
  "Search jobs in Bengaluru",
];

export function JobDiscoveryHero({
  headline = "Find the right job. Build your future.",
  description = "Search verified opportunities from leading companies and discover roles that match your skills, location, and career goals.",
  searchPlaceholder = "Job title, skill, or company",
  popularSearches = defaultPopularSearches,
  featuredJobs = defaultFeaturedJobs,
  showJobCards = false,
  showSkillChips = true,
  showCareerPath = true,
  enableMotion = true,
  backgroundVariant = "soft-blue",
  className = "",
}: JobDiscoveryHeroProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== "undefined") {
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      setIsReducedMotion(media.matches);
    }
  }, []);

  // Placeholder typewriter effect
  useEffect(() => {
    if (isFocused || query || !enableMotion || isReducedMotion) return;
    const interval = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % animatedPlaceholders.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isFocused, query, enableMotion, isReducedMotion]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() && !location.trim()) return;

    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (location.trim()) params.set("location", location.trim());
    router.push(`/jobs?${params.toString()}`);
  };

  const shouldAnimate = enableMotion && !isReducedMotion;

  return (
    <section
      className={`relative w-full overflow-hidden bg-white dark:bg-slate-950 pt-8 pb-16 lg:pt-14 lg:pb-24 ${className}`}
    >


      {/* Decorative SVG Career Path Line */}
      {showCareerPath && (
        <svg
          aria-hidden="true"
          className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-15 hidden lg:block"
        >
          <path
            d="M 100 200 Q 400 100, 700 300 T 1300 250"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="6 6"
            className="text-blue-500"
          />
        </svg>
      )}

      {/* Hero Layout Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Headline, Description, Search Form, Popular Searches */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Badge */}
          <motion.div
            initial={shouldAnimate ? { opacity: 0, y: -10 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-900/40 border border-blue-200/80 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Over 10,000+ Verified Careers</span>
          </motion.div>

          {/* Real Semantic H1 Headline */}
          <motion.h1
            initial={shouldAnimate ? { opacity: 0, y: 15 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-4"
          >
            {headline}
          </motion.h1>

          {/* Supporting Description Text */}
          <motion.p
            initial={shouldAnimate ? { opacity: 0, y: 15 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed mb-8 max-w-2xl"
          >
            {description}
          </motion.p>

          {/* Prominent Search Form Box */}
          <motion.div
            initial={shouldAnimate ? { opacity: 0, scale: 0.97 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full max-w-2xl bg-white dark:bg-slate-900 p-2 sm:p-2.5 rounded-3xl shadow-xl shadow-slate-900/8 border border-slate-200/90 dark:border-slate-800 relative z-30"
          >
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-2">
              {/* Job Title / Skill Input */}
              <div className="flex items-center flex-1 w-full px-4 h-13 rounded-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 gap-3">
                <Search className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  placeholder={query || isFocused ? searchPlaceholder : animatedPlaceholders[placeholderIdx]}
                  className="w-full bg-transparent border-none focus:outline-none text-sm sm:text-base font-semibold text-slate-900 dark:text-white placeholder:text-slate-400"
                  aria-label="Search job title, skill, or company"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Location Input */}
              <div className="flex items-center flex-1 w-full px-4 h-13 rounded-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 gap-3">
                <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  placeholder="Location or 'Remote'"
                  className="w-full bg-transparent border-none focus:outline-none text-sm sm:text-base font-semibold text-slate-900 dark:text-white placeholder:text-slate-400"
                  aria-label="Search location"
                />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="w-full sm:w-auto h-13 px-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all duration-200 shrink-0 cursor-pointer active:scale-95 group"
              >
                <span>Search Jobs</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </motion.div>

          {/* Popular Search Quick Links */}
          <motion.div
            initial={shouldAnimate ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-5 flex flex-wrap items-center gap-2"
          >
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Popular:</span>
            {popularSearches.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-600 transition-colors shadow-sm"
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Right Column: Animated Professional Job Cards & Floating Chips */}
        <div className="lg:col-span-5 relative w-full h-[420px] lg:h-[500px] flex items-center justify-center">
          {/* Floating Skill / Location Chips */}
          {showSkillChips && (
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-10 hidden sm:block">
              {defaultSkillChips.slice(0, 5).map((chip, idx) => {
                const offsets = [
                  { top: "5%", left: "10%" },
                  { top: "18%", right: "8%" },
                  { bottom: "20%", left: "5%" },
                  { bottom: "8%", right: "12%" },
                  { top: "50%", left: "2%" },
                ];
                const pos = offsets[idx % offsets.length];

                return (
                  <motion.div
                    key={chip}
                    initial={shouldAnimate ? { opacity: 0, scale: 0.8 } : false}
                    animate={
                      shouldAnimate
                        ? {
                            opacity: 1,
                            scale: 1,
                            y: [0, -8, 0],
                          }
                        : { opacity: 1, scale: 1 }
                    }
                    transition={{
                      y: {
                        duration: 4 + idx,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut",
                        delay: idx * 0.4,
                      },
                    }}
                    style={pos}
                    className="absolute px-3 py-1 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300 shadow-md"
                  >
                    ✦ {chip}
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Animated Job Cards Stack */}
          {showJobCards && (
            <div className="relative w-full max-w-[400px] space-y-4">
              {featuredJobs.map((job, idx) => {
                const floatDurations = [6, 7.5, 6.8, 8];

                return (
                  <motion.div
                    key={job.title + idx}
                    initial={shouldAnimate ? { opacity: 0, y: 25 } : false}
                    animate={
                      shouldAnimate
                        ? {
                            opacity: 1,
                            y: [0, -10, 0],
                            rotate: idx % 2 === 0 ? 0.8 : -0.8,
                          }
                        : { opacity: 1, y: 0 }
                    }
                    transition={{
                      y: {
                        duration: floatDurations[idx % floatDurations.length],
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut",
                        delay: idx * 0.2,
                      },
                    }}
                    whileHover={shouldAnimate ? { y: -6, scale: 1.02 } : undefined}
                    className="p-4 sm:p-4.5 rounded-2xl bg-white dark:bg-slate-800/95 border border-slate-200/90 dark:border-slate-700/80 shadow-xl shadow-slate-900/6 flex items-center justify-between gap-4 transition-shadow hover:shadow-2xl hover:border-blue-400/50 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-11 h-11 rounded-xl ${job.logoBg || "bg-blue-600"} text-white font-bold text-base flex items-center justify-center shadow-md shrink-0`}
                      >
                        {job.company.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                            {job.title}
                          </h3>
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        </div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{job.company}</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5">
                            <MapPin className="w-3 h-3" />
                            {job.location}
                          </span>
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60 shrink-0">
                      {job.type}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
