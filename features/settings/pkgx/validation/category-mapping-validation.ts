import type { SystemId } from '@/lib/id-types';
import type { PkgxCategoryMapping, PkgxCategory } from '../types';

// ========================================
// Validation Types
// ========================================

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  code: string;
  field?: string;
  message: string;
  details?: Record<string, any>;
}

export interface ValidationWarning {
  code: string;
  field?: string;
  message: string;
  details?: Record<string, any>;
}

export interface CategoryMappingInput {
  hrmCategorySystemId: SystemId | string;
  hrmCategoryName: string;
  pkgxCatId: number | string;
  pkgxCatName: string;
}

// ========================================
// Error Codes
// ========================================

export const CATEGORY_MAPPING_ERROR_CODES = {
  // Required field errors
  HRM_CATEGORY_REQUIRED: 'HRM_CATEGORY_REQUIRED',
  PKGX_CATEGORY_REQUIRED: 'PKGX_CATEGORY_REQUIRED',
  
  // Duplicate/conflict errors
  HRM_CATEGORY_ALREADY_MAPPED: 'HRM_CATEGORY_ALREADY_MAPPED',
  PKGX_CATEGORY_ALREADY_MAPPED: 'PKGX_CATEGORY_ALREADY_MAPPED',
  
  // Not found errors
  HRM_CATEGORY_NOT_FOUND: 'HRM_CATEGORY_NOT_FOUND',
  PKGX_CATEGORY_NOT_FOUND: 'PKGX_CATEGORY_NOT_FOUND',
  
  // Inactive/deleted errors
  HRM_CATEGORY_INACTIVE: 'HRM_CATEGORY_INACTIVE',
  PKGX_CATEGORY_INACTIVE: 'PKGX_CATEGORY_INACTIVE',
  
  // Structure errors
  MAPPING_TO_PARENT_CATEGORY: 'MAPPING_TO_PARENT_CATEGORY',
  HIERARCHY_MISMATCH: 'HIERARCHY_MISMATCH',
} as const;

export const CATEGORY_MAPPING_WARNING_CODES = {
  // Suggestions
  SAME_NAME_AVAILABLE: 'SAME_NAME_AVAILABLE',
  PARENT_NOT_MAPPED: 'PARENT_NOT_MAPPED',
  CHILD_ALREADY_MAPPED: 'CHILD_ALREADY_MAPPED',
  NAME_MISMATCH: 'NAME_MISMATCH',
  MANY_TO_ONE_MAPPING: 'MANY_TO_ONE_MAPPING',
} as const;

// ========================================
// Error Messages (Vietnamese)
// ========================================

export const CATEGORY_MAPPING_ERROR_MESSAGES: Record<string, string> = {
  [CATEGORY_MAPPING_ERROR_CODES.HRM_CATEGORY_REQUIRED]: 'Vui lòng chọn danh mục HRM',
  [CATEGORY_MAPPING_ERROR_CODES.PKGX_CATEGORY_REQUIRED]: 'Vui lòng chọn danh mục PKGX',
  [CATEGORY_MAPPING_ERROR_CODES.HRM_CATEGORY_ALREADY_MAPPED]: 'Danh mục HRM này đã được mapping với danh mục PKGX khác',
  [CATEGORY_MAPPING_ERROR_CODES.PKGX_CATEGORY_ALREADY_MAPPED]: 'Danh mục PKGX này đã được mapping với danh mục HRM khác',
  [CATEGORY_MAPPING_ERROR_CODES.HRM_CATEGORY_NOT_FOUND]: 'Không tìm thấy danh mục HRM trong hệ thống',
  [CATEGORY_MAPPING_ERROR_CODES.PKGX_CATEGORY_NOT_FOUND]: 'Không tìm thấy danh mục PKGX (có thể đã bị xóa trên PKGX)',
  [CATEGORY_MAPPING_ERROR_CODES.HRM_CATEGORY_INACTIVE]: 'Danh mục HRM đã bị vô hiệu hóa hoặc xóa',
  [CATEGORY_MAPPING_ERROR_CODES.PKGX_CATEGORY_INACTIVE]: 'Danh mục PKGX không hoạt động',
  [CATEGORY_MAPPING_ERROR_CODES.MAPPING_TO_PARENT_CATEGORY]: 'Không nên mapping với danh mục cha. Hãy chọn danh mục con cụ thể',
  [CATEGORY_MAPPING_ERROR_CODES.HIERARCHY_MISMATCH]: 'Cấp danh mục không khớp (cha/con)',
};

export const CATEGORY_MAPPING_WARNING_MESSAGES: Record<string, string> = {
  [CATEGORY_MAPPING_WARNING_CODES.SAME_NAME_AVAILABLE]: 'Có danh mục PKGX trùng tên, có thể bạn muốn chọn danh mục đó',
  [CATEGORY_MAPPING_WARNING_CODES.PARENT_NOT_MAPPED]: 'Danh mục cha chưa được mapping. Nên mapping danh mục cha trước',
  [CATEGORY_MAPPING_WARNING_CODES.CHILD_ALREADY_MAPPED]: 'Đã có danh mục con được mapping. Kiểm tra lại cấu trúc',
  [CATEGORY_MAPPING_WARNING_CODES.NAME_MISMATCH]: 'Tên danh mục HRM và PKGX khác nhau đáng kể',
  [CATEGORY_MAPPING_WARNING_CODES.MANY_TO_ONE_MAPPING]: 'Nhiều danh mục HRM đang mapping tới cùng một danh mục PKGX',
};

// ========================================
// Validation Context
// ========================================

export interface ValidationContext {
  existingMappings: PkgxCategoryMapping[];
  hrmCategories: Array<{
    systemId: SystemId;
    name: string;
    parentId?: SystemId;
    status?: string;
    isActive?: boolean;
    path?: string;
  }>;
  pkgxCategories: PkgxCategory[];
  editingMappingId?: string; // ID của mapping đang edit (để exclude khỏi duplicate check)
}

// ========================================
// Validation Functions
// ========================================

/**
 * Validate required fields
 */
export function validateRequiredFields(input: CategoryMappingInput): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!input.hrmCategorySystemId) {
    errors.push({
      code: CATEGORY_MAPPING_ERROR_CODES.HRM_CATEGORY_REQUIRED,
      field: 'hrmCategorySystemId',
      message: CATEGORY_MAPPING_ERROR_MESSAGES[CATEGORY_MAPPING_ERROR_CODES.HRM_CATEGORY_REQUIRED],
    });
  }

  if (!input.pkgxCatId) {
    errors.push({
      code: CATEGORY_MAPPING_ERROR_CODES.PKGX_CATEGORY_REQUIRED,
      field: 'pkgxCatId',
      message: CATEGORY_MAPPING_ERROR_MESSAGES[CATEGORY_MAPPING_ERROR_CODES.PKGX_CATEGORY_REQUIRED],
    });
  }

  return errors;
}

/**
 * Validate category exists
 */
export function validateCategoryExists(
  input: CategoryMappingInput,
  context: ValidationContext
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (input.hrmCategorySystemId) {
    const hrmCat = context.hrmCategories.find(c => c.systemId === input.hrmCategorySystemId);
    if (!hrmCat) {
      errors.push({
        code: CATEGORY_MAPPING_ERROR_CODES.HRM_CATEGORY_NOT_FOUND,
        field: 'hrmCategorySystemId',
        message: CATEGORY_MAPPING_ERROR_MESSAGES[CATEGORY_MAPPING_ERROR_CODES.HRM_CATEGORY_NOT_FOUND],
        details: { systemId: input.hrmCategorySystemId },
      });
    } else if (hrmCat.status === 'inactive' || hrmCat.isActive === false) {
      errors.push({
        code: CATEGORY_MAPPING_ERROR_CODES.HRM_CATEGORY_INACTIVE,
        field: 'hrmCategorySystemId',
        message: CATEGORY_MAPPING_ERROR_MESSAGES[CATEGORY_MAPPING_ERROR_CODES.HRM_CATEGORY_INACTIVE],
        details: { systemId: input.hrmCategorySystemId, name: hrmCat.name },
      });
    }
  }

  if (input.pkgxCatId) {
    const pkgxCat = context.pkgxCategories.find(c => c.id === input.pkgxCatId);
    if (!pkgxCat) {
      errors.push({
        code: CATEGORY_MAPPING_ERROR_CODES.PKGX_CATEGORY_NOT_FOUND,
        field: 'pkgxCatId',
        message: CATEGORY_MAPPING_ERROR_MESSAGES[CATEGORY_MAPPING_ERROR_CODES.PKGX_CATEGORY_NOT_FOUND],
        details: { pkgxCatId: input.pkgxCatId },
      });
    }
  }

  return errors;
}

/**
 * Validate duplicate mappings
 */
export function validateDuplicateMappings(
  input: CategoryMappingInput,
  context: ValidationContext
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (input.hrmCategorySystemId) {
    const existingHrmMapping = context.existingMappings.find(
      m => m.hrmCategorySystemId === input.hrmCategorySystemId && m.id !== context.editingMappingId
    );
    if (existingHrmMapping) {
      errors.push({
        code: CATEGORY_MAPPING_ERROR_CODES.HRM_CATEGORY_ALREADY_MAPPED,
        field: 'hrmCategorySystemId',
        message: CATEGORY_MAPPING_ERROR_MESSAGES[CATEGORY_MAPPING_ERROR_CODES.HRM_CATEGORY_ALREADY_MAPPED],
        details: {
          existingMapping: existingHrmMapping,
          mappedTo: existingHrmMapping.pkgxCatName,
        },
      });
    }
  }

  // Note: PKGX category có thể mapping với nhiều HRM category (one-to-many)
  // Nhưng vẫn cảnh báo nếu đã có mapping khác
  
  return errors;
}

/**
 * Check for warnings (không block nhưng cảnh báo)
 */
export function checkWarnings(
  input: CategoryMappingInput,
  context: ValidationContext
): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  if (!input.hrmCategorySystemId || !input.pkgxCatId) {
    return warnings;
  }

  const hrmCat = context.hrmCategories.find(c => c.systemId === input.hrmCategorySystemId);
  const pkgxCat = context.pkgxCategories.find(c => c.id === input.pkgxCatId);

  if (!hrmCat || !pkgxCat) return warnings;

  // 1. Check name mismatch
  const normalizedHrmName = normalizeString(hrmCat.name);
  const normalizedPkgxName = normalizeString(pkgxCat.name);
  const similarity = calculateSimilarity(normalizedHrmName, normalizedPkgxName);
  
  if (similarity < 0.5) {
    warnings.push({
      code: CATEGORY_MAPPING_WARNING_CODES.NAME_MISMATCH,
      message: CATEGORY_MAPPING_WARNING_MESSAGES[CATEGORY_MAPPING_WARNING_CODES.NAME_MISMATCH],
      details: { 
        hrmName: hrmCat.name, 
        pkgxName: pkgxCat.name,
        similarity: Math.round(similarity * 100) + '%',
      },
    });
  }

  // 2. Check if same name exists in PKGX
  const sameNamePkgx = context.pkgxCategories.find(
    c => c.id !== input.pkgxCatId && normalizeString(c.name) === normalizedHrmName
  );
  if (sameNamePkgx) {
    warnings.push({
      code: CATEGORY_MAPPING_WARNING_CODES.SAME_NAME_AVAILABLE,
      message: CATEGORY_MAPPING_WARNING_MESSAGES[CATEGORY_MAPPING_WARNING_CODES.SAME_NAME_AVAILABLE],
      details: {
        suggestedCategory: sameNamePkgx,
      },
    });
  }

  // 3. Check if parent category is not mapped (for HRM categories with parent)
  if (hrmCat.parentId) {
    const parentMapping = context.existingMappings.find(
      m => m.hrmCategorySystemId === hrmCat.parentId
    );
    if (!parentMapping) {
      const parentCat = context.hrmCategories.find(c => c.systemId === hrmCat.parentId);
      if (parentCat) {
        warnings.push({
          code: CATEGORY_MAPPING_WARNING_CODES.PARENT_NOT_MAPPED,
          message: CATEGORY_MAPPING_WARNING_MESSAGES[CATEGORY_MAPPING_WARNING_CODES.PARENT_NOT_MAPPED],
          details: {
            parentName: parentCat.name,
            parentId: hrmCat.parentId,
          },
        });
      }
    }
  }

  // 4. Check many-to-one mapping
  const otherMappingsToSamePkgx = context.existingMappings.filter(
    m => m.pkgxCatId === input.pkgxCatId && m.id !== context.editingMappingId
  );
  if (otherMappingsToSamePkgx.length > 0) {
    warnings.push({
      code: CATEGORY_MAPPING_WARNING_CODES.MANY_TO_ONE_MAPPING,
      message: CATEGORY_MAPPING_WARNING_MESSAGES[CATEGORY_MAPPING_WARNING_CODES.MANY_TO_ONE_MAPPING],
      details: {
        count: otherMappingsToSamePkgx.length + 1,
        existingMappings: otherMappingsToSamePkgx.map(m => m.hrmCategoryName),
      },
    });
  }

  // 5. Check if mapping to parent category when children exist
  const pkgxChildren = context.pkgxCategories.filter(c => c.parentId === pkgxCat.id);
  if (pkgxChildren.length > 0) {
    warnings.push({
      code: CATEGORY_MAPPING_WARNING_CODES.CHILD_ALREADY_MAPPED,
      message: 'Danh mục PKGX này có danh mục con. Cân nhắc mapping với danh mục con cụ thể',
      details: {
        childCount: pkgxChildren.length,
        children: pkgxChildren.slice(0, 5).map(c => c.name),
      },
    });
  }

  return warnings;
}

/**
 * Main validation function
 */
export function validateCategoryMapping(
  input: CategoryMappingInput,
  context: ValidationContext
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // 1. Required fields
  errors.push(...validateRequiredFields(input));

  // If required fields are missing, stop here
  if (errors.length > 0) {
    return { isValid: false, errors, warnings };
  }

  // 2. Category exists
  errors.push(...validateCategoryExists(input, context));

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
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
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
 * Suggest matching categories based on name
 */
export function suggestMatchingCategories(
  hrmCategoryName: string,
  pkgxCategories: PkgxCategory[],
  limit = 5
): Array<{ category: PkgxCategory; score: number }> {
  const normalizedInput = normalizeString(hrmCategoryName);
  
  const scored = pkgxCategories.map(cat => ({
    category: cat,
    score: calculateSimilarity(normalizedInput, normalizeString(cat.name)),
  }));
  
  return scored
    .filter(s => s.score > 0.2)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Find potential duplicate mappings
 */
export function findPotentialDuplicates(
  mappings: PkgxCategoryMapping[]
): Array<{ pkgxCatId: number; mappings: PkgxCategoryMapping[] }> {
  const grouped = new Map<number, PkgxCategoryMapping[]>();
  
  for (const mapping of mappings) {
    const existing = grouped.get(mapping.pkgxCatId) || [];
    existing.push(mapping);
    grouped.set(mapping.pkgxCatId, existing);
  }
  
  return Array.from(grouped.entries())
    .filter(([, mappings]) => mappings.length > 1)
    .map(([pkgxCatId, mappings]) => ({ pkgxCatId, mappings }));
}

// ========================================
// Batch Validation
// ========================================

export interface BatchValidationResult {
  valid: CategoryMappingInput[];
  invalid: Array<{ input: CategoryMappingInput; errors: ValidationError[] }>;
  withWarnings: Array<{ input: CategoryMappingInput; warnings: ValidationWarning[] }>;
  summary: {
    total: number;
    validCount: number;
    invalidCount: number;
    warningCount: number;
  };
}

/**
 * Validate multiple mappings at once
 */
export function validateBatchMappings(
  inputs: CategoryMappingInput[],
  context: ValidationContext
): BatchValidationResult {
  const valid: CategoryMappingInput[] = [];
  const invalid: Array<{ input: CategoryMappingInput; errors: ValidationError[] }> = [];
  const withWarnings: Array<{ input: CategoryMappingInput; warnings: ValidationWarning[] }> = [];

  // Check for duplicates within the batch itself
  const hrmIdsSeen = new Set<string>();
  
  for (const input of inputs) {
    // Check batch internal duplicates
    if (input.hrmCategorySystemId && hrmIdsSeen.has(input.hrmCategorySystemId)) {
      invalid.push({
        input,
        errors: [{
          code: CATEGORY_MAPPING_ERROR_CODES.HRM_CATEGORY_ALREADY_MAPPED,
          field: 'hrmCategorySystemId',
          message: 'Danh mục HRM này xuất hiện nhiều lần trong danh sách import',
        }],
      });
      continue;
    }
    
    if (input.hrmCategorySystemId) {
      hrmIdsSeen.add(input.hrmCategorySystemId);
    }
    
    const result = validateCategoryMapping(input, context);
    
    if (!result.isValid) {
      invalid.push({ input, errors: result.errors });
    } else {
      valid.push(input);
      if (result.warnings.length > 0) {
        withWarnings.push({ input, warnings: result.warnings });
      }
    }
  }

  return {
    valid,
    invalid,
    withWarnings,
    summary: {
      total: inputs.length,
      validCount: valid.length,
      invalidCount: invalid.length,
      warningCount: withWarnings.length,
    },
  };
}
