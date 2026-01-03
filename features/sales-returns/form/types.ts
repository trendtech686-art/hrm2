/**
 * Types and helper functions for Sales Return Form
 */

import type { ReturnLineItem, LineItem as ExchangeLineItem, CustomerAddress, PackageInfo, OrderAddress } from '@/lib/types/prisma-extended';
import type { Subtask } from '@/components/shared/subtask-list';

// ============================================================================
// Helper Functions
// ============================================================================

export const formatCurrency = (value?: number) => {
  if (typeof value !== 'number' || isNaN(value)) return '0';
  return new Intl.NumberFormat('vi-VN').format(value);
};

// Product type label fallbacks (defined at module level for stable reference)
export const productTypeFallbackLabels: Record<string, string> = {
  physical: 'Hàng hóa',
  combo: 'Combo',
  service: 'Dịch vụ',
  digital: 'Sản phẩm số',
};

// ============================================================================
// Form Types
// ============================================================================

export type FormLineItem = ReturnLineItem & {
  total: number;
  returnableQuantity: number;
  orderedQuantity: number;
  originalUnitPrice: number;
};

export type FormExchangeItem = ExchangeLineItem & { 
  total: number; 
};

export type FormValues = {
  branchSystemId: string;
  returnReason?: string;
  notes?: string;
  reference?: string;
  items: FormLineItem[];
  isReceived: boolean;
  exchangeItems: FormExchangeItem[];
  payments: { method: string; accountSystemId: string; amount: number }[];
  refunds: { method: string; accountSystemId: string; amount: number }[];
  refundMethod: string;
  accountSystemId: string;
  refundAmount: number;
  returnAll: boolean;
  // Exchange order fields
  exchangeNotes?: string;
  exchangeTags?: string;
  orderDiscount?: number;
  orderDiscountType?: 'fixed' | 'percentage';
  shippingFee?: number;
  promotionCode?: string;
  grandTotal?: number;
  // Shipping fields
  deliveryMethod?: string;
  shippingPartnerId?: string;
  shippingServiceId?: string;
  shippingAddress?: CustomerAddress | OrderAddress | null;
  packageInfo?: Partial<PackageInfo>;
  configuration?: Record<string, unknown>;
  // Subtasks
  subtasks?: Subtask[];
};
