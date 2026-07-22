"use client";

import { useState } from "react";
import { Upload, FileText, Zap, AlertCircle, Copy, Download, Sparkles, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { ATSScoreDisplay } from "./ats-score-display";
import { KeywordAnalysisPanel } from "./keyword-analysis-panel";

export function ATSAnalyzerWorkspace() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [copied, setCopied] = useState(false);

  const [scores, setScores] = useState({
    atsScore: 84,
    keywordMatchScore: 78,
    formattingScore: 92,
    completenessScore: 88,
  });

  const [matchedKeywords, setMatchedKeywords] = useState([
    "TypeScript", "React", "Next.js", "REST APIs", "Git", "Node.js", "CI/CD", "State Management"
  ]);

  const [missingKeywords, setMissingKeywords] = useState([
    "GraphQL", "Docker", "AWS S3", "Tailwind CSS", "Jest Unit Testing"
  ]);

  const handleAnalyze = () => {
    if (!resumeText.trim() || !jobDescription.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzed(true);
    }, 1200);
  };

  const handleCopyReport = () => {
    const report = `ATS Resume Analysis Report
Overall Score: ${scores.atsScore}/100
Keyword Match: ${scores.keywordMatchScore}%
Formatting Quality: ${scores.formattingScore}%
Completeness: ${scores.completenessScore}%

Matched Keywords: ${matchedKeywords.join(", ")}
Missing Keywords: ${missingKeywords.join(", ")}`;
    
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-12 bg-background text-foreground">
      <Container>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Input Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Resume Text Input */}
            <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-4">
              <label className="font-bold text-sm flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" /> Resume Content / Plain Text
                </span>
                <span className="text-xs text-muted-foreground">Required</span>
              </label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume text here (experience, skills, summary)..."
                rows={8}
                className="w-full p-4 rounded-xl border border-border/60 bg-background text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
              />
            </div>

            {/* Job Description Input */}
            <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-4">
              <label className="font-bold text-sm flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" /> Target Job Description
                </span>
                <span className="text-xs text-muted-foreground">Required</span>
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job posting description and required capabilities here..."
                rows={8}
                className="w-full p-4 rounded-xl border border-border/60 bg-background text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
              />
            </div>
          </div>

          {/* Action CTA */}
          <div className="flex items-center justify-center">
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !resumeText.trim() || !jobDescription.trim()}
              size="lg"
              variant="primary"
              className="h-12 px-10 rounded-xl font-semibold shadow-lg"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin mr-2" />
                  Running ATS Parser Audit...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2 text-amber-400" />
                  Analyze Resume ATS Match
                </>
              )}
            </Button>
          </div>

          {/* Analysis Results Display */}
          {analyzed && (
            <div className="space-y-8 pt-6 border-t border-border/60 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">ATS Audit Results</h3>
                <Button variant="outline" size="sm" onClick={handleCopyReport}>
                  <Copy className="w-4 h-4 mr-1.5" />
                  {copied ? "Report Copied!" : "Copy Summary"}
                </Button>
              </div>

              {/* Score Display Component */}
              <ATSScoreDisplay {...scores} />

              {/* Keyword Analysis Panel */}
              <KeywordAnalysisPanel
                matchedKeywords={matchedKeywords}
                missingKeywords={missingKeywords}
              />
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
