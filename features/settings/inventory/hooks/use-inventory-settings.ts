/**
 * Inventory Settings React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/inventory-settings-api';
import type { ProductType, ProductCategory, Brand } from '@/lib/types/prisma-extended';

export const inventorySettingsKeys = {
  all: ['inventory-settings'] as const,
  productTypes: () => [...inventorySettingsKeys.all, 'product-types'] as const,
  categories: () => [...inventorySettingsKeys.all, 'categories'] as const,
  brands: () => [...inventorySettingsKeys.all, 'brands'] as const,
  importers: () => [...inventorySettingsKeys.all, 'importers'] as const,
};

// Product Types
export function useProductTypes() {
  return useQuery({ queryKey: inventorySettingsKeys.productTypes(), queryFn: api.fetchProductTypes, staleTime: 1000 * 60 * 10 });
}

export function useProductTypeMutations(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: inventorySettingsKeys.productTypes() });
  return {
    create: useMutation({ mutationFn: api.createProductType, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    update: useMutation({ mutationFn: ({ systemId, data }: { systemId: string; data: Partial<ProductType> }) => api.updateProductType(systemId, data), onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    remove: useMutation({ mutationFn: api.deleteProductType, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
  };
}

// Product Categories
export function useProductCategories() {
  return useQuery({ queryKey: inventorySettingsKeys.categories(), queryFn: api.fetchProductCategories, staleTime: 1000 * 60 * 10 });
}

export function useProductCategoryMutations(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: inventorySettingsKeys.categories() });
  return {
    create: useMutation({ mutationFn: api.createProductCategory, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    update: useMutation({ mutationFn: ({ systemId, data }: { systemId: string; data: Partial<ProductCategory> }) => api.updateProductCategory(systemId, data), onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    remove: useMutation({ mutationFn: api.deleteProductCategory, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
  };
}

// Brands
export function useInventoryBrands() {
  return useQuery({ queryKey: inventorySettingsKeys.brands(), queryFn: api.fetchBrands, staleTime: 1000 * 60 * 10 });
}

export function useBrandMutations(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: inventorySettingsKeys.brands() });
  return {
    create: useMutation({ mutationFn: api.createBrand, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    update: useMutation({ mutationFn: ({ systemId, data }: { systemId: string; data: Partial<Brand> }) => api.updateBrand(systemId, data), onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    remove: useMutation({ mutationFn: api.deleteBrand, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
  };
}

// Importers
export function useImporters() {
  return useQuery({ queryKey: inventorySettingsKeys.importers(), queryFn: api.fetchImporters, staleTime: 1000 * 60 * 10 });
}

export function useImporterMutations(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: inventorySettingsKeys.importers() });
  return {
    create: useMutation({ mutationFn: api.createImporter, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    update: useMutation({ mutationFn: ({ systemId, data }: { systemId: string; data: any }) => api.updateImporter(systemId, data), onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    remove: useMutation({ mutationFn: api.deleteImporter, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
  };
}

// =============================================
// CONVENIENCE HOOKS (for backward compatibility)
// =============================================

// Active brands (isActive = true)
export function useActiveBrands() {
  const query = useInventoryBrands();
  const data = (query.data || []).filter((b: Brand) => b.isActive);
  return { ...query, data };
}

// Active importers (isActive = true) 
export function useActiveImporters() {
  const query = useImporters();
  const data = (query.data || []).filter((i: any) => i.isActive);
  return { ...query, data };
}

// Storage locations - TODO: Implement when storage locations API is ready
export function useStorageLocations() {
  // Placeholder - returns empty array until storage locations API is implemented
  return { data: [], isLoading: false, isError: false, error: null };
}
