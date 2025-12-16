import type { SystemId } from '@/lib/id-types';
import type { PkgxBrandMapping, PkgxBrand } from '../types';

// ========================================
// Validation Types
// ========================================

export interface BrandValidationResult {
  isValid: boolean;
  errors: BrandValidationError[];
  warnings: BrandValidationWarning[];
}

export interface BrandValidationError {
  code: string;
  field?: string;
  message: string;
  details?: Record<string, any>;
}

export interface BrandValidationWarning {
  code: string;
  field?: string;
  message: string;
  details?: Record<string, any>;
}

export interface BrandMappingInput {
  hrmBrandSystemId: SystemId | string;
  hrmBrandName: string;
  pkgxBrandId: number | string;
  pkgxBrandName: string;
}

// ========================================
// Error Codes
// ========================================

export const BRAND_MAPPING_ERROR_CODES = {
  // Required field errors
  HRM_BRAND_REQUIRED: 'HRM_BRAND_REQUIRED',
  PKGX_BRAND_REQUIRED: 'PKGX_BRAND_REQUIRED',
  
  // Duplicate/conflict errors
  HRM_BRAND_ALREADY_MAPPED: 'HRM_BRAND_ALREADY_MAPPED',
  PKGX_BRAND_ALREADY_MAPPED: 'PKGX_BRAND_ALREADY_MAPPED',
  
  // Not found errors
  HRM_BRAND_NOT_FOUND: 'HRM_BRAND_NOT_FOUND',
  PKGX_BRAND_NOT_FOUND: 'PKGX_BRAND_NOT_FOUND',
  
  // Inactive/deleted errors
  HRM_BRAND_INACTIVE: 'HRM_BRAND_INACTIVE',
} as const;

export const BRAND_MAPPING_WARNING_CODES = {
  // Suggestions
  SAME_NAME_AVAILABLE: 'SAME_NAME_AVAILABLE',
  NAME_MISMATCH: 'NAME_MISMATCH',
  MANY_TO_ONE_MAPPING: 'MANY_TO_ONE_MAPPING',
} as const;

// ========================================
// Error Messages (Vietnamese)
// ========================================

export const BRAND_MAPPING_ERROR_MESSAGES: Record<string, string> = {
  [BRAND_MAPPING_ERROR_CODES.HRM_BRAND_REQUIRED]: 'Vui lòng chọn thương hiệu HRM',
  [BRAND_MAPPING_ERROR_CODES.PKGX_BRAND_REQUIRED]: 'Vui lòng chọn thương hiệu PKGX',
  [BRAND_MAPPING_ERROR_CODES.HRM_BRAND_ALREADY_MAPPED]: 'Thương hiệu HRM này đã được mapping với thương hiệu PKGX khác',
  [BRAND_MAPPING_ERROR_CODES.PKGX_BRAND_ALREADY_MAPPED]: 'Thương hiệu PKGX này đã được mapping với thương hiệu HRM khác',
  [BRAND_MAPPING_ERROR_CODES.HRM_BRAND_NOT_FOUND]: 'Không tìm thấy thương hiệu HRM trong hệ thống',
  [BRAND_MAPPING_ERROR_CODES.PKGX_BRAND_NOT_FOUND]: 'Không tìm thấy thương hiệu PKGX (có thể đã bị xóa trên PKGX)',
  [BRAND_MAPPING_ERROR_CODES.HRM_BRAND_INACTIVE]: 'Thương hiệu HRM đã bị vô hiệu hóa hoặc xóa',
};

export const BRAND_MAPPING_WARNING_MESSAGES: Record<string, string> = {
  [BRAND_MAPPING_WARNING_CODES.SAME_NAME_AVAILABLE]: 'Có thương hiệu PKGX trùng tên, có thể bạn muốn chọn thương hiệu đó',
  [BRAND_MAPPING_WARNING_CODES.NAME_MISMATCH]: 'Tên thương hiệu HRM và PKGX khác nhau đáng kể',
  [BRAND_MAPPING_WARNING_CODES.MANY_TO_ONE_MAPPING]: 'Nhiều thương hiệu HRM đang mapping tới cùng một thương hiệu PKGX',
};

// ========================================
// Validation Context
// ========================================

export interface BrandValidationContext {
  existingMappings: PkgxBrandMapping[];
  hrmBrands: Array<{
    systemId: SystemId;
    name: string;
    status?: string;
    isActive?: boolean;
  }>;
  pkgxBrands: PkgxBrand[];
  editingMappingId?: string;
}

// ========================================
// Validation Functions
// ========================================

/**
 * Validate required fields
 */
export function validateRequiredFields(input: BrandMappingInput): BrandValidationError[] {
  const errors: BrandValidationError[] = [];

  if (!input.hrmBrandSystemId) {
    errors.push({
      code: BRAND_MAPPING_ERROR_CODES.HRM_BRAND_REQUIRED,
      field: 'hrmBrandSystemId',
      message: BRAND_MAPPING_ERROR_MESSAGES[BRAND_MAPPING_ERROR_CODES.HRM_BRAND_REQUIRED],
    });
  }

  if (!input.pkgxBrandId) {
    errors.push({
      code: BRAND_MAPPING_ERROR_CODES.PKGX_BRAND_REQUIRED,
      field: 'pkgxBrandId',
      message: BRAND_MAPPING_ERROR_MESSAGES[BRAND_MAPPING_ERROR_CODES.PKGX_BRAND_REQUIRED],
    });
  }

  return errors;
}

/**
 * Validate brand exists
 */
export function validateBrandExists(
  input: BrandMappingInput,
  context: BrandValidationContext
): BrandValidationError[] {
  const errors: BrandValidationError[] = [];

  if (input.hrmBrandSystemId) {
    const hrmBrand = context.hrmBrands.find(b => b.systemId === input.hrmBrandSystemId);
    if (!hrmBrand) {
      errors.push({
        code: BRAND_MAPPING_ERROR_CODES.HRM_BRAND_NOT_FOUND,
        field: 'hrmBrandSystemId',
        message: BRAND_MAPPING_ERROR_MESSAGES[BRAND_MAPPING_ERROR_CODES.HRM_BRAND_NOT_FOUND],
        details: { systemId: input.hrmBrandSystemId },
      });
    } else if (hrmBrand.status === 'inactive' || hrmBrand.isActive === false) {
      errors.push({
        code: BRAND_MAPPING_ERROR_CODES.HRM_BRAND_INACTIVE,
        field: 'hrmBrandSystemId',
        message: BRAND_MAPPING_ERROR_MESSAGES[BRAND_MAPPING_ERROR_CODES.HRM_BRAND_INACTIVE],
        details: { systemId: input.hrmBrandSystemId, name: hrmBrand.name },
      });
    }
  }

  if (input.pkgxBrandId) {
    const pkgxBrand = context.pkgxBrands.find(b => b.id === input.pkgxBrandId);
    if (!pkgxBrand) {
      errors.push({
        code: BRAND_MAPPING_ERROR_CODES.PKGX_BRAND_NOT_FOUND,
        field: 'pkgxBrandId',
        message: BRAND_MAPPING_ERROR_MESSAGES[BRAND_MAPPING_ERROR_CODES.PKGX_BRAND_NOT_FOUND],
        details: { pkgxBrandId: input.pkgxBrandId },
      });
    }
  }

  return errors;
}

/**
 * Validate duplicate mappings
 */
export function validateDuplicateMappings(
  input: BrandMappingInput,
  context: BrandValidationContext
): BrandValidationError[] {
  const errors: BrandValidationError[] = [];

  if (input.hrmBrandSystemId) {
    const existingHrmMapping = context.existingMappings.find(
      m => m.hrmBrandSystemId === input.hrmBrandSystemId && m.id !== context.editingMappingId
    );
    if (existingHrmMapping) {
      errors.push({
        code: BRAND_MAPPING_ERROR_CODES.HRM_BRAND_ALREADY_MAPPED,
        field: 'hrmBrandSystemId',
        message: BRAND_MAPPING_ERROR_MESSAGES[BRAND_MAPPING_ERROR_CODES.HRM_BRAND_ALREADY_MAPPED],
        details: {
          existingMapping: existingHrmMapping,
          mappedTo: existingHrmMapping.pkgxBrandName,
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
  input: BrandMappingInput,
  context: BrandValidationContext
): BrandValidationWarning[] {
  const warnings: BrandValidationWarning[] = [];

  if (!input.hrmBrandSystemId || !input.pkgxBrandId) {
    return warnings;
  }

  const hrmBrand = context.hrmBrands.find(b => b.systemId === input.hrmBrandSystemId);
  const pkgxBrand = context.pkgxBrands.find(b => b.id === input.pkgxBrandId);

  if (!hrmBrand || !pkgxBrand) return warnings;

  // 1. Check name mismatch
  const normalizedHrmName = normalizeString(hrmBrand.name);
  const normalizedPkgxName = normalizeString(pkgxBrand.name);
  const similarity = calculateSimilarity(normalizedHrmName, normalizedPkgxName);
  
  if (similarity < 0.5) {
    warnings.push({
      code: BRAND_MAPPING_WARNING_CODES.NAME_MISMATCH,
      message: BRAND_MAPPING_WARNING_MESSAGES[BRAND_MAPPING_WARNING_CODES.NAME_MISMATCH],
      details: { 
        hrmName: hrmBrand.name, 
        pkgxName: pkgxBrand.name,
        similarity: Math.round(similarity * 100) + '%',
      },
    });
  }

  // 2. Check if same name exists in PKGX
  const sameNamePkgx = context.pkgxBrands.find(
    b => b.id !== input.pkgxBrandId && normalizeString(b.name) === normalizedHrmName
  );
  if (sameNamePkgx) {
    warnings.push({
      code: BRAND_MAPPING_WARNING_CODES.SAME_NAME_AVAILABLE,
      message: BRAND_MAPPING_WARNING_MESSAGES[BRAND_MAPPING_WARNING_CODES.SAME_NAME_AVAILABLE],
      details: {
        suggestedBrand: sameNamePkgx,
      },
    });
  }

  // 3. Check many-to-one mapping
  const otherMappingsToSamePkgx = context.existingMappings.filter(
    m => m.pkgxBrandId === input.pkgxBrandId && m.id !== context.editingMappingId
  );
  if (otherMappingsToSamePkgx.length > 0) {
    warnings.push({
      code: BRAND_MAPPING_WARNING_CODES.MANY_TO_ONE_MAPPING,
      message: BRAND_MAPPING_WARNING_MESSAGES[BRAND_MAPPING_WARNING_CODES.MANY_TO_ONE_MAPPING],
      details: {
        count: otherMappingsToSamePkgx.length + 1,
        existingMappings: otherMappingsToSamePkgx.map(m => m.hrmBrandName),
      },
    });
  }

  return warnings;
}

/**
 * Main validation function
 */
export function validateBrandMapping(
  input: BrandMappingInput,
  context: BrandValidationContext
): BrandValidationResult {
  const errors: BrandValidationError[] = [];
  const warnings: BrandValidationWarning[] = [];

  // 1. Required fields
  errors.push(...validateRequiredFields(input));

  // If required fields are missing, stop here
  if (errors.length > 0) {
    return { isValid: false, errors, warnings };
  }

  // 2. Brand exists
  errors.push(...validateBrandExists(input, context));

  // 3. Duplicate mappings
  errors.push(...validateDuplicateMappings(input, context));

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
 * Suggest matching brands based on name
 */
export function suggestMatchingBrands(
  hrmBrandName: string,
  pkgxBrands: PkgxBrand[],
  limit = 5
): Array<{ brand: PkgxBrand; score: number }> {
  const normalizedInput = normalizeString(hrmBrandName);
  
  const scored = pkgxBrands.map(brand => ({
    brand,
    score: calculateSimilarity(normalizedInput, normalizeString(brand.name)),
  }));
  
  return scored
    .filter(s => s.score > 0.2)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
