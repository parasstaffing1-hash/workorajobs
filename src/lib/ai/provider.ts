/**
 * Unified AI Provider Engine for WorkoraJobs (Google Gemini & Groq)
 *
 * Supports:
 * 1. Google Gemini 2.0 (via @google/genai SDK & GEMINI_API_KEY)
 * 2. Groq Llama-3.3 / DeepSeek (via OpenAI-compatible API & GROQ_API_KEY)
 */

import { GoogleGenAI } from "@google/genai";

export interface AICompletionOptions {
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  provider?: "gemini" | "groq" | "auto";
}

export interface AICompletionResult {
  text: string;
  provider: "gemini" | "groq";
  model: string;
}

/**
 * Executes text completion using Google Gemini 2.0
 */
export async function generateWithGemini(
  prompt: string,
  systemPrompt?: string
): Promise<AICompletionResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("[AI Provider Error] Missing GEMINI_API_KEY in environment variables.");
  }

  const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: modelName,
    contents: systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt,
  });

  return {
    text: response.text || "",
    provider: "gemini",
    model: modelName,
  };
}

/**
 * Executes fast completion using Groq Llama-3.3 / DeepSeek via OpenAI-compatible endpoint
 */
export async function generateWithGroq(
  prompt: string,
  systemPrompt?: string,
  temperature = 0.7
): Promise<AICompletionResult> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("[AI Provider Error] Missing GROQ_API_KEY in environment variables.");
  }

  const modelName = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

  const messages: Array<{ role: "system" | "user"; content: string }> = [];
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }
  messages.push({ role: "user", content: prompt });

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelName,
      messages,
      temperature,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`[Groq API Error] HTTP ${res.status}: ${errorBody}`);
  }

  const data = (await res.json()) as {
    choices: Array<{ message: { content: string } }>;
  };

  return {
    text: data.choices[0]?.message?.content || "",
    provider: "groq",
    model: modelName,
  };
}

/**
 * Universal completion helper with automatic fallback between Gemini and Groq
 */
export async function generateAICompletion(
  options: AICompletionOptions
): Promise<AICompletionResult> {
  const { prompt, systemPrompt, provider = "auto" } = options;

  if (provider === "gemini") {
    return generateWithGemini(prompt, systemPrompt);
  }

  if (provider === "groq") {
    return generateWithGroq(prompt, systemPrompt);
  }

  // Auto mode: Try Gemini first, fallback to Groq
  if (process.env.GEMINI_API_KEY) {
    try {
      return await generateWithGemini(prompt, systemPrompt);
    } catch (err) {
      console.warn("[AI Provider] Gemini failed, falling back to Groq:", (err as Error).message);
      if (process.env.GROQ_API_KEY) {
        return await generateWithGroq(prompt, systemPrompt);
      }
    }
  }

  if (process.env.GROQ_API_KEY) {
    return await generateWithGroq(prompt, systemPrompt);
  }

  throw new Error("[AI Provider Error] Neither GEMINI_API_KEY nor GROQ_API_KEY is configured.");
}
