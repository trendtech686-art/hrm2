/**
 * useProductTypes - React Query hooks for product types
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/product-types-api';
import type { ProductType } from '@/lib/types/prisma-extended';

export const productTypeKeys = {
  all: ['product-types'] as const,
  lists: () => [...productTypeKeys.all, 'list'] as const,
  list: (params?: { limit?: number; page?: number }) => 
    [...productTypeKeys.lists(), params] as const,
  details: () => [...productTypeKeys.all, 'detail'] as const,
  detail: (id: string) => [...productTypeKeys.details(), id] as const,
};

export function useProductTypes(params?: { limit?: number; page?: number }) {
  return useQuery({
    queryKey: productTypeKeys.list(params),
    queryFn: () => api.fetchProductTypes(params),
    staleTime: 1000 * 60 * 10, // 10 minutes - settings don't change often
  });
}

export function useProductType(systemId: string) {
  return useQuery({
    queryKey: productTypeKeys.detail(systemId),
    queryFn: () => api.fetchProductTypeById(systemId),
    enabled: !!systemId,
    staleTime: 1000 * 60 * 10,
  });
}

export function useProductTypeMutations() {
  const queryClient = useQueryClient();
  
  const invalidateProductTypes = () => {
    queryClient.invalidateQueries({ queryKey: productTypeKeys.all });
  };
  
  const create = useMutation({
    mutationFn: api.createProductType,
    onSuccess: invalidateProductTypes,
  });
  
  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<ProductType> }) =>
      api.updateProductType(systemId, data),
    onSuccess: invalidateProductTypes,
  });
  
  const remove = useMutation({
    mutationFn: api.deleteProductType,
    onSuccess: invalidateProductTypes,
  });
  
  return { create, update, remove };
}
