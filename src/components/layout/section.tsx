import type { HTMLAttributes, ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

type SectionProps = HTMLAttributes<HTMLElement> & {
  eyebrow?: string;
  title?: string;
  description?: string;
  children: ReactNode;
};

export function Section({
  className,
  eyebrow,
  title,
  description,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn("luxury-section py-20 sm:py-28", className)}
      {...props}
    >
      <Container>
        {title ? (
          <Reveal className="mx-auto mb-12 max-w-3xl text-center" distance={14}>
            {eyebrow ? (
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                {eyebrow}
              </p>
            ) : null}
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
              {title}
            </h2>
            {description ? (
              <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
                {description}
              </p>
            ) : null}
          </Reveal>
        ) : null}
        {children}
      </Container>
    </section>
  );
}
