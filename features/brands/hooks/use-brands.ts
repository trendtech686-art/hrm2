/**
 * useBrands - React Query hooks
 * 
 * ⚠️ Direct import: import { useBrands } from '@/features/brands/hooks/use-brands'
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  fetchBrands,
  fetchBrand,
  fetchDeletedBrands,
  permanentDeleteBrand,
  bulkDeleteBrands,
  bulkActivateBrands,
  bulkDeactivateBrands,
  type BrandsParams,
  type Brand,
} from '../api/brands-api';
import {
  createBrandAction,
  updateBrandAction,
  deleteBrandAction,
  restoreBrandAction,
} from '@/app/actions/brands';

export const brandKeys = {
  all: ['brands'] as const,
  lists: () => [...brandKeys.all, 'list'] as const,
  list: (params: BrandsParams) => [...brandKeys.lists(), params] as const,
  details: () => [...brandKeys.all, 'detail'] as const,
  detail: (id: string) => [...brandKeys.details(), id] as const,
};

export function useBrands(params: BrandsParams = {}) {
  return useQuery({
    queryKey: brandKeys.list(params),
    queryFn: () => fetchBrands(params),
    staleTime: 5 * 60 * 1000, // Brands don't change often
    gcTime: 30 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useBrand(id: string | null | undefined) {
  return useQuery({
    queryKey: brandKeys.detail(id!),
    queryFn: () => fetchBrand(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

interface UseBrandMutationsOptions {
  onSuccess?: () => void;
  onCreateSuccess?: (brand: Brand) => void;
  onUpdateSuccess?: (brand: Brand) => void;
  onDeleteSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useBrandMutations(options: UseBrandMutationsOptions = {}) {
  const queryClient = useQueryClient();
  
  const create = useMutation({
    mutationFn: async (data: Parameters<typeof createBrandAction>[0]) => {
      const result = await createBrandAction(data);
      if (!result.success) throw new Error(result.error || 'Failed to create brand');
      return result.data as Brand;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: brandKeys.all });
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: async ({ systemId, data }: { systemId: string; data: Partial<Brand> }) => {
      const updateInput: Parameters<typeof updateBrandAction>[0] = {
        systemId,
        name: data.name ?? undefined,
        description: data.description ?? undefined,
        website: data.website ?? undefined,
        logo: data.logo ?? undefined,
        logoUrl: data.logoUrl ?? undefined,
        thumbnail: data.thumbnail ?? undefined,
        seoTitle: data.seoTitle ?? undefined,
        metaDescription: data.metaDescription ?? undefined,
        seoKeywords: data.seoKeywords ?? undefined,
        shortDescription: data.shortDescription ?? undefined,
        longDescription: data.longDescription ?? undefined,
        websiteSeo: (data.websiteSeo as Record<string, unknown>) ?? undefined,
        isActive: data.isActive,
        sortOrder: data.sortOrder ?? undefined,
      };
      const result = await updateBrandAction(updateInput);
      if (!result.success) throw new Error(result.error || 'Failed to update brand');
      return result.data as Brand;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: brandKeys.detail(variables.systemId) });
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: async (systemId: string) => {
      const result = await deleteBrandAction(systemId);
      if (!result.success) throw new Error(result.error || 'Failed to delete brand');
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.all });
      // Also invalidate PKGX settings since mapping is deleted with brand
      queryClient.invalidateQueries({ queryKey: ['pkgx', 'settings'] });
      options.onDeleteSuccess?.();
    },
    onError: options.onError,
  });
  
  return { create, update, remove };
}

export function useBrandSearch(search: string) {
  return useBrands({
    search: search || undefined,
    limit: 20,
  });
}

/**
 * Hook for fetching deleted brands (trash)
 */
export function useDeletedBrands() {
  return useQuery({
    queryKey: [...brandKeys.all, 'deleted'],
    queryFn: fetchDeletedBrands,
    staleTime: 30_000,
  });
}

/**
 * Hook for trash mutations (restore, permanent delete)
 */
export function useTrashMutations() {
  const queryClient = useQueryClient();
  
  const restore = useMutation({
    mutationFn: async (systemId: string) => {
      const result = await restoreBrandAction(systemId);
      if (!result.success) throw new Error(result.error || 'Failed to restore brand');
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.all });
    },
  });
  
  const permanentDelete = useMutation({
    mutationFn: permanentDeleteBrand,
    onMutate: async (systemId) => {
      await queryClient.cancelQueries({ queryKey: [...brandKeys.all, 'deleted'] });
      const previousDeleted = queryClient.getQueryData([...brandKeys.all, 'deleted']);
      queryClient.setQueryData(
        [...brandKeys.all, 'deleted'],
        (old: Array<{ systemId: string }> | undefined) => 
          old?.filter(item => item.systemId !== systemId) || []
      );
      return { previousDeleted };
    },
    onError: (_err, _systemId, context) => {
      if (context?.previousDeleted) {
        queryClient.setQueryData([...brandKeys.all, 'deleted'], context.previousDeleted);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.all });
    },
  });
  
  return {
    restore,
    permanentDelete,
    isRestoring: restore.isPending,
    isDeleting: permanentDelete.isPending,
  };
}

/**
 * Bulk mutations for brands (single request instead of N sequential)
 */
interface UseBulkBrandMutationsOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useBulkBrandMutations(options: UseBulkBrandMutationsOptions = {}) {
  const queryClient = useQueryClient();

  const bulkDelete = useMutation({
    mutationFn: bulkDeleteBrands,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.all });
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const bulkActivate = useMutation({
    mutationFn: bulkActivateBrands,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.all });
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const bulkDeactivate = useMutation({
    mutationFn: bulkDeactivateBrands,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.all });
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  return { bulkDelete, bulkActivate, bulkDeactivate };
}
