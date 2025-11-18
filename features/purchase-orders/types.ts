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
  reference?: string;
  payerName: string;
};

export type PurchaseOrderLineItem = {
  productSystemId: string; 
  productId: string; // User-facing SKU, for display
  productName: string;
  sku?: string; // Product SKU
  unit?: string; // Unit of measure
  imageUrl?: string; // Product image
  quantity: number;
  unitPrice: number; // Purchase price
  discount: number;
  discountType: 'percentage' | 'fixed';
  taxRate: number; // VAT rate as a percentage (e.g., 8 for 8%)
  note?: string; // Line item note
};

export type PurchaseOrder = {
  systemId: string; // ✅ Reverted: Keep as string
  id: string; // Auto-generated (e.g., PO001)
  supplierSystemId: string;
  supplierName: string;
  branchSystemId: string; // ✅ Branch systemId only
  branchName: string;
  orderDate: string; // YYYY-MM-DD
  deliveryDate?: string; // YYYY-MM-DD HH:mm, was expectedDeliveryDate
  buyerSystemId: string;
  buyer: string; // Employee who created the PO
  creatorSystemId: string;
  creatorName: string;
  status: PurchaseOrderStatus;
  deliveryStatus: DeliveryStatus;
  paymentStatus: PaymentStatus;
  returnStatus?: PurchaseOrderReturnStatus;
  refundStatus?: PurchaseOrderRefundStatus;
  lineItems: PurchaseOrderLineItem[];
  subtotal: number;
  discount?: number; // Giảm giá tổng đơn
  discountType?: 'percentage' | 'fixed'; // Loại giảm giá
  shippingFee: number;
  tax: number;
  grandTotal: number;
  payments: PurchaseOrderPayment[];
  inventoryReceiptIds?: string[];
  notes?: string;
  reference?: string;
};
