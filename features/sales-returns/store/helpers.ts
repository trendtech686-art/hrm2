/**
 * Sales Returns Store - Helper Functions & Constants
 * Shared utilities used across all sales return store slices
 * 
 * @module features/sales-returns/store/helpers
 */

import { formatDateCustom, getCurrentDate } from '@/lib/date-utils';
import type { SalesReturn, ReturnLineItem, Packaging, OrderDeliveryStatus } from '@/lib/types/prisma-extended';
import type { SystemId } from '../../../lib/id-types';
import { asSystemId, asBusinessId } from '../../../lib/id-types';
import { generateSystemId, getMaxSystemIdCounter } from '../../../lib/id-utils';

import { useProductStore } from '../../products/store';
import { useOrderStore } from '../../orders/store';
import { useShippingPartnerStore } from '../../settings/shipping/store';
import { isComboProduct } from '../../products/combo-utils';

// ============================================
// CONSTANTS
// ============================================

export const PACKAGING_SYSTEM_ID_PREFIX = 'PACKAGE';

// ============================================
// RE-EXPORTS for convenience
// ============================================

export { useProductStore } from '../../products/store';
export { useOrderStore } from '../../orders/store';
export { useStockHistoryStore } from '../../stock-history/store';
export { useCustomerStore } from '../../customers/store';
export { useShippingPartnerStore } from '../../settings/shipping/store';
export { createPaymentDocument, createReceiptDocument } from '../../finance/document-helpers';

// ============================================
// STOCK HELPERS
// ============================================

/**
 * Expand combo return items to child products
 * When a combo is returned, we need to add stock back to child products
 */
export const getReturnStockItems = (returnItems: ReturnLineItem[]) => {
    const { findById } = useProductStore.getState();
    const expandedItems: { productSystemId: SystemId; productName: string; quantity: number }[] = [];
    
    returnItems.forEach(item => {
        const product = findById(item.productSystemId);
        if (product && isComboProduct(product) && product.comboItems) {
            // Combo → expand to child products
            product.comboItems.forEach(comboItem => {
                const childProduct = findById(comboItem.productSystemId);
                expandedItems.push({
                    productSystemId: comboItem.productSystemId,
                    productName: childProduct?.name || 'SP không xác định',
                    quantity: comboItem.quantity * item.returnQuantity
                });
            });
        } else {
            // Regular product
            expandedItems.push({
                productSystemId: asSystemId(item.productSystemId),
                productName: item.productName,
                quantity: item.returnQuantity
            });
        }
    });
    return expandedItems;
};

// ============================================
// PACKAGING HELPERS
// ============================================

let packagingCounter = 0;

export const initPackagingCounter = () => {
    const allOrders = useOrderStore.getState().data;
    const allPackagings = allOrders.flatMap(o => o.packagings || []);
    packagingCounter = getMaxSystemIdCounter(allPackagings, PACKAGING_SYSTEM_ID_PREFIX);
};

export const getNextPackagingSystemId = (): SystemId => {
    packagingCounter++;
    return asSystemId(generateSystemId('packaging', packagingCounter));
};

// ============================================
// EXCHANGE ORDER HELPERS
// ============================================

export type ExchangeOrderPayload = {
    newReturn: SalesReturn;
    newItemData: Omit<SalesReturn, 'systemId'>;
    order: ReturnType<ReturnType<typeof useOrderStore.getState>['findById']>;
    creatorSystemId: SystemId;
};

/**
 * Create packagings for exchange order based on delivery method
 */
export const createExchangeOrderPackagings = (
    newItemData: Omit<SalesReturn, 'systemId'>,
    creatorSystemId: SystemId,
    creatorName: string
): { packagings: Packaging[]; finalMainStatus: 'Đặt hàng' | 'Đang giao dịch'; finalDeliveryStatus: OrderDeliveryStatus } => {
    const now = formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm');
    const packagings: Packaging[] = [];
    let finalMainStatus: 'Đặt hàng' | 'Đang giao dịch' = 'Đặt hàng';
    let finalDeliveryStatus: OrderDeliveryStatus = 'Chờ đóng gói';

    // Initialize counter before creating packagings
    initPackagingCounter();

    const isPickup = newItemData.deliveryMethod === 'pickup';
    const isShippingPartner = newItemData.shippingPartnerId && newItemData.shippingServiceId;

    if (isPickup) {
        // Nhận tại cửa hàng - Tạo packaging request ngay
        finalMainStatus = 'Đang giao dịch';
        finalDeliveryStatus = 'Chờ đóng gói';
        packagings.push({
            systemId: getNextPackagingSystemId(),
            id: asBusinessId(''),
            requestDate: now,
            requestingEmployeeId: creatorSystemId,
            requestingEmployeeName: creatorName,
            status: 'Chờ đóng gói',
            printStatus: 'Chưa in',
            deliveryStatus: 'Chờ đóng gói',
        });
    } else if (isShippingPartner) {
        // Đẩy qua hãng vận chuyển - Tạo packaging đã đóng gói với tracking
        finalMainStatus = 'Đang giao dịch';
        finalDeliveryStatus = 'Chờ lấy hàng';

        // Get partner info
        const { data: partners } = useShippingPartnerStore.getState();
        const partner = partners.find(p => p.systemId === newItemData.shippingPartnerId);
        const service = partner?.services.find(s => s.id === newItemData.shippingServiceId);

        packagings.push({
            systemId: getNextPackagingSystemId(),
            id: asBusinessId(''),
            requestDate: now,
            confirmDate: now,
            requestingEmployeeId: creatorSystemId,
            requestingEmployeeName: creatorName,
            confirmingEmployeeId: creatorSystemId,
            confirmingEmployeeName: creatorName,
            status: 'Đã đóng gói',
            deliveryStatus: 'Chờ lấy hàng',
            printStatus: 'Chưa in',
            deliveryMethod: 'Dịch vụ giao hàng',
            carrier: partner?.name,
            service: service?.name,
            trackingCode: (newItemData.packageInfo as unknown as Record<string, unknown>)?.trackingCode as string || `VC${Date.now()}`,
            shippingFeeToPartner: newItemData.shippingFeeNew,
            codAmount: 0,
            payer: 'Người nhận',
            weight: newItemData.packageInfo?.weight,
            dimensions: `${newItemData.packageInfo?.length || 0}x${newItemData.packageInfo?.width || 0}x${newItemData.packageInfo?.height || 0}`,
        });
    }
    // else: deliver-later → keep default 'Đặt hàng', 'Chờ đóng gói', no packagings

    return { packagings, finalMainStatus, finalDeliveryStatus };
};

// ============================================
// FORMATTING HELPERS
// ============================================

export const formatSalesReturnData = (item: Omit<SalesReturn, 'systemId' | 'id'> & { creatorId: string }) => {
    const orderSystemId = asSystemId(item.orderSystemId);
    const orderBusinessId = asBusinessId(item.orderId);
    const customerSystemId = asSystemId(item.customerSystemId);
    const branchSystemId = asSystemId(item.branchSystemId);
    const creatorSystemId = asSystemId(item.creatorSystemId ?? item.creatorId ?? 'SYSTEM');
    const exchangeOrderSystemId = item.exchangeOrderSystemId ? asSystemId(item.exchangeOrderSystemId) : undefined;
    const accountSystemId = item.accountSystemId ? asSystemId(item.accountSystemId) : undefined;
    const paymentVoucherSystemId = item.paymentVoucherSystemId ? asSystemId(item.paymentVoucherSystemId) : undefined;
    const paymentVoucherSystemIds = item.paymentVoucherSystemIds?.map(asSystemId);
    const receiptVoucherSystemIds = item.receiptVoucherSystemIds?.map(asSystemId);

    const formattedItems = item.items.map(lineItem => ({
        ...lineItem,
        productSystemId: asSystemId(lineItem.productSystemId),
        productId: asBusinessId(lineItem.productId),
    }));

    const formattedPayments = item.payments?.map(payment => ({
        ...payment,
        accountSystemId: asSystemId(payment.accountSystemId),
    }));

    const formattedRefunds = item.refunds?.map(refund => ({
        ...refund,
        accountSystemId: asSystemId(refund.accountSystemId),
    }));

    return {
        orderSystemId,
        orderBusinessId,
        customerSystemId,
        branchSystemId,
        creatorSystemId,
        exchangeOrderSystemId,
        accountSystemId,
        paymentVoucherSystemId,
        paymentVoucherSystemIds,
        receiptVoucherSystemIds,
        formattedItems,
        formattedPayments,
        formattedRefunds,
    };
};
