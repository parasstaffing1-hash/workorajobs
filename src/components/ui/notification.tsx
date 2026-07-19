"use client";

import { CheckCircle2, Info, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NotificationProps = {
  message: string;
  tone?: "success" | "info";
  onDismiss?: () => void;
};

export function Notification({
  message,
  tone = "info",
  onDismiss,
}: NotificationProps) {
  const Icon = tone === "success" ? CheckCircle2 : Info;

  return (
    <div
      className={cn(
        "glass-panel animated-sheen flex items-start gap-3 rounded-lg border p-4 text-sm shadow-premium",
        tone === "success"
          ? "border-primary/25 text-foreground"
          : "border-border/70 text-foreground",
      )}
      role="status"
    >
      <Icon
        aria-hidden="true"
        className="mt-0.5 h-5 w-5 shrink-0 text-primary"
      />
      <p className="flex-1">{message}</p>
      {onDismiss ? (
        <Button
          aria-label="Dismiss notification"
          onClick={onDismiss}
          size="icon"
          type="button"
          variant="ghost"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  );
}
