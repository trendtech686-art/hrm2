/**
 * useAllPaymentTypes - Convenience hook for flat array of payment types
 * Auto-pagination: no hardcoded limit cap (MODULE-QUALITY-CRITERIA §1.3)
 */

import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchPaymentTypes } from '../api/payment-types-api';
import { paymentTypeKeys } from './use-payment-types';

export function useAllPaymentTypes(options?: { enabled?: boolean }) {
  const query = useQuery({
    queryKey: [...paymentTypeKeys.all, 'all'],
    queryFn: () => fetchAllPages((p) => fetchPaymentTypes(p)),
    staleTime: 30 * 60 * 1000, // 30 minutes - settings rarely change
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    enabled: options?.enabled,
  });
  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

export function usePaymentTypeFinder() {
  const { data: paymentTypes = [] } = useAllPaymentTypes();
  
  const findById = (systemId: string) => {
    return paymentTypes.find(pt => pt.systemId === systemId) ?? null;
  };
  
  return { findById };
}
