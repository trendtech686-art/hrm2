import * as React from 'react';
import type { SystemId } from '@/lib/id-types';
import type { PkgxCategoryMapping, PkgxCategory } from '../types';
import {
  validateCategoryMapping,
  suggestMatchingCategories,
  type ValidationResult,
  type ValidationContext,
  type CategoryMappingInput,
} from '../validation';

interface UseCategoryMappingValidationOptions {
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
  editingMappingId?: string;
  debounceMs?: number;
}

interface UseCategoryMappingValidationReturn {
  // Validation state
  validationResult: ValidationResult | null;
  isValidating: boolean;
  
  // Suggestions
  suggestions: Array<{ category: PkgxCategory; score: number }>;
  
  // Actions
  validate: (input: CategoryMappingInput) => ValidationResult;
  validateAsync: (input: CategoryMappingInput) => Promise<ValidationResult>;
  clearValidation: () => void;
  
  // Helpers
  hasErrors: boolean;
  hasWarnings: boolean;
  getFieldError: (field: string) => string | undefined;
  getFieldWarning: (field: string) => string | undefined;
}

/**
 * Hook để quản lý validation cho category mapping
 */
export function useCategoryMappingValidation(
  options: UseCategoryMappingValidationOptions
): UseCategoryMappingValidationReturn {
  const {
    existingMappings,
    hrmCategories,
    pkgxCategories,
    editingMappingId,
    debounceMs = 300,
  } = options;

  const [validationResult, setValidationResult] = React.useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<Array<{ category: PkgxCategory; score: number }>>([]);
  
  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Create validation context
  const context = React.useMemo((): ValidationContext => ({
    existingMappings,
    hrmCategories,
    pkgxCategories,
    editingMappingId,
  }), [existingMappings, hrmCategories, pkgxCategories, editingMappingId]);

  // Sync validation
  const validate = React.useCallback((input: CategoryMappingInput): ValidationResult => {
    const result = validateCategoryMapping(input, context);
    setValidationResult(result);
    
    // Update suggestions based on HRM category name
    if (input.hrmCategorySystemId) {
      const hrmCat = hrmCategories.find(c => c.systemId === input.hrmCategorySystemId);
      if (hrmCat) {
        const newSuggestions = suggestMatchingCategories(hrmCat.name, pkgxCategories);
        setSuggestions(newSuggestions);
      }
    }
    
    return result;
  }, [context, hrmCategories, pkgxCategories]);

  // Async validation with debounce
  const validateAsync = React.useCallback(async (input: CategoryMappingInput): Promise<ValidationResult> => {
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

/**
 * Hook đơn giản để validate một field
 */
export function useFieldValidation<T>(
  validator: (value: T) => string | undefined,
  initialValue?: T
) {
  const [error, setError] = React.useState<string | undefined>();
  const [touched, setTouched] = React.useState(false);

  const validate = React.useCallback((value: T) => {
    const errorMessage = validator(value);
    setError(errorMessage);
    return !errorMessage;
  }, [validator]);

  const handleBlur = React.useCallback(() => {
    setTouched(true);
  }, []);

  const reset = React.useCallback(() => {
    setError(undefined);
    setTouched(false);
  }, []);

  // Validate initial value
  React.useEffect(() => {
    if (initialValue !== undefined) {
      validate(initialValue);
    }
  }, []);

  return {
    error: touched ? error : undefined,
    touched,
    validate,
    handleBlur,
    reset,
    isValid: !error,
  };
}
