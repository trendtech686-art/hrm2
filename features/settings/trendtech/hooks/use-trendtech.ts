/**
 * Trendtech Settings React Query Hooks
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { invalidateRelated } from '@/lib/query-invalidation-map';
import * as api from '../api/trendtech-api';

export const trendtechKeys = {
  all: ['trendtech'] as const,
  settings: () => [...trendtechKeys.all, 'settings'] as const,
  categories: () => [...trendtechKeys.all, 'categories'] as const,
  brands: () => [...trendtechKeys.all, 'brands'] as const,
  categoryMappings: () => [...trendtechKeys.all, 'category-mappings'] as const,
  brandMappings: () => [...trendtechKeys.all, 'brand-mappings'] as const,
};

export function useTrendtechSettings() {
  return useQuery({ queryKey: trendtechKeys.settings(), queryFn: api.fetchTrendtechSettings, staleTime: 1000 * 60 * 10, gcTime: 10 * 60 * 1000, placeholderData: keepPreviousData });
}

export function useTrendtechSettingsMutation(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.updateTrendtechSettings, onSuccess: () => { invalidateRelated(qc, 'trendtech'); opts?.onSuccess?.(); } });
}

export function useTrendtechCategories() {
  return useQuery({ queryKey: trendtechKeys.categories(), queryFn: api.fetchTrendtechCategories, staleTime: 1000 * 60 * 30, gcTime: 10 * 60 * 1000, placeholderData: keepPreviousData });
}

export function useSyncTrendtechCategories(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.syncTrendtechCategories, onSuccess: () => { invalidateRelated(qc, 'trendtech'); opts?.onSuccess?.(); } });
}

export function useTrendtechBrands() {
  return useQuery({ queryKey: trendtechKeys.brands(), queryFn: api.fetchTrendtechBrands, staleTime: 1000 * 60 * 30, gcTime: 10 * 60 * 1000, placeholderData: keepPreviousData });
}

export function useSyncTrendtechBrands(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.syncTrendtechBrands, onSuccess: () => { invalidateRelated(qc, 'trendtech'); opts?.onSuccess?.(); } });
}

export function useTrendtechCategoryMappings() {
  return useQuery({ queryKey: trendtechKeys.categoryMappings(), queryFn: api.fetchCategoryMappings, staleTime: 1000 * 60 * 10, gcTime: 10 * 60 * 1000, placeholderData: keepPreviousData });
}

export function useTrendtechCategoryMappingMutations(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  const invalidate = () => invalidateRelated(qc, 'trendtech');
  return {
    save: useMutation({ mutationFn: api.saveCategoryMapping, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    remove: useMutation({ mutationFn: api.deleteCategoryMapping, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
  };
}

export function useTrendtechBrandMappings() {
  return useQuery({ queryKey: trendtechKeys.brandMappings(), queryFn: api.fetchBrandMappings, staleTime: 1000 * 60 * 10, gcTime: 10 * 60 * 1000, placeholderData: keepPreviousData });
}

export function useTrendtechBrandMappingMutations(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  const invalidate = () => invalidateRelated(qc, 'trendtech');
  return {
    save: useMutation({ mutationFn: api.saveBrandMapping, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    remove: useMutation({ mutationFn: api.deleteBrandMapping, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
  };
}

export function useTrendtechProductSync(opts?: { onSuccess?: () => void }) {
  return useMutation({ mutationFn: api.syncProductToTrendtech, onSuccess: opts?.onSuccess });
}

export function useTrendtechBulkSync(opts?: { onSuccess?: () => void }) {
  return useMutation({ mutationFn: api.bulkSyncToTrendtech, onSuccess: opts?.onSuccess });
}
