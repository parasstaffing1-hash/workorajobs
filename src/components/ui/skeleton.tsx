import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-skeleton-shimmer rounded-lg bg-slate-200/80 dark:bg-slate-800/80 gpu-accelerated shrink-0",
        className,
      )}
      {...props}
    />
  );
}
