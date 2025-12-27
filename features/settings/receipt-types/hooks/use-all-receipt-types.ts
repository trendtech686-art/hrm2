/**
 * useAllReceiptTypes - Convenience hook for flat array of receipt types
 */

import { useReceiptTypes } from './use-receipt-types';

export function useAllReceiptTypes() {
  const { data, ...rest } = useReceiptTypes({});
  return {
    data: data?.data || [],
    ...rest,
  };
}
