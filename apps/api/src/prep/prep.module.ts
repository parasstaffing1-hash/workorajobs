import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrepService } from './prep.service';
import { PrepController } from './prep.controller';
import { PrepContentService } from './prep-content.service';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],
  providers: [PrepService, PrismaService, PrepContentService],
  controllers: [PrepController],
})
export class PrepModule {}
