/**
 * useBrands - React Query hooks
 * 
 * ⚠️ Direct import: import { useBrands } from '@/features/brands/hooks/use-brands'
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  fetchBrands,
  fetchBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  type BrandsParams,
  type Brand,
} from '../api/brands-api';

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
  onCreateSuccess?: (brand: Brand) => void;
  onUpdateSuccess?: (brand: Brand) => void;
  onDeleteSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useBrandMutations(options: UseBrandMutationsOptions = {}) {
  const queryClient = useQueryClient();
  
  const create = useMutation({
    mutationFn: createBrand,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: brandKeys.all });
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<Brand> }) => 
      updateBrand(systemId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: brandKeys.detail(variables.systemId) });
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: deleteBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.all });
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

export function useAllBrands() {
  return useBrands({ limit: 100 });
}
