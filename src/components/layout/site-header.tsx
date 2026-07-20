"use client";

import { Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

import { Container } from "@/components/layout/container";
import { SiteLogo } from "@/components/layout/site-logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button, ButtonLink } from "@/components/ui/button";
import { primaryNav } from "@/data/navigation";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 20) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex flex-col items-center justify-between mx-auto max-w-[95%] lg:max-w-6xl transition-all duration-300 gpu-accelerated",
        scrolled ? "mt-2 px-4 py-2 bg-background/85 backdrop-blur-2xl border border-border/80 shadow-lg rounded-full" : "mt-4 px-6 py-2.5 bg-background/70 backdrop-blur-xl border border-border/60 shadow-sm rounded-full"
      )}
    >
      <div className="flex w-full items-center justify-between gap-4">
        <SiteLogo />

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-1 lg:flex"
        >
          {/* Platform Dropdown */}
          <div className="relative group flex items-center">
            <button className="inline-flex items-center justify-center h-9 gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-all duration-200 outline-none cursor-pointer">
              <span>Platform</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-70 transition-transform duration-200 group-hover:rotate-180 shrink-0" />
            </button>
            <div className="absolute left-0 top-full hidden group-hover:block z-50 min-w-[190px] rounded-xl border border-border/70 bg-card/95 p-1.5 shadow-xl backdrop-blur-2xl animate-in fade-in-50 zoom-in-95 duration-150">
              <Link href="/services" className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors">Services</Link>
              <Link href="/employers" className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors">For Employers</Link>
              <Link href="/candidates" className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors">For Candidates</Link>
            </div>
          </div>

          {/* Tools Dropdown */}
          <div className="relative group flex items-center">
            <button
              className={cn(
                "inline-flex items-center justify-center h-9 gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-all duration-200 outline-none cursor-pointer",
                (pathname.startsWith("/tools") || pathname.startsWith("/resume-builder") || pathname.startsWith("/prep")) && "bg-primary/10 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.16)]"
              )}
            >
              <span>Tools</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-70 transition-transform duration-200 group-hover:rotate-180 shrink-0" />
            </button>
            <div className="absolute left-0 top-full hidden group-hover:block z-50 min-w-[240px] rounded-xl border border-border/70 bg-card/95 p-1.5 shadow-xl backdrop-blur-2xl animate-in fade-in-50 zoom-in-95 duration-150">
              <Link href="/tools/boolean-search" className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors">Boolean Search Generator</Link>
              <Link href="/resume-builder" className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors">Resume Builder</Link>
              <Link href="/prep" className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors">HackerPrep (Practice)</Link>
            </div>
          </div>

          {/* Careers Dropdown */}
          <div className="relative group flex items-center">
            <button className="inline-flex items-center justify-center h-9 gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-all duration-200 outline-none cursor-pointer">
              <span>Explore Careers</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-70 transition-transform duration-200 group-hover:rotate-180 shrink-0" />
            </button>
            <div className="absolute left-0 top-full hidden group-hover:block z-50 min-w-[190px] rounded-xl border border-border/70 bg-card/95 p-1.5 shadow-xl backdrop-blur-2xl animate-in fade-in-50 zoom-in-95 duration-150">
              <Link href="/jobs" className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors">Search Jobs</Link>
              <Link href="/internship-jobs" className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors">Internships</Link>
              <Link href="/companies" className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors">Companies</Link>
              <Link href="/industries" className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors">Industries</Link>
            </div>
          </div>

          {/* Resources Link */}
          <div className="relative flex items-center">
            <Link
              className={cn(
                "inline-flex items-center justify-center h-9 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-secondary/80 hover:text-foreground",
                pathname === "/resources" && "bg-primary/10 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.16)]",
              )}
              href="/resources"
            >
              Resources
            </Link>
          </div>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <ButtonLink href="/contact" variant="accent" className="rounded-full px-5">
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
            className="rounded-full"
          >
            {open ? (
              <X aria-hidden="true" className="h-5 w-5" />
            ) : (
              <Menu aria-hidden="true" className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="w-full overflow-hidden border-t border-border/50 mt-3 pt-2 pb-3 lg:hidden"
          >
            <div className="grid gap-1.5 px-2">
              {primaryNav.map((item) => (
                <Link
                  className={cn(
                    "rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/80 hover:text-foreground",
                    pathname === item.href && "bg-primary/10 text-primary font-semibold",
                  )}
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              ))}
              <ButtonLink
                className="mt-2 w-full rounded-xl"
                href="/contact"
                variant="primary"
              >
                Talk to us
              </ButtonLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
