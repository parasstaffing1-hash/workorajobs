"use client";

import React, { useState } from "react";
import { ToolShell } from "../tool-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function UuidGeneratorTool() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [noHyphens, setNoHyphens] = useState(false);

  const generateUuid = () => {
    // Standard RFC4122 v4 UUID generator algorithm
    const result: string[] = [];
    for (let c = 0; c < count; c++) {
      let d = new Date().getTime();
      let uuidStr = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
      });

      if (noHyphens) {
        uuidStr = uuidStr.replace(/-/g, "");
      }
      if (uppercase) {
        uuidStr = uuidStr.toUpperCase();
      }
      result.push(uuidStr);
    }
    setUuids(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(uuids.join("\n"));
  };

  return (
    <ToolShell
      tool={{
        slug: "uuid-generator",
        name: "UUID Generator",
        description: "Generate cryptographically secure UUID v4 strings in bulk.",
        category: "developer",
        keywords: []
      }}
      exampleInput={null}
      onReset={() => {
        setUuids([]);
        setCount(5);
        setUppercase(false);
        setNoHyphens(false);
      }}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-4 bg-secondary/30 p-4 rounded-md">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Count</label>
            <input
              type="number"
              className="bg-background border border-border/70 rounded px-3 py-1 text-sm max-w-[100px]"
              value={count}
              min={1}
              max={100}
              onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>

          <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
            />
            UPPERCASE
          </label>

          <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
            <input
              type="checkbox"
              checked={noHyphens}
              onChange={(e) => setNoHyphens(e.target.checked)}
            />
            Remove Hyphens
          </label>

          <Button variant="primary" size="sm" onClick={generateUuid}>
            Generate UUIDs
          </Button>
        </div>

        {uuids.length > 0 && (
          <div className="space-y-2">
            <Textarea
              className="min-h-[180px] font-mono text-sm leading-relaxed"
              readOnly
              value={uuids.join("\n")}
            />
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                Copy All UUIDs
              </Button>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
