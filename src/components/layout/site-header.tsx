"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Container } from "@/components/layout/container";
import { SiteLogo } from "@/components/layout/site-logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button, ButtonLink } from "@/components/ui/button";
import { primaryNav } from "@/data/navigation";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-2 rounded-full mt-4 mx-auto max-w-[95%] bg-background/80 backdrop-blur-xl border border-border/70 shadow-sm glass-nav">
      <div className="flex w-full items-center justify-between gap-4">
        <SiteLogo />
        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-1 lg:flex"
        >
          {/* Platform Dropdown */}
          <div className="relative group">
            <button className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors outline-none cursor-pointer">
              Platform
              <svg className="h-4 w-4 opacity-70 transition-transform group-hover:rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>
            </button>
            <div className="absolute left-0 top-full hidden group-hover:block z-50 min-w-[180px] rounded-lg border border-border/70 bg-card/95 p-1.5 shadow-premium backdrop-blur-xl">
              <Link href="/services" className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/80 hover:text-foreground">Services</Link>
              <Link href="/employers" className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/80 hover:text-foreground">For Employers</Link>
              <Link href="/candidates" className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/80 hover:text-foreground">For Candidates</Link>
            </div>
          </div>

          {/* Tools Dropdown */}
          <div className="relative group">
            <Link
              href="/tools"
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors outline-none cursor-pointer",
                pathname.startsWith("/tools") && "bg-primary/10 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.16)]"
              )}
            >
              Tools
              <svg className="h-4 w-4 opacity-70 transition-transform group-hover:rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>
            </Link>
            <div className="absolute left-0 top-full hidden group-hover:block z-50 min-w-[200px] rounded-lg border border-border/70 bg-card/95 p-1.5 shadow-premium backdrop-blur-xl">
              <Link href="/tools" className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/80 hover:text-foreground">Recruiter Tools Library</Link>
              <Link href="/resume-builder" className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/80 hover:text-foreground">Resume Builder</Link>
              <Link href="/prep" className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/80 hover:text-foreground">HackerPrep (Practice)</Link>
            </div>
          </div>

          {/* Careers Dropdown */}
          <div className="relative group">
            <button className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors outline-none cursor-pointer">
              Explore Careers
              <svg className="h-4 w-4 opacity-70 transition-transform group-hover:rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>
            </button>
            <div className="absolute left-0 top-full hidden group-hover:block z-50 min-w-[180px] rounded-lg border border-border/70 bg-card/95 p-1.5 shadow-premium backdrop-blur-xl">
              <Link href="/jobs" className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/80 hover:text-foreground">Search Jobs</Link>
              <Link href="/internship-jobs" className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/80 hover:text-foreground">Internships</Link>
              <Link href="/companies" className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/80 hover:text-foreground">Companies</Link>
              <Link href="/industries" className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/80 hover:text-foreground">Industries</Link>
            </div>
          </div>

          {/* Resources Link */}
          <Link
            className={cn(
              "relative rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-[background-color,color,transform] duration-300 hover:-translate-y-0.5 hover:bg-secondary/80 hover:text-foreground",
              pathname === "/resources" && "bg-primary/10 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.16)]",
            )}
            href="/resources"
          >
            Resources
          </Link>
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <ButtonLink href="/contact" variant="accent">
            Talk to us
          </ButtonLink>
        </div>
        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <Button
            aria-expanded={open}
            aria-label="Toggle navigation"
            onClick={() => setOpen((value) => !value)}
            size="icon"
            type="button"
            variant="ghost"
          >
            {open ? (
              <X aria-hidden="true" className="h-5 w-5" />
            ) : (
              <Menu aria-hidden="true" className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
      {open ? (
        <div className="glass-panel mt-2 rounded-2xl border border-border/70 shadow-premium lg:hidden max-h-[calc(100vh-6rem)] overflow-y-auto">
          <Container className="grid gap-2 py-4">
            {primaryNav.map((item) => (
              <Link
                className={cn(
                  "rounded-md px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/80 hover:text-foreground",
                  pathname === item.href && "bg-primary/10 text-primary",
                )}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
            <ButtonLink
              className="mt-2 w-full"
              href="/contact"
              variant="primary"
            >
              Talk to us
            </ButtonLink>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
