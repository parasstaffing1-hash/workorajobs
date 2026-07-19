import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { PrepService } from './prep.service';

import { CreatePrepRoleDto } from './dto/create-prep-role.dto';
import { UpdatePrepRoleDto } from './dto/update-prep-role.dto';
import { CreatePrepTopicDto } from './dto/create-prep-topic.dto';
import { UpdatePrepTopicDto } from './dto/update-prep-topic.dto';
import { CreatePrepQuestionDto } from './dto/create-prep-question.dto';
import { UpdatePrepQuestionDto } from './dto/update-prep-question.dto';
import { CreatePrepNoteDto } from './dto/create-prep-note.dto';
import { CreatePrepRoadmapDto } from './dto/create-prep-roadmap.dto';
import { CreatePrepCourseDto } from './dto/create-prep-course.dto';
import { UpdatePrepCourseDto } from './dto/update-prep-course.dto';

@ApiTags('Prep')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('prep')
export class PrepController {
  constructor(private readonly prep: PrepService) {}

  // ---------- PrepRole ----------
  @Post('roles')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  createRole(@Body() dto: CreatePrepRoleDto) {
    return this.prep.createRole(dto as any);
  }

  @Get('roles')
  getRoles(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.prep.getRoles({ skip: Number(skip) || 0, take: Number(take) || 20 });
  }

  @Get('roles/:id')
  getRole(@Param('id') id: string) {
    return this.prep.getRoleById(id);
  }

  @Patch('roles/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  updateRole(@Param('id') id: string, @Body() dto: UpdatePrepRoleDto) {
    return this.prep.updateRole(id, dto as any);
  }

  @Delete('roles/:id')
  deleteRole(@Param('id') id: string) {
    return this.prep.deleteRole(id);
  }

  // ---------- PrepTopic ----------
  @Post('topics')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  createTopic(@Body() dto: CreatePrepTopicDto) {
    return this.prep.createTopic(dto as any);
  }

  @Get('topics')
  getTopics(@Query('skip') skip?: string, @Query('take') take?: string, @Query('roleId') roleId?: string) {
    return this.prep.getTopics({
      skip: Number(skip) || 0,
      take: Number(take) || 20,
      roleId,
    });
  }

  @Get('topics/:id')
  getTopic(@Param('id') id: string) {
    return this.prep.getTopicById(id);
  }

  @Patch('topics/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  updateTopic(@Param('id') id: string, @Body() dto: UpdatePrepTopicDto) {
    return this.prep.updateTopic(id, dto as any);
  }

  @Delete('topics/:id')
  deleteTopic(@Param('id') id: string) {
    return this.prep.deleteTopic(id);
  }

  // ---------- PrepQuestion ----------
  @Post('questions')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  createQuestion(@Body() dto: CreatePrepQuestionDto) {
    return this.prep.createQuestion(dto as any);
  }

  @Get('questions')
  getQuestions(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('topicId') topicId?: string,
  ) {
    return this.prep.getQuestions({
      skip: Number(skip) || 0,
      take: Number(take) || 20,
      topicId,
    });
  }

  @Get('questions/:id')
  getQuestion(@Param('id') id: string) {
    return this.prep.getQuestionById(id);
  }

  @Patch('questions/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  updateQuestion(@Param('id') id: string, @Body() dto: UpdatePrepQuestionDto) {
    return this.prep.updateQuestion(id, dto as any);
  }

  @Delete('questions/:id')
  deleteQuestion(@Param('id') id: string) {
    return this.prep.deleteQuestion(id);
  }

  // ---------- PrepNote ----------
  @Post('notes/:topicId')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  upsertNote(@Param('topicId') topicId: string, @Body() dto: CreatePrepNoteDto) {
    return this.prep.upsertNote(topicId, dto.markdown);
  }

  @Get('notes/:topicId')
  getNote(@Param('topicId') topicId: string) {
    return this.prep.getNoteByTopicId(topicId);
  }

  @Delete('notes/:topicId')
  deleteNote(@Param('topicId') topicId: string) {
    return this.prep.deleteNoteByTopicId(topicId);
  }

  // ---------- PrepRoadmap ----------
  @Post('roadmaps/:topicId')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  upsertRoadmap(@Param('topicId') topicId: string, @Body() dto: CreatePrepRoadmapDto) {
    return this.prep.upsertRoadmap(topicId, dto.mermaidSvg);
  }

  @Get('roadmaps/:topicId')
  getRoadmap(@Param('topicId') topicId: string) {
    return this.prep.getRoadmapByTopicId(topicId);
  }

  @Delete('roadmaps/:topicId')
  deleteRoadmap(@Param('topicId') topicId: string) {
    return this.prep.deleteRoadmapByTopicId(topicId);
  }

  // ---------- PrepCourse ----------
  @Post('courses')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  createCourse(@Body() dto: CreatePrepCourseDto) {
    return this.prep.createCourse(dto as any);
  }

  @Get('courses')
  getCourses(@Query('skip') skip?: string, @Query('take') take?: string, @Query('roleId') roleId?: string) {
    return this.prep.getCourses({
      skip: Number(skip) || 0,
      take: Number(take) || 20,
      roleId,
    });
  }

  @Get('courses/:id')
  getCourse(@Param('id') id: string) {
    return this.prep.getCourseById(id);
  }

  @Patch('courses/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  updateCourse(@Param('id') id: string, @Body() dto: UpdatePrepCourseDto) {
    return this.prep.updateCourse(id, dto as any);
  }

  @Delete('courses/:id')
  deleteCourse(@Param('id') id: string) {
    return this.prep.deleteCourse(id);
  }
}
