import * as fs from "fs";
import * as path from "path";

export interface TalentPool {
  id: string;
  name: string;
  isPublic: boolean;
  isDynamic: boolean;
  autoRules?: {
    skills?: string[];
    experienceMin?: number;
    preferredLocation?: string;
    keywords?: string[];
  };
  candidateIds: string[];
  ownerId: string;
  sharedTeamIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CandidateLists {
  recruiterId: string;
  favorites: string[];
  shortlists: Record<string, string[]>; // jobId -> candidateProfileIds[]
  blacklists: string[];
  archived: string[];
  recentlyViewed: string[];
  saved: string[];
}

export interface AiMatchScore {
  jobId: string;
  candidateProfileId: string;
  jobToCandidateScore: number;
  candidateToJobScore: number;
  skillGap: string[];
  experienceMatch: boolean;
  locationMatch: boolean;
  salaryCompatibility: boolean;
  explainableReasons: string[];
  updatedAt: string;
}

export interface SearchAnalyticsEvent {
  id: string;
  recruiterId: string;
  queryText?: string;
  filters?: Record<string, any>;
  timestamp: string;
  latencyMs: number;
  resultsCount: number;
}

export interface CandidateViewEvent {
  id: string;
  candidateProfileId: string;
  recruiterId: string;
  timestamp: string;
}

export class TalentStore {
  private static filePath = path.join(__dirname, "../../../../../var/talent-data.json");
  private static data: {
    pools: Record<string, TalentPool>;
    lists: Record<string, CandidateLists>;
    matchScores: Record<string, AiMatchScore>; // key: `${jobId}_${candidateProfileId}`
    searchAnalytics: SearchAnalyticsEvent[];
    candidateViews: CandidateViewEvent[];
  } = { pools: {}, lists: {}, matchScores: {}, searchAnalytics: [], candidateViews: [] };

  private static isLoaded = false;

  private static ensureLoaded() {
    if (this.isLoaded) return;
    try {
      if (fs.existsSync(this.filePath)) {
        const fileContent = fs.readFileSync(this.filePath, "utf-8");
        this.data = JSON.parse(fileContent);
      } else {
        const dir = path.dirname(this.filePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        this.data = { pools: {}, lists: {}, matchScores: {}, searchAnalytics: [], candidateViews: [] };
        this.save();
      }
    } catch (e) {
      console.error("Failed to load talent data store, using fallback", e);
      this.data = { pools: {}, lists: {}, matchScores: {}, searchAnalytics: [], candidateViews: [] };
    }
    this.isLoaded = true;
  }

  private static save() {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (e) {
      console.error("Failed to save talent data store", e);
    }
  }

  // Pools
  static getPool(id: string): TalentPool | undefined {
    this.ensureLoaded();
    return this.data.pools[id];
  }

  static savePool(pool: TalentPool) {
    this.ensureLoaded();
    this.data.pools[pool.id] = pool;
    this.save();
    return pool;
  }

  static deletePool(id: string) {
    this.ensureLoaded();
    delete this.data.pools[id];
    this.save();
  }

  static listPools(): TalentPool[] {
    this.ensureLoaded();
    return Object.values(this.data.pools);
  }

  // Lists
  static getLists(recruiterId: string): CandidateLists {
    this.ensureLoaded();
    if (!this.data.lists[recruiterId]) {
      this.data.lists[recruiterId] = {
        recruiterId,
        favorites: [],
        shortlists: {},
        blacklists: [],
        archived: [],
        recentlyViewed: [],
        saved: [],
      };
    }
    return this.data.lists[recruiterId];
  }

  static saveLists(lists: CandidateLists) {
    this.ensureLoaded();
    this.data.lists[lists.recruiterId] = lists;
    this.save();
    return lists;
  }

  // Match Scores
  static getMatchScore(jobId: string, candidateProfileId: string): AiMatchScore | undefined {
    this.ensureLoaded();
    return this.data.matchScores[`${jobId}_${candidateProfileId}`];
  }

  static saveMatchScore(score: AiMatchScore) {
    this.ensureLoaded();
    this.data.matchScores[`${score.jobId}_${score.candidateProfileId}`] = score;
    this.save();
    return score;
  }

  static listMatchScores(): AiMatchScore[] {
    this.ensureLoaded();
    return Object.values(this.data.matchScores);
  }

  // Search Analytics
  static logSearch(event: SearchAnalyticsEvent) {
    this.ensureLoaded();
    this.data.searchAnalytics.push(event);
    this.save();
  }

  static getSearchAnalytics(): SearchAnalyticsEvent[] {
    this.ensureLoaded();
    return this.data.searchAnalytics;
  }

  // Views
  static logView(event: CandidateViewEvent) {
    this.ensureLoaded();
    this.data.candidateViews.push(event);
    this.save();
  }

  static getViews(): CandidateViewEvent[] {
    this.ensureLoaded();
    return this.data.candidateViews;
  }

  // Reset (for tests / index management)
  static resetAll() {
    this.data = { pools: {}, lists: {}, matchScores: {}, searchAnalytics: [], candidateViews: [] };
    this.save();
  }
}
