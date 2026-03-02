/**
 * UNIFIED ID MANAGEMENT SYSTEM v3.0
 * 
 * Single source of truth for all ID operations in the system.
 * Database-first approach using IdCounter table.
 * 
 * Features:
 * - 60+ entity configurations
 * - TypeScript branded types (SystemId, BusinessId)
 * - Database-backed counter (atomic operations)
 * - Server & Client compatible utilities
 * 
 * ⚠️ SERVER-ONLY: This file imports Prisma
 * For client-safe imports, use: ./id-config-constants or ./id-types
 * 
 * @version 3.0.0
 * @date 2026-01-03
 */

import { prisma } from './prisma';
import type { EntityType, EntityConfig } from './id-config-constants';
import { ID_CONFIG, getConfig, getPrefix, getSystemPrefix, getEntityCategories, validateIdFormat } from './id-config-constants';

// ========================================
// RE-EXPORTS FROM CLIENT-SAFE MODULES
// ========================================

// Re-export client-safe constants and types
export type { EntityType, EntityConfig };
export { ID_CONFIG, getConfig, getPrefix, getSystemPrefix, getEntityCategories, validateIdFormat };

// ========================================
// BRANDED TYPES FOR TYPE SAFETY
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
 * Format a counter value to ID string (private helper)
 */
function formatId(prefix: string, counter: number, digitCount: number = 6): string {
  return `${prefix}${String(counter).padStart(digitCount, '0')}`;
}

/**
 * Sanitize business ID input (private helper for generateNextIds)
 */
function sanitizeBusinessId(id: string): string | null {
  if (!id || typeof id !== 'string') return null;
  const cleaned = id.trim().replace(/[^a-zA-Z0-9]/g, '');
  return cleaned ? cleaned.toUpperCase() : null;
}

// ========================================
// DATABASE-BACKED ID GENERATION (Server-only)
// ========================================

export interface GeneratedIds {
  systemId: SystemId;
  businessId: BusinessId;
  counter: number;
}

// ========================================
// TABLE MAPPING FOR MAX ID QUERIES
// ========================================
// Maps entity types to their PostgreSQL table names (from @@map in Prisma schema)
// Used to query MAX(systemId) and MAX(id) for generating next IDs
// ========================================

/**
 * Table mapping for each entity type
 * NOTE: Table names must match the actual PostgreSQL table names (from @@map in Prisma schema)
 * 
 * This maps EntityType → { table, systemIdField, businessIdField }
 * Only include entities that have dual ID pattern (systemId @id + id @unique)
 */
const ENTITY_TABLE_MAP: Partial<Record<EntityType, { table: string; systemIdField: string; businessIdField: string }>> = {
  // ========================================
  // SALES & FULFILLMENT
  // ========================================
  orders: { table: 'orders', systemIdField: 'systemId', businessIdField: 'id' },
  'sales-returns': { table: 'sales_returns', systemIdField: 'systemId', businessIdField: 'id' },
  'sales-channels': { table: 'sales_channels', systemIdField: 'systemId', businessIdField: 'id' },
  // NOTE: packaging uses order-based format like "PACKAGE000040-01" (order_counter-index)
  // So it's excluded from ENTITY_TABLE_MAP - generate manually in code
  shipments: { table: 'shipments', systemIdField: 'systemId', businessIdField: 'id' },
  
  // ========================================
  // CUSTOMERS & PARTNERS
  // ========================================
  customers: { table: 'customers', systemIdField: 'systemId', businessIdField: 'id' },
  suppliers: { table: 'suppliers', systemIdField: 'systemId', businessIdField: 'id' },
  'shipping-partners': { table: 'shipping_partners', systemIdField: 'systemId', businessIdField: 'id' },
  
  // ========================================
  // PRODUCTS & INVENTORY
  // ========================================
  products: { table: 'products', systemIdField: 'systemId', businessIdField: 'id' },
  categories: { table: 'categories', systemIdField: 'systemId', businessIdField: 'id' },
  brands: { table: 'brands', systemIdField: 'systemId', businessIdField: 'id' },
  units: { table: 'units', systemIdField: 'systemId', businessIdField: 'id' },
  'stock-locations': { table: 'stock_locations', systemIdField: 'systemId', businessIdField: 'id' },
  'stock-transfers': { table: 'stock_transfers', systemIdField: 'systemId', businessIdField: 'id' },
  'inventory-receipts': { table: 'inventory_receipts', systemIdField: 'systemId', businessIdField: 'id' },
  'inventory-checks': { table: 'inventory_checks', systemIdField: 'systemId', businessIdField: 'id' },
  'cost-adjustments': { table: 'cost_adjustments', systemIdField: 'systemId', businessIdField: 'id' },
  'price-adjustments': { table: 'price_adjustments', systemIdField: 'systemId', businessIdField: 'id' },
  
  // ========================================
  // HR & ORGANIZATION
  // ========================================
  employees: { table: 'employees', systemIdField: 'systemId', businessIdField: 'id' },
  departments: { table: 'departments', systemIdField: 'systemId', businessIdField: 'id' },
  branches: { table: 'branches', systemIdField: 'systemId', businessIdField: 'id' },
  'job-titles': { table: 'job_titles', systemIdField: 'systemId', businessIdField: 'id' },
  attendance: { table: 'attendance_records', systemIdField: 'systemId', businessIdField: 'id' },
  payroll: { table: 'payrolls', systemIdField: 'systemId', businessIdField: 'id' },
  penalties: { table: 'penalties', systemIdField: 'systemId', businessIdField: 'id' },
  leaves: { table: 'leaves', systemIdField: 'systemId', businessIdField: 'id' },
  
  // ========================================
  // FINANCE
  // ========================================
  receipts: { table: 'receipts', systemIdField: 'systemId', businessIdField: 'id' },
  payments: { table: 'payments', systemIdField: 'systemId', businessIdField: 'id' },
  'cash-accounts': { table: 'cash_accounts', systemIdField: 'systemId', businessIdField: 'id' },
  'payment-methods': { table: 'payment_methods', systemIdField: 'systemId', businessIdField: 'id' },
  taxes: { table: 'taxes', systemIdField: 'systemId', businessIdField: 'id' },
  'pricing-settings': { table: 'pricing_policies', systemIdField: 'systemId', businessIdField: 'id' },
  
  // ========================================
  // PURCHASING
  // ========================================
  'purchase-orders': { table: 'purchase_orders', systemIdField: 'systemId', businessIdField: 'id' },
  'purchase-returns': { table: 'purchase_returns', systemIdField: 'systemId', businessIdField: 'id' },
  
  // ========================================
  // SERVICE & WORKFLOW
  // ========================================
  warranty: { table: 'warranties', systemIdField: 'systemId', businessIdField: 'id' },
  complaints: { table: 'complaints', systemIdField: 'systemId', businessIdField: 'id' },
  'internal-tasks': { table: 'tasks', systemIdField: 'systemId', businessIdField: 'id' },
  wiki: { table: 'wiki_pages', systemIdField: 'systemId', businessIdField: 'id' },
  
  // ========================================
  // SETTINGS (entities that use ID generation)
  // ========================================
  'employee-types': { table: 'employee_type_settings', systemIdField: 'systemId', businessIdField: 'id' },
};

/**
 * Extract numeric counter from ID string
 * Example: "ORDER000123" with prefix "ORDER" → 123
 */
export function extractCounterFromId(id: string | null, prefix: string): number {
  if (!id) return 0;
  const prefixUpper = prefix.toUpperCase();
  const idUpper = id.toUpperCase();
  if (!idUpper.startsWith(prefixUpper)) return 0;
  const numericPart = idUpper.slice(prefixUpper.length);
  return parseInt(numericPart, 10) || 0;
}

/**
 * Query MAX counter from database table
 * @param table - PostgreSQL table name
 * @param field - Field name (systemId or id)
 * @param prefix - ID prefix to filter and extract counter
 * @param tx - Optional transaction client
 */
async function queryMaxCounter(
  table: string,
  field: string,
  prefix: string,
  tx?: TransactionClient
): Promise<number> {
  const prefixLen = prefix.length + 1; // +1 for PostgreSQL 1-based SUBSTRING
  const client = tx || prisma;
  
  try {
    const result = await client.$queryRawUnsafe<{ max_num: number | null }[]>(
      `SELECT COALESCE(MAX(CAST(SUBSTRING("${field}" FROM ${prefixLen}) AS INTEGER)), 0) as max_num 
       FROM "${table}"
       WHERE "${field}" LIKE $1`,
      prefix + '%'
    );
    return result[0]?.max_num ?? 0;
  } catch (_error) {
    // Table might not exist yet or be empty - that's OK
    console.log(`[ID-SYSTEM] Could not query MAX from ${table}.${field}, starting from 0`);
    return 0;
  }
}

/**
 * Generate next IDs by querying MAX from database (RECOMMENDED)
 * 
 * Logic:
 * - systemId: Query MAX(systemId) from table + 1
 * - businessId: If user provides custom → use it, else query MAX(id) from table + 1
 * 
 * This ensures IDs are always sequential even when user provides custom businessId
 * 
 * @param entityType - Entity type from ID_CONFIG
 * @param customBusinessId - Optional custom business ID (user input)
 * @returns Generated systemId and businessId
 * 
 * @example
 * const { systemId, businessId } = await generateNextIds('employees');
 * // systemId: "EMP000001", businessId: "NV000001"
 * 
 * @example
 * const { systemId, businessId } = await generateNextIds('employees', 'NV-CUSTOM-001');
 * // systemId: "EMP000001", businessId: "NVCUSTOM001"
 */
export async function generateNextIds(
  entityType: EntityType,
  customBusinessId?: string
): Promise<GeneratedIds> {
  const config = getConfig(entityType);
  const tableInfo = ENTITY_TABLE_MAP[entityType];
  
  // Get next systemId counter from DB
  let nextSystemCounter = 1;
  if (tableInfo) {
    const maxSystemCounter = await queryMaxCounter(
      tableInfo.table,
      tableInfo.systemIdField,
      config.systemIdPrefix
    );
    nextSystemCounter = maxSystemCounter + 1;
  }
  
  const systemId = asSystemId(formatId(config.systemIdPrefix, nextSystemCounter, config.digitCount));
  
  // Handle businessId
  let businessId: BusinessId;
  if (customBusinessId && config.allowCustomId) {
    // User provided custom businessId
    const sanitized = sanitizeBusinessId(customBusinessId);
    if (sanitized) {
      businessId = asBusinessId(sanitized);
    } else {
      // Invalid custom ID - auto-generate
      let nextBizCounter = 1;
      if (tableInfo) {
        const maxBizCounter = await queryMaxCounter(
          tableInfo.table,
          tableInfo.businessIdField,
          config.prefix
        );
        nextBizCounter = maxBizCounter + 1;
      }
      businessId = asBusinessId(formatId(config.prefix, nextBizCounter, config.digitCount));
    }
  } else {
    // Auto-generate businessId from MAX in DB
    let nextBizCounter = 1;
    if (tableInfo) {
      const maxBizCounter = await queryMaxCounter(
        tableInfo.table,
        tableInfo.businessIdField,
        config.prefix
      );
      nextBizCounter = maxBizCounter + 1;
    }
    businessId = asBusinessId(formatId(config.prefix, nextBizCounter, config.digitCount));
  }

  return {
    systemId,
    businessId,
    counter: nextSystemCounter,
  };
}

// Type for Prisma transaction client
type TransactionClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

/**
 * Generate next IDs within a Prisma transaction (ATOMIC)
 * Use this version when you need to generate IDs inside a transaction
 * 
 * Logic:
 * - systemId: Query MAX(systemId) from table + 1
 * - businessId: If user provides custom → use it, else query MAX(id) from table + 1
 * 
 * @param tx - Prisma transaction client
 * @param entityType - Entity type from ID_CONFIG
 * @param customBusinessId - Optional custom business ID (user input)
 * @returns Generated systemId and businessId
 * 
 * @example
 * await prisma.$transaction(async (tx) => {
 *   const { systemId, businessId } = await generateNextIdsWithTx(tx, 'orders');
 *   // Use IDs in transaction...
 * });
 */
export async function generateNextIdsWithTx(
  tx: TransactionClient,
  entityType: EntityType,
  customBusinessId?: string
): Promise<GeneratedIds> {
  const config = getConfig(entityType);
  const tableInfo = ENTITY_TABLE_MAP[entityType];
  
  // Get next systemId counter from DB (within transaction)
  let nextSystemCounter = 1;
  if (tableInfo) {
    const maxSystemCounter = await queryMaxCounter(
      tableInfo.table,
      tableInfo.systemIdField,
      config.systemIdPrefix,
      tx
    );
    nextSystemCounter = maxSystemCounter + 1;
  }
  
  const systemId = asSystemId(formatId(config.systemIdPrefix, nextSystemCounter, config.digitCount));
  
  // Handle businessId
  let businessId: BusinessId;
  if (customBusinessId && config.allowCustomId) {
    // User provided custom businessId
    const sanitized = sanitizeBusinessId(customBusinessId);
    if (sanitized) {
      businessId = asBusinessId(sanitized);
    } else {
      // Invalid custom ID - auto-generate
      let nextBizCounter = 1;
      if (tableInfo) {
        const maxBizCounter = await queryMaxCounter(
          tableInfo.table,
          tableInfo.businessIdField,
          config.prefix,
          tx
        );
        nextBizCounter = maxBizCounter + 1;
      }
      businessId = asBusinessId(formatId(config.prefix, nextBizCounter, config.digitCount));
    }
  } else {
    // Auto-generate businessId from MAX in DB
    let nextBizCounter = 1;
    if (tableInfo) {
      const maxBizCounter = await queryMaxCounter(
        tableInfo.table,
        tableInfo.businessIdField,
        config.prefix,
        tx
      );
      nextBizCounter = maxBizCounter + 1;
    }
    businessId = asBusinessId(formatId(config.prefix, nextBizCounter, config.digitCount));
  }

  return {
    systemId,
    businessId,
    counter: nextSystemCounter,
  };
}

/**
 * Get current MAX counter from database for an entity
 */
export async function getCurrentCounter(entityType: EntityType): Promise<number> {
  const config = getConfig(entityType);
  const tableInfo = ENTITY_TABLE_MAP[entityType];
  
  if (!tableInfo) return 0;
  
  return await queryMaxCounter(
    tableInfo.table,
    tableInfo.systemIdField,
    config.systemIdPrefix
  );
}

/**
 * Preview next IDs (without creating record)
 */
export async function previewNextIds(entityType: EntityType): Promise<{
  nextSystemId: string;
  nextBusinessId: string;
  currentCounter: number;
}> {
  const config = getConfig(entityType);
  const tableInfo = ENTITY_TABLE_MAP[entityType];
  
  let maxSystemCounter = 0;
  let maxBizCounter = 0;
  
  if (tableInfo) {
    maxSystemCounter = await queryMaxCounter(
      tableInfo.table,
      tableInfo.systemIdField,
      config.systemIdPrefix
    );
    maxBizCounter = await queryMaxCounter(
      tableInfo.table,
      tableInfo.businessIdField,
      config.prefix
    );
  }
  
  return {
    nextSystemId: formatId(config.systemIdPrefix, maxSystemCounter + 1, config.digitCount),
    nextBusinessId: formatId(config.prefix, maxBizCounter + 1, config.digitCount),
    currentCounter: maxSystemCounter,
  };
}

/**
 * Reset counter for an entity (USE WITH CAUTION!)
 */
export async function resetCounter(entityType: EntityType, newValue: number = 0): Promise<void> {
  const config = getConfig(entityType);
  
  await prisma.idCounter.upsert({
    where: { entityType },
    update: { currentValue: newValue },
    create: {
      entityType,
      prefix: config.prefix,
      systemPrefix: config.systemIdPrefix,
      businessPrefix: config.prefix,
      currentValue: newValue,
      padding: config.digitCount,
    },
  });
}

/**
 * Batch generate IDs for multiple items
 */
export async function generateBatchIds(
  entityType: EntityType,
  count: number
): Promise<GeneratedIds[]> {
  const config = getConfig(entityType);
  const results: GeneratedIds[] = [];
  
  // Get current counter and reserve range atomically
  const counter = await prisma.idCounter.upsert({
    where: { entityType },
    update: { currentValue: { increment: count } },
    create: {
      entityType,
      prefix: config.prefix,
      systemPrefix: config.systemIdPrefix,
      businessPrefix: config.prefix,
      currentValue: count,
      padding: config.digitCount,
    },
  });
  
  // Generate IDs for the reserved range
  const startCounter = counter.currentValue - count + 1;
  for (let i = 0; i < count; i++) {
    const currentCounter = startCounter + i;
    results.push({
      systemId: asSystemId(formatId(config.systemIdPrefix, currentCounter, config.digitCount)),
      businessId: asBusinessId(formatId(config.prefix, currentCounter, config.digitCount)),
      counter: currentCounter,
    });
  }
  
  return results;
}

// ========================================
// HELPER EXPORTS
// ========================================

/**
 * Get all entity types
 */
export function getAllEntityTypes(): EntityType[] {
  return Object.keys(ID_CONFIG) as EntityType[];
}

/**
 * Get entities by category
 */
export function getEntitiesByCategory(category: EntityConfig['category']): EntityType[] {
  return Object.entries(ID_CONFIG)
    .filter(([, config]) => config.category === category)
    .map(([type]) => type as EntityType);
}

/**
 * Category display labels
 */
export const CATEGORY_LABELS: Record<EntityConfig['category'], string> = {
  hr: 'Nhân sự & Tổ chức',
  finance: 'Tài chính',
  inventory: 'Kho hàng',
  sales: 'Bán hàng',
  purchasing: 'Mua hàng',
  service: 'Dịch vụ khách hàng',
  settings: 'Cài đặt',
  system: 'Hệ thống',
};

// ========================================
// BACKWARD COMPATIBILITY EXPORTS
// ========================================

// Re-exports for backward compatibility with old imports
export { asSystemId as createSystemId };
export { asBusinessId as createBusinessId };

// Backward compatibility type aliases
export type EntityIDConfig = EntityConfig;

// Backward compatibility function aliases
export const getEntityConfig = getConfig;

// Validation functions
export function isSystemIdFormat(id: string): boolean {
  // SystemId: 8 digits (e.g., EMP00000001)
  return /^[A-Z]+\d{8}$/.test(id);
}

export function isBusinessIdFormat(id: string): boolean {
  // Business ID: shorter, variable length (e.g., NV001, PT000001)
  return /^[A-Z]+\d{3,6}$/.test(id);
}

export function ensureSystemId(id: string, _context?: string): SystemId {
  if (!isSystemIdFormat(id)) {
    // Warning: Invalid format, but proceed anyway for legacy compatibility
  }
  return asSystemId(id);
}

export function ensureBusinessId(id: string, _context?: string): BusinessId {
  if (!isBusinessIdFormat(id)) {
    // Warning: Invalid format, but proceed anyway for legacy compatibility
  }
  return asBusinessId(id);
}

/**
 * Generate SystemId (for legacy compatibility with id-utils)
 * @param entityType - Entity type from ID_CONFIG
 * @param counter - Current counter value
 * @returns SystemId string
 */
export function generateSystemId(entityType: EntityType, counter: number): string {
  const config = getConfig(entityType);
  return formatId(config.systemIdPrefix, counter, config.digitCount);
}

/**
 * Generate BusinessId (for legacy compatibility with id-utils)
 * @param entityType - Entity type from ID_CONFIG
 * @param counter - Current counter value
 * @param customId - Optional custom ID from user input
 * @returns BusinessId string
 */
export function generateBusinessId(
  entityType: EntityType, 
  counter: number,
  customId?: string
): string {
  if (customId?.trim()) {
    const sanitized = sanitizeBusinessId(customId);
    if (!sanitized) {
      throw new Error('Ma khong hop le! Chi duoc phep su dung chu cai va so.');
    }
    return sanitized;
  }
  const config = getConfig(entityType);
  return formatId(config.prefix, counter, config.digitCount);
}

/**
 * Extract counter from system ID
 */
export function extractCounterFromSystemId(systemId: string, prefix: string): number {
  if (!systemId || typeof systemId !== 'string') return 0;
  
  const regex8 = new RegExp(`^${prefix}(\\d{8})$`);
  const regex7 = new RegExp(`^${prefix}(\\d{7})$`);
  const regex6 = new RegExp(`^${prefix}(\\d{6})$`);
  
  const match8 = systemId.match(regex8);
  if (match8) return parseInt(match8[1], 10);
  
  const match7 = systemId.match(regex7);
  if (match7) return parseInt(match7[1], 10);
  
  const match6 = systemId.match(regex6);
  if (match6) return parseInt(match6[1], 10);
  
  return 0;
}

/**
 * Extract counter from business ID
 */
export function extractCounterFromBusinessId(businessId: string, prefix: string): number {
  if (!businessId || typeof businessId !== 'string') return 0;
  const regex = new RegExp(`^${prefix}(\\d+)$`);
  const match = businessId.match(regex);
  return match ? parseInt(match[1], 10) : 0;
}

// ========================================
// CLIENT-SIDE ID GENERATION (Legacy - for store-factory)
// ========================================

/**
 * Generate a system ID string from entity type and counter (CLIENT-SAFE)
 * @deprecated Use generateNextIds() from server for production
 */
export function generateSystemIdClient(entityType: EntityType, counter: number): string {
  const config = getConfig(entityType);
  return formatId(config.systemIdPrefix, counter, config.digitCount);
}

/**
 * Generate a business ID string from entity type and counter (CLIENT-SAFE)
 * @deprecated Use generateNextIds() from server for production
 */
export function generateBusinessIdClient(entityType: EntityType, counter: number): string {
  const config = getConfig(entityType);
  return formatId(config.prefix, counter, config.digitCount);
}

/**
 * Find next available business ID (avoiding conflicts)
 * @deprecated Should use database-backed generation
 */
export function findNextAvailableBusinessId(
  prefix: string, 
  existingIds: string[], 
  startingCounter: number,
  digitCount: number = 6
): { nextId: string; updatedCounter: number } {
  let counter = startingCounter;
  let nextId = formatId(prefix, counter + 1, digitCount);
  
  // Find next available (skip existing)
  const normalizedExisting = new Set(existingIds.map(id => id?.toUpperCase()));
  while (normalizedExisting.has(nextId.toUpperCase())) {
    counter++;
    nextId = formatId(prefix, counter + 1, digitCount);
  }
  
  return { nextId, updatedCounter: counter + 1 };
}

/**
 * Extract counter value from ID string
 */
export function extractCounter(id: string, prefix: string): number {
  if (!id || !prefix) return 0;
  const normalized = id.toUpperCase();
  const prefixUpper = prefix.toUpperCase();
  
  if (!normalized.startsWith(prefixUpper)) return 0;
  const numericPart = normalized.slice(prefixUpper.length);
  return parseInt(numericPart, 10) || 0;
}

/**
 * Get max system ID counter from items
 */
export function getMaxSystemIdCounter<T extends { systemId?: string }>(
  items: T[], 
  systemIdPrefix: string
): number {
  let maxCounter = 0;
  for (const item of items) {
    if (item.systemId) {
      const counter = extractCounter(item.systemId, systemIdPrefix);
      if (counter > maxCounter) maxCounter = counter;
    }
  }
  return maxCounter;
}

/**
 * Get max business ID counter from items
 */
export function getMaxBusinessIdCounter<T extends { id?: string }>(
  items: T[], 
  businessPrefix: string
): number {
  let maxCounter = 0;
  for (const item of items) {
    if (item.id) {
      const counter = extractCounter(item.id, businessPrefix);
      if (counter > maxCounter) maxCounter = counter;
    }
  }
  return maxCounter;
}
