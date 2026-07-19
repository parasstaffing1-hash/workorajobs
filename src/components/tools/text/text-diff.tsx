"use client";

import React, { useState } from "react";
import { ToolShell } from "../tool-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const exampleOriginal = "Workora is a premium recruiting platform matching elite talent.\nEverything runs on modern APIs.\nOffline capability matches developer needs.";
const exampleModified = "Workora is a premium staffing & recruiting platform matching top talent.\nEverything runs on cloud APIs.\nOffline capability matches modern developer needs.";

export default function TextDiffTool() {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [diff, setDiff] = useState<Array<{ type: "added" | "removed" | "unchanged"; text: string }>>([]);

  const compare = () => {
    const origLines = original.split("\n");
    const modLines = modified.split("\n");
    const diffResult: Array<{ type: "added" | "removed" | "unchanged"; text: string }> = [];

    let i = 0, j = 0;
    while (i < origLines.length || j < modLines.length) {
      if (origLines[i] === modLines[j]) {
        if (i < origLines.length) {
          diffResult.push({ type: "unchanged", text: origLines[i] });
        }
        i++;
        j++;
      } else if (j >= modLines.length || (i < origLines.length && !modLines.includes(origLines[i]))) {
        diffResult.push({ type: "removed", text: origLines[i] });
        i++;
      } else {
        diffResult.push({ type: "added", text: modLines[j] });
        j++;
      }
    }
    setDiff(diffResult);
  };

  return (
    <ToolShell
      tool={{
        slug: "text-diff",
        name: "Text Diff Checker",
        description: "Compare two text versions line-by-line for additions and deletions.",
        category: "text",
        keywords: []
      }}
      exampleInput={{ orig: exampleOriginal, mod: exampleModified }}
      onLoadExample={(val) => {
        setOriginal(val.orig);
        setModified(val.mod);
      }}
      onReset={() => {
        setOriginal("");
        setModified("");
        setDiff([]);
      }}
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Original Version</label>
            <Textarea
              className="min-h-[150px] font-mono text-sm leading-relaxed"
              placeholder="Paste original text..."
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Modified Version</label>
            <Textarea
              className="min-h-[150px] font-mono text-sm leading-relaxed"
              placeholder="Paste modified text..."
              value={modified}
              onChange={(e) => setModified(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Button variant="primary" onClick={compare} disabled={!original && !modified}>
            Compare Versions
          </Button>
        </div>

        {diff.length > 0 && (
          <div className="border border-border/70 rounded-md overflow-hidden font-mono text-sm leading-relaxed">
            <div className="bg-secondary/40 p-2 border-b border-border/70 font-semibold text-xs text-muted-foreground">COMPARISON RESULTS</div>
            <div className="p-4 space-y-1 bg-black/10">
              {diff.map((item, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "px-2 py-0.5 rounded",
                    item.type === "added" && "bg-green-500/10 text-green-400 border-l-2 border-green-500",
                    item.type === "removed" && "bg-red-500/10 text-red-400 border-l-2 border-red-500 line-through",
                    item.type === "unchanged" && "text-muted-foreground"
                  )}
                >
                  <span className="mr-2 font-semibold">
                    {item.type === "added" ? "+" : item.type === "removed" ? "-" : " "}
                  </span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
