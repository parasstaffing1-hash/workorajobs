import { prisma } from "@/lib/prisma";

export class JobQualityEngine {
  /**
   * Evaluates quality score (0-100) for a job listing
   */
  static async evaluateJobQuality(jobId: string): Promise<{
    score: number;
    isFlagged: boolean;
    isScam: boolean;
    rejectionReason?: string;
  }> {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { company: true },
    });

    if (!job) {
      throw new Error("Job not found.");
    }

    let score = 100;
    let isScam = false;
    let rejectionReason: string | undefined;

    // Check description length
    if (!job.description || job.description.length < 50) {
      score -= 30;
    }

    // Check salary transparency
    if (!job.salary || job.salary === 0) {
      score -= 15;
    }

    // Check suspicious scam keywords
    const lowerText = `${job.title} ${job.description}`.toLowerCase();
    const scamKeywords = ["wire money", "crypto payment", "no experience $1000/day", "whatsapp only", "telegram payment"];

    for (const kw of scamKeywords) {
      if (lowerText.includes(kw)) {
        isScam = true;
        score -= 70;
        rejectionReason = `Suspicious scam keyword detected: "${kw}"`;
        break;
      }
    }

    const finalScore = Math.max(0, score);
    const isFlagged = finalScore < 60 || isScam;

    await prisma.jobQualityScore.upsert({
      where: { jobId },
      create: {
        jobId,
        score: finalScore,
        isFlagged,
        isScam,
        rejectionReason,
      },
      update: {
        score: finalScore,
        isFlagged,
        isScam,
        rejectionReason,
      },
    });

    return { score: finalScore, isFlagged, isScam, rejectionReason };
  }
}
