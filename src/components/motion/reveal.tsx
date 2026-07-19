"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

import { cn } from "@/lib/utils";

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  distance?: number;
};

export function Reveal({
  className,
  delay = 0,
  distance = 18,
  ...props
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      initial={shouldReduceMotion ? false : { opacity: 0, y: distance }}
      transition={{ delay, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, amount: 0.2 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      {...props}
    />
  );
}
