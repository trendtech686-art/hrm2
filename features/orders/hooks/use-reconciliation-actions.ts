/**
 * useReconciliationActions - Hook for COD reconciliation actions
 */

import { useCallback } from 'react';
import { toast } from 'sonner';
import { useOrderActions } from './use-order-actions';
import type { SystemId } from '@/lib/id-types';

interface ReconciliationItem {
  systemId: string;
  orderSystemId: SystemId;
  codAmount?: number | null;
}

interface UseReconciliationActionsOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useReconciliationActions(options: UseReconciliationActionsOptions = {}) {
  const actions = useOrderActions(options);

  // Confirm COD reconciliation for multiple items
  const confirmCodReconciliation = useCallback(
    async (items: ReconciliationItem[], _employeeSystemId?: string) => {
      try {
        const shipments = items.map(item => ({
          systemId: item.systemId,
          orderSystemId: String(item.orderSystemId),
          codAmount: item.codAmount || 0,
        }));

        await actions.reconcileCod.mutateAsync({ shipments });

        toast.success(`Đã đối soát ${items.length} phiếu COD`);
      } catch (error) {
        toast.error('Lỗi khi đối soát COD');
        throw error;
      }
    },
    [actions.reconcileCod]
  );

  return {
    confirmCodReconciliation,
    isReconciling: actions.reconcileCod.isPending,
  };
}
