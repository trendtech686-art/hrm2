/**
 * Simple in-memory cache with TTL support
 * 
 * Features:
 * - TTL (Time To Live) support
 * - Automatic cleanup of expired entries
 * - Type-safe with generics
 * - Memory-efficient with max size limit
 * 
 * Usage:
 * ```ts
 * import { cache } from '@/lib/cache'
 * 
 * // Set with 5 minute TTL
 * cache.set('users', userData, 5 * 60 * 1000)
 * 
 * // Get (returns undefined if expired or not found)
 * const users = cache.get<User[]>('users')
 * 
 * // Get or set pattern
 * const data = await cache.getOrSet('key', async () => {
 *   return await fetchExpensiveData()
 * }, 60 * 1000)
 * ```
 */

interface CacheEntry<T> {
  value: T
  expiry: number
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<unknown>>()
  private maxSize: number
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor(maxSize = 1000) {
    this.maxSize = maxSize
    this.startCleanup()
  }

  /**
   * Set a value with optional TTL (in milliseconds)
   * Default TTL: 5 minutes
   */
  set<T>(key: string, value: T, ttl: number = 5 * 60 * 1000): void {
    // Evict oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      if (firstKey) {
        this.cache.delete(firstKey)
      }
    }

    this.cache.set(key, {
      value,
      expiry: Date.now() + ttl,
    })
  }

  /**
   * Get a value by key
   * Returns undefined if not found or expired
   */
  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined
    
    if (!entry) {
      return undefined
    }

    // Check if expired
    if (Date.now() > entry.expiry) {
      this.cache.delete(key)
      return undefined
    }

    return entry.value
  }

  /**
   * Get or set pattern - fetches if not in cache
   */
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = 5 * 60 * 1000
  ): Promise<T> {
    const cached = this.get<T>(key)
    if (cached !== undefined) {
      return cached
    }

    const value = await fetcher()
    this.set(key, value, ttl)
    return value
  }

  /**
   * Delete a specific key
   */
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  /**
   * Delete all keys matching a pattern
   */
  deletePattern(pattern: string): number {
    let count = 0
    const regex = new RegExp(pattern)
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key)
        count++
      }
    }
    
    return count
  }

  /**
   * Clear all cached values
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Get cache stats
   */
  stats(): { size: number; maxSize: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
    }
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== undefined
  }

  /**
   * Start periodic cleanup of expired entries
   */
  private startCleanup(): void {
    // Run cleanup every 5 minutes
    this.cleanupInterval = setInterval(() => {
      const now = Date.now()
      for (const [key, entry] of this.cache.entries()) {
        if (now > entry.expiry) {
          this.cache.delete(key)
        }
      }
    }, 5 * 60 * 1000)

    // Don't prevent Node.js from exiting
    if (this.cleanupInterval.unref) {
      this.cleanupInterval.unref()
    }
  }

  /**
   * Stop cleanup interval
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
    this.cache.clear()
  }
}

// Singleton instance
export const cache = new MemoryCache()

// Export class for custom instances
export { MemoryCache }

// Common cache TTL constants (in milliseconds for memory cache)
export const CACHE_TTL = {
  SHORT: 30 * 1000,        // 30 seconds
  MEDIUM: 5 * 60 * 1000,   // 5 minutes
  LONG: 30 * 60 * 1000,    // 30 minutes
  HOUR: 60 * 60 * 1000,    // 1 hour
  DAY: 24 * 60 * 60 * 1000 // 24 hours
} as const

// Cache tags for invalidation (used with unstable_cache)
export const CACHE_TAGS = {
  // Core
  SETTINGS: 'settings',
  ORDERS: 'orders',
  PRODUCTS: 'products',
  INVENTORY: 'inventory',
  CUSTOMERS: 'customers',
  BRANCHES: 'branches',
  USERS: 'users',
  
  // Sales
  RECEIPTS: 'receipts',
  SALES_RETURNS: 'sales-returns',
  CASHBOOK: 'cashbook',
  PAYMENTS: 'payments',
  
  // Purchases
  PURCHASE_ORDERS: 'purchase-orders',
  PURCHASE_RETURNS: 'purchase-returns',
  SUPPLIERS: 'suppliers',
  
  // HR
  EMPLOYEES: 'employees',
  ATTENDANCE: 'attendance',
  PAYROLL: 'payroll',
  LEAVES: 'leaves',
  PENALTIES: 'penalties',
  DEPARTMENTS: 'departments',
  
  // Inventory
  INVENTORY_CHECKS: 'inventory-checks',
  INVENTORY_RECEIPTS: 'inventory-receipts',
  STOCK_TRANSFERS: 'stock-transfers',
  STOCK_LOCATIONS: 'stock-locations',
  
  // Products
  CATEGORIES: 'categories',
  BRANDS: 'brands',
  PACKAGING: 'packaging',
  PRICE_ADJUSTMENTS: 'price-adjustments',
  COST_ADJUSTMENTS: 'cost-adjustments',
  
  // Other
  WARRANTY: 'warranty',
  TASKS: 'tasks',
  DASHBOARD: 'dashboard',
  COMPLAINTS: 'complaints',
  SHIPMENTS: 'shipments',
  RECONCILIATION: 'reconciliation',
  WIKI: 'wiki',
  REPORTS: 'reports',
} as const

// Cache key generators
export const cacheKey = {
  products: (query?: string) => `products:${query || 'all'}`,
  product: (id: string) => `product:${id}`,
  customers: (query?: string) => `customers:${query || 'all'}`,
  customer: (id: string) => `customer:${id}`,
  employees: () => 'employees:all',
  employee: (id: string) => `employee:${id}`,
  inventory: (productId: string) => `inventory:${productId}`,
  settings: (key: string) => `settings:${key}`,
}
