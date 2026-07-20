"use client";

import { useState } from "react";
import { Search, MapPin, Sparkles, Command } from "lucide-react";
import { useRouter } from "next/navigation";

export function AnimatedSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const tags = ["✦ Full-Time", "Remote", "Engineering", "Design", "$150k+"];

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
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 mb-6 relative z-20 px-2 sm:px-0">
      <form
        onSubmit={handleSearch}
        className="glass-search-bar rounded-2xl p-2 sm:p-2.5 flex flex-col md:flex-row items-center gap-2 sm:gap-3 transition-all duration-200 group focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500/80"
      >
        {/* Job Title / Keywords Input */}
        <div className="flex items-center flex-1 w-full px-3 h-12 rounded-xl bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-white/5 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all duration-200 gap-2.5">
          <Search className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Role, skills, or company (e.g. React, Staff Engineer)"
            className="w-full bg-transparent border-none focus:outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
            aria-label="Search job title or keywords"
          />
          <div className="hidden lg:flex items-center gap-0.5 text-[10px] font-mono text-slate-400 bg-slate-200/60 dark:bg-slate-700/60 px-1.5 py-0.5 rounded border border-slate-300/50 dark:border-slate-600/50 shrink-0">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </div>

        {/* Location Input */}
        <div className="flex items-center flex-1 w-full px-3 h-12 rounded-xl bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-white/5 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all duration-200 gap-2.5">
          <MapPin className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200 shrink-0" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location or 'Remote'"
            className="w-full bg-transparent border-none focus:outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
            aria-label="Search location"
          />
        </div>

        {/* Submit Search Button */}
        <button
          type="submit"
          className="w-full md:w-auto h-12 px-7 rounded-xl bg-slate-900 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 transition-all duration-200 shrink-0 cursor-pointer active:scale-[0.98]"
        >
          <Sparkles className="w-4 h-4" />
          <span>Find Talent</span>
        </button>
      </form>

      {/* Quick Search Tag Filters */}
      <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Quick Filters:</span>
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleTagClick(tag)}
            className={`text-xs px-2.5 py-1 rounded-full border transition-all duration-200 cursor-pointer ${
              activeTag === tag
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-white/70 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-blue-400 dark:hover:border-blue-500/50"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
