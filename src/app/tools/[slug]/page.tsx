"use client";

import React, { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCategoryBySlug, getToolsByCategory } from "@/lib/tools/registry";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/layout/section";
import { Card } from "@/components/ui/card";

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const category = getCategoryBySlug(resolvedParams.slug);
  const categoryTools = category ? getToolsByCategory(category.slug) : [];

  if (!category) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Category not found</h1>
        <Link href="/tools" className="mt-4 inline-block text-primary hover:underline">
          Back to Tools Index
        </Link>
      </div>
    );
  }

  return (
    <>
      <PageHero
        description={category.description}
        eyebrow="Category"
        title={category.name}
      >
        <div className="mt-4">
          <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Tools Index
          </Link>
        </div>
      </PageHero>

      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoryTools.map((tool) => (
            <Link href={`/tools/${category.slug}/${tool.slug}`} key={tool.slug}>
              <Card className="p-6 hover:border-primary transition-colors cursor-pointer h-full">
                <h3 className="text-lg font-bold text-foreground">{tool.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{tool.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
