/**
 * PKGX Settings React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/pkgx-api';
import type { PkgxCategoryMapping, PkgxBrandMapping } from '@/lib/types/prisma-extended';

export const pkgxKeys = {
  all: ['pkgx'] as const,
  categories: () => [...pkgxKeys.all, 'categories'] as const,
  brands: () => [...pkgxKeys.all, 'brands'] as const,
  categoryMappings: () => [...pkgxKeys.all, 'category-mappings'] as const,
  brandMappings: () => [...pkgxKeys.all, 'brand-mappings'] as const,
};

// PKGX Categories
export function usePkgxCategories() {
  return useQuery({ queryKey: pkgxKeys.categories(), queryFn: api.fetchPkgxCategories, staleTime: 1000 * 60 * 30 });
}

export function useSyncPkgxCategories(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.syncPkgxCategories, onSuccess: () => { qc.invalidateQueries({ queryKey: pkgxKeys.categories() }); opts?.onSuccess?.(); } });
}

// PKGX Brands
export function usePkgxBrands() {
  return useQuery({ queryKey: pkgxKeys.brands(), queryFn: api.fetchPkgxBrands, staleTime: 1000 * 60 * 30 });
}

export function useSyncPkgxBrands(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.syncPkgxBrands, onSuccess: () => { qc.invalidateQueries({ queryKey: pkgxKeys.brands() }); opts?.onSuccess?.(); } });
}

// Category Mappings
export function useCategoryMappings() {
  return useQuery({ queryKey: pkgxKeys.categoryMappings(), queryFn: api.fetchCategoryMappings, staleTime: 1000 * 60 * 10 });
}

export function useCategoryMappingMutations(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: pkgxKeys.categoryMappings() });
  return {
    save: useMutation({ mutationFn: api.saveCategoryMapping, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    remove: useMutation({ mutationFn: api.deleteCategoryMapping, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
  };
}

// Brand Mappings
export function useBrandMappings() {
  return useQuery({ queryKey: pkgxKeys.brandMappings(), queryFn: api.fetchBrandMappings, staleTime: 1000 * 60 * 10 });
}

export function useBrandMappingMutations(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: pkgxKeys.brandMappings() });
  return {
    save: useMutation({ mutationFn: api.saveBrandMapping, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    remove: useMutation({ mutationFn: api.deleteBrandMapping, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
  };
}

// Product Sync
export function useProductSync(opts?: { onSuccess?: () => void }) {
  return useMutation({ mutationFn: api.syncProductToPkgx, onSuccess: opts?.onSuccess });
}

export function useBulkProductSync(opts?: { onSuccess?: () => void }) {
  return useMutation({ mutationFn: api.bulkSyncProductsToPkgx, onSuccess: opts?.onSuccess });
}
