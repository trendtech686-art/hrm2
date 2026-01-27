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
  PkgxSyncLog,
  PkgxProduct,
} from '../types';
import type { SystemId } from '@/lib/id-types';
import { createInitialSettings } from '../store/config-slice';

// ========================================
// Query Keys
// ========================================

export const pkgxKeys = {
  all: ['pkgx'] as const,
  settings: () => [...pkgxKeys.all, 'settings'] as const,
  section: (section: string) => [...pkgxKeys.settings(), section] as const,
};

// ========================================
// API Functions
// ========================================

async function fetchPkgxSettings(): Promise<PkgxSettings> {
  const res = await fetch('/api/pkgx/settings');
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to fetch settings');
  return { ...createInitialSettings(), ...json.data };
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
    queryFn: fetchPkgxSettings,
    staleTime: 1000 * 60 * 5, // 5 minutes
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
  const { data: settings } = usePkgxSettings();
  return useMemo(() => settings?.categoryMappings ?? [], [settings?.categoryMappings]);
}

export function usePkgxBrandMappings() {
  const { data: settings } = usePkgxSettings();
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
      toast.success('Integration status updated');
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(`Failed to update status: ${error.message}`);
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

  return { setApiUrl, setApiKey, setEnabled, setConnectionStatus };
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
      toast.success('Category added');
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
      toast.success('Category updated');
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
      toast.success('Category deleted');
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
      const settings = queryClient.getQueryData(pkgxKeys.settings()) as PkgxSettings;
      const brands = [...(settings?.brands ?? []), brand];
      await updatePkgxSection('brands', brands);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pkgxKeys.settings() });
      toast.success('Brand added');
      options?.onSuccess?.();
    },
  });

  const updateBrand = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<PkgxBrand> }) => {
      const settings = queryClient.getQueryData(pkgxKeys.settings()) as PkgxSettings;
      const brands = settings?.brands?.map((brand) =>
        brand.id === id ? { ...brand, ...updates } : brand
      ) ?? [];
      await updatePkgxSection('brands', brands);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pkgxKeys.settings() });
      toast.success('Brand updated');
      options?.onSuccess?.();
    },
  });

  const deleteBrand = useMutation({
    mutationFn: async (id: number) => {
      const settings = queryClient.getQueryData(pkgxKeys.settings()) as PkgxSettings;
      const brands = settings?.brands?.filter((brand) => brand.id !== id) ?? [];
      await updatePkgxSection('brands', brands);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pkgxKeys.settings() });
      toast.success('Brand deleted');
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
      toast.success('Price mapping updated');
      options?.onSuccess?.();
    },
  });

  return { updatePriceMapping };
}

export function usePkgxCategoryMappingMutations(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const addCategoryMapping = useMutation({
    mutationFn: async (mapping: PkgxCategoryMapping) => {
      const settings = queryClient.getQueryData(pkgxKeys.settings()) as PkgxSettings;
      const mappings = [...(settings?.categoryMappings ?? []), mapping];
      await updatePkgxSection('categoryMappings', mappings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pkgxKeys.settings() });
      toast.success('Mapping added');
      options?.onSuccess?.();
    },
  });

  const updateCategoryMapping = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<PkgxCategoryMapping> }) => {
      const settings = queryClient.getQueryData(pkgxKeys.settings()) as PkgxSettings;
      const mappings = settings?.categoryMappings?.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ) ?? [];
      await updatePkgxSection('categoryMappings', mappings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pkgxKeys.settings() });
      toast.success('Mapping updated');
      options?.onSuccess?.();
    },
  });

  const deleteCategoryMapping = useMutation({
    mutationFn: async (id: string) => {
      const settings = queryClient.getQueryData(pkgxKeys.settings()) as PkgxSettings;
      const mappings = settings?.categoryMappings?.filter((m) => m.id !== id) ?? [];
      await updatePkgxSection('categoryMappings', mappings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pkgxKeys.settings() });
      toast.success('Mapping deleted');
      options?.onSuccess?.();
    },
  });

  return { addCategoryMapping, updateCategoryMapping, deleteCategoryMapping };
}

export function usePkgxBrandMappingMutations(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const addBrandMapping = useMutation({
    mutationFn: async (mapping: PkgxBrandMapping) => {
      const settings = queryClient.getQueryData(pkgxKeys.settings()) as PkgxSettings;
      const mappings = [...(settings?.brandMappings ?? []), mapping];
      await updatePkgxSection('brandMappings', mappings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pkgxKeys.settings() });
      toast.success('Mapping added');
      options?.onSuccess?.();
    },
  });

  const updateBrandMapping = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<PkgxBrandMapping> }) => {
      const settings = queryClient.getQueryData(pkgxKeys.settings()) as PkgxSettings;
      const mappings = settings?.brandMappings?.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ) ?? [];
      await updatePkgxSection('brandMappings', mappings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pkgxKeys.settings() });
      toast.success('Mapping updated');
      options?.onSuccess?.();
    },
  });

  const deleteBrandMapping = useMutation({
    mutationFn: async (id: string) => {
      const settings = queryClient.getQueryData(pkgxKeys.settings()) as PkgxSettings;
      const mappings = settings?.brandMappings?.filter((m) => m.id !== id) ?? [];
      await updatePkgxSection('brandMappings', mappings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pkgxKeys.settings() });
      toast.success('Mapping deleted');
      options?.onSuccess?.();
    },
  });

  return { addBrandMapping, updateBrandMapping, deleteBrandMapping };
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
  const queryClient = useQueryClient();

  const addLog = useMutation({
    mutationFn: async (log: Omit<PkgxSyncLog, 'id' | 'timestamp'>) => {
      const settings = queryClient.getQueryData(pkgxKeys.settings()) as PkgxSettings;
      const newLog: PkgxSyncLog = {
        ...log,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };
      const logs = [...(settings?.logs ?? []), newLog];
      await updatePkgxSection('logs', logs);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pkgxKeys.settings() });
    },
  });

  const clearLogs = useMutation({
    mutationFn: async () => {
      await updatePkgxSection('logs', []);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pkgxKeys.settings() });
      toast.success('Logs cleared');
    },
  });

  return { addLog, clearLogs };
}

export function usePkgxProductsMutations() {
  const queryClient = useQueryClient();

  const setPkgxProducts = useMutation({
    mutationFn: async (products: PkgxProduct[]) => {
      await updatePkgxSection('pkgxProducts', products);
      await updatePkgxSection('pkgxProductsLastFetch', new Date().toISOString());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pkgxKeys.settings() });
    },
  });

  const clearPkgxProducts = useMutation({
    mutationFn: async () => {
      await updatePkgxSection('pkgxProducts', []);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pkgxKeys.settings() });
    },
  });

  return { setPkgxProducts, clearPkgxProducts };
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
    (hrmCategoryId: SystemId) => {
      const mapping = getCategoryMappingByHrmId(hrmCategoryId);
      return mapping?.pkgxCatId ?? null;
    },
    [getCategoryMappingByHrmId]
  );

  const getPkgxBrandIdByHrmBrand = useCallback(
    (hrmBrandId: SystemId) => {
      const mapping = getBrandMappingByHrmId(hrmBrandId);
      return mapping?.pkgxBrandId ?? null;
    },
    [getBrandMappingByHrmId]
  );

  return {
    getCategoryById,
    getBrandById,
    getCategoryMappingByHrmId,
    getBrandMappingByHrmId,
    getPkgxCatIdByHrmCategory,
    getPkgxBrandIdByHrmBrand,
  };
}
