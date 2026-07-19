"use client";

import React, { useState } from "react";
import { ToolShell } from "../tool-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const exampleData = "  Workora    Jobs   is  amazing! \n\n  HTML tags <b>should</b> be removed.\n\n    Trim trailing spaces.   ";

export default function TextCleanerTool() {
  const [text, setText] = useState("");
  const [stripHtml, setStripHtml] = useState(true);
  const [removeExtraSpaces, setRemoveExtraSpaces] = useState(true);
  const [removeEmptyLines, setRemoveEmptyLines] = useState(true);

  const cleanText = () => {
    let result = text;

    if (stripHtml) {
      result = result.replace(/<\/?[^>]+(>|$)/g, "");
    }

    if (removeExtraSpaces) {
      result = result.replace(/[ \t]+/g, " ");
      result = result.split("\n").map(line => line.trim()).join("\n");
    }

    if (removeEmptyLines) {
      result = result.split("\n").filter(line => line.trim().length > 0).join("\n");
    }

    setText(result.trim());
  };

  return (
    <ToolShell
      tool={{
        slug: "text-cleaner",
        name: "Text Cleaner",
        description: "Standardize formatting by removing extra spacing, HTML elements, and blank rows.",
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
          placeholder="Paste messy text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex flex-wrap gap-4 bg-secondary/30 p-4 rounded-md">
          <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
            <input
              type="checkbox"
              checked={stripHtml}
              onChange={(e) => setStripHtml(e.target.checked)}
            />
            Strip HTML Tags
          </label>

          <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
            <input
              type="checkbox"
              checked={removeExtraSpaces}
              onChange={(e) => setRemoveExtraSpaces(e.target.checked)}
            />
            Merge Multiple Spaces
          </label>

          <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
            <input
              type="checkbox"
              checked={removeEmptyLines}
              onChange={(e) => setRemoveEmptyLines(e.target.checked)}
            />
            Delete Empty Lines
          </label>

          <Button variant="primary" size="sm" onClick={cleanText} disabled={!text}>
            Clean Text
          </Button>
        </div>
      </div>
    </ToolShell>
  );
}
