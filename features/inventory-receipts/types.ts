import type { PurchaseOrderLineItem } from '../purchase-orders/types.ts';

export type InventoryReceiptLineItem = {
  productSystemId: string;
  productId: string; // User-facing SKU, for display
  productName: string;
  orderedQuantity: number;
  receivedQuantity: number;
  unitPrice: number;
};

export type InventoryReceipt = {
  systemId: string;
  id: string; // e.g., PNK001
  purchaseOrderId: string; // Link to the original PO
  supplierSystemId: string;
  supplierName: string;
  receivedDate: string; // YYYY-MM-DD HH:mm
  receiverSystemId: string;
  receiverName: string; // Employee who received the goods
  notes?: string;
  items: InventoryReceiptLineItem[];
};
