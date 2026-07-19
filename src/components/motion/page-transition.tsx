"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.main
      animate={{ opacity: 1, y: 0, scale: 1 }}
      id="main-content"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 10, scale: 0.996 }}
      key={pathname}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.main>
  );
}
