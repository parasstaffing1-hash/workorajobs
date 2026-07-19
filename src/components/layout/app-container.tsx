import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  size?: "default" | "dashboard" | "narrow" | "form";
}

/**
 * Global AppContainer enforcing maximum layout width rules across all screen sizes.
 * - default: max-w-7xl (1280px)
 * - dashboard: max-w-[1400px]
 * - form: max-w-[850px]
 * - narrow: max-w-3xl (768px)
 */
export function AppContainer({
  children,
  className,
  size = "default",
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8 transition-all",
        size === "default" && "max-w-7xl",
        size === "dashboard" && "max-w-[1400px]",
        size === "form" && "max-w-[850px]",
        size === "narrow" && "max-w-3xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Standard PageContainer wrapping page sections with standard top/bottom spacing.
 */
export function PageContainer({
  children,
  className,
  size = "default",
  ...props
}: ContainerProps) {
  return (
    <main className={cn("min-h-screen py-8 sm:py-12 lg:py-16", className)} {...props}>
      <AppContainer size={size}>{children}</AppContainer>
    </main>
  );
}

/**
 * SectionContainer for individual visual blocks inside pages.
 */
export function SectionContainer({
  children,
  className,
  size = "default",
  ...props
}: ContainerProps) {
  return (
    <section className={cn("py-12 sm:py-16 lg:py-20", className)} {...props}>
      <AppContainer size={size}>{children}</AppContainer>
    </section>
  );
}
