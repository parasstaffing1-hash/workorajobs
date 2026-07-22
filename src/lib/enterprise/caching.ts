export class CacheManager {
  private static cacheStore = new Map<string, { value: any; expiresAt: number }>();

  /**
   * Retrieves cached value or executes fallback promise
   */
  static async getOrSet<T>(key: string, fetchFn: () => Promise<T>, ttlSeconds = 60): Promise<T> {
    const now = Date.now();
    const cached = this.cacheStore.get(key);

    if (cached && cached.expiresAt > now) {
      return cached.value as T;
    }

    const freshValue = await fetchFn();
    this.cacheStore.set(key, {
      value: freshValue,
      expiresAt: now + ttlSeconds * 1000,
    });

    return freshValue;
  }

  /**
   * Invalidates specific cache key
   */
  static invalidate(key: string) {
    this.cacheStore.delete(key);
  }

  /**
   * Clears entire cache store
   */
  static clearAll() {
    this.cacheStore.clear();
  }
}
