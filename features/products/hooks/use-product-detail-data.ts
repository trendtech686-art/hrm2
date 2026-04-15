/**
 * useProductDetailData - Consolidated hook for product DETAIL page reference data.
 * 
 * Replaces 6 separate hooks:
 *   - useCategoryFinder       → categories
 *   - useBrandFinder          → brands
 *   - useSupplierFinder       → suppliers
 *   - useAllPricingPolicies   → pricingPolicies
 *   - useAllBranches          → branches
 *   - useStoreInfoData        → storeInfo
 *
 * Single API call: GET /api/products/detail-reference-data
 * Also populates individual React Query caches for backward compatibility.
 */

import * as React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { SystemId } from '@/lib/id-types';

interface Category {
  systemId: SystemId;
  name: string;
  path: string | null;
  parentId: string | null;
  isActive: boolean;
}

interface Brand {
  systemId: SystemId;
  name: string;
}

interface Supplier {
  systemId: SystemId;
  name: string;
}

interface PricingPolicy {
  systemId: SystemId;
  name: string;
  type: string;
  isActive: boolean;
  isDefault: boolean;
}

interface Branch {
  systemId: SystemId;
  name: string;
  isDefault: boolean;
  address: string | null;
  phone: string | null;
}

interface DetailReferenceData {
  categories: Category[];
  brands: Brand[];
  suppliers: Supplier[];
  pricingPolicies: PricingPolicy[];
  branches: Branch[];
  storeInfo: Record<string, unknown> | null;
}

async function fetchDetailReferenceData(): Promise<DetailReferenceData> {
  const response = await fetch('/api/products/detail-reference-data');
  if (!response.ok) {
    throw new Error('Failed to fetch detail reference data');
  }
  // API returns plain strings for systemId, cast to branded SystemId type
  return response.json() as Promise<DetailReferenceData>;
}

export function useProductDetailData() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['products', 'detail-reference-data'],
    queryFn: fetchDetailReferenceData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  // Populate individual caches for backward compatibility
  React.useEffect(() => {
    if (!data) return;
    queryClient.setQueryData(['categories', 'all'], data.categories);
    queryClient.setQueryData(['brands', 'all'], data.brands);
    queryClient.setQueryData(['suppliers', 'all'], data.suppliers);
    queryClient.setQueryData(['pricing-policies', 'all'], data.pricingPolicies);
    queryClient.setQueryData(['branches', 'all'], data.branches);
    if (data.storeInfo) {
      queryClient.setQueryData(['store-info', 'current'], data.storeInfo);
    }
  }, [data, queryClient]);

  const categories = React.useMemo(() => data?.categories ?? [], [data?.categories]);
  const brands = React.useMemo(() => data?.brands ?? [], [data?.brands]);
  const suppliers = React.useMemo(() => data?.suppliers ?? [], [data?.suppliers]);
  const pricingPolicies = React.useMemo(() => data?.pricingPolicies ?? [], [data?.pricingPolicies]);
  const branches = React.useMemo(() => data?.branches ?? [], [data?.branches]);

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
    categories,
    brands,
    suppliers,
    pricingPolicies,
    branches,
    storeInfo: data?.storeInfo ?? null,
    findCategoryById,
    findBrandById,
    findSupplierById,
    isLoading,
  };
}
