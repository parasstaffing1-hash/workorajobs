import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';


/**
 * Service providing full CRUD operations for the preparation (prep) domain.
 */
@Injectable()
export class PrepService {
  constructor(private readonly prisma: PrismaService) {}

  // ===================== PrepRole =====================
  async createRole(data: any): Promise<any> {
    try {
      return await (this.prisma as any).prepRole.create({ data });
    } catch (error) {
      throw new BadRequestException('Failed to create PrepRole');
    }
  }

  async getRoles(params: { skip?: number; take?: number }): Promise<any[]> {
    const { skip = 0, take = 20 } = params;
    return (this.prisma as any).prepRole.findMany({ skip, take, orderBy: { createdAt: 'desc' } });
  }

  async getRoleById(id: string): Promise<any> {
    const role = await (this.prisma as any).prepRole.findUnique({ where: { id } });
    if (!role) throw new NotFoundException(`PrepRole with id ${id} not found`);
    return role;
  }

  async updateRole(id: string, data: any): Promise<any> {
    try {
      return await (this.prisma as any).prepRole.update({ where: { id }, data });
    } catch (error) {
      throw new NotFoundException(`PrepRole with id ${id} not found`);
    }
  }

  async deleteRole(id: string): Promise<any> {
    try {
      return await (this.prisma as any).prepRole.delete({ where: { id } });
    } catch (error) {
      throw new NotFoundException(`PrepRole with id ${id} not found`);
    }
  }

  // ===================== PrepTopic =====================
  async createTopic(data: any): Promise<any> {
    try {
      return await (this.prisma as any).prepTopic.create({ data });
    } catch (error) {
      throw new BadRequestException('Failed to create PrepTopic');
    }
  }

  async getTopics(params: { skip?: number; take?: number; roleId?: string }): Promise<any[]> {
    const { skip = 0, take = 20, roleId } = params;
    return (this.prisma as any).prepTopic.findMany({
      where: roleId ? { roleId } : undefined,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTopicById(id: string): Promise<any> {
    const topic = await (this.prisma as any).prepTopic.findUnique({ where: { id } });
    if (!topic) throw new NotFoundException(`PrepTopic with id ${id} not found`);
    return topic;
  }

  async updateTopic(id: string, data: any): Promise<any> {
    try {
      return await (this.prisma as any).prepTopic.update({ where: { id }, data });
    } catch (error) {
      throw new NotFoundException(`PrepTopic with id ${id} not found`);
    }
  }

  async deleteTopic(id: string): Promise<any> {
    try {
      return await (this.prisma as any).prepTopic.delete({ where: { id } });
    } catch (error) {
      throw new NotFoundException(`PrepTopic with id ${id} not found`);
    }
  }

  // ===================== PrepQuestion =====================
  async createQuestion(data: any): Promise<any> {
    try {
      return await (this.prisma as any).prepQuestion.create({ data });
    } catch (error) {
      throw new BadRequestException('Failed to create PrepQuestion');
    }
  }

  async getQuestions(params: { skip?: number; take?: number; topicId?: string }): Promise<any[]> {
    const { skip = 0, take = 20, topicId } = params;
    return (this.prisma as any).prepQuestion.findMany({
      where: topicId ? { topicId } : undefined,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getQuestionById(id: string): Promise<any> {
    const q = await (this.prisma as any).prepQuestion.findUnique({ where: { id } });
    if (!q) throw new NotFoundException(`PrepQuestion with id ${id} not found`);
    return q;
  }

  async updateQuestion(id: string, data: any): Promise<any> {
    try {
      return await (this.prisma as any).prepQuestion.update({ where: { id }, data });
    } catch (error) {
      throw new NotFoundException(`PrepQuestion with id ${id} not found`);
    }
  }

  async deleteQuestion(id: string): Promise<any> {
    try {
      return await (this.prisma as any).prepQuestion.delete({ where: { id } });
    } catch (error) {
      throw new NotFoundException(`PrepQuestion with id ${id} not found`);
    }
  }

  // ===================== PrepNote =====================
  async upsertNote(topicId: string, markdown: string): Promise<any> {
    return await (this.prisma as any).prepNote.upsert({
      where: { topicId },
      create: { topicId, markdown },
      update: { markdown },
    });
  }

  async getNoteByTopicId(topicId: string): Promise<any> {
    const note = await (this.prisma as any).prepNote.findUnique({ where: { topicId } });
    if (!note) throw new NotFoundException(`PrepNote for topic ${topicId} not found`);
    return note;
  }

  async deleteNoteByTopicId(topicId: string): Promise<any> {
    return await (this.prisma as any).prepNote.delete({ where: { topicId } });
  }

  // ===================== PrepRoadmap =====================
  async upsertRoadmap(topicId: string, mermaidSvg: string): Promise<any> {
    return await (this.prisma as any).prepRoadmap.upsert({
      where: { topicId },
      create: { topicId, mermaidSvg },
      update: { mermaidSvg },
    });
  }

  async getRoadmapByTopicId(topicId: string): Promise<any> {
    const roadmap = await (this.prisma as any).prepRoadmap.findUnique({ where: { topicId } });
    if (!roadmap) throw new NotFoundException(`PrepRoadmap for topic ${topicId} not found`);
    return roadmap;
  }

  async deleteRoadmapByTopicId(topicId: string): Promise<any> {
    return await (this.prisma as any).prepRoadmap.delete({ where: { topicId } });
  }

  // ===================== PrepCourse =====================
  async createCourse(data: any): Promise<any> {
    try {
      return await (this.prisma as any).prepCourse.create({ data });
    } catch (error) {
      throw new BadRequestException('Failed to create PrepCourse');
    }
  }

  async getCourses(params: { skip?: number; take?: number; roleId?: string }): Promise<any[]> {
    const { skip = 0, take = 20, roleId } = params;
    return (this.prisma as any).prepCourse.findMany({
      where: roleId ? { roleId } : undefined,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCourseById(id: string): Promise<any> {
    const course = await (this.prisma as any).prepCourse.findUnique({ where: { id } });
    if (!course) throw new NotFoundException(`PrepCourse with id ${id} not found`);
    return course;
  }

  async updateCourse(id: string, data: any): Promise<any> {
    try {
      return await (this.prisma as any).prepCourse.update({ where: { id }, data });
    } catch (error) {
      throw new NotFoundException(`PrepCourse with id ${id} not found`);
    }
  }

  async deleteCourse(id: string): Promise<any> {
    try {
      return await (this.prisma as any).prepCourse.delete({ where: { id } });
    } catch (error) {
      throw new NotFoundException(`PrepCourse with id ${id} not found`);
    }
  }
}
