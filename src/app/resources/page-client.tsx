"use client";

import { Download, FileText } from "lucide-react";

import { Section } from "@/components/layout/section";
import { PageHero } from "@/components/marketing/page-hero";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { resourceCards } from "@/data/marketing";



export default function ResourcesPage() {
  return (
    <>
      <PageHero
        description="A premium knowledge hub for future guides, reports, AI workflow maps and hiring templates."
        eyebrow="Resources"
        title="Practical thinking for global hiring teams."
      />
      <Section>
        <div className="grid gap-4 lg:grid-cols-3">
          {resourceCards.map((resource) => (
            <Card
              className="flex min-h-72 cursor-pointer flex-col p-6 transition-colors hover:border-primary"
              key={resource.title}
              onClick={() => alert(`Navigating to resource: ${resource.title}`)}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
                  <FileText aria-hidden="true" className="h-5 w-5" />
                </div>
                <Badge>{resource.type}</Badge>
              </div>
              <h2 className="mt-6 text-xl font-semibold tracking-tight">
                {resource.title}
              </h2>
              <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">
                {resource.description}
              </p>
              {"href" in resource && resource.href ? (
                <ButtonLink
                  className="mt-6"
                  href={resource.href}
                  variant="outline"
                >
                  <Download aria-hidden="true" className="h-4 w-4" />
                  View AI tools
                </ButtonLink>
              ) : (
                <Button
                  className="mt-6"
                  disabled
                  type="button"
                  variant="outline"
                >
                  <Download aria-hidden="true" className="h-4 w-4" />
                  Resource placeholder
                </Button>
              )}
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
