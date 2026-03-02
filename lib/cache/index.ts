/**
 * Cache Utilities
 * 
 * Centralized cache management for Next.js App Router
 * Supports multiple caching strategies:
 * - unstable_cache: Server-side time-based cache
 * - React.cache: Request-level memoization
 * - Memory cache: In-memory with TTL
 */

import { unstable_cache } from 'next/cache';
import { cache } from 'react';

// Re-export memory cache
export { memoryCache } from './memory-cache';

// Cache key prefixes for organization
export const CACHE_KEYS = {
  // Settings (heavy cache - rarely changes)
  SETTINGS: 'settings',
  BRANCHES: 'branches',
  WAREHOUSES: 'warehouses',
  CATEGORIES: 'categories',
  BRANDS: 'brands',
  
  // Business data (moderate cache)
  ORDERS: 'orders',
  PRODUCTS: 'products',
  CUSTOMERS: 'customers',
  INVENTORY: 'inventory',
  
  // User data (short cache)
  USER_PROFILE: 'user-profile',
  USER_PERMISSIONS: 'user-permissions',
  
  // Reports (per-request cache)
  REPORTS: 'reports',
  REPORTS_SALES: 'reports-sales',
  REPORTS_INVENTORY: 'reports-inventory',
  REPORTS_CUSTOMERS: 'reports-customers',
  DASHBOARD: 'dashboard',
} as const;

// Cache durations in seconds
export const CACHE_TTL = {
  /** 10 minutes - for rarely changing data like settings */
  LONG: 600,
  /** 5 minutes - for moderate data like categories */
  MEDIUM: 300,
  /** 1 minute - for frequently changing data */
  SHORT: 60,
  /** 30 seconds - for near real-time data */
  VERY_SHORT: 30,
  /** No cache - for real-time data */
  NONE: 0,
} as const;

// Cache tags for invalidation
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
} as const;

/**
 * Create a cached function with Next.js unstable_cache
 * 
 * @example
 * const getProducts = createCachedFunction(
 *   async (branchId: string) => {
 *     return prisma.product.findMany({ where: { branchSystemId: branchId } });
 *   },
 *   ['products'],
 *   { revalidate: CACHE_TTL.MEDIUM, tags: [CACHE_TAGS.PRODUCTS] }
 * );
 */
export function createCachedFunction<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  keyParts: string[],
  options: {
    revalidate?: number;
    tags?: string[];
  } = {}
): T {
  const { revalidate = CACHE_TTL.SHORT, tags = [] } = options;
  
  return unstable_cache(fn, keyParts, { revalidate, tags }) as T;
}

/**
 * Create a request-memoized function with React.cache
 * Same request = same result (deduplication)
 * 
 * @example
 * const getCurrentUser = memoize(async () => {
 *   return getServerSession();
 * });
 */
export function memoize<T extends (...args: unknown[]) => unknown>(fn: T): T {
  return cache(fn) as T;
}

/**
 * Build cache key from parts
 * 
 * @example
 * buildCacheKey(CACHE_KEYS.ORDERS, branchId, 'page', page)
 * // => "orders:BR001:page:1"
 */
export function buildCacheKey(...parts: (string | number | undefined | null)[]): string {
  return parts.filter(Boolean).join(':');
}

/**
 * Type-safe cache key builder for pagination
 */
export function buildPaginationKey(
  prefix: string,
  options: {
    page?: number;
    limit?: number;
    search?: string;
    filters?: Record<string, unknown>;
  }
): string[] {
  const { page = 1, limit = 50, search, filters } = options;
  
  const parts = [prefix, `p${page}`, `l${limit}`];
  
  if (search) {
    parts.push(`s${search}`);
  }
  
  if (filters) {
    parts.push(JSON.stringify(filters));
  }
  
  return parts;
}
