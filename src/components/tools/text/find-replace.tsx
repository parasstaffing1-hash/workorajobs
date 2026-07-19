"use client";

import React, { useState } from "react";
import { ToolShell } from "../tool-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const exampleData = "Java is a popular language. Javascript is also dynamic. java developers love tools.";

export default function FindReplaceTool() {
  const [text, setText] = useState("");
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [useRegex, setUseRegex] = useState(false);

  const handleProcess = () => {
    if (!findText) return;
    try {
      let regex;
      if (useRegex) {
        regex = new RegExp(findText, caseSensitive ? "g" : "gi");
      } else {
        // Escape special regex characters for literal match
        const escaped = findText.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
        regex = new RegExp(escaped, caseSensitive ? "g" : "gi");
      }
      setText(text.replace(regex, replaceText));
    } catch (e) {
      alert("Invalid search expression or regex pattern.");
    }
  };

  return (
    <ToolShell
      tool={{
        slug: "find-replace",
        name: "Find & Replace",
        description: "Search and replace words or regex matches within your text.",
        category: "text",
        keywords: []
      }}
      exampleInput={exampleData}
      onLoadExample={(val) => setText(val)}
      onReset={() => {
        setText("");
        setFindText("");
        setReplaceText("");
      }}
    >
      <div className="space-y-4">
        <Textarea
          className="min-h-[180px] font-mono text-sm leading-relaxed"
          placeholder="Enter source text..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="grid gap-4 sm:grid-cols-2 bg-secondary/30 p-4 rounded-md">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Find</label>
            <input
              type="text"
              className="w-full bg-background border border-border/70 rounded px-3 py-1.5 text-sm font-mono"
              placeholder="Word or regex pattern..."
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Replace With</label>
            <input
              type="text"
              className="w-full bg-background border border-border/70 rounded px-3 py-1.5 text-sm font-mono"
              placeholder="Replacement text..."
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-4 sm:col-span-2 mt-2">
            <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
              <input
                type="checkbox"
                checked={caseSensitive}
                onChange={(e) => setCaseSensitive(e.target.checked)}
              />
              Case Sensitive
            </label>
            <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
              <input
                type="checkbox"
                checked={useRegex}
                onChange={(e) => setUseRegex(e.target.checked)}
              />
              Use Regular Expressions (Regex)
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="primary" onClick={handleProcess} disabled={!text || !findText}>
            Replace All Occurrences
          </Button>
        </div>
      </div>
    </ToolShell>
  );
}
