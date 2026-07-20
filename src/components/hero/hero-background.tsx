"use client";

export function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Radial Gradient Ambient Orbs */}
      <div className="absolute -top-[10%] left-[15%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-blue-600/20 to-purple-600/10 blur-[130px] animate-mesh-pulse" />
      <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-indigo-500/15 via-pink-500/10 to-transparent blur-[120px] animate-mesh-pulse [animation-delay:4s]" />
      <div className="absolute bottom-[0%] left-[30%] w-[700px] h-[450px] rounded-full bg-gradient-to-r from-violet-600/10 via-sky-500/15 to-transparent blur-[140px] animate-mesh-pulse [animation-delay:7s]" />

      {/* SVG Precision Tech Grid Pattern (Linear/Vercel Aesthetic) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-70" />

      {/* Subtle Specular Top Beam */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
    </div>
  );
}
