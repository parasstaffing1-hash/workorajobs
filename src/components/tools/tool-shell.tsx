"use client";

import React, { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Copy, 
  Download, 
  Printer, 
  Share2, 
  RotateCcw, 
  History,
  FileText,
  Check,
  Search,
  BookOpen
} from "lucide-react";
import { getToolsByCategory, categories, getCategoryBySlug, ToolMeta, searchTools } from "@/lib/tools/registry";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ToolShellProps {
  tool: ToolMeta;
  children: ReactNode;
  onReset?: () => void;
  onRun?: () => void;
  exampleInput?: any;
  onLoadExample?: (example: any) => void;
}

export function ToolShell({
  tool,
  children,
  onReset,
  onRun,
  exampleInput,
  onLoadExample
}: ToolShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        onRun?.();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        onReset?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onRun, onReset]);

  // Load history from localStorage
  useEffect(() => {
    const key = `tool-hist-${tool.slug}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (err) {}
    }
  }, [tool.slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const category = getCategoryBySlug(tool.category);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Back link */}
      <div className="mb-6">
        <Link href={`/tools/${tool.category}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to {category?.name || "Category"}
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/70 pb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">{tool.name}</h1>
              <p className="mt-2 text-base text-muted-foreground">{tool.description}</p>
            </div>
            
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              {exampleInput && onLoadExample && (
                <Button variant="outline" size="sm" onClick={() => onLoadExample(exampleInput)}>
                  <BookOpen className="h-4 w-4" />
                  Load Example
                </Button>
              )}
              {onReset && (
                <Button variant="ghost" size="sm" onClick={onReset}>
                  <RotateCcw className="h-4 w-4" />
                  Reset (Ctrl+K)
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={handleShare}>
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Share2 className="h-4 w-4" />}
                {copied ? "Copied Link" : "Share URL"}
              </Button>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-lg border border-border/70">
            {children}
          </div>
        </div>

        {/* Sidebar Nav */}
        <div className="space-y-6">
          <div className="glass-panel p-4 rounded-lg border border-border/70">
            <h3 className="font-semibold text-sm mb-4 px-2 text-muted-foreground">TOOL CATEGORIES</h3>
            <nav className="space-y-1">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/tools/${cat.slug}`}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    tool.category === cat.slug
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                  )}
                >
                  {cat.name}
                  <span className="text-xs px-2 py-0.5 rounded bg-secondary text-muted-foreground">
                    {getToolsByCategory(cat.slug).length}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
