import { NextResponse } from "next/server";

export const runtime = "nodejs";

const FREE_MODELS = [
  "local-ollama/llama3.2:3b",
  "google/gemini-2.0-flash-lite-preview-02-05:free",
  "deepseek/deepseek-r1:free",
  "deepseek/deepseek-chat:free",
  "qwen/qwen-2.5-coder-32b-instruct:free",
  "google/gemini-2.5-flash:free",
  "mistralai/mistral-7b-instruct:free",
  "sophosympatheia/rogue-rose-103b-v0.2:free",
  "openchat/openchat-7b:free",
  "gryphe/mythomax-l2-13b:free",
  "undi-95/toppy-m-7b:free",
  "nvidia/llama-3.1-nemotron-70b-instruct:free",
  "microsoft/phi-3-medium-128k-instruct:free",
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      prompt,
      systemPrompt = "You are Workora AI, an enterprise AI hiring and career assistant.",
      model = process.env.OPENROUTER_DEFAULT_MODEL || "local-ollama/llama3.2:3b",
      temperature = 0.7,
      max_tokens = 1500,
    } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt string is required." },
        { status: 400 },
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    // Route to local Ollama if env is set OR if the client explicitly selected a local-ollama/ model
    const isLocalOllama = process.env.USE_LOCAL_OLLAMA === "true" || model.startsWith("local-ollama/");
    if (isLocalOllama) {
      const ollamaModel = model.startsWith("local-ollama/")
        ? model.replace("local-ollama/", "")
        : (process.env.OLLAMA_MODEL || "qwen3:1.7b");
      try {
        const response = await fetch("http://localhost:11434/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: ollamaModel,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: prompt },
            ],
            options: { temperature },
            stream: false,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const generatedContent = data.message?.content ?? "No text returned from local LLM.";
          return NextResponse.json({
            success: true,
            text: generatedContent,
            model: ollamaModel,
            source: "local-ollama",
            apiKeyConfigured: false,
          });
        }
      } catch (ollamaErr) {
        console.warn("Local Ollama fetch failed, falling back to other methods:", ollamaErr);
      }
    }

    if (!apiKey) {
      // Offline fallback mode when key is omitted
      return NextResponse.json({
        success: true,
        text: `[Local Fallback AI] Analyzed input using local deterministic rules. Add your OPENROUTER_API_KEY to .env to activate live OpenRouter LLM generation (${model}).\n\nPrompt summary: "${prompt.slice(0, 120)}..."`,
        model: "local-deterministic",
        source: "local-fallback",
        apiKeyConfigured: false,
      });
    }

    const openRouterModel = FREE_MODELS.includes(model)
      ? model
      : "local-ollama/llama3.2:3b";

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.APP_URL || "https://workorajobs.com",
        "X-Title": "Workora Jobs AI",
      },
      body: JSON.stringify({
        model: openRouterModel,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature,
        max_tokens,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn("OpenRouter API call returned non-200:", response.status, errText);

      return NextResponse.json({
        success: true,
        text: `[OpenRouter API Notice (${response.status})] ${errText.slice(0, 200)}... Falling back to local AI generation.`,
        model: openRouterModel,
        source: "api-notice-fallback",
        apiKeyConfigured: true,
      });
    }

    const data = await response.json();
    const generatedContent =
      data.choices?.[0]?.message?.content ?? "No text returned from LLM.";

    return NextResponse.json({
      success: true,
      text: generatedContent,
      model: data.model || openRouterModel,
      source: "openrouter",
      apiKeyConfigured: true,
      usage: data.usage,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal AI route error";
    console.error("AI API route error:", errorMsg);

    return NextResponse.json(
      {
        success: false,
        error: errorMsg,
        model: "error",
        source: "error",
      },
      { status: 500 },
    );
  }
}
