import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrepService } from './prep.service';
import { PrepController } from './prep.controller';
import { PrepContentService } from './prep-content.service';

@Module({
  providers: [PrepService, PrismaService, PrepContentService],
  controllers: [PrepController],
})
export class PrepModule {}
