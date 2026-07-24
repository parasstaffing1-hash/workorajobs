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
  LogIn,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

import { SiteLogo } from "@/components/layout/site-logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button, ButtonLink } from "@/components/ui/button";
import { SignInGatewayModal } from "@/components/auth/SignInGatewayModal";
import { JoinNowGatewayModal } from "@/components/auth/JoinNowGatewayModal";
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

  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);

  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isJoinNowOpen, setIsJoinNowOpen] = useState(false);
  const [joinNowRole, setJoinNowRole] = useState<"JOB_SEEKER" | "EMPLOYER" | undefined>(undefined);

  const pathname = usePathname();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  useEffect(() => {
    setOpen(false);
    setIsMoreOpen(false);
  }, [pathname]);

  const handleOpenJoinNow = (role?: "JOB_SEEKER" | "EMPLOYER") => {
    setJoinNowRole(role);
    setIsJoinNowOpen(true);
  };

  const moreItems = [
    { label: "Resume Builder", href: "/resume-builder", desc: "ATS-ready resume generator" },
    { label: "HackerPrep Practice", href: "/prep", desc: "Interview prep & coding challenges" },
    { label: "Services", href: "/services", desc: "Enterprise recruiting solutions" },
    { label: "For Employers Page", href: "/employers", desc: "Post jobs & hire top talent" },
  ];

  const isMoreActive = moreItems.some((item) => pathname.startsWith(item.href));

  return (
    <>
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-3 left-0 right-0 z-40 flex flex-col items-center mx-auto max-w-[95%] lg:max-w-6xl px-2 select-none gpu-layer"
      >
        {/* Floating Enterprise Navbar Container */}
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className={cn(
            "relative flex w-full items-center justify-between transition-all duration-300 rounded-full border px-4 py-2",
            scrolled
              ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-slate-200/90 dark:border-slate-800/90 shadow-xl shadow-slate-900/5 dark:shadow-black/40"
              : "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/70 dark:border-slate-800/70 shadow-lg shadow-slate-900/5"
          )}
        >
          {/* Left: Workora Logo */}
          <SiteLogo />

          {/* Center: Navigation Links */}
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

            {/* More Dropdown with Smooth Slide & Spotlight Animation */}
            <div
              className="relative flex items-center ml-1"
              onMouseEnter={() => {
                setHoveredIndex(mainNavItems.length);
                setIsMoreOpen(true);
              }}
              onMouseLeave={() => {
                setHoveredIndex(null);
                setIsMoreOpen(false);
              }}
            >
              <button
                onClick={() => setIsMoreOpen((prev) => !prev)}
                className={cn(
                  "relative inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold rounded-full transition-colors z-10 cursor-pointer outline-none",
                  isMoreActive || hoveredIndex === mainNavItems.length || isMoreOpen
                    ? "text-primary dark:text-white"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                )}
              >
                {(isMoreActive || hoveredIndex === mainNavItems.length || isMoreOpen) && (
                  <motion.div
                    layoutId="activeNavSpotlight"
                    className="absolute inset-0 rounded-full bg-primary/10 dark:bg-primary/25 border border-primary/25 dark:border-primary/40 z-[-1]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span>More</span>
                <ChevronDown
                  className={cn(
                    "h-3 w-3 transition-transform duration-200 opacity-70",
                    isMoreOpen && "rotate-180 text-primary dark:text-blue-400"
                  )}
                />
              </button>

              {/* Animated Dropdown Menu with Seamless Hover Bridge */}
              <AnimatePresence>
                {isMoreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute left-0 top-full pt-2 z-50 min-w-[230px]"
                  >
                    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-2 shadow-2xl backdrop-blur-2xl grid gap-1">
                      {moreItems.map((item) => (
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right Action Controls */}
          <div className="hidden items-center gap-2 lg:flex">
            <ThemeToggle />

            <Link
              href="/search"
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Search jobs or candidates"
            >
              <Search className="h-4 w-4" />
            </Link>

            {/* Secondary Button: For Employers */}
            <Link
              href="/employers"
              className="px-3.5 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              For Employers
            </Link>

            {/* Sign In Trigger */}
            <button
              onClick={() => setIsSignInOpen(true)}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 transition-colors cursor-pointer"
            >
              Sign In
            </button>

            {/* Primary CTA: Join Now */}
            <button
              onClick={() => handleOpenJoinNow()}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Join Now</span>
            </button>
          </div>

          {/* Mobile Action Buttons */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />

            <button
              onClick={() => handleOpenJoinNow()}
              className="h-8 px-3 rounded-full bg-blue-600 text-white font-bold text-xs shadow-sm"
            >
              Join Now
            </button>

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

        {/* Mobile Navigation Drawer with Expandable More Slide */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="w-full overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl mt-2 p-4 lg:hidden shadow-2xl space-y-3"
            >
              <div className="grid gap-1">
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

                {/* Mobile Expandable More Section */}
                <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800/80">
                  <button
                    onClick={() => setIsMobileMoreOpen((prev) => !prev)}
                    className="flex w-full items-center justify-between px-3.5 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-primary/10 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="h-4 w-4 text-blue-500" />
                      <span>More Resources</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-slate-400 transition-transform duration-200",
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
                        {moreItems.map((sub) => (
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

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <Link
                  href="/employers"
                  className="block w-full text-center py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  For Employers Landing Page
                </Link>

                <button
                  onClick={() => {
                    setOpen(false);
                    setIsSignInOpen(true);
                  }}
                  className="w-full text-center py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                >
                  Sign In
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

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
