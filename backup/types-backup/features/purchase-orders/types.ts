import type { HistoryEntry } from '../../components/ActivityHistory';

export type PurchaseOrderStatus = "Đặt hàng" | "Đang giao dịch" | "Hoàn thành" | "Đã hủy" | "Kết thúc" | "Đã trả hàng";
export type DeliveryStatus = "Chưa nhập" | "Đã nhập một phần" | "Đã nhập";
export type PaymentStatus = "Chưa thanh toán" | "Thanh toán một phần" | "Đã thanh toán";
export type PurchaseOrderReturnStatus = "Chưa hoàn trả" | "Hoàn hàng một phần" | "Hoàn hàng toàn bộ";
export type PurchaseOrderRefundStatus = "Chưa hoàn tiền" | "Hoàn tiền một phần" | "Hoàn tiền toàn bộ";

export type PurchaseOrderPayment = {
  systemId: string;
  id: string;
  method: string;
  amount: number;
  paymentDate: string; // ISO string
  reference?: string | undefined;
  payerName: string;
};

export type PurchaseOrderLineItem = {
  productSystemId: string; 
  productId: string; // User-facing SKU, for display
  productName: string;
  sku?: string | undefined; // Product SKU
  unit?: string | undefined; // Unit of measure
  imageUrl?: string | undefined; // Product image
  quantity: number;
  unitPrice: number; // Purchase price
  discount: number;
  discountType: 'percentage' | 'fixed';
  taxRate: number; // VAT rate as a percentage (e.g., 8 for 8%)
  note?: string | undefined; // Line item note
};

export type PurchaseOrder = {
  systemId: string; // ✅ Reverted: Keep as string
  id: string; // Auto-generated (e.g., PO001)
  supplierSystemId: string;
  supplierName: string;
  branchSystemId: string; // ✅ Branch systemId only
  branchName: string;
  orderDate: string; // YYYY-MM-DD
  deliveryDate?: string | undefined; // YYYY-MM-DD HH:mm, was expectedDeliveryDate
  buyerSystemId: string;
  buyer: string; // Employee who created the PO
  creatorSystemId: string;
  creatorName: string;
  status: PurchaseOrderStatus;
  deliveryStatus: DeliveryStatus;
  paymentStatus: PaymentStatus;
  returnStatus?: PurchaseOrderReturnStatus | undefined;
  refundStatus?: PurchaseOrderRefundStatus | undefined;
  lineItems: PurchaseOrderLineItem[];
  subtotal: number;
  discount?: number | undefined; // Giảm giá tổng đơn
  discountType?: 'percentage' | 'fixed' | undefined; // Loại giảm giá
  shippingFee: number;
  tax: number;
  grandTotal: number;
  payments: PurchaseOrderPayment[];
  inventoryReceiptIds?: string[] | undefined;
  notes?: string | undefined;
  reference?: string | undefined;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  activityHistory?: HistoryEntry[] | undefined;
};
