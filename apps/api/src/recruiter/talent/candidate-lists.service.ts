import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { TalentStore, CandidateLists } from "./talent-store";

@Injectable()
export class CandidateListsService {
  constructor(private readonly prisma: PrismaService) {}

  // Get full lists for a recruiter
  async getRecruiterLists(recruiterId: string): Promise<CandidateLists> {
    return TalentStore.getLists(recruiterId);
  }

  // Toggle list assignment
  async toggleCandidateInList(
    recruiterId: string,
    listName: "favorites" | "blacklists" | "archived" | "saved",
    candidateProfileId: string,
  ): Promise<CandidateLists> {
    const lists = TalentStore.getLists(recruiterId);
    
    const index = lists[listName].indexOf(candidateProfileId);
    if (index >= 0) {
      lists[listName].splice(index, 1);
    } else {
      lists[listName].push(candidateProfileId);
    }

    TalentStore.saveLists(lists);
    return lists;
  }

  // Add to shortlist
  async addCandidateToShortlist(
    recruiterId: string,
    jobId: string,
    candidateProfileId: string,
  ): Promise<CandidateLists> {
    const lists = TalentStore.getLists(recruiterId);
    if (!lists.shortlists[jobId]) {
      lists.shortlists[jobId] = [];
    }

    if (!lists.shortlists[jobId].includes(candidateProfileId)) {
      lists.shortlists[jobId].push(candidateProfileId);
      TalentStore.saveLists(lists);
    }

    return lists;
  }

  // Remove from shortlist
  async removeCandidateFromShortlist(
    recruiterId: string,
    jobId: string,
    candidateProfileId: string,
  ): Promise<CandidateLists> {
    const lists = TalentStore.getLists(recruiterId);
    if (lists.shortlists[jobId]) {
      lists.shortlists[jobId] = lists.shortlists[jobId].filter(id => id !== candidateProfileId);
      TalentStore.saveLists(lists);
    }
    return lists;
  }

  // Record a view event (for Recently Viewed candidates)
  async recordCandidateView(recruiterId: string, candidateProfileId: string): Promise<CandidateLists> {
    const lists = TalentStore.getLists(recruiterId);
    
    // Remove if exists to insert at front
    lists.recentlyViewed = lists.recentlyViewed.filter(id => id !== candidateProfileId);
    lists.recentlyViewed.unshift(candidateProfileId);

    // Keep top 10 recently viewed
    if (lists.recentlyViewed.length > 10) {
      lists.recentlyViewed = lists.recentlyViewed.slice(0, 10);
    }

    TalentStore.saveLists(lists);

    // Also track view in search analytics
    TalentStore.logView({
      id: `view_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      candidateProfileId,
      recruiterId,
      timestamp: new Date().toISOString(),
    });

    return lists;
  }
}
