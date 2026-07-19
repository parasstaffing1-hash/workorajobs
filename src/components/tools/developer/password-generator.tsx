"use client";

import React, { useState } from "react";
import { ToolShell } from "../tool-shell";
import { Button } from "@/components/ui/button";

export default function PasswordGeneratorTool() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  const generatePassword = () => {
    let charset = "";
    if (includeUpper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLower) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    if (!charset) {
      alert("Please select at least one character set.");
      return;
    }

    let result = "";
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
  };

  return (
    <ToolShell
      tool={{
        slug: "password-generator",
        name: "Password Generator",
        description: "Generate highly secure random passwords with configurable parameters.",
        category: "developer",
        keywords: []
      }}
      exampleInput={null}
      onReset={() => {
        setPassword("");
        setLength(16);
        setIncludeUpper(true);
        setIncludeLower(true);
        setIncludeNumbers(true);
        setIncludeSymbols(true);
      }}
    >
      <div className="space-y-6">
        <div className="bg-secondary/30 p-6 rounded-md space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Password Length ({length} chars)</label>
            <input
              type="range"
              min={6}
              max={64}
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeUpper}
                onChange={(e) => setIncludeUpper(e.target.checked)}
              />
              Uppercase Letters (A-Z)
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeLower}
                onChange={(e) => setIncludeLower(e.target.checked)}
              />
              Lowercase Letters (a-z)
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
              />
              Numbers (0-9)
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
              />
              Special Characters (!@#$)
            </label>
          </div>

          <Button variant="primary" className="w-full mt-4" onClick={generatePassword}>
            Generate Strong Password
          </Button>
        </div>

        {password && (
          <div className="p-4 bg-secondary/50 rounded border border-border/70 flex items-center justify-between font-mono text-lg break-all">
            <span>{password}</span>
            <Button variant="outline" size="sm" onClick={handleCopy} className="ml-4 shrink-0">
              Copy
            </Button>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
