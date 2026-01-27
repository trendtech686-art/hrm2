/**
 * Enhanced Warranty Hooks with Stock Management Operations
 * 
 * Includes mutations for:
 * - Complete warranty (deduct stock)
 * - Cancel warranty (uncommit stock)
 * - Status changes with proper stock handling
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { warrantyKeys } from './use-warranties';

// ============================================
// API Client Functions
// ============================================

interface CompleteWarrantyDto {
  actualCost?: number;
  completionNotes?: string;
  technicianId?: string;
}

interface CancelWarrantyDto {
  cancellationReason: string;
  notes?: string;
}

async function completeWarranty(systemId: string, data: CompleteWarrantyDto) {
  const response = await fetch(`/api/warranties/${systemId}/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to complete warranty');
  }

  return response.json();
}

async function cancelWarranty(systemId: string, data: CancelWarrantyDto) {
  const response = await fetch(`/api/warranties/${systemId}/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to cancel warranty');
  }

  return response.json();
}

// ============================================
// React Query Hooks
// ============================================

interface UseWarrantyStockMutationsOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Warranty mutations with stock management
 * 
 * Replaces deprecated .getState() calls with server-side atomic transactions
 */
export function useWarrantyStockMutations(options: UseWarrantyStockMutationsOptions = {}) {
  const queryClient = useQueryClient();

  const complete = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: CompleteWarrantyDto }) => 
      completeWarranty(systemId, data),
    onSuccess: (data, variables) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: warrantyKeys.detail(variables.systemId) });
      queryClient.invalidateQueries({ queryKey: warrantyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: warrantyKeys.stats() });
      queryClient.invalidateQueries({ queryKey: ['inventory'] }); // Invalidate inventory
      queryClient.invalidateQueries({ queryKey: ['products'] }); // Invalidate products
      queryClient.invalidateQueries({ queryKey: ['stock-history'] }); // Invalidate stock history
      
      toast.success('Bảo hành đã hoàn tất', {
        description: 'Hàng đã được xuất kho thành công',
      });
      
      options.onSuccess?.();
    },
    onError: (error) => {
      toast.error('Lỗi hoàn tất bảo hành', {
        description: error.message,
      });
      options.onError?.(error);
    },
  });

  const cancel = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: CancelWarrantyDto }) => 
      cancelWarranty(systemId, data),
    onSuccess: (data, variables) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: warrantyKeys.detail(variables.systemId) });
      queryClient.invalidateQueries({ queryKey: warrantyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: warrantyKeys.stats() });
      queryClient.invalidateQueries({ queryKey: ['inventory'] }); // Invalidate inventory
      queryClient.invalidateQueries({ queryKey: ['products'] }); // Invalidate products
      
      toast.success('Bảo hành đã hủy', {
        description: 'Hàng giữ chỗ đã được giải phóng',
      });
      
      options.onSuccess?.();
    },
    onError: (error) => {
      toast.error('Lỗi hủy bảo hành', {
        description: error.message,
      });
      options.onError?.(error);
    },
  });

  return { complete, cancel };
}

/**
 * Combined warranty mutations including CRUD + stock operations
 * 
 * Use this hook for complete warranty management in forms/detail pages
 */
export function useWarrantyMutations(options: UseWarrantyStockMutationsOptions = {}) {
  const queryClient = useQueryClient();
  const stockMutations = useWarrantyStockMutations(options);

  // Create mutation with stock commitment
  const create = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await fetch('/api/warranties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create warranty');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: warrantyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: warrantyKeys.stats() });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      
      toast.success('Tạo phiếu bảo hành thành công', {
        description: 'Hàng thay thế đã được giữ chỗ (nếu có)',
      });
      
      options.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error('Lỗi tạo phiếu bảo hành', {
        description: error.message,
      });
      options.onError?.(error);
    },
  });

  // Update mutation
  const update = useMutation({
    mutationFn: async ({ systemId, data }: { systemId: string; data: Record<string, unknown> }) => {
      const response = await fetch(`/api/warranties/${systemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update warranty');
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: warrantyKeys.detail(variables.systemId) });
      queryClient.invalidateQueries({ queryKey: warrantyKeys.lists() });
      
      toast.success('Cập nhật phiếu bảo hành thành công');
      
      options.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error('Lỗi cập nhật phiếu bảo hành', {
        description: error.message,
      });
      options.onError?.(error);
    },
  });

  return {
    create,
    update,
    complete: stockMutations.complete,
    cancel: stockMutations.cancel,
  };
}
