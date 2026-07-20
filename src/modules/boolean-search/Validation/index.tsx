import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Lucide from 'lucide-react';
import { useBooleanState } from '../Hooks/useBooleanState';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '../Components';
import {
  tokenizeBoolean,
  validateBooleanQuery,
  calculateBooleanStats,
  computeValidationScore,
  applyAutoFix,
  ValidationIssue
} from '../Utils/validationHelper';

export const ValidationPage: React.FC = () => {
  const { addActivity } = useBooleanState();

  // Test query presets
  const SAMPLES = [
    { label: 'Structurally Broken Query', text: '(Java or spring) AND "Spring Boot AND Developer OR Manager NOT (Lead' },
    { label: 'Uncapitalized Operators', text: '(react or angular) and typescript not python' },
    { label: 'Optimized Boolean Search', text: '("Product Manager" OR "Product Owner") AND (Agile OR Scrum) NOT (Lead OR Director)' }
  ];

  const [queryString, setQueryString] = useState(SAMPLES[0].text);
  const [copied, setCopied] = useState(false);

  // Performance calculation
  const validationResult = useMemo(() => {
    const start = performance.now();
    const tokens = tokenizeBoolean(queryString);
    const issues = validateBooleanQuery(queryString, tokens);
    const stats = calculateBooleanStats(queryString, tokens);
    const scoreObj = computeValidationScore(stats, issues);
    const end = performance.now();

    return {
      tokens,
      issues,
      stats,
      scoreObj,
      timeMs: Number((end - start).toFixed(2))
    };
  }, [queryString]);

  const { issues, stats, scoreObj, tokens, timeMs } = validationResult;

  // Split issues into errors & warnings
  const errors = useMemo(() => issues.filter(i => i.type === 'error'), [issues]);
  const warnings = useMemo(() => issues.filter(i => i.type === 'warning'), [issues]);
  const suggestions = useMemo(() => issues.filter(i => i.type === 'info'), [issues]);

  const handleAutoFix = () => {
    const { fixedQuery, applied } = applyAutoFix(queryString, tokens);
    if (queryString === fixedQuery) {
      return;
    }
    setQueryString(fixedQuery);
    if (addActivity) {
      addActivity('generate', 'Executed Boolean Query Auto-Fix clinic', applied.join(', '));
    }
  };

  const handleCopy = () => {
    if (!queryString) return;
    navigator.clipboard.writeText(queryString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-indigo-200/20 flex items-center gap-1.5">
            <Lucide.ShieldAlert className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
            Quality Assurance
          </span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-950 dark:text-white font-display">
          Syntax Validator
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mt-0.5 leading-relaxed">
          Paste any raw Boolean query to analyze syntax integrity. Detect unclosed brackets, dangling quotes, or uncapitalized operators in real-time.
        </p>
      </div>

      {/* Main Validation View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Input query and fix actions */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-gray-200 dark:border-gray-800 shadow-xs">
            <CardHeader className="py-4 border-b border-gray-150 dark:border-gray-850 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lucide.Keyboard className="w-4 h-4 text-indigo-500" />
                <CardTitle className="text-sm font-bold text-gray-800 dark:text-gray-200">Query Input Editor</CardTitle>
              </div>
              <span className="text-[10px] font-mono text-gray-400">{timeMs}ms analysis time</span>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              <textarea
                value={queryString}
                onChange={(e) => setQueryString(e.target.value)}
                placeholder="Paste your Boolean query here (e.g. (Java OR Python) AND 'Developer')..."
                className="w-full h-44 p-4 bg-gray-50 dark:bg-gray-950 text-xs font-mono rounded-xl border border-gray-200 dark:border-gray-850 text-gray-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-semibold"
              />

              {/* Sample loader row */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider font-mono">
                  Load Clinical Sandbox Examples
                </span>
                <div className="flex flex-wrap gap-2">
                  {SAMPLES.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setQueryString(sample.text)}
                      className="px-2.5 py-1 text-[10px] font-bold bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg border border-gray-200 dark:border-gray-850 transition-all cursor-pointer"
                    >
                      {sample.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom auto-repair and copy buttons */}
              <div className="flex items-center justify-between border-t border-gray-150 dark:border-gray-850 pt-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    disabled={!queryString.trim()}
                    className="font-bold py-1.5 h-9"
                  >
                    {copied ? (
                      <>
                        <Lucide.Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Lucide.Copy className="w-3.5 h-3.5" />
                        <span>Copy String</span>
                      </>
                    )}
                  </Button>
                </div>

                {issues.length > 0 && (
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={handleAutoFix}
                    icon="Sparkles"
                    className="font-bold py-1.5 h-9 bg-emerald-600 text-white hover:bg-emerald-700 hover:text-white"
                  >
                    Auto-Fix Query
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Validation Feedback Panel */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-gray-200 dark:border-gray-800 shadow-xs h-full flex flex-col justify-between">
            <div>
              <CardHeader className="py-4 border-b border-gray-150 dark:border-gray-850 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lucide.Activity className="w-4 h-4 text-indigo-500" />
                  <CardTitle className="text-sm font-bold text-gray-800 dark:text-gray-200">Validation Diagnostics</CardTitle>
                </div>
                <Badge
                  variant={issues.length === 0 ? 'success' : (errors.length > 0 ? 'danger' : 'warning')}
                  className="text-[10px] font-bold"
                >
                  {scoreObj.score}% Structural Health
                </Badge>
              </CardHeader>
              
              <CardContent className="pt-5 space-y-4.5">
                {/* Stats widget panel */}
                <div className="grid grid-cols-3 gap-2.5 text-center">
                  <div className="p-3 bg-gray-50/50 dark:bg-gray-900/40 rounded-xl border border-gray-150 dark:border-gray-850">
                    <span className="text-[9px] font-mono font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">Chars</span>
                    <span className="text-base font-extrabold text-gray-800 dark:text-white font-mono mt-0.5 block">{stats.characters}</span>
                  </div>
                  <div className="p-3 bg-gray-50/50 dark:bg-gray-900/40 rounded-xl border border-gray-150 dark:border-gray-850">
                    <span className="text-[9px] font-mono font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">Operators</span>
                    <span className="text-base font-extrabold text-gray-800 dark:text-white font-mono mt-0.5 block">{stats.operators}</span>
                  </div>
                  <div className="p-3 bg-gray-50/50 dark:bg-gray-900/40 rounded-xl border border-gray-150 dark:border-gray-850">
                    <span className="text-[9px] font-mono font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">Brackets</span>
                    <span className="text-base font-extrabold text-gray-800 dark:text-white font-mono mt-0.5 block">{stats.groups}</span>
                  </div>
                </div>

                {/* Diagnostics list */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest font-mono">
                    Issue Diagnostics ({issues.length})
                  </span>
                  
                  {issues.length > 0 ? (
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {issues.map((issue, idx) => {
                        const isError = issue.type === 'error';
                        const isWarning = issue.type === 'warning';
                        return (
                          <div
                            key={idx}
                            className={`p-3 border rounded-xl flex items-start gap-2.5 text-[11px] leading-relaxed transition-all ${
                              isError
                                ? 'bg-red-50/50 border-red-100 text-red-800 dark:bg-red-950/10 dark:border-red-900/30 dark:text-red-300'
                                : (isWarning 
                                  ? 'bg-amber-50/40 border-amber-150 text-amber-800 dark:bg-amber-950/10 dark:border-amber-900/20 dark:text-amber-300'
                                  : 'bg-indigo-50/20 border-indigo-100 text-indigo-800 dark:bg-indigo-950/10 dark:border-indigo-900/20 dark:text-indigo-300')
                            }`}
                          >
                            <div className="mt-0.5 shrink-0">
                              {isError && <Lucide.AlertOctagon className="w-4 h-4 text-red-500" />}
                              {isWarning && <Lucide.AlertTriangle className="w-4 h-4 text-amber-500" />}
                              {!isError && !isWarning && <Lucide.Lightbulb className="w-4 h-4 text-indigo-500" />}
                            </div>
                            <div>
                              <p className="font-extrabold">{issue.message}</p>
                              {issue.suggestion && (
                                <p className="text-[10px] opacity-80 mt-0.5 italic">Suggestion: {issue.suggestion}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-6 bg-emerald-50/30 dark:bg-emerald-950/10 border border-emerald-150/40 dark:border-emerald-900/30 rounded-xl flex items-center gap-3 text-emerald-800 dark:text-emerald-400">
                      <Lucide.CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      <div>
                        <p className="font-extrabold text-xs">Pristine Query Structure</p>
                        <p className="text-[10px] opacity-80 leading-normal mt-0.5">No syntax, quotation, or brackets errors found. This search is perfect for indexing databases.</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
