/**
 * useProducts - React Query hooks for products
 * 
 * ⚠️ IMPORTANT: Direct import pattern
 * - Import this file directly: import { useProducts } from '@/features/products/hooks/use-products'
 * - NEVER import from '@/features/products' or '@/features/products/store'
 * 
 * Updated to use Server Actions for mutations (Phase 2 migration)
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import {
  fetchProducts,
  fetchProduct,
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

// Re-export types for backwards compatibility
export type { CreateProductInput, UpdateProductInput };

// Query keys - exported for invalidation
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: ProductsParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  search: (query: string) => [...productKeys.all, 'search', query] as const,
  inventory: (id: string) => [...productKeys.all, 'inventory', id] as const,
  stats: () => [...productKeys.all, 'stats'] as const,
};

// Types for initial data from Server Components
export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  outOfStock: number;
  lowStock: number;
  totalValue: number;
  deletedCount?: number;
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
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.stats() });
      // Also invalidate PKGX-related queries when creating linked products
      if (data && 'pkgxId' in data && data.pkgxId) {
        queryClient.invalidateQueries({ queryKey: ['product-stats'] });
        queryClient.invalidateQueries({ queryKey: ['pkgx-mapping'] });
        queryClient.invalidateQueries({ queryKey: ['linked-products'] });
      }
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
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.systemId) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.stats() });
      // Also invalidate PKGX-related queries when pkgxId changes
      if ('pkgxId' in variables) {
        queryClient.invalidateQueries({ queryKey: ['product-stats'] });
        queryClient.invalidateQueries({ queryKey: ['pkgx-mapping'] });
        queryClient.invalidateQueries({ queryKey: ['linked-products'] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.stats() });
      options.onDeleteSuccess?.();
    },
    onError: options.onError,
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
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.productSystemId) });
      queryClient.invalidateQueries({ queryKey: productKeys.inventory(variables.productSystemId) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['stock-history'] });
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
 * Uses fetchAllPages to load ALL products in the category
 */
export function useProductsByCategory(categoryId: string | null | undefined) {
  const query = useQuery({
    queryKey: [...productKeys.lists(), { categoryId }],
    queryFn: () => fetchAllPages((p) => fetchProducts({ ...p, categoryId: categoryId || undefined })),
    enabled: !!categoryId,
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
  // Compat wrapper for .data?.data access
  return { ...query, data: query.data ? { data: query.data } : undefined };
}

/**
 * Hook for getting products by brand
 * Uses fetchAllPages to load ALL products for the brand
 */
export function useProductsByBrand(brandId: string | null | undefined) {
  const query = useQuery({
    queryKey: [...productKeys.lists(), { brandId }],
    queryFn: () => fetchAllPages((p) => fetchProducts({ ...p, brandId: brandId || undefined })),
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
      queryClient.invalidateQueries({ queryKey: productKeys.all });
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
      queryClient.invalidateQueries({ queryKey: productKeys.all });
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
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const bulkRestore = useMutation({
    mutationFn: bulkRestoreProducts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const bulkUpdateStatus = useMutation({
    mutationFn: ({ systemIds, status }: { systemIds: string[]; status: string }) =>
      bulkUpdateProductStatus(systemIds, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  return { bulkDelete, bulkRestore, bulkUpdateStatus };
}
