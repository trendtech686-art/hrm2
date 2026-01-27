/**
 * Stock Transfers Store - Status Slice
 * Status management operations (confirm, receive, cancel)
 * 
 * ⚠️ DEPRECATED: These store methods are replaced by server-side mutations
 * Use: useStockTransferMutations() from '@/features/stock-transfers/hooks/use-stock-transfers'
 * 
 * @module features/stock-transfers/store/status-slice
 */

import type { SystemId } from '../../../lib/id-types';
import type { StockTransfer } from './types';

type GetState = () => { data: StockTransfer[]; findById: (id: SystemId) => StockTransfer | undefined };
type SetState = (fn: (state: { data: StockTransfer[] }) => { data: StockTransfer[] }) => void;

/**
 * @deprecated Use React Query mutation: useStockTransferMutations().start
 * Confirm transfer - from 'pending' to 'transferring'
 * This is now handled server-side via POST /api/stock-transfers/:id/start
 * 
 * Server atomically:
 * - Updates transfer status
 * - Dispatches stock from source branch
 * - Creates stock history entries
 */
export const confirmTransfer = (
  _get: GetState,
  _set: SetState,
  _systemId: SystemId,
  _employeeId: SystemId,
  _products: Array<{ systemId: SystemId; inventoryByBranch?: Record<string, number> }>,
  _employee?: { systemId: SystemId; fullName: string }
): boolean => {
  console.warn('⚠️ DEPRECATED: confirmTransfer store method. Use useStockTransferMutations().start mutation instead.');
  return false;
};

/**
 * @deprecated Use React Query mutation: useStockTransferMutations().complete
 * Confirm receive - from 'transferring' to 'completed'
 * This is now handled server-side via POST /api/stock-transfers/:id/complete
 * 
 * Server atomically:
 * - Updates transfer status and received quantities
 * - Adds stock to destination branch
 * - Clears inTransit from source branch
 * - Creates stock history entries
 */
export const confirmReceive = (
  _get: GetState,
  _set: SetState,
  _systemId: SystemId,
  _employeeId: SystemId,
  _products: Array<{ systemId: SystemId; inventoryByBranch?: Record<string, number> }>,
  _employee?: { systemId: SystemId; fullName: string },
  _receivedItems?: { productSystemId: SystemId; receivedQuantity: number }[]
): boolean => {
  console.warn('⚠️ DEPRECATED: confirmReceive store method. Use useStockTransferMutations().complete mutation instead.');
  return false;
};

/**
 * @deprecated Use React Query mutation: useStockTransferMutations().cancel
 * Cancel transfer
 * This is now handled server-side via POST /api/stock-transfers/:id/cancel
 * 
 * Server atomically:
 * - Updates transfer status to cancelled
 * - Returns stock from transit if transferring
 * - Creates stock history entries
 * - Records cancel reason
 */
export const cancelTransfer = (
  _get: GetState,
  _set: SetState,
  _systemId: SystemId,
  _employeeId: SystemId,
  _products: Array<{ systemId: SystemId; inventoryByBranch?: Record<string, number> }>,
  _employee?: { systemId: SystemId; fullName: string },
  _reason?: string
): boolean => {
  console.warn('⚠️ DEPRECATED: cancelTransfer store method. Use useStockTransferMutations().cancel mutation instead.');
  return false;
};
