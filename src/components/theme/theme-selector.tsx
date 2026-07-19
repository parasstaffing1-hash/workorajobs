"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const THEMES = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "blue", label: "Blue" },
  { value: "purple", label: "Purple" },
];

export function ThemeSelector() {
  const [theme, setTheme] = useState<string>("light");

  // Load saved theme
  useEffect(() => {
    const stored = localStorage.getItem("workora-theme");
    if (stored && THEMES.some(t => t.value === stored)) {
      setTheme(stored);
      applyTheme(stored);
    } else {
      applyTheme("light");
    }
  }, []);

  const applyTheme = (selected: string) => {
    const html = document.documentElement;
    THEMES.forEach(t => html.classList.remove(t.value));
    html.classList.add(selected);
    localStorage.setItem("workora-theme", selected);
  };

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setTheme(selected);
    applyTheme(selected);
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="theme-select" className="text-sm font-medium">Theme:</label>
      <select
        id="theme-select"
        value={theme}
        onChange={onChange}
        className="rounded border p-1"
      >
        {THEMES.map(t => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>
    </div>
  );
}
