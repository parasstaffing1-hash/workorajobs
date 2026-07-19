import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { AuthenticatedUser } from "../auth/types/authenticated-user.type";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { PrismaService } from "../prisma/prisma.service";
import { StorageService, UploadKind } from "./storage.service";

const uploadKinds = new Set<UploadKind>([
  "certificate",
  "company-logo",
  "content-image",
  "document",
  "profile-image",
  "resume",
]);

@ApiTags("Storage")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("storage")
export class StorageController {
  constructor(
    private readonly storage: StorageService,
    private readonly prisma: PrismaService,
  ) {}

  @Get("media")
  @Roles(UserRole.ADMIN, UserRole.RECRUITER, UserRole.EMPLOYER)
  listMedia() {
    return this.prisma.mediaAsset.findMany({
      include: { uploadedBy: { include: { profile: true } }, company: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  }

  @Post(":kind")
  @ApiConsumes("multipart/form-data")
  @Roles(
    UserRole.ADMIN,
    UserRole.RECRUITER,
    UserRole.EMPLOYER,
    UserRole.CANDIDATE,
  )
  @UseInterceptors(FileInterceptor("file"))
  upload(
    @CurrentUser() user: AuthenticatedUser,
    @Param("kind") kind: UploadKind,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!uploadKinds.has(kind)) {
      throw new BadRequestException("Unsupported upload kind.");
    }
    return this.storage.uploadMedia({ file, kind, user });
  }
}
