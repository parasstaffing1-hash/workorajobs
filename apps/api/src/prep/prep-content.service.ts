import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';


/**
 * Service that provides higher‑level AI‑generated content for the preparation workflow.
 * AI integration will be rebuilt — currently returns placeholder stubs.
 */
@Injectable()
export class PrepContentService {
  constructor(private readonly prisma: PrismaService) {}

  /** Generate topics for a given role (stub — AI will be rebuilt). */
  async generateTopics(_roleId: string): Promise<any[]> {
    // TODO: Re-integrate with rebuilt AI module
    return [];
  }

  /** Generate interview questions for a topic (stub — AI will be rebuilt). */
  async generateQuestions(_topicId: string): Promise<any[]> {
    // TODO: Re-integrate with rebuilt AI module
    return [];
  }

  /** Generate a markdown note for a topic (stub — AI will be rebuilt). */
  async generateNote(_topicId: string): Promise<any> {
    // TODO: Re-integrate with rebuilt AI module
    throw new NotFoundException('AI module is being rebuilt — note generation is temporarily unavailable.');
  }

  /** Generate a roadmap for a topic (stub — AI will be rebuilt). */
  async generateRoadmap(_topicId: string): Promise<any> {
    // TODO: Re-integrate with rebuilt AI module
    throw new NotFoundException('AI module is being rebuilt — roadmap generation is temporarily unavailable.');
  }
}
