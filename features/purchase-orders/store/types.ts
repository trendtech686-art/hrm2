/**
 * Purchase Orders Store - Types
 * Type definitions for the purchase order store
 * 
 * @module features/purchase-orders/store/types
 */

import type { 
    PurchaseOrder, 
    PurchaseOrderPayment, 
    PurchaseOrderRefundStatus 
} from '@/lib/types/prisma-extended';

export interface PurchaseOrderStoreState {
    data: PurchaseOrder[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    add: (item: Omit<PurchaseOrder, 'systemId'>) => any;
    addMultiple: (items: Omit<PurchaseOrder, 'systemId'>[]) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    update: (systemId: string, item: any) => void;
    remove: (systemId: string) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    findById: (systemId: string) => any;
    
    // Payment methods
    addPayment: (purchaseOrderId: string, payment: Omit<PurchaseOrderPayment, 'id'>) => void;
    updatePaymentStatusForPoIds: (poIds: string[]) => void;
    
    // Inventory methods
    processInventoryReceipt: (purchaseOrderSystemId: string) => void;
    
    // Return methods
    processReturn: (purchaseOrderId: string, isFullReturn: boolean, newRefundStatus: PurchaseOrderRefundStatus | undefined, returnId: string, creatorName: string) => void;
    
    // Status methods
    syncAllPurchaseOrderStatuses: () => void;
    finishOrder: (systemId: string, userId: string, userName: string) => void;
    cancelOrder: (systemId: string, userId: string, userName: string) => void;
    bulkCancel: (systemIds: string[], userId: string, userName: string) => void;
    
    // Print
    printPurchaseOrders: (systemIds: string[]) => void;
}
