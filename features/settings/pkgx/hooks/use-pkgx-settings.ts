/**
 * PKGX Settings Hooks
 * React Query hooks for managing PKGX integration settings
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import type { 
  PkgxSettings, 
  PkgxCategory, 
  PkgxBrand,
  PkgxCategoryMapping,
  PkgxBrandMapping,
  PkgxPriceMapping,
  PkgxSyncSettings,
  PkgxSyncResult,
  PkgxProduct,
} from '../types';
import { DEFAULT_PKGX_SETTINGS } from '../types';
import type { SystemId } from '@/lib/id-types';
import { logError } from '@/lib/logger'
import {
  deleteBrandMapping as deleteBrandMappingApi,
  deleteCategoryMapping as deleteCategoryMappingApi,
} from '../api/pkgx-api'

// ========================================
// Query Keys
// ========================================

export const pkgxKeys = {
  all: ['pkgx'] as const,
  settings: () => [...pkgxKeys.all, 'settings'] as const,
  mappingsOnly: () => [...pkgxKeys.settings(), 'mappings-only'] as const,
  section: (section: string) => [...pkgxKeys.settings(), section] as const,
};

// ========================================
// API Functions
// ========================================

/**
 * Fetch lightweight PKGX settings - only mappings, no products/logs
 * Use this for Products list page for better performance
 */
async function fetchPkgxMappingsOnly(): Promise<PkgxSettings> {
  // Single consolidated API call instead of 6 separate requests
  const res = await fetch('/api/settings/pkgx/consolidated-mappings');
  if (!res.ok) {
    throw new Error('Failed to fetch PKGX mappings');
  }
  const json = await res.json();

  // apiSuccess() returns flat data (no { success, data } wrapper)
  const { settings: baseSettings, categories, brands, categoryMappings: rawCatMappings, brandMappings: rawBrandMappings, priceMappings: rawPriceMappings } = json;
  
  const categoryMappings = (rawCatMappings || []).map((m: Record<string, unknown>) => ({
    systemId: m.systemId as string,
    id: m.systemId as string,
    hrmCategoryId: m.hrmCategoryId as string,
    hrmCategorySystemId: m.hrmCategoryId as string,
    hrmCategoryName: m.hrmCategoryName as string,
    pkgxCategoryId: m.pkgxCategoryId as number,
    pkgxCatId: m.pkgxCategoryId as number,
    pkgxCategoryName: m.pkgxCategoryName as string,
    pkgxCatName: m.pkgxCategoryName as string,
    hrmEntityMissing: m.hrmEntityMissing === true,
  }));
  
  const brandMappings = (rawBrandMappings || []).map((m: Record<string, unknown>) => ({
    systemId: m.systemId as string,
    id: m.systemId as string,
    hrmBrandId: m.hrmBrandId as string,
    hrmBrandSystemId: m.hrmBrandId as string,
    hrmBrandName: m.hrmBrandName as string,
    pkgxBrandId: m.pkgxBrandId as number,
    pkgxBrandName: m.pkgxBrandName as string,
    hrmEntityMissing: m.hrmEntityMissing === true,
  }));
  
  const priceTypeToField: Record<string, string> = {
    'shop_price': 'shopPrice',
    'partner_price': 'partnerPrice',
    'price_5vat': 'price5Vat',
    'price_12novat': 'price12Novat',
    'price_5novat': 'price5Novat',
  };
  const priceMapping: Record<string, string | null> = {};
  for (const m of (rawPriceMappings || [])) {
    const fieldName = priceTypeToField[m.priceType];
    if (fieldName) {
      priceMapping[fieldName] = m.pricingPolicyId || null;
    }
  }

  return { 
    ...DEFAULT_PKGX_SETTINGS, 
    ...(baseSettings || {}),
    categories: categories || [],
    brands: brands || [],
    categoryMappings,
    brandMappings,
    priceMapping,
    pkgxProducts: [], // Not loaded for performance
    logs: [], // Not loaded for performance
  };
}

/**
 * Fetch full PKGX settings including products and logs
 * Use this for PKGX settings page
 */
async function fetchPkgxSettings(productsLimit = 100): Promise<PkgxSettings> {
  // Fetch all data in parallel for better performance
  const [
    settingsRes,
    categoriesRes,
    brandsRes,
    categoryMappingsRes,
    brandMappingsRes,
    priceMappingsRes,
    productsRes,
  ] = await Promise.all([
    fetch('/api/pkgx/settings'),
    fetch('/api/settings/pkgx/categories'),
    fetch('/api/settings/pkgx/brands'),
    fetch('/api/settings/pkgx/category-mappings'),
    fetch('/api/settings/pkgx/brand-mappings'),
    fetch('/api/pkgx/price-mappings'),
    fetch(`/api/settings/pkgx/products?limit=${productsLimit}`),
  ]);

  const [
    settingsJson,
    categoriesJson,
    brandsJson,
    categoryMappingsJson,
    brandMappingsJson,
    priceMappingsJson,
    productsJson,
  ] = await Promise.all([
    settingsRes.json(),
    categoriesRes.json(),
    brandsRes.json(),
    categoryMappingsRes.json(),
    brandMappingsRes.json(),
    priceMappingsRes.json(),
    productsRes.json(),
  ]);

  const baseSettings = settingsJson.success ? settingsJson.data : {};
  const categories = categoriesJson.data || [];
  const brands = brandsJson.data || [];
  
  const categoryMappings = (categoryMappingsJson.data || []).map((m: Record<string, unknown>) => ({
    systemId: m.systemId as string,
    id: m.systemId as string,
    hrmCategoryId: m.hrmCategoryId as string,
    hrmCategorySystemId: m.hrmCategoryId as string,
    hrmCategoryName: m.hrmCategoryName as string,
    pkgxCategoryId: m.pkgxCategoryId as number,
    pkgxCatId: m.pkgxCategoryId as number,
    pkgxCategoryName: m.pkgxCategoryName as string,
    pkgxCatName: m.pkgxCategoryName as string,
    hrmEntityMissing: m.hrmEntityMissing === true,
  }));
  
  const brandMappings = (brandMappingsJson.data || []).map((m: Record<string, unknown>) => ({
    systemId: m.systemId as string,
    id: m.systemId as string,
    hrmBrandId: m.hrmBrandId as string,
    hrmBrandSystemId: m.hrmBrandId as string,
    hrmBrandName: m.hrmBrandName as string,
    pkgxBrandId: m.pkgxBrandId as number,
    pkgxBrandName: m.pkgxBrandName as string,
    hrmEntityMissing: m.hrmEntityMissing === true,
  }));
  
  const priceMappingsArray = priceMappingsJson.success ? priceMappingsJson.data : [];
  
  // Convert array to object format for UI: { shopPrice: 'POLICY_ID', ... }
  const priceTypeToField: Record<string, string> = {
    'shop_price': 'shopPrice',
    'partner_price': 'partnerPrice',
    'price_5vat': 'price5Vat',
    'price_12novat': 'price12Novat',
    'price_5novat': 'price5Novat',
  };
  const priceMapping: Record<string, string | null> = {};
  for (const m of priceMappingsArray) {
    const fieldName = priceTypeToField[m.priceType];
    if (fieldName) {
      priceMapping[fieldName] = m.pricingPolicyId || null;
    }
  }
  
  const pkgxProducts: PkgxProduct[] = (productsJson.data || []).map((p: Record<string, unknown>) => ({
    goods_id: p.id as number,
    goods_number: p.goodsNumber as string,
    goods_name: p.name as string,
    cat_id: p.catId as number,
    cat_name: p.catName as string,
    brand_id: p.brandId as number,
    brand_name: p.brandName as string,
    shop_price: p.shopPrice as string,
    market_price: p.marketPrice as string,
    partner_price: p.partnerPrice as string,
    ace_price: p.acePrice as string,
    deal_price: p.dealPrice as string,
    price_5vat: p.price5Vat as string,
    price_12novat: p.price12Novat as string,
    price_5novat: p.price5Novat as string,
    goods_number2: p.goodsNumber2 as string,
    goods_weight: p.goodsWeight as string,
    goods_quantity: p.goodsQuantity as number,
    warn_number: p.warnNumber as number,
    goods_thumb: p.goodsThumb as string,
    original_img: p.originalImg as string,
    goods_brief: p.goodsBrief as string,
    goods_desc: p.goodsDesc as string,
    is_best: p.isBest as number,
    is_new: p.isNew as number,
    is_hot: p.isHot as number,
    is_home: p.isHome as number,
    is_onsale: p.isOnsale as number,
    is_real: p.isReal as number,
    keywords: p.keywords as string,
    ktitle: p.ktitle as string,
    meta_title: p.ktitle as string,
    goods_alias: p.goodsAlias as string,
    last_update: p.lastUpdate as number,
  }));
  
  return { 
    ...DEFAULT_PKGX_SETTINGS, 
    ...baseSettings,
    categories,
    brands,
    categoryMappings,
    brandMappings,
    priceMapping,
    pkgxProducts,
    logs: [],
  };
}

async function updatePkgxSection(section: string, data: unknown): Promise<void> {
  const res = await fetch('/api/pkgx/settings', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ section, data }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to update settings');
}

// ========================================
// Main Settings Hook
// ========================================

export function usePkgxSettings() {
  return useQuery({
    queryKey: pkgxKeys.settings(),
    queryFn: () => fetchPkgxSettings(),
    staleTime: 1000 * 60 * 2, // 2 minutes - prevent excessive refetches
    gcTime: 1000 * 60 * 5, // 5 minutes garbage collection
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });
}

/**
 * Lightweight hook for pages that only need mappings (not PKGX products list)
 * Use this instead of usePkgxSettings on Products list page for better performance
 */
export function usePkgxMappings() {
  return useQuery({
    queryKey: pkgxKeys.mappingsOnly(),
    queryFn: fetchPkgxMappingsOnly,
    staleTime: 1000 * 60 * 5, // 5 minutes - mappings don't change frequently
    gcTime: 1000 * 60 * 10, // 10 minutes garbage collection
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Avoid duplicate fetches when multiple components use this hook
  });
}

// ========================================
// Selector Hooks (Optimized)
// ========================================

export function usePkgxEnabled() {
  const { data: settings } = usePkgxSettings();
  return useMemo(() => settings?.enabled ?? false, [settings?.enabled]);
}

export function usePkgxApiConfig() {
  const { data: settings } = usePkgxSettings();
  return useMemo(
    () => ({
      apiUrl: settings?.apiUrl ?? '',
      apiKey: settings?.apiKey ?? '',
      enabled: settings?.enabled ?? false,
    }),
    [settings?.apiUrl, settings?.apiKey, settings?.enabled]
  );
}

export function usePkgxCategories() {
  const { data: settings } = usePkgxSettings();
  return useMemo(() => settings?.categories ?? [], [settings?.categories]);
}

export function usePkgxBrands() {
  const { data: settings } = usePkgxSettings();
  return useMemo(() => settings?.brands ?? [], [settings?.brands]);
}

export function usePkgxPriceMapping() {
  const { data: settings } = usePkgxSettings();
  return useMemo(
    () => settings?.priceMapping ?? { 
      shopPrice: null, 
      marketPrice: null, 
      partnerPrice: null, 
      acePrice: null, 
      dealPrice: null 
    },
    [settings?.priceMapping]
  );
}

export function usePkgxCategoryMappings() {
  const { data: settings } = usePkgxMappings();
  return useMemo(() => settings?.categoryMappings ?? [], [settings?.categoryMappings]);
}

export function usePkgxBrandMappings() {
  const { data: settings } = usePkgxMappings();
  return useMemo(() => settings?.brandMappings ?? [], [settings?.brandMappings]);
}

export function usePkgxSyncSettings() {
  const { data: settings } = usePkgxSettings();
  return useMemo(
    () => settings?.syncSettings ?? { autoSync: false, syncInterval: 60, syncOnSave: true },
    [settings?.syncSettings]
  );
}

export function usePkgxSyncStatus() {
  const { data: settings } = usePkgxSettings();
  return useMemo(
    () => ({
      lastSyncAt: settings?.lastSyncAt,
      lastSyncResult: settings?.lastSyncResult,
      connectionStatus: settings?.connectionStatus ?? 'disconnected',
      connectionError: settings?.connectionError,
    }),
    [settings?.lastSyncAt, settings?.lastSyncResult, settings?.connectionStatus, settings?.connectionError]
  );
}

export function usePkgxProducts() {
  const { data: settings } = usePkgxSettings();
  return useMemo(
    () => ({
      products: settings?.pkgxProducts ?? [],
      lastFetch: settings?.pkgxProductsLastFetch,
    }),
    [settings?.pkgxProducts, settings?.pkgxProductsLastFetch]
  );
}

export function usePkgxLogs() {
  const { data: settings } = usePkgxSettings();
  return useMemo(() => settings?.logs ?? [], [settings?.logs]);
}

// ========================================
// Mutation Hooks
// ========================================

/**
 * Read PkgxSettings from whichever cache is populated (full or mappings-only).
 * Mutations need this to read current state before applying changes.
 */
function getPkgxSettingsFromCache(queryClient: ReturnType<typeof useQueryClient>): PkgxSettings | undefined {
  return (queryClient.getQueryData(pkgxKeys.settings()) as PkgxSettings | undefined)
    ?? (queryClient.getQueryData(pkgxKeys.mappingsOnly()) as PkgxSettings | undefined);
}

/**
 * Generic mutation hook for updating any section of PKGX settings
 * Used for batch updates (e.g., price mapping) instead of per-field mutations
 */
export function usePkgxSectionMutation(section: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: unknown) => {
      // Use optimized endpoint for priceMapping - uses PkgxPriceMapping table directly
      if (section === 'priceMapping') {
        const res = await fetch('/api/pkgx/price-mappings', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error || 'Failed to update price mapping');
        return;
      }
      // Fallback to generic endpoint for other sections
      await updatePkgxSection(section, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pkgxKeys.settings() });
    },
  });
}

export function usePkgxConfigMutations(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const setApiUrl = useMutation({
    mutationFn: async (url: string) => {
      await updatePkgxSection('apiUrl', url);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pkgxKeys.settings() });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(`Failed to update API URL: ${error.message}`);
    },
  });

  const setApiKey = useMutation({
    mutationFn: async (key: string) => {
      await updatePkgxSection('apiKey', key);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pkgxKeys.settings() });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(`Failed to update API Key: ${error.message}`);
    },
  });

  const setEnabled = useMutation({
    mutationFn: async (enabled: boolean) => {
      await updatePkgxSection('enabled', enabled);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pkgxKeys.settings() });
      toast.success('Đã cập nhật trạng thái tích hợp');
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(`Cập nhật trạng thái thất bại: ${error.message}`);
    },
  });

  const setConnectionStatus = useMutation({
    mutationFn: async ({ status, error }: { status: 'connected' | 'disconnected' | 'error'; error?: string }) => {
      await updatePkgxSection('connectionStatus', status);
      if (error) {
        await updatePkgxSection('connectionError', error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pkgxKeys.settings() });
    },
  });

  const setDefaultBranchId = useMutation({
    mutationFn: async (branchId: string | undefined) => {
      await updatePkgxSection('defaultBranchId', branchId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pkgxKeys.settings() });
      toast.success('Đã cập nhật kho mặc định');
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(`Lỗi cập nhật kho: ${error.message}`);
    },
  });

  return { setApiUrl, setApiKey, setEnabled, setConnectionStatus, setDefaultBranchId };
}

export function usePkgxCategoryMutations(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const setCategories = useMutation({
    mutationFn: async (categories: PkgxCategory[]) => {
      await updatePkgxSection('categories', categories);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pkgxKeys.settings() });
      options?.onSuccess?.();
    },
  });

  const addCategory = useMutation({
    mutationFn: async (category: PkgxCategory) => {
      const settings = queryClient.getQueryData(pkgxKeys.settings()) as PkgxSettings;
      const categories = [...(settings?.categories ?? []), category];
      await updatePkgxSection('categories', categories);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pkgxKeys.settings() });
      toast.success('Đã thêm danh mục');
      options?.onSuccess?.();
    },
  });

  const updateCategory = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<PkgxCategory> }) => {
      const settings = queryClient.getQueryData(pkgxKeys.settings()) as PkgxSettings;
      const categories = settings?.categories?.map((cat) =>
        cat.id === id ? { ...cat, ...updates } : cat
      ) ?? [];
      await updatePkgxSection('categories', categories);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pkgxKeys.settings() });
      toast.success('Đã cập nhật danh mục');
      options?.onSuccess?.();
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: number) => {
      const settings = queryClient.getQueryData(pkgxKeys.settings()) as PkgxSettings;
      const categories = settings?.categories?.filter((cat) => cat.id !== id) ?? [];
      await updatePkgxSection('categories', categories);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pkgxKeys.settings() });
      toast.success('Đã xóa danh mục');
      options?.onSuccess?.();
    },
  });

  return { setCategories, addCategory, updateCategory, deleteCategory };
}

export function usePkgxBrandMutations(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const setBrands = useMutation({
    mutationFn: async (brands: PkgxBrand[]) => {
      await updatePkgxSection('brands', brands);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pkgxKeys.settings() });
      options?.onSuccess?.();
    },
  });

  const addBrand = useMutation({
    mutationFn: async (brand: PkgxBrand) => {
      const settings = getPkgxSettingsFromCache(queryClient);
      const brands = [...(settings?.brands ?? []), brand];
      await updatePkgxSection('brands', brands);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pkgxKeys.settings() });
      toast.success('Đã thêm thương hiệu');
      options?.onSuccess?.();
    },
  });

  const updateBrand = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<PkgxBrand> }) => {
      const settings = getPkgxSettingsFromCache(queryClient);
      const brands = settings?.brands?.map((brand) =>
        brand.id === id ? { ...brand, ...updates } : brand
      ) ?? [];
      await updatePkgxSection('brands', brands);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pkgxKeys.settings() });
      toast.success('Đã cập nhật thương hiệu');
      options?.onSuccess?.();
    },
  });

  const deleteBrand = useMutation({
    mutationFn: async (id: number) => {
      const settings = getPkgxSettingsFromCache(queryClient);
      const brands = settings?.brands?.filter((brand) => brand.id !== id) ?? [];
      await updatePkgxSection('brands', brands);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pkgxKeys.settings() });
      toast.success('Đã xóa thương hiệu');
      options?.onSuccess?.();
    },
  });

  return { setBrands, addBrand, updateBrand, deleteBrand };
}

export function usePkgxPriceMappingMutations(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const updatePriceMapping = useMutation({
    mutationFn: async ({ field, policyId }: { field: keyof PkgxPriceMapping; policyId: SystemId | null }) => {
      const settings = queryClient.getQueryData(pkgxKeys.settings()) as PkgxSettings;
      const priceMapping = { ...settings?.priceMapping, [field]: policyId };
      await updatePkgxSection('priceMapping', priceMapping);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pkgxKeys.settings() });
      toast.success('Đã cập nhật mapping giá');
      options?.onSuccess?.();
    },
  });

  return { updatePriceMapping };
}

export function usePkgxCategoryMappingMutations(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const addCategoryMapping = useMutation({
    mutationFn: async (mapping: PkgxCategoryMapping) => {
      const settings = getPkgxSettingsFromCache(queryClient);
      const mappings = [...(settings?.categoryMappings ?? []), mapping];
      await updatePkgxSection('categoryMappings', mappings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pkgxKeys.settings() });
      toast.success('Đã thêm mapping danh mục');
      options?.onSuccess?.();
    },
  });

  const updateCategoryMapping = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<PkgxCategoryMapping> }) => {
      const settings = getPkgxSettingsFromCache(queryClient);
      const mappings = settings?.categoryMappings?.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ) ?? [];
      await updatePkgxSection('categoryMappings', mappings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pkgxKeys.settings() });
      toast.success('Đã cập nhật mapping danh mục');
      options?.onSuccess?.();
    },
  });

  const deleteCategoryMapping = useMutation({
    mutationFn: async (id: string) => {
      await deleteCategoryMappingApi(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pkgxKeys.settings() });
      toast.success('Đã xóa mapping danh mục');
      options?.onSuccess?.();
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : 'Không xóa được mapping danh mục');
    },
  });

  /** Xoá nhiều mapping — DELETE Prisma (một PATCH JSON không đồng bộ với DB). */
  const deleteCategoryMappingsBulk = useMutation({
    mutationFn: async (ids: string[]) => {
      const list = ids.filter(Boolean);
      await Promise.all(list.map((id) => deleteCategoryMappingApi(id)));
    },
    onSuccess: (_data, ids) => {
      queryClient.invalidateQueries({ queryKey: pkgxKeys.settings() });
      toast.success(`Đã dọn ${ids.length} mapping lỗi`);
      options?.onSuccess?.();
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : 'Không xóa hết mapping lỗi');
    },
  });

  return { addCategoryMapping, updateCategoryMapping, deleteCategoryMapping, deleteCategoryMappingsBulk };
}

export function usePkgxBrandMappingMutations(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const addBrandMapping = useMutation({
    mutationFn: async (mapping: PkgxBrandMapping) => {
      const settings = getPkgxSettingsFromCache(queryClient);
      const mappings = [...(settings?.brandMappings ?? []), mapping];
      await updatePkgxSection('brandMappings', mappings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pkgxKeys.settings() });
      toast.success('Đã thêm mapping thương hiệu');
      options?.onSuccess?.();
    },
  });

  const updateBrandMapping = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<PkgxBrandMapping> }) => {
      const settings = getPkgxSettingsFromCache(queryClient);
      const mappings = settings?.brandMappings?.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ) ?? [];
      await updatePkgxSection('brandMappings', mappings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pkgxKeys.settings() });
      toast.success('Đã cập nhật mapping thương hiệu');
      options?.onSuccess?.();
    },
  });

  const deleteBrandMapping = useMutation({
    mutationFn: async (id: string) => {
      await deleteBrandMappingApi(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pkgxKeys.settings() });
      toast.success('Đã xóa mapping thương hiệu');
      options?.onSuccess?.();
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : 'Không xóa được mapping thương hiệu');
    },
  });

  /** Xoá nhiều mapping — DELETE Prisma (PATCH JSON trước đây không xóa DB nên UI vẫn còn orphan). */
  const deleteBrandMappingsBulk = useMutation({
    mutationFn: async (ids: string[]) => {
      const list = ids.filter(Boolean);
      await Promise.all(list.map((id) => deleteBrandMappingApi(id)));
    },
    onSuccess: (_data, ids) => {
      queryClient.invalidateQueries({ queryKey: pkgxKeys.settings() });
      toast.success(`Đã dọn ${ids.length} mapping lỗi`);
      options?.onSuccess?.();
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : 'Không xóa hết mapping lỗi');
    },
  });

  return { addBrandMapping, updateBrandMapping, deleteBrandMapping, deleteBrandMappingsBulk };
}

export function usePkgxSyncSettingsMutations(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const updateSyncSetting = useMutation({
    mutationFn: async ({ key, value }: { key: keyof PkgxSyncSettings; value: PkgxSyncSettings[keyof PkgxSyncSettings] }) => {
      const settings = queryClient.getQueryData(pkgxKeys.settings()) as PkgxSettings;
      const syncSettings = { ...settings?.syncSettings, [key]: value };
      await updatePkgxSection('syncSettings', syncSettings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pkgxKeys.settings() });
      options?.onSuccess?.();
    },
  });

  return { updateSyncSetting };
}

export function usePkgxSyncStatusMutations() {
  const queryClient = useQueryClient();

  const setLastSyncAt = useMutation({
    mutationFn: async (timestamp: string) => {
      await updatePkgxSection('lastSyncAt', timestamp);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pkgxKeys.settings() });
    },
  });

  const setLastSyncResult = useMutation({
    mutationFn: async (result: PkgxSyncResult) => {
      await updatePkgxSection('lastSyncResult', result);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pkgxKeys.settings() });
    },
  });

  return { setLastSyncAt, setLastSyncResult };
}

export function usePkgxLogMutations() {
  // No-op: logs riêng đã xóa, dùng activity log hệ thống thay thế
  const noop = useMutation<void, Error, unknown>({
    mutationFn: async () => {},
  });

  return { addLog: noop, clearLogs: noop };
}

export function usePkgxProductsMutations() {
  const queryClient = useQueryClient();

  const setPkgxProducts = useMutation({
    mutationFn: async (products: PkgxProduct[]) => {
      // Transform PkgxProduct[] to API format and save to database
      const apiProducts = products.map(p => ({
        id: p.goods_id,
        goodsSn: p.goods_sn, // SKU from PKGX API
        goodsNumber: p.goods_number,
        name: p.goods_name || `Product ${p.goods_id}`, // Fallback if name is missing
        catId: p.cat_id,
        catName: p.cat_name,
        brandId: p.brand_id,
        brandName: p.brand_name,
        shopPrice: p.shop_price ? parseFloat(String(p.shop_price)) : null,
        marketPrice: p.market_price ? parseFloat(String(p.market_price)) : null,
        partnerPrice: p.partner_price ? parseFloat(String(p.partner_price)) : null,
        acePrice: p.ace_price ? parseFloat(String(p.ace_price)) : null,
        dealPrice: p.deal_price ? parseFloat(String(p.deal_price)) : null,
        goodsNumber2: p.goods_number2,
        goodsWeight: p.goods_weight ? parseFloat(String(p.goods_weight)) : null,
        goodsQuantity: p.goods_quantity,
        warnNumber: p.warn_number,
        goodsThumb: p.goods_thumb,
        originalImg: p.original_img,
        goodsBrief: p.goods_brief,
        goodsDesc: p.goods_desc,
        isBest: p.is_best,
        isNew: p.is_new,
        isHot: p.is_hot,
        isHome: p.is_home,
        isOnsale: p.is_onsale,
        isReal: p.is_real,
        keywords: p.keywords,
        ktitle: p.ktitle,
        goodsAlias: p.goods_alias,
        vat: p.vat,
        lastUpdate: p.last_update,
      }));
      
      const res = await fetch('/api/settings/pkgx/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: apiProducts }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to sync products to database');
      return json;
    },
    onSuccess: (_data) => {
      queryClient.invalidateQueries({ queryKey: pkgxKeys.settings() });
      queryClient.invalidateQueries({ queryKey: ['pkgx', 'products'] });
    },
    onError: (error) => {
      logError('[setPkgxProducts] Error', error);
    },
  });

  const clearPkgxProducts = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/settings/pkgx/products', {
        method: 'DELETE',
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to clear products');
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pkgxKeys.settings() });
      queryClient.invalidateQueries({ queryKey: ['pkgx', 'products'] });
    },
  });

  return { setPkgxProducts, clearPkgxProducts };
}

// Hook to fetch products from database with server-side pagination
export function usePkgxProductsPaginated(options: {
  page: number;
  limit: number;
  search?: string;
  catId?: number;
  brandId?: number;
  mapped?: boolean | null;
}) {
  const { page, limit, search, catId, brandId, mapped } = options;
  
  return useQuery({
    queryKey: ['pkgx', 'products', 'paginated', page, limit, search, catId, brandId, mapped],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (search) params.set('search', search);
      if (catId) params.set('catId', String(catId));
      if (brandId) params.set('brandId', String(brandId));
      if (mapped !== null && mapped !== undefined) params.set('mapped', String(mapped));
      
      const res = await fetch(`/api/settings/pkgx/products?${params}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to fetch products');
      
      // Transform DB format back to PKGX API format for UI compatibility
      const products: PkgxProduct[] = (json.data || []).map((p: Record<string, unknown>) => ({
        goods_id: p.id as number,
        goods_sn: (p.goodsSn || p.goodsNumber || '') as string,
        goods_number: p.goodsNumber as string,
        goods_name: p.name as string,
        cat_id: p.catId as number,
        cat_name: p.catName as string,
        brand_id: p.brandId as number,
        brand_name: p.brandName as string,
        shop_price: p.shopPrice as string,
        market_price: p.marketPrice as string,
        partner_price: p.partnerPrice as string,
        ace_price: p.acePrice as string,
        deal_price: p.dealPrice as string,
        price_5vat: p.price5Vat as string,
        price_12novat: p.price12Novat as string,
        price_5novat: p.price5Novat as string,
        goods_number2: p.goodsNumber2 as string,
        goods_weight: p.goodsWeight as string,
        goods_quantity: p.goodsQuantity as number,
        warn_number: p.warnNumber as number,
        goods_thumb: p.goodsThumb as string,
        original_img: p.originalImg as string,
        goods_brief: p.goodsBrief as string,
        goods_desc: p.goodsDesc as string,
        is_best: p.isBest as number,
        is_new: p.isNew as number,
        is_hot: p.isHot as number,
        is_home: p.isHome as number,
        is_onsale: p.isOnsale as number,
        is_real: p.isReal as number,
        keywords: p.keywords as string,
        ktitle: p.ktitle as string,
        meta_title: p.ktitle as string,
        goods_alias: p.goodsAlias as string,
        vat: p.vat as string,
        add_time: ((p.addTime as number) || (p.syncedAt ? Math.floor(new Date(p.syncedAt as string).getTime() / 1000) : 0)) as number,
        last_update: ((p.lastUpdate as number) || (p.syncedAt ? Math.floor(new Date(p.syncedAt as string).getTime() / 1000) : 0)) as number,
        synced_at: p.syncedAt ? Math.floor(new Date(p.syncedAt as string).getTime() / 1000) : 0,
      }));
      
      return { 
        products, 
        total: json.total as number,
        page: json.page as number,
        limit: json.limit as number,
        totalPages: json.totalPages as number,
      };
    },
    staleTime: 0, // Always refetch when params change
  });
}

// Hook to fetch ALL products from database (for mapping lookup and import)
// Only use when you need full list - prefer paginated version for display
// Pass enabled: false to lazy-load (use queryClient.ensureQueryData for on-demand)
export const pkgxProductsCacheQueryKey = ['pkgx', 'products', 'all'] as const;

export async function fetchAllPkgxProductsCache() {
  const res = await fetch('/api/settings/pkgx/products?limit=0');
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to fetch products');
  // Transform DB format back to PKGX API format for UI compatibility
  const products: PkgxProduct[] = (json.data || []).map((p: Record<string, unknown>) => ({
    goods_id: p.id as number,
    goods_sn: (p.goodsSn || p.goodsNumber || '') as string,
    goods_number: p.goodsNumber as string,
    goods_name: p.name as string,
    cat_id: p.catId as number,
    cat_name: p.catName as string,
    brand_id: p.brandId as number,
    brand_name: p.brandName as string,
    shop_price: p.shopPrice as string,
    market_price: p.marketPrice as string,
    partner_price: p.partnerPrice as string,
    ace_price: p.acePrice as string,
    deal_price: p.dealPrice as string,
    price_5vat: p.price5Vat as string,
    price_12novat: p.price12Novat as string,
    price_5novat: p.price5Novat as string,
    goods_number2: p.goodsNumber2 as string,
    goods_weight: p.goodsWeight as string,
    goods_quantity: p.goodsQuantity as number,
    warn_number: p.warnNumber as number,
    goods_thumb: p.goodsThumb as string,
    original_img: p.originalImg as string,
    goods_brief: p.goodsBrief as string,
    goods_desc: p.goodsDesc as string,
    is_best: p.isBest as number,
    is_new: p.isNew as number,
    is_hot: p.isHot as number,
    is_home: p.isHome as number,
    is_onsale: p.isOnsale as number,
    is_real: p.isReal as number,
    keywords: p.keywords as string,
    ktitle: p.ktitle as string,
    meta_title: p.ktitle as string,
    goods_alias: p.goodsAlias as string,
    vat: p.vat as string,
    add_time: ((p.addTime as number) || (p.syncedAt ? Math.floor(new Date(p.syncedAt as string).getTime() / 1000) : 0)) as number,
    last_update: ((p.lastUpdate as number) || (p.syncedAt ? Math.floor(new Date(p.syncedAt as string).getTime() / 1000) : 0)) as number,
    synced_at: p.syncedAt ? Math.floor(new Date(p.syncedAt as string).getTime() / 1000) : 0,
  }));
  return { 
    products, 
    lastFetch: null, 
    count: json.total || products.length,
  };
}

export function usePkgxProductsCache(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: pkgxProductsCacheQueryKey,
    queryFn: fetchAllPkgxProductsCache,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: options?.enabled ?? true,
  });
}

// ========================================
// Helper Hooks
// ========================================

export function usePkgxGetters() {
  const { data: settings } = usePkgxSettings();

  const getCategoryById = useCallback(
    (id: number) => settings?.categories?.find((cat) => cat.id === id),
    [settings?.categories]
  );

  const getBrandById = useCallback(
    (id: number) => settings?.brands?.find((brand) => brand.id === id),
    [settings?.brands]
  );

  const getCategoryMappingByHrmId = useCallback(
    (hrmCategoryId: SystemId) =>
      settings?.categoryMappings?.find((m) => m.hrmCategorySystemId === hrmCategoryId),
    [settings?.categoryMappings]
  );

  const getBrandMappingByHrmId = useCallback(
    (hrmBrandId: SystemId) =>
      settings?.brandMappings?.find((m) => m.hrmBrandSystemId === hrmBrandId),
    [settings?.brandMappings]
  );

  const getPkgxCatIdByHrmCategory = useCallback(
    (hrmCategoryId: string) => {
      const mapping = getCategoryMappingByHrmId(hrmCategoryId as SystemId);
      return mapping?.pkgxCatId ?? null;
    },
    [getCategoryMappingByHrmId]
  );

  const getPkgxBrandIdByHrmBrand = useCallback(
    (hrmBrandId: string) => {
      const mapping = getBrandMappingByHrmId(hrmBrandId as SystemId);
      return mapping?.pkgxBrandId ?? null;
    },
    [getBrandMappingByHrmId]
  );

  // Reverse lookups: by PKGX ID
  const getCategoryMappingByPkgxId = useCallback(
    (pkgxCatId: number) =>
      settings?.categoryMappings?.find((m) => m.pkgxCategoryId === pkgxCatId),
    [settings?.categoryMappings]
  );

  const getBrandMappingByPkgxId = useCallback(
    (pkgxBrandId: number) =>
      settings?.brandMappings?.find((m) => m.pkgxBrandId === pkgxBrandId),
    [settings?.brandMappings]
  );

  return {
    getCategoryById,
    getBrandById,
    getCategoryMappingByHrmId,
    getBrandMappingByHrmId,
    getPkgxCatIdByHrmCategory,
    getPkgxBrandIdByHrmBrand,
    getCategoryMappingByPkgxId,
    getBrandMappingByPkgxId,
  };
}
