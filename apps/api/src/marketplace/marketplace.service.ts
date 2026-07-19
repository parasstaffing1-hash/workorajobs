import { Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { QueueService } from "../common/queue/queue.service";
import { InstallAppDto, PublishAppDto, SubmitReviewDto } from "./dto/marketplace.dto";

@Injectable()
export class MarketplaceService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queue: QueueService,
  ) {}

  onModuleInit() {
    this.queue.registerWorker("app-provisioning", async (data: { installationId: string }) => {
      console.log(`[Queue] Provisioning access tokens & permissions for marketplace app installation: ${data.installationId}`);
    });
  }

  async publishApp(dto: PublishAppDto) {
    return this.prisma.marketplaceApp.create({
      data: {
        name: dto.name,
        description: dto.description,
        version: dto.version,
        category: dto.category,
        priceModel: dto.priceModel ?? "FREE",
      },
    });
  }

  async listApps() {
    return this.prisma.marketplaceApp.findMany({
      include: { reviews: true },
    });
  }

  async installApp(dto: InstallAppDto) {
    const app = await this.prisma.marketplaceApp.findUnique({
      where: { id: dto.appId },
    });
    if (!app) {
      throw new NotFoundException("Marketplace application not found.");
    }

    const company = await this.prisma.company.findUnique({
      where: { id: dto.companyId },
    });
    if (!company) {
      throw new NotFoundException("Tenant company not found.");
    }

    const installation = await this.prisma.appInstallation.create({
      data: {
        appId: dto.appId,
        companyId: dto.companyId,
        status: "ACTIVE",
      },
    });

    await this.queue.add("app-provisioning", { installationId: installation.id });

    return installation;
  }

  async submitReview(appId: string, dto: SubmitReviewDto) {
    const app = await this.prisma.marketplaceApp.findUnique({
      where: { id: appId },
    });
    if (!app) {
      throw new NotFoundException("Marketplace application not found.");
    }

    return this.prisma.appReview.create({
      data: {
        appId,
        rating: dto.rating,
        comment: dto.comment,
      },
    });
  }
}
