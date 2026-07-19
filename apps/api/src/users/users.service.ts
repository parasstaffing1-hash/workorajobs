import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      select: this.defaultSelect(),
      where: {
        id,
      },
    });

    if (!user) throw new NotFoundException("User not found.");
    return user;
  }

  list() {
    return this.prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: this.defaultSelect(),
    });
  }

  updateSelf(id: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      data: {
        email: dto.email?.toLowerCase(),
      },
      select: this.defaultSelect(),
      where: {
        id,
      },
    });
  }

  private defaultSelect() {
    return {
      id: true,
      email: true,
      role: true,
      status: true,
      emailVerifiedAt: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
      profile: true,
    } satisfies Record<string, boolean | object>;
  }
}
