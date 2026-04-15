import type { Product, ProductStatus, ProductType } from '@/lib/types/prisma-extended';

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
  brandFilter: string;
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

export async function fetchProductsPage(params: ProductQueryParams): Promise<ProductQueryResult> {
  const { pageIndex, pageSize } = params.pagination;
  const { search, statusFilter, typeFilter, categoryFilter, pkgxFilter, stockLevelFilter, sorting } = params;
  
  // Build query params for server-side filtering
  const queryParams = new URLSearchParams({
    page: String(pageIndex + 1), // API uses 1-based page
    limit: String(pageSize),
    sortBy: sorting.id,
    sortOrder: sorting.desc ? 'desc' : 'asc',
  });

  // Add filters to server query
  if (search?.trim()) {
    queryParams.set('search', search.trim());
  }
  if (statusFilter && statusFilter !== 'all') {
    queryParams.set('status', statusFilter);
  }
  if (typeFilter && typeFilter !== 'all') {
    queryParams.set('type', typeFilter);
  }
  if (categoryFilter && categoryFilter !== 'all') {
    queryParams.set('categoryId', categoryFilter);
  }
  if (params.brandFilter && params.brandFilter !== 'all') {
    queryParams.set('brandId', params.brandFilter);
  }
  if (pkgxFilter && pkgxFilter !== 'all') {
    queryParams.set('pkgxFilter', pkgxFilter);
  }
  if (stockLevelFilter && stockLevelFilter !== 'all') {
    queryParams.set('stockFilter', stockLevelFilter);
  }
  if (params.comboFilter && params.comboFilter !== 'all') {
    queryParams.set('comboFilter', params.comboFilter);
  }
  if (params.dateRange?.[0]) {
    queryParams.set('dateFrom', params.dateRange[0]);
  }
  if (params.dateRange?.[1]) {
    queryParams.set('dateTo', params.dateRange[1]);
  }

  // Use optimized list endpoint
  const response = await fetch(`/api/products/list?${queryParams}`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  const result = await response.json();
  
  // API returns: { data: Product[], pagination: { page, limit, total, totalPages } }
  const data = result.data || [];
  const pagination = result.pagination || { total: 0, totalPages: 1 };

  return {
    items: data,
    total: pagination.total,
    pageCount: Math.max(1, pagination.totalPages),
    pageIndex,
  };
}


