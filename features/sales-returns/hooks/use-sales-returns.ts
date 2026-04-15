/**
 * useSalesReturns - React Query hooks (Trả hàng)
 * 
 * ⚠️ Direct import: import { useSalesReturns } from '@/features/sales-returns/hooks/use-sales-returns'
 * 
 * Note: Create/Receive/Exchange operations use API routes for complex stock logic
 * Update/Delete use Server Actions for basic operations
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { asSystemId } from '@/lib/id-types';
import {
  fetchSalesReturns,
  fetchSalesReturn,
  createSalesReturn,
  markAsReceived,
  exchangeProduct,
  type SalesReturnsParams,
  type ExchangeProductData,
} from '../api/sales-returns-api';
import {
  updateSalesReturnAction,
  deleteSalesReturnAction,
  type UpdateSalesReturnInput,
} from '@/app/actions/sales-returns';
import { invalidateRelated } from '@/lib/query-invalidation-map';
import type { SalesReturn } from '@/lib/types/prisma-extended';

// Re-export types for backwards compatibility
export type { UpdateSalesReturnInput };
export type SalesReturnCreateInput = Omit<SalesReturn, 'systemId' | 'id' | 'createdAt' | 'updatedAt'>;

// Legacy format support
type LegacyUpdateInput = { systemId: string; data: Partial<SalesReturn> };

function toUpdateSalesReturnInput(input: UpdateSalesReturnInput | LegacyUpdateInput): UpdateSalesReturnInput {
  const i = input as Record<string, unknown>;
  if (i.data && typeof i.data === 'object') {
    const legacy = input as LegacyUpdateInput;
    const d = legacy.data as Record<string, unknown>;
    return {
      systemId: legacy.systemId,
      status: d.status as string | undefined,
      reason: d.reason as string | undefined,
      note: d.note as string | undefined,
      notes: d.notes as string | undefined,
    };
  }
  return input as UpdateSalesReturnInput;
}

export const salesReturnKeys = {
  all: ['sales-returns'] as const,
  lists: () => [...salesReturnKeys.all, 'list'] as const,
  list: (params: SalesReturnsParams) => [...salesReturnKeys.lists(), params] as const,
  details: () => [...salesReturnKeys.all, 'detail'] as const,
  detail: (id: string) => [...salesReturnKeys.details(), id] as const,
  stats: () => [...salesReturnKeys.all, 'stats'] as const,
};

export function useSalesReturns(params: SalesReturnsParams = {}) {
  return useQuery({
    queryKey: salesReturnKeys.list(params),
    queryFn: () => fetchSalesReturns(params),
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useSalesReturn(id: string | null | undefined) {
  return useQuery({
    queryKey: salesReturnKeys.detail(id!),
    queryFn: () => fetchSalesReturn(asSystemId(id!)),
    enabled: !!id,
    staleTime: 60_000,
  });
}

interface UseSalesReturnMutationsOptions {
  onCreateSuccess?: (salesReturn: SalesReturn) => void;
  onUpdateSuccess?: (salesReturn: SalesReturn) => void;
  onDeleteSuccess?: () => void;
  onReceiveSuccess?: (salesReturn: SalesReturn) => void;
  onExchangeSuccess?: (salesReturn: SalesReturn) => void;
  onError?: (error: Error) => void;
}

export function useSalesReturnMutations(options: UseSalesReturnMutationsOptions = {}) {
  const queryClient = useQueryClient();
  
  const create = useMutation({
    mutationFn: async (data: SalesReturnCreateInput | Partial<SalesReturn>) => {
      return await createSalesReturn(data as SalesReturnCreateInput);
    },
    onSuccess: (data) => {
      invalidateRelated(queryClient, 'sales-returns');
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: async (input: UpdateSalesReturnInput | LegacyUpdateInput) => {
      const converted = toUpdateSalesReturnInput(input);
      const result = await updateSalesReturnAction(converted);
      if (!result.success) {
        throw new Error(result.error || 'Không thể cập nhật phiếu trả hàng');
      }
      return result.data as unknown as SalesReturn;
    },
    onSuccess: (data) => {
      invalidateRelated(queryClient, 'sales-returns');
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: async (systemId: string) => {
      const result = await deleteSalesReturnAction(systemId);
      if (!result.success) {
        throw new Error(result.error || 'Không thể xóa phiếu trả hàng');
      }
      return result.data;
    },
    onSuccess: () => {
      invalidateRelated(queryClient, 'sales-returns');
      options.onDeleteSuccess?.();
    },
    onError: options.onError,
  });
  
  const receive = useMutation({
    mutationFn: async (systemId: string) => {
      return await markAsReceived(asSystemId(systemId));
    },
    onSuccess: (data) => {
      invalidateRelated(queryClient, 'sales-returns');
      options.onReceiveSuccess?.(data);
    },
    onError: options.onError,
  });

  const exchange = useMutation({
    mutationFn: async (input: { systemId: string } & ExchangeProductData) => {
      const { systemId, ...data } = input;
      return await exchangeProduct(asSystemId(systemId), data);
    },
    onSuccess: (data) => {
      invalidateRelated(queryClient, 'sales-returns');
      options.onExchangeSuccess?.(data);
    },
    onError: options.onError,
  });
  
  return { create, update, remove, receive, exchange };
}
