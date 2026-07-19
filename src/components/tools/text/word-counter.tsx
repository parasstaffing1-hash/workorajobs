"use client";

import React, { useState, useEffect } from "react";
import { ToolShell } from "../tool-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const exampleData = "Workora Jobs is a premium recruiting platform. It matches elite talent with global companies. This process is fully deterministic, secure, and incredibly fast!";

export default function WordCounterTool() {
  const [text, setText] = useState("");
  const [stats, setStats] = useState({
    words: 0,
    chars: 0,
    charsNoSpaces: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
  });

  useEffect(() => {
    const cleanText = text.trim();
    if (!cleanText) {
      setStats({ words: 0, chars: 0, charsNoSpaces: 0, sentences: 0, paragraphs: 0, readingTime: 0 });
      return;
    }

    const words = cleanText.split(/\s+/).filter(Boolean).length;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0).length;
    const readingTime = Math.ceil(words / 200); // 200 WPM average

    setStats({ words, chars, charsNoSpaces, sentences, paragraphs, readingTime });
  }, [text]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "word-counter-export.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolShell
      tool={{
        slug: "word-counter",
        name: "Word Counter",
        description: "Analyze word count, sentences, paragraphs, and reading time.",
        category: "text",
        keywords: []
      }}
      exampleInput={exampleData}
      onLoadExample={(val) => setText(val)}
      onReset={() => setText("")}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 text-center">
          <div className="bg-secondary/40 p-4 rounded-lg">
            <div className="text-2xl font-bold text-foreground">{stats.words}</div>
            <div className="text-xs text-muted-foreground uppercase font-semibold mt-1">Words</div>
          </div>
          <div className="bg-secondary/40 p-4 rounded-lg">
            <div className="text-2xl font-bold text-foreground">{stats.chars}</div>
            <div className="text-xs text-muted-foreground uppercase font-semibold mt-1">Chars</div>
          </div>
          <div className="bg-secondary/40 p-4 rounded-lg">
            <div className="text-2xl font-bold text-foreground">{stats.charsNoSpaces}</div>
            <div className="text-xs text-muted-foreground uppercase font-semibold mt-1">No Spaces</div>
          </div>
          <div className="bg-secondary/40 p-4 rounded-lg">
            <div className="text-2xl font-bold text-foreground">{stats.sentences}</div>
            <div className="text-xs text-muted-foreground uppercase font-semibold mt-1">Sentences</div>
          </div>
          <div className="bg-secondary/40 p-4 rounded-lg">
            <div className="text-2xl font-bold text-foreground">{stats.paragraphs}</div>
            <div className="text-xs text-muted-foreground uppercase font-semibold mt-1">Paragraphs</div>
          </div>
          <div className="bg-secondary/40 p-4 rounded-lg">
            <div className="text-2xl font-bold text-foreground">{stats.readingTime} min</div>
            <div className="text-xs text-muted-foreground uppercase font-semibold mt-1">Read Time</div>
          </div>
        </div>

        <Textarea
          className="min-h-[250px] font-mono text-sm leading-relaxed"
          placeholder="Start typing or paste your content here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy} disabled={!text}>
            Copy Text
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload} disabled={!text}>
            Download Text
          </Button>
        </div>
      </div>
    </ToolShell>
  );
}
