/**
 * 🍞 BREADCRUMB AUTO-GENERATION SYSTEM
 * 
 * Automatically generates breadcrumbs from route metadata + entity data
 * 
 * Features:
 * - Auto-lookup entity name from systemId
 * - Falls back to route metadata if entity not found
 * - Type-safe with SystemId branded types
 * - Supports all entity types from id-config.ts
 * 
 * @example
 * ```typescript
 * // Route: /receipts/VOUCHER00000123
 * const crumbs = generateBreadcrumb(location.pathname);
 * // Result: ['Phiếu thu/chi', 'PT000051']
 * ```
 * 
 * @version 1.0.0
 * @date 2025-11-11
 */

import { type EntityType, getEntityConfig } from './id-config';
import { type SystemId } from './id-config';

// Store registry - lazy loaded to avoid circular dependencies
type StoreGetter<T> = () => { data: T[] };

interface StoreRegistry {
  [key: string]: StoreGetter<any>;
}

let storeRegistry: StoreRegistry = {};

/**
 * Register a store for breadcrumb lookup
 * Call this in store files to enable auto breadcrumb
 */
export function registerBreadcrumbStore<T extends { systemId: string; id?: string; name?: string }>(
  entityType: EntityType,
  getStore: StoreGetter<T>
) {
  storeRegistry[entityType] = getStore;
}

/**
 * Find entity by systemId and return display name
 */
function findEntityDisplayName(entityType: EntityType, systemId: string): string | null {
  const getStore = storeRegistry[entityType];
  if (!getStore) return null;

  try {
    const store = getStore();
    const item = store.data.find((d: any) => d.systemId === systemId);
    
    if (!item) return null;

    // Priority: name > title > id (business ID) > systemId
    return item.name || item.title || item.id || systemId;
  } catch (error) {
    console.warn(`[Breadcrumb] Failed to lookup ${entityType}:`, error);
    return null;
  }
}

/**
 * Parse route path and extract entity info
 */
interface RouteEntityInfo {
  entityType: EntityType | null;
  systemId: string | null;
  displayName: string | null;
}

function parseRouteEntity(pathname: string): RouteEntityInfo {
  // Pattern: /{entity-type}/{systemId}
  const match = pathname.match(/^\/([^/]+)\/([^/]+)$/);
  
  if (!match) {
    return { entityType: null, systemId: null, displayName: null };
  }

  const [, routeType, id] = match;
  
  // Map route type to entity type
  const routeToEntityMap: Record<string, EntityType> = {
    'receipts': 'vouchers' as EntityType,
    'payments': 'vouchers' as EntityType,
    'employees': 'employees',
    'customers': 'customers',
    'products': 'products',
    'orders': 'orders',
    'suppliers': 'suppliers',
    'complaints': 'complaints',
    'warranty': 'warranty',
    'purchase-orders': 'purchase-orders',
    'sales-returns': 'sales-returns',
    'purchase-returns': 'purchase-returns',
    'inventory-checks': 'inventory-checks',
  };

  const entityType = routeToEntityMap[routeType] || null;
  
  if (!entityType) {
    return { entityType: null, systemId: id, displayName: null };
  }

  // Lookup display name
  const displayName = findEntityDisplayName(entityType, id);
  
  return { entityType, systemId: id, displayName };
}

/**
 * Generate breadcrumb trail from pathname
 * 
 * @param pathname - Current route pathname
 * @param routeMeta - Optional route metadata with static breadcrumb
 * @returns Array of breadcrumb labels
 */
export function generateBreadcrumb(
  pathname: string,
  routeMeta?: { breadcrumb?: string[] }
): string[] {
  // If route has static breadcrumb metadata, use it as base
  const baseCrumbs = routeMeta?.breadcrumb || [];
  
  // Try to enhance with entity data
  const entityInfo = parseRouteEntity(pathname);
  
  if (entityInfo.displayName) {
    // Replace last breadcrumb with entity display name
    return [...baseCrumbs.slice(0, -1), entityInfo.displayName];
  }
  
  // Fallback to route metadata
  return baseCrumbs;
}

/**
 * Generate breadcrumb for detail page
 * 
 * @example
 * ```typescript
 * // In voucher detail page
 * const crumbs = generateDetailBreadcrumb('vouchers', voucher.systemId, 'Phiếu thu/chi');
 * // Result: ['Phiếu thu/chi', 'PT000051']
 * ```
 */
export function generateDetailBreadcrumb(
  entityType: EntityType,
  systemId: string,
  listPageLabel: string
): string[] {
  const displayName = findEntityDisplayName(entityType, systemId);
  return [listPageLabel, displayName || systemId];
}

/**
 * Generate breadcrumb for form page (create/edit)
 * 
 * @example
 * ```typescript
 * const crumbs = generateFormBreadcrumb('employees', employeeSystemId, 'Nhân viên');
 * // Create: ['Nhân viên', 'Thêm mới']
 * // Edit: ['Nhân viên', 'NV000001']
 * ```
 */
export function generateFormBreadcrumb(
  entityType: EntityType,
  systemId: string | null | undefined,
  listPageLabel: string
): string[] {
  if (!systemId) {
    return [listPageLabel, 'Thêm mới'];
  }
  
  const displayName = findEntityDisplayName(entityType, systemId);
  return [listPageLabel, displayName || 'Chỉnh sửa'];
}

/**
 * Hook for breadcrumb in React components
 * 
 * @example
 * ```typescript
 * function EmployeeDetailPage() {
 *   const { systemId } = useParams();
 *   const crumbs = useBreadcrumb('employees', systemId, 'Nhân viên');
 *   usePageHeader({ breadcrumb: crumbs });
 * }
 * ```
 */
export function useBreadcrumb(
  entityType: EntityType,
  systemId: string | null | undefined,
  listPageLabel: string
): string[] {
  if (!systemId) {
    return [listPageLabel, 'Thêm mới'];
  }
  
  return generateDetailBreadcrumb(entityType, systemId, listPageLabel);
}

/**
 * Get entity config for breadcrumb display
 */
export function getEntityDisplayInfo(entityType: EntityType) {
  try {
    const config = getEntityConfig(entityType);
    return {
      displayName: config.displayName,
      prefix: config.prefix,
      category: config.category,
    };
  } catch {
    return null;
  }
}

/**
 * Clear store registry (for testing)
 */
export function clearBreadcrumbStores() {
  storeRegistry = {};
}

/**
 * Get all registered stores (for debugging)
 */
export function getRegisteredStores(): string[] {
  return Object.keys(storeRegistry);
}
