// FIX: Re-export LineItem to make it available to other modules importing from this file.
export type { LineItem } from '../orders/types.ts';
import type { LineItem as LocalLineItem } from '../orders/types.ts';

export type ReturnLineItem = {
  productSystemId: string;
  productId: string;
  productName: string;
  returnQuantity: number;
  unitPrice: number;
  totalValue: number;
};

export type SalesReturnPayment = {
  method: string;
  accountSystemId: string;
  amount: number;
};

export type SalesReturn = {
  systemId: string;
  id: string; // e.g., SR000001
  orderSystemId: string;
  orderId: string;
  customerSystemId: string;
  customerName: string;
  branchSystemId: string; // ✅ Branch systemId only
  branchName: string;
  returnDate: string; // YYYY-MM-DD HH:mm
  reason?: string;
  note?: string;       // ✅ Short note field
  notes?: string;      // ✅ Detailed notes
  reference?: string;  // ✅ External reference code

  // Items being returned by the customer
  items: ReturnLineItem[];
  totalReturnValue: number;
  isReceived: boolean; // ✅ Whether the returned items have been received and added to inventory

  // New items the customer is taking (exchange)
  exchangeItems: LocalLineItem[];
  exchangeOrderSystemId?: string; // Link to the new order created for exchange items
  subtotalNew: number;
  shippingFeeNew: number;
  discountNew?: number;
  discountNewType?: 'percentage' | 'fixed';
  grandTotalNew: number;
  
  // Shipping info for exchange order
  deliveryMethod?: string;
  shippingPartnerId?: string;
  shippingServiceId?: string;
  shippingAddress?: any;
  packageInfo?: any;
  configuration?: any;
  
  // Financial Summary
  finalAmount: number; // Positive if customer pays, negative if company refunds

  // For refunds from company to customer (deprecated - use refunds array)
  refundMethod?: string;
  refundAmount?: number;
  accountSystemId?: string;
  
  // ✅ NEW: Multiple refund methods support
  refunds?: SalesReturnPayment[];
  
  // For payments from customer to company
  payments?: SalesReturnPayment[];

  // Link to vouchers if any are created
  paymentVoucherSystemId?: string; // For single refund (deprecated)
  paymentVoucherSystemIds?: string[]; // ✅ NEW: For multiple refunds
  receiptVoucherSystemIds?: string[]; // For multiple customer payments

  creatorSystemId: string; // ✅ Creator employee systemId
  creatorName: string;
};
