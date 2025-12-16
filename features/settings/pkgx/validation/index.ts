// Category Mapping Validation
export {
  // Types
  type ValidationResult,
  type ValidationError,
  type ValidationWarning,
  type CategoryMappingInput,
  type ValidationContext,
  type BatchValidationResult,
  
  // Error/Warning codes
  CATEGORY_MAPPING_ERROR_CODES,
  CATEGORY_MAPPING_WARNING_CODES,
  CATEGORY_MAPPING_ERROR_MESSAGES,
  CATEGORY_MAPPING_WARNING_MESSAGES,
  
  // Validation functions
  validateCategoryMapping,
  validateRequiredFields,
  validateCategoryExists,
  validateDuplicateMappings,
  checkWarnings,
  validateBatchMappings,
  
  // Utilities
  suggestMatchingCategories,
  findPotentialDuplicates,
} from './category-mapping-validation';

// Brand Mapping Validation
export {
  // Types
  type BrandValidationResult,
  type BrandValidationError,
  type BrandValidationWarning,
  type BrandMappingInput,
  type BrandValidationContext,
  
  // Error/Warning codes
  BRAND_MAPPING_ERROR_CODES,
  BRAND_MAPPING_WARNING_CODES,
  BRAND_MAPPING_ERROR_MESSAGES,
  BRAND_MAPPING_WARNING_MESSAGES,
  
  // Validation functions
  validateBrandMapping,
  validateRequiredFields as validateBrandRequiredFields,
  validateBrandExists,
  validateDuplicateMappings as validateBrandDuplicateMappings,
  checkWarnings as checkBrandWarnings,
  
  // Utilities
  suggestMatchingBrands,
} from './brand-mapping-validation';
