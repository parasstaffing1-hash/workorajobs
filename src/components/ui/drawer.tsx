"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DrawerSide = "right" | "left" | "bottom";

type DrawerProps = {
  open: boolean;
  title?: string;
  side?: DrawerSide;
  children: ReactNode;
  onClose: () => void;
};

export function Drawer({
  open,
  title,
  side = "right",
  children,
  onClose,
}: DrawerProps) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  const slideVariants = {
    right: {
      initial: { x: "100%", y: 0 },
      animate: { x: 0, y: 0 },
      exit: { x: "100%", y: 0 },
      containerClass: "top-0 right-0 h-full w-full max-w-md border-l",
    },
    left: {
      initial: { x: "-100%", y: 0 },
      animate: { x: 0, y: 0 },
      exit: { x: "-100%", y: 0 },
      containerClass: "top-0 left-0 h-full w-full max-w-md border-r",
    },
    bottom: {
      initial: { x: 0, y: "100%" },
      animate: { x: 0, y: 0 },
      exit: { x: 0, y: "100%" },
      containerClass: "bottom-0 left-0 right-0 w-full max-h-[85vh] border-t rounded-t-3xl",
    },
  };

  const currentVariant = slideVariants[side];

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm gpu-accelerated"
          />

          {/* Drawer Container */}
          <motion.div
            initial={shouldReduceMotion ? false : currentVariant.initial}
            animate={currentVariant.animate}
            exit={currentVariant.exit}
            transition={{
              type: "spring",
              damping: 28,
              stiffness: 300,
            }}
            className={cn(
              "absolute bg-background/95 backdrop-blur-2xl border-slate-200/80 dark:border-white/10 p-6 shadow-2xl flex flex-col gpu-accelerated",
              currentVariant.containerClass
            )}
          >
            <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-white/5 pb-4 mb-4">
              {title ? (
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
              ) : <div />}
              <Button
                aria-label="Close drawer"
                onClick={onClose}
                size="icon"
                type="button"
                variant="ghost"
                className="rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
