import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';


/**
 * Service that provides higher‑level AI‑generated content for the preparation workflow.
 */
@Injectable()
export class PrepContentService {
  constructor(private readonly prisma: PrismaService, private readonly aiService: AiService) {}

  /** Generate topics for a given role using AI and persist them. */
  async generateTopics(roleId: string): Promise<any[]> {
    const prompt = `Generate a list of preparation topics for role ID ${roleId}.`;
    const artifact = await (this.aiService as any).createArtifact({ sub: '' } as any, 'RESUME_ANALYSIS', { prompt, model: undefined } as any);
    const topicsText: string = (artifact?.result as any)?.summary ?? '';
    const names = topicsText.split(/\n/).map(t => t.trim()).filter(Boolean);
    const created: any[] = [];
    for (const name of names) {
      const topic = await (this.prisma as any).prepTopic.create({ data: { name, roleId } });
      created.push(topic);
    }
    return created;
  }

  /** Generate interview questions for a topic and persist them. */
  async generateQuestions(topicId: string): Promise<any[]> {
    const prompt = `Generate three interview questions for preparation topic ID ${topicId}.`;
    const artifact = await (this.aiService as any).createArtifact({ sub: '' } as any, 'RESUME_ANALYSIS', { prompt, model: undefined } as any);
    const questionsText: string = (artifact?.result as any)?.summary ?? '';
    const questions = questionsText.split(/\n/).map(q => q.trim()).filter(Boolean);
    const created: any[] = [];
    for (const q of questions) {
      const question = await (this.prisma as any).prepQuestion.create({ data: { content: q, topicId, difficulty: 'MEDIUM' as any } });
      created.push(question);
    }
    return created;
  }

  /** Generate a markdown note for a topic and upsert it. */
  async generateNote(topicId: string): Promise<any> {
    const prompt = `Write a concise markdown note summarising key points for preparation topic ID ${topicId}.`;
    const artifact = await (this.aiService as any).createArtifact({ sub: '' } as any, 'RESUME_ANALYSIS', { prompt, model: undefined } as any);
    const markdown: string = (artifact?.result as any)?.summary ?? '';
    if (!markdown) {
      throw new NotFoundException('AI did not return note content');
    }
    return (this.prisma as any).prepNote.upsert({ where: { topicId }, create: { topicId, markdown }, update: { markdown } });
  }

  /** Generate a roadmap (mermaid SVG) for a topic and upsert it. */
  async generateRoadmap(topicId: string): Promise<any> {
    const prompt = `Create a mermaid diagram (as SVG) representing a learning roadmap for preparation topic ID ${topicId}.`;
    const artifact = await (this.aiService as any).createArtifact({ sub: '' } as any, 'RESUME_ANALYSIS', { prompt, model: undefined } as any);
    const mermaidSvg: string = (artifact?.result as any)?.summary ?? '';
    if (!mermaidSvg) {
      throw new NotFoundException('AI did not return roadmap content');
    }
    return (this.prisma as any).prepRoadmap.upsert({ where: { topicId }, create: { topicId, mermaidSvg }, update: { mermaidSvg } });
  }
}
