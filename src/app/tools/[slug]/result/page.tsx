"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { 
  Copy, 
  Download, 
  Printer, 
  Share2, 
  ArrowLeft, 
  Edit3, 
  Check, 
  Sparkles, 
  FileText, 
  Save, 
  RefreshCw,
  Sun,
  Moon
} from "lucide-react";

import { PlatformShell } from "@/components/platform/platform-shell";
import { WorkflowCard } from "@/components/platform/workflow-card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { recruiterNav } from "@/data/platform";

interface ToolResultData {
  title: string;
  originalUrl: string;
  inputs: {
    jobDescription?: string;
    resumeText?: string;
    prompt?: string;
    [key: string]: any;
  };
  resultText?: string;
  subMetrics?: {
    overall: number;
    ats: number;
    content: number;
    formatting: number;
    keyword: number;
    skills: number;
    experience: number;
  };
  sections?: {
    title: string;
    items: string[];
  }[];
  booleanStrings?: {
    label: string;
    query: string;
    platform?: string;
    description?: string;
  }[];
  recommendations?: string[];
}

export default function ToolResultPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const resultId = searchParams.get("id");

  const [resultData, setResultData] = useState<ToolResultData | null>(null);
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState("");
  
  const [copySuccess, setCopySuccess] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  useEffect(() => {
    if (!resultId) return;
    
    // Load from localStorage
    const saved = localStorage.getItem(`workora_tool_result_${resultId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as ToolResultData;
        setResultData(parsed);
        setEditedText(parsed.resultText || "");
      } catch (err) {
        console.error("Failed to parse tool result data:", err);
      }
    }
  }, [resultId]);

  const isDark = themeMode === "dark";
  const wrapperClass = isDark ? "text-slate-100 bg-slate-950/20" : "text-slate-800 bg-slate-50/50";
  const cardClass = isDark ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200/80 shadow-sm";
  const subCardClass = isDark ? "bg-slate-950/60 border-slate-800/80" : "bg-slate-50 border-slate-200/80";
  const preClass = isDark ? "bg-slate-955 border-slate-800/60" : "bg-slate-100 border-slate-200";

  if (!resultData) {
    return (
      <PlatformShell
        badge="Tool Results"
        description="View your generated results."
        title="Result Panel"
        nav={recruiterNav}
      >
        <div className="py-12 text-center space-y-4 border border-dashed border-slate-800 rounded-xl max-w-xl mx-auto">
          <FileText className="h-10 w-10 text-slate-600 mx-auto" />
          <h3 className="font-semibold text-slate-400 text-sm">No tool result loaded</h3>
          <p className="text-xs text-slate-500">The result may have expired, or you accessed this URL directly without triggering a generator.</p>
          <Button variant="outline" onClick={() => router.push("/services")}>
            Go to Services
          </Button>
        </div>
      </PlatformShell>
    );
  }

  // Copy Result Text
  const handleCopy = () => {
    let copyContent = resultData.resultText || "";
    if (resultData.booleanStrings && resultData.booleanStrings.length > 0) {
      copyContent = resultData.booleanStrings.map(b => `${b.label}:\n${b.query}`).join("\n\n");
    }
    navigator.clipboard.writeText(copyContent);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Download Result
  const handleDownload = () => {
    const textContent = resultData.resultText || JSON.stringify(resultData, null, 2);
    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `workora-result-${slug}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Print Result
  const handlePrint = () => {
    window.print();
  };

  // Share URL
  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2000);
  };

  // Save Edits
  const handleSaveEdits = () => {
    setIsEditing(false);
    setResultData(prev => prev ? { ...prev, resultText: editedText } : null);
    
    // Sync to localStorage
    const saved = localStorage.getItem(`workora_tool_result_${resultId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        parsed.resultText = editedText;
        localStorage.setItem(`workora_tool_result_${resultId}`, JSON.stringify(parsed));
      } catch (err) {}
    }
  };

  return (
    <PlatformShell
      badge="Workora Result Studio"
      description="Preview, copy, export, print or share your locally generated recruiter artifacts."
      title={resultData.title}
      nav={recruiterNav}
    >
      <div className={`space-y-6 transition-colors duration-300 ${wrapperClass}`}>
        
        {/* Navigation Action Bar */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <Button size="sm" variant="ghost" onClick={() => router.push(resultData.originalUrl)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Return to Tool
          </Button>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => setThemeMode(themeMode === "dark" ? "light" : "dark")}>
              {themeMode === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-500" />}
            </Button>
          </div>
        </div>

        {/* Dynamic Layout Split */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          
          {/* Output Display / Preview Pane */}
          <div className="lg:col-span-8 space-y-6">
            <div className={`${cardClass} rounded-xl overflow-hidden`}>
              <WorkflowCard 
                title="Generated Output"
                action={
                  <div className="flex gap-2">
                    {resultData.resultText && (
                      <Button size="sm" variant="outline" onClick={() => {
                        if (isEditing) {
                          handleSaveEdits();
                        } else {
                          setIsEditing(true);
                        }
                      }}>
                        <Edit3 className="h-3.5 w-3.5 mr-1" /> {isEditing ? "Save Edits" : "Edit Result"}
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={handleCopy}>
                      {copySuccess ? <Check className="h-3.5 w-3.5 text-emerald-500 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                      {copySuccess ? "Copied!" : "Copy Result"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleDownload}>
                      <Download className="h-3.5 w-3.5 mr-1" /> Download
                    </Button>
                    <Button size="sm" variant="outline" onClick={handlePrint}>
                      <Printer className="h-3.5 w-3.5 mr-1" /> Print
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleShare}>
                      <Share2 className="h-3.5 w-3.5 mr-1" /> {shareSuccess ? "Link Copied!" : "Share"}
                    </Button>
                  </div>
                }
              >
                <div className="p-4 space-y-4">
                  {isEditing ? (
                    <Textarea 
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      rows={18}
                      className="w-full text-xs font-mono p-4 bg-slate-900 border-slate-800 rounded-xl"
                    />
                  ) : (
                    <div className={`p-4 rounded-xl border font-serif text-sm leading-relaxed whitespace-pre-wrap ${preClass}`}>
                      {resultData.resultText || (
                        <div className="space-y-4 font-sans text-xs">
                          {resultData.booleanStrings && resultData.booleanStrings.map((b, idx) => (
                            <div key={idx} className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1.5">
                              <div className="font-bold text-slate-350">{b.label}</div>
                              <code className="text-slate-200 block bg-slate-900/80 p-2 rounded border border-slate-800/40 overflow-x-auto whitespace-pre-wrap">
                                {b.query}
                              </code>
                              {b.description && <div className="text-[10px] text-slate-500">{b.description}</div>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Sub-Metrics Score Display (e.g. ATS Resume Scoring) */}
                  {resultData.subMetrics && (
                    <div className="grid grid-cols-4 gap-3 text-center border-t border-slate-800/60 pt-4">
                      <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800/60">
                        <div className="text-slate-500 text-[10px] uppercase font-bold">Overall Fit</div>
                        <div className="text-base font-bold text-emerald-400 mt-1">{resultData.subMetrics.overall}%</div>
                      </div>
                      <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800/60">
                        <div className="text-slate-500 text-[10px] uppercase font-bold">ATS Score</div>
                        <div className="text-base font-bold text-blue-400 mt-1">{resultData.subMetrics.ats}%</div>
                      </div>
                      <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800/60">
                        <div className="text-slate-500 text-[10px] uppercase font-bold">Skills Match</div>
                        <div className="text-base font-bold text-amber-400 mt-1">{resultData.subMetrics.skills}%</div>
                      </div>
                      <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800/60">
                        <div className="text-slate-500 text-[10px] uppercase font-bold">Experience</div>
                        <div className="text-base font-bold text-slate-300 mt-1">{resultData.subMetrics.experience}%</div>
                      </div>
                    </div>
                  )}
                </div>
              </WorkflowCard>
            </div>
          </div>

          {/* Right Column: Original inputs & sections overview */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Sections Overview (e.g., Strengths, Risks, follow-up questions) */}
            {resultData.sections && resultData.sections.length > 0 && (
              <div className={`${cardClass} rounded-xl overflow-hidden`}>
                <WorkflowCard title="Match Details & Checklist">
                  <div className="p-4 space-y-4">
                    {resultData.sections.map((sect, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="text-xs font-bold text-slate-400 border-b border-slate-800/40 pb-1 uppercase tracking-wider">{sect.title}</div>
                        <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-350">
                          {sect.items.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </WorkflowCard>
              </div>
            )}

            {/* Preserved Inputs Context */}
            <div className={`${cardClass} rounded-xl overflow-hidden`}>
              <WorkflowCard title="Source Input Context">
                <div className="p-4 space-y-3 text-xs">
                  {resultData.inputs.jobDescription && (
                    <div className="space-y-1">
                      <div className="font-bold text-slate-500">Job Description Input:</div>
                      <div className={`p-2 rounded border font-mono text-[10px] max-h-24 overflow-y-auto leading-relaxed ${preClass}`}>
                        {resultData.inputs.jobDescription}
                      </div>
                    </div>
                  )}
                  {resultData.inputs.resumeText && (
                    <div className="space-y-1">
                      <div className="font-bold text-slate-500">Resume Content Context:</div>
                      <div className={`p-2 rounded border font-mono text-[10px] max-h-24 overflow-y-auto leading-relaxed ${preClass}`}>
                        {resultData.inputs.resumeText}
                      </div>
                    </div>
                  )}
                  {resultData.inputs.prompt && (
                    <div className="space-y-1">
                      <div className="font-bold text-slate-500">Sourcing Instruction:</div>
                      <div className={`p-2 rounded border font-mono text-[10px] leading-relaxed ${preClass}`}>
                        {resultData.inputs.prompt}
                      </div>
                    </div>
                  )}
                </div>
              </WorkflowCard>
            </div>

          </div>

        </div>
      </div>
    </PlatformShell>
  );
}
