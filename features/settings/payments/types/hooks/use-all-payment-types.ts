/**
 * useAllPaymentTypes - Convenience hook for flat array of payment types
 * Returns all payment types (equivalent to old store's data array)
 */

import { usePaymentTypes } from './use-payment-types';

export function useAllPaymentTypes() {
  const { data, ...rest } = usePaymentTypes({});
  return {
    data: data?.data || [],
    ...rest,
  };
}

export function usePaymentTypeFinder() {
  const { data: paymentTypes = [] } = useAllPaymentTypes();
  
  const findById = (systemId: string) => {
    return paymentTypes.find(pt => pt.systemId === systemId) ?? null;
  };
  
  return { findById };
}
