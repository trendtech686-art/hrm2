import type { SystemId } from '@/lib/id-types';
import type { PkgxProduct } from '../types';

// ========================================
// Validation Types
// ========================================

export interface ProductValidationResult {
  isValid: boolean;
  errors: ProductValidationError[];
  warnings: ProductValidationWarning[];
}

export interface ProductValidationError {
  code: string;
  field?: string;
  message: string;
  details?: Record<string, any>;
}

export interface ProductValidationWarning {
  code: string;
  field?: string;
  message: string;
  details?: Record<string, any>;
}

export interface ProductMappingInput {
  hrmProductSystemId: SystemId | string;
  hrmProductName: string;
  hrmProductSku?: string;
  pkgxProductId: number | string;
  pkgxProductName: string;
  pkgxProductSku?: string;
}

// ========================================
// Error Codes
// ========================================

export const PRODUCT_MAPPING_ERROR_CODES = {
  // Required field errors
  HRM_PRODUCT_REQUIRED: 'HRM_PRODUCT_REQUIRED',
  PKGX_PRODUCT_REQUIRED: 'PKGX_PRODUCT_REQUIRED',
  
  // Duplicate/conflict errors
  HRM_PRODUCT_ALREADY_LINKED: 'HRM_PRODUCT_ALREADY_LINKED',
  PKGX_PRODUCT_ALREADY_LINKED: 'PKGX_PRODUCT_ALREADY_LINKED',
  
  // Not found errors
  HRM_PRODUCT_NOT_FOUND: 'HRM_PRODUCT_NOT_FOUND',
  PKGX_PRODUCT_NOT_FOUND: 'PKGX_PRODUCT_NOT_FOUND',
  
  // Inactive/deleted errors
  HRM_PRODUCT_INACTIVE: 'HRM_PRODUCT_INACTIVE',
} as const;

export const PRODUCT_MAPPING_WARNING_CODES = {
  // Suggestions
  SKU_MATCH_AVAILABLE: 'SKU_MATCH_AVAILABLE',
  NAME_MISMATCH: 'NAME_MISMATCH',
  SKU_MISMATCH: 'SKU_MISMATCH',
} as const;

// ========================================
// Error Messages (Vietnamese)
// ========================================

export const PRODUCT_MAPPING_ERROR_MESSAGES: Record<string, string> = {
  [PRODUCT_MAPPING_ERROR_CODES.HRM_PRODUCT_REQUIRED]: 'Vui lòng chọn sản phẩm HRM',
  [PRODUCT_MAPPING_ERROR_CODES.PKGX_PRODUCT_REQUIRED]: 'Vui lòng chọn sản phẩm PKGX',
  [PRODUCT_MAPPING_ERROR_CODES.HRM_PRODUCT_ALREADY_LINKED]: 'Sản phẩm HRM này đã được liên kết với sản phẩm PKGX khác',
  [PRODUCT_MAPPING_ERROR_CODES.PKGX_PRODUCT_ALREADY_LINKED]: 'Sản phẩm PKGX này đã được liên kết với sản phẩm HRM khác',
  [PRODUCT_MAPPING_ERROR_CODES.HRM_PRODUCT_NOT_FOUND]: 'Không tìm thấy sản phẩm HRM trong hệ thống',
  [PRODUCT_MAPPING_ERROR_CODES.PKGX_PRODUCT_NOT_FOUND]: 'Không tìm thấy sản phẩm PKGX (có thể đã bị xóa trên PKGX)',
  [PRODUCT_MAPPING_ERROR_CODES.HRM_PRODUCT_INACTIVE]: 'Sản phẩm HRM đã bị vô hiệu hóa hoặc xóa',
};

export const PRODUCT_MAPPING_WARNING_MESSAGES: Record<string, string> = {
  [PRODUCT_MAPPING_WARNING_CODES.SKU_MATCH_AVAILABLE]: 'Có sản phẩm HRM có SKU trùng khớp, có thể bạn muốn chọn sản phẩm đó',
  [PRODUCT_MAPPING_WARNING_CODES.NAME_MISMATCH]: 'Tên sản phẩm HRM và PKGX khác nhau đáng kể',
  [PRODUCT_MAPPING_WARNING_CODES.SKU_MISMATCH]: 'Mã SKU của sản phẩm HRM và PKGX không khớp',
};

// ========================================
// Validation Context
// ========================================

export interface ProductValidationContext {
  hrmProducts: Array<{
    systemId: SystemId;
    name: string;
    id: string; // SKU
    pkgxId?: number;
    status?: string;
    isActive?: boolean;
  }>;
  pkgxProducts: PkgxProduct[];
  editingProductId?: string; // HRM systemId đang edit
}

// ========================================
// Validation Functions
// ========================================

/**
 * Validate required fields
 */
export function validateRequiredFields(input: ProductMappingInput): ProductValidationError[] {
  const errors: ProductValidationError[] = [];

  if (!input.hrmProductSystemId) {
    errors.push({
      code: PRODUCT_MAPPING_ERROR_CODES.HRM_PRODUCT_REQUIRED,
      field: 'hrmProductSystemId',
      message: PRODUCT_MAPPING_ERROR_MESSAGES[PRODUCT_MAPPING_ERROR_CODES.HRM_PRODUCT_REQUIRED],
    });
  }

  if (!input.pkgxProductId) {
    errors.push({
      code: PRODUCT_MAPPING_ERROR_CODES.PKGX_PRODUCT_REQUIRED,
      field: 'pkgxProductId',
      message: PRODUCT_MAPPING_ERROR_MESSAGES[PRODUCT_MAPPING_ERROR_CODES.PKGX_PRODUCT_REQUIRED],
    });
  }

  return errors;
}

/**
 * Validate product exists
 */
export function validateProductExists(
  input: ProductMappingInput,
  context: ProductValidationContext
): ProductValidationError[] {
  const errors: ProductValidationError[] = [];

  if (input.hrmProductSystemId) {
    const hrmProduct = context.hrmProducts.find(p => p.systemId === input.hrmProductSystemId);
    if (!hrmProduct) {
      errors.push({
        code: PRODUCT_MAPPING_ERROR_CODES.HRM_PRODUCT_NOT_FOUND,
        field: 'hrmProductSystemId',
        message: PRODUCT_MAPPING_ERROR_MESSAGES[PRODUCT_MAPPING_ERROR_CODES.HRM_PRODUCT_NOT_FOUND],
        details: { systemId: input.hrmProductSystemId },
      });
    } else if (hrmProduct.status === 'inactive' || hrmProduct.isActive === false) {
      errors.push({
        code: PRODUCT_MAPPING_ERROR_CODES.HRM_PRODUCT_INACTIVE,
        field: 'hrmProductSystemId',
        message: PRODUCT_MAPPING_ERROR_MESSAGES[PRODUCT_MAPPING_ERROR_CODES.HRM_PRODUCT_INACTIVE],
        details: { systemId: input.hrmProductSystemId, name: hrmProduct.name },
      });
    }
  }

  if (input.pkgxProductId) {
    const pkgxProduct = context.pkgxProducts.find(p => p.goods_id === input.pkgxProductId);
    if (!pkgxProduct) {
      errors.push({
        code: PRODUCT_MAPPING_ERROR_CODES.PKGX_PRODUCT_NOT_FOUND,
        field: 'pkgxProductId',
        message: PRODUCT_MAPPING_ERROR_MESSAGES[PRODUCT_MAPPING_ERROR_CODES.PKGX_PRODUCT_NOT_FOUND],
        details: { pkgxProductId: input.pkgxProductId },
      });
    }
  }

  return errors;
}

/**
 * Validate duplicate links
 */
export function validateDuplicateLinks(
  input: ProductMappingInput,
  context: ProductValidationContext
): ProductValidationError[] {
  const errors: ProductValidationError[] = [];

  if (input.hrmProductSystemId) {
    const hrmProduct = context.hrmProducts.find(p => p.systemId === input.hrmProductSystemId);
    // Check if HRM product already linked to another PKGX product
    if (hrmProduct?.pkgxId && hrmProduct.pkgxId !== input.pkgxProductId && hrmProduct.systemId !== context.editingProductId) {
      errors.push({
        code: PRODUCT_MAPPING_ERROR_CODES.HRM_PRODUCT_ALREADY_LINKED,
        field: 'hrmProductSystemId',
        message: PRODUCT_MAPPING_ERROR_MESSAGES[PRODUCT_MAPPING_ERROR_CODES.HRM_PRODUCT_ALREADY_LINKED],
        details: {
          linkedTo: hrmProduct.pkgxId,
        },
      });
    }
  }

  if (input.pkgxProductId) {
    // Check if PKGX product already linked to another HRM product
    const linkedHrmProduct = context.hrmProducts.find(
      p => p.pkgxId === input.pkgxProductId && p.systemId !== input.hrmProductSystemId
    );
    if (linkedHrmProduct) {
      errors.push({
        code: PRODUCT_MAPPING_ERROR_CODES.PKGX_PRODUCT_ALREADY_LINKED,
        field: 'pkgxProductId',
        message: PRODUCT_MAPPING_ERROR_MESSAGES[PRODUCT_MAPPING_ERROR_CODES.PKGX_PRODUCT_ALREADY_LINKED],
        details: {
          linkedTo: linkedHrmProduct.name,
          linkedSystemId: linkedHrmProduct.systemId,
        },
      });
    }
  }
  
  return errors;
}

/**
 * Check for warnings (không block nhưng cảnh báo)
 */
export function checkWarnings(
  input: ProductMappingInput,
  context: ProductValidationContext
): ProductValidationWarning[] {
  const warnings: ProductValidationWarning[] = [];

  if (!input.hrmProductSystemId || !input.pkgxProductId) {
    return warnings;
  }

  const hrmProduct = context.hrmProducts.find(p => p.systemId === input.hrmProductSystemId);
  const pkgxProduct = context.pkgxProducts.find(p => p.goods_id === input.pkgxProductId);

  if (!hrmProduct || !pkgxProduct) return warnings;

  // 1. Check name mismatch
  const normalizedHrmName = normalizeString(hrmProduct.name);
  const normalizedPkgxName = normalizeString(pkgxProduct.goods_name);
  const similarity = calculateSimilarity(normalizedHrmName, normalizedPkgxName);
  
  if (similarity < 0.3) {
    warnings.push({
      code: PRODUCT_MAPPING_WARNING_CODES.NAME_MISMATCH,
      message: PRODUCT_MAPPING_WARNING_MESSAGES[PRODUCT_MAPPING_WARNING_CODES.NAME_MISMATCH],
      details: { 
        hrmName: hrmProduct.name, 
        pkgxName: pkgxProduct.goods_name,
        similarity: Math.round(similarity * 100) + '%',
      },
    });
  }

  // 2. Check SKU mismatch
  if (hrmProduct.id && pkgxProduct.goods_sn && hrmProduct.id !== pkgxProduct.goods_sn) {
    warnings.push({
      code: PRODUCT_MAPPING_WARNING_CODES.SKU_MISMATCH,
      message: PRODUCT_MAPPING_WARNING_MESSAGES[PRODUCT_MAPPING_WARNING_CODES.SKU_MISMATCH],
      details: {
        hrmSku: hrmProduct.id,
        pkgxSku: pkgxProduct.goods_sn,
      },
    });
  }

  return warnings;
}

/**
 * Main validation function
 */
export function validateProductMapping(
  input: ProductMappingInput,
  context: ProductValidationContext
): ProductValidationResult {
  const errors: ProductValidationError[] = [];
  const warnings: ProductValidationWarning[] = [];

  // 1. Required fields
  errors.push(...validateRequiredFields(input));

  // If required fields are missing, stop here
  if (errors.length > 0) {
    return { isValid: false, errors, warnings };
  }

  // 2. Product exists
  errors.push(...validateProductExists(input, context));

  // 3. Duplicate links
  errors.push(...validateDuplicateLinks(input, context));

  // 4. Warnings (non-blocking)
  warnings.push(...checkWarnings(input, context));

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// ========================================
// Utility Functions
// ========================================

/**
 * Normalize string for comparison
 */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

/**
 * Calculate string similarity (Jaccard index)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const words1 = new Set(str1.split(/\s+/).filter(w => w.length > 0));
  const words2 = new Set(str2.split(/\s+/).filter(w => w.length > 0));
  
  if (words1.size === 0 && words2.size === 0) return 1;
  if (words1.size === 0 || words2.size === 0) return 0;
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

/**
 * Suggest matching HRM products based on PKGX product name/SKU
 */
export function suggestMatchingProducts(
  pkgxProduct: { goods_name: string; goods_sn?: string },
  hrmProducts: Array<{ systemId: SystemId; name: string; id: string; pkgxId?: number }>,
  limit = 5
): Array<{ product: typeof hrmProducts[0]; score: number; matchType: 'sku' | 'name' }> {
  const results: Array<{ product: typeof hrmProducts[0]; score: number; matchType: 'sku' | 'name' }> = [];
  
  // Filter out already linked products
  const availableProducts = hrmProducts.filter(p => !p.pkgxId);
  
  // 1. SKU exact match (highest priority)
  if (pkgxProduct.goods_sn) {
    const skuMatch = availableProducts.find(p => p.id === pkgxProduct.goods_sn);
    if (skuMatch) {
      results.push({ product: skuMatch, score: 1, matchType: 'sku' });
    }
  }
  
  // 2. Name similarity
  const normalizedPkgxName = normalizeString(pkgxProduct.goods_name);
  
  const scored = availableProducts
    .filter(p => !results.some(r => r.product.systemId === p.systemId))
    .map(product => ({
      product,
      score: calculateSimilarity(normalizedPkgxName, normalizeString(product.name)),
      matchType: 'name' as const,
    }))
    .filter(s => s.score > 0.2);
  
  results.push(...scored);
  
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
