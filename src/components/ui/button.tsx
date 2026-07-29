"use client";

import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  MouseEvent,
  ReactNode,
} from "react";
import { useState } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "accent" | "glass" | "destructive";
type ButtonSize = "sm" | "md" | "lg" | "icon";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-b from-blue-600 to-blue-700 text-white font-bold shadow-md shadow-blue-500/20 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
  secondary:
    "border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold hover:bg-slate-200 dark:hover:bg-slate-700 focus-visible:ring-2 focus-visible:ring-slate-400",
  ghost:
    "bg-transparent text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 focus-visible:ring-2 focus-visible:ring-slate-400",
  outline:
    "border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-blue-500",
  accent:
    "bg-gradient-to-b from-amber-500 to-orange-600 text-white font-bold shadow-md shadow-orange-500/20 hover:from-amber-600 hover:to-orange-700 focus-visible:ring-2 focus-visible:ring-orange-500",
  glass:
    "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 text-slate-900 dark:text-white font-bold shadow-sm hover:bg-white dark:hover:bg-slate-900",
  destructive:
    "bg-red-600 text-white font-bold hover:bg-red-700 shadow-sm focus-visible:ring-2 focus-visible:ring-red-500",
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-[38px] px-3.5 text-xs rounded-xl",
  md: "min-h-[44px] px-4 text-xs sm:text-sm rounded-xl",
  lg: "min-h-[48px] px-6 text-sm sm:text-base rounded-2xl",
  icon: "min-h-[44px] min-w-[44px] p-0 rounded-xl flex items-center justify-center",
};

const base =
  "btn-ripple-container inline-flex shrink-0 items-center justify-center gap-2 font-bold tracking-tight transition-all duration-200 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none gpu-layer";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

type Ripple = {
  x: number;
  y: number;
  size: number;
  id: number;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  onClick,
  children,
  ...props
}: ButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rippleSize = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - rippleSize / 2;
    const y = e.clientY - rect.top - rippleSize / 2;

    const newRipple = { x, y, size: rippleSize, id: Date.now() };
    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    if (onClick) onClick(e);
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      onClick={handleClick}
      {...props}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="btn-ripple"
          style={{
            top: ripple.y,
            left: ripple.x,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}
    </button>
  );
}

export type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  href,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(base, variants[variant], sizes[size], className)}
      href={href}
      {...props}
    >
      {children}
    </Link>
  );
}
