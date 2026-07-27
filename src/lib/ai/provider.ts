/**
 * Unified AI Provider Engine for WorkoraJobs (Google Gemini, Anthropic Claude & Groq)
 */

import { GoogleGenAI } from "@google/genai";

export interface AICompletionOptions {
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  provider?: "gemini" | "claude" | "groq" | "auto";
}

export interface AICompletionResult {
  text: string;
  provider: "gemini" | "claude" | "groq";
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
 * Executes completion using Anthropic Claude (or Claude via OpenRouter/Google Cloud)
 */
export async function generateWithClaude(
  prompt: string,
  systemPrompt?: string,
  temperature = 0.7
): Promise<AICompletionResult> {
  const apiKey = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY || process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("[AI Provider Error] Missing CLAUDE_API_KEY or ANTHROPIC_API_KEY in environment variables.");
  }

  const modelName = process.env.CLAUDE_MODEL || "claude-3-5-sonnet-20241022";
  const endpoint = process.env.OPENROUTER_API_KEY
    ? "https://openrouter.ai/api/v1/chat/completions"
    : "https://api.anthropic.com/v1/messages";

  if (endpoint.includes("openrouter.ai")) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: `anthropic/${modelName}`,
        messages: [
          ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
          { role: "user", content: prompt },
        ],
        temperature,
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`[Claude API Error] HTTP ${res.status}: ${errorBody}`);
    }

    const data = (await res.json()) as { choices: Array<{ message: { content: string } }> };
    return {
      text: data.choices[0]?.message?.content || "",
      provider: "claude",
      model: modelName,
    };
  }

  // Direct Anthropic API endpoint
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: modelName,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }],
      temperature,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`[Anthropic API Error] HTTP ${res.status}: ${errorBody}`);
  }

  const data = (await res.json()) as { content: Array<{ text: string }> };
  return {
    text: data.content[0]?.text || "",
    provider: "claude",
    model: modelName,
  };
}

/**
 * Executes completion using Groq
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

  const data = (await res.json()) as { choices: Array<{ message: { content: string } }> };

  return {
    text: data.choices[0]?.message?.content || "",
    provider: "groq",
    model: modelName,
  };
}

/**
 * Universal completion helper with automatic fallback between Google Gemini, Claude, and Groq
 */
export async function generateAICompletion(
  options: AICompletionOptions
): Promise<AICompletionResult> {
  const { prompt, systemPrompt, provider = "auto" } = options;

  if (provider === "gemini") {
    return generateWithGemini(prompt, systemPrompt);
  }

  if (provider === "claude") {
    return generateWithClaude(prompt, systemPrompt);
  }

  if (provider === "groq") {
    return generateWithGroq(prompt, systemPrompt);
  }

  // Auto mode: Try Gemini -> Claude -> Groq
  if (process.env.GEMINI_API_KEY) {
    try {
      return await generateWithGemini(prompt, systemPrompt);
    } catch (err) {
      console.warn("[AI Provider] Gemini failed, attempting Claude fallback:", (err as Error).message);
    }
  }

  if (process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY) {
    try {
      return await generateWithClaude(prompt, systemPrompt);
    } catch (err) {
      console.warn("[AI Provider] Claude failed, attempting Groq fallback:", (err as Error).message);
    }
  }

  if (process.env.GROQ_API_KEY) {
    return await generateWithGroq(prompt, systemPrompt);
  }

  throw new Error("[AI Provider Error] No valid AI provider API key found (GEMINI_API_KEY, CLAUDE_API_KEY, ANTHROPIC_API_KEY, or GROQ_API_KEY).");
}
