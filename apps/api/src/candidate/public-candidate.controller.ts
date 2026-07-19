import { Controller, Get, Param, NotFoundException } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { CandidateService } from "./candidate.service";

@ApiTags("Public Candidates")
@Controller("candidate/public")
export class PublicCandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  @Get(":id")
  async getPublicProfile(@Param("id") id: string) {
    const profile = await this.candidateService.getPublicProfile(id);
    if (!profile || !profile.isPublic) {
      throw new NotFoundException("Profile not found or is private.");
    }
    return profile;
  }
}
