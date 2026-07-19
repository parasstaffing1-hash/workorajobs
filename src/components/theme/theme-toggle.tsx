"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("workora-theme", next ? "dark" : "light");
  }

  const Icon = isDark ? Sun : Moon;

  return (
    <Button
      aria-label="Toggle theme"
      onClick={toggleTheme}
      size="icon"
      type="button"
      variant="ghost"
    >
      <Icon aria-hidden="true" className="h-5 w-5" />
    </Button>
  );
}
