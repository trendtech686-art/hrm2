import { z } from 'zod';
import { MAX_COMBO_ITEMS, MIN_COMBO_ITEMS } from './combo-utils';

const nonNegativeNumber = z.number().min(0, 'Giá trị phải lớn hơn hoặc bằng 0');
const stockNumber = z
  .number()
  .min(0, 'Số lượng phải lớn hơn hoặc bằng 0')
  .int('Số lượng phải là số nguyên');

const dimensionsSchema = z
  .object({
    length: nonNegativeNumber.optional(),
    width: nonNegativeNumber.optional(),
    height: nonNegativeNumber.optional(),
  })
  .partial();

/**
 * ComboItem Schema - Sản phẩm con trong Combo
 */
const comboItemSchema = z.object({
  productSystemId: z.string().min(1, 'Sản phẩm là bắt buộc'),
  quantity: z.number()
    .int('Số lượng phải là số nguyên')
    .min(1, 'Số lượng tối thiểu là 1'),
});

/**
 * Product Form Validation Schema
 * Comprehensive validation for product creation and editing
 */
export const productFormSchema = z.object({
  // Required fields
  id: z.string()
    .min(1, 'Mã sản phẩm là bắt buộc')
    .max(50, 'Mã sản phẩm không được quá 50 ký tự')
    .regex(/^[A-Z0-9-]+$/, 'Mã sản phẩm chỉ được chứa chữ in hoa, số và dấu gạch ngang'),
  
  name: z.string()
    .min(1, 'Tên sản phẩm là bắt buộc')
    .max(200, 'Tên sản phẩm không được quá 200 ký tự')
    .trim(),
  
  unit: z.string()
    .min(1, 'Đơn vị tính là bắt buộc'),
  
  costPrice: nonNegativeNumber,
  
  lastPurchasePrice: nonNegativeNumber.optional(),

  prices: z.record(z.string(), nonNegativeNumber),
  
  inventory: stockNumber,
  
  // Optional fields
  title: z.string()
    .max(150, 'Tiêu đề không được quá 150 ký tự')
    .optional(),
  
  seoDescription: z.string()
    .max(300, 'Mô tả SEO không được quá 300 ký tự')
    .optional(),
  
  description: z.string()
    .max(5000, 'Mô tả không được quá 5000 ký tự')
    .optional(),
  
  shortDescription: z.string()
    .max(300, 'Mô tả ngắn không được quá 300 ký tự')
    .optional(),
  
  type: z.enum(['physical', 'service', 'digital', 'combo'])
    .optional(),
  
  productTypeSystemId: z.string().optional(),

  category: z.string()
    .max(100, 'Danh mục không được quá 100 ký tự')
    .optional(),

  categorySystemId: z.string().optional(),

  subCategory: z.string()
    .max(100, 'Danh mục con không được quá 100 ký tự')
    .optional(),

  brandSystemId: z.string().optional(),

  storageLocationSystemId: z.string().optional(),

  pkgxId: z.number()
    .int('ID PKGX phải là số nguyên')
    .positive('ID PKGX phải là số dương')
    .optional(),

  tags: z.array(z.string().max(50, 'Tag không được quá 50 ký tự')).optional(),
  
  status: z.enum(['active', 'inactive', 'discontinued'])
    .optional(),
  
  barcode: z.string()
    .max(50, 'Mã vạch không được quá 50 ký tự')
    .regex(/^[A-Z0-9-]*$/, 'Mã vạch chỉ được chứa chữ in hoa, số và dấu gạch ngang')
    .optional()
    .or(z.literal('')),
  
  suggestedRetailPrice: nonNegativeNumber.optional(),
  minPrice: nonNegativeNumber.optional(),
  weight: nonNegativeNumber.optional(),
  
  weightUnit: z.enum(['g', 'kg'])
    .optional(),

  dimensions: dimensionsSchema.optional(),
  
  primarySupplierSystemId: z.string()
    .optional(),
  
  warrantyPeriodMonths: nonNegativeNumber.optional(),

  reorderLevel: stockNumber.optional(),
  
  safetyStock: stockNumber.optional(),

  maxStock: stockNumber.optional(),

  launchedDate: z.string().optional(),
  
  // ═══════════════════════════════════════════════════════════════
  // COMBO FIELDS (required when type === 'combo')
  // ═══════════════════════════════════════════════════════════════
  comboItems: z.array(comboItemSchema)
    .max(MAX_COMBO_ITEMS, `Combo chỉ được tối đa ${MAX_COMBO_ITEMS} sản phẩm`)
    .optional(),
  
  comboPricingType: z.enum(['fixed', 'sum_discount_percent', 'sum_discount_amount'])
    .optional(),
  
  comboDiscount: nonNegativeNumber.optional(),
  
}).superRefine((data, ctx) => {
  // ═══════════════════════════════════════════════════════════════
  // COMBO VALIDATION
  // ═══════════════════════════════════════════════════════════════
  if (data.type === 'combo') {
    // Combo must have comboItems
    if (!data.comboItems || data.comboItems.length < MIN_COMBO_ITEMS) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Combo phải có ít nhất ${MIN_COMBO_ITEMS} sản phẩm`,
        path: ['comboItems'],
      });
    }
    
    // Combo must have pricing type
    if (!data.comboPricingType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Vui lòng chọn cách tính giá combo',
        path: ['comboPricingType'],
      });
    }
    
    // Check for duplicate products in combo
    if (data.comboItems && data.comboItems.length > 0) {
      const productIds = data.comboItems.map(item => item.productSystemId);
      const uniqueIds = new Set(productIds);
      if (uniqueIds.size !== productIds.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Combo không được chứa sản phẩm trùng lặp',
          path: ['comboItems'],
        });
      }
    }
    
    // For fixed pricing, comboDiscount is required (it's the price)
    if (data.comboPricingType === 'fixed' && (data.comboDiscount === undefined || data.comboDiscount <= 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Vui lòng nhập giá combo',
        path: ['comboDiscount'],
      });
    }
    
    // For percentage discount, validate range 0-100
    if (data.comboPricingType === 'sum_discount_percent' && data.comboDiscount !== undefined) {
      if (data.comboDiscount > 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Phần trăm giảm giá không được vượt quá 100%',
          path: ['comboDiscount'],
        });
      }
    }
  }
  
  // Business rule: Cost price should not exceed selling prices (skip for combo)
  if (data.type !== 'combo') {
    const priceValues = Object.values(data.prices) as number[];
    if (priceValues.length > 0) {
      const minSellingPrice = Math.min(...priceValues);
      if (data.costPrice > minSellingPrice) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Giá vốn không nên cao hơn giá bán thấp nhất',
          path: ['costPrice'],
        });
      }
    }
  }
  
  // Business rule: Safety stock should not exceed reorder level
  if (data.safetyStock !== undefined && data.reorderLevel !== undefined) {
    if (data.safetyStock > data.reorderLevel) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Tồn kho an toàn không nên cao hơn mức đặt hàng lại',
        path: ['safetyStock'],
      });
    }
  }
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
/** @deprecated Sử dụng ProductFormValues thay thế */
export type ProductFormData = ProductFormValues;

/**
 * Validate product ID uniqueness
 * @param id - Product ID to validate
 * @param existingIds - Array of existing product IDs
 * @param currentId - Current product ID (for edit mode, exclude self)
 * @returns true if ID is unique, false otherwise
 */
export function validateUniqueId(
  id: string,
  existingIds: string[],
  currentId?: string
): boolean {
  const normalizedId = id.trim().toUpperCase();
  const normalizedExisting = existingIds
    .filter(existingId => existingId !== currentId)
    .map(existingId => existingId.trim().toUpperCase());
  
  return !normalizedExisting.includes(normalizedId);
}

/**
 * Validate barcode uniqueness
 * @param barcode - Barcode to validate
 * @param existingBarcodes - Array of existing barcodes
 * @param currentBarcode - Current barcode (for edit mode, exclude self)
 * @returns true if barcode is unique, false otherwise
 */
export function validateUniqueBarcode(
  barcode: string,
  existingBarcodes: string[],
  currentBarcode?: string
): boolean {
  if (!barcode || barcode.trim() === '') return true; // Empty barcode is valid
  
  const normalizedBarcode = barcode.trim().toUpperCase();
  const normalizedExisting = existingBarcodes
    .filter(existingBarcode => existingBarcode !== currentBarcode && existingBarcode)
    .map(existingBarcode => existingBarcode.trim().toUpperCase());
  
  return !normalizedExisting.includes(normalizedBarcode);
}
