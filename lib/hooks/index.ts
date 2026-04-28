/**
 * Hooks Index
 * 
 * Re-export all custom hooks
 * 
 * @example
 * import { useOptimisticMutation, usePrefetch } from '@/lib/hooks';
 */

// Optimistic Updates
export {
  useOptimisticMutation,
  useOptimisticDelete,
  useOptimisticStatusUpdate,
  useOptimisticToggle,
} from './use-optimistic-mutation';

// Prefetching
export {
  usePrefetch,
  usePrefetchOnHover,
  usePrefetchLink,
} from './use-prefetch';

// Search Params
export { useSearchParamsWithSetter } from './use-search-params-setter';

// Meilisearch Search Hooks - re-exported from @/hooks/use-meilisearch
export {
  // Product search
  useMeiliProductSearch,
  useInfiniteMeiliProductSearch,
  useProductAutocomplete,
  // Customer search
  useMeiliCustomerSearch,
  useInfiniteMeiliCustomerSearch,
  useCustomerAutocomplete,
  // Order search
  useMeiliOrderSearch,
  useOrderAutocomplete,
  // Supplier search
  useMeiliSupplierSearch,
  useInfiniteMeiliSupplierSearch,
  useSupplierAutocomplete,
  // Shipment search
  useMeiliShipmentSearch,
  useInfiniteMeiliShipmentSearch,
  useShipmentAutocomplete,
  // Warranty search
  useMeiliWarrantySearch,
  useInfiniteMeiliWarrantySearch,
  useWarrantyAutocomplete,
  // Employee search
  useMeiliEmployeeSearch,
  useInfiniteMeiliEmployeeSearch,
  useEmployeeAutocomplete,
  // PKGX Product search
  useMeiliPkgxProductSearch,
  useInfiniteMeiliPkgxProductSearch,
  usePkgxProductAutocomplete,
} from '@/hooks/use-meilisearch';

// Meilisearch Employee Hooks
export {
  useMeiliEmployeeSearch,
  useInfiniteMeiliEmployeeSearch,
  useEmployeeAutocomplete,
} from '@/hooks/use-meilisearch';
export type { EmployeeSearchResult } from '@/hooks/use-meilisearch';

// Meilisearch PKGX Product Hooks
export {
  useMeiliPkgxProductSearch,
  useInfiniteMeiliPkgxProductSearch,
  usePkgxProductAutocomplete,
} from '@/hooks/use-meilisearch';
export type { PkgxProductSearchResult } from '@/hooks/use-meilisearch';
