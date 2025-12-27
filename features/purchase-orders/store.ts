import { create } from 'zustand';
import { data as initialDataOmit } from './data';
import type { PurchaseOrder, PurchaseOrderPayment, PurchaseOrderStatus, PurchaseOrderDeliveryStatus as DeliveryStatus, PurchaseOrderPaymentStatus as PaymentStatus, PurchaseOrderReturnStatus, PurchaseOrderRefundStatus } from '@/lib/types/prisma-extended';
import type { HistoryEntry } from '../../components/ActivityHistory';
// REMOVED: Voucher store no longer exists
// import { useVoucherStore } from '../vouchers/store';
import { useInventoryReceiptStore, syncInventoryReceiptsWithPurchaseOrders } from '../inventory-receipts/store';
import { usePaymentStore } from '../payments/store';
import type { Payment } from '../payments/types';
import { useReceiptStore } from '../receipts/store';
import type { Receipt } from '../receipts/types';
import { useEmployeeStore } from '../employees/store';
import { usePurchaseReturnStore } from '../purchase-returns/store';
import { formatDate, formatDateCustom, toISODate, toISODateTime } from '../../lib/date-utils';
import { useCashbookStore } from '../cashbook/store';
import { useReceiptTypeStore } from '../settings/receipt-types/store';
import { usePaymentTypeStore } from '../settings/payments/types/store';
import { createCrudStore } from '../../lib/store-factory';
import { sumPaymentsForPurchaseOrder } from './payment-utils';
import { useProductStore } from '../products/store';
import { asSystemId } from '@/lib/id-types';

const initialData: PurchaseOrder[] = initialDataOmit.map((po, index) => ({
  ...po,
  creatorSystemId: po.buyerSystemId,
  creatorName: po.buyer,
  systemId: `PO${String(index + 1).padStart(8, '0')}`,
}));

const baseStore = createCrudStore<any>(initialData as any, 'purchase-orders', {
  businessIdField: 'id',
  persistKey: 'hrm-purchase-orders',
});

const runInventoryReceiptBackfill = () => {
  syncInventoryReceiptsWithPurchaseOrders({
    purchaseOrders: baseStore.getState().data,
    products: useProductStore.getState().data,
  });
};

runInventoryReceiptBackfill();

// Re-run backfill whenever purchase orders or products hydrate/update
(baseStore as typeof baseStore & { subscribe?: (listener: () => void) => () => void }).subscribe?.(() => {
  runInventoryReceiptBackfill();
});

(useProductStore as typeof useProductStore & { subscribe?: (listener: () => void) => () => void }).subscribe?.(() => {
  runInventoryReceiptBackfill();
});

// Helper functions for ActivityHistory
const getCurrentUserInfo = () => {
  const employees = useEmployeeStore.getState().data;
  // Fallback to system user
  return { systemId: 'SYSTEM', name: 'Hệ thống' };
};

const createHistoryEntry = (
  action: HistoryEntry['action'],
  description: string,
  user: { systemId: string; name: string },
  metadata?: HistoryEntry['metadata']
): HistoryEntry => ({
  id: crypto.randomUUID(),
  action,
  timestamp: new Date(),
  user: { systemId: user.systemId, name: user.name },
  description,
  metadata,
});

const augmentedMethods = {
  addPayment: (purchaseOrderId: string, payment: Omit<PurchaseOrderPayment, 'id'>) => baseStore.setState(state => {
    const { data: allReturns } = usePurchaseReturnStore.getState();
    const newData = state.data.map(po => {
      if (po.systemId === purchaseOrderId) {
        const poSystemId = asSystemId(po.systemId);
        const newPayment: PurchaseOrderPayment = {
          ...payment,
          id: `PAY_${po.id}_${(po.payments || []).length + 1}`
        };
        const updatedPayments = [...(po.payments || []), newPayment];
        const totalPaid = updatedPayments.reduce((sum, p) => sum + p.amount, 0);

        const totalReturnedValue = allReturns
          .filter(r => r.purchaseOrderSystemId === poSystemId)
          .reduce((sum, r) => sum + r.totalReturnValue, 0);
        const actualDebt = po.grandTotal - totalReturnedValue;
        
        let newPaymentStatus: PurchaseOrder['paymentStatus'];
        if (totalPaid >= actualDebt) {
          newPaymentStatus = 'Đã thanh toán';
        } else if (totalPaid > 0) {
          newPaymentStatus = 'Thanh toán một phần';
        } else {
          newPaymentStatus = 'Chưa thanh toán';
        }

        let newStatus: PurchaseOrderStatus = po.status;
        if (po.status !== 'Đã hủy' && po.status !== 'Kết thúc') {
          // Hoàn thành: đã nhập hết + đã thanh toán hết
          if (po.deliveryStatus === 'Đã nhập' && newPaymentStatus === 'Đã thanh toán') {
            newStatus = 'Hoàn thành';
          }
          // Đặt hàng: chưa nhập + chưa thanh toán
          else if (po.deliveryStatus === 'Chưa nhập' && newPaymentStatus === 'Chưa thanh toán') {
            newStatus = 'Đặt hàng';
          }
          // Đang giao dịch: tất cả trường hợp khác
          else {
            newStatus = 'Đang giao dịch';
          }
        }
        
        return { ...po, payments: updatedPayments, paymentStatus: newPaymentStatus, status: newStatus };
      }
      return po;
    });
    return { data: newData };
  }),
  updatePaymentStatusForPoIds: (poIds: string[]) => {
    baseStore.setState(state => {
        const { data: allPayments } = usePaymentStore.getState();
        const { data: allReturns } = usePurchaseReturnStore.getState();
        const uniquePoIds = [...new Set(poIds)];
    
        const newData = [...state.data];
        let changed = false;

        uniquePoIds.forEach(poId => {
            const poIndex = newData.findIndex(p => p.id === poId);
            if (poIndex === -1) return;

            const po = newData[poIndex] as PurchaseOrder;
            const poSystemId = asSystemId(po.systemId);
            
            const totalPaid = sumPaymentsForPurchaseOrder(allPayments, po);
            
            const totalReturnedValue = allReturns
              .filter(r => r.purchaseOrderSystemId === poSystemId)
                .reduce((sum, r) => sum + r.totalReturnValue, 0);
            const actualDebt = po.grandTotal - totalReturnedValue;

            let newPaymentStatus: PaymentStatus;
            if (totalPaid >= actualDebt) {
                newPaymentStatus = 'Đã thanh toán';
            } else if (totalPaid > 0) {
                newPaymentStatus = 'Thanh toán một phần';
            } else {
                newPaymentStatus = 'Chưa thanh toán';
            }
            
            let newStatus: PurchaseOrderStatus = po.status;
            if (po.status !== 'Đã hủy' && po.status !== 'Kết thúc') {
              // Hoàn thành: đã nhập hết + đã thanh toán hết
              if (po.deliveryStatus === 'Đã nhập' && newPaymentStatus === 'Đã thanh toán') {
                newStatus = 'Hoàn thành';
              }
              // Đặt hàng: chưa nhập + chưa thanh toán
              else if (po.deliveryStatus === 'Chưa nhập' && newPaymentStatus === 'Chưa thanh toán') {
                newStatus = 'Đặt hàng';
              }
              // Đang giao dịch: tất cả trường hợp khác
              else {
                newStatus = 'Đang giao dịch';
              }
            }

            if (po.paymentStatus !== newPaymentStatus || po.status !== newStatus) {
                newData[poIndex] = { ...po, paymentStatus: newPaymentStatus, status: newStatus };
                changed = true;
            }
        });

        return changed ? { data: newData } : state;
    });
  },
  processInventoryReceipt: (purchaseOrderSystemId: string) => {
    baseStore.setState(state => {
      const { data: allReceipts } = useInventoryReceiptStore.getState();
      const poIndex = state.data.findIndex(p => p.systemId === purchaseOrderSystemId);
      if (poIndex === -1) return state;

      const po = state.data[poIndex] as PurchaseOrder;
      const poReceipts = allReceipts.filter(r => r.purchaseOrderSystemId === purchaseOrderSystemId);
      const totalReceivedByProduct = po.lineItems.reduce((acc, lineItem) => {
        const totalReceived = poReceipts.reduce((sum, receipt) => {
          const item = receipt.items.find(i => i.productSystemId === lineItem.productSystemId);
          return sum + (item ? Number(item.receivedQuantity) : 0);
        }, 0);
        acc[lineItem.productSystemId] = totalReceived;
        return acc;
      }, {} as Record<string, number>);

      const allItemsFullyReceived = po.lineItems.every(item => (totalReceivedByProduct[item.productSystemId] || 0) >= item.quantity);
      const anyItemReceived = Object.values(totalReceivedByProduct).some(qty => qty > 0);

      let newDeliveryStatus: DeliveryStatus;
      if (allItemsFullyReceived) {
        newDeliveryStatus = 'Đã nhập';
      } else if (anyItemReceived) {
        newDeliveryStatus = 'Đã nhập một phần';
      } else {
        newDeliveryStatus = 'Chưa nhập';
      }
      
      let newStatus: PurchaseOrderStatus = po.status;
      // Chỉ tự động cập nhật status nếu KHÔNG phải trạng thái terminal
      if (po.status !== 'Đã hủy' && po.status !== 'Kết thúc') {
          // Hoàn thành: đã nhập hết + đã thanh toán hết
          if (newDeliveryStatus === 'Đã nhập' && po.paymentStatus === 'Đã thanh toán') {
            newStatus = 'Hoàn thành';
          }
          // Đặt hàng: chưa nhập + chưa thanh toán
          else if (newDeliveryStatus === 'Chưa nhập' && po.paymentStatus === 'Chưa thanh toán') {
            newStatus = 'Đặt hàng';
          }
          // Đang giao dịch: tất cả trường hợp khác
          else {
            newStatus = 'Đang giao dịch';
          }
      }

      if (po.deliveryStatus !== newDeliveryStatus || po.status !== newStatus) {
        const newData = [...state.data];
        const updatedPO: PurchaseOrder = { ...po, deliveryStatus: newDeliveryStatus, status: newStatus };

        if (po.deliveryStatus === 'Chưa nhập' && newDeliveryStatus !== 'Chưa nhập') {
          const latestReceipt = poReceipts.sort((a,b) => new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime())[0];
          if (latestReceipt) {
            updatedPO.deliveryDate = latestReceipt.receivedDate;
          }
        }

        newData[poIndex] = updatedPO;

        const latestReceipt = poReceipts.sort((a,b) => new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime())[0];
        const receiptReceiverName = latestReceipt?.receiverName || 'Hệ thống';
        const user = latestReceipt?.receiverSystemId
          ? useEmployeeStore.getState().data.find(e => e.systemId === latestReceipt.receiverSystemId)
          : useEmployeeStore.getState().data.find(e => e.fullName === receiptReceiverName);

        // Add to activityHistory
        const historyEntry = createHistoryEntry(
          'status_changed',
          `Cập nhật trạng thái giao hàng thành "${newDeliveryStatus}" thông qua phiếu nhập kho ${latestReceipt.id}.`,
          { systemId: user?.systemId || 'SYSTEM', name: receiptReceiverName },
          { oldValue: po.deliveryStatus, newValue: newDeliveryStatus, field: 'deliveryStatus' }
        );
        newData[poIndex] = {
          ...updatedPO,
          activityHistory: [...(updatedPO.activityHistory || []), historyEntry],
        };

        return { data: newData };
      }

      return state;
    });
  },
  processReturn: (purchaseOrderId, isFullReturn, newRefundStatus, returnId, creatorName) => baseStore.setState(state => {
        const poIndex = state.data.findIndex(p => p.id === purchaseOrderId);
        if (poIndex === -1) return state;

        const po = state.data[poIndex] as PurchaseOrder;

        let newReturnStatus: PurchaseOrderReturnStatus = 'Hoàn hàng một phần';
        if (isFullReturn) {
            newReturnStatus = 'Hoàn hàng toàn bộ';
        }
        
        // QUAN TRỌNG: Không đè status thành "Đã trả hàng"
        // Chỉ cập nhật returnStatus, giữ nguyên status chính (Hoàn thành, Đang giao dịch, etc.)
        // Logic tự động sẽ xử lý status dựa trên deliveryStatus + paymentStatus
        
        const updatedPO = { 
            ...po, 
            returnStatus: newReturnStatus,
            // Bỏ dòng: status: newStatus,  
            ...(newRefundStatus && { refundStatus: newRefundStatus })
        };
        
        if (returnId && creatorName) {
            const user = useEmployeeStore.getState().data.find(e => e.fullName === creatorName);
            // Add to activityHistory
            const historyEntry = createHistoryEntry(
              'status_changed',
              `Tạo phiếu hoàn trả ${returnId}, cập nhật trạng thái hoàn trả đơn hàng.`,
              { systemId: user?.systemId || 'SYSTEM', name: creatorName },
              { oldValue: po.returnStatus || 'Chưa hoàn trả', newValue: newReturnStatus, field: 'returnStatus' }
            );
            updatedPO.activityHistory = [...(updatedPO.activityHistory || []), historyEntry];
        }
        
        const newData = [...state.data];
        newData[poIndex] = updatedPO;

        return { data: newData };
    }),
  syncAllPurchaseOrderStatuses: () => baseStore.setState(state => {
      const { data: allPayments } = usePaymentStore.getState();
      const { data: allReturns } = usePurchaseReturnStore.getState();
      const newData = state.data.map((po_untyped) => {
        const po = po_untyped as PurchaseOrder;
        const poSystemId = asSystemId(po.systemId);
        const totalPaid = sumPaymentsForPurchaseOrder(allPayments, po);
        
        const totalReturnedValue = allReturns
          .filter(r => r.purchaseOrderSystemId === poSystemId)
          .reduce((sum, r) => sum + r.totalReturnValue, 0);
        const actualDebt = po.grandTotal - totalReturnedValue;
        
        let newPaymentStatus: PaymentStatus;
        if (totalPaid >= actualDebt) {
          newPaymentStatus = 'Đã thanh toán';
        } else if (totalPaid > 0) {
          newPaymentStatus = 'Thanh toán một phần';
        } else {
          newPaymentStatus = 'Chưa thanh toán';
        }
        
        let newStatus: PurchaseOrderStatus = po.status;
        // Chỉ tự động cập nhật status nếu KHÔNG phải trạng thái terminal (Đã hủy, Kết thúc)
        // Bỏ check "Đã trả hàng" vì đây không còn là status chính nữa
        if (po.status !== 'Đã hủy' && po.status !== 'Kết thúc') {
          // Hoàn thành: đã nhập hết + đã thanh toán hết
          if (po.deliveryStatus === 'Đã nhập' && newPaymentStatus === 'Đã thanh toán') {
            newStatus = 'Hoàn thành';
          }
          // Đặt hàng: chưa nhập + chưa thanh toán
          else if (po.deliveryStatus === 'Chưa nhập' && newPaymentStatus === 'Chưa thanh toán') {
            newStatus = 'Đặt hàng';
          }
          // Đang giao dịch: tất cả trường hợp khác (đã có hoạt động nhập hoặc thanh toán)
          else {
            newStatus = 'Đang giao dịch';
          }
        }
        
        if (po.paymentStatus !== newPaymentStatus || po.status !== newStatus) {
            return { ...po, paymentStatus: newPaymentStatus, status: newStatus };
        }
        return po;
      });

      const hasChanged = newData.some((po, index) => po !== state.data[index]);
      return hasChanged ? { data: newData } : state;
    }),
  finishOrder: (systemId: string, userId: string, userName: string) => baseStore.setState(state => {
    const poIndex = state.data.findIndex(p => p.systemId === systemId);
    if (poIndex === -1) return state;

    const po = state.data[poIndex];
    if (po.status === 'Kết thúc' || po.status === 'Đã hủy') return state;

    // Add to activityHistory
    const historyEntry = createHistoryEntry(
      'ended',
      `Đã kết thúc đơn hàng.`,
      { systemId: userId, name: userName },
      { oldValue: po.status, newValue: 'Kết thúc', field: 'status' }
    );
    const updatedPO = { 
      ...po, 
      status: 'Kết thúc' as PurchaseOrderStatus,
      activityHistory: [...(po.activityHistory || []), historyEntry],
    };
    
    const newData = [...state.data];
    newData[poIndex] = updatedPO;
    return { data: newData };
  }),
  cancelOrder: (systemId: string, userId: string, userName: string) => baseStore.setState((state) => {
    const po = state.data.find(p => p.systemId === systemId);

    if (!po || ['Hoàn thành', 'Đã hủy', 'Kết thúc'].includes(po.status)) {
        console.warn(`Attempted to cancel an order with status: ${po?.status}`);
        return state;
    }

    const { data: allPayments } = usePaymentStore.getState();
    const totalPaid = sumPaymentsForPurchaseOrder(allPayments, po);

    if (totalPaid > 0) {
        const { accounts } = useCashbookStore.getState();
        const { data: receiptTypes } = useReceiptTypeStore.getState();
        const { add: addReceipt } = useReceiptStore.getState();
        const refundCategory = receiptTypes.find(rt => rt.name === 'Nhà cung cấp hoàn tiền');
        const targetAccount = accounts.find(acc => acc.type === 'cash' && acc.branchSystemId === po.branchSystemId) || accounts.find(acc => acc.type === 'cash');

        if (refundCategory && targetAccount) {
           const newReceipt: Omit<Receipt, 'systemId'> = {
            id: '' as any, // Let receipt store generate PT-XXXXXX
            date: toISODateTime(new Date()),
            amount: totalPaid,
            payerType: 'Nhà cung cấp',
            payerTypeSystemId: 'NHACUNGCAP',
            payerTypeName: 'Nhà cung cấp',
            payerName: po.supplierName,
            payerSystemId: po.supplierSystemId,
            description: `Nhận hoàn tiền từ NCC cho đơn hàng ${po.id} bị hủy.`,
            paymentMethod: 'Tiền mặt',
            paymentMethodSystemId: 'CASH',
            paymentMethodName: 'Tiền mặt',
            accountSystemId: targetAccount.systemId,
            paymentReceiptTypeSystemId: refundCategory.systemId,
            paymentReceiptTypeName: refundCategory.name,
            branchSystemId: po.branchSystemId,
            branchName: po.branchName,
            createdBy: userName,
            createdAt: toISODateTime(new Date()),
            status: 'completed',
            category: 'other',
            affectsDebt: true,
            purchaseOrderSystemId: po.systemId,
            purchaseOrderId: po.id,
            originalDocumentId: po.id,
          } as any;
          addReceipt(newReceipt);
        } else {
            console.error("Không thể tạo phiếu thu hoàn tiền: Thiếu loại phiếu 'Nhà cung cấp hoàn tiền' hoặc tài khoản quỹ tiền mặt.");
        }
    }
    
    // Add to activityHistory
    const historyEntry = createHistoryEntry(
      'cancelled',
      `Đã hủy đơn hàng.`,
      { systemId: userId, name: userName },
      { oldValue: po.status, newValue: 'Đã hủy', field: 'status' }
    );
    const updatedPO = { 
      ...po, 
      status: 'Đã hủy' as const,
      activityHistory: [...(po.activityHistory || []), historyEntry],
    };
    
    return { data: state.data.map(item => item.systemId === systemId ? updatedPO : item) };
  }),
  
  bulkCancel: (systemIds: string[], userId: string, userName: string) => {
    systemIds.forEach(systemId => {
      augmentedMethods.cancelOrder(systemId, userId, userName);
    });
  },
  
  printPurchaseOrders: (systemIds: string[]) => {
    // Placeholder for print functionality
    console.log('Printing purchase orders:', systemIds);
    // TODO: Implement actual print logic
  },
};

// Define the enhanced store interface
export interface PurchaseOrderStoreState {
  data: PurchaseOrder[];
  add: (item: Omit<PurchaseOrder, 'systemId'>) => PurchaseOrder;
  addMultiple: (items: Omit<PurchaseOrder, 'systemId'>[]) => void;
  update: (systemId: string, item: PurchaseOrder) => void;
  remove: (systemId: string) => void;
  findById: (systemId: string) => PurchaseOrder | undefined;
  addPayment: (purchaseOrderId: string, payment: Omit<PurchaseOrderPayment, 'id'>) => void;
  updatePaymentStatusForPoIds: (poIds: string[]) => void;
  processInventoryReceipt: (purchaseOrderSystemId: string) => void;
  processReturn: (purchaseOrderId: string, isFullReturn: boolean, newRefundStatus: PurchaseOrderRefundStatus | undefined, returnId: string, creatorName: string) => void;
  syncAllPurchaseOrderStatuses: () => void;
  finishOrder: (systemId: string, userId: string, userName: string) => void;
  cancelOrder: (systemId: string, userId: string, userName: string) => void;
  bulkCancel: (systemIds: string[], userId: string, userName: string) => void;
  printPurchaseOrders: (systemIds: string[]) => void;
}

// Export typed hook
export const usePurchaseOrderStore = (): PurchaseOrderStoreState => {
  const state = baseStore();
  return {
    ...state,
    ...augmentedMethods,
  };
};

// Export getState for non-hook usage
usePurchaseOrderStore.getState = () => {
  const state = baseStore.getState();
  return {
    ...state,
    ...augmentedMethods,
  };
};
