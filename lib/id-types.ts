/**
 * 🏷️ BRANDED TYPES FOR TYPE SAFETY
 * 
 * Lightweight branded types - prevents mixing systemId with businessId at compile time.
 * For full ID management system, see @/lib/id-system
 * 
 * @see {@link @/lib/id-system} for ID generation and database operations
 */

import { z } from 'zod';

// ========================================
// BRANDED TYPES
// ========================================

/**
 * SystemId - Internal unique identifier
 * Used for: Database queries, foreign keys, routing
 * Example: "EMP000001", "CUSTOMER000001", "ORDER000001"
 */
export type SystemId = string & { readonly __brand: 'SystemId' };

/**
 * BusinessId - User-facing display identifier
 * Used for: UI display, breadcrumbs, user communication
 * Example: "NV000001", "KH000001", "DH000001"
 */
export type BusinessId = string & { readonly __brand: 'BusinessId' };

/**
 * Create a branded SystemId
 */
export function asSystemId(id: string): SystemId {
  return id as SystemId;
}

/**
 * Create a branded BusinessId
 */
export function asBusinessId(id: string): BusinessId {
  return id as BusinessId;
}

// ========================================
// INTERFACES
// ========================================

/**
 * Entity with dual IDs (SystemId + BusinessId)
 */
export interface DualIDEntity {
  systemId: SystemId;
  id: BusinessId;
}

/**
 * ID Pair - Always keep systemId and businessId together
 */
export interface IDPair {
  systemId: SystemId;
  businessId: BusinessId;
}

/**
 * Store methods with type-safe IDs
 */
export interface TypeSafeStore<T extends DualIDEntity> {
  findBySystemId(systemId: SystemId): T | null;
  findByBusinessId(businessId: BusinessId): T | null;
  updateBySystemId(systemId: SystemId, updates: Partial<T>): void;
  deleteBySystemId(systemId: SystemId): void;
}

// ========================================
// ZOD SCHEMA HELPERS
// ========================================

/**
 * Zod schema for SystemId validation
 */
export const systemIdSchema = z.string().transform((val) => asSystemId(val));

/**
 * Zod schema for BusinessId validation
 */
export const businessIdSchema = z.string().transform((val) => asBusinessId(val));
