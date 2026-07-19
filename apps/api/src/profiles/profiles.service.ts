import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { UpsertProfileDto } from "./dto/upsert-profile.dto";

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: {
        userId,
      },
    });
    if (!profile) throw new NotFoundException("Profile not found.");
    return profile;
  }

  upsert(userId: string, dto: UpsertProfileDto) {
    return this.prisma.profile.upsert({
      create: {
        userId,
        ...dto,
      },
      update: dto,
      where: {
        userId,
      },
    });
  }
}
