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
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 px-4 py-8 backdrop-blur-md gpu-accelerated"
          exit={{ opacity: 0 }}
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          role="dialog"
          transition={{ duration: 0.2 }}
        >
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="glass-panel w-full max-w-lg rounded-2xl border border-slate-200/80 dark:border-white/10 p-6 shadow-2xl gpu-accelerated"
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            initial={
              shouldReduceMotion ? false : { opacity: 0, scale: 0.94, y: 16 }
            }
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 320,
            }}
          >
            <div className="flex items-center justify-between gap-4 border-b border-slate-200/50 dark:border-white/5 pb-4">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h2>
              <Button
                aria-label="Close modal"
                onClick={onClose}
                size="icon"
                type="button"
                variant="ghost"
                className="rounded-full"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </Button>
            </div>
            <div className={cn("mt-4 text-sm text-slate-600 dark:text-slate-300")}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
