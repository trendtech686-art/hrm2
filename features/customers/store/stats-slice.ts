/**
 * Customers Store - Stats Slice
 * Order and return statistics tracking
 * 
 * @module features/customers/store/stats-slice
 */

import type { SystemId } from '../../../lib/id-types';
import { calculateLifecycleStage } from '../lifecycle-utils';
import { 
    calculateRFMScores, 
    getCustomerSegment, 
    calculateHealthScore,
    calculateChurnRisk 
} from '../intelligence-utils';
import { baseStore } from './base-store';

// ============================================
// ORDER STATS
// ============================================

export const incrementOrderStats = (systemId: SystemId, orderValue: number) => {
    const allCustomers = baseStore.getState().getActive();
    
    baseStore.setState(state => ({
        data: state.data.map(customer => {
            if (customer.systemId === systemId) {
                const updatedCustomer = {
                    ...customer,
                    totalOrders: (customer.totalOrders || 0) + 1,
                    totalSpent: (customer.totalSpent || 0) + orderValue,
                    lastPurchaseDate: new Date().toISOString().split('T')[0],
                };
                
                // Auto-update intelligence after order stats change
                const rfmScores = calculateRFMScores(updatedCustomer, allCustomers);
                const segment = getCustomerSegment(rfmScores);
                const healthScore = calculateHealthScore(updatedCustomer);
                const churnRisk = calculateChurnRisk(updatedCustomer).risk;
                const lifecycleStage = calculateLifecycleStage(updatedCustomer);
                
                return {
                    ...updatedCustomer,
                    rfmScores,
                    segment,
                    healthScore,
                    churnRisk,
                    lifecycleStage,
                };
            }
            return customer;
        })
    }));
};

export const decrementOrderStats = (systemId: SystemId, orderValue: number) => {
    const allCustomers = baseStore.getState().getActive();
    
    baseStore.setState(state => ({
        data: state.data.map(customer => {
            if (customer.systemId === systemId) {
                const updatedCustomer = {
                    ...customer,
                    totalOrders: Math.max(0, (customer.totalOrders || 0) - 1),
                    totalSpent: Math.max(0, (customer.totalSpent || 0) - orderValue),
                };
                
                // Auto-update intelligence after order stats change
                const rfmScores = calculateRFMScores(updatedCustomer, allCustomers);
                const segment = getCustomerSegment(rfmScores);
                const healthScore = calculateHealthScore(updatedCustomer);
                const churnRisk = calculateChurnRisk(updatedCustomer).risk;
                const lifecycleStage = calculateLifecycleStage(updatedCustomer);
                
                return {
                    ...updatedCustomer,
                    rfmScores,
                    segment,
                    healthScore,
                    churnRisk,
                    lifecycleStage,
                };
            }
            return customer;
        })
    }));
};

// ============================================
// RETURN & DELIVERY STATS
// ============================================

export const incrementReturnStats = (systemId: SystemId, quantity: number) => {
    baseStore.setState(state => ({
        data: state.data.map(customer => {
            if (customer.systemId === systemId) {
                return {
                    ...customer,
                    totalQuantityReturned: (customer.totalQuantityReturned || 0) + quantity,
                };
            }
            return customer;
        })
    }));
};

export const incrementFailedDeliveryStats = (systemId: SystemId) => {
    baseStore.setState(state => ({
        data: state.data.map(customer => {
            if (customer.systemId === systemId) {
                return {
                    ...customer,
                    failedDeliveries: (customer.failedDeliveries || 0) + 1,
                };
            }
            return customer;
        })
    }));
};
