"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PlatformShellProps = {
  title: string;
  description: string;
  badge: string;
  nav: { href: string; label: string }[];
  children: ReactNode;
};

export function PlatformShell({
  title,
  description,
  badge,
  nav,
  children,
}: PlatformShellProps) {
  const pathname = usePathname();

  return (
    <div className="premium-mesh min-h-[70vh]">
      <Container className="grid gap-8 py-8 sm:py-10 lg:grid-cols-[250px_1fr]">
        <aside className="glass-panel h-fit rounded-lg border border-border/70 p-4 shadow-premium lg:sticky lg:top-24">
          <Badge>{badge}</Badge>
          <nav aria-label={`${badge} navigation`} className="mt-5 grid gap-1">
            {nav.map((item) => (
              <Link
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-[background-color,color,transform] duration-300 hover:-translate-y-0.5 hover:bg-secondary/80 hover:text-foreground",
                  pathname === item.href &&
                    "bg-primary/10 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.16)]",
                )}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <section className="min-w-0">
          <Reveal className="mb-8" distance={14}>
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </Reveal>
          {children}
        </section>
      </Container>
    </div>
  );
}
