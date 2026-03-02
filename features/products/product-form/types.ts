/**
 * Types and helpers for ProductFormComplete
 */

import type { Product } from "@/lib/types/prisma-extended";
import type { SystemId } from '@/lib/id-types';

// ============================================================================
// Validation
// ============================================================================

export type ValidationError = { field: string; message: string };

export function validateProductForm(
  values: ProductFormCompleteValues,
  MIN_COMBO_ITEMS: number,
  MAX_COMBO_ITEMS: number
): ValidationError[] {
  const errors: ValidationError[] = [];
  
  // Required fields (id is optional - will be auto-generated if empty)
  if (!values.name?.trim()) {
    errors.push({ field: 'name', message: 'Tên sản phẩm là bắt buộc' });
  }
  if (!values.unit?.trim()) {
    errors.push({ field: 'unit', message: 'Đơn vị tính là bắt buộc' });
  }
  if (values.costPrice < 0) {
    errors.push({ field: 'costPrice', message: 'Giá vốn phải >= 0' });
  }
  
  // Combo validation
  if (values.type === 'combo') {
    if (!values.comboItems || values.comboItems.length < MIN_COMBO_ITEMS) {
      errors.push({ field: 'comboItems', message: `Combo phải có ít nhất ${MIN_COMBO_ITEMS} sản phẩm` });
    }
    if (values.comboItems && values.comboItems.length > MAX_COMBO_ITEMS) {
      errors.push({ field: 'comboItems', message: `Combo chỉ được tối đa ${MAX_COMBO_ITEMS} sản phẩm` });
    }
    if (values.comboPricingType === 'fixed' && (!values.comboDiscount || values.comboDiscount <= 0)) {
      errors.push({ field: 'comboDiscount', message: 'Vui lòng nhập giá combo' });
    }
    if (values.comboPricingType === 'sum_discount_percent' && values.comboDiscount !== undefined && values.comboDiscount > 100) {
      errors.push({ field: 'comboDiscount', message: 'Phần trăm giảm giá không được vượt quá 100%' });
    }
  }
  
  return errors;
}

// ============================================================================
// Form Values Type
// ============================================================================

export type ProductFormCompleteValues = Omit<Product, 'id' | 'systemId' | 'ktitle'> & {
  id: string;
  systemId?: SystemId;
  title?: string;
};

export type ProductFormCompleteProps = {
  initialData: Product | null;
  onSubmit: (values: ProductFormCompleteValues) => void;
  onCancel: () => void;
  isEditMode?: boolean;
  defaultType?: Product['type'];
};

// ============================================================================
// Common form field option types
// ============================================================================

export type ComboboxOption = {
  value: string;
  label: string;
};
