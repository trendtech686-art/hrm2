/**
 * useAllTaxes - Convenience hook for components needing all taxes as flat array
 * 
 * Replaces legacy useTaxStore().data pattern
 */

import * as React from 'react';
import { useAllTaxes as useAllTaxesQuery } from './use-taxes';
import type { Tax } from '@/lib/types/prisma-extended';

/**
 * Returns all taxes as a flat array with helper functions
 * Compatible with legacy store pattern: { data: taxes }
 */
export function useAllTaxesData(options?: { enabled?: boolean }) {
  const query = useAllTaxesQuery(options);
  
  // Memoize data to prevent useCallback deps warnings
  const data = React.useMemo(() => query.data || [], [query.data]);
  
  // Helper to get default sale tax
  const getDefaultSale = React.useCallback((): Tax | undefined => {
    return data.find(tax => tax.isDefaultSale);
  }, [data]);
  
  // Helper to get default purchase tax
  const getDefaultPurchase = React.useCallback((): Tax | undefined => {
    return data.find(tax => tax.isDefaultPurchase);
  }, [data]);

  // Helper to get default Excel export tax
  const getDefaultExcelExport = React.useCallback((): Tax | undefined => {
    return data.find(tax => tax.isDefaultExcelExport);
  }, [data]);
  
  return {
    data,
    getDefaultSale,
    getDefaultPurchase,
    getDefaultExcelExport,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

/**
 * Returns taxes formatted as options for Select/Combobox
 */
export function useTaxOptions() {
  const { data, isLoading } = useAllTaxesData();
  
  const options = data.map(t => ({
    value: t.systemId,
    label: `${t.name} (${t.rate}%)`,
    rate: t.rate,
  }));
  
  return { options, isLoading };
}

/**
 * Helper hook to find a tax by ID from cached data
 */
export function useTaxFinder(options?: { enabled?: boolean }) {
  const { data } = useAllTaxesData(options);
  
  const findById = React.useCallback(
    (systemId: string | undefined) => {
      if (!systemId) return undefined;
      return data.find(t => t.systemId === systemId);
    },
    [data]
  );
  
  return { findById };
}
