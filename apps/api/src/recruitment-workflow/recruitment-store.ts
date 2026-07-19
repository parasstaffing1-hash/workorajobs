import * as fs from "fs";
import * as path from "path";

export interface ExtendedInterviewDetails {
  interviewId: string;
  roundName?: string;
  bufferMinutes?: number;
  panel?: Array<{ userId: string; role?: string; notes?: string }>;
  feedback?: {
    technicalRating: number;
    communicationRating: number;
    problemSolvingRating: number;
    leadershipRating: number;
    culturalFitRating: number;
    strengths?: string[];
    weaknesses?: string[];
    recommendation: string;
    additionalNotes?: string;
    createdAt: string;
  };
}

export interface OfferApproval {
  userId: string;
  role: string; // e.g. RECRUITER, MANAGER, HR, EXECUTIVE
  status: "PENDING" | "APPROVED" | "REJECTED";
  comment?: string;
  updatedAt?: string;
}

export interface Offer {
  id: string;
  applicationId: string;
  templateName: string;
  baseSalary: number;
  signOnBonus?: number;
  benefits?: string;
  joiningDate: string;
  expirationDate: string;
  status: "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "SENT" | "ACCEPTED" | "DECLINED" | "WITHDRAWN" | "JOINED";
  version: number;
  approvals: OfferApproval[];
  reason?: string; // rejection/decline reason
  createdAt: string;
  updatedAt: string;
}

export class RecruitmentStore {
  private static filePath = path.join(__dirname, "recruitment-data.json");
  private static data: {
    interviews: Record<string, ExtendedInterviewDetails>;
    offers: Record<string, Offer>;
  } = { interviews: {}, offers: {} };

  private static isLoaded = false;

  private static ensureLoaded() {
    if (this.isLoaded) return;
    try {
      if (fs.existsSync(this.filePath)) {
        const fileContent = fs.readFileSync(this.filePath, "utf-8");
        this.data = JSON.parse(fileContent);
      } else {
        this.data = { interviews: {}, offers: {} };
        this.save();
      }
    } catch (e) {
      console.error("Failed to load recruitment data store, using fallback", e);
      this.data = { interviews: {}, offers: {} };
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
      console.error("Failed to save recruitment data store", e);
    }
  }

  // Interview Methods
  static getInterview(interviewId: string): ExtendedInterviewDetails | undefined {
    this.ensureLoaded();
    return this.data.interviews[interviewId];
  }

  static saveInterview(interviewId: string, details: Partial<ExtendedInterviewDetails>) {
    this.ensureLoaded();
    const existing = this.data.interviews[interviewId] || { interviewId };
    this.data.interviews[interviewId] = {
      ...existing,
      ...details,
    };
    this.save();
    return this.data.interviews[interviewId];
  }

  static listInterviews(): ExtendedInterviewDetails[] {
    this.ensureLoaded();
    return Object.values(this.data.interviews);
  }

  // Offer Methods
  static getOffer(offerId: string): Offer | undefined {
    this.ensureLoaded();
    return this.data.offers[offerId];
  }

  static getOfferByApplication(applicationId: string): Offer | undefined {
    this.ensureLoaded();
    return Object.values(this.data.offers).find(o => o.applicationId === applicationId);
  }

  static saveOffer(offer: Offer) {
    this.ensureLoaded();
    this.data.offers[offer.id] = offer;
    this.save();
    return offer;
  }

  static listOffers(): Offer[] {
    this.ensureLoaded();
    return Object.values(this.data.offers);
  }
}
