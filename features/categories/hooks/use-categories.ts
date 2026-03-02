/**
 * useCategories - React Query hooks
 * 
 * ⚠️ Direct import: import { useCategories } from '@/features/categories/hooks/use-categories'
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  fetchCategories,
  fetchCategory,
  fetchCategoryTree,
  fetchDeletedCategories,
  permanentDeleteCategory,
  bulkDeleteCategories,
  bulkActivateCategories,
  bulkDeactivateCategories,
  type CategoriesParams,
  type Category,
} from '../api/categories-api';
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
  restoreCategoryAction,
} from '@/app/actions/categories';

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (params: CategoriesParams) => [...categoryKeys.lists(), params] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
  tree: () => [...categoryKeys.all, 'tree'] as const,
};

export function useCategories(params: CategoriesParams = {}) {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => fetchCategories(params),
    staleTime: 5 * 60 * 1000, // Categories don't change often
    gcTime: 30 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useCategory(id: string | null | undefined) {
  return useQuery({
    queryKey: categoryKeys.detail(id!),
    queryFn: () => fetchCategory(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCategoryTree() {
  return useQuery({
    queryKey: categoryKeys.tree(),
    queryFn: fetchCategoryTree,
    staleTime: 5 * 60 * 1000,
  });
}

interface UseCategoryMutationsOptions {
  onCreateSuccess?: (category: Category) => void;
  onUpdateSuccess?: (category: Category) => void;
  onDeleteSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useCategoryMutations(options: UseCategoryMutationsOptions = {}) {
  const queryClient = useQueryClient();
  
  const create = useMutation({
    mutationFn: async (data: Parameters<typeof createCategoryAction>[0]) => {
      const result = await createCategoryAction(data);
      if (!result.success) throw new Error(result.error || 'Failed to create category');
      return result.data as Category;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: async ({ systemId, data }: { systemId: string; data: Partial<Category> }) => {
      const updateInput: Parameters<typeof updateCategoryAction>[0] = {
        systemId,
        name: data.name ?? undefined,
        slug: data.slug ?? undefined,
        parentId: data.parentId,
        seoTitle: data.seoTitle ?? undefined,
        metaDescription: data.metaDescription ?? undefined,
        seoKeywords: data.seoKeywords ?? undefined,
        shortDescription: data.shortDescription ?? undefined,
        longDescription: data.longDescription ?? undefined,
        ogImage: data.ogImage ?? undefined,
        websiteSeo: (data.websiteSeo as Record<string, unknown>) ?? undefined,
        path: data.path ?? undefined,
        level: data.level ?? undefined,
        color: data.color ?? undefined,
        icon: data.icon ?? undefined,
        imageUrl: data.imageUrl ?? undefined,
        thumbnail: data.thumbnail ?? undefined,
        description: data.description ?? undefined,
        sortOrder: data.sortOrder ?? undefined,
        isActive: data.isActive,
      };
      const result = await updateCategoryAction(updateInput);
      if (!result.success) throw new Error(result.error || 'Failed to update category');
      return result.data as Category;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(variables.systemId) });
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.tree() });
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: async (systemId: string) => {
      const result = await deleteCategoryAction(systemId);
      if (!result.success) throw new Error(result.error || 'Failed to delete category');
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      // Also invalidate PKGX settings since mapping is deleted with category
      queryClient.invalidateQueries({ queryKey: ['pkgx', 'settings'] });
      options.onDeleteSuccess?.();
    },
    onError: options.onError,
  });
  
  return { create, update, remove };
}

export function useRootCategories() {
  return useCategories({ parentId: null });
}

export function useSubCategories(parentId: string | null | undefined) {
  return useCategories({
    parentId: parentId || undefined,
  });
}

/**
 * Hook for fetching deleted categories (trash)
 */
export function useDeletedCategories() {
  return useQuery({
    queryKey: [...categoryKeys.all, 'deleted'],
    queryFn: fetchDeletedCategories,
    staleTime: 30_000,
  });
}

/**
 * Hook for trash mutations (restore, permanent delete)
 */
export function useCategoryTrashMutations() {
  const queryClient = useQueryClient();
  
  const restore = useMutation({
    mutationFn: async (systemId: string) => {
      const result = await restoreCategoryAction(systemId);
      if (!result.success) throw new Error(result.error || 'Failed to restore category');
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
  
  const permanentDelete = useMutation({
    mutationFn: permanentDeleteCategory,
    onMutate: async (systemId) => {
      await queryClient.cancelQueries({ queryKey: [...categoryKeys.all, 'deleted'] });
      const previousDeleted = queryClient.getQueryData([...categoryKeys.all, 'deleted']);
      queryClient.setQueryData(
        [...categoryKeys.all, 'deleted'],
        (old: Array<{ systemId: string }> | undefined) => 
          old?.filter(item => item.systemId !== systemId) || []
      );
      return { previousDeleted };
    },
    onError: (_err, _systemId, context) => {
      if (context?.previousDeleted) {
        queryClient.setQueryData([...categoryKeys.all, 'deleted'], context.previousDeleted);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
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
 * Bulk mutations for categories (single request instead of N sequential)
 */
interface UseBulkCategoryMutationsOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useBulkCategoryMutations(options: UseBulkCategoryMutationsOptions = {}) {
  const queryClient = useQueryClient();

  const bulkDelete = useMutation({
    mutationFn: bulkDeleteCategories,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const bulkActivate = useMutation({
    mutationFn: bulkActivateCategories,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const bulkDeactivate = useMutation({
    mutationFn: bulkDeactivateCategories,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  return { bulkDelete, bulkActivate, bulkDeactivate };
}
