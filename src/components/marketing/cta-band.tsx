import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";

export function CtaBand() {
  return (
    <section className="py-20">
      <Container>
        <Reveal className="animated-sheen overflow-hidden rounded-lg border border-white/10 bg-[hsl(var(--navy))] px-6 py-12 text-white shadow-premium sm:px-10 lg:px-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60">
                Build your hiring foundation
              </p>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                Start with a premium public presence for global talent.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/70">
                Workora gives teams the polished public surface and product
                foundation needed to earn trust from employers and candidates.
              </p>
            </div>
            <ButtonLink
              className="bg-white text-foreground hover:bg-white/90"
              href="/contact"
              size="lg"
            >
              Contact Workora
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
