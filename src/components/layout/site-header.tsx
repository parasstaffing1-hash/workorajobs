"use client";

import { Menu, X, ChevronDown, Sparkles, Home, Briefcase, Building2, Layers, Wrench } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

import { SiteLogo } from "@/components/layout/site-logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button, ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const mainNavItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Jobs", href: "/jobs", icon: Briefcase },
  { label: "Companies", href: "/companies", icon: Building2 },
  { label: "Industries", href: "/industries", icon: Layers },
  { label: "Tools", href: "/tools/boolean-search", icon: Wrench },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-3 left-0 right-0 z-50 flex flex-col items-center mx-auto max-w-[95%] lg:max-w-5xl px-2 select-none gpu-layer"
    >
      {/* Premium Harmonious Floating Island Navbar */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className={cn(
          "relative flex w-full items-center justify-between transition-all duration-300 rounded-full border px-4 py-2",
          scrolled
            ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-slate-200/90 dark:border-slate-800/90 shadow-xl shadow-slate-900/5 dark:shadow-black/40"
            : "bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border-slate-200/70 dark:border-slate-800/70 shadow-lg shadow-slate-900/5"
        )}
      >
        <SiteLogo />

        {/* Floating Spotlight Navigation Links matching Scene.mp4 */}
        <nav aria-label="Primary navigation" className="hidden items-center gap-1 lg:flex relative">
          {mainNavItems.map((item, idx) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const isHovered = hoveredIndex === idx;

            return (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={cn(
                  "relative inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full transition-colors z-10",
                  isActive || isHovered
                    ? "text-primary dark:text-white"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                )}
              >
                {/* Active / Hovered Motion Spotlight Glider matching Scene.mp4 */}
                {(isActive || isHovered) && (
                  <motion.div
                    layoutId="activeNavSpotlight"
                    className="absolute inset-0 rounded-full bg-primary/10 dark:bg-primary/25 border border-primary/25 dark:border-primary/40 z-[-1]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon className={cn("h-3.5 w-3.5 transition-colors", isActive ? "text-primary dark:text-blue-400" : "text-slate-400")} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Tools & Resources Dropdown */}
          <div className="relative group flex items-center ml-1">
            <button className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-all outline-none cursor-pointer">
              <span>More</span>
              <ChevronDown className="h-3 w-3 opacity-70 group-hover:rotate-180 transition-transform" />
            </button>
            <div className="absolute left-0 top-full hidden group-hover:block z-50 min-w-[200px] mt-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-2 shadow-2xl backdrop-blur-2xl">
              <Link href="/resume-builder" className="block rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors">Resume Builder</Link>
              <Link href="/prep" className="block rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors">HackerPrep Practice</Link>
              <Link href="/services" className="block rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors">Services</Link>
              <Link href="/employers" className="block rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors">For Employers</Link>
            </div>
          </div>
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden items-center gap-2.5 lg:flex">
          <ThemeToggle />
          <ButtonLink href="/contact" variant="accent" className="rounded-full px-5 text-xs font-bold h-9 shadow-md shadow-primary/20">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Talk to us
          </ButtonLink>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-1.5 lg:hidden">
          <ThemeToggle />
          <Button
            aria-expanded={open}
            aria-label="Toggle navigation"
            onClick={() => setOpen((val) => !val)}
            size="icon"
            type="button"
            variant="ghost"
            className="rounded-full h-9 w-9"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </motion.div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="w-full overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl mt-2 p-4 lg:hidden shadow-2xl"
          >
            <div className="grid gap-1.5">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors",
                    pathname === item.href && "bg-primary/15 text-primary font-bold"
                  )}
                >
                  <item.icon className="h-4 w-4 text-primary" />
                  {item.label}
                </Link>
              ))}
              <ButtonLink href="/contact" variant="primary" className="mt-2 w-full rounded-xl text-xs font-bold">
                Talk to us
              </ButtonLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
