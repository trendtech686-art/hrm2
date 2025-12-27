/**
 * Stock Locations React Query Hooks
 * Provides data fetching and mutations for stock locations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchStockLocations,
  fetchStockLocationById,
  createStockLocation,
  updateStockLocation,
  deleteStockLocation,
  fetchBranchStockLocations,
  type StockLocationFilters,
  type StockLocationCreateInput,
  type StockLocationUpdateInput,
} from '../api/stock-locations-api';

// Query keys factory
export const stockLocationKeys = {
  all: ['stock-locations'] as const,
  lists: () => [...stockLocationKeys.all, 'list'] as const,
  list: (filters: StockLocationFilters) => [...stockLocationKeys.lists(), filters] as const,
  details: () => [...stockLocationKeys.all, 'detail'] as const,
  detail: (id: string) => [...stockLocationKeys.details(), id] as const,
  byBranch: (branchId: string) => [...stockLocationKeys.all, 'branch', branchId] as const,
};

/**
 * Hook to fetch stock locations with filters
 */
export function useStockLocations(filters: StockLocationFilters = {}) {
  return useQuery({
    queryKey: stockLocationKeys.list(filters),
    queryFn: () => fetchStockLocations(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes - locations don't change often
  });
}

/**
 * Hook to fetch single stock location
 */
export function useStockLocationById(systemId: string | undefined) {
  return useQuery({
    queryKey: stockLocationKeys.detail(systemId!),
    queryFn: () => fetchStockLocationById(systemId!),
    enabled: !!systemId,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook to fetch stock locations for a branch
 */
export function useBranchStockLocations(branchSystemId: string | undefined) {
  return useQuery({
    queryKey: stockLocationKeys.byBranch(branchSystemId!),
    queryFn: () => fetchBranchStockLocations(branchSystemId!),
    enabled: !!branchSystemId,
    staleTime: 1000 * 60 * 5,
  });
}

interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook providing stock location mutations
 */
export function useStockLocationMutations(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();

  const invalidateLocations = () => {
    queryClient.invalidateQueries({ queryKey: stockLocationKeys.all });
  };

  const create = useMutation({
    mutationFn: (data: StockLocationCreateInput) => createStockLocation(data),
    onSuccess: () => {
      invalidateLocations();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: StockLocationUpdateInput }) =>
      updateStockLocation(systemId, data),
    onSuccess: () => {
      invalidateLocations();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const remove = useMutation({
    mutationFn: (systemId: string) => deleteStockLocation(systemId),
    onSuccess: () => {
      invalidateLocations();
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
