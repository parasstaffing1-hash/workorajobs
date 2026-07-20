"use client";

import { useState } from "react";
import { useScroll, useMotionValueEvent, motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, X } from "lucide-react";
import Link from "next/link";

export function StickyCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 450 && !dismissed) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 z-40 max-w-md w-full pointer-events-auto select-none"
        >
          <div className="glass-card-enterprise p-4 rounded-2xl border border-blue-500/40 shadow-2xl flex items-center justify-between gap-3 bg-slate-900/90 text-white backdrop-blur-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>

              <div>
                <h4 className="font-bold text-xs text-white">Need Pre-Vetted Talent?</h4>
                <p className="text-[11px] text-slate-300">2,480+ engineers ready to deploy in 15 minutes.</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/recruiter">
                <button
                  type="button"
                  className="h-9 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-1 shadow-sm transition-all duration-200 cursor-pointer shrink-0"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </Link>

              <button
                type="button"
                onClick={() => setDismissed(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Dismiss sticky bar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
