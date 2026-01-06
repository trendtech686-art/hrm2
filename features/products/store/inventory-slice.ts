/**
 * Products Store - Inventory Slice
 * Stock management operations (commit, dispatch, transit, etc.)
 * 
 * @module features/products/store/inventory-slice
 */

import type { SystemId } from '../../../lib/id-types';
import { baseStore } from './base-store';
import { canModifyStock } from './helpers';

// ============================================
// INVENTORY OPERATIONS
// ============================================

export const updateInventory = (productSystemId: SystemId, branchSystemId: SystemId, quantityChange: number) => {
    baseStore.setState(state => {
        const product = state.data.find(p => p.systemId === productSystemId);
        if (!product) return state;
        
        // Skip if product doesn't track stock
        if (!canModifyStock(product)) {
            return state;
        }
        
        const oldQuantity = product.inventoryByBranch?.[branchSystemId] || 0;
        const newQuantity = oldQuantity + quantityChange;
        
        return {
            data: state.data.map(p => {
                if (p.systemId === productSystemId) {
                    const newInventoryByBranch = { ...p.inventoryByBranch };
                    newInventoryByBranch[branchSystemId] = newQuantity;
                    return {
                        ...p,
                        inventoryByBranch: newInventoryByBranch,
                    };
                }
                return p;
            }),
        };
    });
};

export const commitStock = (productSystemId: SystemId, branchSystemId: SystemId, quantity: number) => {
    baseStore.setState(state => {
        const product = state.data.find(p => p.systemId === productSystemId);
        if (!canModifyStock(product)) {
            return state;
        }
        return {
            data: state.data.map(p => {
                if (p.systemId === productSystemId) {
                    const newCommitted = { ...p.committedByBranch };
                    newCommitted[branchSystemId] = (newCommitted[branchSystemId] || 0) + quantity;
                    return { ...p, committedByBranch: newCommitted };
                }
                return p;
            }),
        };
    });
};

export const uncommitStock = (productSystemId: SystemId, branchSystemId: SystemId, quantity: number) => {
    baseStore.setState(state => {
        const product = state.data.find(p => p.systemId === productSystemId);
        if (!canModifyStock(product)) {
            return state;
        }
        return {
            data: state.data.map(p => {
                if (p.systemId === productSystemId) {
                    const newCommitted = { ...p.committedByBranch };
                    newCommitted[branchSystemId] = Math.max(0, (newCommitted[branchSystemId] || 0) - quantity);
                    return { ...p, committedByBranch: newCommitted };
                }
                return p;
            }),
        };
    });
};

export const dispatchStock = (productSystemId: SystemId, branchSystemId: SystemId, quantity: number) => {
    baseStore.setState(state => {
        const product = state.data.find(p => p.systemId === productSystemId);
        if (!product) {
            console.error('❌ [dispatchStock] Product not found:', productSystemId);
            return state;
        }
        
        // Skip if product doesn't track stock
        if (!canModifyStock(product)) {
            return state;
        }
        
        return {
            data: state.data.map(product => {
                if (product.systemId === productSystemId) {
                    const newInventory = { ...product.inventoryByBranch };
                    const oldInventory = newInventory[branchSystemId] || 0;
                    newInventory[branchSystemId] = oldInventory - quantity;
                    
                    const newCommitted = { ...product.committedByBranch };
                    newCommitted[branchSystemId] = Math.max(0, (newCommitted[branchSystemId] || 0) - quantity);

                    const newInTransit = { ...product.inTransitByBranch };
                    newInTransit[branchSystemId] = (newInTransit[branchSystemId] || 0) + quantity;
                    
                    return { 
                        ...product, 
                        inventoryByBranch: newInventory,
                        committedByBranch: newCommitted,
                        inTransitByBranch: newInTransit,
                    };
                }
                return product;
            }),
        };
    });
};

export const completeDelivery = (productSystemId: SystemId, branchSystemId: SystemId, quantity: number) => {
    baseStore.setState(state => {
        const product = state.data.find(p => p.systemId === productSystemId);
        if (!canModifyStock(product)) {
            return state;
        }
        return {
            data: state.data.map(p => {
                if (p.systemId === productSystemId) {
                    const newInTransit = { ...p.inTransitByBranch };
                    newInTransit[branchSystemId] = Math.max(0, (newInTransit[branchSystemId] || 0) - quantity);
                    return { ...p, inTransitByBranch: newInTransit };
                }
                return p;
            }),
        };
    });
};

export const returnStockFromTransit = (productSystemId: SystemId, branchSystemId: SystemId, quantity: number) => {
    baseStore.setState(state => {
        const product = state.data.find(p => p.systemId === productSystemId);
        if (!canModifyStock(product)) {
            return state;
        }
        return {
            data: state.data.map(p => {
                if (p.systemId === productSystemId) {
                    const newInTransit = { ...p.inTransitByBranch };
                    newInTransit[branchSystemId] = Math.max(0, (newInTransit[branchSystemId] || 0) - quantity);
                    const newInventory = { ...p.inventoryByBranch };
                    newInventory[branchSystemId] = (newInventory[branchSystemId] || 0) + quantity;
                    return { ...p, inventoryByBranch: newInventory, inTransitByBranch: newInTransit };
                }
                return p;
            }),
        };
    });
};

// ============================================
// PRICE TRACKING
// ============================================

export const updateLastPurchasePrice = (productSystemId: SystemId, price: number, date: string) => {
    baseStore.setState(state => ({
        data: state.data.map(product => {
            if (product.systemId === productSystemId) {
                // Only update if the new date is newer or equal to the existing lastPurchaseDate
                const existingDate = product.lastPurchaseDate ? new Date(product.lastPurchaseDate).getTime() : 0;
                const newDateTs = new Date(date).getTime();
                
                if (newDateTs >= existingDate) {
                    return {
                        ...product,
                        lastPurchasePrice: price,
                        lastPurchaseDate: date,
                    };
                }
            }
            return product;
        }),
    }));
};
