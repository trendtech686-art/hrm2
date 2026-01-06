/**
 * Order Store - Payment Slice
 * Payment handling and receipt auto-allocation
 * 
 * @module features/orders/store/payment-slice
 */

import type { Order, OrderPayment } from '@/lib/types/prisma-extended';
import { toast } from 'sonner';
import type { SystemId } from '../../../lib/id-types';
import { asSystemId } from '../../../lib/id-types';

import { useEmployeeStore } from '../../employees/store';
import { useReceiptStore } from '../../receipts/store';
import type { Receipt, ReceiptOrderAllocation } from '../../receipts/types';
import { createReceiptDocument } from '../../finance/document-helpers';
import {
    getCurrentUserInfo,
    createHistoryEntry,
    appendHistoryEntry,
} from '../../../lib/activity-history-helper';

import { baseStore } from './base-store';
import {
    applyPaymentToOrder,
    getOrderOutstandingAmount,
} from './helpers';

// ============================================
// RECEIPT AUTO-ALLOCATION
// ============================================

const shouldAutoAllocateReceipt = (receipt: Receipt): boolean => {
    return (
        receipt.status === 'completed' &&
        receipt.affectsDebt &&
        !!receipt.customerSystemId &&
        !receipt.linkedOrderSystemId
    );
};

const getAllocatedAmount = (receipt: Receipt): number => {
    return receipt.orderAllocations?.reduce((sum, allocation) => sum + allocation.amount, 0) ?? 0;
};

export const autoAllocateReceiptToOrders = (receipt: Receipt) => {
    if (!shouldAutoAllocateReceipt(receipt)) {
        return;
    }

    const remainingAmount = receipt.amount - getAllocatedAmount(receipt);
    if (remainingAmount <= 0) {
        return;
    }

    const candidateOrders = baseStore.getState().data
        .filter(order => order.customerSystemId === receipt.customerSystemId && order.status !== 'Đã hủy')
        .map(order => ({ order, outstanding: getOrderOutstandingAmount(order) }))
        .filter(entry => entry.outstanding > 0)
        .sort((a, b) => {
            const aTime = a.order.orderDate ? new Date(a.order.orderDate).getTime() : 0;
            const bTime = b.order.orderDate ? new Date(b.order.orderDate).getTime() : 0;
            return aTime - bTime;
        });

    if (!candidateOrders.length) {
        return;
    }

    let amountToDistribute = remainingAmount;
    const updatedOrders = new Map<SystemId, Order>();
    const allocationEntries: ReceiptOrderAllocation[] = [];

    for (const { order } of candidateOrders) {
        if (amountToDistribute <= 0) {
            break;
        }

        const currentOrderState = updatedOrders.get(order.systemId) ?? order;
        const outstanding = getOrderOutstandingAmount(currentOrderState);
        if (outstanding <= 0) {
            continue;
        }

        const allocationAmount = Math.min(outstanding, amountToDistribute);
        if (allocationAmount <= 0) {
            continue;
        }

        const paymentEntry: OrderPayment = {
            systemId: receipt.systemId,
            id: receipt.id,
            date: receipt.date,
            amount: allocationAmount,
            method: receipt.paymentMethodName,
            createdBy: asSystemId(receipt.createdBy),
            description: receipt.description ?? `Thanh toán từ phiếu thu ${receipt.id}`,
        };

        const updatedOrder = applyPaymentToOrder(currentOrderState, paymentEntry);
        updatedOrders.set(order.systemId, updatedOrder);
        allocationEntries.push({
            orderSystemId: order.systemId,
            orderId: order.id,
            amount: allocationAmount,
        });

        amountToDistribute -= allocationAmount;
    }

    if (!allocationEntries.length) {
        return;
    }

    baseStore.setState(state => {
        const data = state.data.map(order => updatedOrders.get(order.systemId) ?? order);
        return { data };
    });

    const receiptStore = useReceiptStore.getState();
    const latestReceipt = receiptStore.findById(receipt.systemId);
    if (!latestReceipt) {
        return;
    }

    receiptStore.update(receipt.systemId, {
        ...latestReceipt,
        orderAllocations: [...(latestReceipt.orderAllocations ?? []), ...allocationEntries],
    });
};

// ============================================
// PAYMENT SLICE
// ============================================

export const paymentSlice = {
    addPayment: (orderSystemId: SystemId, paymentData: { amount: number; method: string }, employeeId: SystemId) => {
        const order = baseStore.getState().findById(orderSystemId as SystemId);
        const employee = useEmployeeStore.getState().findById(employeeId as SystemId);

        if (!order || !employee) {
            console.error("Order or employee not found for payment.");
            return;
        }

        const { document: createdReceipt, error } = createReceiptDocument({
            amount: paymentData.amount,
            description: `Thanh toán cho đơn hàng ${order.id}`,
            customerName: order.customerName,
            customerSystemId: order.customerSystemId,
            branchSystemId: order.branchSystemId,
            branchName: order.branchName,
            createdBy: employeeId,
            paymentMethodName: paymentData.method,
            receiptTypeName: 'Thanh toán cho đơn hàng',
            originalDocumentId: order.id,
            linkedOrderSystemId: order.systemId,
            affectsDebt: true,
        });

        if (!createdReceipt) {
            console.error('Failed to create receipt', error);
            toast.error('Không thể tạo phiếu thu cho đơn hàng. Vui lòng kiểm tra cấu hình chứng từ.');
            return;
        }

        baseStore.setState(state => {
            const orderIndex = state.data.findIndex(o => o.systemId === orderSystemId);
            if (orderIndex === -1) return state;

            const orderToUpdate = state.data[orderIndex];
            const newPayment: OrderPayment = {
                systemId: createdReceipt.systemId,
                id: createdReceipt.id,
                date: createdReceipt.date,
                amount: createdReceipt.amount,
                method: createdReceipt.paymentMethodName,
                createdBy: asSystemId(createdReceipt.createdBy),
                description: createdReceipt.description,
            };

            const updatedOrder = applyPaymentToOrder(orderToUpdate, newPayment);
            
            updatedOrder.activityHistory = appendHistoryEntry(
                orderToUpdate.activityHistory,
                createHistoryEntry(
                    'payment_made',
                    getCurrentUserInfo(),
                    `${employee?.fullName || 'Nhân viên'} đã thanh toán ${paymentData.amount.toLocaleString('vi-VN')}đ bằng ${paymentData.method}`
                )
            );
            
            const newData = [...state.data];
            newData[orderIndex] = updatedOrder;

            return { data: newData };
        });
    },
};

// ============================================
// RECEIPT SUBSCRIPTION
// ============================================

// Auto-allocate historical receipts on startup
useReceiptStore.getState().data.forEach(receipt => {
    autoAllocateReceiptToOrders(receipt);
});

// React to newly created receipts
useReceiptStore.subscribe(
    state => state.data,
    (currentReceipts, previousReceipts) => {
        const previousIds = new Set((previousReceipts ?? []).map(r => r.systemId));
        currentReceipts.forEach(receipt => {
            if (!previousIds.has(receipt.systemId)) {
                autoAllocateReceiptToOrders(receipt);
            }
        });
    }
);
