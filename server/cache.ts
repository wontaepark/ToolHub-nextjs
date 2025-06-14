import NodeCache from 'node-cache';

// In-memory cache as fallback when Redis is not available
const memoryCache = new NodeCache({
  stdTTL: 1800, // 30 minutes default
  checkperiod: 120, // Check for expired keys every 2 minutes
  maxKeys: 1000 // Limit memory usage
});

interface CacheOptions {
  ttl?: number;
  stale?: boolean;
}

class WeatherCache {
  private cache: NodeCache;

  constructor() {
    this.cache = memoryCache;
  }

  // Get data from cache
  async get(key: string): Promise<any | null> {
    try {
      const data = this.cache.get(key);
      return data || null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  // Set data in cache with TTL
  async set(key: string, data: any, ttl: number = 1800): Promise<boolean> {
    try {
      return this.cache.set(key, data, ttl);
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  // Set stale data (for emergency fallback)
  async setStale(key: string, data: any): Promise<boolean> {
    try {
      const staleKey = `stale:${key}`;
      // Stale data expires after 24 hours
      return this.cache.set(staleKey, data, 86400);
    } catch (error) {
      console.error('Cache setStale error:', error);
      return false;
    }
  }

  // Get stale data when fresh data is unavailable
  async getStale(key: string): Promise<any | null> {
    try {
      const staleKey = `stale:${key}`;
      return this.cache.get(staleKey) || null;
    } catch (error) {
      console.error('Cache getStale error:', error);
      return null;
    }
  }

  // Delete cache entry
  async del(key: string): Promise<boolean> {
    try {
      return this.cache.del(key) > 0;
    } catch (error) {
      console.error('Cache del error:', error);
      return false;
    }
  }

  // Check if cache has key
  async has(key: string): Promise<boolean> {
    try {
      return this.cache.has(key);
    } catch (error) {
      console.error('Cache has error:', error);
      return false;
    }
  }

  // Get cache statistics
  getStats() {
    return this.cache.getStats();
  }

  // Clear all cache
  flushAll(): void {
    this.cache.flushAll();
  }

  // Clear specific Korean city entries to refresh with correct encoding
  clearKoreanEntries(): void {
    const keys = this.cache.keys();
    keys.forEach(key => {
      if (key.includes('ë') || key.includes('ì') || key.includes('ì°')) {
        this.cache.del(key);
      }
    });
  }
}

// TTL configurations for different data types
export const CacheTTL = {
  LOCATION_KEY: 604800, // 7 days (location keys rarely change)
  CURRENT_WEATHER: 1800, // 30 minutes
  HOURLY_FORECAST: 3600, // 1 hour
  DAILY_FORECAST: 21600, // 6 hours
  RATE_LIMIT: 86400, // 24 hours (daily rate limit reset)
} as const;

// Cache key generators
export const CacheKeys = {
  locationKey: (query: string) => `location:${query.toLowerCase().trim()}`,
  currentWeather: (locationKey: string) => `weather:current:${locationKey}`,
  dailyForecast: (locationKey: string) => `weather:daily:${locationKey}`,
  rateLimit: (provider: string) => `ratelimit:${provider}`,
  coordinates: (lat: number, lon: number) => `coords:${lat.toFixed(4)},${lon.toFixed(4)}`,
} as const;

// Singleton cache instance
export const weatherCache = new WeatherCache();

// Cache utility functions
export const cacheUtils = {
  // Check if data is stale (older than specified time)
  isStale: (timestamp: number, maxAge: number): boolean => {
    return Date.now() - timestamp > maxAge * 1000;
  },

  // Generate cache key with timestamp
  withTimestamp: (data: any) => ({
    ...data,
    cached_at: Date.now(),
    source: 'cache'
  }),

  // Extract data without cache metadata
  extractData: (cachedData: any) => {
    if (!cachedData) return null;
    const { cached_at, source, ...data } = cachedData;
    return data;
  },

  // Check if cached data is fresh enough
  isFresh: (cachedData: any, maxAge: number): boolean => {
    if (!cachedData || !cachedData.cached_at) return false;
    return !cacheUtils.isStale(cachedData.cached_at, maxAge);
  }
};

export default weatherCache;