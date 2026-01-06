/**
 * Order Store - Helper Functions & Constants
 * Shared utilities used across all order store slices
 * 
 * @module features/orders/store/helpers
 */

import type { Order, Packaging, OrderPayment, OrderPaymentStatus } from '@/lib/types/prisma-extended';
import { toast } from 'sonner';
import type { SystemId, BusinessId } from '../../../lib/id-types';
import { asSystemId, asBusinessId } from '../../../lib/id-types';
import { generateSystemId, getMaxSystemIdCounter } from '../../../lib/id-utils';
import { toISODateTime } from '../../../lib/date-utils';

import { useProductStore } from '../../products/store';
import { isComboProduct } from '../../products/combo-utils';
import { useCustomerStore } from '../../customers/store';
import { useSalesReturnStore } from '../../sales-returns/store';
import { useSalesManagementSettingsStore } from '../../settings/sales/sales-management-store';

// ============================================
// CONSTANTS
// ============================================

export const IN_STORE_PICKUP_PREFIX = 'INSTORE';
export const PACKAGING_CODE_PREFIX = 'DG';
export const PACKAGING_SYSTEM_ID_PREFIX = 'PACKAGE';

export const deliveryStatusesBlockedForCancellation: readonly string[] = [
    'Đang giao hàng',
    'Đã giao hàng',
    'Chờ giao lại',
];

// ============================================
// PACKAGING ID HELPERS
// ============================================

let packagingSystemIdCounter = 0;

export const initPackagingCounter = (orders: Order[]): void => {
    const allPackagings = orders.flatMap(o => o.packagings || []);
    packagingSystemIdCounter = getMaxSystemIdCounter(allPackagings, PACKAGING_SYSTEM_ID_PREFIX);
};

export const getNextPackagingSystemId = (): SystemId => {
    packagingSystemIdCounter++;
    return asSystemId(generateSystemId('packaging', packagingSystemIdCounter));
};

export const getPackagingSuffixFromOrderId = (orderId?: BusinessId): string => {
    if (!orderId) return '';
    const rawValue = `${orderId}`;
    const suffix = rawValue.replace(/^[A-Z-]+/, '');
    return suffix || rawValue;
};

export const getActivePackagingCount = (packagings: Packaging[]): number => {
    return packagings.filter(p => p.status !== 'Hủy đóng gói').length;
};

export const buildPackagingBusinessId = (orderId: BusinessId, activeIndex: number, activeCount: number): BusinessId => {
    const suffix = getPackagingSuffixFromOrderId(orderId);
    const baseCode = `${PACKAGING_CODE_PREFIX}${suffix || '000000'}`;
    if (activeCount > 1 && activeIndex > 0) {
        const paddedIndex = String(activeIndex + 1).padStart(2, '0');
        return asBusinessId(`${baseCode}-${paddedIndex}`);
    }
    return asBusinessId(baseCode);
};

// ============================================
// BRANCH HELPER
// ============================================

export const getBranchId = (order: Order): string => order.branchSystemId;

// ============================================
// SALES RETURN & DEBT HELPERS
// ============================================

export const getReturnedValueForOrder = (orderSystemId: SystemId): number => {
    return useSalesReturnStore.getState().data
        .filter(sr => sr.orderSystemId === orderSystemId)
        .reduce((sum, sr) => sum + sr.totalReturnValue, 0);
};

export const calculateActualDebt = (order: Order): number => {
    const totalReturnedValue = getReturnedValueForOrder(order.systemId);
    return Math.max(order.grandTotal - totalReturnedValue, 0);
};

export const calculateTotalPaid = (payments: OrderPayment[]): number => {
    return payments.reduce((sum, payment) => sum + payment.amount, 0);
};

export const getOrderOutstandingAmount = (order: Order): number => {
    const actualDebt = calculateActualDebt(order);
    const totalPaid = calculateTotalPaid(order.payments ?? []);
    return Math.max(actualDebt - totalPaid, 0);
};

// ============================================
// PAYMENT APPLICATION
// ============================================

export const applyPaymentToOrder = (order: Order, payment: OrderPayment): Order => {
    const updatedPayments = [...(order.payments ?? []), payment];
    const totalPaid = calculateTotalPaid(updatedPayments);
    const actualDebt = calculateActualDebt(order);

    let newPaymentStatus: OrderPaymentStatus = 'Chưa thanh toán';
    if (totalPaid >= actualDebt) {
        newPaymentStatus = 'Thanh toán toàn bộ';
    } else if (totalPaid > 0) {
        newPaymentStatus = 'Thanh toán 1 phần';
    }

    const wasCompleted = order.status === 'Hoàn thành';
    let newStatus = order.status;
    let newCompletedDate = order.completedDate;

    if (newPaymentStatus === 'Thanh toán toàn bộ' && order.deliveryStatus === 'Đã giao hàng') {
        newStatus = 'Hoàn thành';
        newCompletedDate = toISODateTime(new Date());
        if (!wasCompleted) {
            const { incrementOrderStats } = useCustomerStore.getState();
            incrementOrderStats(order.customerSystemId, order.grandTotal);
        }
    }

    const { updateDebtTransactionPayment } = useCustomerStore.getState();
    updateDebtTransactionPayment(order.customerSystemId, order.id, payment.amount);

    return {
        ...order,
        payments: updatedPayments,
        paymentStatus: newPaymentStatus,
        status: newStatus,
        completedDate: newCompletedDate,
        paidAmount: totalPaid,
    };
};

// ============================================
// STOCK OPERATIONS
// ============================================

export type StockOperation = 'commit' | 'uncommit' | 'dispatch' | 'complete' | 'return';

export const processLineItemStock = (
    lineItem: { productSystemId: string; quantity: number },
    branchSystemId: string,
    operation: StockOperation,
    orderQuantity: number = 1
): { productSystemId: SystemId; quantity: number }[] => {
    const { 
        findById: findProductById, 
        commitStock, 
        uncommitStock, 
        dispatchStock, 
        completeDelivery, 
        returnStockFromTransit 
    } = useProductStore.getState();
    
    const product = findProductById(asSystemId(lineItem.productSystemId));
    
    const itemsToProcess: { productSystemId: SystemId; quantity: number }[] = [];
    
    if (product && isComboProduct(product) && product.comboItems) {
        product.comboItems.forEach(comboItem => {
            itemsToProcess.push({
                productSystemId: asSystemId(comboItem.productSystemId),
                quantity: orderQuantity * comboItem.quantity,
            });
        });
    } else {
        itemsToProcess.push({
            productSystemId: asSystemId(lineItem.productSystemId),
            quantity: orderQuantity,
        });
    }
    
    itemsToProcess.forEach(item => {
        const branchId = asSystemId(branchSystemId);
        switch (operation) {
            case 'commit':
                commitStock(item.productSystemId, branchId, item.quantity);
                break;
            case 'uncommit':
                uncommitStock(item.productSystemId, branchId, item.quantity);
                break;
            case 'dispatch':
                dispatchStock(item.productSystemId, branchId, item.quantity);
                break;
            case 'complete':
                completeDelivery(item.productSystemId, branchId, item.quantity);
                break;
            case 'return':
                returnStockFromTransit(item.productSystemId, branchId, item.quantity);
                break;
        }
    });
    
    return itemsToProcess;
};

export const getComboStockItems = (lineItems: { productSystemId: string; quantity: number }[]): { productSystemId: SystemId; quantity: number }[] => {
    const { findById: findProductById } = useProductStore.getState();
    const stockItems: { productSystemId: SystemId; quantity: number }[] = [];
    
    lineItems.forEach(item => {
        const product = findProductById(asSystemId(item.productSystemId));
        
        if (product && isComboProduct(product) && product.comboItems) {
            product.comboItems.forEach(comboItem => {
                stockItems.push({
                    productSystemId: asSystemId(comboItem.productSystemId),
                    quantity: item.quantity * comboItem.quantity,
                });
            });
        } else {
            stockItems.push({
                productSystemId: asSystemId(item.productSystemId),
                quantity: item.quantity,
            });
        }
    });
    
    return stockItems;
};

// ============================================
// CANCELLATION CHECK
// ============================================

export const ensureCancellationAllowed = (order: Order | undefined, actionLabel: string): boolean => {
    if (!order) return false;

    const { allowCancelAfterExport } = useSalesManagementSettingsStore.getState();
    if (allowCancelAfterExport) {
        return true;
    }

    const hasLeftWarehouse =
        order.stockOutStatus === 'Xuất kho toàn bộ' ||
        deliveryStatusesBlockedForCancellation.includes(order.deliveryStatus ?? '');

    if (hasLeftWarehouse) {
        toast.error(
            `Không thể ${actionLabel} vì đơn hàng đã xuất kho. Vào Cấu hình bán hàng -> Thiết lập quản lý bán hàng và bật "Cho phép hủy đơn hàng sau khi xuất kho".`,
        );
        return false;
    }

    return true;
};

// ============================================
// PACKAGING IDENTIFIERS
// ============================================

export const ensureOrderPackagingIdentifiers = (order: Order): Order | null => {
    if (!order.packagings || order.packagings.length === 0) {
        return null;
    }

    const activePackagings = order.packagings.filter(p => p.status !== 'Hủy đóng gói');
    const activeCount = activePackagings.length;
    let changed = false;
    let activeIndex = 0;

    const updatedPackagings = order.packagings.map((pkg) => {
        const isCancelled = pkg.status === 'Hủy đóng gói';
        const hasId = typeof pkg.id === 'string' && pkg.id.trim().length > 0;
        const hasTempOrOldSystemId = pkg.systemId?.startsWith('PKG_TEMP_') || pkg.systemId?.startsWith('PKG_');
        const hasValidSystemId = pkg.systemId?.startsWith(PACKAGING_SYSTEM_ID_PREFIX);
        const shouldFixTracking = pkg.deliveryMethod === 'Nhận tại cửa hàng' && pkg.trackingCode === `${IN_STORE_PICKUP_PREFIX}-`;

        if (isCancelled) {
            if (!hasId || (hasTempOrOldSystemId && !hasValidSystemId)) {
                const nextPkg = { ...pkg };
                if (!hasId) {
                    nextPkg.id = buildPackagingBusinessId(order.id, 0, 1);
                }
                if (hasTempOrOldSystemId && !hasValidSystemId) {
                    nextPkg.systemId = getNextPackagingSystemId();
                }
                changed = true;
                return nextPkg;
            }
            return pkg;
        }

        const currentActiveIndex = activeIndex;
        activeIndex++;

        if (hasId && !shouldFixTracking && hasValidSystemId) {
            return pkg;
        }

        const nextPkg = { ...pkg };
        if (!hasId) {
            nextPkg.id = buildPackagingBusinessId(order.id, currentActiveIndex, activeCount);
            changed = true;
        }
        
        if (hasTempOrOldSystemId && !hasValidSystemId) {
            nextPkg.systemId = getNextPackagingSystemId();
            changed = true;
        }

        if (shouldFixTracking) {
            const resolvedId = nextPkg.id ?? buildPackagingBusinessId(order.id, currentActiveIndex, activeCount);
            nextPkg.trackingCode = `${IN_STORE_PICKUP_PREFIX}-${resolvedId}`;
            changed = true;
        }

        return nextPkg;
    });

    return changed ? { ...order, packagings: updatedPackagings } : null;
};
