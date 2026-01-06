/**
 * Purchase Orders Store - Return Slice
 * Return processing operations
 * 
 * @module features/purchase-orders/store/return-slice
 */

import type { 
    PurchaseOrder, 
    PurchaseOrderReturnStatus,
    PurchaseOrderRefundStatus 
} from '@/lib/types/prisma-extended';
import { useEmployeeStore } from '../../employees/store';
import { createHistoryEntry } from './helpers';
import { baseStore } from './base-store';

// ============================================
// RETURN OPERATIONS
// ============================================

export const processReturn = (
    purchaseOrderId: string, 
    isFullReturn: boolean, 
    newRefundStatus: PurchaseOrderRefundStatus | undefined, 
    returnId: string, 
    creatorName: string
) => {
    baseStore.setState(state => {
        const poIndex = state.data.findIndex(p => p.id === purchaseOrderId);
        if (poIndex === -1) return state;

        const po = state.data[poIndex] as PurchaseOrder;

        let newReturnStatus: PurchaseOrderReturnStatus = 'Hoàn hàng một phần';
        if (isFullReturn) {
            newReturnStatus = 'Hoàn hàng toàn bộ';
        }
        
        const updatedPO: PurchaseOrder = { 
            ...po, 
            returnStatus: newReturnStatus,
            ...(newRefundStatus && { refundStatus: newRefundStatus })
        };
        
        if (returnId && creatorName) {
            const user = useEmployeeStore.getState().data.find(e => e.fullName === creatorName);
            const historyEntry = createHistoryEntry(
                'status_changed',
                `Tạo phiếu hoàn trả ${returnId}, cập nhật trạng thái hoàn trả đơn hàng.`,
                { systemId: user?.systemId || 'SYSTEM', name: creatorName },
                { oldValue: po.returnStatus || 'Chưa hoàn trả', newValue: newReturnStatus, field: 'returnStatus' }
            );
            updatedPO.activityHistory = [...(updatedPO.activityHistory || []), historyEntry];
        }
        
        const newData = [...state.data];
        newData[poIndex] = updatedPO;

        return { data: newData };
    });
};
