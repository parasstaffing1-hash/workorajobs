import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import typography from "@tailwindcss/typography";
import forms from "@tailwindcss/forms";
import containerQueries from "@tailwindcss/container-queries";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/data/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1180px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "on-secondary-fixed": "#1c1b1b",
        "surface-container": "#e7eefe",
        "on-surface": "#151c27",
        "tertiary-container": "#a44100",
        "on-primary-container": "#dad7ff",
        "on-primary": "#ffffff",
        "surface-container-high": "#e2e8f8",
        "outline-variant": "#c7c4d8",
        "on-tertiary": "#ffffff",
        "surface-tint": "#4d44e3",
        "primary-container": "#4f46e5",
        "on-error-container": "#93000a",
        "on-tertiary-fixed": "#351000",
        "inverse-primary": "#c3c0ff",
        "error": "#ba1a1a",
        "surface-dim": "#d3daea",
        "secondary-fixed": "#e5e2e1",
        "secondary-fixed-dim": "#c8c6c5",
        "primary-fixed-dim": "#c3c0ff",
        "on-secondary": "#ffffff",
        "surface-variant": "#dce2f3",
        "on-primary-fixed": "#0f0069",
        "outline": "#777587",
        "secondary-container": "#e5e2e1",
        "surface-container-highest": "#dce2f3",
        "tertiary": "#7e3000",
        "on-error": "#ffffff",
        "inverse-surface": "#2a313d",
        "surface": "#f9f9ff",
        "tertiary-fixed": "#ffdbcc",
        "surface-container-low": "#f0f3ff",
        "inverse-on-surface": "#ebf1ff",
        "on-secondary-fixed-variant": "#474646",
        "surface-bright": "#f9f9ff",
        "primary-fixed": "#e2dfff",
        "on-background": "#151c27",
        "on-primary-fixed-variant": "#3323cc",
        "on-surface-variant": "#464555",
        "tertiary-fixed-dim": "#ffb695",
        "on-tertiary-container": "#ffd2be",
        "on-tertiary-fixed-variant": "#7b2f00",
        "surface-container-lowest": "#ffffff",
        "error-container": "#ffdad6",
      },
      fontFamily: {
        h1: ["var(--font-jakarta)"],
        "label-caps": ["var(--font-jakarta)"],
        "body-sm": ["var(--font-jakarta)"],
        "body-lg": ["var(--font-jakarta)"],
        "h1-mobile": ["var(--font-jakarta)"],
        h3: ["var(--font-jakarta)"],
        h2: ["var(--font-jakarta)"],
        sans: ["var(--font-geist-sans)", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-geist-mono)", ...defaultTheme.fontFamily.mono],
      },
      fontSize: {
        h1: ["48px", { lineHeight: "1.1", letterSpacing: "-0.04em", fontWeight: "700" }],
        "label-caps": ["12px", { lineHeight: "1", letterSpacing: "0.05em", fontWeight: "600" }],
        "body-sm": ["15px", { lineHeight: "1.5", letterSpacing: "0em", fontWeight: "400" }],
        "body-lg": ["18px", { lineHeight: "1.6", letterSpacing: "-0.01em", fontWeight: "400" }],
        "h1-mobile": ["32px", { lineHeight: "1.2", letterSpacing: "-0.03em", fontWeight: "700" }],
        h3: ["24px", { lineHeight: "1.3", letterSpacing: "-0.02em", fontWeight: "600" }],
        h2: ["32px", { lineHeight: "1.2", letterSpacing: "-0.03em", fontWeight: "600" }],
      },
      boxShadow: {
        "soft-lg": "0 24px 80px -48px rgb(15 23 42 / 0.45)",
        premium:
          "0 24px 80px -42px rgb(15 23 42 / 0.45), 0 8px 28px -18px rgb(37 99 235 / 0.45)",
        "premium-dark":
          "0 32px 96px -48px rgb(0 0 0 / 0.8), 0 0 0 1px rgb(255 255 255 / 0.06)",
        "focus-ring": "0 0 0 4px hsl(var(--ring) / 0.22)",
      },
      backgroundImage: {
        "grid-light":
          "linear-gradient(to right, hsl(var(--border) / 0.45) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border) / 0.45) 1px, transparent 1px)",
        "premium-mesh":
          "linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--secondary)) 42%, hsl(var(--background)) 100%)",
      },
      keyframes: {
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "soft-pulse": {
          "0%, 100%": { opacity: "0.72", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.015)" },
        },
        "gradient-pan": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "sheen-sweep": {
          "0%": { transform: "translateX(-120%) skewX(-18deg)" },
          "100%": { transform: "translateX(220%) skewX(-18deg)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.8s infinite",
        float: "float 6s ease-in-out infinite",
        "soft-pulse": "soft-pulse 8s ease-in-out infinite",
        "gradient-pan": "gradient-pan 12s ease-in-out infinite",
        "sheen-sweep": "sheen-sweep 2.8s ease-in-out infinite",
      },
    },
  },
  plugins: [typography, forms, containerQueries],
};

export default config;
