// FIX: Re-export LineItem to make it available to other modules importing from this file.
export type { LineItem } from '../orders/types';
import type { LineItem as LocalLineItem } from '../orders/types';
import type { BusinessId, SystemId } from '@/lib/id-types';

export type ReturnLineItem = {
  productSystemId: SystemId;
  productId: BusinessId;
  productName: string;
  returnQuantity: number;
  unitPrice: number;
  totalValue: number;
  note?: string; // Ghi chú cho từng sản phẩm
};

export type SalesReturnPayment = {
  method: string;
  accountSystemId: SystemId;
  amount: number;
};

export type SalesReturn = {
  systemId: SystemId;
  id: BusinessId; // e.g., SR000001
  orderSystemId: SystemId;
  orderId: BusinessId;
  customerSystemId: SystemId;
  customerName: string;
  branchSystemId: SystemId; // ✅ Branch systemId only
  branchName: string;
  returnDate: string; // YYYY-MM-DD HH:mm
  reason?: string | undefined;
  note?: string | undefined;       // ✅ Short note field
  notes?: string | undefined;      // ✅ Detailed notes
  reference?: string | undefined;  // ✅ External reference code

  // Items being returned by the customer
  items: ReturnLineItem[];
  totalReturnValue: number;
  isReceived: boolean; // ✅ Whether the returned items have been received and added to inventory

  // New items the customer is taking (exchange)
  exchangeItems: LocalLineItem[];
  exchangeOrderSystemId?: SystemId | undefined; // Link to the new order created for exchange items
  subtotalNew: number;
  shippingFeeNew: number;
  discountNew?: number | undefined;
  discountNewType?: 'percentage' | 'fixed' | undefined;
  grandTotalNew: number;
  
  // Shipping info for exchange order
  deliveryMethod?: string | undefined;
  shippingPartnerId?: string | undefined;
  shippingServiceId?: string | undefined;
  shippingAddress?: any;
  packageInfo?: any;
  configuration?: any;
  
  // Financial Summary
  finalAmount: number; // Positive if customer pays, negative if company refunds

  // For refunds from company to customer (deprecated - use refunds array)
  refundMethod?: string | undefined;
  refundAmount?: number | undefined;
  accountSystemId?: SystemId | undefined;
  
  // ✅ NEW: Multiple refund methods support
  refunds?: SalesReturnPayment[] | undefined;
  
  // For payments from customer to company
  payments?: SalesReturnPayment[] | undefined;

  // Link to vouchers if any are created
  paymentVoucherSystemId?: SystemId | undefined; // For single refund (deprecated)
  paymentVoucherSystemIds?: SystemId[] | undefined; // ✅ NEW: For multiple refunds
  receiptVoucherSystemIds?: SystemId[] | undefined; // For multiple customer payments

  creatorSystemId: SystemId; // ✅ Creator employee systemId
  creatorName: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
};
