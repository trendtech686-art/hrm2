import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Payment, PaymentStatus } from './types';
import { findNextAvailableBusinessId } from '../../lib/id-utils';
import { asSystemId, asBusinessId } from '../../lib/id-types';
import { data as initialData } from './data';

interface PaymentStore {
  data: Payment[];
  add: (item: Omit<Payment, 'systemId'>) => Payment;
  addMultiple: (items: Omit<Payment, 'systemId'>[]) => void;
  update: (systemId: string, item: Payment) => void;
  remove: (systemId: string) => void;
  findById: (systemId: string) => Payment | undefined;
  getActive: () => Payment[];
  approve: (systemId: string, approverSystemId: string, approverName: string) => void;
  complete: (systemId: string, completerSystemId: string, completerName: string) => void;
  cancel: (systemId: string) => void;
}

let paymentCounter = initialData.length;

export const usePaymentStore = create<PaymentStore>()(
  persist(
    (set, get) => ({
      data: initialData,
      
      add: (item: Omit<Payment, 'systemId'>): Payment => {
        paymentCounter++;
        const systemId = asSystemId(`PAYMENT${String(paymentCounter).padStart(6, '0')}`);
        
        // Auto-generate business ID if empty
        let businessId = item.id as string;
        if (!businessId || !businessId.trim()) {
          const existingIds = get().data.map(p => p.id as string);
          const result = findNextAvailableBusinessId('PC', existingIds, paymentCounter, 6);
          businessId = result.nextId;
          paymentCounter = result.updatedCounter;
        }
        
        const newPayment: Payment = { 
          ...item, 
          systemId, 
          id: asBusinessId(businessId),
          createdAt: item.createdAt || new Date().toISOString(),
          status: item.status || 'completed'
        };
        
        set(state => ({ data: [...state.data, newPayment] }));
        return newPayment;
      },
      
      addMultiple: (items: Omit<Payment, 'systemId'>[]) => {
        const newPayments = items.map(item => {
          paymentCounter++;
          const systemId = asSystemId(`PAYMENT${String(paymentCounter).padStart(6, '0')}`);
          
          let businessId = item.id as string;
          if (!businessId || !businessId.trim()) {
            const existingIds = get().data.map(p => p.id as string);
            const result = findNextAvailableBusinessId('PC', existingIds, paymentCounter, 6);
            businessId = result.nextId;
            paymentCounter = result.updatedCounter;
          }
          
          return { 
            ...item, 
            systemId, 
            id: asBusinessId(businessId),
            createdAt: item.createdAt || new Date().toISOString(),
            status: item.status || 'completed'
          } as Payment;
        });
        
        set(state => ({ data: [...state.data, ...newPayments] }));
      },
      
      update: (systemId: string, item: Payment) => {
        set(state => ({
          data: state.data.map(p => p.systemId === systemId ? { ...item, updatedAt: new Date().toISOString() } : p)
        }));
      },
      
      remove: (systemId: string) => {
        set(state => ({
          data: state.data.filter(p => p.systemId !== systemId)
        }));
      },
      
      findById: (systemId: string) => {
        return get().data.find(p => p.systemId === systemId);
      },
      
      getActive: () => {
        return get().data.filter(p => p.status !== 'cancelled');
      },
      
      approve: (systemId: string, approverSystemId: string, approverName: string) => {
        const payment = get().findById(systemId);
        if (payment) {
          get().update(systemId, {
            ...payment,
            status: 'approved',
            approvedBy: approverSystemId,
            approvedByName: approverName,
            approvedAt: new Date().toISOString(),
          });
        }
      },
      
      complete: (systemId: string, completerSystemId: string, completerName: string) => {
        const payment = get().findById(systemId);
        if (payment) {
          get().update(systemId, {
            ...payment,
            status: 'completed',
            completedBy: completerSystemId,
            completedByName: completerName,
            completedAt: new Date().toISOString(),
          });
        }
      },
      
      cancel: (systemId: string) => {
        const payment = get().findById(systemId);
        if (payment) {
          get().update(systemId, {
            ...payment,
            status: 'cancelled',
            cancelledAt: new Date().toISOString(),
          });
        }
      },
    }),
    {
      name: 'payment-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
