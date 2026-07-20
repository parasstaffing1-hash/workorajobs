"use client";

import { useEffect, useRef } from "react";

export function MotionBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let requestId: number;

    const handleMouseMove = (e: MouseEvent) => {
      requestId = window.requestAnimationFrame(() => {
        const x = e.clientX;
        const y = e.clientY;
        container.style.setProperty("--mouse-x", `${x}px`);
        container.style.setProperty("--mouse-y", `${y}px`);
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.cancelAnimationFrame(requestId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 -z-50 overflow-hidden bg-background transition-colors duration-500 noise-bg select-none"
    >
      {/* Slow floating atmospheric mesh blobs */}
      <div className="absolute top-[-10%] right-[-10%] h-[55vw] w-[55vw] animate-float-slow rounded-full bg-gradient-to-br from-blue-600/10 via-purple-600/8 to-transparent blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] h-[65vw] w-[65vw] animate-float-reverse rounded-full bg-gradient-to-tr from-indigo-600/10 via-pink-500/8 to-transparent blur-3xl" />
      <div className="absolute top-[35%] left-[25%] h-[40vw] w-[40vw] animate-float-medium rounded-full bg-gradient-to-r from-sky-500/8 via-blue-600/5 to-transparent blur-3xl" />

      {/* Floating Geometric Parallax Orbs & Toruses */}
      <div className="absolute top-[18%] left-[8%] w-32 h-32 rounded-full border border-blue-500/20 bg-blue-500/5 backdrop-blur-3xl animate-shape-float-1" />
      <div className="absolute top-[55%] right-[6%] w-44 h-44 rounded-3xl border border-purple-500/20 bg-purple-500/5 backdrop-blur-3xl rotate-12 animate-shape-float-2" />

      {/* Interactive mouse follow cursor glow */}
      <div
        className="absolute h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/8 blur-[120px] transition-opacity duration-300 gpu-accelerated"
        style={{
          left: "var(--mouse-x, -999px)",
          top: "var(--mouse-y, -999px)",
        }}
      />
    </div>
  );
}
