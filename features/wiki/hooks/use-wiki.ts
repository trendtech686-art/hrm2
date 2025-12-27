/**
 * Wiki React Query Hooks
 * Provides data fetching and mutations for wiki articles
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchWikiArticles,
  fetchWikiById,
  createWiki,
  updateWiki,
  deleteWiki,
  fetchWikiCategories,
  fetchWikiTags,
  searchWiki,
  type WikiFilters,
  type WikiCreateInput,
  type WikiUpdateInput,
} from '../api/wiki-api';

// Query keys factory
export const wikiKeys = {
  all: ['wiki'] as const,
  lists: () => [...wikiKeys.all, 'list'] as const,
  list: (filters: WikiFilters) => [...wikiKeys.lists(), filters] as const,
  details: () => [...wikiKeys.all, 'detail'] as const,
  detail: (id: string) => [...wikiKeys.details(), id] as const,
  categories: () => [...wikiKeys.all, 'categories'] as const,
  tags: () => [...wikiKeys.all, 'tags'] as const,
  search: (query: string) => [...wikiKeys.all, 'search', query] as const,
};

/**
 * Hook to fetch wiki articles with filters
 */
export function useWikiArticles(filters: WikiFilters = {}) {
  return useQuery({
    queryKey: wikiKeys.list(filters),
    queryFn: () => fetchWikiArticles(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes - wiki doesn't change often
  });
}

/**
 * Hook to fetch single wiki article
 */
export function useWikiById(systemId: string | undefined) {
  return useQuery({
    queryKey: wikiKeys.detail(systemId!),
    queryFn: () => fetchWikiById(systemId!),
    enabled: !!systemId,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook to fetch wiki categories
 */
export function useWikiCategories() {
  return useQuery({
    queryKey: wikiKeys.categories(),
    queryFn: fetchWikiCategories,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

/**
 * Hook to fetch wiki tags
 */
export function useWikiTags() {
  return useQuery({
    queryKey: wikiKeys.tags(),
    queryFn: fetchWikiTags,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

/**
 * Hook for wiki search
 */
export function useWikiSearch(query: string, enabled = true) {
  return useQuery({
    queryKey: wikiKeys.search(query),
    queryFn: () => searchWiki(query),
    enabled: enabled && query.length >= 2,
    staleTime: 1000 * 60,
  });
}

interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook providing wiki mutations
 */
export function useWikiMutations(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();

  const invalidateWiki = () => {
    queryClient.invalidateQueries({ queryKey: wikiKeys.all });
  };

  const create = useMutation({
    mutationFn: (data: WikiCreateInput) => createWiki(data),
    onSuccess: () => {
      invalidateWiki();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: WikiUpdateInput }) =>
      updateWiki(systemId, data),
    onSuccess: () => {
      invalidateWiki();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const remove = useMutation({
    mutationFn: (systemId: string) => deleteWiki(systemId),
    onSuccess: () => {
      invalidateWiki();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  return {
    create,
    update,
    remove,
    isLoading: create.isPending || update.isPending || remove.isPending,
  };
}

/**
 * Hook to fetch wiki articles by category
 */
export function useWikiByCategory(category: string) {
  return useWikiArticles({ category });
}
