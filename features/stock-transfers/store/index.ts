/**
 * Stock Transfers Store - Main Entry
 * Combined store with all slices
 * 
 * @module features/stock-transfers/store
 */

import { create } from 'zustand';
import { asBusinessId, type SystemId, type BusinessId as _BusinessId } from '../../../lib/id-types';

// Types
import type { StockTransferState, StockTransfer } from './types';
export type { StockTransferState, StockTransfer, StockTransferStatus } from './types';

// Helpers
import { generateNextId, generateSystemId } from './helpers';

// Slices
import { confirmTransfer, confirmReceive, cancelTransfer } from './status-slice';

// ========================================
// STORE CREATION
// ========================================

export const useStockTransferStore = create<StockTransferState>()(
    (set, get) => ({
      data: [],
      isLoading: false,
      error: null,
      counter: 0,

      add: (transfer) => {
        const currentCounter = get().counter;
        const { id, referenceCode, note, ...rest } = transfer;
        const businessId = id && id.trim() 
          ? asBusinessId(id.trim())
          : generateNextId(currentCounter);
        const normalizedReferenceCode = referenceCode?.trim();
        const normalizedNote = note?.trim();
          
        const newTransfer: StockTransfer = {
          ...rest,
          systemId: generateSystemId(currentCounter),
          id: businessId,
          ...(normalizedReferenceCode ? { referenceCode: normalizedReferenceCode } : {}),
          ...(normalizedNote ? { note: normalizedNote } : {}),
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set(state => ({
          data: [...state.data, newTransfer],
          counter: state.counter + 1,
        }));
        
        return newTransfer;
      },

      update: (systemId, transfer) => {
        set(state => ({
          data: state.data.map(t => 
            t.systemId === systemId 
              ? { ...t, ...transfer, updatedAt: new Date().toISOString() }
              : t
          ),
        }));
      },

      remove: (systemId) => {
        set(state => ({
          data: state.data.filter(t => t.systemId !== systemId),
        }));
      },

      findById: (systemId) => {
        return get().data.find(t => t.systemId === systemId);
      },

      findByBusinessId: (id) => {
        return get().data.find(t => t.id === id);
      },

      getNextId: () => generateNextId(get().counter),
      
      isBusinessIdExists: (id: string) => {
        return get().data.some(t => t.id === id);
      },

      // Status operations (deprecated - use React Query mutations)
      confirmTransfer: (systemId: SystemId, employeeId: SystemId, products: Array<{ systemId: SystemId; inventoryByBranch?: Record<string, number> }> = [], employee?: { systemId: SystemId; fullName: string }) => 
        confirmTransfer(get, set, systemId, employeeId, products, employee),

      confirmReceive: (systemId: SystemId, employeeId: SystemId, products: Array<{ systemId: SystemId; inventoryByBranch?: Record<string, number> }> = [], employee?: { systemId: SystemId; fullName: string }, receivedItems?: { productSystemId: SystemId; receivedQuantity: number }[]) => 
        confirmReceive(get, set, systemId, employeeId, products, employee, receivedItems),

      cancelTransfer: (systemId: SystemId, employeeId: SystemId, products: string[] = [], reason?: string) => 
        cancelTransfer(get, set, systemId, employeeId, products as any, undefined, reason),
    })
);
