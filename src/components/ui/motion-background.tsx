"use client";

import { useEffect, useRef } from "react";

export function MotionBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      container.style.setProperty("--mouse-x", `${x}px`);
      container.style.setProperty("--mouse-y", `${y}px`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 -z-50 overflow-hidden bg-background/50 transition-colors duration-500"
    >
      {/* Slow floating atmospheric blobs */}
      <div className="absolute top-[-10%] right-[-10%] h-[55vw] w-[55vw] animate-float-slow rounded-full bg-gradient-to-br from-primary/10 via-violet-500/8 to-transparent blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] h-[65vw] w-[65vw] animate-float-reverse rounded-full bg-gradient-to-tr from-violet-500/10 via-accent/8 to-transparent blur-3xl" />
      <div className="absolute top-[30%] left-[20%] h-[40vw] w-[40vw] animate-float-medium rounded-full bg-gradient-to-r from-accent/6 via-primary/4 to-transparent blur-3xl" />

      {/* Interactive mouse follow cursor glow */}
      <div
        className="absolute h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px] transition-opacity duration-500"
        style={{
          left: "var(--mouse-x, -999px)",
          top: "var(--mouse-y, -999px)",
        }}
      />
    </div>
  );
}
