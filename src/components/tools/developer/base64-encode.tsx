"use client";

import React, { useState } from "react";
import { ToolShell } from "../tool-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const exampleData = "Workora Jobs platform";

export default function Base64EncodeTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const process = () => {
    try {
      setOutput(btoa(unescape(encodeURIComponent(input))));
    } catch (e) {
      alert("Failed to encode input to Base64.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <ToolShell
      tool={{
        slug: "base64-encode",
        name: "Base64 Encoder",
        description: "Encode text strings into standardized Base64 representation.",
        category: "developer",
        keywords: []
      }}
      exampleInput={exampleData}
      onLoadExample={(val) => setInput(val)}
      onReset={() => {
        setInput("");
        setOutput("");
      }}
    >
      <div className="space-y-4">
        <Textarea
          className="min-h-[120px] font-mono text-sm leading-relaxed"
          placeholder="Enter text to encode..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="flex justify-center">
          <Button variant="primary" onClick={process} disabled={!input}>
            Encode to Base64
          </Button>
        </div>

        {output && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Base64 Output</label>
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
