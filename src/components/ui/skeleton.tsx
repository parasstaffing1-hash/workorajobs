import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-secondary/80 shadow-sm before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-background/80 before:to-transparent",
        className,
      )}
      {...props}
    />
  );
}
