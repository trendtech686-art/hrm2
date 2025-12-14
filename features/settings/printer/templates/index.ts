// =============================================
// EXPORT ALL DEFAULT TEMPLATES
// =============================================

// MAIN TEMPLATES (16 loại chính)
export { ORDER_TEMPLATE } from './order';
export { QUOTE_TEMPLATE } from './quote';
export { RECEIPT_TEMPLATE } from './receipt';
export { PAYMENT_TEMPLATE } from './payment';
export { WARRANTY_TEMPLATE } from './warranty';
export { INVENTORY_CHECK_TEMPLATE } from './inventory-check';
export { STOCK_TRANSFER_TEMPLATE } from './stock-transfer';
export { SALES_RETURN_TEMPLATE } from './sales-return';
export { PURCHASE_ORDER_TEMPLATE } from './purchase-order';
export { PACKING_TEMPLATE } from './packing';
export { DELIVERY_TEMPLATE } from './delivery';
export { SHIPPING_LABEL_TEMPLATE } from './shipping-label';
export { PRODUCT_LABEL_TEMPLATE } from './product-label';
export { STOCK_IN_TEMPLATE } from './stock-in';
export { SUPPLIER_RETURN_TEMPLATE } from './supplier-return';
export { COMPLAINT_TEMPLATE } from './complaint';
export { PENALTY_TEMPLATE } from './penalty';
export { COST_ADJUSTMENT_TEMPLATE } from './cost-adjustment';
export { PAYROLL_TEMPLATE } from './payroll';
export { PAYSLIP_TEMPLATE } from './payslip';

// EXTENDED TEMPLATES (8 loại mở rộng - MỚI)
export { SUPPLIER_ORDER_TEMPLATE } from './supplier-order';
export { RETURN_ORDER_TEMPLATE } from './return-order';
export { HANDOVER_TEMPLATE } from './handover';
export { REFUND_CONFIRMATION_TEMPLATE } from './refund-confirmation';
export { PACKING_GUIDE_TEMPLATE } from './packing-guide';
export { SALES_SUMMARY_TEMPLATE } from './sales-summary';
export { WARRANTY_REQUEST_TEMPLATE } from './warranty-request';
export { PACKING_REQUEST_TEMPLATE } from './packing-request';

import { TemplateType } from '../types';

// =============================================
// IMPORT ALL TEMPLATES
// =============================================

// Main Templates
import { ORDER_TEMPLATE } from './order';
import { QUOTE_TEMPLATE } from './quote';
import { RECEIPT_TEMPLATE } from './receipt';
import { PAYMENT_TEMPLATE } from './payment';
import { WARRANTY_TEMPLATE } from './warranty';
import { INVENTORY_CHECK_TEMPLATE } from './inventory-check';
import { STOCK_TRANSFER_TEMPLATE } from './stock-transfer';
import { SALES_RETURN_TEMPLATE } from './sales-return';
import { PURCHASE_ORDER_TEMPLATE } from './purchase-order';
import { PACKING_TEMPLATE } from './packing';
import { DELIVERY_TEMPLATE } from './delivery';
import { SHIPPING_LABEL_TEMPLATE } from './shipping-label';
import { PRODUCT_LABEL_TEMPLATE } from './product-label';
import { STOCK_IN_TEMPLATE } from './stock-in';
import { SUPPLIER_RETURN_TEMPLATE } from './supplier-return';
import { COMPLAINT_TEMPLATE } from './complaint';
import { PENALTY_TEMPLATE } from './penalty';
import { COST_ADJUSTMENT_TEMPLATE } from './cost-adjustment';
import { PAYROLL_TEMPLATE } from './payroll';
import { PAYSLIP_TEMPLATE } from './payslip';
import { ATTENDANCE_TEMPLATE } from './attendance';

// Extended Templates
import { SUPPLIER_ORDER_TEMPLATE } from './supplier-order';
import { RETURN_ORDER_TEMPLATE } from './return-order';
import { HANDOVER_TEMPLATE } from './handover';
import { REFUND_CONFIRMATION_TEMPLATE } from './refund-confirmation';
import { PACKING_GUIDE_TEMPLATE } from './packing-guide';
import { SALES_SUMMARY_TEMPLATE } from './sales-summary';
import { WARRANTY_REQUEST_TEMPLATE } from './warranty-request';
import { PACKING_REQUEST_TEMPLATE } from './packing-request';

// =============================================
// MAP TEMPLATE TYPE TO DEFAULT TEMPLATE CONTENT
// =============================================

// Main Templates (16 loại trong TEMPLATE_TYPES)
export const DEFAULT_TEMPLATES: Record<TemplateType, string> = {
  'order': ORDER_TEMPLATE,
  'quote': QUOTE_TEMPLATE,
  'receipt': RECEIPT_TEMPLATE,
  'payment': PAYMENT_TEMPLATE,
  'warranty': WARRANTY_TEMPLATE,
  'inventory-check': INVENTORY_CHECK_TEMPLATE,
  'stock-transfer': STOCK_TRANSFER_TEMPLATE,
  'sales-return': SALES_RETURN_TEMPLATE,
  'purchase-order': PURCHASE_ORDER_TEMPLATE,
  'packing': PACKING_TEMPLATE,
  'delivery': DELIVERY_TEMPLATE,
  'shipping-label': SHIPPING_LABEL_TEMPLATE,
  'product-label': PRODUCT_LABEL_TEMPLATE,
  'stock-in': STOCK_IN_TEMPLATE,
  'supplier-return': SUPPLIER_RETURN_TEMPLATE,
  'complaint': COMPLAINT_TEMPLATE,
  'penalty': PENALTY_TEMPLATE,
  'leave': PENALTY_TEMPLATE, // TODO: Create dedicated LEAVE_TEMPLATE
  'cost-adjustment': COST_ADJUSTMENT_TEMPLATE,
  'handover': HANDOVER_TEMPLATE,
  'payroll': PAYROLL_TEMPLATE,
  'payslip': PAYSLIP_TEMPLATE,
  'attendance': ATTENDANCE_TEMPLATE,
};

// Extended Templates (8 loại mở rộng)
export const EXTENDED_TEMPLATES: Record<string, string> = {
  'supplier-order': SUPPLIER_ORDER_TEMPLATE,
  'return-order': RETURN_ORDER_TEMPLATE,
  'refund-confirmation': REFUND_CONFIRMATION_TEMPLATE,
  'packing-guide': PACKING_GUIDE_TEMPLATE,
  'sales-summary': SALES_SUMMARY_TEMPLATE,
  'warranty-request': WARRANTY_REQUEST_TEMPLATE,
  'packing-request': PACKING_REQUEST_TEMPLATE,
};

// Get default template by type (includes extended types)
export function getDefaultTemplate(type: TemplateType | string): string {
  if (type in DEFAULT_TEMPLATES) {
    return DEFAULT_TEMPLATES[type as TemplateType];
  }
  if (type in EXTENDED_TEMPLATES) {
    return EXTENDED_TEMPLATES[type];
  }
  return '';
}

// Get all template types
export function getAllTemplateTypes(): string[] {
  return [
    ...Object.keys(DEFAULT_TEMPLATES),
    ...Object.keys(EXTENDED_TEMPLATES),
  ];
}
