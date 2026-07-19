"use client";

import React, { useState } from "react";
import { ToolShell } from "../tool-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const exampleData = "we match elite talent with global hiring teams.";

export default function CaseConverterTool() {
  const [text, setText] = useState("");

  const toUpper = () => setText(text.toUpperCase());
  const toLower = () => setText(text.toLowerCase());
  
  const toTitle = () => {
    const titleText = text.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    setText(titleText);
  };

  const toSentence = () => {
    const sentences = text.toLowerCase().split(/([.!?]\s*)/);
    const converted = sentences.map((s) => {
      if (s.trim().length === 0) return s;
      return s.charAt(0).toUpperCase() + s.slice(1);
    });
    setText(converted.join(""));
  };

  const toSnake = () => {
    setText(text.toLowerCase().replace(/\s+/g, "_"));
  };

  const toKebab = () => {
    setText(text.toLowerCase().replace(/\s+/g, "-"));
  };

  const toCamel = () => {
    const camel = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    setText(camel.charAt(0).toLowerCase() + camel.slice(1));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <ToolShell
      tool={{
        slug: "case-converter",
        name: "Case Converter",
        description: "Transform text between upper, lower, title, sentence, snake, kebab, and camel cases.",
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
          placeholder="Enter text to convert case..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={toUpper} disabled={!text}>UPPERCASE</Button>
          <Button variant="outline" size="sm" onClick={toLower} disabled={!text}>lowercase</Button>
          <Button variant="outline" size="sm" onClick={toTitle} disabled={!text}>Title Case</Button>
          <Button variant="outline" size="sm" onClick={toSentence} disabled={!text}>Sentence case</Button>
          <Button variant="outline" size="sm" onClick={toSnake} disabled={!text}>snake_case</Button>
          <Button variant="outline" size="sm" onClick={toKebab} disabled={!text}>kebab-case</Button>
          <Button variant="outline" size="sm" onClick={toCamel} disabled={!text}>camelCase</Button>
        </div>

        <div className="flex justify-end gap-2 border-t border-border/70 pt-4">
          <Button variant="primary" size="sm" onClick={handleCopy} disabled={!text}>
            Copy Result
          </Button>
        </div>
      </div>
    </ToolShell>
  );
}
