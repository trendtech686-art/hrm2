import * as React from 'react';
import type { SystemId } from '@/lib/id-types';
import type { PkgxBrandMapping, PkgxBrand } from '../types';
import {
  validateBrandMapping,
  suggestMatchingBrands,
  type BrandValidationResult,
  type BrandValidationContext,
  type BrandMappingInput,
} from '../validation';

interface UseBrandMappingValidationOptions {
  existingMappings: PkgxBrandMapping[];
  hrmBrands: Array<{
    systemId: SystemId;
    name: string;
    status?: string;
    isActive?: boolean;
  }>;
  pkgxBrands: PkgxBrand[];
  editingMappingId?: string;
  debounceMs?: number;
}

interface UseBrandMappingValidationReturn {
  // Validation state
  validationResult: BrandValidationResult | null;
  isValidating: boolean;
  
  // Suggestions
  suggestions: Array<{ brand: PkgxBrand; score: number }>;
  
  // Actions
  validate: (input: BrandMappingInput) => BrandValidationResult;
  validateAsync: (input: BrandMappingInput) => Promise<BrandValidationResult>;
  clearValidation: () => void;
  
  // Helpers
  hasErrors: boolean;
  hasWarnings: boolean;
  getFieldError: (field: string) => string | undefined;
  getFieldWarning: (field: string) => string | undefined;
}

/**
 * Hook để quản lý validation cho brand mapping
 */
export function useBrandMappingValidation(
  options: UseBrandMappingValidationOptions
): UseBrandMappingValidationReturn {
  const {
    existingMappings,
    hrmBrands,
    pkgxBrands,
    editingMappingId,
    debounceMs = 300,
  } = options;

  const [validationResult, setValidationResult] = React.useState<BrandValidationResult | null>(null);
  const [isValidating, setIsValidating] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<Array<{ brand: PkgxBrand; score: number }>>([]);
  
  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Create validation context
  const context = React.useMemo((): BrandValidationContext => ({
    existingMappings,
    hrmBrands,
    pkgxBrands,
    editingMappingId,
  }), [existingMappings, hrmBrands, pkgxBrands, editingMappingId]);

  // Sync validation
  const validate = React.useCallback((input: BrandMappingInput): BrandValidationResult => {
    const result = validateBrandMapping(input, context);
    setValidationResult(result);
    
    // Update suggestions based on HRM brand name
    if (input.hrmBrandSystemId) {
      const hrmBrand = hrmBrands.find(b => b.systemId === input.hrmBrandSystemId);
      if (hrmBrand) {
        const newSuggestions = suggestMatchingBrands(hrmBrand.name, pkgxBrands);
        setSuggestions(newSuggestions);
      }
    }
    
    return result;
  }, [context, hrmBrands, pkgxBrands]);

  // Async validation with debounce
  const validateAsync = React.useCallback(async (input: BrandMappingInput): Promise<BrandValidationResult> => {
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
    hasErrors,
    hasWarnings,
    getFieldError,
    getFieldWarning,
  };
}
