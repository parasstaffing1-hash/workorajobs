import { Test, TestingModule } from "@nestjs/testing";
import { UserRole, EmploymentType, ExperienceLevel, RemotePolicy, JobStatus } from "@prisma/client";
import { SearchIndexService } from "./search-index.service";
import { CandidateMatchingService } from "./candidate-matching.service";
import { TalentPoolService } from "./talent-pool.service";
import { CandidateListsService } from "./candidate-lists.service";
import { TalentController } from "./talent.controller";
import { PrismaService } from "../../prisma/prisma.service";
import { QueueService } from "../../common/queue/queue.service";
import { TalentStore } from "./talent-store";
import { ModuleRef } from "@nestjs/core";

describe("Enterprise Talent Platform Services & APIs", () => {
  let searchIndex: SearchIndexService;
  let matching: CandidateMatchingService;
  let pools: TalentPoolService;
  let lists: CandidateListsService;
  let controller: TalentController;

  const mockUser = {
    sub: "recruiter-1",
    email: "enterprise-recruiter@workora.com",
    role: UserRole.RECRUITER,
  };

  const mockPrisma = {
    candidateProfile: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      upsert: jest.fn(),
    },
    resumeIndex: {
      count: jest.fn(),
      upsert: jest.fn(),
    },
    candidateSkill: {
      count: jest.fn(),
    },
    candidateCertification: {
      count: jest.fn(),
    },
    job: {
      findUnique: jest.fn(),
    },
  };

  const mockQueue = {
    add: jest.fn().mockResolvedValue({ id: "job-id" }),
    registerWorker: jest.fn(),
  };

  const mockModuleRef = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TalentController],
      providers: [
        SearchIndexService,
        CandidateMatchingService,
        TalentPoolService,
        CandidateListsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: QueueService, useValue: mockQueue },
        { provide: ModuleRef, useValue: mockModuleRef },
      ],
    }).compile();

    searchIndex = module.get<SearchIndexService>(SearchIndexService);
    matching = module.get<CandidateMatchingService>(CandidateMatchingService);
    pools = module.get<TalentPoolService>(TalentPoolService);
    lists = module.get<CandidateListsService>(CandidateListsService);
    controller = module.get<TalentController>(TalentController);

    // Reset localized file storage
    TalentStore.resetAll();
    jest.clearAllMocks();
  });

  describe("SearchIndexService", () => {
    it("should set and retrieve search provider abstractly", () => {
      expect(searchIndex.getProvider()).toBe("DATABASE");
      searchIndex.setProvider("MEILISEARCH");
      expect(searchIndex.getProvider()).toBe("MEILISEARCH");
    });

    it("should return false if candidate profile to index does not exist", async () => {
      mockPrisma.candidateProfile.findUnique.mockResolvedValueOnce(null);
      const ok = await searchIndex.indexCandidate("missing-id");
      expect(ok).toBeFalsy();
    });

    it("should index candidate details and generate ResumeIndex keywords cleanly", async () => {
      const mockCandidate = {
        id: "cand-1",
        headline: "Staff Engineer",
        bio: "Senior backend developer",
        currentEmployer: "Google",
        currentDesignation: "Software Engineer",
        preferredLocation: "Toronto",
        location: "Canada",
        yearsOfExperience: 6,
        user: {
          email: "test@candidate.com",
          profile: { firstName: "Jane", lastName: "Doe" },
        },
        skills: [{ name: "NestJS" }, { name: "TypeScript" }],
        certifications: [{ name: "AWS Architect" }],
        education: [{ institution: "University of Waterloo", degree: "Bachelor" }],
        experience: [{ company: "Amazon", title: "SDE 2" }],
        tags: [{ tag: { name: "Sourcing Priority" } }],
      };

      mockPrisma.candidateProfile.findUnique.mockResolvedValueOnce(mockCandidate);
      mockPrisma.resumeIndex.upsert.mockResolvedValueOnce({});

      const ok = await searchIndex.indexCandidate("cand-1");
      expect(ok).toBeTruthy();
      expect(mockPrisma.resumeIndex.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { candidateProfileId: "cand-1" },
        })
      );
    });

    it("should filter, rank, and score candidates with partial matches and keyword relevancies", async () => {
      const candidates = [
        {
          id: "cand-1",
          yearsOfExperience: 6,
          salaryExpectationMin: 120000,
          salaryExpectationMax: 150000,
          currentDesignation: "Senior React Developer",
          currentEmployer: "Meta",
          location: "San Francisco",
          user: {
            profile: { firstName: "Alice", lastName: "Smith" },
          },
          skills: [{ name: "React" }, { name: "Redux" }],
          certifications: [],
          education: [],
          experience: [],
          languages: [],
          tags: [],
          ratings: [],
        },
        {
          id: "cand-2",
          yearsOfExperience: 2,
          salaryExpectationMin: 80000,
          salaryExpectationMax: 100000,
          currentDesignation: "Junior SDE",
          currentEmployer: "Amazon",
          location: "Seattle",
          user: {
            profile: { firstName: "Bob", lastName: "Jones" },
          },
          skills: [{ name: "Java" }],
          certifications: [],
          education: [],
          experience: [],
          languages: [],
          tags: [],
          ratings: [],
        },
      ];

      mockPrisma.candidateProfile.findMany.mockResolvedValueOnce(candidates);

      // Perform keyword search for React
      const result = await searchIndex.search({
        keyword: "React",
        recruiterId: "recruiter-1",
      });

      expect(result.items).toHaveLength(1);
      expect(result.items[0].id).toBe("cand-1");
      expect(result.items[0].searchRankScore).toBeGreaterThan(0);
      expect(result.pagination.total).toBe(1);
    });

    it("should retrieve index statistics and health metrics", async () => {
      mockPrisma.candidateProfile.count.mockResolvedValueOnce(150);
      mockPrisma.resumeIndex.count.mockResolvedValueOnce(120);
      mockPrisma.candidateSkill.count.mockResolvedValueOnce(350);
      mockPrisma.candidateCertification.count.mockResolvedValueOnce(90);

      const stats = await searchIndex.getStats();
      expect(stats.totalCandidates).toBe(150);
      expect(stats.indexedResumes).toBe(120);
      expect(stats.health).toBe("HEALTHY");
    });
  });

  describe("CandidateMatchingService", () => {
    it("should calculate job-to-candidate and candidate-to-job match score successfully", async () => {
      const mockJob = {
        id: "job-1",
        title: "Senior Node.js Developer",
        description: "Must know NestJS and Postgres",
        requirements: "5+ years of experience required. Hybrid setup in New York.",
        location: "New York",
        salaryMin: 130000,
        salaryMax: 160000,
        employmentType: EmploymentType.FULL_TIME,
        experienceLevel: ExperienceLevel.SENIOR,
        remotePolicy: RemotePolicy.HYBRID,
        status: JobStatus.PUBLISHED,
      };

      const mockCandidate = {
        id: "cand-1",
        yearsOfExperience: 6,
        salaryExpectationMin: 140000,
        salaryExpectationMax: 155000,
        location: "New York",
        preferredLocation: "New York",
        preferredJobType: EmploymentType.FULL_TIME,
        remotePreference: "HYBRID",
        skills: [{ name: "NestJS" }, { name: "Postgres" }],
        experience: [],
        education: [],
      };

      mockPrisma.job.findUnique.mockResolvedValueOnce(mockJob);
      mockPrisma.candidateProfile.findUnique.mockResolvedValueOnce(mockCandidate);

      const score = await matching.calculateMatchScore("job-1", "cand-1");
      expect(score.jobToCandidateScore).toBeGreaterThan(70);
      expect(score.candidateToJobScore).toBeGreaterThan(70);
      expect(score.locationMatch).toBeTruthy();
      expect(score.salaryCompatibility).toBeTruthy();
      expect(score.explainableReasons).toBeDefined();
    });
  });

  describe("TalentPoolService", () => {
    it("should create, list, and delete manual talent pools", async () => {
      const pool = await pools.createPool("recruiter-1", {
        name: "React Leaders",
        isPublic: false,
        candidateIds: ["cand-1", "cand-2"],
      });

      expect(pool.id).toBeDefined();
      expect(pool.name).toBe("React Leaders");
      expect(pool.candidateIds).toEqual(["cand-1", "cand-2"]);

      const list = await pools.listPools("recruiter-1");
      expect(list).toHaveLength(1);
      expect(list[0].name).toBe("React Leaders");

      pools.assignCandidate(pool.id, "cand-3");
      const updated = TalentStore.getPool(pool.id);
      expect(updated?.candidateIds).toContain("cand-3");

      pools.removeCandidate(pool.id, "cand-1");
      const updated2 = TalentStore.getPool(pool.id);
      expect(updated2?.candidateIds).not.toContain("cand-1");

      pools.deletePool(pool.id);
      expect(TalentStore.getPool(pool.id)).toBeUndefined();
    });
  });

  describe("CandidateListsService", () => {
    it("should add, retrieve, and toggle candidates in favorites, blacklists and archives", async () => {
      await lists.toggleCandidateInList("recruiter-1", "favorites", "cand-1");
      let current = await lists.getRecruiterLists("recruiter-1");
      expect(current.favorites).toContain("cand-1");

      await lists.toggleCandidateInList("recruiter-1", "favorites", "cand-1");
      current = await lists.getRecruiterLists("recruiter-1");
      expect(current.favorites).not.toContain("cand-1");
    });

    it("should record view events and store recently viewed records up to limit of 10", async () => {
      for (let i = 1; i <= 12; i++) {
        await lists.recordCandidateView("recruiter-1", `cand-${i}`);
      }
      const current = await lists.getRecruiterLists("recruiter-1");
      expect(current.recentlyViewed).toHaveLength(10);
      expect(current.recentlyViewed[0]).toBe("cand-12");
    });
  });

  describe("TalentController REST Endpoints", () => {
    it("should query stats and run analytics endpoint correctly", async () => {
      mockPrisma.candidateProfile.count.mockResolvedValueOnce(50);
      mockPrisma.resumeIndex.count.mockResolvedValueOnce(40);
      mockPrisma.candidateSkill.count.mockResolvedValueOnce(150);
      mockPrisma.candidateCertification.count.mockResolvedValueOnce(30);

      const stats = await controller.getStats();
      expect(stats.totalCandidates).toBe(50);
      expect(stats.indexedResumes).toBe(40);
    });
  });
});
