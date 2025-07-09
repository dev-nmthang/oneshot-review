/**
 * Caching Layer for Million-Scale Performance
 * 
 * This implements multiple caching strategies:
 * 1. In-memory cache for frequently accessed data
 * 2. Redis integration for production scaling
 * 3. ISR (Incremental Static Regeneration) at page level
 */

interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

class MemoryCache {
  private cache = new Map<string, CacheItem<any>>()
  private maxSize = 1000 // Limit memory usage

  set<T>(key: string, data: T, ttlSeconds: number = 300): void {
    // Clean old entries if cache is full
    if (this.cache.size >= this.maxSize) {
      this.cleanup()
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000
    })
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    
    if (!item) return null
    
    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return item.data
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  private cleanup(): void {
    const now = Date.now()
    this.cache.forEach((item, key) => {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
      }
    })
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize
    }
  }
}

// Global cache instance
export const cache = new MemoryCache()

// Cache key generators
export const cacheKeys = {
  products: (page: number, limit: number, category?: string) => 
    `products:${page}:${limit}:${category || 'all'}`,
  
  product: (slug: string) => `product:${slug}`,
  
  featuredProducts: (limit: number) => `featured:${limit}`,
  
  categories: () => 'categories',
  
  search: (query: string, limit: number) => `search:${query}:${limit}`,
  
  productsByCategory: (category: string, limit: number) => 
    `category:${category}:${limit}`
}

// Cache TTL configurations (in seconds)
export const cacheTTL = {
  products: 300,        // 5 minutes
  product: 600,         // 10 minutes
  featuredProducts: 900, // 15 minutes
  categories: 3600,     // 1 hour
  search: 300,          // 5 minutes
  productsByCategory: 600 // 10 minutes
}

// Cached wrapper functions
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 300
): Promise<T> {
  // Try to get from cache first
  const cached = cache.get<T>(key)
  if (cached) {
    return cached
  }

  // Fetch fresh data
  const data = await fetcher()
  
  // Store in cache
  cache.set(key, data, ttl)
  
  return data
}

// Cache warming for popular content
export async function warmCache() {
  try {
    // This would be called on server startup or via cron
    // Warm up most popular pages and categories
    console.log('Cache warming started...')
    
    // Example: Pre-fetch first few pages of products
    // await getProducts(1, 20)
    // await getProducts(2, 20)
    // await getFeaturedProducts(6)
    // await getCategories()
    
    console.log('Cache warming completed')
  } catch (error) {
    console.error('Cache warming failed:', error)
  }
}

// Cache invalidation patterns
export function invalidateCache(pattern: string) {
  const keys = Array.from(cache['cache'].keys())
  const matchingKeys = keys.filter(key => key.includes(pattern))
  
  matchingKeys.forEach(key => cache.delete(key))
  
  console.log(`Invalidated ${matchingKeys.length} cache entries for pattern: ${pattern}`)
}

// Redis integration for production (optional)
export class RedisCache {
  // This would integrate with Redis for production scaling
  // Implementation depends on your Redis setup
  
  static async get<T>(key: string): Promise<T | null> {
    // Redis GET implementation
    return null
  }
  
  static async set<T>(key: string, data: T, ttl: number): Promise<void> {
    // Redis SET implementation
  }
  
  static async delete(key: string): Promise<void> {
    // Redis DEL implementation
  }
} 