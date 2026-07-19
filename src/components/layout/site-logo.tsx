import Link from "next/link";

import { cn } from "@/lib/utils";

export function SiteLogo({ className }: { className?: string }) {
  return (
    <Link
      aria-label="Workora Jobs home"
      className={cn(
        "group inline-flex items-center gap-3 rounded-md outline-none transition-transform duration-300 hover:-translate-y-0.5 focus-visible:shadow-focus-ring",
        className,
      )}
      href="/"
    >
      <span className="animated-sheen grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-primary via-blue-600 to-[hsl(var(--violet))] text-sm font-bold text-primary-foreground shadow-premium transition-transform duration-300 group-hover:scale-105">
        W
      </span>
      <span className="text-base font-semibold tracking-tight transition-colors group-hover:text-primary">
        Workora Jobs
      </span>
    </Link>
  );
}
