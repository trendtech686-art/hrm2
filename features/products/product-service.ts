import Fuse from 'fuse.js';
import type { IFuseOptions } from 'fuse.js';
import { isDateAfter, isDateBefore } from '../../lib/date-utils';
import type { Product, ProductStatus, ProductType } from '@/lib/types/prisma-extended';
import { useProductStore } from './store';

export type ProductSortKey = 'name' | 'id' | 'createdAt' | 'status' | 'type';

export const DEFAULT_PRODUCT_SORT: { id: ProductSortKey; desc: boolean } = {
  id: 'createdAt',
  desc: true,
};

export interface ProductQueryParams {
  search: string;
  statusFilter: ProductStatus | 'all';
  typeFilter: ProductType | 'all';
  categoryFilter: string;
  comboFilter: 'all' | 'combo' | 'non-combo';
  stockLevelFilter: 'all' | 'out-of-stock' | 'low-stock' | 'below-safety' | 'high-stock';
  pkgxFilter: 'all' | 'linked' | 'not-linked';
  dateRange?: [string | undefined, string | undefined] | undefined;
  pagination: { pageIndex: number; pageSize: number };
  sorting: { id: ProductSortKey; desc: boolean };
}

export interface ProductQueryResult {
  items: Product[];
  total: number;
  pageCount: number;
  pageIndex: number;
}

interface PipelineResult {
  filtered: Product[];
}

const fuseOptions: IFuseOptions<Product> = {
  keys: ['name', 'id', 'barcode', 'tags'],
  threshold: 0.3,
};

// ========================================
// Cached Fuse index for better performance
// ========================================
let cachedFuseIndex: Fuse<Product> | null = null;
let cachedProductsLength = 0;
let cachedProductsHash = '';

function getProductsHash(products: Product[]): string {
  // Simple hash based on first/last product IDs and length
  if (products.length === 0) return 'empty';
  return `${products.length}-${products[0]?.systemId}-${products[products.length - 1]?.systemId}`;
}

function getFuseIndex(products: Product[]): Fuse<Product> {
  const hash = getProductsHash(products);
  if (cachedFuseIndex && cachedProductsHash === hash) {
    return cachedFuseIndex;
  }
  // Rebuild index only when products change
  cachedFuseIndex = new Fuse(products, fuseOptions);
  cachedProductsHash = hash;
  cachedProductsLength = products.length;
  return cachedFuseIndex;
}

// Export for manual cache invalidation (e.g., after adding/deleting products)
export function invalidateFuseCache() {
  cachedFuseIndex = null;
  cachedProductsHash = '';
  cachedProductsLength = 0;
}

function applyFilters(products: Product[], params: ProductQueryParams): PipelineResult {
  const { search, statusFilter, typeFilter, categoryFilter, comboFilter, stockLevelFilter, pkgxFilter, dateRange, sorting } = params;

  let dataset = products.filter((product) => !product.isDeleted);

  if (statusFilter !== 'all') {
    dataset = dataset.filter((product) => product.status === statusFilter);
  }

  if (typeFilter !== 'all') {
    dataset = dataset.filter((product) => product.type === typeFilter);
  }

  if (categoryFilter !== 'all') {
    dataset = dataset.filter((product) => product.categorySystemId === categoryFilter);
  }

  // Combo filter
  if (comboFilter === 'combo') {
    dataset = dataset.filter((product) => product.type === 'combo');
  } else if (comboFilter === 'non-combo') {
    dataset = dataset.filter((product) => product.type !== 'combo');
  }

  // Stock level filter
  if (stockLevelFilter !== 'all') {
    dataset = dataset.filter((product) => {
      // Calculate total inventory across all branches
      const totalInventory = Object.values(product.inventoryByBranch || {}).reduce((sum, qty) => sum + qty, 0);
      
      switch (stockLevelFilter) {
        case 'out-of-stock':
          return totalInventory <= 0;
        case 'low-stock':
          // Low stock: above 0 but at or below reorder level
          return totalInventory > 0 && product.reorderLevel !== undefined && totalInventory <= product.reorderLevel;
        case 'below-safety':
          // Below safety stock
          return product.safetyStock !== undefined && totalInventory < product.safetyStock;
        case 'high-stock':
          // High stock: above max stock level
          return product.maxStock !== undefined && totalInventory > product.maxStock;
        default:
          return true;
      }
    });
  }

  // PKGX link filter
  if (pkgxFilter === 'linked') {
    dataset = dataset.filter((product) => !!product.pkgxId);
  } else if (pkgxFilter === 'not-linked') {
    dataset = dataset.filter((product) => !product.pkgxId);
  }

  if (dateRange && (dateRange[0] || dateRange[1])) {
    dataset = dataset.filter((product) => {
      if (!product.createdAt) return false;
      const createdDate = new Date(product.createdAt);
      const fromDate = dateRange[0] ? new Date(dateRange[0]) : null;
      const toDate = dateRange[1] ? new Date(dateRange[1]) : null;
      if (fromDate && isDateBefore(createdDate, fromDate)) return false;
      if (toDate && isDateAfter(createdDate, toDate)) return false;
      return true;
    });
  }

  if (search.trim()) {
    // Use cached Fuse index for better performance
    const fuse = getFuseIndex(dataset);
    dataset = fuse.search(search.trim()).map((result) => result.item);
  }

  const sorted = [...dataset].sort((a, b) => {
    const valueA = getSortValue(a, sorting.id);
    const valueB = getSortValue(b, sorting.id);
    if (valueA < valueB) return sorting.desc ? 1 : -1;
    if (valueA > valueB) return sorting.desc ? -1 : 1;
    return 0;
  });

  return { filtered: sorted };
}

function getSortValue(product: Product, sorter: ProductSortKey): string | number {
  switch (sorter) {
    case 'createdAt':
      return product.createdAt ? new Date(product.createdAt).getTime() : 0;
    case 'status':
      return product.status ?? '';
    case 'type':
      return product.type ?? '';
    case 'id':
      return product.id ?? '';
    case 'name':
    default:
      return product.name ?? '';
  }
}

export async function fetchProductsPage(params: ProductQueryParams): Promise<ProductQueryResult> {
  const { data } = useProductStore.getState();
  const { filtered } = applyFilters(data, params);

  const { pageIndex, pageSize } = params.pagination;
  const start = pageIndex * pageSize;
  const end = start + pageSize;
  const pagedItems = filtered.slice(start, end);

  // Small delay to simulate async behavior and prevent UI blocking
  await new Promise((resolve) => setTimeout(resolve, 10));

  return {
    items: pagedItems,
    total: filtered.length,
    pageCount: Math.max(1, Math.ceil(filtered.length / pageSize)),
    pageIndex,
  };
}

/**
 * Synchronous version for React Query initialData
 * Returns data immediately from store without any delay
 */
export function getInitialProductsPage(params: ProductQueryParams): ProductQueryResult {
  const { data } = useProductStore.getState();
  const { filtered } = applyFilters(data, params);

  const { pageIndex, pageSize } = params.pagination;
  const start = pageIndex * pageSize;
  const end = start + pageSize;
  const pagedItems = filtered.slice(start, end);

  return {
    items: pagedItems,
    total: filtered.length,
    pageCount: Math.max(1, Math.ceil(filtered.length / pageSize)),
    pageIndex,
  };
}

export function getFilteredProductsSnapshot(params: ProductQueryParams): Product[] {
  const { data } = useProductStore.getState();
  const { filtered } = applyFilters(data, params);
  return filtered;
}
