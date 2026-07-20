import Link from "next/link";

import { Container } from "@/components/layout/container";
import { SiteLogo } from "@/components/layout/site-logo";
import { footerNav } from "@/data/navigation";

export function SiteFooter() {
  return (
    <footer className="luxury-section border-t border-border/70 bg-[hsl(var(--navy))] text-white">
      <Container className="py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div className="min-w-0">
            <SiteLogo />
            <p className="mt-5 max-w-md text-sm leading-6 text-white/70">
              Workora Jobs is an AI-powered global staffing and recruitment
              platform for teams building high-trust hiring operations.
            </p>
          </div>
          <nav
            aria-label="Footer navigation"
            className="grid gap-8 sm:grid-cols-3"
          >
            {footerNav.map((group) => (
              <div key={group.title}>
                <h2 className="text-sm font-semibold text-white">
                  {group.title}
                </h2>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        className="text-sm text-white/60 transition-colors hover:text-white"
                        href={link.href}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            (c) {new Date().getFullYear()} Workora Jobs. All rights reserved.
          </p>
          <p>Premium staffing infrastructure for global teams.</p>
        </div>
      </Container>
    </footer>
  );
}
