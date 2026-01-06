/**
 * useCategories - React Query hooks for product categories
 * 
 * @example
 * // List categories with pagination
 * const { data } = useCategories({ page: 1, limit: 20 });
 * 
 * // Get category tree
 * const { data } = useCategoryTree();
 * 
 * // Get single category
 * const { data } = useCategory(systemId);
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  fetchCategories,
  fetchCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  type CategoriesParams,
  type CategoryCreateInput,
  type CategoryUpdateInput,
} from '../api/categories-api';
import type { Category } from '@/generated/prisma/client';

// Query keys factory
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (params: CategoriesParams) => [...categoryKeys.lists(), params] as const,
  tree: () => [...categoryKeys.all, 'tree'] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
};

/**
 * Hook to fetch categories with pagination
 */
export function useCategories(params: CategoriesParams = {}) {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => fetchCategories(params),
    staleTime: 1000 * 60 * 10, // 10 minutes - categories rarely change
    gcTime: 1000 * 60 * 60, // 1 hour
    placeholderData: keepPreviousData,
  });
}

/**
 * Hook to fetch all categories (no pagination)
 */
export function useAllCategories() {
  return useQuery({
    queryKey: categoryKeys.list({ all: true }),
    queryFn: () => fetchCategories({ all: true }),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
  });
}

/**
 * Hook to fetch category tree (hierarchical structure)
 */
export function useCategoryTree() {
  return useQuery({
    queryKey: categoryKeys.tree(),
    queryFn: () => fetchCategories({ tree: true }),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
  });
}

/**
 * Hook to fetch single category by systemId
 */
export function useCategory(systemId: string | null | undefined) {
  return useQuery({
    queryKey: categoryKeys.detail(systemId!),
    queryFn: () => fetchCategory(systemId!),
    enabled: !!systemId,
    staleTime: 1000 * 60 * 10,
  });
}

interface UseCategoryMutationsOptions {
  onCreateSuccess?: (category: Category) => void;
  onUpdateSuccess?: (category: Category) => void;
  onDeleteSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook providing category mutations
 */
export function useCategoryMutations(options: UseCategoryMutationsOptions = {}) {
  const queryClient = useQueryClient();

  const invalidateCategories = () => {
    queryClient.invalidateQueries({ queryKey: categoryKeys.all });
  };

  const create = useMutation({
    mutationFn: (data: CategoryCreateInput) => createCategory(data),
    onSuccess: (category) => {
      invalidateCategories();
      options.onCreateSuccess?.(category);
    },
    onError: options.onError,
  });

  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: CategoryUpdateInput }) =>
      updateCategory(systemId, data),
    onSuccess: (category) => {
      invalidateCategories();
      options.onUpdateSuccess?.(category);
    },
    onError: options.onError,
  });

  const remove = useMutation({
    mutationFn: (systemId: string) => deleteCategory(systemId),
    onSuccess: () => {
      invalidateCategories();
      options.onDeleteSuccess?.();
    },
    onError: options.onError,
  });

  return { create, update, remove };
}

/**
 * Helper hook to find category by systemId from cached data
 */
export function useCategoryById(systemId: string | null | undefined): Category | undefined {
  const { data } = useAllCategories();
  return data?.data.find((c) => c.systemId === systemId);
}
