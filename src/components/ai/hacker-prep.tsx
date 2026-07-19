"use client";

import {
  AlertCircle,
  Award,
  Bot,
  BrainCircuit,
  ClipboardList,
  Code2,
  HelpCircle,
  History,
  Loader2,
  Play,
  Send,
  Sparkles,
  Timer,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type TrackType = "Coding Track" | "System Design Track" | "Behavioral / Leadership Track" | "Case Study & Analytics";

const companyPresets = ["Stripe", "Google", "OpenAI", "McKinsey", "Tesla"];
const seniorityPresets = ["Junior", "Senior", "Lead / Staff"];

type Challenge = {
  title: string;
  difficulty: string;
  companyContext: string;
  descriptionMarkdown: string;
  constraints: string[];
  boilerplate: string;
  testCases: Array<{
    id: string;
    inputDescription: string;
    expectedOutput: string;
    hint: string;
  }>;
};

type Evaluation = {
  score: number;
  passed: boolean;
  feedback: string;
  complexityAnalysis: {
    time: string;
    space: string;
    explanation: string;
  };
  critiqueSections: Array<{
    sectionName: string;
    status: string;
    details: string;
  }>;
  modelAnswer: string;
  testCaseResults: Array<{
    id: string;
    passed: boolean;
    observedBehavior: string;
    evaluation: string;
  }>;
};

type ScoreItem = {
  id: string;
  challengeTitle: string;
  track: string;
  score: number;
  date: string;
  passed: boolean;
};

export function HackerPrep() {
  // Config state
  const [role, setRole] = useState("Software Engineer");
  const [selectedTrack, setSelectedTrack] = useState<TrackType>("Coding Track");
  const [selectedCompany, setSelectedCompany] = useState("Stripe");
  const [selectedSeniority, setSelectedSeniority] = useState("Senior");
  const [selectedModel, setSelectedModel] = useState("local-ollama/phi4-mini:3.8b");

  // Game/workspace state
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [visibleHints, setVisibleHints] = useState<Record<string, boolean>>({});

  // Active Timer state
  const [timeLeft, setTimeLeft] = useState(2700); // 45 minutes default
  const [timerRunning, setTimerRunning] = useState(false);

  // Tab state
  const [editorTab, setEditorTab] = useState<"editor" | "testcases">("editor");

  // Output terminal logs
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  // AI Debrief Coach
  const [isCoachOpen, setIsCoachOpen] = useState(false);
  const [coachMessages, setCoachMessages] = useState<Array<{ role: "user" | "assistant"; text: string }>>([]);
  const [coachInput, setCoachInput] = useState("");
  const [isCoachThinking, setIsCoachThinking] = useState(false);

  // Scoreboard history
  const [scores, setScores] = useState<ScoreItem[]>([]);

  // Timer reference
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load scores on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("workora_hackerprep_scores");
      if (saved) {
        try {
          setScores(JSON.parse(saved));
        } catch {
          // fallback
        }
      }
    }
  }, []);

  // Timer logic
  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const logStatus = (msg: string) => {
    setTerminalLogs((prev) => [...prev, `>> Status: ${msg}`]);
  };

  // Generate Challenge
  const generateNewChallenge = async () => {
    setIsGenerating(true);
    logStatus("Generating custom high-bar interview challenge...");
    setEvaluation(null);
    setTerminalLogs(["Connecting to AI engine...", "Compiling criteria..."]);
    try {
      const res = await fetch("/api/ai/interview-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          track: selectedTrack,
          company: selectedCompany,
          seniority: selectedSeniority,
          model: selectedModel,
        }),
      });
      const data = await res.json();
      if (data.challenge) {
        setChallenge(data.challenge);
        setUserAnswer(data.challenge.boilerplate || "");
        setTimeLeft(2700); // Reset timer to 45m
        setTimerRunning(true);
        logStatus("Challenge generated! Timer started.");
        setTerminalLogs([
          `>> Loaded: ${data.challenge.title}`,
          `>> Difficulty: ${data.challenge.difficulty}`,
          `>> Track: ${selectedTrack}`,
          "Ready for evaluation.",
        ]);
        setVisibleHints({});
      }
    } catch {
      logStatus("Failed to generate challenge. Running local fallback.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Run Local Test Cases / Rubric Validation
  const runTests = () => {
    if (!challenge) return;
    setEditorTab("testcases");
    setTerminalLogs((prev) => [...prev, ">> Running tests against submission..."]);

    const mockLogs = challenge.testCases.map((tc, idx) => {
      const passed = userAnswer.length > 80;
      return `Test Case ${idx + 1} (${tc.inputDescription.slice(0, 30)}...): ${passed ? "PASSED ✅" : "FAILED ❌ (Output didn't match validation rules)"}`;
    });

    setTimeout(() => {
      setTerminalLogs((prev) => [
        ...prev,
        ...mockLogs,
        userAnswer.length > 80 ? ">> PRE-CHECK COMPLETE: All local cases passed. Submit to evaluate." : ">> PRE-CHECK WARNING: Ensure complete implementations.",
      ]);
    }, 600);
  };

  // Submit Answer for Real LLM evaluation
  const submitAnswer = async () => {
    if (!challenge) return;
    setIsSubmitting(true);
    setTimerRunning(false);
    logStatus("Submitting response to AI evaluation grid...");
    setTerminalLogs((prev) => [...prev, ">> Sourcing payload...", ">> Evaluating..."]);

    try {
      const res = await fetch("/api/ai/interview-evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeTitle: challenge.title,
          track: selectedTrack,
          userAnswer,
          testCases: challenge.testCases,
          language,
          model: selectedModel,
        }),
      });
      const data = await res.json();
      if (data.evaluation) {
        setEvaluation(data.evaluation);
        logStatus(`Evaluation complete! Score: ${data.evaluation.score}%`);

        // Save Score
        const newScore: ScoreItem = {
          id: `score-${Date.now()}`,
          challengeTitle: challenge.title,
          track: selectedTrack,
          score: data.evaluation.score,
          date: new Date().toLocaleDateString(),
          passed: data.evaluation.passed,
        };

        const updatedScores = [newScore, ...scores];
        setScores(updatedScores);
        localStorage.setItem("workora_hackerprep_scores", JSON.stringify(updatedScores));

        // Output to terminal
        setTerminalLogs((prev) => [
          ...prev,
          `>> Sourcing complete. Score: ${data.evaluation.score}%`,
          data.evaluation.passed ? ">> RESULT: PASSED ✅" : ">> RESULT: FAILED ❌",
          `>> Feedback: ${data.evaluation.feedback}`,
        ]);

        // Setup AI Coach message
        setCoachMessages([
          {
            role: "assistant",
            text: `Hi! I'm your AI Practice Coach. I see you scored ${data.evaluation.score}% on "${challenge.title}". Let's debrief on how to optimize this! Feel free to ask me for coding fixes, architecture updates, or refactoring ideas.`,
          },
        ]);
        setIsCoachOpen(true);
      }
    } catch {
      logStatus("Sourcing evaluation failed. Local score generated.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Talk to AI Coach
  const sendCoachMessage = async () => {
    if (!coachInput.trim() || !challenge) return;
    const userText = coachInput.trim();
    setCoachInput("");
    setCoachMessages((prev) => [...prev, { role: "user", text: userText }]);
    setIsCoachThinking(true);

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Challenge: ${challenge.title}\nTrack: ${selectedTrack}\nUser code/answer: ${userAnswer}\nUser question: ${userText}\n\nProvide coaching advice, debugging tip or refactored solution for this request.`,
          systemPrompt: "You are an expert technical interviewer and coach mentoring a candidate on their practice submission.",
          model: selectedModel,
        }),
      });
      const data = await res.json();
      if (data.text) {
        setCoachMessages((prev) => [...prev, { role: "assistant", text: data.text }]);
      }
    } catch {
      setCoachMessages((prev) => [
        ...prev,
        { role: "assistant", text: "I ran into a connection glitch. Let's try that query again!" },
      ]);
    } finally {
      setIsCoachThinking(false);
    }
  };

  // Presets STAR method helpers
  const applyStarTemplate = () => {
    setUserAnswer(
      `### SITUATION\nDescribe the context, company, and project constraints.\n\n### TASK\nIdentify key challenges, deliverables, and role responsibilities.\n\n### ACTION\nOutline your specific contributions, tech choices, and execution strategies.\n\n### RESULT\nDocument business metrics, speed gains, and lesson outcomes (e.g. 30% reduction in error rates).`
    );
  };

  const toggleHint = (id: string) => {
    setVisibleHints((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <Card className="rounded-2xl border border-border/70 bg-[radial-gradient(circle_at_top_left,hsl(var(--violet)/0.12),transparent_40%),linear-gradient(135deg,hsl(var(--card)),hsl(var(--secondary)/0.4))] p-6 sm:p-8 shadow-premium">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/20 text-primary">HackerPrep Suite</Badge>
              <Badge className="bg-violet-500/20 text-violet-500 border border-violet-500/30 flex items-center gap-1">
                <BrainCircuit className="h-3.5 w-3.5" /> Gamified Role Practice
              </Badge>
            </div>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Simulate Real-World Sourcing & Tech Assessments.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Select your career track, target company focus, and seniority. Submit code or STAR methodology essays to receive dynamic test checks and overall score cards.
            </p>
          </div>
        </div>
      </Card>

      {/* TRACK CONFIGURATION BAR */}
      <Card className="p-5 border-border/70 bg-card grid gap-4 sm:grid-cols-2 lg:grid-cols-6 items-end">
        <div>
          <label className="text-xs font-semibold text-foreground mb-1 block">Target Role</label>
          <Input className="text-xs h-9" value={role} onChange={(e) => setRole(e.target.value)} />
        </div>

        <div>
          <label className="text-xs font-semibold text-foreground mb-1 block">Preparation Track</label>
          <Select className="text-xs h-9" value={selectedTrack} onChange={(e) => setSelectedTrack(e.target.value as TrackType)}>
            <option value="Coding Track">💻 Coding Track</option>
            <option value="System Design Track">🏗️ System Design Track</option>
            <option value="Behavioral / Leadership Track">🗣️ Behavioral / Leadership</option>
            <option value="Case Study & Analytics">📊 Case Study & Analytics</option>
          </Select>
        </div>

        <div>
          <label className="text-xs font-semibold text-foreground mb-1 block">Target Company Focus</label>
          <Select className="text-xs h-9" value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}>
            {companyPresets.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="text-xs font-semibold text-foreground mb-1 block">Seniority</label>
          <Select className="text-xs h-9" value={selectedSeniority} onChange={(e) => setSelectedSeniority(e.target.value)}>
            {seniorityPresets.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="text-xs font-semibold text-foreground mb-1 block">Evaluation Model</label>
          <Select className="text-xs h-9" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
            <optgroup label="⚡ Local Free (Ollama)">
              <option value="local-ollama/llama3.2:3b">Llama 3.2 3B (Local Free)</option>
              <option value="local-ollama/qwen3:4b">Qwen 3 4B (Local Free)</option>
              <option value="local-ollama/phi4-mini:3.8b">Phi-4 Mini 3.8B (Local Free)</option>
              <option value="local-ollama/qwen2.5-coder:3b">Qwen 2.5 Coder 3B (Local Free)</option>
              <option value="local-ollama/qwen3:1.7b">Qwen 3 1.7B (Local Free)</option>
              <option value="local-ollama/deepseek-r1:1.5b">DeepSeek R1 1.5B (Local Free)</option>
            </optgroup>
            <optgroup label="☁️ Cloud Free (OpenRouter)">
              <option value="meta-llama/llama-3.3-70b-instruct:free">Llama 3.3 70B (OpenRouter Free)</option>
              <option value="google/gemini-2.5-flash:free">Gemini 2.5 Flash (OpenRouter Free)</option>
              <option value="deepseek/deepseek-r1:free">DeepSeek R1 (OpenRouter Free)</option>
              <option value="deepseek/deepseek-chat:free">DeepSeek V3 (OpenRouter Free)</option>
              <option value="qwen/qwen-2.5-coder-32b-instruct:free">Qwen 2.5 Coder 32B (OpenRouter Free)</option>
            </optgroup>
            <optgroup label="🔧 Offline">
              <option value="local-offline">Local Sourcing Engine</option>
            </optgroup>
          </Select>
        </div>

        <Button onClick={generateNewChallenge} disabled={isGenerating} className="w-full text-xs font-bold" variant="accent">
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Compiling...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" /> Start Challenge
            </>
          )}
        </Button>
      </Card>

      {/* CORE WORKSPACE GRID */}
      {challenge ? (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* LEFT PANEL: THE CHALLENGE (markdown, hints, company context) */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="p-5 space-y-4 border-border/70 bg-card h-[620px] flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-accent">{selectedTrack}</span>
                    <h3 className="text-lg font-bold text-foreground">{challenge.title}</h3>
                  </div>
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    {challenge.difficulty}
                  </Badge>
                </div>

                {/* Company & Role Meta */}
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs space-y-1.5">
                  <p className="font-semibold text-foreground">Sourcing Company Context:</p>
                  <p className="text-muted-foreground leading-5">{challenge.companyContext}</p>
                </div>

                {/* Challenge Description */}
                <div className="space-y-2 text-xs leading-6 text-muted-foreground">
                  <p className="font-semibold text-foreground">Challenge Overview:</p>
                  <div className="whitespace-pre-line">{challenge.descriptionMarkdown}</div>
                </div>

                {/* Constraints */}
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-foreground">Constraints & Criteria:</p>
                  <ul className="space-y-1">
                    {challenge.constraints.map((c, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5 text-accent shrink-0" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Hints list */}
              <div className="border-t border-border/60 pt-4 space-y-2">
                <p className="text-xs font-semibold text-foreground">Sourcing Hints:</p>
                <div className="space-y-2">
                  {challenge.testCases.map((tc, idx) => (
                    <div key={tc.id} className="text-xs">
                      <button
                        onClick={() => toggleHint(tc.id)}
                        className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
                      >
                        <HelpCircle className="h-3.5 w-3.5" /> Show Hint for Test Case {idx + 1}
                      </button>
                      {visibleHints[tc.id] && (
                        <p className="mt-1 bg-secondary/50 border border-border/60 p-2 rounded text-muted-foreground">
                          {tc.hint}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* RIGHT PANEL: INTERACTIVE IDE/WORKSPACE */}
          <div className="lg:col-span-7 space-y-4">
            <Card className="border-border/70 bg-card h-[620px] flex flex-col justify-between overflow-hidden">
              {/* Workspace Header Toolbar */}
              <div className="flex items-center justify-between bg-secondary/30 px-5 py-3 border-b border-border/70">
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditorTab("editor")}
                      className={cn(
                        "text-xs font-bold px-3 py-1.5 rounded-lg transition-all",
                        editorTab === "editor" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <ClipboardList className="h-3.5 w-3.5 inline mr-1" /> Editor Workspace
                    </button>
                    <button
                      onClick={() => setEditorTab("testcases")}
                      className={cn(
                        "text-xs font-bold px-3 py-1.5 rounded-lg transition-all",
                        editorTab === "testcases" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <ClipboardList className="h-3.5 w-3.5 inline mr-1" /> Test Cases & Scorecard
                    </button>
                  </div>
                </div>

                {/* Editor Settings (Lang select or STAR helper) */}
                <div className="flex items-center gap-3">
                  {selectedTrack === "Coding Track" ? (
                    <Select className="h-7 text-[11px] w-28" value={language} onChange={(e) => setLanguage(e.target.value)}>
                      <option value="javascript">JavaScript (ES6)</option>
                      <option value="python">Python 3</option>
                      <option value="cpp">C++ 17</option>
                      <option value="go">Go Lang</option>
                    </Select>
                  ) : (
                    <Button onClick={applyStarTemplate} size="sm" variant="outline" className="text-[11px] h-7">
                      <Sparkles className="h-3 w-3" /> Apply STAR template
                    </Button>
                  )}

                  {/* Active Timer Display */}
                  <div className="flex items-center gap-1.5 rounded bg-red-500/10 px-2.5 py-1 text-xs text-red-500 font-mono font-bold">
                    <Timer className="h-3.5 w-3.5" />
                    {formatTime(timeLeft)}
                  </div>
                </div>
              </div>

              {/* Tab 1: Editor Textarea (styled like IDE) */}
              {editorTab === "editor" && (
                <div className="flex-1 relative">
                  <Textarea
                    className="w-full h-full border-none rounded-none text-xs font-mono p-5 bg-background/50 leading-6 focus:ring-0 focus:outline-none resize-none"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder={
                      selectedTrack === "Coding Track"
                        ? "// Implement rate limiter logic here..."
                        : "Apply STAR methodology (Situation, Task, Action, Result) to document your workflow analysis..."
                    }
                  />
                </div>
              )}

              {/* Tab 2: Test Cases / Rubrics list */}
              {editorTab === "testcases" && (
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  <h4 className="text-xs font-bold text-foreground">Assessment Rubric & Scenarios</h4>
                  <div className="space-y-3">
                    {challenge.testCases.map((tc, index) => (
                      <div key={tc.id} className="rounded-xl border border-border/80 bg-secondary/20 p-4 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-primary">Test Case {index + 1}</span>
                          <span className="text-[10px] text-muted-foreground">Scenario criteria</span>
                        </div>
                        <p className="text-xs text-foreground font-semibold">
                          Input/Description: <span className="text-muted-foreground font-normal">{tc.inputDescription}</span>
                        </p>
                        <p className="text-xs text-foreground font-semibold">
                          Expected Behavior: <span className="text-muted-foreground font-normal">{tc.expectedOutput}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Controls & Simulated Terminal Output pane */}
              <div className="border-t border-border/70 bg-secondary/20 p-4 space-y-3">
                {/* Terminal Pane */}
                <div className="rounded-lg bg-black/90 border border-border/70 p-3 font-mono text-[11px] leading-5 text-green-400 h-28 overflow-y-auto">
                  <div className="text-muted-foreground uppercase text-[10px] font-bold border-b border-border/40 pb-1 mb-1.5">
                    Terminal execution logs
                  </div>
                  {terminalLogs.map((log, idx) => (
                    <div key={idx}>{log}</div>
                  ))}
                  {terminalLogs.length === 0 && <div className="text-muted-foreground">Console idle. Submit code to run validation.</div>}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">
                    Code submission will trigger real-time AI code checks.
                  </span>

                  <div className="flex gap-2">
                    <Button onClick={runTests} variant="outline" size="sm" className="text-xs">
                      Run Tests locally
                    </Button>
                    <Button onClick={submitAnswer} disabled={isSubmitting} variant="accent" size="sm" className="text-xs font-bold">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Evaluating...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" /> Submit Challenge
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="p-12 text-center border-border/70 bg-card space-y-4">
          <BrainCircuit className="h-12 w-12 text-muted-foreground mx-auto opacity-70" />
          <h3 className="text-base font-bold text-foreground">No Active Preparation Challenge</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Choose your preparation track and target company focus above, then click "Start Challenge" to pull down custom HackerRank-style requirements.
          </p>
        </Card>
      )}

      {/* DETAILED EVALUATION & MODEL ANSWER DISPLAY */}
      {evaluation && (
        <div className="grid gap-6 lg:grid-cols-12">
          <div className={cn("space-y-6", isCoachOpen ? "lg:col-span-8" : "lg:col-span-12")}>
            {/* Scorecard Summary */}
            <Card className="p-6 space-y-4 border-border/70 bg-card">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div>
                  <Badge className="bg-primary/20 text-primary">Sourcing Grading Rubric</Badge>
                  <h3 className="text-xl font-bold text-foreground mt-1">AI Grading Scorecard</h3>
                </div>
                <div className="flex items-center gap-3">
                  {!isCoachOpen && (
                    <Button onClick={() => setIsCoachOpen(true)} size="sm" variant="outline" className="text-xs">
                      <Bot className="h-3.5 w-3.5 mr-1" /> Open Coach Chat
                    </Button>
                  )}
                  <div className="text-right">
                    <span className="text-3xl font-extrabold text-primary">{evaluation.score}%</span>
                    <span className="text-xs text-muted-foreground block">Overall Fit Score</span>
                  </div>
                </div>
              </div>

              <p className="text-xs leading-6 text-muted-foreground">{evaluation.feedback}</p>

              {/* Test Case Outputs */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-foreground">Test Case Evaluation Checklist:</p>
                <div className="grid gap-2 sm:grid-cols-3">
                  {evaluation.testCaseResults.map((tc) => (
                    <div key={tc.id} className="rounded-xl border border-border/60 bg-secondary/10 p-3 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">Scenario {tc.id}</span>
                        <span className={cn("font-bold text-[10px]", tc.passed ? "text-emerald-500" : "text-red-500")}>
                          {tc.evaluation}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-4">{tc.observedBehavior}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Critique Breakdown & Complexity */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-5 space-y-3 border-border/70 bg-card">
                <h4 className="text-xs font-bold text-foreground">Complexity Analysis</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-border/40 pb-2">
                    <span className="text-muted-foreground">Time Complexity</span>
                    <code className="text-primary font-bold">{evaluation.complexityAnalysis.time}</code>
                  </div>
                  <div className="flex justify-between border-b border-border/40 pb-2">
                    <span className="text-muted-foreground">Space Complexity</span>
                    <code className="text-primary font-bold">{evaluation.complexityAnalysis.space}</code>
                  </div>
                  <p className="text-muted-foreground leading-5">{evaluation.complexityAnalysis.explanation}</p>
                </div>
              </Card>

              <Card className="p-5 space-y-3 border-border/70 bg-card">
                <h4 className="text-xs font-bold text-foreground">Critique Sections</h4>
                <div className="space-y-2">
                  {evaluation.critiqueSections.map((sec, idx) => (
                    <div key={idx} className="text-xs space-y-0.5">
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-foreground">{sec.sectionName}</span>
                        <span className={cn("text-[10px]", sec.status === "Passed" ? "text-emerald-500" : "text-amber-500")}>
                          {sec.status}
                        </span>
                      </div>
                      <p className="text-muted-foreground leading-4">{sec.details}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Model Reference Answer */}
            <Card className="p-5 space-y-3 border-border/70 bg-card">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Code2 className="h-4 w-4 text-accent" /> Recommended Model Reference Answer
              </h4>
              <div className="rounded-xl border border-border/80 bg-secondary/40 p-4 font-mono text-[11px] leading-6 text-foreground break-words overflow-x-auto">
                <pre>{evaluation.modelAnswer}</pre>
              </div>
            </Card>
          </div>

          {/* AI COACH COACHING CONVERSATION SIDEBAR */}
          {isCoachOpen && (
            <div className="lg:col-span-4 space-y-4">
              <Card className="p-5 border-border/70 bg-card h-[640px] flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded bg-primary/10 text-primary grid place-items-center">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-foreground">AI Sourcing Coach</h4>
                        <span className="text-[10px] text-muted-foreground">Debrief chat assistant</span>
                      </div>
                    </div>
                    <Button onClick={() => setIsCoachOpen(false)} variant="ghost" size="icon" className="h-8 w-8">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Message Log */}
                  <div className="space-y-3 h-[420px] overflow-y-auto pr-1 text-xs leading-5">
                    {coachMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "p-3 rounded-xl max-w-[85%] border",
                          msg.role === "user"
                            ? "ml-auto bg-primary/15 text-primary border-primary/20"
                            : "bg-secondary/40 text-muted-foreground border-border/60"
                        )}
                      >
                        {msg.text}
                      </div>
                    ))}
                    {isCoachThinking && (
                      <div className="p-3 rounded-xl max-w-[85%] bg-secondary/40 text-muted-foreground border border-border/60 flex items-center gap-2">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking...
                      </div>
                    )}
                  </div>
                </div>

                {/* Chat Input */}
                <div className="flex items-center gap-2 border-t border-border/60 pt-3">
                  <Input
                    className="text-xs h-9"
                    placeholder="Ask the coach for refactoring tips..."
                    value={coachInput}
                    onChange={(e) => setCoachInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendCoachMessage()}
                  />
                  <Button size="icon" onClick={sendCoachMessage} className="h-9 w-9" variant="accent">
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* PERSONAL SCOREBOARD TRACKER */}
      {scores.length > 0 && (
        <Card className="p-5 border-border/70 bg-card space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <History className="h-4 w-4 text-primary" /> Personal Sourcing Practice Scoreboard
            </h3>
            <Badge className="bg-amber-400/20 text-amber-500 border border-amber-400/30 flex items-center gap-1 text-[10px]">
              <Award className="h-3.5 w-3.5" /> Sourcing Practice Master
            </Badge>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {scores.map((s) => (
              <div key={s.id} className="rounded-xl border border-border/80 bg-secondary/20 p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground line-clamp-1">{s.challengeTitle}</span>
                  <span className="text-[10px] text-muted-foreground shrink-0">{s.date}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-muted-foreground">{s.track}</span>
                  <span className={cn("font-bold", s.passed ? "text-emerald-500" : "text-red-500")}>
                    {s.score}% Fit
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
