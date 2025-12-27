/**
 * useAllCashAccounts - Convenience hook for flat array of cash accounts
 * Returns all cash accounts (equivalent to old store's accounts array)
 */

import { useCashAccounts } from './use-cashbook';

export function useAllCashAccounts() {
  const { data, ...rest } = useCashAccounts({});
  return {
    accounts: data?.data || [],
    ...rest,
  };
}
