import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "";

class MockRedis {
  private store = new Map<string, string>();
  private timeouts = new Map<string, NodeJS.Timeout>();

  async get(key: string): Promise<string | null> {
    return this.store.get(key) ?? null;
  }

  async set(
    key: string,
    value: string,
    mode?: string,
    duration?: number
  ): Promise<string> {
    this.store.set(key, value);
    if (this.timeouts.has(key)) {
      clearTimeout(this.timeouts.get(key));
    }
    if (mode === "EX" && duration) {
      const timeout = setTimeout(() => {
        this.store.delete(key);
        this.timeouts.delete(key);
      }, duration * 1000);
      this.timeouts.set(key, timeout);
    }
    return "OK";
  }

  async del(key: string): Promise<number> {
    const existed = this.store.has(key);
    this.store.delete(key);
    if (this.timeouts.has(key)) {
      clearTimeout(this.timeouts.get(key));
      this.timeouts.delete(key);
    }
    return existed ? 1 : 0;
  }

  async incr(key: string): Promise<number> {
    const val = parseInt(this.store.get(key) || "0", 10) + 1;
    this.store.set(key, val.toString());
    return val;
  }

  async expire(key: string, seconds: number): Promise<number> {
    if (this.store.has(key)) {
      if (this.timeouts.has(key)) {
        clearTimeout(this.timeouts.get(key));
      }
      const timeout = setTimeout(() => {
        this.store.delete(key);
        this.timeouts.delete(key);
      }, seconds * 1000);
      this.timeouts.set(key, timeout);
      return 1;
    }
    return 0;
  }
}

export const redis = REDIS_URL
  ? new Redis(REDIS_URL, {
      maxRetriesPerRequest: 2,
      connectTimeout: 2000,
      lazyConnect: true,
      enableReadyCheck: true,
      keepAlive: 10000, // TCP keepalive every 10s — prevents idle disconnections
      retryStrategy(times) {
        // Exponential backoff: 50ms, 100ms, 200ms... max 2s
        return Math.min(times * 50, 2000);
      },
    })
  : (new MockRedis() as unknown as Redis);

// Handle connection failures gracefully
if (REDIS_URL) {
  redis.on("error", (err) => {
    console.error("Redis connection error, falling back to mock: ", err);
  });
}
