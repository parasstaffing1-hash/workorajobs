"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Sparkles, Command, X, ArrowRight, TrendingUp, Building2, Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";

const animatedPlaceholders = [
  "Search jobs, skills, or companies...",
  "Try 'Senior React Engineer'...",
  "Try 'Staff AI & Machine Learning'...",
  "Try 'Remote Product Designer'...",
  "Try 'DevOps & Cloud Architect'..."
];

const popularSearches = [
  "Senior React Engineer",
  "Full-Stack Developer",
  "Staff AI & Machine Learning",
  "Product Designer",
  "DevOps & Cloud Architect",
  "Engineering Manager"
];

const trendingCompanies = [
  "Apple Inc.",
  "Microsoft",
  "NVIDIA",
  "Google",
  "Amazon",
  "Meta"
];

export function AnimatedSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const tags = ["✦ Full-Time", "Remote", "Engineering", "Design", "$150k+"];

  // Rotating placeholder prompts for motion design feel
  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % animatedPlaceholders.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  // Global Keyboard Shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsExpanded(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close / collapse search bar on click outside if empty
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (!query && !location) {
          setIsExpanded(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [query, location]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (location) params.set("location", location);
    router.push(`/jobs?${params.toString()}`);
  };

  const handleTagClick = (tag: string) => {
    const cleanTag = tag.replace("✦ ", "");
    setActiveTag(tag === activeTag ? null : tag);
    setQuery(tag === activeTag ? "" : cleanTag);
    setIsExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setIsExpanded(true);
    router.push(`/jobs?q=${encodeURIComponent(suggestion)}`);
  };

  return (
    <div ref={containerRef} className="w-full max-w-4xl mx-auto mt-8 mb-6 relative z-30 px-2 sm:px-0 flex flex-col items-center">
      {/* Morphing Pill Container (Collapses & Expands like Search.mp4) */}
      <motion.div
        layout
        initial={{ width: "240px", borderRadius: "9999px" }}
        animate={{
          width: isExpanded ? "100%" : "280px",
          borderRadius: "9999px",
          boxShadow: isExpanded
            ? "0 25px 50px -12px rgba(8, 136, 248, 0.25), 0 0 0 4px rgba(8, 136, 248, 0.18)"
            : "0 15px 35px -10px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(226, 232, 240, 0.9)",
        }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        onClick={() => {
          if (!isExpanded) {
            setIsExpanded(true);
            setTimeout(() => inputRef.current?.focus(), 100);
          }
        }}
        className="relative bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-2 transition-colors cursor-pointer overflow-hidden"
      >
        {!isExpanded ? (
          /* Initial Collapsed Pill State matching frame_001.png */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-between px-4 h-12 w-full select-none"
          >
            <div className="flex items-center gap-3">
              <Search className="w-6 h-6 text-slate-400 shrink-0" />
              <AnimatePresence mode="wait">
                <motion.span
                  key={placeholderIndex}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="text-sm font-semibold text-slate-600 dark:text-slate-300 truncate max-w-[160px]"
                >
                  {animatedPlaceholders[placeholderIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </div>
          </motion.div>
        ) : (
          /* Expanded Interactive Pill Search Bar matching frame_002.png -> frame_004.png */
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-2">
            {/* Main Keyword Input Section */}
            <div className="flex items-center flex-1 w-full px-4 h-13 rounded-full bg-transparent gap-3">
              <Search className="w-6 h-6 text-primary shrink-0" />
              
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={animatedPlaceholders[placeholderIndex]}
                className="w-full bg-transparent border-none focus:outline-none text-base sm:text-lg font-medium text-slate-900 dark:text-white placeholder:text-slate-400/90 tracking-tight"
                aria-label="Search job title or keywords"
              />

              {/* Clear Button */}
              {query && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuery("");
                  }}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Shortcut Badge */}
              <div className="hidden lg:flex items-center gap-1 text-[11px] font-mono font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full border border-slate-200 dark:border-slate-700 shrink-0 select-none">
                <Command className="w-3 h-3" />
                <span>K</span>
              </div>
            </div>

            {/* Location Input Divider & Field */}
            <div className="hidden sm:flex items-center flex-1 w-full px-4 h-13 border-l border-slate-200 dark:border-slate-800 gap-3">
              <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City or 'Remote'"
                className="w-full bg-transparent border-none focus:outline-none text-sm sm:text-base font-medium text-slate-900 dark:text-white placeholder:text-slate-400/90 tracking-tight"
                aria-label="Search location"
              />
            </div>

            {/* Action Button */}
            <button
              type="submit"
              className="w-full sm:w-auto h-13 px-8 rounded-full bg-primary hover:bg-blue-600 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-primary/30 transition-all duration-200 shrink-0 cursor-pointer active:scale-95 group"
            >
              <span>Search</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        )}

        {/* Dropdown Suggestions Panel */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="mt-3 border-t border-slate-100 dark:border-slate-800 pt-4 p-4 z-50"
            >
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Popular Roles Column */}
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    <TrendingUp className="w-3.5 h-3.5 text-primary" /> Popular Searches
                  </div>
                  <div className="space-y-1.5">
                    {popularSearches.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSuggestionClick(item);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-primary/10 hover:text-primary transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Briefcase className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary transition-colors" />
                          {item}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-primary" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Top Hiring Companies Column */}
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    <Building2 className="w-3.5 h-3.5 text-primary" /> Top Companies Hiring
                  </div>
                  <div className="space-y-1.5">
                    {trendingCompanies.map((comp) => (
                      <button
                        key={comp}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsExpanded(false);
                          router.push(`/companies/${comp.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}`);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-primary/10 hover:text-primary transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary transition-colors" />
                          {comp}
                        </span>
                        <span className="text-[11px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          View Careers →
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Quick Search Tag Filters */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Trending:</span>
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleTagClick(tag)}
            className={`text-xs px-3 py-1 rounded-full font-semibold border transition-all duration-200 cursor-pointer ${
              activeTag === tag
                ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                : "bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:text-primary"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
