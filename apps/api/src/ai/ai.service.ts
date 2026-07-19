import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AiArtifactType, Prisma } from "@prisma/client";

import { AuthenticatedUser } from "../auth/types/authenticated-user.type";
import { PrismaService } from "../prisma/prisma.service";
import { AiRequestDto } from "./dto/ai-request.dto";



@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  resumeAnalysis(user: AuthenticatedUser, dto: AiRequestDto) {
    return this.createArtifact(user, AiArtifactType.RESUME_ANALYSIS, dto);
  }

  resumeScore(user: AuthenticatedUser, dto: AiRequestDto) {
    return this.createArtifact(user, AiArtifactType.RESUME_SCORE, dto);
  }

  candidateMatch(user: AuthenticatedUser, dto: AiRequestDto) {
    return this.createArtifact(user, AiArtifactType.CANDIDATE_MATCH, dto);
  }

  skillGap(user: AuthenticatedUser, dto: AiRequestDto) {
    return this.createArtifact(user, AiArtifactType.SKILL_GAP, dto);
  }

  jobDescription(user: AuthenticatedUser, dto: AiRequestDto) {
    return this.createArtifact(user, AiArtifactType.JOB_DESCRIPTION, dto);
  }

  interviewQuestions(user: AuthenticatedUser, dto: AiRequestDto) {
    return this.createArtifact(user, AiArtifactType.INTERVIEW_QUESTIONS, dto);
  }

  candidateSummary(user: AuthenticatedUser, dto: AiRequestDto) {
    return this.createArtifact(user, AiArtifactType.CANDIDATE_SUMMARY, dto);
  }

  hiringAssistant(user: AuthenticatedUser, dto: AiRequestDto) {
    return this.createArtifact(user, AiArtifactType.HIRING_ASSISTANT, dto);
  }

  private async createArtifact(
    user: AuthenticatedUser,
    type: AiArtifactType,
    dto: AiRequestDto,
  ) {
    const prompt = this.promptFor(type, dto);
    const openAi = await this.tryOpenAi(prompt, dto.model);
    const fallback = this.fallbackResult(type, dto);
    const result = openAi
      ? {
          provider: "openai",
          model: openAi.model,
          summary: openAi.text,
        }
      : fallback.result;

    return this.prisma.aiArtifact.create({
      data: {
        type,
        userId: user.sub,
        candidateProfileId: dto.candidateProfileId,
        jobId: dto.jobId,
        applicationId: dto.applicationId,
        prompt,
        result: result as Prisma.InputJsonValue,
        score: openAi ? fallback.score : fallback.score,
        model: openAi?.model ?? fallback.model,
        provider: openAi?.provider ?? fallback.provider,
      },
    });
  }

  private async tryOpenAi(prompt: string, modelOverride?: string) {
    const openRouterKey =
      this.config.get<string>("ai.openrouterApiKey") ?? process.env.OPENROUTER_API_KEY;
    const apiKey = openRouterKey || this.config.get<string>("ai.openaiApiKey");
    // Allow proceeding without API key for local Ollama models
    if (!apiKey && !(modelOverride && modelOverride.startsWith("local-ollama/"))) {
      return null;
    }

    const isOpenRouter = Boolean(openRouterKey);
    const baseUrl = isOpenRouter
      ? "https://openrouter.ai/api/v1"
      : this.config.get<string>("ai.openaiBaseUrl") ?? "https://api.openai.com/v1";
    let model = isOpenRouter
        ? process.env.OPENROUTER_DEFAULT_MODEL || "meta-llama/llama-3.3-70b-instruct:free"
        : this.config.get<string>("ai.openaiModel") ?? "gpt-4o-mini";
      // Override model if provided (e.g., local-ollama)
      if (modelOverride) {
        model = modelOverride;
      }

    try {
      let requestUrl = `${baseUrl}/chat/completions`;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      // If using OpenRouter or OpenAI, include auth header
      if (apiKey) {
        headers["Authorization"] = `Bearer ${apiKey}`;
        if (isOpenRouter) {
          headers["HTTP-Referer"] = "https://workorajobs.com";
          headers["X-Title"] = "Workora Jobs";
        }
      }
      // If model is a local Ollama model, adjust base URL and omit auth
      if (modelOverride && modelOverride.startsWith("local-ollama/")) {
        const localModel = modelOverride.replace(/^local-ollama\//, "");
        model = localModel;
        requestUrl = "http://localhost:11434/v1/chat/completions";
      }
      const response = await fetch(requestUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "system",
              content:
                "You are Workora's hiring copilot. Return concise, structured hiring guidance. Do not make legal, demographic, or protected-class inferences.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.2,
        }),
      });

      if (!response.ok) {
        this.logger.warn(`AI request failed with status ${response.status}.`);
        return null;
      }

      const data = await response.json();
      const text =
        data.choices?.[0]?.message?.content ??
        data.output_text ??
        data.output
          ?.flatMap((item: any) => item.content ?? [])
          .map((content: any) => content.text)
          .filter(Boolean)
          .join("\n");

      if (!text) return null;
      return { text, provider: isOpenRouter ? "openrouter" : "openai", model };
    } catch (error) {
      this.logger.warn(
        `AI request skipped: ${error instanceof Error ? error.message : "unknown error"}`,
      );
      return null;
    }
  }

  private promptFor(type: AiArtifactType, dto: AiRequestDto) {
    const task = {
      RESUME_ANALYSIS:
        "Analyze the resume for role fit, strengths, risks and recruiter follow-up questions.",
      RESUME_SCORE:
        "Score the resume against the job description and explain the scoring factors.",
      CANDIDATE_MATCH:
        "Evaluate candidate-to-job match, strengths, risks and recommended next action.",
      SKILL_GAP:
        "Identify missing or under-evidenced skills relative to the target role.",
      JOB_DESCRIPTION:
        "Generate a clear, inclusive, enterprise-ready job description.",
      INTERVIEW_QUESTIONS:
        "Generate structured interview questions and evaluation signals.",
      CANDIDATE_SUMMARY:
        "Summarize the candidate profile for recruiter and hiring manager review.",
      HIRING_ASSISTANT:
        "Answer the hiring workflow question with practical, policy-aware guidance.",
    } satisfies Record<AiArtifactType, string>;

    return [
      `Task: ${task[type]}`,
      dto.prompt ? `Prompt: ${dto.prompt}` : undefined,
      dto.resumeText ? `Resume: ${dto.resumeText}` : undefined,
      dto.jobDescription ? `Job description: ${dto.jobDescription}` : undefined,
      dto.context ? `Context: ${JSON.stringify(dto.context)}` : undefined,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  private fallbackResult(type: AiArtifactType, dto: AiRequestDto) {
    const resumeTerms = new Set(
      this.keywords(dto.resumeText ?? dto.prompt ?? ""),
    );
    const jobTerms = new Set(
      this.keywords(dto.jobDescription ?? dto.prompt ?? ""),
    );
    const overlap = [...resumeTerms].filter((term) => jobTerms.has(term));
    const score = jobTerms.size
      ? Math.round((overlap.length / jobTerms.size) * 100)
      : Math.min(85, Math.max(55, resumeTerms.size * 4));
    const topTerms = [...new Set([...overlap, ...resumeTerms])].slice(0, 10);

    const result: Record<string, unknown> = {
      mode: "fallback",
      type,
      score,
      summary:
        "OpenAI credentials are unavailable, so Workora returned a deterministic analysis from its built-in scoring engine.",
      signals: topTerms,
      recommendations: [
        "Review evidence for the highest-priority skills.",
        "Confirm compensation, availability and location fit.",
        "Use a structured interview rubric before advancing stages.",
      ],
    };

    if (type === AiArtifactType.JOB_DESCRIPTION) {
      result.sections = [
        "Role mission",
        "Responsibilities",
        "Requirements",
        "Benefits",
        "Interview process",
      ];
    }

    if (type === AiArtifactType.INTERVIEW_QUESTIONS) {
      result.questions = [
        "Walk through a complex project and the tradeoffs you owned.",
        "How do you prioritize when stakeholder needs conflict?",
        "Which metrics would you use to judge success in this role?",
      ];
    }

    return {
      result: result as Prisma.InputJsonValue,
      score,
      provider: "heuristic",
      model: "local-fallback",
    };
  }

  private keywords(text: string) {
    return (
      text
        .toLowerCase()
        .match(/[a-z][a-z0-9+#.-]{2,}/g)
        ?.filter((term) => !this.stopWords.has(term)) ?? []
    );
  }

  private readonly stopWords = new Set([
    "and",
    "for",
    "the",
    "with",
    "from",
    "this",
    "that",
    "your",
    "you",
    "are",
    "was",
    "were",
    "job",
    "role",
  ]);
}
