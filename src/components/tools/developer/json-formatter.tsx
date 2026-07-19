"use client";

import React, { useState } from "react";
import { ToolShell } from "../tool-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const exampleData = '{"name":"Workora","status":"active","metrics":{"users":100000,"growthRate":1.45},"tags":["recruitment","staffing"]}';

export default function JsonFormatterTool() {
  const [input, setInput] = useState("");
  const [indentSize, setIndentSize] = useState(2);
  const [error, setError] = useState("");

  const formatJson = () => {
    setError("");
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed, null, indentSize));
    } catch (err: any) {
      setError(err.message || "Invalid JSON syntax.");
    }
  };

  const minifyJson = () => {
    setError("");
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed));
    } catch (err: any) {
      setError(err.message || "Invalid JSON syntax.");
    }
  };

  return (
    <ToolShell
      tool={{
        slug: "json-formatter",
        name: "JSON Formatter",
        description: "Beautify, format, validate, and minify your JSON data instantly.",
        category: "developer",
        keywords: []
      }}
      exampleInput={exampleData}
      onLoadExample={(val) => setInput(val)}
      onReset={() => {
        setInput("");
        setError("");
      }}
    >
      <div className="space-y-4">
        <Textarea
          className="min-h-[250px] font-mono text-sm leading-relaxed"
          placeholder="Paste raw JSON here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        {error && (
          <div className="bg-red-500/10 border-l-2 border-red-500 text-red-400 p-3 rounded text-sm font-mono">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4 bg-secondary/30 p-4 rounded-md">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Indentation</label>
            <select
              className="bg-background border border-border/70 rounded px-3 py-1.5 text-sm"
              value={indentSize}
              onChange={(e) => setIndentSize(parseInt(e.target.value))}
            >
              <option value={2}>2 Spaces</option>
              <option value={4}>4 Spaces</option>
              <option value={8}>8 Spaces</option>
            </select>
          </div>

          <div className="flex gap-2 mt-4 sm:mt-0">
            <Button variant="primary" size="sm" onClick={formatJson} disabled={!input}>
              Format / Validate
            </Button>
            <Button variant="outline" size="sm" onClick={minifyJson} disabled={!input}>
              Minify JSON
            </Button>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
