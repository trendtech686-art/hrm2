/**
 * Receipts Store - Main Entry
 * Combined store with all slices
 * 
 * @module features/receipts/store
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { Receipt } from '@/lib/types/prisma-extended';
import type { SystemId } from '@/lib/id-types';

import type { ReceiptStore, ReceiptInput } from './types';
import {
  normalizeReceiptStatus,
  ensureReceiptMetadata,
  backfillReceiptMetadata as _backfillReceiptMetadata,
  initializeCounters,
  getNextSystemId,
  ensureReceiptBusinessId,
  getCurrentReceiptAuthor,
  createHistoryEntry,
  getCounters,
} from './helpers';

// ============================================================================
// Initial Data Processing
// ============================================================================

// Initialize counters from data
const counters = initializeCounters([]);

// ============================================================================
// Store Creation
// ============================================================================

export const useReceiptStore = create<ReceiptStore>()(
  subscribeWithSelector(
    (set, get) => ({
      data: [],
      businessIdCounter: counters.businessIdCounter,
      systemIdCounter: counters.systemIdCounter,
      
      add: (item: ReceiptInput): Receipt => {
        let createdReceipt: Receipt | null = null;
        set(state => {
          const systemId = getNextSystemId();
          const id = ensureReceiptBusinessId(state.data, item.id);
          const createdBy = item.createdBy ?? getCurrentReceiptAuthor();
          const currentCounters = getCounters();
          
          const newReceipt: Receipt = { 
            ...item, 
            systemId, 
            id,
            createdBy,
            createdAt: item.createdAt || new Date().toISOString(),
            status: normalizeReceiptStatus(item.status),
            orderAllocations: item.orderAllocations ?? [],
          };

          const normalizedReceipt = ensureReceiptMetadata(newReceipt);
          createdReceipt = normalizedReceipt;

          return { 
            data: [...state.data, normalizedReceipt],
            businessIdCounter: currentCounters.businessIdCounter,
            systemIdCounter: currentCounters.systemIdCounter
          };
        });
        return createdReceipt!;
      },
      
      addMultiple: (items: ReceiptInput[]) => {
        set(state => {
          const created: Receipt[] = [];
          
          items.forEach(item => {
            const context = [...state.data, ...created];
            const systemId = getNextSystemId();
            const id = ensureReceiptBusinessId(context, item.id);
            const createdBy = item.createdBy ?? getCurrentReceiptAuthor();
            
            const newReceipt: Receipt = { 
              ...item, 
              systemId, 
              id,
              createdBy,
              createdAt: item.createdAt || new Date().toISOString(),
              status: normalizeReceiptStatus(item.status),
              orderAllocations: item.orderAllocations ?? [],
            };
            created.push(ensureReceiptMetadata(newReceipt));
          });
          
          const currentCounters = getCounters();
          return { 
            data: [...state.data, ...created],
            businessIdCounter: currentCounters.businessIdCounter,
            systemIdCounter: currentCounters.systemIdCounter
          };
        });
      },
      
      update: (systemId: SystemId, item: Receipt) => {
        const currentCounters = getCounters();
        set(state => ({
          data: state.data.map(r => r.systemId === systemId ? { ...item, status: normalizeReceiptStatus(item.status), updatedAt: new Date().toISOString() } : r),
          businessIdCounter: currentCounters.businessIdCounter,
          systemIdCounter: currentCounters.systemIdCounter
        }));
      },
      
      remove: (systemId: SystemId) => {
        const currentCounters = getCounters();
        set(state => ({
          data: state.data.filter(r => r.systemId !== systemId),
          businessIdCounter: currentCounters.businessIdCounter,
          systemIdCounter: currentCounters.systemIdCounter
        }));
      },
      
      findById: (systemId: SystemId) => {
        return get().data.find(r => r.systemId === systemId);
      },
      
      getActive: () => {
        return get().data.filter(r => r.status !== 'cancelled');
      },
      
      cancel: (systemId: SystemId, reason?: string) => {
        const receipt = get().findById(systemId);
        if (receipt && receipt.status !== 'cancelled') {
          const historyEntry = createHistoryEntry(
            'cancelled',
            `Đã hủy phiếu thu${reason ? `: ${reason}` : ''}`,
            { oldValue: 'Hoàn thành', newValue: 'Đã hủy', note: reason }
          );
          
          get().update(systemId, {
            ...receipt,
            status: 'cancelled',
            cancelledAt: new Date().toISOString(),
            activityHistory: [...(receipt.activityHistory || []), historyEntry],
          });
        }
      },
    })
  )
);

// ============================================================================
// Re-exports
// ============================================================================

export type { ReceiptStore, ReceiptInput, Receipt } from './types';
