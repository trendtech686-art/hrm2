/**
 * Type-safe ID System
 * 
 * Prevents mixing systemId with business ID at compile time
 */

// Branded types for type safety
export type SystemId = string & { readonly __brand: 'SystemId' };
export type BusinessId = string & { readonly __brand: 'BusinessId' };

/**
 * Create a SystemId from a string
 * Use this when you know for sure it's a systemId
 */
export function asSystemId(id: string): SystemId {
  return id as SystemId;
}

/**
 * Create a BusinessId from a string
 * Use this when you know for sure it's a business ID
 */
export function asBusinessId(id: string): BusinessId {
  return id as BusinessId;
}

/**
 * Check if a string is a valid systemId format
 */
export function isSystemIdFormat(id: string): boolean {
  // SystemId: 8 digits + prefix (e.g., NV00000001, VOUCHER00000123)
  return /^[A-Z]+\d{8}$/.test(id);
}

/**
 * Check if a string is a valid business ID format
 */
export function isBusinessIdFormat(id: string): boolean {
  // Business ID: shorter, variable length (e.g., NV001, PT000001)
  return /^[A-Z]+\d{3,6}$/.test(id);
}

/**
 * Safely convert unknown ID to proper type
 */
export function parseId(id: string): { type: 'system' | 'business'; value: SystemId | BusinessId } {
  if (isSystemIdFormat(id)) {
    return { type: 'system', value: asSystemId(id) };
  }
  if (isBusinessIdFormat(id)) {
    return { type: 'business', value: asBusinessId(id) };
  }
  throw new Error(`Invalid ID format: ${id}`);
}

/**
 * ID Pair - Always keep systemId and businessId together
 */
export interface IDPair {
  systemId: SystemId;
  businessId: BusinessId;
}

/**
 * Entity with dual IDs
 */
export interface DualIDEntity {
  systemId: SystemId;
  id: BusinessId;
}

/**
 * Store methods with type-safe IDs
 */
export interface TypeSafeStore<T extends DualIDEntity> {
  /** Find by systemId (for queries, relationships) */
  findBySystemId(systemId: SystemId): T | null;
  
  /** Find by business ID (for user input, display) */
  findByBusinessId(businessId: BusinessId): T | null;
  
  /** Update by systemId (always use systemId for updates) */
  updateBySystemId(systemId: SystemId, updates: Partial<T>): void;
  
  /** Delete by systemId (always use systemId for deletes) */
  deleteBySystemId(systemId: SystemId): void;
}

/**
 * Route params with type-safe IDs
 */
export interface RouteParams {
  systemId?: SystemId;
  id?: BusinessId;
}

/**
 * Link builder - always uses systemId
 */
export function buildEntityLink(path: string, entity: DualIDEntity): string {
  return path.replace(':systemId', entity.systemId);
}

/**
 * Display ID - always uses business ID
 */
export function getDisplayId(entity: DualIDEntity): string {
  return entity.id;
}

/**
 * Runtime guard: ensures a string is valid SystemId format and casts it
 * Logs warning if format is invalid
 */
export function ensureSystemId(id: string, context?: string): SystemId {
  if (!isSystemIdFormat(id)) {
    console.warn(`[ensureSystemId] Invalid SystemId format: "${id}"${context ? ` in ${context}` : ''}`);
  }
  return asSystemId(id);
}

/**
 * Runtime guard: ensures a string is valid BusinessId format and casts it
 * Logs warning if format is invalid
 */
export function ensureBusinessId(id: string, context?: string): BusinessId {
  if (!isBusinessIdFormat(id)) {
    console.warn(`[ensureBusinessId] Invalid BusinessId format: "${id}"${context ? ` in ${context}` : ''}`);
  }
  return asBusinessId(id);
}
