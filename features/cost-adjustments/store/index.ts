/**
 * Cost Adjustments Store - Main Entry
 * Combined store with all slices
 * Data is persisted in database via API, this is in-memory cache only
 * 
 * @module features/cost-adjustments/store
 */

import { create } from 'zustand';

// Types
import type { CostAdjustmentStoreState } from './types';
export type { CostAdjustmentStoreState } from './types';
export type { CostAdjustment, CostAdjustmentItem, CostAdjustmentType, CostAdjustmentStatus } from './types';

// Helpers
import { generateNextBusinessId, isBusinessIdExists as checkBusinessIdExists } from './helpers';

// Slices
import { 
  createCostAdjustment, 
  getById as getByIdFn, 
  getByBusinessId as getByBusinessIdFn,
  getAll as getAllFn,
  getByStatus as getByStatusFn,
} from './crud-slice';
import { confirmCostAdjustment, cancelCostAdjustment } from './action-slice';

// ============================================
// COMBINED STORE (In-memory, no localStorage)
// ============================================

export const useCostAdjustmentStore = create<CostAdjustmentStoreState>()(
  (set, get) => ({
    data: [],
    counter: 1,
    
    // Read operations
    getById: (systemId) => getByIdFn(get().data, systemId),
    
    getByBusinessId: (businessId) => getByBusinessIdFn(get().data, businessId),
    
    getAll: () => getAllFn(get().data),
    
    getByStatus: (status) => getByStatusFn(get().data, status),
    
    // ID generation
    generateNextId: () => generateNextBusinessId(get().data),
      
      isBusinessIdExists: (businessId) => checkBusinessIdExists(get().data, businessId),
      
      // Create operation
      create: (items, type, createdBySystemId, createdByName, options) => {
        const { adjustment, newCounter } = createCostAdjustment(
          items,
          type,
          createdBySystemId,
          createdByName,
          get().counter,
          get().data,
          options
        );
        
        set(state => ({
          data: [adjustment, ...state.data],
          counter: newCounter,
        }));
        
        return adjustment;
      },
      
      // Confirm operation
      confirm: (systemId, confirmedBySystemId, confirmedByName) => {
        const updatedData = confirmCostAdjustment(
          get().data, 
          systemId, 
          confirmedBySystemId, 
          confirmedByName
        );
        
        if (!updatedData) return false;
        
        set({ data: updatedData });
        return true;
      },
      
      // Cancel operation
      cancel: (systemId, cancelledBySystemId, cancelledByName, reason) => {
        const updatedData = cancelCostAdjustment(
          get().data,
          systemId,
          cancelledBySystemId,
          cancelledByName,
          reason
        );
        
        if (!updatedData) return false;
        
        set({ data: updatedData });
        return true;
      },
    })
);
