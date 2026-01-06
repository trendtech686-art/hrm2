/**
 * Order Store - Cancellation Slice
 * Order cancellation and refund handling
 * 
 * @module features/orders/store/cancellation-slice
 */

import { toISODateTime } from '../../../lib/date-utils';
import { toast } from 'sonner';
import type { Order, OrderPayment, OrderMainStatus, OrderDeliveryStatus, PackagingStatus, OrderPaymentStatus } from '@/lib/types/prisma-extended';
import type { SystemId } from '../../../lib/id-types';

import { useEmployeeStore } from '../../employees/store';
import { useCustomerStore } from '../../customers/store';
import { createPaymentDocument } from '../../finance/document-helpers';
import {
    getCurrentUserInfo,
    createHistoryEntry,
    appendHistoryEntry,
} from '../../../lib/activity-history-helper';

import { baseStore } from './base-store';
import {
    processLineItemStock,
    ensureCancellationAllowed,
} from './helpers';

// ============================================
// REFUND VOUCHER CREATION
// ============================================

const createOrderRefundVoucher = (order: Order, amount: number, employeeId: SystemId) => {
    const lastPositivePayment = [...(order.payments ?? [])].reverse().find(p => p.amount > 0);
    const { document, error } = createPaymentDocument({
        amount,
        description: `Hoàn tiền do hủy đơn ${order.id}`,
        recipientName: order.customerName,
        recipientSystemId: order.customerSystemId,
        customerSystemId: order.customerSystemId,
        customerName: order.customerName,
        branchSystemId: order.branchSystemId,
        branchName: order.branchName,
        createdBy: employeeId,
        paymentMethodName: lastPositivePayment?.method || 'Tiền mặt',
        paymentTypeName: 'Hoàn tiền khách hàng',
        originalDocumentId: order.id,
        linkedOrderSystemId: order.systemId,
        affectsDebt: true,
        category: 'other',
    });

    if (!document) {
        console.error('[cancelOrder] Không thể tạo phiếu chi hoàn tiền', error);
        return null;
    }

    return document;
};

// ============================================
// CANCELLATION SLICE
// ============================================

export const cancellationSlice = {
    cancelOrder: (
        systemId: SystemId,
        employeeId: SystemId,
        options?: { reason?: string; restock?: boolean }
    ) => {
        const { reason, restock = true } = options ?? {};
        const currentOrder = baseStore.getState().data.find(o => o.systemId === systemId);
        if (!ensureCancellationAllowed(currentOrder, 'hủy đơn hàng')) {
            return;
        }

        baseStore.setState(state => {
            const orderToCancel = state.data.find(o => o.systemId === systemId);
            if (!orderToCancel || orderToCancel.status === 'Đã hủy') {
                return state;
            }

            const employee = useEmployeeStore.getState().findById(employeeId as SystemId);
            const now = toISODateTime(new Date());
            const cancellationReason = (reason && reason.trim().length > 0)
                ? reason.trim()
                : orderToCancel.cancellationReason || `Hủy bởi ${employee?.fullName || 'Hệ thống'}`;

            // Uncommit stock
            if (restock) {
                orderToCancel.lineItems.forEach(item => {
                    processLineItemStock(item, orderToCancel.branchSystemId, 'uncommit', item.quantity);
                });
            }

            const hasDispatchedStock = orderToCancel.stockOutStatus === 'Xuất kho toàn bộ'
                || ['Chờ lấy hàng', 'Đang giao hàng', 'Đã giao hàng', 'Chờ giao lại'].includes(orderToCancel.deliveryStatus);

            // Return stock from transit
            if (restock && hasDispatchedStock) {
                orderToCancel.lineItems.forEach(item => {
                    processLineItemStock(item, orderToCancel.branchSystemId, 'return', item.quantity);
                });
            }

            const existingPayments = orderToCancel.payments ?? [];
            const netCollected = existingPayments.reduce((sum, payment) => sum + payment.amount, 0);
            let refundPaymentEntry: OrderPayment | null = null;
            const refundAmount = netCollected > 0 ? netCollected : 0;

            if (refundAmount > 0) {
                const refundVoucher = createOrderRefundVoucher(orderToCancel, refundAmount, employeeId);
                if (!refundVoucher) {
                    toast.error('Không thể tạo phiếu chi hoàn tiền. Vui lòng kiểm tra cấu hình tài chính trước khi hủy đơn.');
                    return state;
                }

                refundPaymentEntry = {
                    systemId: refundVoucher.systemId,
                    id: refundVoucher.id,
                    date: refundVoucher.date,
                    amount: -refundAmount,
                    method: refundVoucher.paymentMethodName,
                    createdBy: employeeId,
                    description: `Hoàn tiền khi hủy đơn ${orderToCancel.id}`,
                };
            }

            const updatedPayments = refundPaymentEntry ? [...existingPayments, refundPaymentEntry] : existingPayments;
            const updatedPaidAmount = Math.max(0, (orderToCancel.paidAmount ?? 0) - refundAmount);
            const updatedPackagings = orderToCancel.packagings.map(pkg => {
                if (pkg.status === 'Hủy đóng gói' && pkg.deliveryStatus === 'Đã hủy') {
                    return pkg;
                }
                return {
                    ...pkg,
                    status: 'Hủy đóng gói' as PackagingStatus,
                    deliveryStatus: 'Đã hủy' as OrderDeliveryStatus,
                    cancelDate: now,
                    cancelReason: pkg.cancelReason ?? cancellationReason,
                    cancelingEmployeeId: employeeId,
                    cancelingEmployeeName: employee?.fullName || 'Hệ thống',
                };
            });

            const updatedOrder = {
                ...orderToCancel,
                status: 'Đã hủy' as OrderMainStatus,
                cancelledDate: now,
                cancellationReason,
                deliveryStatus: 'Đã hủy' as OrderDeliveryStatus,
                stockOutStatus: restock ? 'Chưa xuất kho' as const : orderToCancel.stockOutStatus,
                payments: updatedPayments,
                paidAmount: updatedPaidAmount,
                paymentStatus: refundPaymentEntry ? 'Chưa thanh toán' as OrderPaymentStatus : orderToCancel.paymentStatus,
                packagings: updatedPackagings,
                cancellationMetadata: {
                    restockItems: restock,
                    notifyCustomer: false,
                    emailNotifiedAt: undefined,
                },
                activityHistory: appendHistoryEntry(
                    orderToCancel.activityHistory,
                    createHistoryEntry(
                        'cancelled',
                        getCurrentUserInfo(),
                        `${employee?.fullName || 'Hệ thống'} đã hủy đơn hàng. Lý do: ${cancellationReason}${refundAmount > 0 ? `. Hoàn tiền: ${refundAmount.toLocaleString('vi-VN')}đ` : ''}`
                    )
                ),
            };

            // Remove debt transaction from customer
            useCustomerStore.getState().removeDebtTransaction(orderToCancel.customerSystemId, orderToCancel.id);

            return { data: state.data.map(o => (o.systemId === systemId ? updatedOrder : o)) };
        });
    },
};
