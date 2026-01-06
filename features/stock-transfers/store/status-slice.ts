/**
 * Stock Transfers Store - Status Slice
 * Status management operations (confirm, receive, cancel)
 * 
 * @module features/stock-transfers/store/status-slice
 */

import type { SystemId } from '../../../lib/id-types';
import type { StockTransfer, StockTransferStatus } from './types';
import { useProductStore } from '../../products/store';
import { useStockHistoryStore } from '../../stock-history/store';
import { useEmployeeStore } from '../../employees/store';
import { formatDateCustom, getCurrentDate } from '@/lib/date-utils';

type GetState = () => { data: StockTransfer[]; findById: (id: SystemId) => StockTransfer | undefined };
type SetState = (fn: (state: { data: StockTransfer[] }) => { data: StockTransfer[] }) => void;

/**
 * Confirm transfer - from 'pending' to 'transferring'
 * Deduct stock from source branch
 */
export const confirmTransfer = (
  get: GetState,
  set: SetState,
  systemId: SystemId,
  employeeId: SystemId
): boolean => {
  const transfer = get().findById(systemId);
  if (!transfer || transfer.status !== 'pending') return false;

  const { dispatchStock } = useProductStore.getState();
  const { addEntry: addStockHistory } = useStockHistoryStore.getState();
  const employee = useEmployeeStore.getState().findById(employeeId);
  const now = formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm');

  // Dispatch from source branch
  transfer.items.forEach(item => {
    dispatchStock(item.productSystemId, transfer.fromBranchSystemId, item.quantity);
    
    const product = useProductStore.getState().findById(item.productSystemId);
    const currentStock = product?.inventoryByBranch?.[transfer.fromBranchSystemId] || 0;
    
    addStockHistory({
      date: now,
      productId: item.productSystemId,
      action: 'Xuất chuyển kho',
      quantityChange: -item.quantity,
      newStockLevel: currentStock,
      documentId: transfer.id,
      branchSystemId: transfer.fromBranchSystemId,
      branch: transfer.fromBranchName,
      employeeName: employee?.fullName || 'Hệ thống',
    });
  });

  set(state => ({
    data: state.data.map(t =>
      t.systemId === systemId
        ? {
            ...t,
            status: 'transferring' as StockTransferStatus,
            transferredDate: now,
            transferredBySystemId: employeeId,
            transferredByName: employee?.fullName || '',
            updatedAt: new Date().toISOString(),
            updatedBy: employeeId,
          }
        : t
    ),
  }));

  return true;
};

/**
 * Confirm receive - from 'transferring' to 'completed'
 * Add stock to destination branch
 */
export const confirmReceive = (
  get: GetState,
  set: SetState,
  systemId: SystemId,
  employeeId: SystemId,
  receivedItems?: { productSystemId: SystemId; receivedQuantity: number }[]
): boolean => {
  const transfer = get().findById(systemId);
  if (!transfer || transfer.status !== 'transferring') return false;

  const { completeDelivery } = useProductStore.getState();
  const { addEntry: addStockHistory } = useStockHistoryStore.getState();
  const employee = useEmployeeStore.getState().findById(employeeId);
  const now = formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm');

  const updatedItems = transfer.items.map(item => {
    const received = receivedItems?.find(r => r.productSystemId === item.productSystemId);
    return {
      ...item,
      receivedQuantity: received?.receivedQuantity ?? item.quantity,
    };
  });

  updatedItems.forEach(item => {
    const receivedQty = item.receivedQuantity ?? item.quantity;
    
    completeDelivery(item.productSystemId, transfer.toBranchSystemId, receivedQty);
    
    const product = useProductStore.getState().findById(item.productSystemId);
    const currentStock = product?.inventoryByBranch?.[transfer.toBranchSystemId] || 0;
    
    addStockHistory({
      date: now,
      productId: item.productSystemId,
      action: 'Nhập chuyển kho',
      quantityChange: receivedQty,
      newStockLevel: currentStock,
      documentId: transfer.id,
      branchSystemId: transfer.toBranchSystemId,
      branch: transfer.toBranchName,
      employeeName: employee?.fullName || 'Hệ thống',
    });
  });

  set(state => ({
    data: state.data.map(t =>
      t.systemId === systemId
        ? {
            ...t,
            status: 'completed' as StockTransferStatus,
            items: updatedItems,
            receivedDate: now,
            receivedBySystemId: employeeId,
            receivedByName: employee?.fullName || '',
            updatedAt: new Date().toISOString(),
            updatedBy: employeeId,
          }
        : t
    ),
  }));

  return true;
};

/**
 * Cancel transfer
 * Return stock if already transferring
 */
export const cancelTransfer = (
  get: GetState,
  set: SetState,
  systemId: SystemId,
  employeeId: SystemId,
  reason?: string
): boolean => {
  const transfer = get().findById(systemId);
  if (!transfer || transfer.status === 'completed' || transfer.status === 'cancelled') return false;

  const employee = useEmployeeStore.getState().findById(employeeId);
  const now = formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm');

  if (transfer.status === 'transferring') {
    const { returnStockFromTransit } = useProductStore.getState();
    const { addEntry: addStockHistory } = useStockHistoryStore.getState();

    transfer.items.forEach(item => {
      returnStockFromTransit(item.productSystemId, transfer.fromBranchSystemId, item.quantity);
      
      const product = useProductStore.getState().findById(item.productSystemId);
      const currentStock = product?.inventoryByBranch?.[transfer.fromBranchSystemId] || 0;
      
      addStockHistory({
        date: now,
        productId: item.productSystemId,
        action: 'Hủy chuyển kho',
        quantityChange: item.quantity,
        newStockLevel: currentStock,
        documentId: transfer.id,
        branchSystemId: transfer.fromBranchSystemId,
        branch: transfer.fromBranchName,
        employeeName: employee?.fullName || 'Hệ thống',
      });
    });
  }

  const trimmedReason = reason?.trim();

  set(state => ({
    data: state.data.map(t =>
      t.systemId === systemId
        ? {
            ...t,
            status: 'cancelled' as StockTransferStatus,
            cancelledDate: now,
            cancelledBySystemId: employeeId,
            cancelledByName: employee?.fullName || '',
            ...(trimmedReason ? { cancelReason: trimmedReason } : {}),
            updatedAt: new Date().toISOString(),
            updatedBy: employeeId,
          }
        : t
    ),
  }));

  return true;
};
