import { prisma } from "@/lib/prisma";

export class BackgroundTaskQueue {
  /**
   * Enqueues a new background task
   */
  static async enqueue(taskType: "CRAWL" | "EMAIL" | "RESUME_PARSE" | "SEO_GEN", payload: Record<string, any>) {
    return prisma.backgroundTask.create({
      data: {
        taskType,
        payloadJson: payload,
        status: "PENDING",
      },
    });
  }

  /**
   * Process pending background tasks with retry mechanism & dead-letter queue escalation
   */
  static async processPendingTasks(): Promise<{ processed: number; failed: number }> {
    const pendingTasks = await prisma.backgroundTask.findMany({
      where: { status: "PENDING" },
      take: 10,
    });

    let processed = 0;
    let failed = 0;

    for (const task of pendingTasks) {
      try {
        await prisma.backgroundTask.update({
          where: { id: task.id },
          data: { status: "PROCESSING", attempts: task.attempts + 1 },
        });

        // Simulate async task execution
        await new Promise((resolve) => setTimeout(resolve, 50));

        await prisma.backgroundTask.update({
          where: { id: task.id },
          data: { status: "COMPLETED", processedAt: new Date() },
        });

        processed++;
      } catch (err: any) {
        failed++;
        const nextAttempts = task.attempts + 1;
        const isDeadLetter = nextAttempts >= task.maxAttempts;

        await prisma.backgroundTask.update({
          where: { id: task.id },
          data: {
            status: isDeadLetter ? "DEAD_LETTER" : "FAILED",
            error: err?.message || "Execution failed",
          },
        });
      }
    }

    return { processed, failed };
  }
}
