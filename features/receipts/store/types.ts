/**
 * Receipts Store - Types
 * Store interface definitions
 * 
 * @module features/receipts/store/types
 */

import type { Receipt } from '@/lib/types/prisma-extended';
import type { BusinessId, SystemId } from '../../../lib/id-types';

export type ReceiptInput = Omit<Receipt, 'systemId' | 'id'> & { id?: BusinessId };

export interface ReceiptStore {
  data: Receipt[];
  businessIdCounter: number;
  systemIdCounter: number;
  add: (item: ReceiptInput) => Receipt;
  addMultiple: (items: ReceiptInput[]) => void;
  update: (systemId: SystemId, item: Receipt) => void;
  remove: (systemId: SystemId) => void;
  findById: (systemId: SystemId) => Receipt | undefined;
  getActive: () => Receipt[];
  cancel: (systemId: SystemId, reason?: string) => void;
}

export type { Receipt };
