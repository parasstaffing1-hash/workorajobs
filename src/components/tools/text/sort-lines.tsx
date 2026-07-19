"use client";

import React, { useState } from "react";
import { ToolShell } from "../tool-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const exampleData = "Apple\nBanana\ncherry\n100\n20\n3";

export default function SortLinesTool() {
  const [text, setText] = useState("");
  const [sortType, setSortType] = useState("alphabetical-asc");

  const sortLines = () => {
    const lines = text.split("\n");
    let sorted = [...lines];

    switch (sortType) {
      case "alphabetical-asc":
        sorted.sort((a, b) => a.localeCompare(b));
        break;
      case "alphabetical-desc":
        sorted.sort((a, b) => b.localeCompare(a));
        break;
      case "numeric-asc":
        sorted.sort((a, b) => (parseFloat(a) || 0) - (parseFloat(b) || 0));
        break;
      case "numeric-desc":
        sorted.sort((a, b) => (parseFloat(b) || 0) - (parseFloat(a) || 0));
        break;
      case "length-asc":
        sorted.sort((a, b) => a.length - b.length);
        break;
      case "length-desc":
        sorted.sort((a, b) => b.length - a.length);
        break;
      case "reverse":
        sorted.reverse();
        break;
      default:
        break;
    }
    setText(sorted.join("\n"));
  };

  return (
    <ToolShell
      tool={{
        slug: "sort-lines",
        name: "Sort Lines",
        description: "Sort list items or text lines alphabetically, numerically, by length, or in reverse order.",
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
          placeholder="Enter lines to sort..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex flex-wrap items-center gap-4 bg-secondary/30 p-4 rounded-md">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Sort Method</label>
            <select
              className="bg-background border border-border/70 rounded px-3 py-1.5 text-sm"
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
            >
              <option value="alphabetical-asc">A to Z</option>
              <option value="alphabetical-desc">Z to A</option>
              <option value="numeric-asc">Numeric Ascending (1 to 9)</option>
              <option value="numeric-desc">Numeric Descending (9 to 1)</option>
              <option value="length-asc">Line Length (Short to Long)</option>
              <option value="length-desc">Line Length (Long to Short)</option>
              <option value="reverse">Reverse Order</option>
            </select>
          </div>

          <Button variant="primary" size="sm" className="mt-4" onClick={sortLines} disabled={!text}>
            Sort Lines Now
          </Button>
        </div>
      </div>
    </ToolShell>
  );
}
