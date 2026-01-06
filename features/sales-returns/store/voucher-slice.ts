/**
 * Sales Returns Store - Voucher Slice
 * Handles creation of payment and receipt vouchers for returns
 * 
 * @module features/sales-returns/store/voucher-slice
 */

import { toast } from 'sonner';
import type { SalesReturn } from '@/lib/types/prisma-extended';
import type { SystemId } from '../../../lib/id-types';
import { asSystemId } from '../../../lib/id-types';

import { createPaymentDocument, createReceiptDocument } from '../../finance/document-helpers';
import { baseStore } from './base-store';

// ============================================
// REFUND VOUCHER CREATION
// ============================================

export type CreateRefundVouchersParams = {
    newReturn: SalesReturn;
    newItemData: Omit<SalesReturn, 'systemId'>;
    order: { id: string };
    creatorSystemId: SystemId;
};

/**
 * Create payment vouchers for customer refunds (when finalAmount < 0)
 */
export const createRefundVouchers = (params: CreateRefundVouchersParams): SystemId[] => {
    const { newReturn, newItemData, order, creatorSystemId } = params;
    const createdVoucherIds: SystemId[] = [];

    if (!newItemData.refunds || newItemData.refunds.length === 0) {
        return createdVoucherIds;
    }

    newItemData.refunds.forEach(refund => {
        if (!refund.amount || refund.amount <= 0) {
            return;
        }

        const { document, error } = createPaymentDocument({
            amount: refund.amount,
            description: `Hoàn tiền đổi/trả hàng từ đơn ${order.id} (Phiếu: ${newReturn.id}) qua ${refund.method}`,
            recipientName: newItemData.customerName,
            recipientSystemId: newItemData.customerSystemId,
            customerSystemId: newItemData.customerSystemId,
            customerName: newItemData.customerName,
            paymentMethodName: refund.method,
            accountSystemId: refund.accountSystemId,
            paymentTypeName: 'Hoàn tiền khách hàng',
            branchSystemId: newReturn.branchSystemId,
            branchName: newReturn.branchName,
            createdBy: creatorSystemId,
            originalDocumentId: newReturn.id,
            linkedSalesReturnSystemId: newReturn.systemId,
            linkedOrderSystemId: newReturn.orderSystemId,
            category: 'complaint_refund',
            affectsDebt: true, // Hoàn tiền khách hàng ảnh hưởng công nợ
        });

        if (error) {
            console.error('[Sales Return] Failed to create payment voucher:', error);
            toast.error(`Không thể tạo phiếu chi hoàn tiền: ${error}`);
            return;
        }

        if (document) {
            createdVoucherIds.push(asSystemId(document.systemId));
        }
    });

    // Update sales return with created voucher IDs
    if (createdVoucherIds.length > 0) {
        baseStore.getState().update(newReturn.systemId, {
            ...newReturn,
            paymentVoucherSystemIds: createdVoucherIds,
        });
    }

    return createdVoucherIds;
};

// ============================================
// RECEIPT VOUCHER CREATION
// ============================================

export type CreateReceiptVouchersParams = {
    newReturn: SalesReturn;
    newItemData: Omit<SalesReturn, 'systemId'>;
    order: { id: string };
    creatorSystemId: SystemId;
};

/**
 * Create receipt vouchers for customer payments (when finalAmount > 0)
 */
export const createReceiptVouchers = (params: CreateReceiptVouchersParams): SystemId[] => {
    const { newReturn, newItemData, order, creatorSystemId } = params;
    const createdVoucherIds: SystemId[] = [];

    if (!newItemData.payments || newItemData.payments.length === 0) {
        return createdVoucherIds;
    }

    newItemData.payments.forEach(payment => {
        if (!payment.amount || payment.amount <= 0) {
            return;
        }

        const { document, error } = createReceiptDocument({
            amount: payment.amount,
            description: `Thu tiền chênh lệch đổi hàng từ đơn ${order.id} (Phiếu: ${newReturn.id})`,
            customerName: newReturn.customerName,
            customerSystemId: newItemData.customerSystemId,
            paymentMethodName: payment.method,
            accountSystemId: payment.accountSystemId,
            receiptTypeName: 'Thanh toán cho đơn hàng',
            branchSystemId: newReturn.branchSystemId,
            branchName: newReturn.branchName,
            createdBy: creatorSystemId,
            originalDocumentId: newReturn.id,
            linkedSalesReturnSystemId: newReturn.systemId,
            linkedOrderSystemId: newReturn.orderSystemId,
            category: 'sale',
            affectsDebt: false,
        });

        if (error) {
            console.error('[Sales Return] Failed to create receipt voucher:', error);
            toast.error(`Không thể tạo phiếu thu đổi hàng: ${error}`);
            return;
        }

        if (document) {
            createdVoucherIds.push(asSystemId(document.systemId));
        }
    });

    // Update sales return with created voucher IDs
    if (createdVoucherIds.length > 0) {
        baseStore.getState().update(newReturn.systemId, {
            ...newReturn,
            receiptVoucherSystemIds: createdVoucherIds,
        });
    }

    return createdVoucherIds;
};
