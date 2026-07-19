"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Compass, Sparkles, BookOpen } from "lucide-react";
import { categories, tools, searchTools, getToolsByCategory } from "@/lib/tools/registry";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/layout/section";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ToolsLandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredTools = searchTools(searchQuery);

  return (
    <>
      <PageHero
        description="The ultimate open-source recruiter productivity workbench. Fully client-side, offline-first, deterministic, and free forever."
        eyebrow="Recruiter Tools Library"
        title="160+ Free Recruiting, Parsing & Utility Tools."
      >
        <div className="relative max-w-lg mx-auto mt-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Search all 160+ tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </PageHero>

      <Section>
        {searchQuery ? (
          <div>
            <h2 className="text-xl font-semibold mb-6">Search Results for "{searchQuery}" ({filteredTools.length})</h2>
            {filteredTools.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTools.map((tool) => (
                  <Link href={`/tools/${tool.category}/${tool.slug}`} key={tool.slug}>
                    <Card className="p-6 hover:border-primary transition-colors cursor-pointer h-full">
                      <span className="text-xs font-semibold uppercase text-primary/80 tracking-wider">
                        {tool.category.toUpperCase()}
                      </span>
                      <h3 className="text-lg font-bold mt-2 text-foreground">{tool.name}</h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{tool.description}</p>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-12">No tools match your query.</p>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            {/* Category Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((cat) => {
                const catTools = getToolsByCategory(cat.slug);
                if (catTools.length === 0) return null;
                return (
                  <Card className="p-6 hover:border-primary/50 transition-colors" key={cat.slug}>
                    <h3 className="text-xl font-bold text-foreground flex items-center justify-between">
                      {cat.name}
                      <span className="text-xs font-mono font-normal bg-secondary px-2 py-0.5 rounded text-muted-foreground">
                        {catTools.length} tools
                      </span>
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground mb-4 leading-relaxed">{cat.description}</p>
                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                      {catTools.slice(0, 4).map((tool) => (
                        <Link
                          href={`/tools/${cat.slug}/${tool.slug}`}
                          key={tool.slug}
                          className="block text-sm text-primary hover:underline"
                        >
                          {tool.name}
                        </Link>
                      ))}
                    </div>
                    <Link
                      href={`/tools/${cat.slug}`}
                      className="block mt-4 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider"
                    >
                      View Category →
                    </Link>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </Section>
    </>
  );
}
