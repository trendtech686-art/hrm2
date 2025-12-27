/**
 * useProducts - React Query hooks for products
 * 
 * ⚠️ IMPORTANT: Direct import pattern
 * - Import this file directly: import { useProducts } from '@/features/products/hooks/use-products'
 * - NEVER import from '@/features/products' or '@/features/products/store'
 * 
 * This hook is ISOLATED - it only depends on:
 * - @tanstack/react-query
 * - Local API functions
 * - Local types
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  fetchProducts,
  fetchProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  fetchProductInventory,
  type ProductsParams,
  type CreateProductInput,
  type UpdateProductInput,
} from '../api/products-api';

// Query keys - exported for invalidation
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: ProductsParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  search: (query: string) => [...productKeys.all, 'search', query] as const,
  inventory: (id: string) => [...productKeys.all, 'inventory', id] as const,
};

/**
 * Hook for fetching paginated products list
 * 
 * @example
 * ```tsx
 * function ProductsPage() {
 *   const [page, setPage] = useState(1);
 *   const { data, isLoading } = useProducts({ page, limit: 50 });
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
export function useProducts(params: ProductsParams = {}) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => fetchProducts(params),
    staleTime: 60_000, // 1 minute - products don't change frequently
    gcTime: 10 * 60 * 1000, // 10 minutes
    placeholderData: keepPreviousData,
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
  });
}

/**
 * Hook for product mutations (create/update/delete)
 */
interface UseProductMutationsOptions {
  onCreateSuccess?: (product: unknown) => void;
  onUpdateSuccess?: (product: unknown) => void;
  onDeleteSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useProductMutations(options: UseProductMutationsOptions = {}) {
  const queryClient = useQueryClient();
  
  const create = useMutation({
    mutationFn: createProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: updateProduct,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.systemId) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      options.onDeleteSuccess?.();
    },
    onError: options.onError,
  });
  
  return {
    create,
    update,
    remove,
    isCreating: create.isPending,
    isUpdating: update.isPending,
    isDeleting: remove.isPending,
    isMutating: create.isPending || update.isPending || remove.isPending,
  };
}

/**
 * Hook for getting products by category (for filtering)
 */
export function useProductsByCategory(categoryId: string | null | undefined) {
  return useProducts({ 
    categoryId: categoryId || undefined, 
    limit: 100 
  });
}

/**
 * Hook for getting products by brand
 */
export function useProductsByBrand(brandId: string | null | undefined) {
  return useProducts({ 
    brandId: brandId || undefined, 
    limit: 100 
  });
}

/**
 * Hook for getting active products only
 */
export function useActiveProducts(params: Omit<ProductsParams, 'status'> = {}) {
  return useProducts({ ...params, status: 'active' });
}
