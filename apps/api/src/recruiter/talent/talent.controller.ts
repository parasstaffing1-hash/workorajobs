import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags, ApiOperation } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";

import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { AuthenticatedUser } from "../../auth/types/authenticated-user.type";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { CandidateSearchDto } from "../dto/candidate-search.dto";

import { SearchIndexService } from "./search-index.service";
import { CandidateMatchingService } from "./candidate-matching.service";
import { TalentPoolService } from "./talent-pool.service";
import { CandidateListsService } from "./candidate-lists.service";
import { TalentStore } from "./talent-store";

@ApiTags("Recruiter Enterprise")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.RECRUITER, UserRole.EMPLOYER, UserRole.ADMIN)
@Controller("recruiter/enterprise")
export class TalentController {
  constructor(
    private readonly searchIndex: SearchIndexService,
    private readonly matching: CandidateMatchingService,
    private readonly pools: TalentPoolService,
    private readonly lists: CandidateListsService,
  ) {}

  // 1. Candidate Search & Advanced Filters
  @ApiOperation({ summary: "Enterprise candidate search with advanced filtering, ranking, and score sorting" })
  @Get("search")
  async searchCandidates(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: CandidateSearchDto & {
      name?: string;
      company?: string;
      industry?: string;
      experienceMin?: number;
      experienceMax?: number;
      noticePeriod?: string;
      workAuthorization?: string;
      languages?: string[];
      recruiterTags?: string[];
      candidateStatus?: string;
      candidateRatingMin?: number;
      applicationStatus?: string;
      university?: string;
      degree?: string;
      currentCompany?: string;
      previousCompany?: string;
      jobFunction?: string;
    },
  ) {
    return this.searchIndex.search({
      ...query,
      recruiterId: user.sub,
    });
  }

  // 2. Saved Searches Management (Integrated alongside DB models)
  @ApiOperation({ summary: "List recent searches and favorite saved queries" })
  @Get("saved-searches/analytics")
  async getRecentSearches(@CurrentUser() user: AuthenticatedUser) {
    const all = TalentStore.getSearchAnalytics().filter(s => s.recruiterId === user.sub);
    return {
      history: all.slice(-10).reverse(),
      popular: this.computePopularQueries(all),
    };
  }

  // 3. Talent Pools
  @ApiOperation({ summary: "List manual and dynamic talent pools" })
  @Get("pools")
  async listPools(@CurrentUser() user: AuthenticatedUser) {
    return this.pools.listPools(user.sub);
  }

  @ApiOperation({ summary: "Create a new manual or dynamic talent pool" })
  @Post("pools")
  async createPool(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: {
      name: string;
      isPublic?: boolean;
      isDynamic?: boolean;
      autoRules?: {
        skills?: string[];
        experienceMin?: number;
        preferredLocation?: string;
        keywords?: string[];
      };
      candidateIds?: string[];
      sharedTeamIds?: string[];
    },
  ) {
    return this.pools.createPool(user.sub, body);
  }

  @ApiOperation({ summary: "Update talent pool settings" })
  @Patch("pools/:id")
  async updatePool(
    @Param("id") id: string,
    @Body() body: {
      name?: string;
      isPublic?: boolean;
      autoRules?: {
        skills?: string[];
        experienceMin?: number;
        preferredLocation?: string;
        keywords?: string[];
      };
      candidateIds?: string[];
      sharedTeamIds?: string[];
    },
  ) {
    return this.pools.updatePool(id, body);
  }

  @ApiOperation({ summary: "Delete a talent pool" })
  @Delete("pools/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePool(@Param("id") id: string) {
    this.pools.deletePool(id);
  }

  @ApiOperation({ summary: "Manually assign candidate to a talent pool" })
  @Post("pools/:id/assign")
  async assignCandidate(
    @Param("id") id: string,
    @Body() body: { candidateProfileId: string },
  ) {
    return this.pools.assignCandidate(id, body.candidateProfileId);
  }

  @ApiOperation({ summary: "Manually remove candidate from a talent pool" })
  @Post("pools/:id/remove")
  async removeCandidate(
    @Param("id") id: string,
    @Body() body: { candidateProfileId: string },
  ) {
    return this.pools.removeCandidate(id, body.candidateProfileId);
  }

  // 4. Candidate Lists
  @ApiOperation({ summary: "Fetch recruiter's shortlists, favorites, and blacklists" })
  @Get("lists")
  async getLists(@CurrentUser() user: AuthenticatedUser) {
    return this.lists.getRecruiterLists(user.sub);
  }

  @ApiOperation({ summary: "Toggle candidate profile assignment in favorites, blacklist, archived or saved" })
  @Post("lists/toggle")
  async toggleList(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: {
      listName: "favorites" | "blacklists" | "archived" | "saved";
      candidateProfileId: string;
    },
  ) {
    return this.lists.toggleCandidateInList(user.sub, body.listName, body.candidateProfileId);
  }

  @ApiOperation({ summary: "Assign candidate to job shortlist" })
  @Post("lists/shortlist")
  async shortlistCandidate(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: { jobId: string; candidateProfileId: string },
  ) {
    return this.lists.addCandidateToShortlist(user.sub, body.jobId, body.candidateProfileId);
  }

  @ApiOperation({ summary: "Remove candidate from job shortlist" })
  @Post("lists/remove-shortlist")
  async removeShortlist(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: { jobId: string; candidateProfileId: string },
  ) {
    return this.lists.removeCandidateFromShortlist(user.sub, body.jobId, body.candidateProfileId);
  }

  @ApiOperation({ summary: "Track and log candidate profile view (for recently viewed lists)" })
  @Post("lists/view")
  async recordView(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: { candidateProfileId: string },
  ) {
    return this.lists.recordCandidateView(user.sub, body.candidateProfileId);
  }

  // 5. Match Scores (AI Candidate Matching)
  @ApiOperation({ summary: "Get AI job fit compatibility details for a candidate" })
  @Get("match")
  async getMatchScore(
    @Query("jobId") jobId: string,
    @Query("candidateProfileId") candidateProfileId: string,
  ) {
    let score = TalentStore.getMatchScore(jobId, candidateProfileId);
    if (!score) {
      score = await this.matching.calculateMatchScore(jobId, candidateProfileId);
    }
    return score;
  }

  @ApiOperation({ summary: "Trigger recalculation of AI job fit score" })
  @Post("match/calculate")
  async calculateMatchScore(
    @Body() body: { jobId: string; candidateProfileId: string },
  ) {
    return this.matching.calculateMatchScore(body.jobId, body.candidateProfileId);
  }

  // 6. Recruiter Workspace Workspace Backend Support
  @ApiOperation({ summary: "Fetch recruiter workspace workspace metadata" })
  @Get("workspace")
  async getWorkspaceDetails(@CurrentUser() user: AuthenticatedUser) {
    const lists = await this.lists.getRecruiterLists(user.sub);
    const pools = await this.pools.listPools(user.sub);
    const searches = TalentStore.getSearchAnalytics().filter(s => s.recruiterId === user.sub);

    return {
      recentlyViewedCandidateIds: lists.recentlyViewed,
      savedCandidateIds: lists.saved,
      talentPoolCount: pools.length,
      searchCount: searches.length,
      recentActivity: searches.slice(-5).reverse(),
    };
  }

  // 7. Index Management & Telemetry
  @ApiOperation({ summary: "Get resume indexer health stats" })
  @Get("stats")
  async getStats() {
    return this.searchIndex.getStats();
  }

  @ApiOperation({ summary: "Trigger resume database reindexing" })
  @Post("reindex")
  async triggerMassReindex() {
    const successCount = await this.searchIndex.reindexAll();
    return { success: true, count: successCount };
  }

  @ApiOperation({ summary: "Trigger reindexing for a specific candidate" })
  @Post("reindex/:id")
  async triggerSingleReindex(@Param("id") id: string) {
    const ok = await this.searchIndex.indexCandidate(id);
    return { success: ok };
  }

  // 8. n8n Integrations Support
  @ApiOperation({ summary: "n8n trigger: mass reindex and refresh caches" })
  @Roles(UserRole.ADMIN)
  @Post("n8n/index")
  async n8nIndex() {
    const count = await this.searchIndex.reindexAll();
    await this.pools.updateAllDynamicPools();
    return { status: "success", indexed: count, time: new Date().toISOString() };
  }

  @ApiOperation({ summary: "n8n trigger: retry or refresh search analytics dashboard caches" })
  @Roles(UserRole.ADMIN)
  @Post("n8n/retry")
  async n8nRetry() {
    await this.pools.updateAllDynamicPools();
    return { status: "success", message: "Dynamic pools and search cache updated successfully" };
  }

  @ApiOperation({ summary: "n8n trigger: generate recruiter reports" })
  @Roles(UserRole.ADMIN)
  @Get("n8n/report")
  async n8nReport() {
    const stats = await this.searchIndex.getStats();
    return {
      title: "Recruiter Search Indexing Report",
      generatedAt: new Date().toISOString(),
      stats,
    };
  }

  // Helpers
  private computePopularQueries(searches: any[]): Array<{ query: string; count: number }> {
    const counts: Record<string, number> = {};
    searches.forEach(s => {
      if (s.queryText) {
        counts[s.queryText] = (counts[s.queryText] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }
}
