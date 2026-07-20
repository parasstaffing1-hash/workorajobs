"use client";

import { useEffect, useState } from "react";
import { Users, Zap, Clock, DollarSign } from "lucide-react";

export function LiveHiringMetrics() {
  const [candidatesCount, setCandidatesCount] = useState(2480);
  const [isLivePulse, setIsLivePulse] = useState(true);

  // Subtle live counter tick animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCandidatesCount((prev) => prev + (Math.random() > 0.6 ? 1 : 0));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const metrics = [
    {
      icon: Users,
      value: `${candidatesCount.toLocaleString()}+`,
      label: "Pre-Vetted Candidates",
      pulse: true,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      icon: Zap,
      value: "98.4%",
      label: "AI Match Precision",
      pulse: false,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      icon: Clock,
      value: "14.8m",
      label: "Avg. Time-to-Hire",
      pulse: false,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      icon: DollarSign,
      value: "$4.2M+",
      label: "Placed Comp Volume",
      pulse: false,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto my-10 relative z-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 px-2 sm:px-0">
        {metrics.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="glass-hero-card rounded-2xl p-4 sm:p-5 flex flex-col items-start hover:border-blue-500/40 hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between w-full mb-3">
                <div className={`p-2 rounded-xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                {item.pulse && (
                  <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    LIVE
                  </span>
                )}
              </div>

              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-0.5">
                {item.value}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
