import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { AuditModule } from "../../audit/audit.module";
import { QueueModule } from "../../common/queue/queue.module";

import { SearchIndexService } from "./search-index.service";
import { CandidateMatchingService } from "./candidate-matching.service";
import { TalentPoolService } from "./talent-pool.service";
import { CandidateListsService } from "./candidate-lists.service";
import { TalentController } from "./talent.controller";

@Module({
  imports: [PrismaModule, AuditModule, QueueModule],
  controllers: [TalentController],
  providers: [
    SearchIndexService,
    CandidateMatchingService,
    TalentPoolService,
    CandidateListsService,
  ],
  exports: [
    SearchIndexService,
    CandidateMatchingService,
    TalentPoolService,
    CandidateListsService,
  ],
})
export class TalentModule {}
export { SearchIndexService, CandidateMatchingService, TalentPoolService, CandidateListsService };
