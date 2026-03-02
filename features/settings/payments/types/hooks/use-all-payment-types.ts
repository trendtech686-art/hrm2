/**
 * useAllPaymentTypes - Convenience hook for flat array of payment types
 * Auto-pagination: no hardcoded limit cap (MODULE-QUALITY-CRITERIA §1.3)
 */

import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchPaymentTypes } from '../api/payment-types-api';
import { paymentTypeKeys } from './use-payment-types';

export function useAllPaymentTypes() {
  const query = useQuery({
    queryKey: [...paymentTypeKeys.all, 'all'],
    queryFn: () => fetchAllPages((p) => fetchPaymentTypes(p)),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
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
