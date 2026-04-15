/**
 * useFormSettingsData - Combined hook for form settings data
 * 
 * Fetches payment-methods, payment-types, and taxes in a single API call
 * Reduces waterfall requests from 3 to 1 for forms like PO, Order, etc.
 */

import { useQuery } from '@tanstack/react-query';
import type { PaymentMethod } from '@/features/settings/payments/methods/types';
import type { Tax } from '@/lib/types/prisma-extended';

// Types matching API response
export interface FormSettingsPaymentType {
  systemId: string;
  id: string;
  name: string;
  description?: string | null;
  type: string;
  isActive: boolean;
  isDefault: boolean;
  [key: string]: unknown;
}

export interface FormSettingsData {
  paymentMethods: PaymentMethod[];
  paymentTypes: FormSettingsPaymentType[];
  taxes: Tax[];
}

// Query keys
export const formSettingsKeys = {
  all: ['settings', 'form-data'] as const,
};

// Fetch function
async function fetchFormSettingsData(): Promise<FormSettingsData> {
  const res = await fetch('/api/settings/form-data');
  if (!res.ok) {
    throw new Error('Failed to fetch form settings data');
  }
  const json = await res.json();
  return json;
}

// Main hook
export function useFormSettingsData(options?: { enabled?: boolean }) {
  const query = useQuery({
    queryKey: formSettingsKeys.all,
    queryFn: fetchFormSettingsData,
    staleTime: 30 * 60 * 1000, // 30 minutes (settings don't change often)
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    enabled: options?.enabled,
  });

  return {
    // Raw data
    paymentMethods: query.data?.paymentMethods || [],
    paymentTypes: query.data?.paymentTypes || [],
    taxes: query.data?.taxes || [],
    
    // Status
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    
    // Helper functions for taxes
    getDefaultSaleTax: () => query.data?.taxes.find(t => t.isDefaultSale),
    getDefaultPurchaseTax: () => query.data?.taxes.find(t => t.isDefaultPurchase),
    
    // Helper for default payment method
    getDefaultPaymentMethod: () => query.data?.paymentMethods.find(m => m.isDefault),
  };
}

// Individual selectors for components that only need one type
export function useFormPaymentMethods(options?: { enabled?: boolean }) {
  const { paymentMethods, isLoading, isError, error, getDefaultPaymentMethod } = useFormSettingsData(options);
  return { data: paymentMethods, isLoading, isError, error, getDefault: getDefaultPaymentMethod };
}

export function useFormPaymentTypes(options?: { enabled?: boolean }) {
  const { paymentTypes, isLoading, isError, error } = useFormSettingsData(options);
  return { data: paymentTypes, isLoading, isError, error };
}

export function useFormTaxes(options?: { enabled?: boolean }) {
  const { taxes, isLoading, isError, error, getDefaultSaleTax, getDefaultPurchaseTax } = useFormSettingsData(options);
  return { 
    data: taxes, 
    isLoading, 
    isError, 
    error,
    getDefaultSale: getDefaultSaleTax,
    getDefaultPurchase: getDefaultPurchaseTax,
  };
}
