/**
 * Stock Transfers Store - Types
 * Store interface definitions
 * 
 * @module features/stock-transfers/store/types
 */

import type { StockTransfer, StockTransferStatus } from '@/lib/types/prisma-extended';
import type { SystemId, BusinessId } from '../../../lib/id-types';

export interface StockTransferState {
  data: StockTransfer[];
  isLoading: boolean;
  error: string | null;
  counter: number;
  
  // CRUD operations
  add: (transfer: Omit<StockTransfer, 'systemId'> & { id?: string }) => StockTransfer;
  update: (systemId: SystemId, transfer: Partial<StockTransfer>) => void;
  remove: (systemId: SystemId) => void;
  findById: (systemId: SystemId) => StockTransfer | undefined;
  findByBusinessId: (id: BusinessId) => StockTransfer | undefined;
  
  // Status operations (deprecated - use React Query mutations)
  confirmTransfer: (systemId: SystemId, employeeId: SystemId, products?: Array<{ systemId: SystemId; inventoryByBranch?: Record<string, number> }>, employee?: { systemId: SystemId; fullName: string }) => boolean;
  confirmReceive: (systemId: SystemId, employeeId: SystemId, products?: Array<{ systemId: SystemId; inventoryByBranch?: Record<string, number> }>, employee?: { systemId: SystemId; fullName: string }, receivedItems?: { productSystemId: SystemId; receivedQuantity: number }[]) => boolean;
  cancelTransfer: (systemId: SystemId, employeeId: SystemId, products?: string[], reason?: string) => boolean;
  
  // Helpers
  getNextId: () => BusinessId;
  isBusinessIdExists: (id: string) => boolean;
}

export type { StockTransfer, StockTransferStatus };
