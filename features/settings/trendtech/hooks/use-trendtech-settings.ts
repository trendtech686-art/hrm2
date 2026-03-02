/**
 * Trendtech Settings Hooks
 * React Query hooks for managing Trendtech integration settings
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import type { 
  TrendtechSettings, 
  TrendtechCategory, 
  TrendtechBrand,
  TrendtechCategoryMapping,
  TrendtechBrandMapping,
  TrendtechPriceMapping,
  TrendtechSyncSettings,
  TrendtechSyncResult,
  TrendtechSyncLog,
  TrendtechProduct,
} from '@/lib/trendtech/types';
import { generateSubEntityId } from '@/lib/id-utils';
import type { SystemId } from '@/lib/id-types';
import { DEFAULT_TRENDTECH_SETTINGS } from '@/lib/trendtech/types';

// ========================================
// Query Keys
// ========================================

export const trendtechKeys = {
  all: ['trendtech'] as const,
  settings: () => [...trendtechKeys.all, 'settings'] as const,
  section: (section: string) => [...trendtechKeys.settings(), section] as const,
};

// ========================================
// API Functions
// ========================================

async function fetchTrendtechSettings(): Promise<TrendtechSettings> {
  const res = await fetch('/api/trendtech/settings');
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to fetch settings');
  return { ...DEFAULT_TRENDTECH_SETTINGS, ...json.data };
}

async function updateTrendtechSection(section: string, data: unknown): Promise<void> {
  const res = await fetch('/api/trendtech/settings', {
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

export function useTrendtechSettings() {
  return useQuery({
    queryKey: trendtechKeys.settings(),
    queryFn: fetchTrendtechSettings,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// ========================================
// Selector Hooks (Optimized)
// ========================================

export function useTrendtechEnabled() {
  const { data: settings } = useTrendtechSettings();
  return useMemo(() => settings?.enabled ?? false, [settings?.enabled]);
}

export function useTrendtechApiConfig() {
  const { data: settings } = useTrendtechSettings();
  return useMemo(
    () => ({
      apiUrl: settings?.apiUrl ?? '',
      apiKey: settings?.apiKey ?? '',
      enabled: settings?.enabled ?? false,
    }),
    [settings?.apiUrl, settings?.apiKey, settings?.enabled]
  );
}

export function useTrendtechCategories() {
  const { data: settings } = useTrendtechSettings();
  return useMemo(() => settings?.categories ?? [], [settings?.categories]);
}

export function useTrendtechBrands() {
  const { data: settings } = useTrendtechSettings();
  return useMemo(() => settings?.brands ?? [], [settings?.brands]);
}

export function useTrendtechPriceMapping() {
  const { data: settings } = useTrendtechSettings();
  return useMemo(() => settings?.priceMapping ?? { price: null, compareAtPrice: null }, [settings?.priceMapping]);
}

export function useTrendtechCategoryMappings() {
  const { data: settings } = useTrendtechSettings();
  return useMemo(() => settings?.categoryMappings ?? [], [settings?.categoryMappings]);
}

export function useTrendtechBrandMappings() {
  const { data: settings } = useTrendtechSettings();
  return useMemo(() => settings?.brandMappings ?? [], [settings?.brandMappings]);
}

export function useTrendtechSyncSettings() {
  const { data: settings } = useTrendtechSettings();
  return useMemo(
    () => settings?.syncSettings ?? { autoSync: false, syncInterval: 60, syncOnSave: true },
    [settings?.syncSettings]
  );
}

export function useTrendtechSyncStatus() {
  const { data: settings } = useTrendtechSettings();
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

export function useTrendtechProducts() {
  const { data: settings } = useTrendtechSettings();
  return useMemo(
    () => ({
      products: settings?.trendtechProducts ?? [],
      lastFetch: settings?.trendtechProductsLastFetch,
    }),
    [settings?.trendtechProducts, settings?.trendtechProductsLastFetch]
  );
}

export function useTrendtechLogs() {
  const { data: settings } = useTrendtechSettings();
  return useMemo(() => settings?.logs ?? [], [settings?.logs]);
}

// ========================================
// Mutation Hooks
// ========================================

export function useTrendtechConfigMutations(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const setApiUrl = useMutation({
    mutationFn: async (url: string) => {
      await updateTrendtechSection('apiUrl', url);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trendtechKeys.settings() });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(`Failed to update API URL: ${error.message}`);
    },
  });

  const setApiKey = useMutation({
    mutationFn: async (key: string) => {
      await updateTrendtechSection('apiKey', key);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trendtechKeys.settings() });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(`Failed to update API Key: ${error.message}`);
    },
  });

  const setEnabled = useMutation({
    mutationFn: async (enabled: boolean) => {
      await updateTrendtechSection('enabled', enabled);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trendtechKeys.settings() });
      toast.success('Integration status updated');
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(`Failed to update status: ${error.message}`);
    },
  });

  const setConnectionStatus = useMutation({
    mutationFn: async ({ status, error }: { status: 'connected' | 'disconnected' | 'error'; error?: string }) => {
      await updateTrendtechSection('connectionStatus', status);
      if (error) {
        await updateTrendtechSection('connectionError', error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trendtechKeys.settings() });
    },
  });

  return { setApiUrl, setApiKey, setEnabled, setConnectionStatus };
}

export function useTrendtechCategoryMutations(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const setCategories = useMutation({
    mutationFn: async (categories: TrendtechCategory[]) => {
      await updateTrendtechSection('categories', categories);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trendtechKeys.settings() });
      options?.onSuccess?.();
    },
  });

  const addCategory = useMutation({
    mutationFn: async (category: TrendtechCategory) => {
      const { data: settings } = queryClient.getQueryData(trendtechKeys.settings()) as { data: TrendtechSettings };
      const categories = [...(settings?.categories ?? []), category];
      await updateTrendtechSection('categories', categories);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trendtechKeys.settings() });
      toast.success('Category added');
      options?.onSuccess?.();
    },
  });

  const updateCategory = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<TrendtechCategory> }) => {
      const { data: settings } = queryClient.getQueryData(trendtechKeys.settings()) as { data: TrendtechSettings };
      const categories = settings?.categories?.map((cat) =>
        cat.id === id ? { ...cat, ...updates } : cat
      ) ?? [];
      await updateTrendtechSection('categories', categories);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trendtechKeys.settings() });
      toast.success('Category updated');
      options?.onSuccess?.();
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: number) => {
      const { data: settings } = queryClient.getQueryData(trendtechKeys.settings()) as { data: TrendtechSettings };
      const categories = settings?.categories?.filter((cat) => cat.id !== id) ?? [];
      await updateTrendtechSection('categories', categories);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trendtechKeys.settings() });
      toast.success('Category deleted');
      options?.onSuccess?.();
    },
  });

  return { setCategories, addCategory, updateCategory, deleteCategory };
}

export function useTrendtechBrandMutations(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const setBrands = useMutation({
    mutationFn: async (brands: TrendtechBrand[]) => {
      await updateTrendtechSection('brands', brands);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trendtechKeys.settings() });
      options?.onSuccess?.();
    },
  });

  const addBrand = useMutation({
    mutationFn: async (brand: TrendtechBrand) => {
      const { data: settings } = queryClient.getQueryData(trendtechKeys.settings()) as { data: TrendtechSettings };
      const brands = [...(settings?.brands ?? []), brand];
      await updateTrendtechSection('brands', brands);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trendtechKeys.settings() });
      toast.success('Brand added');
      options?.onSuccess?.();
    },
  });

  const updateBrand = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<TrendtechBrand> }) => {
      const { data: settings } = queryClient.getQueryData(trendtechKeys.settings()) as { data: TrendtechSettings };
      const brands = settings?.brands?.map((brand) =>
        brand.id === id ? { ...brand, ...updates } : brand
      ) ?? [];
      await updateTrendtechSection('brands', brands);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trendtechKeys.settings() });
      toast.success('Brand updated');
      options?.onSuccess?.();
    },
  });

  const deleteBrand = useMutation({
    mutationFn: async (id: number) => {
      const { data: settings } = queryClient.getQueryData(trendtechKeys.settings()) as { data: TrendtechSettings };
      const brands = settings?.brands?.filter((brand) => brand.id !== id) ?? [];
      await updateTrendtechSection('brands', brands);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trendtechKeys.settings() });
      toast.success('Brand deleted');
      options?.onSuccess?.();
    },
  });

  return { setBrands, addBrand, updateBrand, deleteBrand };
}

export function useTrendtechPriceMappingMutations(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const updatePriceMapping = useMutation({
    mutationFn: async ({ field, policyId }: { field: keyof TrendtechPriceMapping; policyId: SystemId | null }) => {
      const { data: settings } = queryClient.getQueryData(trendtechKeys.settings()) as { data: TrendtechSettings };
      const priceMapping = { ...settings?.priceMapping, [field]: policyId };
      await updateTrendtechSection('priceMapping', priceMapping);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trendtechKeys.settings() });
      toast.success('Price mapping updated');
      options?.onSuccess?.();
    },
  });

  return { updatePriceMapping };
}

export function useTrendtechCategoryMappingMutations(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const addCategoryMapping = useMutation({
    mutationFn: async (mapping: TrendtechCategoryMapping) => {
      const { data: settings } = queryClient.getQueryData(trendtechKeys.settings()) as { data: TrendtechSettings };
      const mappings = [...(settings?.categoryMappings ?? []), mapping];
      await updateTrendtechSection('categoryMappings', mappings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trendtechKeys.settings() });
      toast.success('Mapping added');
      options?.onSuccess?.();
    },
  });

  const updateCategoryMapping = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<TrendtechCategoryMapping> }) => {
      const { data: settings } = queryClient.getQueryData(trendtechKeys.settings()) as { data: TrendtechSettings };
      const mappings = settings?.categoryMappings?.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ) ?? [];
      await updateTrendtechSection('categoryMappings', mappings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trendtechKeys.settings() });
      toast.success('Mapping updated');
      options?.onSuccess?.();
    },
  });

  const deleteCategoryMapping = useMutation({
    mutationFn: async (id: string) => {
      const { data: settings } = queryClient.getQueryData(trendtechKeys.settings()) as { data: TrendtechSettings };
      const mappings = settings?.categoryMappings?.filter((m) => m.id !== id) ?? [];
      await updateTrendtechSection('categoryMappings', mappings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trendtechKeys.settings() });
      toast.success('Mapping deleted');
      options?.onSuccess?.();
    },
  });

  return { addCategoryMapping, updateCategoryMapping, deleteCategoryMapping };
}

export function useTrendtechBrandMappingMutations(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const addBrandMapping = useMutation({
    mutationFn: async (mapping: TrendtechBrandMapping) => {
      const { data: settings } = queryClient.getQueryData(trendtechKeys.settings()) as { data: TrendtechSettings };
      const mappings = [...(settings?.brandMappings ?? []), mapping];
      await updateTrendtechSection('brandMappings', mappings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trendtechKeys.settings() });
      toast.success('Mapping added');
      options?.onSuccess?.();
    },
  });

  const updateBrandMapping = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<TrendtechBrandMapping> }) => {
      const { data: settings } = queryClient.getQueryData(trendtechKeys.settings()) as { data: TrendtechSettings };
      const mappings = settings?.brandMappings?.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ) ?? [];
      await updateTrendtechSection('brandMappings', mappings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trendtechKeys.settings() });
      toast.success('Mapping updated');
      options?.onSuccess?.();
    },
  });

  const deleteBrandMapping = useMutation({
    mutationFn: async (id: string) => {
      const { data: settings } = queryClient.getQueryData(trendtechKeys.settings()) as { data: TrendtechSettings };
      const mappings = settings?.brandMappings?.filter((m) => m.id !== id) ?? [];
      await updateTrendtechSection('brandMappings', mappings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trendtechKeys.settings() });
      toast.success('Mapping deleted');
      options?.onSuccess?.();
    },
  });

  return { addBrandMapping, updateBrandMapping, deleteBrandMapping };
}

export function useTrendtechSyncSettingsMutations(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const updateSyncSetting = useMutation({
    mutationFn: async ({ key, value }: { key: keyof TrendtechSyncSettings; value: TrendtechSyncSettings[keyof TrendtechSyncSettings] }) => {
      const { data: settings } = queryClient.getQueryData(trendtechKeys.settings()) as { data: TrendtechSettings };
      const syncSettings = { ...settings?.syncSettings, [key]: value };
      await updateTrendtechSection('syncSettings', syncSettings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trendtechKeys.settings() });
      options?.onSuccess?.();
    },
  });

  return { updateSyncSetting };
}

export function useTrendtechSyncStatusMutations() {
  const queryClient = useQueryClient();

  const setLastSyncAt = useMutation({
    mutationFn: async (timestamp: string) => {
      await updateTrendtechSection('lastSyncAt', timestamp);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trendtechKeys.settings() });
    },
  });

  const setLastSyncResult = useMutation({
    mutationFn: async (result: TrendtechSyncResult) => {
      await updateTrendtechSection('lastSyncResult', result);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trendtechKeys.settings() });
    },
  });

  return { setLastSyncAt, setLastSyncResult };
}

export function useTrendtechLogMutations() {
  const queryClient = useQueryClient();

  const addLog = useMutation({
    mutationFn: async (log: Omit<TrendtechSyncLog, 'id' | 'timestamp'>) => {
      const { data: settings } = queryClient.getQueryData(trendtechKeys.settings()) as { data: TrendtechSettings };
      const newLog: TrendtechSyncLog = {
        ...log,
        id: generateSubEntityId('ID'),
        timestamp: new Date().toISOString(),
      };
      const logs = [...(settings?.logs ?? []), newLog];
      await updateTrendtechSection('logs', logs);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trendtechKeys.settings() });
    },
  });

  const clearLogs = useMutation({
    mutationFn: async () => {
      await updateTrendtechSection('logs', []);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trendtechKeys.settings() });
      toast.success('Logs cleared');
    },
  });

  return { addLog, clearLogs };
}

export function useTrendtechProductsMutations() {
  const queryClient = useQueryClient();

  const setTrendtechProducts = useMutation({
    mutationFn: async (products: TrendtechProduct[]) => {
      await updateTrendtechSection('trendtechProducts', products);
      await updateTrendtechSection('trendtechProductsLastFetch', new Date().toISOString());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trendtechKeys.settings() });
    },
  });

  const clearTrendtechProducts = useMutation({
    mutationFn: async () => {
      await updateTrendtechSection('trendtechProducts', []);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trendtechKeys.settings() });
    },
  });

  return { setTrendtechProducts, clearTrendtechProducts };
}

// ========================================
// Helper Hooks
// ========================================

export function useTrendtechGetters() {
  const { data: settings } = useTrendtechSettings();

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

  const getTrendtechCatIdByHrmCategory = useCallback(
    (hrmCategoryId: SystemId) => {
      const mapping = getCategoryMappingByHrmId(hrmCategoryId);
      return mapping?.trendtechCatId ?? null;
    },
    [getCategoryMappingByHrmId]
  );

  const getTrendtechBrandIdByHrmBrand = useCallback(
    (hrmBrandId: SystemId) => {
      const mapping = getBrandMappingByHrmId(hrmBrandId);
      return mapping?.trendtechBrandId ?? null;
    },
    [getBrandMappingByHrmId]
  );

  return {
    getCategoryById,
    getBrandById,
    getCategoryMappingByHrmId,
    getBrandMappingByHrmId,
    getTrendtechCatIdByHrmCategory,
    getTrendtechBrandIdByHrmBrand,
  };
}
