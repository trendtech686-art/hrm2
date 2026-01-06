/**
 * Sales Returns Store - Add Slice
 * Main add operation with all side effects
 * 
 * @module features/sales-returns/store/add-slice
 */

import type { SalesReturn } from '@/lib/types/prisma-extended';
import type { SystemId } from '../../../lib/id-types';
import { asBusinessId } from '../../../lib/id-types';

import { useOrderStore } from '../../orders/store';
import { useCustomerStore } from '../../customers/store';
import { baseStore, originalAdd } from './base-store';
import { formatSalesReturnData } from './helpers';
import { createExchangeOrder } from './exchange-slice';
import { createRefundVouchers, createReceiptVouchers } from './voucher-slice';
import { updateInventoryForReturn } from './inventory-slice';

// ============================================
// ADD WITH SIDE EFFECTS
// ============================================

export const addSlice = {
    /**
     * Add a sales return with all necessary side effects:
     * - Create the sales return record
     * - Update customer return stats
     * - Create exchange order if needed
     * - Adjust customer debt
     * - Create payment/receipt vouchers
     * - Update inventory (if items received)
     * - Update original order's return status
     */
    addWithSideEffects: (item: Omit<SalesReturn, 'systemId' | 'id'> & { creatorId: string }): { 
        newReturn: SalesReturn | null; 
        newOrderSystemId: SystemId | null 
    } => {
        // Format input data
        const formatted = formatSalesReturnData(item);

        // Prepare new item data
        const newItemData: Omit<SalesReturn, 'systemId'> = {
            id: asBusinessId(''),
            orderSystemId: formatted.orderSystemId,
            orderId: formatted.orderBusinessId,
            customerSystemId: formatted.customerSystemId,
            customerName: item.customerName,
            branchSystemId: formatted.branchSystemId,
            branchName: item.branchName,
            returnDate: item.returnDate,
            reason: item.reason,
            note: item.note,
            notes: item.notes,
            reference: item.reference,
            items: formatted.formattedItems,
            totalReturnValue: item.totalReturnValue,
            isReceived: item.isReceived,
            exchangeItems: item.exchangeItems ?? [],
            exchangeOrderSystemId: formatted.exchangeOrderSystemId,
            subtotalNew: item.subtotalNew,
            shippingFeeNew: item.shippingFeeNew,
            discountNew: item.discountNew,
            discountNewType: item.discountNewType,
            grandTotalNew: item.grandTotalNew,
            deliveryMethod: item.deliveryMethod,
            shippingPartnerId: item.shippingPartnerId,
            shippingServiceId: item.shippingServiceId,
            shippingAddress: item.shippingAddress,
            packageInfo: item.packageInfo,
            configuration: item.configuration,
            finalAmount: item.finalAmount,
            refundMethod: item.refundMethod,
            refundAmount: item.refundAmount,
            accountSystemId: formatted.accountSystemId,
            refunds: formatted.formattedRefunds,
            payments: formatted.formattedPayments,
            paymentVoucherSystemId: formatted.paymentVoucherSystemId,
            paymentVoucherSystemIds: formatted.paymentVoucherSystemIds,
            receiptVoucherSystemIds: formatted.receiptVoucherSystemIds,
            creatorSystemId: formatted.creatorSystemId,
            creatorName: item.creatorName,
        };

        // Get related stores
        const { update: updateOrder, findById: findOrderById } = useOrderStore.getState();
        const { updateDebt, incrementReturnStats } = useCustomerStore.getState();

        // Find original order
        const order = findOrderById(newItemData.orderSystemId);
        if (!order) {
            return { newReturn: null, newOrderSystemId: null };
        }

        // ============================================
        // 1. CREATE THE RETURN
        // ============================================
        const newReturn = originalAdd(newItemData);
        if (!newReturn) {
            return { newReturn: null, newOrderSystemId: null };
        }

        // ============================================
        // 2. UPDATE CUSTOMER RETURN STATS
        // ============================================
        const totalReturnQty = newItemData.items.reduce((sum, item) => sum + item.returnQuantity, 0);
        if (totalReturnQty > 0) {
            incrementReturnStats(newItemData.customerSystemId, totalReturnQty);
        }

        // ============================================
        // 3. CREATE EXCHANGE ORDER (if applicable)
        // ============================================
        let newOrderSystemId: SystemId | undefined;
        if (newItemData.exchangeItems && newItemData.exchangeItems.length > 0) {
            newOrderSystemId = createExchangeOrder({
                newReturn,
                newItemData,
                order,
                creatorSystemId: formatted.creatorSystemId,
            });

            // Update sales return with exchange order ID
            if (newOrderSystemId) {
                baseStore.getState().update(newReturn.systemId, {
                    ...newReturn,
                    exchangeOrderSystemId: newOrderSystemId,
                });
            }
        }

        // ============================================
        // 4. ADJUST CUSTOMER DEBT
        // ============================================
        const creditAmount = newItemData.totalReturnValue - newItemData.grandTotalNew - (newItemData.refundAmount || 0);
        if (creditAmount > 0) {
            updateDebt(newItemData.customerSystemId, -creditAmount);
        }

        // ============================================
        // 5. CREATE VOUCHERS
        // ============================================
        const finalAmount = newItemData.finalAmount;

        if (finalAmount < 0 && newItemData.refunds && newItemData.refunds.length > 0) {
            // Customer gets refund
            createRefundVouchers({
                newReturn,
                newItemData,
                order,
                creatorSystemId: formatted.creatorSystemId,
            });
        } else if (finalAmount > 0 && newItemData.payments && newItemData.payments.length > 0) {
            // Customer pays difference
            createReceiptVouchers({
                newReturn,
                newItemData,
                order,
                creatorSystemId: formatted.creatorSystemId,
            });
        }

        // ============================================
        // 6. UPDATE INVENTORY (if received)
        // ============================================
        updateInventoryForReturn(newReturn);

        // ============================================
        // 7. UPDATE ORDER RETURN STATUS
        // ============================================
        const previousReturnsForOrder = baseStore.getState().data.filter(
            r => r.orderSystemId === order.systemId
        );
        const totalReturnedQty = previousReturnsForOrder
            .flatMap(r => r.items)
            .reduce((sum, item) => sum + item.returnQuantity, 0);
        const totalOrderedQty = order.lineItems.reduce((sum, item) => sum + item.quantity, 0);
        const newReturnStatus = totalReturnedQty >= totalOrderedQty 
            ? 'Trả hàng toàn bộ' 
            : 'Trả hàng một phần';
        
        updateOrder(order.systemId, { ...order, returnStatus: newReturnStatus });

        return { 
            newReturn, 
            newOrderSystemId: newOrderSystemId ?? null 
        };
    },
};
