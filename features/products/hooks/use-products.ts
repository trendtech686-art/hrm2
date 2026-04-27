/**
 * useProducts - React Query hooks for products
 * 
 * ⚠️ IMPORTANT: Direct import pattern
 * - Import this file directly: import { useProducts } from '@/features/products/hooks/use-products'
 * - NEVER import from '@/features/products' or '@/features/products/store'
 * 
 * Updated to use Server Actions for mutations (Phase 2 migration)
 */

import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import {
  fetchProducts,
  fetchProduct,
  fetchProductsByIds,
  searchProducts,
  fetchProductInventory,
  type ProductsParams,
  type PaginatedResponse,
} from '../api/products-api';
import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
  updateProductInventoryAction,
  type CreateProductInput,
  type UpdateProductInput,
} from '@/app/actions/products';
import type { Product } from '@/lib/types/prisma-extended';
import { invalidateRelated } from '@/lib/query-invalidation-map';

// Re-export types for backwards compatibility
export type { CreateProductInput, UpdateProductInput };

// Query keys - exported for invalidation
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: ProductsParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  byIds: (ids: string[]) => [...productKeys.all, 'byIds', ...ids.sort()] as const,
  search: (query: string) => [...productKeys.all, 'search', query] as const,
  inventory: (id: string) => [...productKeys.all, 'inventory', id] as const,
  stats: () => [...productKeys.all, 'stats'] as const,
  pageReferenceData: () => [...productKeys.all, 'page-reference-data'] as const,
  formReferenceData: () => [...productKeys.all, 'form-reference-data'] as const,
};

// Types for initial data from Server Components
export interface ProductStats {
  totalProducts: number;
  inStock: number;
  outOfStock: number;
  totalValue: number;
  deletedCount?: number;
  quantitySold: number;
  quantityReturned: number;
  netQuantitySold: number;
  orderCount: number;
  customerCount: number;
  revenue: number;
  returnValue: number;
}

/**
 * Hook for product statistics with optional initial data from Server Component
 */
export function useProductStats(initialData?: ProductStats) {
  return useQuery({
    queryKey: productKeys.stats(),
    queryFn: async () => {
      const res = await fetch('/api/products/stats');
      if (!res.ok) throw new Error('Failed to fetch stats');
      return res.json() as Promise<ProductStats>;
    },
    initialData,
    staleTime: initialData ? 60_000 : 0,
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * Batch-fetch products by their systemIds.
 * Fetches only the specified products in one request — NOT all products.
 * Returns a stable Map<systemId, Product> for O(1) lookup.
 *
 * @example
 * const ids = lineItems.map(li => li.productSystemId);
 * const { productsMap } = useProductsByIds(ids);
 * const product = productsMap.get(item.productSystemId);
 */
export function useProductsByIds(systemIds: string[]) {
  // Deduplicate and sort for stable query key
  const stableIds = useMemo(() => [...new Set(systemIds)].sort(), [systemIds]);

  const query = useQuery({
    queryKey: productKeys.byIds(stableIds),
    queryFn: () => fetchProductsByIds(stableIds),
    enabled: stableIds.length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  // ✅ FIX: Map by both systemId AND id (SKU) to handle legacy data
  // where productSystemId may contain SKU instead of actual systemId
  const productsMap = useMemo(() => {
    const map = new Map<string, Product>();
    for (const p of query.data ?? []) {
      map.set(p.systemId, p);
      // Also add by id (SKU) for legacy data lookup - compare as strings
      if (p.id && String(p.id) !== String(p.systemId)) {
        map.set(p.id, p);
      }
    }
    return map;
  }, [query.data]);

  return {
    productsMap,
    products: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

/**
 * Hook for fetching paginated products list
 * Supports initialData from Server Component for instant hydration
 * 
 * @example
 * ```tsx
 * function ProductsPage({ initialData }) {
 *   const [page, setPage] = useState(1);
 *   const { data, isLoading } = useProducts({ page, limit: 50 }, initialData);
 *   
 *   return (
 *     <DataTable 
 *       data={data?.data || []} 
 *       pagination={data?.pagination}
 *       onPageChange={setPage}
 *     />
 *   );
 * }
 * ```
 */
export function useProducts(
  params: ProductsParams & { enabled?: boolean } = {},
  initialData?: PaginatedResponse<Product>
) {
  const { enabled = true, ...queryParams } = params;
  return useQuery({
    queryKey: productKeys.list(queryParams),
    queryFn: () => fetchProducts(queryParams),
    initialData,
    staleTime: initialData ? 60_000 : 30_000,
    gcTime: 10 * 60 * 1000, // 10 minutes
    placeholderData: keepPreviousData,
    enabled,
  });
}

/**
 * Hook for fetching single product by ID
 */
export function useProduct(id: string | null | undefined) {
  return useQuery({
    queryKey: productKeys.detail(id!),
    queryFn: () => fetchProduct(id!),
    enabled: !!id,
    staleTime: 60_000,
    gcTime: 10 * 60 * 1000,
    // ✅ Always refetch on mount to ensure fresh data (inventory changes)
    refetchOnMount: 'always',
  });
}

/**
 * Hook for searching products (autocomplete)
 */
export function useProductSearch(query: string, limit = 20) {
  return useQuery({
    queryKey: productKeys.search(query),
    queryFn: () => searchProducts(query, limit),
    enabled: query.length >= 2,
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for infinite scroll pagination of products
 * Use for comboboxes that need to load more on scroll
 * 
 * @example
 * ```tsx
 * const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteProducts({ search: 'abc' });
 * const allProducts = data?.pages.flatMap(page => page.data) || [];
 * ```
 */
export function useInfiniteProducts(params: Omit<ProductsParams, 'page'> = {}) {
  const limit = params.limit || 30;
  return useInfiniteQuery({
    queryKey: [...productKeys.lists(), 'infinite', params],
    queryFn: ({ pageParam = 1 }) => fetchProducts({ ...params, page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 60_000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook for fetching product inventory
 */
export function useProductInventory(productId: string | null | undefined) {
  return useQuery({
    queryKey: productKeys.inventory(productId!),
    queryFn: () => fetchProductInventory(productId!),
    enabled: !!productId,
    staleTime: 30_000, // Inventory can change more frequently
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for product mutations (create/update/delete)
 */
interface UseProductMutationsOptions {
  onCreateSuccess?: (product: unknown) => void;
  onUpdateSuccess?: (product: unknown) => void;
  onDeleteSuccess?: () => void;
  onInventoryUpdateSuccess?: (result: InventoryUpdateResult) => void;
  onError?: (error: Error) => void;
  /** Skip cache invalidation on update — use for inline edits with optimistic updates */
  skipInvalidateOnUpdate?: boolean;
}

// Type for inventory update result from Server Action
type InventoryUpdateResult = NonNullable<Awaited<ReturnType<typeof updateProductInventoryAction>>['data']>;

export interface UpdateInventoryParams {
  productSystemId: string;
  branchSystemId: string;
  quantity: number;
  operation: 'set' | 'add' | 'subtract';
}

export function useProductMutations(options: UseProductMutationsOptions = {}) {
  const queryClient = useQueryClient();
  
  const create = useMutation({
    mutationFn: async (data: CreateProductInput) => {
      const result = await createProductAction(data);
      if (!result.success) throw new Error(result.error || 'Failed to create product');
      return result.data;
    },
    onSuccess: (data) => {
      invalidateRelated(queryClient, 'products');
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: async (data: UpdateProductInput) => {
      const result = await updateProductAction(data);
      if (!result.success) throw new Error(result.error || 'Failed to update product');
      return result.data;
    },
    onSuccess: (data) => {
      if (!options.skipInvalidateOnUpdate) {
        invalidateRelated(queryClient, 'products');
      }
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: async (systemId: string) => {
      const result = await deleteProductAction(systemId);
      if (!result.success) throw new Error(result.error || 'Failed to delete product');
      return result.data;
    },
    onMutate: async (systemId) => {
      // Optimistic remove from list queries
      await queryClient.cancelQueries({ queryKey: productKeys.lists() });
      const previousLists = queryClient.getQueriesData<PaginatedResponse<Product>>({ queryKey: productKeys.lists() });
      queryClient.setQueriesData<PaginatedResponse<Product>>(
        { queryKey: productKeys.lists() },
        (old) => old ? {
          ...old,
          data: old.data.filter(p => p.systemId !== systemId),
          pagination: { ...old.pagination, total: old.pagination.total - 1 },
        } : old
      );
      return { previousLists };
    },
    onSuccess: () => {
      options.onDeleteSuccess?.();
    },
    onError: (error, _systemId, context) => {
      // Rollback optimistic delete
      context?.previousLists?.forEach(([key, data]) => queryClient.setQueryData(key, data));
      options.onError?.(error);
    },
    onSettled: () => {
      invalidateRelated(queryClient, 'products');
    },
  });
  
  const updateInventory = useMutation({
    mutationFn: async (params: UpdateInventoryParams) => {
      const result = await updateProductInventoryAction(
        params.productSystemId,
        params.branchSystemId,
        params.quantity,
        params.operation
      );
      if (!result.success) throw new Error(result.error || 'Failed to update inventory');
      return result.data!;
    },
    onSuccess: (data) => {
      invalidateRelated(queryClient, 'products');
      options.onInventoryUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  return {
    create,
    update,
    remove,
    updateInventory,
    isCreating: create.isPending,
    isUpdating: update.isPending,
    isDeleting: remove.isPending,
    isUpdatingInventory: updateInventory.isPending,
    isMutating: create.isPending || update.isPending || remove.isPending || updateInventory.isPending,
  };
}

/**
 * Hook for getting products by category (for filtering)
 * Server-side filtered — returns products matching the category
 */
export function useProductsByCategory(categoryId: string | null | undefined) {
  const query = useQuery({
    queryKey: [...productKeys.lists(), { categoryId }],
    queryFn: async () => {
      const res = await fetchProducts({ categoryId: categoryId || undefined });
      return res.data;
    },
    enabled: !!categoryId,
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
  // Compat wrapper for .data?.data access
  return { ...query, data: query.data ? { data: query.data } : undefined };
}

/**
 * Hook for getting products by brand
 * Server-side filtered — returns products matching the brand
 */
export function useProductsByBrand(brandId: string | null | undefined) {
  const query = useQuery({
    queryKey: [...productKeys.lists(), { brandId }],
    queryFn: async () => {
      const res = await fetchProducts({ brandId: brandId || undefined });
      return res.data;
    },
    enabled: !!brandId,
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
  // Compat wrapper for .data?.data access
  return { ...query, data: query.data ? { data: query.data } : undefined };
}

/**
 * Hook for getting active products only
 */
export function useActiveProducts(params: Omit<ProductsParams, 'status'> = {}) {
  return useProducts({ ...params, status: 'active' });
}

// ============ TRASH HOOKS ============

import {
  fetchDeletedProducts,
  restoreProduct,
  permanentDeleteProduct,
} from '../api/products-api';

/**
 * Hook for fetching deleted products (trash)
 */
export function useDeletedProducts() {
  return useQuery({
    queryKey: [...productKeys.all, 'deleted'],
    queryFn: fetchDeletedProducts,
    staleTime: 30_000,
  });
}

/**
 * Hook for trash mutations (restore, permanent delete)
 */
export function useTrashMutations() {
  const queryClient = useQueryClient();
  
  const restore = useMutation({
    mutationFn: restoreProduct,
    onSuccess: () => {
      invalidateRelated(queryClient, 'products');
    },
  });
  
  const permanentDelete = useMutation({
    mutationFn: permanentDeleteProduct,
    onMutate: async (systemId) => {
      await queryClient.cancelQueries({ queryKey: [...productKeys.all, 'deleted'] });
      const previousDeleted = queryClient.getQueryData([...productKeys.all, 'deleted']);
      queryClient.setQueryData(
        [...productKeys.all, 'deleted'],
        (old: Array<{ systemId: string }> | undefined) => 
          old?.filter(item => item.systemId !== systemId) || []
      );
      return { previousDeleted };
    },
    onError: (_err, _systemId, context) => {
      if (context?.previousDeleted) {
        queryClient.setQueryData([...productKeys.all, 'deleted'], context.previousDeleted);
      }
    },
    onSettled: () => {
      invalidateRelated(queryClient, 'products');
    },
  });
  
  return {
    restore,
    permanentDelete,
    isRestoring: restore.isPending,
    isDeleting: permanentDelete.isPending,
  };
}

// ============ BULK HOOKS ============

import {
  bulkDeleteProducts,
  bulkRestoreProducts,
  bulkUpdateProductStatus,
} from '../api/products-api';

interface UseBulkProductMutationsOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useBulkProductMutations(options: UseBulkProductMutationsOptions = {}) {
  const queryClient = useQueryClient();

  const bulkDelete = useMutation({
    mutationFn: bulkDeleteProducts,
    onSuccess: () => {
      invalidateRelated(queryClient, 'products');
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const bulkRestore = useMutation({
    mutationFn: bulkRestoreProducts,
    onSuccess: () => {
      invalidateRelated(queryClient, 'products');
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const bulkUpdateStatus = useMutation({
    mutationFn: ({ systemIds, status }: { systemIds: string[]; status: string }) =>
      bulkUpdateProductStatus(systemIds, status),
    onSuccess: () => {
      invalidateRelated(queryClient, 'products');
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  return { bulkDelete, bulkRestore, bulkUpdateStatus };
}
