/**
 * Sales Returns Store - Exchange Order Slice
 * Handles creation of exchange orders when processing returns
 * 
 * @module features/sales-returns/store/exchange-slice
 */

import { formatDateCustom, getCurrentDate } from '@/lib/date-utils';
import type { SalesReturn, Order } from '@/lib/types/prisma-extended';
import type { SystemId } from '../../../lib/id-types';
import { asSystemId, asBusinessId } from '../../../lib/id-types';

import { useOrderStore } from '../../orders/store';
import { createExchangeOrderPackagings } from './helpers';

// ============================================
// EXCHANGE ORDER CREATION
// ============================================

export type CreateExchangeOrderParams = {
    newReturn: SalesReturn;
    newItemData: Omit<SalesReturn, 'systemId'>;
    order: Order;
    creatorSystemId: SystemId;
};

/**
 * Create exchange order for sales return with exchange items
 * Returns the new order's systemId if created, undefined otherwise
 */
export const createExchangeOrder = (params: CreateExchangeOrderParams): SystemId | undefined => {
    const { newReturn, newItemData, order, creatorSystemId } = params;

    if (!newItemData.exchangeItems || newItemData.exchangeItems.length === 0) {
        return undefined;
    }

    const { add: addOrder } = useOrderStore.getState();

    // Calculate payments for exchange order
    const exchangeOrderPayments =
        newItemData.finalAmount > 0 && newItemData.payments
            ? newItemData.payments.map((p, index) => ({
                systemId: asSystemId(`PAYMENT-${Date.now()}-${index}`),
                id: asBusinessId(`PAY-${Date.now()}-${index}`),
                date: formatDateCustom(getCurrentDate(), 'yyyy-MM-dd'),
                method: p.method,
                amount: p.amount,
                createdBy: creatorSystemId,
                description: 'Thanh toán đơn đổi hàng',
            }))
            : [];

    // Create packagings based on delivery method
    const { packagings, finalMainStatus, finalDeliveryStatus } = createExchangeOrderPackagings(
        newItemData,
        creatorSystemId,
        newItemData.creatorName
    );

    const newOrderPayload = {
        id: asBusinessId(''), // Empty string triggers auto-generation
        customerSystemId: order.customerSystemId,
        customerName: order.customerName,
        branchSystemId: order.branchSystemId,
        branchName: order.branchName,
        salespersonSystemId: creatorSystemId,
        salesperson: newItemData.creatorName,
        orderDate: formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm'),
        lineItems: newItemData.exchangeItems,
        subtotal: newItemData.subtotalNew,
        shippingFee: newItemData.shippingFeeNew,
        tax: 0,
        grandTotal: newItemData.finalAmount > 0 ? newItemData.finalAmount : newItemData.grandTotalNew,
        paidAmount: exchangeOrderPayments.reduce((sum, p) => sum + p.amount, 0),
        linkedSalesReturnId: newReturn.id,
        linkedSalesReturnSystemId: newReturn.systemId,
        linkedSalesReturnValue: newItemData.totalReturnValue,
        payments: exchangeOrderPayments,
        notes: `Đơn hàng đổi từ phiếu trả ${newReturn.id} của đơn hàng ${order.id}`,
        sourceSalesReturnId: newReturn.id,
        deliveryMethod: (newItemData.deliveryMethod === 'pickup' 
            ? 'Nhận tại cửa hàng' 
            : 'Dịch vụ giao hàng') as 'Nhận tại cửa hàng' | 'Dịch vụ giao hàng',
        shippingPartnerId: newItemData.shippingPartnerId,
        shippingServiceId: newItemData.shippingServiceId,
        shippingAddress: newItemData.shippingAddress,
        packageInfo: newItemData.packageInfo,
        configuration: newItemData.configuration,
        status: finalMainStatus,
        paymentStatus: (exchangeOrderPayments.length > 0
            ? (exchangeOrderPayments.reduce((sum, p) => sum + p.amount, 0) >= newItemData.grandTotalNew
                ? 'Thanh toán toàn bộ'
                : 'Thanh toán 1 phần')
            : 'Chưa thanh toán') as 'Chưa thanh toán' | 'Thanh toán 1 phần' | 'Thanh toán toàn bộ',
        deliveryStatus: finalDeliveryStatus,
        printStatus: 'Chưa in' as const,
        stockOutStatus: 'Chưa xuất kho' as const,
        returnStatus: 'Chưa trả hàng' as const,
        codAmount: 0,
        packagings: packagings,
    };

    const newOrder = addOrder(newOrderPayload);

    if (newOrder) {
        return asSystemId(newOrder.systemId);
    } else {
        console.error('❌ [Sales Return] Failed to create exchange order!');
        return undefined;
    }
};
