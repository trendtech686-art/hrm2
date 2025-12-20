import * as React from 'react';
import type { SystemId } from '@/lib/id-types';
import type { PkgxProduct } from '../types';
import {
  validateProductMapping,
  suggestMatchingProducts,
  type ProductValidationResult,
  type ProductValidationContext,
  type ProductMappingInput,
} from '../validation/product-mapping-validation';

interface UseProductMappingValidationOptions {
  hrmProducts: Array<{
    systemId: SystemId;
    name: string;
    id: string;
    pkgxId?: number;
    status?: string;
    isActive?: boolean;
  }>;
  pkgxProducts: PkgxProduct[];
  editingProductId?: string;
  debounceMs?: number;
}

interface UseProductMappingValidationReturn {
  // Validation state
  validationResult: ProductValidationResult | null;
  isValidating: boolean;
  
  // Suggestions
  suggestions: Array<{ product: UseProductMappingValidationOptions['hrmProducts'][0]; score: number; matchType: 'sku' | 'name' }>;
  
  // Actions
  validate: (input: ProductMappingInput) => ProductValidationResult;
  validateAsync: (input: ProductMappingInput) => Promise<ProductValidationResult>;
  clearValidation: () => void;
  updateSuggestions: (pkgxProduct: PkgxProduct) => void;
  
  // Helpers
  hasErrors: boolean;
  hasWarnings: boolean;
  getFieldError: (field: string) => string | undefined;
  getFieldWarning: (field: string) => string | undefined;
}

/**
 * Hook để quản lý validation cho product mapping/linking
 */
export function useProductMappingValidation(
  options: UseProductMappingValidationOptions
): UseProductMappingValidationReturn {
  const {
    hrmProducts,
    pkgxProducts,
    editingProductId,
    debounceMs = 300,
  } = options;

  const [validationResult, setValidationResult] = React.useState<ProductValidationResult | null>(null);
  const [isValidating, setIsValidating] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<Array<{ product: typeof hrmProducts[0]; score: number; matchType: 'sku' | 'name' }>>([]);
  
  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Create validation context
  const context = React.useMemo((): ProductValidationContext => ({
    hrmProducts,
    pkgxProducts,
    editingProductId,
  }), [hrmProducts, pkgxProducts, editingProductId]);

  // Update suggestions based on PKGX product
  const updateSuggestions = React.useCallback((pkgxProduct: PkgxProduct) => {
    const newSuggestions = suggestMatchingProducts(
      { goods_name: pkgxProduct.goods_name, goods_sn: pkgxProduct.goods_sn },
      hrmProducts
    );
    setSuggestions(newSuggestions);
  }, [hrmProducts]);

  // Sync validation
  const validate = React.useCallback((input: ProductMappingInput): ProductValidationResult => {
    const result = validateProductMapping(input, context);
    setValidationResult(result);
    return result;
  }, [context]);

  // Async validation with debounce
  const validateAsync = React.useCallback(async (input: ProductMappingInput): Promise<ProductValidationResult> => {
    return new Promise((resolve) => {
      setIsValidating(true);
      
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      debounceTimerRef.current = setTimeout(() => {
        const result = validate(input);
        setIsValidating(false);
        resolve(result);
      }, debounceMs);
    });
  }, [validate, debounceMs]);

  // Clear validation
  const clearValidation = React.useCallback(() => {
    setValidationResult(null);
    setSuggestions([]);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  }, []);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Computed values
  const hasErrors = validationResult ? validationResult.errors.length > 0 : false;
  const hasWarnings = validationResult ? validationResult.warnings.length > 0 : false;

  const getFieldError = React.useCallback((field: string): string | undefined => {
    if (!validationResult) return undefined;
    const error = validationResult.errors.find(e => e.field === field);
    return error?.message;
  }, [validationResult]);

  const getFieldWarning = React.useCallback((field: string): string | undefined => {
    if (!validationResult) return undefined;
    const warning = validationResult.warnings.find(w => w.field === field);
    return warning?.message;
  }, [validationResult]);

  return {
    validationResult,
    isValidating,
    suggestions,
    validate,
    validateAsync,
    clearValidation,
    updateSuggestions,
    hasErrors,
    hasWarnings,
    getFieldError,
    getFieldWarning,
  };
}
