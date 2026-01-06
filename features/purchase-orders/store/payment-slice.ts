/**
 * Purchase Orders Store - Payment Slice
 * Payment-related operations
 * 
 * @module features/purchase-orders/store/payment-slice
 */

import type { 
    PurchaseOrder, 
    PurchaseOrderPayment, 
    PurchaseOrderStatus,
    PurchaseOrderPaymentStatus as PaymentStatus 
} from '@/lib/types/prisma-extended';
import { asSystemId } from '@/lib/id-types';
import { usePaymentStore } from '../../payments/store';
import { usePurchaseReturnStore } from '../../purchase-returns/store';
import { sumPaymentsForPurchaseOrder } from '../payment-utils';
import { baseStore } from './base-store';

// ============================================
// PAYMENT OPERATIONS
// ============================================

export const addPayment = (purchaseOrderId: string, payment: Omit<PurchaseOrderPayment, 'id'>) => {
    baseStore.setState(state => {
        const { data: allReturns } = usePurchaseReturnStore.getState();
        const newData = state.data.map(po => {
            if (po.systemId === purchaseOrderId) {
                const poSystemId = asSystemId(po.systemId);
                const newPayment: PurchaseOrderPayment = {
                    ...payment,
                    id: `PAY_${po.id}_${(po.payments || []).length + 1}`
                };
                const updatedPayments = [...(po.payments || []), newPayment];
                const totalPaid = updatedPayments.reduce((sum, p) => sum + p.amount, 0);

                const totalReturnedValue = allReturns
                    .filter(r => r.purchaseOrderSystemId === poSystemId)
                    .reduce((sum, r) => sum + r.totalReturnValue, 0);
                const actualDebt = po.grandTotal - totalReturnedValue;
                
                let newPaymentStatus: PurchaseOrder['paymentStatus'];
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
                
                return { ...po, payments: updatedPayments, paymentStatus: newPaymentStatus, status: newStatus };
            }
            return po;
        });
        return { data: newData };
    });
};

export const updatePaymentStatusForPoIds = (poIds: string[]) => {
    baseStore.setState(state => {
        const { data: allPayments } = usePaymentStore.getState();
        const { data: allReturns } = usePurchaseReturnStore.getState();
        const uniquePoIds = [...new Set(poIds)];
    
        const newData = [...state.data];
        let changed = false;

        uniquePoIds.forEach(poId => {
            const poIndex = newData.findIndex(p => p.id === poId);
            if (poIndex === -1) return;

            const po = newData[poIndex] as PurchaseOrder;
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
                newData[poIndex] = { ...po, paymentStatus: newPaymentStatus, status: newStatus };
                changed = true;
            }
        });

        return changed ? { data: newData } : state;
    });
};
