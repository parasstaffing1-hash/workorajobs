import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <Loader2
      aria-hidden="true"
      className={cn("h-5 w-5 animate-spin text-primary drop-shadow", className)}
    />
  );
}
