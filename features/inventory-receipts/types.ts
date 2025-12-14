import type { PurchaseOrderLineItem } from '../purchase-orders/types.ts';
import { SystemId, BusinessId } from '../../lib/id-types.ts';

export type InventoryReceiptLineItem = {
  productSystemId: SystemId;
  productId: BusinessId; // User-facing SKU, for display
  productName: string;
  orderedQuantity: number;
  receivedQuantity: number;
  unitPrice: number;
};

export type InventoryReceipt = {
  systemId: SystemId;
  id: BusinessId; // e.g., PNK001
  purchaseOrderId: BusinessId; // Business-facing PO code (PO0001)
  purchaseOrderSystemId: SystemId; // Internal systemId (PO00000001)
  supplierSystemId: SystemId;
  supplierName: string;
  receivedDate: string; // YYYY-MM-DD HH:mm
  receiverSystemId: SystemId;
  receiverName: string; // Employee who received the goods
  branchSystemId?: SystemId | undefined;
  branchName?: string | undefined;
  warehouseName?: string | undefined;
  notes?: string | undefined;
  items: InventoryReceiptLineItem[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
};
