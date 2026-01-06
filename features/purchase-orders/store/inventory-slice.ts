/**
 * Purchase Orders Store - Inventory Slice
 * Inventory receipt processing and delivery status updates
 * 
 * @module features/purchase-orders/store/inventory-slice
 */

import type { 
    PurchaseOrder, 
    PurchaseOrderStatus,
    PurchaseOrderDeliveryStatus as DeliveryStatus 
} from '@/lib/types/prisma-extended';
import { useInventoryReceiptStore } from '../../inventory-receipts/store';
import { useEmployeeStore } from '../../employees/store';
import { createHistoryEntry } from './helpers';
import { baseStore } from './base-store';

// ============================================
// INVENTORY OPERATIONS
// ============================================

export const processInventoryReceipt = (purchaseOrderSystemId: string) => {
    baseStore.setState(state => {
        const { data: allReceipts } = useInventoryReceiptStore.getState();
        const poIndex = state.data.findIndex(p => p.systemId === purchaseOrderSystemId);
        if (poIndex === -1) return state;

        const po = state.data[poIndex] as PurchaseOrder;
        const poReceipts = allReceipts.filter(r => r.purchaseOrderSystemId === purchaseOrderSystemId);
        const totalReceivedByProduct = po.lineItems.reduce((acc, lineItem) => {
            const totalReceived = poReceipts.reduce((sum, receipt) => {
                const item = receipt.items.find(i => i.productSystemId === lineItem.productSystemId);
                return sum + (item ? Number(item.receivedQuantity) : 0);
            }, 0);
            acc[lineItem.productSystemId] = totalReceived;
            return acc;
        }, {} as Record<string, number>);

        const allItemsFullyReceived = po.lineItems.every(item => (totalReceivedByProduct[item.productSystemId] || 0) >= item.quantity);
        const anyItemReceived = Object.values(totalReceivedByProduct).some(qty => qty > 0);

        let newDeliveryStatus: DeliveryStatus;
        if (allItemsFullyReceived) {
            newDeliveryStatus = 'Đã nhập';
        } else if (anyItemReceived) {
            newDeliveryStatus = 'Đã nhập một phần';
        } else {
            newDeliveryStatus = 'Chưa nhập';
        }
        
        let newStatus: PurchaseOrderStatus = po.status;
        if (po.status !== 'Đã hủy' && po.status !== 'Kết thúc') {
            if (newDeliveryStatus === 'Đã nhập' && po.paymentStatus === 'Đã thanh toán') {
                newStatus = 'Hoàn thành';
            } else if (newDeliveryStatus === 'Chưa nhập' && po.paymentStatus === 'Chưa thanh toán') {
                newStatus = 'Đặt hàng';
            } else {
                newStatus = 'Đang giao dịch';
            }
        }

        if (po.deliveryStatus !== newDeliveryStatus || po.status !== newStatus) {
            const newData = [...state.data];
            const updatedPO: PurchaseOrder = { ...po, deliveryStatus: newDeliveryStatus, status: newStatus };

            if (po.deliveryStatus === 'Chưa nhập' && newDeliveryStatus !== 'Chưa nhập') {
                const latestReceipt = poReceipts.sort((a, b) => new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime())[0];
                if (latestReceipt) {
                    updatedPO.deliveryDate = latestReceipt.receivedDate;
                }
            }

            newData[poIndex] = updatedPO;

            const latestReceipt = poReceipts.sort((a, b) => new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime())[0];
            const receiptReceiverName = latestReceipt?.receiverName || 'Hệ thống';
            const user = latestReceipt?.receiverSystemId
                ? useEmployeeStore.getState().data.find(e => e.systemId === latestReceipt.receiverSystemId)
                : useEmployeeStore.getState().data.find(e => e.fullName === receiptReceiverName);

            const historyEntry = createHistoryEntry(
                'status_changed',
                `Cập nhật trạng thái giao hàng thành "${newDeliveryStatus}" thông qua phiếu nhập kho ${latestReceipt.id}.`,
                { systemId: user?.systemId || 'SYSTEM', name: receiptReceiverName },
                { oldValue: po.deliveryStatus, newValue: newDeliveryStatus, field: 'deliveryStatus' }
            );
            newData[poIndex] = {
                ...updatedPO,
                activityHistory: [...(updatedPO.activityHistory || []), historyEntry],
            };

            return { data: newData };
        }

        return state;
    });
};
