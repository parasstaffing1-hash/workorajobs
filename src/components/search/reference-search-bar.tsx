"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Search, X, ArrowRight, MapPin, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export interface ReferenceSearchBarProps {
  examples?: string[];
  loop?: boolean;
  autoPlay?: boolean;
  startOnViewport?: boolean;
  background?: "transparent" | "dark" | "light" | string;
  onAnimationComplete?: () => void;
  enableInteractiveSearch?: boolean;
  className?: string;
}

const defaultWorkoraExamples = [
  "Search software engineering jobs",
  "Find remote jobs at Google",
  "Explore companies hiring now",
  "Search jobs by title or location",
];

// Easing curve specified: cubic-bezier(0.22, 1, 0.36, 1)
const easeCurve = [0.22, 1, 0.36, 1] as const;


export function ReferenceSearchBar({
  examples = defaultWorkoraExamples,
  loop = true,
  autoPlay = true,
  startOnViewport = true,
  background = "transparent",
  onAnimationComplete,
  enableInteractiveSearch = true,
  className = "",
}: ReferenceSearchBarProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: !loop, amount: 0.3 });

  // Animation Stage States:
  // 'dot' | 'button' | 'expand' | 'typing' | 'pause' | 'dim' | 'interactive'
  const [stage, setStage] = useState<
    "dot" | "button" | "expand" | "typing" | "pause" | "dim" | "interactive"
  >("dot");

  const [currentExampleIdx, setCurrentExampleIdx] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Real interactive search inputs
  const [userQuery, setUserQuery] = useState("");
  const [userLocation, setUserLocation] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setIsReducedMotion(mediaQuery.matches);
      if (mediaQuery.matches) {
        setStage("interactive");
      }
    }
  }, []);

  // Sequence Controller
  useEffect(() => {
    if (isReducedMotion) return;
    if (startOnViewport && !isInView) return;
    if (!autoPlay && stage === "dot") return;

    let timeoutId: NodeJS.Timeout;

    // Stage 1: Dot (200ms) -> Button
    if (stage === "dot") {
      timeoutId = setTimeout(() => {
        setStage("button");
      }, 200);
    }
    // Stage 2: Button (300ms) -> Expand
    else if (stage === "button") {
      timeoutId = setTimeout(() => {
        setStage("expand");
      }, 300);
    }
    // Stage 3: Expand (700ms) -> Typing
    else if (stage === "expand") {
      timeoutId = setTimeout(() => {
        setStage("typing");
      }, 700);
    }
    // Stage 4: Typing (60-90ms per character)
    else if (stage === "typing") {
      const targetText = examples[currentExampleIdx] || "";
      if (typedText.length < targetText.length) {
        timeoutId = setTimeout(() => {
          setTypedText(targetText.slice(0, typedText.length + 1));
        }, 75);
      } else {
        // Typing complete -> Pause
        setStage("pause");
      }
    }
    // Stage 5: Pause (1000ms) -> Dim or Interactive
    else if (stage === "pause") {
      timeoutId = setTimeout(() => {
        if (enableInteractiveSearch && !loop) {
          setStage("interactive");
        } else {
          setStage("dim");
        }
      }, 1000);
    }
    // Stage 6: Dim & Shrink (500ms) -> Next Loop or Interactive
    else if (stage === "dim") {
      timeoutId = setTimeout(() => {
        if (onAnimationComplete) onAnimationComplete();

        if (loop) {
          // Reset for next example
          setTypedText("");
          setCurrentExampleIdx((prev) => (prev + 1) % examples.length);
          setStage("dot");
        } else if (enableInteractiveSearch) {
          setStage("interactive");
        }
      }, 500);
    }

    return () => clearTimeout(timeoutId);
  }, [
    stage,
    typedText,
    currentExampleIdx,
    examples,
    isInView,
    autoPlay,
    startOnViewport,
    loop,
    enableInteractiveSearch,
    isReducedMotion,
    onAnimationComplete,
  ]);

  // Handle real interactive search submit
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userQuery.trim() && !userLocation.trim()) return;

    const params = new URLSearchParams();
    if (userQuery.trim()) params.set("q", userQuery.trim());
    if (userLocation.trim()) params.set("location", userLocation.trim());
    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <div
      ref={containerRef}
      className={`w-full max-w-[900px] mx-auto min-h-[120px] flex items-center justify-center relative z-20 px-4 ${className}`}
      style={{
        background:
          background === "transparent"
            ? "transparent"
            : background === "dark"
            ? "#0f172a"
            : background === "light"
            ? "#f8fafc"
            : background,
      }}
    >
      {/* Stage 1: Centered Gray Dot */}
      {stage === "dot" && (
        <motion.div
          key="dot"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: easeCurve }}
          className="w-4 h-4 rounded-full bg-slate-400 dark:bg-slate-500"
          aria-hidden="true"
        />
      )}

      {/* Stage 2: Circular White Search Button */}
      {stage === "button" && (
        <motion.div
          key="button"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3, ease: easeCurve }}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white shadow-2xl shadow-slate-900/15 flex items-center justify-center border border-slate-100"
          aria-hidden="true"
        >
          <Search className="w-6 h-6 sm:w-7 sm:h-7 text-slate-400" />
        </motion.div>
      )}

      {/* Stage 3 - 6: Horizontal Expanding Pill Search Bar (Animated Intro) */}
      {(stage === "expand" || stage === "typing" || stage === "pause" || stage === "dim") && (
        <motion.div
          key="animated-bar"
          initial={{ width: "64px", opacity: 0.8 }}
          animate={{
            width: stage === "dim" ? "80%" : "100%",
            opacity: stage === "dim" ? 0.4 : 1,
            scale: stage === "dim" ? 0.96 : 1,
          }}
          transition={{
            width: { duration: 0.7, ease: easeCurve },
            opacity: { duration: 0.4 },
            scale: { duration: 0.4 },
          }}
          onClick={() => {
            if (enableInteractiveSearch) {
              setStage("interactive");
              setTimeout(() => inputRef.current?.focus(), 100);
            }
          }}
          className="h-16 sm:h-20 lg:h-24 rounded-full bg-white shadow-2xl shadow-slate-900/12 border border-slate-200/80 flex items-center px-5 sm:px-8 cursor-pointer overflow-hidden max-w-[900px] w-full"
          aria-label="Search preview animation"
        >
          <Search className="w-6 h-6 sm:w-8 sm:h-8 lg:w-9 lg:h-9 text-slate-400 shrink-0 mr-4 sm:mr-6" />
          
          <div className="flex-1 overflow-hidden">
            <span className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-800 dark:text-slate-900 tracking-tight select-none">
              {typedText}
            </span>
            {stage === "typing" && (
              <span className="inline-block w-0.5 h-6 sm:h-8 bg-primary ml-1 animate-pulse align-middle" />
            )}
          </div>
        </motion.div>
      )}

      {/* Stage 7 / Final: Real Interactive WorkoraJobs Search Input */}
      {stage === "interactive" && (
        <motion.form
          key="interactive-bar"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: easeCurve }}
          onSubmit={handleSearchSubmit}
          className="w-full max-w-[900px] h-16 sm:h-20 lg:h-24 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-900/10 flex items-center px-3 sm:px-6 p-2 gap-2"
          role="search"
          aria-label="Search jobs and companies"
        >
          {/* Role / Skill Keywords Input */}
          <div className="flex items-center flex-1 h-full px-3 gap-3">
            <Search className="w-6 h-6 sm:w-7 sm:h-7 text-primary shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Job title, skill, or company..."
              className="w-full bg-transparent border-none focus:outline-none text-base sm:text-xl lg:text-2xl font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 tracking-tight"
              aria-label="Search keywords, job title, or company"
            />
            {userQuery && (
              <button
                type="button"
                onClick={() => setUserQuery("")}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white shrink-0"
                aria-label="Clear query input"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Location Field (Tablet / Desktop) */}
          <div className="hidden sm:flex items-center flex-1 h-full px-4 border-l border-slate-200 dark:border-slate-800 gap-3">
            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 shrink-0" />
            <input
              type="text"
              value={userLocation}
              onChange={(e) => setUserLocation(e.target.value)}
              placeholder="City or 'Remote'"
              className="w-full bg-transparent border-none focus:outline-none text-base sm:text-lg font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 tracking-tight"
              aria-label="Search location"
            />
          </div>

          {/* Submit Search Button */}
          <button
            type="submit"
            className="h-12 sm:h-14 lg:h-16 px-6 sm:px-8 rounded-full bg-primary hover:bg-blue-600 text-white font-bold text-base sm:text-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/30 transition-all duration-200 shrink-0 cursor-pointer active:scale-95 group"
          >
            <span>Search</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.form>
      )}
    </div>
  );
}
