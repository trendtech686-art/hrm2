/**
 * Order Store - Base Store & Migrations
 * Core store creation with CRUD operations and data migrations
 * 
 * @module features/orders/store/base-store
 */

import { createCrudStore } from '../../../lib/store-factory';
import { toISODateTime } from '../../../lib/date-utils';
import type { Order, OrderMainStatus, Packaging as _Packaging } from '@/lib/types/prisma-extended';
import { asSystemId, asBusinessId as _asBusinessId } from '../../../lib/id-types';
import { getCurrentUserSystemId } from '../../../contexts/auth-context';

import { useProductStore } from '../../products/store';
import { isComboProduct } from '../../products/combo-utils';
import { useCustomerStore } from '../../customers/store';

import {
    getCurrentUserInfo,
    createCreatedEntry,
} from '../../../lib/activity-history-helper';

import {
    PACKAGING_CODE_PREFIX as _PACKAGING_CODE_PREFIX,
    ensureOrderPackagingIdentifiers,
    initPackagingCounter,
} from './helpers';

// ============================================
// BASE STORE CREATION
// ============================================

export const baseStore = createCrudStore<Order>([], 'orders', {
    businessIdField: 'id',
    getCurrentUser: () => {
        return asSystemId(getCurrentUserSystemId());
    }
});

// ============================================
// MIGRATIONS
// ============================================

// Migration: Ensure all orders have paidAmount field
baseStore.setState(state => ({
    data: state.data.map(order => ({
        ...order,
        paidAmount: order.paidAmount ?? 0,
    }))
}));

// Migration: Fix order status for completed orders
baseStore.setState(state => ({
    data: state.data.map(order => {
        if (order.status === 'Hoàn thành' || order.status === 'Đã hủy') {
            return order;
        }
        
        const activePackagings = order.packagings.filter(p => p.status !== 'Hủy đóng gói');
        const isAllDelivered = activePackagings.length > 0 && activePackagings.every(p => p.deliveryStatus === 'Đã giao hàng');
        
        if (order.paymentStatus === 'Thanh toán toàn bộ' && (isAllDelivered || order.deliveryStatus === 'Đã giao hàng')) {
            return {
                ...order,
                status: 'Hoàn thành' as OrderMainStatus,
                completedDate: order.completedDate || toISODateTime(new Date()),
            };
        }
        
        return order;
    })
}));

// ============================================
// OVERRIDE ADD METHOD
// ============================================

const originalAdd = baseStore.getState().add;

baseStore.setState({
    add: (item) => {
        const { commitStock, findById: findProductById } = useProductStore.getState();
        const userInfo = getCurrentUserInfo();
        const newItem = originalAdd(item);
        if (newItem) {
            const hydratedPackagings = ensureOrderPackagingIdentifiers(newItem);
            if (hydratedPackagings) {
                Object.assign(newItem, hydratedPackagings);
                baseStore.setState(state => ({
                    data: state.data.map(order => order.systemId === hydratedPackagings.systemId ? hydratedPackagings : order),
                }));
            }
            newItem.lineItems.forEach(li => {
                const product = findProductById(asSystemId(li.productSystemId));
                
                if (product && isComboProduct(product) && product.comboItems) {
                    product.comboItems.forEach(comboItem => {
                        const totalQuantity = li.quantity * comboItem.quantity;
                        commitStock(asSystemId(comboItem.productSystemId), asSystemId(newItem.branchSystemId), totalQuantity);
                    });
                } else {
                    commitStock(asSystemId(li.productSystemId), asSystemId(newItem.branchSystemId), li.quantity);
                }
            });
            
            if (newItem.customerSystemId) {
                const { update: updateCustomer, findById: findCustomer } = useCustomerStore.getState();
                const customer = findCustomer(newItem.customerSystemId);
                if (customer) {
                    updateCustomer(newItem.customerSystemId, {
                        lastPurchaseDate: new Date().toISOString().split('T')[0],
                    });
                }
            }
            
            const historyEntry = createCreatedEntry(
                userInfo,
                `${userInfo.name} đã tạo đơn hàng ${newItem.id} cho khách hàng ${newItem.customerName} (Tổng: ${newItem.grandTotal.toLocaleString('vi-VN')}đ)`
            );
            baseStore.setState(state => ({
                data: state.data.map(order => order.systemId === newItem.systemId ? { ...order, activityHistory: [historyEntry] } : order),
            }));
        }
        return newItem;
    },
});

// ============================================
// BACKFILL PACKAGING IDENTIFIERS
// ============================================

const backfillPackagingIdentifiers = () => {
    const currentState = baseStore.getState();
    let changed = false;
    const updatedData = currentState.data.map(order => {
        const updatedOrder = ensureOrderPackagingIdentifiers(order);
        if (updatedOrder) {
            changed = true;
            return updatedOrder;
        }
        return order;
    });

    if (changed) {
        baseStore.setState({ data: updatedData });
    }
};

backfillPackagingIdentifiers();

// Initialize packaging counter
initPackagingCounter(baseStore.getState().data);
