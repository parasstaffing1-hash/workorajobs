import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { RedisService } from "../../redis/redis.service";

export interface QueueJob<T = any> {
  id: string;
  queueName: string;
  data: T;
  attempts: number;
  createdAt: number;
}

@Injectable()
export class QueueService implements OnModuleInit {
  private readonly logger = new Logger(QueueService.name);
  private readonly handlers = new Map<string, (data: any) => Promise<void>>();
  private isProcessing = false;
  private lastSnitchPing = 0;

  constructor(private readonly redis: RedisService) {}

  onModuleInit() {
    this.startWorkerLoop();
  }

  // Register a queue handler (like a BullMQ Worker)
  registerWorker(queueName: string, handler: (data: any) => Promise<void>) {
    this.handlers.set(queueName, handler);
    this.logger.log(`Registered worker for queue: ${queueName}`);
  }

  // Enqueue a job (like BullMQ Queue.add)
  async add(queueName: string, data: any) {
    const job: QueueJob = {
      id: `${queueName}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      queueName,
      data,
      attempts: 0,
      createdAt: Date.now(),
    };

    try {
      // Store job in a Redis List (acting as BullMQ's active/waiting queues)
      const client = (this.redis as any).client;
      if (client && client.status === "ready") {
        await client.rpush(`queue:${queueName}`, JSON.stringify(job));
        this.logger.debug(`[Queue] Enqueued job ${job.id} to Redis queue: ${queueName}`);
      } else {
        // Fallback to async in-memory / direct processing if Redis is not connected
        this.logger.warn(`Redis not ready, processing job ${job.id} asynchronously in-memory`);
        setTimeout(() => this.executeJobDirectly(job), 50);
      }
    } catch (error) {
      this.logger.error(`Failed to enqueue job to queue ${queueName}:`, error);
      // Failover direct execution
      setTimeout(() => this.executeJobDirectly(job), 50);
    }

    return job;
  }

  private async executeJobDirectly(job: QueueJob) {
    const handler = this.handlers.get(job.queueName);
    if (handler) {
      try {
        await handler(job.data);
      } catch (err) {
        this.logger.error(`Direct execution of job ${job.id} failed:`, err);
      }
    }
  }

  private async pingDeadMansSnitch() {
    const snitchUrl = process.env.DEAD_MAN_SNITCH_URL || process.env.SNITCH_URL;
    if (!snitchUrl) return;

    // Throttle to avoid flooding (only ping once every 5 minutes / 300,000 ms)
    const now = Date.now();
    if (now - this.lastSnitchPing < 300000) return;

    try {
      this.lastSnitchPing = now;
      this.logger.log(`[Queue] Sending heartbeat ping to Dead Man's Snitch: ${snitchUrl}`);
      // Native fetch with 5 seconds timeout to prevent blocking
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(snitchUrl, {
        method: "GET",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        this.logger.log(`[Queue] Successfully pinged Dead Man's Snitch. Status: ${response.status}`);
      } else {
        this.logger.warn(`[Queue] Failed to ping Dead Man's Snitch. Status: ${response.status}`);
      }
    } catch (err) {
      this.logger.error(`[Queue] Error pinging Dead Man's Snitch:`, err);
    }
  }

  // A background polling loop that processes jobs from Redis (acting as BullMQ workers)
  private async startWorkerLoop() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    while (this.isProcessing) {
      try {
        const client = (this.redis as any).client;
        if (client && client.status === "ready") {
          for (const queueName of this.handlers.keys()) {
            const jobStr = await client.lpop(`queue:${queueName}`);
            if (jobStr) {
              const job: QueueJob = JSON.parse(jobStr);
              const handler = this.handlers.get(queueName);
              if (handler) {
                try {
                  job.attempts += 1;
                  await handler(job.data);
                  this.logger.debug(`[Queue] Successfully processed job ${job.id}`);
                } catch (err) {
                  this.logger.error(`[Queue] Error processing job ${job.id} (attempt ${job.attempts}):`, err);
                  if (job.attempts < 3) {
                    // Retry with exponential backoff (re-queue)
                    await client.rpush(`queue:${queueName}`, JSON.stringify(job));
                  } else {
                    this.logger.error(`[Queue] Job ${job.id} exceeded maximum retry attempts`);
                  }
                }
              }
            }
          }
        }
        // Ping Dead Man's Snitch to signal worker liveness
        await this.pingDeadMansSnitch();
      } catch (error) {
        this.logger.error(`Error in queue worker loop:`, error);
      }
      // Wait before the next check to avoid CPU spinning
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}
