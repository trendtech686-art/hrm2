/**
 * Purchase Orders Store - Status Slice
 * Status management operations (sync, finish, cancel)
 * 
 * @module features/purchase-orders/store/status-slice
 */

import type { 
    PurchaseOrder, 
    PurchaseOrderStatus,
    PurchaseOrderPaymentStatus as PaymentStatus 
} from '@/lib/types/prisma-extended';
import type { Receipt } from '../../receipts/types';
import { asSystemId } from '@/lib/id-types';
import { toISODateTime } from '../../../lib/date-utils';
import { usePaymentStore } from '../../payments/store';
import { usePurchaseReturnStore } from '../../purchase-returns/store';
import { useReceiptStore } from '../../receipts/store';
import { useCashbookStore } from '../../cashbook/store';
import { useReceiptTypeStore } from '../../settings/receipt-types/store';
import { sumPaymentsForPurchaseOrder } from '../payment-utils';
import { createHistoryEntry } from './helpers';
import { baseStore } from './base-store';

// ============================================
// STATUS OPERATIONS
// ============================================

export const syncAllPurchaseOrderStatuses = () => {
    baseStore.setState(state => {
        const { data: allPayments } = usePaymentStore.getState();
        const { data: allReturns } = usePurchaseReturnStore.getState();
        const newData = state.data.map((po_untyped) => {
            const po = po_untyped as PurchaseOrder;
            const poSystemId = asSystemId(po.systemId);
            const totalPaid = sumPaymentsForPurchaseOrder(allPayments, po);
            
            const totalReturnedValue = allReturns
                .filter(r => r.purchaseOrderSystemId === poSystemId)
                .reduce((sum, r) => sum + r.totalReturnValue, 0);
            const actualDebt = po.grandTotal - totalReturnedValue;
            
            let newPaymentStatus: PaymentStatus;
            if (totalPaid >= actualDebt) {
                newPaymentStatus = 'Đã thanh toán';
            } else if (totalPaid > 0) {
                newPaymentStatus = 'Thanh toán một phần';
            } else {
                newPaymentStatus = 'Chưa thanh toán';
            }
            
            let newStatus: PurchaseOrderStatus = po.status;
            if (po.status !== 'Đã hủy' && po.status !== 'Kết thúc') {
                if (po.deliveryStatus === 'Đã nhập' && newPaymentStatus === 'Đã thanh toán') {
                    newStatus = 'Hoàn thành';
                } else if (po.deliveryStatus === 'Chưa nhập' && newPaymentStatus === 'Chưa thanh toán') {
                    newStatus = 'Đặt hàng';
                } else {
                    newStatus = 'Đang giao dịch';
                }
            }
            
            if (po.paymentStatus !== newPaymentStatus || po.status !== newStatus) {
                return { ...po, paymentStatus: newPaymentStatus, status: newStatus };
            }
            return po;
        });

        const hasChanged = newData.some((po, index) => po !== state.data[index]);
        return hasChanged ? { data: newData } : state;
    });
};

export const finishOrder = (systemId: string, userId: string, userName: string) => {
    baseStore.setState(state => {
        const poIndex = state.data.findIndex(p => p.systemId === systemId);
        if (poIndex === -1) return state;

        const po = state.data[poIndex];
        if (po.status === 'Kết thúc' || po.status === 'Đã hủy') return state;

        const historyEntry = createHistoryEntry(
            'ended',
            `Đã kết thúc đơn hàng.`,
            { systemId: userId, name: userName },
            { oldValue: po.status, newValue: 'Kết thúc', field: 'status' }
        );
        const updatedPO = { 
            ...po, 
            status: 'Kết thúc' as PurchaseOrderStatus,
            activityHistory: [...(po.activityHistory || []), historyEntry],
        };
        
        const newData = [...state.data];
        newData[poIndex] = updatedPO;
        return { data: newData };
    });
};

export const cancelOrder = (systemId: string, userId: string, userName: string) => {
    baseStore.setState((state) => {
        const po = state.data.find(p => p.systemId === systemId);

        if (!po || ['Hoàn thành', 'Đã hủy', 'Kết thúc'].includes(po.status)) {
            return state;
        }

        const { data: allPayments } = usePaymentStore.getState();
        const totalPaid = sumPaymentsForPurchaseOrder(allPayments, po);

        if (totalPaid > 0) {
            const { accounts } = useCashbookStore.getState();
            const { data: receiptTypes } = useReceiptTypeStore.getState();
            const { add: addReceipt } = useReceiptStore.getState();
            const refundCategory = receiptTypes.find(rt => rt.name === 'Nhà cung cấp hoàn tiền');
            const targetAccount = accounts.find(acc => acc.type === 'cash' && acc.branchSystemId === po.branchSystemId) || accounts.find(acc => acc.type === 'cash');

            if (refundCategory && targetAccount) {
                const newReceipt: Omit<Receipt, 'systemId'> = {
                    id: '' as Receipt['id'],
                    date: toISODateTime(new Date()),
                    amount: totalPaid,
                    payerTypeSystemId: asSystemId('NHACUNGCAP'),
                    payerTypeName: 'Nhà cung cấp',
                    payerName: po.supplierName,
                    payerSystemId: asSystemId(po.supplierSystemId),
                    description: `Nhận hoàn tiền từ NCC cho đơn hàng ${po.id} bị hủy.`,
                    paymentMethodSystemId: asSystemId('CASH'),
                    paymentMethodName: 'Tiền mặt',
                    accountSystemId: asSystemId(targetAccount.systemId),
                    paymentReceiptTypeSystemId: asSystemId(refundCategory.systemId),
                    paymentReceiptTypeName: refundCategory.name,
                    branchSystemId: asSystemId(po.branchSystemId),
                    branchName: po.branchName,
                    createdBy: asSystemId(userName),
                    createdAt: toISODateTime(new Date()),
                    status: 'completed',
                    category: 'other',
                    affectsDebt: true,
                    purchaseOrderSystemId: asSystemId(po.systemId),
                    purchaseOrderId: po.id as Receipt['purchaseOrderId'],
                    originalDocumentId: po.id as Receipt['originalDocumentId'],
                };
                addReceipt(newReceipt);
            } else {
                console.error("Không thể tạo phiếu thu hoàn tiền: Thiếu loại phiếu 'Nhà cung cấp hoàn tiền' hoặc tài khoản quỹ tiền mặt.");
            }
        }
        
        const historyEntry = createHistoryEntry(
            'cancelled',
            `Đã hủy đơn hàng.`,
            { systemId: userId, name: userName },
            { oldValue: po.status, newValue: 'Đã hủy', field: 'status' }
        );
        const updatedPO = { 
            ...po, 
            status: 'Đã hủy' as const,
            activityHistory: [...(po.activityHistory || []), historyEntry],
        };
        
        return { data: state.data.map(item => item.systemId === systemId ? updatedPO : item) };
    });
};

export const bulkCancel = (systemIds: string[], userId: string, userName: string) => {
    systemIds.forEach(systemId => {
        cancelOrder(systemId, userId, userName);
    });
};

export const printPurchaseOrders = (_systemIds: string[]) => {
    // Placeholder for print functionality
    // TODO: Implement actual print logic
};
