import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { StockTransfer, StockTransferStatus, StockTransferItem } from '@/lib/types/prisma-extended';
import { data as initialData } from './data';
import { asSystemId, asBusinessId, type SystemId, type BusinessId } from '../../lib/id-types';
import { useProductStore } from '../products/store';
import { useStockHistoryStore } from '../stock-history/store';
import { useEmployeeStore } from '../employees/store';
import { formatDateCustom, getCurrentDate } from '@/lib/date-utils';

interface StockTransferState {
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
  
  // Status operations
  confirmTransfer: (systemId: SystemId, employeeId: SystemId) => boolean;
  confirmReceive: (systemId: SystemId, employeeId: SystemId, receivedItems?: { productSystemId: SystemId; receivedQuantity: number }[]) => boolean;
  cancelTransfer: (systemId: SystemId, employeeId: SystemId, reason?: string) => boolean;
  
  // Helpers
  getNextId: () => BusinessId;
  isBusinessIdExists: (id: string) => boolean;
}

let counter = initialData.length;

const generateNextId = (currentCounter: number): BusinessId => {
  return asBusinessId(`PCK${String(currentCounter + 1).padStart(6, '0')}`);
};

const generateSystemId = (currentCounter: number): SystemId => {
  return asSystemId(`TRANSFER${String(currentCounter + 1).padStart(6, '0')}`);
};

export const useStockTransferStore = create<StockTransferState>()(
  persist(
    (set, get) => ({
      data: initialData,
      isLoading: false,
      error: null,
      counter: initialData.length,

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

      /**
       * Xác nhận chuyển hàng - Chuyển từ 'pending' sang 'transferring'
       * - Trừ tồn kho chi nhánh chuyển
       * - Tăng "hàng đang về" (inTransit) chi nhánh nhận
       */
      confirmTransfer: (systemId, employeeId) => {
        const transfer = get().findById(systemId);
        if (!transfer || transfer.status !== 'pending') return false;

        const { dispatchStock } = useProductStore.getState();
        const { addEntry: addStockHistory } = useStockHistoryStore.getState();
        const employee = useEmployeeStore.getState().findById(employeeId);
        const now = formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm');

        // Xuất kho từ chi nhánh chuyển
        transfer.items.forEach(item => {
          // Dispatch = giảm tồn kho, tăng inTransit
          dispatchStock(item.productSystemId, transfer.fromBranchSystemId, item.quantity);
          
          // Ghi lịch sử kho
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

        // Cập nhật trạng thái
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
      },

      /**
       * Xác nhận nhận hàng - Chuyển từ 'transferring' sang 'completed'
       * - Giảm "hàng đang về" chi nhánh nhận
       * - Tăng tồn kho thực tế chi nhánh nhận
       */
      confirmReceive: (systemId, employeeId, receivedItems) => {
        const transfer = get().findById(systemId);
        if (!transfer || transfer.status !== 'transferring') return false;

        const { completeDelivery, updateInventory } = useProductStore.getState();
        const { addEntry: addStockHistory } = useStockHistoryStore.getState();
        const employee = useEmployeeStore.getState().findById(employeeId);
        const now = formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm');

        // Cập nhật số lượng nhận thực tế
        const updatedItems = transfer.items.map(item => {
          const received = receivedItems?.find(r => r.productSystemId === item.productSystemId);
          return {
            ...item,
            receivedQuantity: received?.receivedQuantity ?? item.quantity,
          };
        });

        // Nhập kho vào chi nhánh nhận
        updatedItems.forEach(item => {
          const receivedQty = item.receivedQuantity ?? item.quantity;
          
          // Complete delivery = giảm inTransit, tăng inventory
          completeDelivery(item.productSystemId, transfer.toBranchSystemId, receivedQty);
          
          // Ghi lịch sử kho
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

        // Cập nhật trạng thái
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
      },

      /**
       * Hủy phiếu chuyển kho
       * - Nếu đang ở 'pending': chỉ cập nhật trạng thái
       * - Nếu đang ở 'transferring': hoàn lại tồn kho chi nhánh chuyển
       */
      cancelTransfer: (systemId, employeeId, reason) => {
        const transfer = get().findById(systemId);
        if (!transfer || transfer.status === 'completed' || transfer.status === 'cancelled') return false;

        const employee = useEmployeeStore.getState().findById(employeeId);
        const now = formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm');

        // Nếu đang chuyển, hoàn lại tồn kho
        if (transfer.status === 'transferring') {
          const { returnStockFromTransit } = useProductStore.getState();
          const { addEntry: addStockHistory } = useStockHistoryStore.getState();

          transfer.items.forEach(item => {
            // Return from transit = giảm inTransit, tăng inventory tại chi nhánh chuyển
            returnStockFromTransit(item.productSystemId, transfer.fromBranchSystemId, item.quantity);
            
            // Ghi lịch sử kho
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

        // Cập nhật trạng thái
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
      },
    }),
    {
      name: 'hrm-stock-transfers',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
