import { ArrowLeft, SearchX } from "lucide-react";

import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="grid min-h-[70vh] place-items-center py-24">
      <div className="glass-panel max-w-xl rounded-lg border border-border/70 p-8 text-center shadow-premium">
        <div className="animated-sheen mx-auto mb-6 grid h-16 w-16 place-items-center rounded-lg border border-primary/20 bg-primary/10">
          <SearchX aria-hidden="true" className="h-8 w-8 text-primary" />
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          404
        </p>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          This page is not in the hiring plan.
        </h1>
        <p className="mt-4 text-muted-foreground">
          The link may be outdated, or the page may have moved as the Workora
          foundation evolves.
        </p>
        <ButtonLink className="mt-8" href="/" variant="primary">
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Back to homepage
        </ButtonLink>
      </div>
    </Container>
  );
}
