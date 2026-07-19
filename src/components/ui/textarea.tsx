import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full rounded-md border border-input/80 bg-card/80 px-3 py-3 text-sm text-foreground shadow-sm outline-none backdrop-blur-xl transition-[border-color,box-shadow,background-color] duration-300 placeholder:text-muted-foreground focus:border-primary/60 focus-visible:shadow-focus-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
