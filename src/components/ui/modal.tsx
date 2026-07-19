"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ModalProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
};

export function Modal({ open, title, children, onClose }: ModalProps) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          animate={{ opacity: 1 }}
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center bg-foreground/50 px-4 py-8 backdrop-blur-md"
          exit={{ opacity: 0 }}
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          role="dialog"
          transition={{ duration: 0.24 }}
        >
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="glass-panel w-full max-w-lg rounded-lg border border-border/70 p-6 shadow-premium"
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            initial={
              shouldReduceMotion ? false : { opacity: 0, scale: 0.98, y: 12 }
            }
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
              <Button
                aria-label="Close modal"
                onClick={onClose}
                size="icon"
                type="button"
                variant="ghost"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </Button>
            </div>
            <div className={cn("mt-4 text-sm text-muted-foreground")}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
