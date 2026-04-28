/**
 * Convenience hooks for customer settings - flat array access
 * Phase 8: Dead hooks removed - only useActiveCustomerTypes remains in use
 */

import { useCallback } from 'react';
import { useCustomerTypes } from './use-customer-settings';

/**
 * Returns only active customer types
 */
export function useActiveCustomerTypes() {
  const query = useCustomerTypes();

  const activeData = query.data?.filter(t => !t.isDeleted && t.isActive !== false) ?? [];

  return { data: activeData, isLoading: query.isLoading, isError: query.isError, error: query.error };
}
