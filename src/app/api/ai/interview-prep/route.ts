import { NextResponse } from "next/server";

export const runtime = "nodejs";

const FREE_MODELS = [
  "local-ollama/llama3.2:3b",
  "google/gemini-2.0-flash-lite-preview-02-05:free",
  "deepseek/deepseek-r1:free",
  "deepseek/deepseek-chat:free",
  "qwen/qwen-2.5-coder-32b-instruct:free",
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      role = "Software Engineer",
      track = "Coding Track",
      company = "Stripe",
      seniority = "Senior",
      model = "local-ollama/llama3.2:3b",
    } = body;

    const apiKey = process.env.OPENROUTER_API_KEY;

    const prompt = `Generate a realistic, high-bar interview challenge resembling a HackerRank/CodeChef challenge for:
Role: ${role}
Track: ${track}
Target Company Focus: ${company}
Seniority: ${seniority}

Return EXACTLY a JSON object with this shape. Do not put markdown backticks, explanations or wrappers around the JSON. Return only raw JSON:
{
  "title": "Title of the challenge",
  "difficulty": "Easy" | "Medium" | "Hard",
  "companyContext": "Context about the company/business problem",
  "descriptionMarkdown": "Detailed instructions, requirements and context in markdown format",
  "constraints": [
    "Constraint 1 (e.g. Time Limit: 45m)",
    "Constraint 2"
  ],
  "boilerplate": "Boilerplate code or starter layout text for the response",
  "testCases": [
    {
      "id": "tc-1",
      "inputDescription": "Description of input / scenario 1",
      "expectedOutput": "Expected output / behavior 1",
      "hint": "Hint for case 1"
    },
    {
      "id": "tc-2",
      "inputDescription": "Description of input / scenario 2",
      "expectedOutput": "Expected output / behavior 2",
      "hint": "Hint for case 2"
    },
    {
      "id": "tc-3",
      "inputDescription": "Description of input / scenario 3",
      "expectedOutput": "Expected output / behavior 3",
      "hint": "Hint for case 3"
    }
  ]
}`;

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
              { role: "system", content: "You are a senior technical interviewer returning raw JSON challenges." },
              { role: "user", content: prompt },
            ],
            options: { temperature: 0.7 },
            stream: false,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const text = data.message?.content ?? "";
          const cleanJsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(cleanJsonStr);
          return NextResponse.json({ success: true, challenge: parsed });
        }
      } catch (ollamaErr) {
        console.warn("Local Ollama fetch failed in interview-prep:", ollamaErr);
      }
    }

    if (!apiKey) {
      // Deterministic Offline Fallback
      return NextResponse.json(generateLocalFallbackChallenge(role, track, company));
    }

    const openRouterModel = FREE_MODELS.includes(model) ? model : "local-ollama/llama3.2:3b";

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://workorajobs.com",
        "X-Title": "Workora Jobs AI",
      },
      body: JSON.stringify({
        model: openRouterModel,
        messages: [
          { role: "system", content: "You are a senior technical interviewer returning raw JSON challenges." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(generateLocalFallbackChallenge(role, track, company));
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";

    try {
      // Clean up potential markdown formatting block wrapper from LLM
      const cleanJsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanJsonStr);
      return NextResponse.json({ success: true, challenge: parsed });
    } catch {
      return NextResponse.json(generateLocalFallbackChallenge(role, track, company));
    }
  } catch {
    return NextResponse.json({
      success: false,
      error: "Failed to generate challenge",
    });
  }
}

function generateLocalFallbackChallenge(role: string, track: string, company: string) {
  const isCoding = track === "Coding Track";
  const isSystemDesign = track === "System Design Track";

  let title = `Validate Sourcing Workflows at ${company}`;
  let difficulty = "Medium";
  const companyContext = `${company} is experiencing high-volume traffic, requiring optimized logic and reliable compliance auditing.`;
  let descriptionMarkdown = `Implement a solution for ${role} under the ${track} pathway. Ensure code/written design accounts for latency bounds and structural validation.`;
  const constraints = ["Response length: 500 characters min", "Time Limit: 30 minutes"];
  let boilerplate = isCoding
    ? `function validateWorkflow(input) {\n  // Write your code here\n  return true;\n}`
    : `### Situation:\n\n### Task:\n\n### Action:\n\n### Result:`;
  const testCases = [
    {
      id: "tc-1",
      inputDescription: "Valid payloads under normal loads",
      expectedOutput: "Returns true / successful validation status",
      hint: "Verify fields exist before access.",
    },
    {
      id: "tc-2",
      inputDescription: "Empty or corrupted inputs",
      expectedOutput: "Returns false / structured validation error",
      hint: "Sanitize strings and trim trailing spaces.",
    },
  ];

  if (isCoding) {
    title = `Optimized Transaction Rate Limiter for ${company}`;
    difficulty = "Hard";
    descriptionMarkdown = `Build a sliding-window rate limiter for ${company}'s API gateway.
- Window Size: 60 seconds
- Max requests per client: 100
- Return \`true\` if allowed, else \`false\`.`;
    boilerplate = `class RateLimiter {\n  constructor() {\n    this.windows = new Map();\n  }\n\n  isAllowed(clientId, timestamp) {\n    // Implement sliding window logic here\n    return true;\n  }\n}`;
  } else if (isSystemDesign) {
    title = `Scalable Global Notification Broker for ${company}`;
    descriptionMarkdown = `Design a fault-tolerant system to process and dispatch 100M daily notifications.
Include:
1. DB schema choice (NoSQL vs SQL)
2. Queue brokers (Kafka/RabbitMQ) for backpressure
3. Circuit breaker topologies to handle downstream timeouts`;
  }

  return {
    success: true,
    challenge: {
      title,
      difficulty,
      companyContext,
      descriptionMarkdown,
      constraints,
      boilerplate,
      testCases,
    },
  };
}
