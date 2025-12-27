/**
 * useCategories - React Query hooks
 * 
 * ⚠️ Direct import: import { useCategories } from '@/features/categories/hooks/use-categories'
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  fetchCategories,
  fetchCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  fetchCategoryTree,
  type CategoriesParams,
  type Category,
} from '../api/categories-api';

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
    mutationFn: createCategory,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<Category> }) => 
      updateCategory(systemId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(variables.systemId) });
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.tree() });
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
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
