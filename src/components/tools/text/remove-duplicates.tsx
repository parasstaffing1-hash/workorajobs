"use client";

import React, { useState } from "react";
import { ToolShell } from "../tool-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const exampleData = "Apple\nBanana\nApple\nbanana\nCherry\nBanana";

export default function DuplicateRemoverTool() {
  const [text, setText] = useState("");
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [removeEmpty, setRemoveEmpty] = useState(false);

  const cleanDuplicates = () => {
    const lines = text.split("\n");
    const seen = new Set<string>();
    const result: string[] = [];

    lines.forEach((line) => {
      const matchKey = ignoreCase ? line.toLowerCase().trim() : line;
      if (removeEmpty && line.trim().length === 0) return;
      if (!seen.has(matchKey)) {
        seen.add(matchKey);
        result.push(line);
      }
    });

    setText(result.join("\n"));
  };

  return (
    <ToolShell
      tool={{
        slug: "remove-duplicates",
        name: "Duplicate Line Remover",
        description: "Filter and remove duplicate lines from list content.",
        category: "text",
        keywords: []
      }}
      exampleInput={exampleData}
      onLoadExample={(val) => setText(val)}
      onReset={() => setText("")}
    >
      <div className="space-y-4">
        <Textarea
          className="min-h-[200px] font-mono text-sm leading-relaxed"
          placeholder="Enter list lines to deduplicate..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex flex-wrap gap-4 bg-secondary/30 p-4 rounded-md">
          <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
            <input
              type="checkbox"
              checked={ignoreCase}
              onChange={(e) => setIgnoreCase(e.target.checked)}
            />
            Ignore Letter Case (e.g. apple = Apple)
          </label>

          <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
            <input
              type="checkbox"
              checked={removeEmpty}
              onChange={(e) => setRemoveEmpty(e.target.checked)}
            />
            Skip / Remove Empty Lines
          </label>

          <Button variant="primary" size="sm" onClick={cleanDuplicates} disabled={!text}>
            Remove Duplicates
          </Button>
        </div>
      </div>
    </ToolShell>
  );
}
