"use client";

import React, { useState } from "react";
import { ToolShell } from "../tool-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const loremWords = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", 
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", 
  "magna", "aliqua", "ut", "enim", "ad", "minim", "veniam", "quis", "nostrud", 
  "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea", 
  "commodo", "consequat", "duis", "aute", "irure", "dolor", "in", "reprehenderit", 
  "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla", 
  "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident", 
  "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", 
  "est", "laborum"
];

export default function LoremIpsumTool() {
  const [result, setResult] = useState("");
  const [count, setCount] = useState(3);
  const [type, setType] = useState("paragraphs");

  const generate = () => {
    let output = "";
    if (type === "words") {
      const words: string[] = [];
      for (let i = 0; i < count; i++) {
        words.push(loremWords[i % loremWords.length]);
      }
      output = words.join(" ");
    } else if (type === "sentences") {
      const sentences: string[] = [];
      for (let s = 0; s < count; s++) {
        const sentenceLen = 6 + (s % 7);
        const sentenceWords: string[] = [];
        for (let w = 0; w < sentenceLen; w++) {
          sentenceWords.push(loremWords[(s * 5 + w) % loremWords.length]);
        }
        let sentenceStr = sentenceWords.join(" ");
        sentenceStr = sentenceStr.charAt(0).toUpperCase() + sentenceStr.slice(1) + ".";
        sentences.push(sentenceStr);
      }
      output = sentences.join(" ");
    } else {
      // paragraphs
      const paragraphs: string[] = [];
      for (let p = 0; p < count; p++) {
        const sentences: string[] = [];
        const sentenceCount = 3 + (p % 3);
        for (let s = 0; s < sentenceCount; s++) {
          const sentenceLen = 8 + (s % 6);
          const sentenceWords: string[] = [];
          for (let w = 0; w < sentenceLen; w++) {
            sentenceWords.push(loremWords[(p * 15 + s * 5 + w) % loremWords.length]);
          }
          let sentenceStr = sentenceWords.join(" ");
          sentenceStr = sentenceStr.charAt(0).toUpperCase() + sentenceStr.slice(1) + ".";
          sentences.push(sentenceStr);
        }
        paragraphs.push(sentences.join(" "));
      }
      output = paragraphs.join("\n\n");
    }
    setResult(output);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
  };

  return (
    <ToolShell
      tool={{
        slug: "lorem-ipsum",
        name: "Lorem Ipsum Generator",
        description: "Generate placeholder paragraphs, sentences, or words.",
        category: "text",
        keywords: []
      }}
      exampleInput={null}
      onReset={() => {
        setResult("");
        setCount(3);
        setType("paragraphs");
      }}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-4 bg-secondary/30 p-4 rounded-md">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Type</label>
            <select 
              className="bg-background border border-border/70 rounded px-3 py-1.5 text-sm"
              value={type} 
              onChange={(e) => setType(e.target.value)}
            >
              <option value="words">Words</option>
              <option value="sentences">Sentences</option>
              <option value="paragraphs">Paragraphs</option>
            </select>
          </div>

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

          <Button variant="primary" size="sm" className="mt-4" onClick={generate}>
            Generate Placeholder
          </Button>
        </div>

        {result && (
          <div className="space-y-2">
            <Textarea
              className="min-h-[250px] font-mono text-sm leading-relaxed"
              readOnly
              value={result}
            />
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                Copy Output
              </Button>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
