"use client";

import React, { useState } from "react";
import { ToolShell } from "../tool-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const exampleData = "V29ya29yYSBKb2JzIHBsYXRmb3Jt";

export default function Base64DecodeTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const process = () => {
    setError("");
    setOutput("");
    try {
      setOutput(decodeURIComponent(escape(atob(input.trim()))));
    } catch (e) {
      setError("Invalid Base64 format string.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <ToolShell
      tool={{
        slug: "base64-decode",
        name: "Base64 Decoder",
        description: "Decode Base64 encoded strings back into readable text format.",
        category: "developer",
        keywords: []
      }}
      exampleInput={exampleData}
      onLoadExample={(val) => setInput(val)}
      onReset={() => {
        setInput("");
        setOutput("");
        setError("");
      }}
    >
      <div className="space-y-4">
        <Textarea
          className="min-h-[120px] font-mono text-sm leading-relaxed"
          placeholder="Paste Base64 encoded string..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        {error && (
          <div className="bg-red-500/10 border-l-2 border-red-500 text-red-400 p-3 rounded text-sm font-mono">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="flex justify-center">
          <Button variant="primary" onClick={process} disabled={!input}>
            Decode Base64
          </Button>
        </div>

        {output && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Decoded Output</label>
            <Textarea
              className="min-h-[120px] font-mono text-sm leading-relaxed"
              readOnly
              value={output}
            />
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                Copy Result
              </Button>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
