/**
 * Payments Store - Main Entry
 * Combined store with all slices
 * 
 * @module features/payments/store
 */

import { create } from 'zustand';
import type { SystemId } from '../../../lib/id-types';

// Types
import type { PaymentStore, PaymentInput, Payment } from './types';
export type { PaymentStore, PaymentInput, Payment } from './types';

// Helpers
import {
  initCounters,
  getCounters,
  normalizePayment as _normalizePayment,
  normalizePaymentStatus,
  backfillPaymentMetadata as _backfillPaymentMetadata,
  getNextSystemId,
  ensurePaymentBusinessId,
  reconcileLinkedDocuments,
  createHistoryEntry,
} from './helpers';

// ========================================
// Initialize Data
// ========================================

initCounters([]);

// ========================================
// Build Payment
// ========================================

const buildPayment = (input: PaymentInput, existingPayments: Payment[]): Payment => {
  const systemId = getNextSystemId();
  const id = ensurePaymentBusinessId(existingPayments, input.id);
  const basePayment: Payment = {
    ...input,
    systemId,
    id,
    createdAt: input.createdAt || new Date().toISOString(),
    status: normalizePaymentStatus(input.status),
  };

  return reconcileLinkedDocuments(basePayment);
};

// ========================================
// Store Creation
// ========================================

export const usePaymentStore = create<PaymentStore>()(
    (set, get) => ({
      data: [],
      businessIdCounter: getCounters().businessIdCounter,
      systemIdCounter: getCounters().systemIdCounter,
      
      add: (item) => {
        let createdPayment: Payment | null = null;
        set(state => {
          const newPayment = buildPayment(item, state.data);
          createdPayment = newPayment;
          const counters = getCounters();
          return {
            data: [...state.data, newPayment],
            businessIdCounter: counters.businessIdCounter,
            systemIdCounter: counters.systemIdCounter,
          };
        });
        return createdPayment!;
      },
      
      addMultiple: (items) => {
        set(state => {
          const created: Payment[] = [];

          items.forEach(item => {
            const context = [...state.data, ...created];
            const payment = buildPayment(item, context);
            created.push(payment);
          });

          const counters = getCounters();
          return {
            data: [...state.data, ...created],
            businessIdCounter: counters.businessIdCounter,
            systemIdCounter: counters.systemIdCounter,
          };
        });
      },
      
      update: (systemId, item) => {
        set(state => {
          const counters = getCounters();
          return {
            data: state.data.map(payment =>
              payment.systemId === systemId
                ? reconcileLinkedDocuments({
                    ...item,
                    systemId,
                    status: normalizePaymentStatus(item.status),
                    updatedAt: new Date().toISOString(),
                  })
                : payment
            ),
            businessIdCounter: counters.businessIdCounter,
            systemIdCounter: counters.systemIdCounter,
          };
        });
      },
      
      remove: (systemId) => {
        set(state => {
          const counters = getCounters();
          return {
            data: state.data.filter(payment => payment.systemId !== systemId),
            businessIdCounter: counters.businessIdCounter,
            systemIdCounter: counters.systemIdCounter,
          };
        });
      },
      
      findById: (systemId) => {
        return get().data.find(payment => payment.systemId === systemId);
      },
      
      getActive: () => {
        return get().data.filter(payment => payment.status !== 'cancelled');
      },
      
      cancel: (systemId: SystemId, reason?: string) => {
        const payment = get().findById(systemId);
        if (payment && payment.status !== 'cancelled') {
          const historyEntry = createHistoryEntry(
            'cancelled',
            `Đã hủy phiếu chi${reason ? `: ${reason}` : ''}`,
            { oldValue: 'Hoàn thành', newValue: 'Đã hủy', note: reason }
          );
          
          get().update(systemId, {
            ...payment,
            status: 'cancelled',
            cancelledAt: new Date().toISOString(),
            activityHistory: [...(payment.activityHistory || []), historyEntry],
          });
        }
      },
    })
);
