"use client";

import { Award, Flame, Sparkles, Trophy, Zap } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type GamificationState = {
  xp: number;
  level: number;
  streak: number;
  badges: string[];
};

const DEFAULT_GAMIFICATION: GamificationState = {
  xp: 1250,
  level: 4,
  streak: 5,
  badges: ["Resume Architect", "ATS Master", "Sourcing Ninja", "STAR Interviewer"],
};

export function GamificationHeader({ className }: { className?: string }) {
  const [state, setState] = useState<GamificationState>(DEFAULT_GAMIFICATION);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("workora_gamification_state");
      if (saved) {
        setState(JSON.parse(saved));
      }
    } catch {
      // Ignore fallback
    }
  }, []);

  const levelProgress = Math.min(100, (state.xp % 500) / 5);

  return (
    <div
      className={cn(
        "rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-background to-accent/10 p-4 sm:p-5 shadow-sm",
        className,
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Level & XP */}
        <div className="flex items-center gap-3">
          <div className="relative grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground font-black text-lg shadow-md">
            Lvl {state.level}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-400 text-[9px] font-bold text-black">
              ★
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                Career XP Master
                <Badge className="bg-primary/10 text-primary text-[10px]">
                  {state.xp} XP
                </Badge>
              </h4>
            </div>
            {/* Progress bar */}
            <div className="mt-1.5 h-2 w-48 sm:w-56 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-violet-500 transition-all duration-500"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {500 - (state.xp % 500)} XP to Level {state.level + 1}
            </p>
          </div>
        </div>

        {/* Streaks & Badges */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Daily Streak */}
          <div className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-amber-600 dark:text-amber-400 font-bold text-xs">
            <Flame className="h-4 w-4 animate-bounce text-amber-500" />
            <span>{state.streak} Day Streak!</span>
          </div>

          {/* Badges Pill */}
          <div className="flex items-center gap-1.5">
            {state.badges.slice(0, 3).map((badge) => (
              <Badge
                key={badge}
                className="bg-secondary/80 text-foreground border border-border/80 text-[10px] gap-1 px-2.5 py-1"
              >
                <Trophy className="h-3 w-3 text-amber-500" />
                {badge}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function triggerConfetti() {
  if (typeof window === "undefined") return;
  const count = 40;
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.left = "0";
  container.style.width = "100vw";
  container.style.height = "100vh";
  container.style.pointerEvents = "none";
  container.style.zIndex = "99999";
  document.body.appendChild(container);

  const colors = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ec4899"];

  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.style.position = "absolute";
    p.style.left = `${Math.random() * 100}vw`;
    p.style.top = "-20px";
    p.style.width = `${Math.random() * 8 + 6}px`;
    p.style.height = `${Math.random() * 14 + 8}px`;
    p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    p.style.borderRadius = "3px";
    p.style.transform = `rotate(${Math.random() * 360}deg)`;
    p.style.transition = `all ${Math.random() * 1.5 + 1.5}s ease-out`;
    container.appendChild(p);

    setTimeout(() => {
      p.style.top = `${Math.random() * 50 + 70}vh`;
      p.style.left = `${parseFloat(p.style.left) + (Math.random() * 100 - 50)}px`;
      p.style.opacity = "0";
      p.style.transform = `rotate(${Math.random() * 720}deg)`;
    }, 50);
  }

  setTimeout(() => {
    container.remove();
  }, 3000);
}
