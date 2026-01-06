/**
 * Payments Store - Types
 * Store interface definitions
 * 
 * @module features/payments/store/types
 */

import type { Payment } from '@/lib/types/prisma-extended';
import type { BusinessId, SystemId } from '../../../lib/id-types';

export type PaymentInput = Omit<Payment, 'systemId' | 'id'> & { id?: BusinessId | string };

export interface PaymentStore {
  data: Payment[];
  businessIdCounter: number;
  systemIdCounter: number;
  add: (item: PaymentInput) => Payment;
  addMultiple: (items: PaymentInput[]) => void;
  update: (systemId: SystemId, item: Payment) => void;
  remove: (systemId: SystemId) => void;
  findById: (systemId: SystemId) => Payment | undefined;
  getActive: () => Payment[];
  cancel: (systemId: SystemId, reason?: string) => void;
}

export type { Payment };
