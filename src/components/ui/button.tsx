import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "accent";
type ButtonSize = "sm" | "md" | "lg" | "icon";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-b from-primary to-blue-700 text-primary-foreground shadow-premium hover:shadow-[0_22px_54px_-28px_hsl(var(--primary)/0.85)] focus-visible:shadow-focus-ring",
  secondary:
    "border border-border/70 bg-card/80 text-secondary-foreground shadow-sm backdrop-blur-xl hover:border-primary/30 hover:bg-secondary/80 focus-visible:shadow-focus-ring",
  ghost:
    "bg-transparent text-foreground hover:bg-secondary/80 hover:text-primary focus-visible:shadow-focus-ring",
  outline:
    "border border-border/70 bg-background/70 text-foreground shadow-sm backdrop-blur-xl hover:border-primary/40 hover:bg-card focus-visible:shadow-focus-ring",
  accent:
    "bg-gradient-to-b from-accent to-orange-600 text-accent-foreground shadow-[0_18px_52px_-32px_hsl(var(--accent)/0.9)] hover:shadow-[0_22px_62px_-34px_hsl(var(--accent)/0.95)] focus-visible:shadow-focus-ring",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
  icon: "h-10 w-10 p-0",
};

const base =
  "animated-sheen inline-flex shrink-0 items-center justify-center gap-2 rounded-md font-medium ring-offset-background transition-[background,border-color,box-shadow,color,transform] duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-50";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
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
