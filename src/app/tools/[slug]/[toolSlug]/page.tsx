"use client";

import React, { use } from "react";
import Link from "next/link";
import { getToolBySlug } from "@/lib/tools/registry";

// Import all text components
import WordCounterTool from "@/components/tools/text/word-counter";
import CaseConverterTool from "@/components/tools/text/case-converter";
import LoremIpsumTool from "@/components/tools/text/lorem-ipsum";
import TextDiffTool from "@/components/tools/text/text-diff";
import FindReplaceTool from "@/components/tools/text/find-replace";
import SortLinesTool from "@/components/tools/text/sort-lines";
import DuplicateRemoverTool from "@/components/tools/text/remove-duplicates";
import TextCleanerTool from "@/components/tools/text/text-cleaner";

// Import all developer components
import JsonFormatterTool from "@/components/tools/developer/json-formatter";
import Base64EncodeTool from "@/components/tools/developer/base64-encode";
import Base64DecodeTool from "@/components/tools/developer/base64-decode";
import UuidGeneratorTool from "@/components/tools/developer/uuid-generator";
import PasswordGeneratorTool from "@/components/tools/developer/password-generator";

// Import all recruiter components
import BooleanSearchBuilderTool from "@/components/tools/recruiter/boolean-search";
import XRaySearchBuilderTool from "@/components/tools/recruiter/xray-search";
import ResumeParserTool from "@/components/tools/recruiter/resume-parser";

const toolComponentsMap: Record<string, React.ComponentType> = {
  "word-counter": WordCounterTool,
  "case-converter": CaseConverterTool,
  "lorem-ipsum": LoremIpsumTool,
  "text-diff": TextDiffTool,
  "find-replace": FindReplaceTool,
  "sort-lines": SortLinesTool,
  "remove-duplicates": DuplicateRemoverTool,
  "text-cleaner": TextCleanerTool,
  "json-formatter": JsonFormatterTool,
  "base64-encode": Base64EncodeTool,
  "base64-decode": Base64DecodeTool,
  "uuid-generator": UuidGeneratorTool,
  "password-generator": PasswordGeneratorTool,
  "boolean-search": BooleanSearchBuilderTool,
  "xray-search": XRaySearchBuilderTool,
  "resume-parser": ResumeParserTool,
};

export default function ToolPage({ params }: { params: Promise<{ slug: string; toolSlug: string }> }) {
  const resolvedParams = use(params);
  const tool = getToolBySlug(resolvedParams.toolSlug);
  const ToolComponent = toolComponentsMap[resolvedParams.toolSlug];

  if (!tool || !ToolComponent) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Tool not found</h1>
        <p className="mt-2 text-muted-foreground">The tool "{resolvedParams.toolSlug}" is not currently available or is being constructed.</p>
        <Link href="/tools" className="mt-4 inline-block text-primary hover:underline">
          Back to Tools Index
        </Link>
      </div>
    );
  }

  return <ToolComponent />;
}
