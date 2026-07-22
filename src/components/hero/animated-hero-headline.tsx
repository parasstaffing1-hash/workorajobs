"use client";

import { motion } from "framer-motion";

export function AnimatedHeroHeadline() {
  return (
    <div className="max-w-5xl mx-auto text-center">
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="font-bold tracking-tight text-slate-900 dark:text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.04] text-balance mb-6"
      >
        Hire Verified Tech Talent <br className="hidden sm:inline" />
        <span className="text-gradient-hero">Globally.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        className="text-slate-600 dark:text-slate-300 text-base sm:text-lg md:text-xl font-normal max-w-3xl mx-auto text-balance leading-relaxed"
      >
        WorkoraJobs is the global technology staffing and AI recruitment platform for engineering, product, and data teams. We help employers hire pre-vetted remote software engineers and enable candidates to secure top international tech careers with instant skill matching.
      </motion.p>
    </div>
  );
}
