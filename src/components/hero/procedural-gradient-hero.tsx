"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";

export interface ProceduralGradientHeroProps {
  headline?: string;
  subtitle?: string;
  children?: React.ReactNode;
  colors?: string[];
  columnCount?: number;
  animationSpeed?: "slow" | "normal" | "fast";
  overlayOpacity?: number;
  height?: string;
  minHeight?: string;
  pauseWhenOffscreen?: boolean;
  reducedMotionMode?: boolean;
  className?: string;
}

// WorkoraJobs Procedural Brand Palette
const defaultColors = [
  "#169FE3", // Bright blue
  "#65C7F7", // Sky blue
  "#C6EAF8", // Pale blue
  "#075985", // Deep blue
  "#062438", // Navy
  "#03141F", // Near-black blue
];

// Deterministic Column & Stack Panel Configuration (No Math.random during render)
const deterministicColumnConfigs = [
  {
    direction: "up" as const,
    durationFactor: 1.0,
    delay: "0s",
    panels: [
      { from: "#169FE3", to: "#075985", height: "280px" },
      { from: "#65C7F7", to: "#062438", height: "320px" },
      { from: "#075985", to: "#03141F", height: "260px" },
      { from: "#C6EAF8", to: "#169FE3", height: "300px" },
    ],
  },
  {
    direction: "down" as const,
    durationFactor: 1.3,
    delay: "-2s",
    panels: [
      { from: "#062438", to: "#65C7F7", height: "340px" },
      { from: "#169FE3", to: "#03141F", height: "270px" },
      { from: "#C6EAF8", to: "#075985", height: "310px" },
      { from: "#075985", to: "#169FE3", height: "290px" },
    ],
  },
  {
    direction: "up" as const,
    durationFactor: 1.6,
    delay: "-1s",
    panels: [
      { from: "#65C7F7", to: "#075985", height: "300px" },
      { from: "#03141F", to: "#169FE3", height: "330px" },
      { from: "#062438", to: "#C6EAF8", height: "280px" },
      { from: "#169FE3", to: "#062438", height: "310px" },
    ],
  },
  {
    direction: "static" as const,
    durationFactor: 2.0,
    delay: "-4s",
    panels: [
      { from: "#075985", to: "#03141F", height: "310px" },
      { from: "#169FE3", to: "#65C7F7", height: "290px" },
      { from: "#062438", to: "#075985", height: "340px" },
      { from: "#C6EAF8", to: "#169FE3", height: "270px" },
    ],
  },
  {
    direction: "down" as const,
    durationFactor: 0.9,
    delay: "-3s",
    panels: [
      { from: "#169FE3", to: "#C6EAF8", height: "320px" },
      { from: "#075985", to: "#062438", height: "300px" },
      { from: "#65C7F7", to: "#03141F", height: "330px" },
      { from: "#03141F", to: "#169FE3", height: "280px" },
    ],
  },
  {
    direction: "up" as const,
    durationFactor: 1.2,
    delay: "-1.5s",
    panels: [
      { from: "#062438", to: "#169FE3", height: "290px" },
      { from: "#C6EAF8", to: "#075985", height: "310px" },
      { from: "#03141F", to: "#65C7F7", height: "340px" },
      { from: "#075985", to: "#062438", height: "280px" },
    ],
  },
  {
    direction: "down" as const,
    durationFactor: 1.5,
    delay: "-2.5s",
    panels: [
      { from: "#65C7F7", to: "#03141F", height: "330px" },
      { from: "#169FE3", to: "#075985", height: "280px" },
      { from: "#062438", to: "#C6EAF8", height: "320px" },
      { from: "#075985", to: "#169FE3", height: "300px" },
    ],
  },
  {
    direction: "up" as const,
    durationFactor: 1.1,
    delay: "-0.5s",
    panels: [
      { from: "#075985", to: "#65C7F7", height: "310px" },
      { from: "#03141F", to: "#169FE3", height: "290px" },
      { from: "#C6EAF8", to: "#062438", height: "330px" },
      { from: "#169FE3", to: "#075985", height: "280px" },
    ],
  },
  {
    direction: "down" as const,
    durationFactor: 1.4,
    delay: "-3.5s",
    panels: [
      { from: "#169FE3", to: "#062438", height: "300px" },
      { from: "#65C7F7", to: "#075985", height: "340px" },
      { from: "#03141F", to: "#C6EAF8", height: "270px" },
      { from: "#075985", to: "#169FE3", height: "320px" },
    ],
  },
];

export function ProceduralGradientHero({
  headline = "Find work.\nBuild your future.",
  subtitle = "Explore verified jobs and enterprise companies hiring worldwide.",
  children,
  colors = defaultColors,
  columnCount = 9,
  animationSpeed = "normal",
  overlayOpacity = 0.14,
  height = "auto",
  minHeight = "640px",
  reducedMotionMode,
  className = "",
}: ProceduralGradientHeroProps) {
  const [isReduced, setIsReduced] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      setIsReduced(reducedMotionMode ?? media.matches);
    }
  }, [reducedMotionMode]);

  // Speed multiplier
  const baseDuration = animationSpeed === "slow" ? 12 : animationSpeed === "fast" ? 5 : 8;

  // Selected columns derived deterministically from columnCount
  const activeColumns = useMemo(() => {
    return Array.from({ length: Math.min(columnCount, 9) }, (_, i) => {
      return deterministicColumnConfigs[i % deterministicColumnConfigs.length];
    });
  }, [columnCount]);

  return (
    <section
      className={`relative w-full overflow-hidden flex flex-col items-center justify-center ${className}`}
      style={{ minHeight, height }}
    >
      {/* Background Tiled Column Layer (Decorative, pointer-events-none) */}
      <div
        className="absolute inset-0 flex w-full h-full overflow-hidden pointer-events-none select-none z-0"
        aria-hidden="true"
      >
        {activeColumns.map((col, colIdx) => {
          const totalDuration = baseDuration * col.durationFactor;
          const initialY = col.direction === "down" ? "-50%" : "0%";
          const targetY = col.direction === "down" ? "0%" : "-50%";

          return (
            <div
              key={colIdx}
              className="flex-1 h-full relative overflow-hidden flex flex-col"
              style={{
                borderRight: colIdx < activeColumns.length - 1 ? "1px solid rgba(255, 255, 255, 0.05)" : "none",
              }}
            >
              {isReduced ? (
                /* Static Tiled Panels for Reduced Motion */
                <div className="w-full h-full flex flex-col">
                  {col.panels.slice(0, 3).map((panel, pIdx) => (
                    <div
                      key={pIdx}
                      className="w-full flex-1"
                      style={{
                        background: `linear-gradient(180deg, ${panel.from}, ${panel.to})`,
                      }}
                    />
                  ))}
                </div>
              ) : (
                /* Infinite Seamless Vertically Translating Track */
                <motion.div
                  initial={{ y: initialY }}
                  animate={{
                    y: col.direction === "static" ? ["0%", "-10%", "0%"] : [initialY, targetY],
                  }}
                  transition={{
                    duration: totalDuration,
                    repeat: Infinity,
                    repeatType: col.direction === "static" ? "mirror" : "loop",
                    ease: "linear",
                  }}
                  style={{ willChange: "transform" }}
                  className="w-full flex flex-col shrink-0"
                >
                  {/* Track 1 */}
                  {col.panels.map((panel, pIdx) => (
                    <div
                      key={`track1-${pIdx}`}
                      className="w-full shrink-0"
                      style={{
                        height: panel.height,
                        background: `linear-gradient(180deg, ${panel.from}, ${panel.to})`,
                      }}
                    />
                  ))}
                  {/* Duplicated Track 2 for 100% Seamless Infinite Loop */}
                  {col.panels.map((panel, pIdx) => (
                    <div
                      key={`track2-${pIdx}`}
                      className="w-full shrink-0"
                      style={{
                        height: panel.height,
                        background: `linear-gradient(180deg, ${panel.from}, ${panel.to})`,
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* Dark Translucent Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `rgba(3, 20, 31, ${overlayOpacity})`,
        }}
        aria-hidden="true"
      />

      {/* Specular Radial Mask & Mesh Grid */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_70%,transparent_100%)] opacity-50 pointer-events-none z-10"
        aria-hidden="true"
      />

      {/* Foreground Content Layer (Highest Priority z-20) */}
      <div className="relative z-20 w-full max-w-5xl mx-auto px-4 py-16 sm:py-24 text-center flex flex-col items-center">
        {/* Real Semantic H1 Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white drop-shadow-lg leading-[1.08] whitespace-pre-line">
          {headline}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="mt-4 sm:mt-6 text-base sm:text-xl text-slate-100 max-w-2xl font-medium drop-shadow leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* Search Bar / Children */}
        {children && <div className="w-full mt-6 sm:mt-8">{children}</div>}
      </div>
    </section>
  );
}
