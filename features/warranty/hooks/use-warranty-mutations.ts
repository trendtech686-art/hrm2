/**
 * Enhanced Warranty Hooks with Stock Management Operations
 * 
 * Includes mutations for:
 * - Complete warranty (deduct stock)
 * - Cancel warranty (uncommit stock)
 * - Status changes with proper stock handling
 * 
 * Updated to use Server Actions (Phase 2 migration)
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { invalidateRelated } from '@/lib/query-invalidation-map';
import {
  cancelWarrantyAction,
  updateWarrantyStatusAction,
  completeWarrantyAction,
  reopenWarrantyAction,
  type UpdateStatusInput,
  type ReopenWarrantyInput,
} from '@/app/actions/warranty';

// ============================================
// Types
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

interface UseWarrantyStockMutationsOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  // Extended callbacks with data
  onCreateSuccess?: (warranty: Record<string, unknown>) => void;
  onUpdateSuccess?: (warranty: Record<string, unknown>) => void;
}

// ============================================
// React Query Hooks with Server Actions
// ============================================

/**
 * Warranty mutations with stock management
 * 
 * Uses Server Actions for atomic server-side operations
 */
export function useWarrantyStockMutations(options: UseWarrantyStockMutationsOptions = {}) {
  const queryClient = useQueryClient();

  const complete = useMutation({
    mutationFn: async ({ systemId, data }: { systemId: string; data: CompleteWarrantyDto }) => {
      const result = await completeWarrantyAction({
        systemId,
        note: data.completionNotes,
      });
      if (!result.success) {
        throw new Error(result.error || 'Failed to complete warranty');
      }
      return result.data;
    },
    onSuccess: () => {
      invalidateRelated(queryClient, 'warranties');
      
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
    mutationFn: async ({ systemId, data }: { systemId: string; data: CancelWarrantyDto }) => {
      const result = await cancelWarrantyAction({
        systemId,
        reason: data.cancellationReason,
        cancelVouchers: true,
      });
      if (!result.success) {
        throw new Error(result.error || 'Failed to cancel warranty');
      }
      return result.data;
    },
    onSuccess: () => {
      invalidateRelated(queryClient, 'warranties');
      
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

  const updateStatus = useMutation({
    mutationFn: async (input: UpdateStatusInput) => {
      const result = await updateWarrantyStatusAction(input);
      if (!result.success) {
        throw new Error(result.error || 'Failed to update status');
      }
      return result.data;
    },
    onSuccess: () => {
      invalidateRelated(queryClient, 'warranties');
      
      toast.success('Cập nhật trạng thái thành công');
      options.onSuccess?.();
    },
    onError: (error) => {
      toast.error('Lỗi cập nhật trạng thái', {
        description: error.message,
      });
      options.onError?.(error);
    },
  });

  const reopen = useMutation({
    mutationFn: async (input: ReopenWarrantyInput) => {
      const result = await reopenWarrantyAction(input);
      if (!result.success) {
        throw new Error(result.error || 'Failed to reopen warranty');
      }
      return result.data;
    },
    onSuccess: () => {
      invalidateRelated(queryClient, 'warranties');
      
      toast.success('Đã mở lại phiếu bảo hành');
      options.onSuccess?.();
    },
    onError: (error) => {
      toast.error('Lỗi mở lại phiếu', {
        description: error.message,
      });
      options.onError?.(error);
    },
  });

  return { complete, cancel, updateStatus, reopen };
}

/**
 * Combined warranty mutations including CRUD + stock operations
 * 
 * Use this hook for complete warranty management in forms/detail pages
 */
export function useWarrantyMutations(options: UseWarrantyStockMutationsOptions = {}) {
  const queryClient = useQueryClient();
  const stockMutations = useWarrantyStockMutations(options);

  // Create mutation - still using API as it requires complex form data handling
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

      const result = await response.json();
      return result.data || result;
    },
    onSuccess: (warranty) => {
      invalidateRelated(queryClient, 'warranties');
      
      if (options.onCreateSuccess) {
        options.onCreateSuccess(warranty);
      } else {
        toast.success('Tạo phiếu bảo hành thành công', {
          description: warranty?.id ? `Mã: ${warranty.id}` : 'Hàng thay thế đã được giữ chỗ (nếu có)',
        });
        options.onSuccess?.();
      }
    },
    onError: (error: Error) => {
      toast.error('Lỗi tạo phiếu bảo hành', {
        description: error.message,
      });
      options.onError?.(error);
    },
  });

  // Update mutation - still using API as it requires complex form data handling
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

      const result = await response.json();
      return result.data || result;
    },
    onSuccess: (warranty) => {
      invalidateRelated(queryClient, 'warranties');
      
      if (options.onUpdateSuccess) {
        options.onUpdateSuccess(warranty);
      } else {
        toast.success('Cập nhật phiếu bảo hành thành công');
        options.onSuccess?.();
      }
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
    updateStatus: stockMutations.updateStatus,
    reopen: stockMutations.reopen,
  };
}
