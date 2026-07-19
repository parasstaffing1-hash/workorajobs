import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import typography from "@tailwindcss/typography";

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
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-geist-mono)", ...defaultTheme.fontFamily.mono],
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
  plugins: [typography],
};

export default config;
