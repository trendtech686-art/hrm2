import type { Product } from './types';
import type { SystemId } from '@/lib/id-types';

export const INVENTORY_FIELD_PREFIXES = ['inventory', 'tonkho', 'stock'] as const;
export const FALLBACK_INVENTORY_KEYS = ['inventory', 'tonkho', 'stock', 'qty', 'quantity', 'soluong', 'tongton', 'totalsoluong'] as const;

export type BranchInventoryIdentifier = {
  systemId: SystemId;
  identifiers: Set<string>;
};

export interface ProductImportOptions {
  branchIdentifiers: BranchInventoryIdentifier[];
  defaultBranchSystemId: SystemId | null;
  currentEmployeeSystemId: SystemId;
}

export function normalizeFieldKey(value?: string | number | null) {
  if (value === undefined || value === null) return '';
  return value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function buildNormalizedRowKeyMap(row: Record<string, any>) {
  return Object.keys(row).reduce<Record<string, string>>((acc, key) => {
    const normalizedKey = normalizeFieldKey(key);
    if (normalizedKey && !(normalizedKey in acc)) {
      acc[normalizedKey] = key;
    }
    return acc;
  }, {});
}

function parseNumericValue(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  if (typeof value === 'string') {
    const sanitized = value.replace(/\s+/g, '').replace(/,/g, '').replace(/[^0-9.-]/g, '');
    if (!sanitized) return null;
    const parsed = Number(sanitized);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
}

function findMatchingKeyForIdentifier(normalizedRowKeyMap: Record<string, string>, identifier: string) {
  if (!identifier) return null;
  if (normalizedRowKeyMap[identifier]) {
    return normalizedRowKeyMap[identifier];
  }

  for (const prefix of INVENTORY_FIELD_PREFIXES) {
    const prefixed = normalizedRowKeyMap[`${prefix}${identifier}`];
    if (prefixed) return prefixed;
  }

  const fallback = Object.entries(normalizedRowKeyMap).find(([normalizedKey]) =>
    normalizedKey.endsWith(identifier) || normalizedKey.startsWith(identifier)
  );
  return fallback?.[1] ?? null;
}

function getBranchInventoryValue(
  row: Record<string, any>,
  normalizedRowKeyMap: Record<string, string>,
  identifiers: Set<string>,
) {
  for (const identifier of identifiers) {
    const originalKey = findMatchingKeyForIdentifier(normalizedRowKeyMap, identifier);
    if (originalKey) {
      const parsed = parseNumericValue(row[originalKey]);
      if (parsed !== null) {
        return parsed;
      }
    }
  }
  return 0;
}

function getFallbackInventoryValue(
  row: Record<string, any>,
  normalizedRowKeyMap: Record<string, string>,
) {
  for (const key of FALLBACK_INVENTORY_KEYS) {
    const originalKey = normalizedRowKeyMap[key];
    if (!originalKey) continue;
    const parsed = parseNumericValue(row[originalKey]);
    if (parsed !== null) {
      return parsed;
    }
  }
  return null;
}

export function transformImportedRows(rows: any[], options: ProductImportOptions) {
  return rows.map((item: any, index: number) => {
    if (!item.name) {
      throw new Error(`Dòng ${index + 1} thiếu tên sản phẩm`);
    }

    const normalizedRowKeyMap = buildNormalizedRowKeyMap(item);
    const inventoryByBranch: Record<string, number> = {};

    options.branchIdentifiers.forEach(({ systemId, identifiers }) => {
      inventoryByBranch[systemId] = getBranchInventoryValue(item, normalizedRowKeyMap, identifiers);
    });

    const totalBranchInventory = Object.values(inventoryByBranch).reduce((sum, qty) => sum + (Number(qty) || 0), 0);
    const fallbackInventory = getFallbackInventoryValue(item, normalizedRowKeyMap);

    if (fallbackInventory !== null && totalBranchInventory === 0 && options.defaultBranchSystemId) {
      inventoryByBranch[options.defaultBranchSystemId] = fallbackInventory;
    }

    return {
      id: item.id || item.sku || '',
      name: item.name,
      sku: item.sku || '',
      type: item.type || 'physical',
      status: item.status || 'active',
      unit: item.unit || '',
      defaultPrice: Number(item.defaultPrice) || 0,
      costPrice: Number(item.costPrice) || 0,
      inventory: Number(item.inventory) || 0,
      inventoryByBranch,
      committedByBranch: {},
      inTransitByBranch: {},
      inventoryWarning: Number(item.inventoryWarning) || 0,
      categorySystemId: item.categorySystemId || '',
      description: item.description || '',
      prices: {},
      isDeleted: false,
      createdAt: new Date().toISOString(),
      createdBy: options.currentEmployeeSystemId,
      updatedAt: new Date().toISOString(),
      updatedBy: options.currentEmployeeSystemId,
    } as Omit<Product, 'systemId'>;
  });
}
