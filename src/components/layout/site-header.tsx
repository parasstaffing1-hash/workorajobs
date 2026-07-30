"use client";

import {
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Home,
  Briefcase,
  Building2,
  Layers,
  Wrench,
  Search,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

import { SiteLogo } from "@/components/layout/site-logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { SignInGatewayModal } from "@/components/auth/SignInGatewayModal";
import { JoinNowGatewayModal } from "@/components/auth/JoinNowGatewayModal";
import { cn } from "@/lib/utils";

const mainNavItems = [
  { label: "Home", href: "/", icon: Home, desktopOnly: false },
  { label: "Jobs", href: "/jobs", icon: Briefcase, desktopOnly: false },
  { label: "Companies", href: "/companies", icon: Building2, desktopOnly: false },
  { label: "Industries", href: "/industries", icon: Layers, desktopOnly: true },
  { label: "Tools", href: "/tools/boolean-search", icon: Wrench, desktopOnly: true },
];

const laptopExtraItems = [
  { label: "Industries", href: "/industries", desc: "Explore hiring sectors" },
  { label: "Boolean Search Tools", href: "/tools/boolean-search", desc: "Recruiter search generator" },
  { label: "Resume Builder", href: "/resume-builder", desc: "ATS-ready resume generator" },
  { label: "HackerPrep Practice", href: "/prep", desc: "Interview prep & coding challenges" },
  { label: "Services", href: "/services", desc: "Enterprise recruiting solutions" },
  { label: "For Employers", href: "/employers", desc: "Post jobs & hire top talent" },
];

const desktopExtraItems = [
  { label: "Resume Builder", href: "/resume-builder", desc: "ATS-ready resume generator" },
  { label: "HackerPrep Practice", href: "/prep", desc: "Interview prep & coding challenges" },
  { label: "Services", href: "/services", desc: "Enterprise recruiting solutions" },
  { label: "For Employers", href: "/employers", desc: "Post jobs & hire top talent" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);

  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isJoinNowOpen, setIsJoinNowOpen] = useState(false);
  const [joinNowRole, setJoinNowRole] = useState<"JOB_SEEKER" | "EMPLOYER" | undefined>(undefined);

  const pathname = usePathname();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 15);
  });

  useEffect(() => {
    setOpen(false);
    setIsMoreOpen(false);
  }, [pathname]);

  const handleOpenJoinNow = (role?: "JOB_SEEKER" | "EMPLOYER") => {
    setJoinNowRole(role);
    setIsJoinNowOpen(true);
  };

  const isMoreActive = laptopExtraItems.some((item) => pathname.startsWith(item.href));

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 select-none",
          scrolled
            ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-b border-slate-200/90 dark:border-slate-800/90 shadow-md shadow-slate-900/5 dark:shadow-black/40"
            : "bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 shadow-sm"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left Section: Workora Logo */}
          <div className="flex-shrink-0 flex items-center">
            <SiteLogo />
          </div>

          {/* Center Section: Primary Navigation Links (Desktop & Laptop) */}
          <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-1 xl:gap-2 min-w-0">
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition-colors whitespace-nowrap flex-shrink-0",
                    item.desktopOnly && "hidden xl:inline-flex",
                    isActive
                      ? "bg-primary/10 text-primary dark:bg-primary/25 dark:text-blue-400 font-bold border border-primary/20 dark:border-primary/40"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  )}
                >
                  <item.icon className={cn("h-3.5 w-3.5 transition-colors flex-shrink-0", isActive ? "text-primary dark:text-blue-400" : "text-slate-400")} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* More Dropdown for Secondary Features */}
            <div
              className="relative flex items-center flex-shrink-0"
              onMouseEnter={() => setIsMoreOpen(true)}
              onMouseLeave={() => setIsMoreOpen(false)}
            >
              <button
                onClick={() => setIsMoreOpen((prev) => !prev)}
                className={cn(
                  "inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-full transition-colors cursor-pointer outline-none whitespace-nowrap",
                  isMoreActive || isMoreOpen
                    ? "bg-primary/10 text-primary dark:bg-primary/25 dark:text-blue-400 font-bold border border-primary/20 dark:border-primary/40"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                )}
              >
                <span>More</span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200 opacity-70 flex-shrink-0",
                    isMoreOpen && "rotate-180 text-primary dark:text-blue-400"
                  )}
                />
              </button>

              {/* More Dropdown Menu */}
              <AnimatePresence>
                {isMoreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute left-0 top-full pt-2 z-50 min-w-[240px]"
                  >
                    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-2 shadow-2xl backdrop-blur-2xl grid gap-1">
                      {/* On Laptop (1024-1279px), show extra laptop items; on Desktop (>=1280px), show desktop items */}
                      <div className="xl:hidden">
                        {laptopExtraItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMoreOpen(false)}
                            className="group block rounded-xl px-3 py-2 transition-all hover:bg-primary/10 dark:hover:bg-primary/20"
                          >
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary dark:group-hover:text-blue-400 transition-colors">
                              {item.label}
                            </div>
                            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                              {item.desc}
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="hidden xl:block">
                        {desktopExtraItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMoreOpen(false)}
                            className="group block rounded-xl px-3 py-2 transition-all hover:bg-primary/10 dark:hover:bg-primary/20"
                          >
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary dark:group-hover:text-blue-400 transition-colors">
                              {item.label}
                            </div>
                            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                              {item.desc}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right Section: Action Controls (Desktop & Laptop) */}
          <div className="hidden lg:flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Link
              href="/jobs"
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
              title="Search jobs or candidates"
            >
              <Search className="h-4 w-4" />
            </Link>

            <ThemeToggle />

            {/* Secondary Link: For Employers (Visible on Desktop >=1280px) */}
            <Link
              href="/employers"
              className="hidden xl:inline-flex items-center px-3.5 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap flex-shrink-0"
            >
              For Employers
            </Link>

            {/* Sign In Button */}
            <Link
              href="/auth/login"
              onClick={(e) => {
                e.preventDefault();
                setIsSignInOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 transition-colors cursor-pointer whitespace-nowrap flex-shrink-0"
            >
              Sign In
            </Link>

            {/* Primary CTA: Join Now */}
            <Link
              href="/auth/signup"
              onClick={(e) => {
                e.preventDefault();
                handleOpenJoinNow();
              }}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer whitespace-nowrap flex-shrink-0"
            >
              <UserPlus className="h-3.5 w-3.5 flex-shrink-0" />
              <span>Join Now</span>
            </Link>
          </div>

          {/* Tablet & Mobile Section (<1024px) */}
          <div className="flex lg:hidden items-center gap-2 flex-shrink-0">
            <ThemeToggle />

            <Link
              href="/auth/signup"
              onClick={(e) => {
                e.preventDefault();
                handleOpenJoinNow();
              }}
              className="h-8 px-3 rounded-full bg-blue-600 text-white font-bold text-xs shadow-sm flex items-center justify-center whitespace-nowrap flex-shrink-0"
            >
              Join Now
            </Link>

            <Button
              aria-expanded={open}
              aria-label="Toggle navigation menu"
              onClick={() => setOpen((val) => !val)}
              size="icon"
              type="button"
              variant="ghost"
              className="rounded-full h-9 w-9 flex-shrink-0"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="w-full overflow-hidden border-t border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl p-4 lg:hidden shadow-2xl space-y-3"
            >
              <div className="grid gap-1">
                {mainNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors",
                      pathname === item.href && "bg-primary/15 text-primary font-bold"
                    )}
                  >
                    <item.icon className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                ))}

                {/* Mobile Expandable Resources Section */}
                <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800/80 mt-1">
                  <button
                    onClick={() => setIsMobileMoreOpen((prev) => !prev)}
                    className="flex w-full items-center justify-between px-3.5 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-primary/10 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span>More Resources</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-slate-400 transition-transform duration-200 flex-shrink-0",
                        isMobileMoreOpen && "rotate-180 text-blue-500"
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {isMobileMoreOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.18 }}
                        className="bg-slate-50/80 dark:bg-slate-800/50 px-3 py-1 space-y-1"
                      >
                        {laptopExtraItems.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => setOpen(false)}
                            className="block rounded-lg px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <Link
                  href="/employers"
                  onClick={() => setOpen(false)}
                  className="block w-full text-center py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  For Employers Landing Page
                </Link>

                <button
                  onClick={(e) => {
                    setOpen(false);
                    e.preventDefault();
                    setIsSignInOpen(true);
                  }}
                  className="block w-full text-center py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* SignIn Gateway Modal */}
      <SignInGatewayModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onOpenJoinNow={(role) => handleOpenJoinNow(role)}
      />

      {/* JoinNow Gateway Modal */}
      <JoinNowGatewayModal
        isOpen={isJoinNowOpen}
        onClose={() => setIsJoinNowOpen(false)}
        initialRole={joinNowRole}
        onOpenSignIn={() => setIsSignInOpen(true)}
      />
    </>
  );
}
