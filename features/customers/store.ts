import { create } from 'zustand';
import { createCrudStore, CrudState } from '../../lib/store-factory.ts';
import { data as initialData } from './data.ts';
import type { Customer } from './types.ts';
import { SystemId, BusinessId } from '../../lib/id-types.ts';
import { calculateLifecycleStage } from './lifecycle-utils.ts';
import { getHighRiskDebtCustomers } from './credit-utils.ts';
import { 
  calculateRFMScores, 
  getCustomerSegment, 
  calculateHealthScore,
  calculateChurnRisk 
} from './intelligence-utils.ts';
import { getOverdueDebtCustomers, getDueSoonCustomers } from './debt-tracking-utils.ts';
import Fuse from 'fuse.js';
import { getCurrentUserSystemId } from '../../contexts/auth-context.tsx';

const baseStore = createCrudStore<Customer>(initialData, 'customers', {
  businessIdField: 'id',
  persistKey: 'hrm-customers', // ✅ Enable persistence
  getCurrentUser: getCurrentUserSystemId, // ✅ Track who creates/updates
});

// Define enhanced interface
interface CustomerStoreState extends CrudState<Customer> {
  searchCustomers: (query: string, page: number, limit?: number) => Promise<{ items: { value: string; label: string }[], hasNextPage: boolean }>;
  updateDebt: (systemId: SystemId, amountChange: number) => void;
  incrementOrderStats: (systemId: SystemId, orderValue: number) => void;
  decrementOrderStats: (systemId: SystemId, orderValue: number) => void;
  getHighRiskDebtCustomers: () => Customer[];
  updateCustomerIntelligence: () => void; // Batch update RFM, health score, churn risk
  getCustomersBySegment: (segment: string) => Customer[];
  getOverdueDebtCustomers: () => Customer[];
  getDueSoonCustomers: () => Customer[];
}

// Augmented methods
const augmentedMethods = {
    searchCustomers: async (query: string, page: number, limit: number = 20) => {
        return new Promise<{ items: { value: string; label: string }[], hasNextPage: boolean }>(resolve => {
            setTimeout(() => {
                const allCustomers = baseStore.getState().data;
                
                // ✅ Create fresh Fuse instance with current data (avoid stale data)
                const fuse = new Fuse(allCustomers, {
                    keys: ['name', 'id', 'phone'],
                    threshold: 0.3,
                });
                
                const results = query ? fuse.search(query).map(r => r.item) : allCustomers;
                
                const start = (page - 1) * limit;
                const end = start + limit;
                const paginatedItems = results.slice(start, end);

                resolve({
                    items: paginatedItems.map(c => ({ value: c.systemId, label: c.name })),
                    hasNextPage: end < results.length,
                });
            }, 300);
        });
    },
    updateDebt: (systemId: SystemId, amountChange: number) => {
        baseStore.setState(state => ({
            data: state.data.map(customer => {
                if (customer.systemId === systemId) {
                    return {
                        ...customer,
                        currentDebt: (customer.currentDebt || 0) + amountChange,
                    };
                }
                return customer;
            })
        }));
    },
    incrementOrderStats: (systemId: SystemId, orderValue: number) => {
        baseStore.setState(state => ({
            data: state.data.map(customer => {
                if (customer.systemId === systemId) {
                    return {
                        ...customer,
                        totalOrders: (customer.totalOrders || 0) + 1,
                        totalSpent: (customer.totalSpent || 0) + orderValue,
                    };
                }
                return customer;
            })
        }));
    },
    decrementOrderStats: (systemId: SystemId, orderValue: number) => {
        baseStore.setState(state => ({
            data: state.data.map(customer => {
                if (customer.systemId === systemId) {
                    return {
                        ...customer,
                        totalOrders: Math.max(0, (customer.totalOrders || 0) - 1),
                        totalSpent: Math.max(0, (customer.totalSpent || 0) - orderValue),
                    };
                }
                return customer;
            })
        }));
    },
    // Override add to auto-calculate lifecycle stage
    add: (customer: Omit<Customer, 'systemId'>) => {
        const customerWithLifecycle = {
            ...customer,
            lifecycleStage: calculateLifecycleStage(customer as Customer)
        };
        return baseStore.getState().add(customerWithLifecycle);
    },
    // Override update to auto-calculate lifecycle stage
    update: (systemId: SystemId, updatedCustomer: Customer) => {
        console.log('[CustomerStore] update called:', { systemId, updatedCustomer });
        const customerWithLifecycle = {
            ...updatedCustomer,
            lifecycleStage: calculateLifecycleStage(updatedCustomer)
        };
        console.log('[CustomerStore] Calling baseStore.update with:', customerWithLifecycle);
        
        // Call the update function from baseStore directly
        baseStore.getState().update(systemId, customerWithLifecycle);
        
        console.log('[CustomerStore] State after update:', baseStore.getState().data.find(c => c.systemId === systemId));
    },
    // Get customers with high debt risk
    getHighRiskDebtCustomers: () => {
        const activeCustomers = baseStore.getState().getActive();
        return getHighRiskDebtCustomers(activeCustomers);
    },
    // Batch update customer intelligence (RFM, health score, churn risk)
    updateCustomerIntelligence: () => {
        const allCustomers = baseStore.getState().getActive();
        
        baseStore.setState(state => ({
            data: state.data.map(customer => {
                if (customer.isDeleted) return customer;
                
                // Calculate RFM
                const rfmScores = calculateRFMScores(customer, allCustomers);
                const segment = getCustomerSegment(rfmScores);
                
                // Calculate health score
                const healthScore = calculateHealthScore(customer);
                
                // Calculate churn risk
                const churnRisk = calculateChurnRisk(customer).risk;
                
                // Calculate lifecycle stage
                const lifecycleStage = calculateLifecycleStage(customer);
                
                return {
                    ...customer,
                    rfmScores,
                    segment,
                    healthScore,
                    churnRisk,
                    lifecycleStage
                };
            })
        }));
    },
    // Get customers by segment
    getCustomersBySegment: (segment: string) => {
        return baseStore.getState().getActive().filter(c => c.segment === segment);
    },
    // Get customers with overdue debt
    getOverdueDebtCustomers: () => {
        const activeCustomers = baseStore.getState().getActive();
        return getOverdueDebtCustomers(activeCustomers);
    },
    // Get customers with debt due soon
    getDueSoonCustomers: () => {
        const activeCustomers = baseStore.getState().getActive();
        return getDueSoonCustomers(activeCustomers);
    }
};

// Export typed hook
export const useCustomerStore = (): CustomerStoreState => {
  const state = baseStore();
  return {
    ...state,
    ...augmentedMethods,
  };
};

// Export getState for non-hook usage
useCustomerStore.getState = (): CustomerStoreState => {
  const state = baseStore.getState();
  return {
    ...state,
    ...augmentedMethods,
  };
};
