"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Copy,
  Check,
  ArrowUp,
  Printer,
  ShieldCheck,
  FileText,
  Clock,
  Menu,
  X,
  Share2,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { useToast } from "@/components/ui/toast";

export interface TocItem {
  id: string;
  title: string;
  badge?: string;
}

interface LegalPageLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  documentType: "privacy" | "terms";
  toc: TocItem[];
  children: React.ReactNode;
}

export function LegalPageLayout({
  title,
  subtitle,
  lastUpdated,
  documentType,
  toc,
  children,
}: LegalPageLayoutProps) {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<string>(toc[0]?.id || "");
  const [readingProgress, setReadingProgress] = useState<number>(0);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // 1. Calculate reading progress & show back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, currentProgress)));
      }

      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. IntersectionObserver for active section highlighting in TOC
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      }
    );

    toc.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [toc]);

  // 3. Smooth Scroll to Section
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for fixed header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  // 4. Copy heading anchor URL
  const copyHeadingLink = (id: string, sectionTitle: string) => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedSection(id);
      toast(`Copied direct link to "${sectionTitle}"`, "success");
      setTimeout(() => setCopiedSection(null), 2500);
    });
  };

  // 5. Print Document Action
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors selection:bg-blue-500 selection:text-white">
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-slate-200 dark:bg-slate-800 z-50 pointer-events-none print:hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 transition-all duration-150 ease-out shadow-sm shadow-blue-500/50"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden print:pt-6 print:pb-4 print:border-none">
        {/* Glow backdrop effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none print:hidden" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none print:hidden" />

        <Container>
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6 print:hidden">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">Legal</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-blue-600 dark:hover:text-blue-400 font-semibold">
              {documentType === "privacy" ? "Privacy Policy" : "Terms of Service"}
            </span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-200 dark:border-blue-800">
                {documentType === "privacy" ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                )}
                <span>{documentType === "privacy" ? "Global Data Governance & Privacy" : "Legal Terms & Conditions"}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {title}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {subtitle}
              </p>
            </div>

            {/* Document Meta & Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 shrink-0 print:hidden">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 font-mono">
                <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Last Updated: <strong className="text-slate-900 dark:text-white">{lastUpdated}</strong></span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                  title="Print document"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast("Legal URL copied to clipboard", "success");
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                  title="Share legal document"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content & Sidebar TOC Layout */}
      <section className="py-12 lg:py-16">
        <Container>
          {/* Mobile Table of Contents Accordion */}
          <div className="lg:hidden mb-8 print:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-full p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm text-sm font-semibold text-slate-800 dark:text-slate-200"
            >
              <div className="flex items-center gap-2">
                <Menu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Jump to Section ({toc.length} Sections)</span>
              </div>
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <ChevronRight className="w-4 h-4 rotate-90" />}
            </button>

            {mobileMenuOpen && (
              <div className="mt-2 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-1 max-h-80 overflow-y-auto">
                {toc.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                      activeSection === item.id
                        ? "bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 font-bold"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                    }`}
                  >
                    <span>{idx + 1}. {item.title}</span>
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-mono">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Desktop Sticky Table of Contents Sidebar */}
            <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-4 print:hidden">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                    Table of Contents
                  </h2>
                  <span className="text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400">
                    {toc.length} Sections
                  </span>
                </div>

                <nav aria-label="Table of Contents" className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto pr-1 text-xs">
                  {toc.map((item, idx) => {
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all duration-150 flex items-center justify-between group cursor-pointer ${
                          isActive
                            ? "bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 font-bold shadow-xs border-l-4 border-blue-600"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100"
                        }`}
                      >
                        <span className="truncate pr-2">
                          <span className="font-mono opacity-60 mr-1.5">{idx + 1}.</span>
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Quick Legal Help Box */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-900 to-slate-900 text-white space-y-2 border border-blue-800/50 shadow-md">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Legal Compliance</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Have questions about our data practices or platform terms?
                </p>
                <Link
                  href={documentType === "privacy" ? "mailto:privacy@workorajobs.com" : "mailto:legal@workorajobs.com"}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-300 hover:text-white underline transition-colors"
                >
                  Contact Legal Team &rarr;
                </Link>
              </div>
            </aside>

            {/* Main Content Reader Area */}
            <main className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-12 prose dark:prose-invert max-w-none print:shadow-none print:border-none print:p-0 print:col-span-12">
              {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                  // Inject copy link helper if child has section ID
                  const sectionId = (child.props as any)?.id;
                  const sectionTitle = (child.props as any)?.["data-title"];

                  if (sectionId && sectionTitle) {
                    return (
                      <div id={sectionId} data-title={sectionTitle} className="scroll-mt-28 group relative">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => copyHeadingLink(sectionId, sectionTitle)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer print:hidden"
                              title="Copy link to section"
                            >
                              {copiedSection === sectionId ? (
                                <Check className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                            {child}
                          </div>
                        </div>
                      </div>
                    );
                  }
                }
                return child;
              })}
            </main>
          </div>
        </Container>
      </section>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/30 transition-all duration-200 z-40 active:scale-95 cursor-pointer print:hidden"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
