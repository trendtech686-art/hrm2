/**
 * useProductPageData - Consolidated hook for products LIST page reference data.
 * 
 * Replaces 5 separate hooks:
 *   - useActiveCategories / useCategoryFinder → categories
 *   - useBrandFinder                         → brands
 *   - useSupplierFinder                      → suppliers  
 *   - useAllPricingPolicies                  → pricingPolicies
 *   - useStoreInfoData                       → storeInfo
 *
 * Single API call: GET /api/products/page-reference-data
 * Also populates individual React Query caches for backward compatibility.
 */

import * as React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { SystemId } from '@/lib/id-types';

interface Category {
  systemId: string;
  name: string;
  path: string | null;
  parentId: string | null;
  isActive: boolean;
}

interface Brand {
  systemId: string;
  name: string;
}

interface Supplier {
  systemId: string;
  name: string;
}

interface PricingPolicy {
  systemId: string;
  name: string;
  type: string;
  isActive: boolean;
  isDefault: boolean;
}

interface PageReferenceData {
  categories: Category[];
  brands: Brand[];
  suppliers: Supplier[];
  pricingPolicies: PricingPolicy[];
  storeInfo: Record<string, unknown> | null;
}

async function fetchPageReferenceData(): Promise<PageReferenceData> {
  const response = await fetch('/api/products/page-reference-data');
  if (!response.ok) {
    throw new Error('Failed to fetch page reference data');
  }
  return response.json();
}

export function useProductPageData() {
  const queryClient = useQueryClient();
  
  const { data, isLoading } = useQuery({
    queryKey: ['products', 'page-reference-data'],
    queryFn: fetchPageReferenceData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  // Populate individual caches for components that use the separate hooks
  React.useEffect(() => {
    if (!data) return;
    // Populate categories cache
    queryClient.setQueryData(['categories', 'all'], data.categories);
    // Populate brands cache
    queryClient.setQueryData(['brands', 'all'], data.brands);
    // Populate suppliers cache
    queryClient.setQueryData(['suppliers', 'all'], data.suppliers);
    // Populate pricing policies cache (key matches pricingPolicyKeys.all + 'all')
    queryClient.setQueryData(['pricing-policies', 'all'], data.pricingPolicies);
    // Populate store info cache
    if (data.storeInfo) {
      queryClient.setQueryData(['store-info', 'current'], data.storeInfo);
    }
  }, [data, queryClient]);

  const categories = React.useMemo(() => data?.categories ?? [], [data?.categories]);
  const brands = React.useMemo(() => data?.brands ?? [], [data?.brands]);
  const suppliers = React.useMemo(() => data?.suppliers ?? [], [data?.suppliers]);
  const pricingPolicies = React.useMemo(() => data?.pricingPolicies ?? [], [data?.pricingPolicies]);

  // Active categories for filter dropdown
  const activeCategories = React.useMemo(
    () => categories.filter(c => c.isActive !== false),
    [categories]
  );

  // Finder functions for column lookups
  const findCategoryById = React.useCallback(
    (systemId: SystemId | string | undefined) => {
      if (!systemId) return undefined;
      return categories.find(c => c.systemId === systemId);
    },
    [categories]
  );

  const findBrandById = React.useCallback(
    (systemId: SystemId | string | undefined) => {
      if (!systemId) return undefined;
      return brands.find(b => b.systemId === systemId);
    },
    [brands]
  );

  const findSupplierById = React.useCallback(
    (systemId: SystemId | string | undefined) => {
      if (!systemId) return undefined;
      return suppliers.find(s => s.systemId === systemId);
    },
    [suppliers]
  );

  return {
    // Raw data
    categories,
    activeCategories,
    brands,
    suppliers,
    pricingPolicies,
    storeInfo: data?.storeInfo ?? null,
    // Finder functions
    findCategoryById,
    findBrandById,
    findSupplierById,
    // Loading state
    isLoading,
  };
}
