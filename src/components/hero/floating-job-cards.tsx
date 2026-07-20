"use client";

import { Sparkles, Building2, MapPin, DollarSign } from "lucide-react";

export function FloatingJobCards() {
  const cards = [
    {
      role: "Senior Staff Engineer",
      company: "Vercel",
      logoBg: "bg-black text-white dark:bg-white dark:text-black",
      location: "San Francisco / Remote",
      salary: "$220k - $260k",
      match: "99% Match",
      badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
      animClass: "animate-levitate-1",
      positionClass: "hidden lg:flex top-20 -left-6 xl:-left-16",
    },
    {
      role: "Lead Product Designer",
      company: "Stripe",
      logoBg: "bg-indigo-600 text-white",
      location: "New York / Remote",
      salary: "$195k - $230k",
      match: "98% Match",
      badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
      animClass: "animate-levitate-2",
      positionClass: "hidden lg:flex top-48 -right-6 xl:-right-16",
    },
    {
      role: "AI Infrastructure Lead",
      company: "Apple",
      logoBg: "bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900",
      location: "Cupertino, CA",
      salary: "$245k - $290k",
      match: "100% Match",
      badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
      animClass: "animate-levitate-3",
      positionClass: "hidden xl:flex bottom-16 -left-12",
    },
  ];

  return (
    <>
      {cards.map((card, i) => (
        <div
          key={i}
          className={`absolute ${card.positionClass} ${card.animClass} z-30 w-72 glass-hero-card rounded-2xl p-4 shadow-xl hover:shadow-2xl border border-slate-200/80 dark:border-white/10 hover:border-blue-500/50 hover:scale-105 transition-all duration-200 cursor-pointer pointer-events-auto`}
        >
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-xl ${card.logoBg} font-bold text-xs flex items-center justify-center shadow-xs shrink-0`}>
                {card.company[0]}
              </div>
              <div>
                <h5 className="font-semibold text-xs text-slate-900 dark:text-white">
                  {card.company}
                </h5>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5" />
                  {card.location}
                </span>
              </div>
            </div>

            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${card.badgeColor} flex items-center gap-1`}>
              <Sparkles className="w-2.5 h-2.5" />
              {card.match}
            </span>
          </div>

          <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-2">
            {card.role}
          </h4>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-white/5 font-mono">
            <span className="flex items-center text-slate-700 dark:text-slate-200 font-semibold">
              <DollarSign className="w-3 h-3 text-emerald-500" />
              {card.salary}
            </span>
            <span className="text-[10px] text-blue-500 font-sans font-medium hover:underline">
              Apply Instant →
            </span>
          </div>
        </div>
      ))}
    </>
  );
}
