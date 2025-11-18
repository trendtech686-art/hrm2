import { z } from 'zod';

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
  
  costPrice: z.number()
    .min(0, 'Giá vốn phải lớn hơn hoặc bằng 0'),
  
  prices: z.record(z.string(), z.number().min(0, 'Giá bán phải lớn hơn hoặc bằng 0')),
  
  inventory: z.number()
    .min(0, 'Tồn kho phải lớn hơn hoặc bằng 0')
    .int('Tồn kho phải là số nguyên'),
  
  // Optional fields
  title: z.string()
    .max(150, 'Tiêu đề không được quá 150 ký tự')
    .optional(),
  
  description: z.string()
    .max(5000, 'Mô tả không được quá 5000 ký tự')
    .optional(),
  
  shortDescription: z.string()
    .max(300, 'Mô tả ngắn không được quá 300 ký tự')
    .optional(),
  
  type: z.enum(['physical', 'service', 'digital'])
    .optional(),
  
  category: z.string()
    .max(100, 'Danh mục không được quá 100 ký tự')
    .optional(),
  
  status: z.enum(['active', 'inactive', 'discontinued'])
    .optional(),
  
  barcode: z.string()
    .max(50, 'Mã vạch không được quá 50 ký tự')
    .regex(/^[A-Z0-9-]*$/, 'Mã vạch chỉ được chứa chữ in hoa, số và dấu gạch ngang')
    .optional()
    .or(z.literal('')),
  
  weight: z.number()
    .min(0, 'Trọng lượng phải lớn hơn hoặc bằng 0')
    .optional(),
  
  weightUnit: z.enum(['g', 'kg'])
    .optional(),
  
  primarySupplierSystemId: z.string()
    .optional(),
  
  reorderLevel: z.number()
    .min(0, 'Mức đặt hàng lại phải lớn hơn hoặc bằng 0')
    .int('Mức đặt hàng lại phải là số nguyên')
    .optional(),
  
  safetyStock: z.number()
    .min(0, 'Tồn kho an toàn phải lớn hơn hoặc bằng 0')
    .int('Tồn kho an toàn phải là số nguyên')
    .optional(),
}).superRefine((data, ctx) => {
  // Business rule: Cost price should not exceed selling prices
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

export type ProductFormData = z.infer<typeof productFormSchema>;

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
