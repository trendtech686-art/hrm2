/**
 * Enhanced revalidation utilities
 * 
 * Drop-in replacement for `revalidatePath` from 'next/cache'.
 * Automatically invalidates matching `unstable_cache` tags alongside path revalidation.
 * 
 * Usage in server actions:
 * ```ts
 * // Before: import { revalidatePath } from 'next/cache'
 * // After:
 * import { revalidatePath } from '@/lib/revalidation'
 * ```
 * 
 * This ensures that when a server action calls `revalidatePath('/orders')`,
 * the corresponding `unstable_cache` entries tagged with 'orders' are also invalidated.
 */

import { revalidatePath as _revalidatePath, revalidateTag } from 'next/cache'
import { CACHE_TAGS } from './cache'

/**
 * Map URL path prefixes to their corresponding unstable_cache tags.
 * When revalidatePath is called, matching tags are also invalidated.
 * 
 * Key: URL path prefix (matched against start of path)
 * Value: Array of CACHE_TAGS to invalidate
 */
const PATH_TAG_MAP: Record<string, string[]> = {
  // Core
  '/orders': [CACHE_TAGS.ORDERS],
  '/products': [CACHE_TAGS.PRODUCTS],
  '/customers': [CACHE_TAGS.CUSTOMERS],
  '/employees': [CACHE_TAGS.USERS],
  '/suppliers': [CACHE_TAGS.SUPPLIERS],
  
  // Sales
  '/receipts': [CACHE_TAGS.RECEIPTS],
  '/payments': [CACHE_TAGS.PAYMENTS],
  '/cashbook': [CACHE_TAGS.CASHBOOK],
  '/cash-accounts': [CACHE_TAGS.CASHBOOK],
  '/sales-returns': [CACHE_TAGS.SALES_RETURNS],
  '/finance': [CACHE_TAGS.CASHBOOK],
  
  // Purchases
  '/purchase-orders': [CACHE_TAGS.PURCHASE_ORDERS],
  '/purchase-returns': [CACHE_TAGS.PURCHASE_RETURNS],
  
  // Inventory
  '/inventory-checks': [CACHE_TAGS.INVENTORY],
  '/inventory-receipts': [CACHE_TAGS.INVENTORY_RECEIPTS],
  '/inventory': [CACHE_TAGS.INVENTORY],
  '/stock-locations': [CACHE_TAGS.STOCK_LOCATIONS],
  '/stock-transfers': [CACHE_TAGS.STOCK_TRANSFERS],
  
  // Products
  '/price-adjustments': [CACHE_TAGS.PRICE_ADJUSTMENTS],
  '/cost-adjustments': [CACHE_TAGS.COST_ADJUSTMENTS],
  '/brands': [CACHE_TAGS.BRANDS],
  '/categories': [CACHE_TAGS.CATEGORIES],
  '/packagings': [CACHE_TAGS.PACKAGING],
  
  // HR
  '/attendance': [CACHE_TAGS.ATTENDANCE],
  '/payroll': [CACHE_TAGS.PAYROLL],
  '/leaves': [CACHE_TAGS.LEAVES],
  
  // Other
  '/warranty': [CACHE_TAGS.WARRANTY],
  '/complaints': [CACHE_TAGS.COMPLAINTS],
  '/shipments': [CACHE_TAGS.SHIPMENTS],
  '/tasks': [CACHE_TAGS.TASKS],
  '/wiki': [CACHE_TAGS.WIKI],
  '/reconciliation': [CACHE_TAGS.RECONCILIATION],
  '/dashboard': [CACHE_TAGS.DASHBOARD],
  
  // Settings
  '/settings': [CACHE_TAGS.SETTINGS],
}

/**
 * Enhanced revalidatePath — drop-in replacement for `next/cache` version.
 * 
 * Calls the original `revalidatePath` AND automatically invalidates
 * any `unstable_cache` entries whose tags match the path prefix.
 * 
 * This bridges the gap between:
 * - `revalidatePath` (invalidates Full Route Cache)
 * - `revalidateTag` (invalidates Data Cache / unstable_cache)
 * 
 * @example
 * revalidatePath('/orders')           // Also invalidates CACHE_TAGS.ORDERS
 * revalidatePath('/orders/ORD-001')   // Also invalidates CACHE_TAGS.ORDERS
 * revalidatePath('/settings/taxes')   // Also invalidates CACHE_TAGS.SETTINGS
 */
export function revalidatePath(path: string, type?: 'page' | 'layout') {
  // Call original revalidatePath
  _revalidatePath(path, type)
  
  // Auto-invalidate matching cache tags (deduplicated)
  const invalidatedTags = new Set<string>()
  
  for (const [prefix, tags] of Object.entries(PATH_TAG_MAP)) {
    if (path === prefix || path.startsWith(prefix + '/')) {
      tags.forEach(tag => invalidatedTags.add(tag))
    }
  }
  
  for (const tag of invalidatedTags) {
    revalidateTag(tag, 'default')
  }
}

// Re-export revalidateTag for direct use when needed
export { revalidateTag }
