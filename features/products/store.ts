import { createCrudStore, CrudState } from '../../lib/store-factory.ts';
import { data as initialData } from './data.ts';
import type { Product } from './types.ts';
import { type SystemId, createSystemId } from '../../lib/id-config.ts';
import { getCurrentUserSystemId } from '../../contexts/user-context.tsx';
import Fuse from 'fuse.js';

const baseStore = createCrudStore<Product>(initialData, 'products', {
  businessIdField: 'id',
  persistKey: 'hrm-products', // ✅ Enable persistence
  getCurrentUser: getCurrentUserSystemId, // ✅ Track who creates/updates
});

// Define extended store interface
export interface ProductStoreState extends CrudState<Product> {
  updateInventory: (productSystemId: SystemId, branchSystemId: SystemId, quantityChange: number) => void;
  commitStock: (productSystemId: SystemId, branchSystemId: SystemId, quantity: number) => void;
  uncommitStock: (productSystemId: SystemId, branchSystemId: SystemId, quantity: number) => void;
  dispatchStock: (productSystemId: SystemId, branchSystemId: SystemId, quantity: number) => void;
  completeDelivery: (productSystemId: SystemId, branchSystemId: SystemId, quantity: number) => void;
  returnStockFromTransit: (productSystemId: SystemId, branchSystemId: SystemId, quantity: number) => void;
  searchProducts: (query: string, page: number, limit?: number) => Promise<{ items: { value: SystemId; label: string }[], hasNextPage: boolean }>;
}

// Define custom methods
const updateInventory = (productSystemId: SystemId, branchSystemId: SystemId, quantityChange: number) => {
  baseStore.setState(state => {
    const product = state.data.find(p => p.systemId === productSystemId);
    if (!product) return state;
    
    const oldQuantity = product.inventoryByBranch?.[branchSystemId] || 0;
    const newQuantity = oldQuantity + quantityChange;
    
    // ✅ Removed COMPLAINT_ADJUSTMENT stock history creation
    // Stock history will be created by inventory check balance instead
    
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

const commitStock = (productSystemId: SystemId, branchSystemId: SystemId, quantity: number) => {
  baseStore.setState(state => ({
    data: state.data.map(product => {
      if (product.systemId === productSystemId) {
        const newCommitted = { ...product.committedByBranch };
        newCommitted[branchSystemId] = (newCommitted[branchSystemId] || 0) + quantity;
        return { ...product, committedByBranch: newCommitted };
      }
      return product;
    }),
  }));
};

const uncommitStock = (productSystemId: SystemId, branchSystemId: SystemId, quantity: number) => {
  baseStore.setState(state => ({
    data: state.data.map(product => {
      if (product.systemId === productSystemId) {
        const newCommitted = { ...product.committedByBranch };
        newCommitted[branchSystemId] = Math.max(0, (newCommitted[branchSystemId] || 0) - quantity);
        return { ...product, committedByBranch: newCommitted };
      }
      return product;
    }),
  }));
};

const dispatchStock = (productSystemId: SystemId, branchSystemId: SystemId, quantity: number) => {
  console.log('🔴 [dispatchStock] Called with:', { productSystemId, branchSystemId, quantity });
  
  baseStore.setState(state => {
    const product = state.data.find(p => p.systemId === productSystemId);
    if (!product) {
      console.error('❌ [dispatchStock] Product not found:', productSystemId);
      return state;
    }
    
    console.log('📦 [dispatchStock] Current inventory:', product.inventoryByBranch);
    console.log('📦 [dispatchStock] Current committed:', product.committedByBranch);
    
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
          
          console.log('✅ [dispatchStock] Updated inventory:', {
            old: oldInventory,
            new: newInventory[branchSystemId],
            change: -quantity
          });
          
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
  
  console.log('✅ [dispatchStock] Completed');
};

const completeDelivery = (productSystemId: SystemId, branchSystemId: SystemId, quantity: number) => {
  baseStore.setState(state => ({
    data: state.data.map(product => {
      if (product.systemId === productSystemId) {
        const newInTransit = { ...product.inTransitByBranch };
        newInTransit[branchSystemId] = Math.max(0, (newInTransit[branchSystemId] || 0) - quantity);
        
        return { 
          ...product, 
          inTransitByBranch: newInTransit,
        };
      }
      return product;
    }),
  }));
};

const returnStockFromTransit = (productSystemId: SystemId, branchSystemId: SystemId, quantity: number) => {
  baseStore.setState(state => ({
    data: state.data.map(product => {
      if (product.systemId === productSystemId) {
        const newInTransit = { ...product.inTransitByBranch };
        newInTransit[branchSystemId] = Math.max(0, (newInTransit[branchSystemId] || 0) - quantity);
        
        const newInventory = { ...product.inventoryByBranch };
        newInventory[branchSystemId] = (newInventory[branchSystemId] || 0) + quantity;

        return { 
          ...product, 
          inventoryByBranch: newInventory,
          inTransitByBranch: newInTransit,
        };
      }
      return product;
    }),
  }));
};

const searchProducts = async (query: string, page: number = 1, limit: number = 10): Promise<{ items: { value: SystemId; label: string }[], hasNextPage: boolean }> => {
  const allProducts = baseStore.getState().data;
  
  // ✅ Create fresh Fuse instance with current data (avoid stale data)
  const fuse = new Fuse(allProducts, {
    keys: ['name', 'id', 'sku', 'barcode'],
    threshold: 0.3,
  });
  
  const results = fuse.search(query);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedResults = results.slice(startIndex, endIndex);

  return {
    items: paginatedResults.map(result => ({
      value: createSystemId(result.item.systemId),
      label: `${result.item.name} (${result.item.id})`,
    })),
    hasNextPage: endIndex < results.length,
  };
};

// Export typed hook that includes both base and custom methods
export const useProductStore = (): ProductStoreState => {
  const state = baseStore();
  return {
    ...state,
    updateInventory,
    commitStock,
    uncommitStock,
    dispatchStock,
    completeDelivery,
    returnStockFromTransit,
    searchProducts,
  };
};

// Export getState method for non-hook usage
useProductStore.getState = () => {
  const state = baseStore.getState();
  return {
    ...state,
    updateInventory,
    commitStock,
    uncommitStock,
    dispatchStock,
    completeDelivery,
    returnStockFromTransit,
    searchProducts,
  };
};
