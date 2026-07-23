"use client";

import { ProceduralGradientHero } from "@/components/hero/procedural-gradient-hero";

export function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      <ProceduralGradientHero
        headline=""
        subtitle=""
        columnCount={9}
        overlayOpacity={0.15}
        minHeight="100%"
        height="100%"
      />
    </div>
  );
}
