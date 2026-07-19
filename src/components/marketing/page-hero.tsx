import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "premium-mesh relative overflow-hidden border-b border-border/70 py-20 sm:py-28",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-8 h-64 w-1/2 skew-y-6 bg-gradient-to-l from-primary/10 via-[hsl(var(--violet)/0.08)] to-transparent blur-3xl" />
      <Container>
        <Reveal className="relative max-w-3xl" distance={16}>
          <Badge>{eyebrow}</Badge>
          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            {description}
          </p>
          {children ? <div className="mt-8">{children}</div> : null}
        </Reveal>
      </Container>
    </section>
  );
}
