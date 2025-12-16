import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { SystemId } from '@/lib/id-types';
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
} from '../../../lib/trendtech/types';
import { DEFAULT_TRENDTECH_SETTINGS } from '../../../lib/trendtech/types';
import { getCategories as fetchTrendtechCategories, getBrands as fetchTrendtechBrands } from '../../../lib/trendtech/api-service';

// ========================================
// Store Interface
// ========================================

interface TrendtechSettingsStore {
  // === State ===
  settings: TrendtechSettings;
  isLoading: boolean;
  isSaving: boolean;
  
  // === General Config Actions ===
  setApiUrl: (url: string) => void;
  setApiKey: (key: string) => void;
  setEnabled: (enabled: boolean) => void;
  
  // === Reference Data Actions ===
  setCategories: (categories: TrendtechCategory[]) => void;
  addCategory: (category: TrendtechCategory) => void;
  updateCategory: (id: number, updates: Partial<TrendtechCategory>) => void;
  deleteCategory: (id: number) => void;
  
  setBrands: (brands: TrendtechBrand[]) => void;
  addBrand: (brand: TrendtechBrand) => void;
  updateBrand: (id: number, updates: Partial<TrendtechBrand>) => void;
  deleteBrand: (id: number) => void;
  
  // === Mapping Actions ===
  setPriceMapping: (mapping: TrendtechPriceMapping) => void;
  updatePriceMapping: (field: keyof TrendtechPriceMapping, policyId: SystemId | null) => void;
  
  setCategoryMappings: (mappings: TrendtechCategoryMapping[]) => void;
  addCategoryMapping: (mapping: TrendtechCategoryMapping) => void;
  updateCategoryMapping: (id: string, updates: Partial<TrendtechCategoryMapping>) => void;
  deleteCategoryMapping: (id: string) => void;
  
  setBrandMappings: (mappings: TrendtechBrandMapping[]) => void;
  addBrandMapping: (mapping: TrendtechBrandMapping) => void;
  updateBrandMapping: (id: string, updates: Partial<TrendtechBrandMapping>) => void;
  deleteBrandMapping: (id: string) => void;
  
  // === Sync Settings Actions ===
  setSyncSettings: (settings: TrendtechSyncSettings) => void;
  updateSyncSetting: <K extends keyof TrendtechSyncSettings>(key: K, value: TrendtechSyncSettings[K]) => void;
  
  // === Log Actions ===
  addLog: (log: Omit<TrendtechSyncLog, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
  
  // === Sync Actions ===
  syncCategoriesFromTrendtech: () => Promise<void>;
  syncBrandsFromTrendtech: () => Promise<void>;
  
  // === Trendtech Products Cache Actions ===
  setTrendtechProducts: (products: TrendtechProduct[]) => void;
  clearTrendtechProducts: () => void;
  
  // === Status Actions ===
  setLastSyncAt: (timestamp: string) => void;
  setLastSyncResult: (result: TrendtechSyncResult) => void;
  setConnectionStatus: (status: 'connected' | 'disconnected' | 'error', error?: string) => void;
  
  // === Utility Actions ===
  resetSettings: () => void;
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  
  // === Getters ===
  getCategoryById: (id: number) => TrendtechCategory | undefined;
  getBrandById: (id: number) => TrendtechBrand | undefined;
  getCategoryMappingByHrmId: (hrmCategoryId: SystemId) => TrendtechCategoryMapping | undefined;
  getBrandMappingByHrmId: (hrmBrandId: SystemId) => TrendtechBrandMapping | undefined;
  getTrendtechCatIdByHrmCategory: (hrmCategoryId: SystemId) => number | null;
  getTrendtechBrandIdByHrmBrand: (hrmBrandId: SystemId) => number | null;
}

// ========================================
// Store Implementation
// ========================================

export const useTrendtechSettingsStore = create<TrendtechSettingsStore>()(
  persist(
    (set, get) => ({
      // === Initial State ===
      settings: DEFAULT_TRENDTECH_SETTINGS,
      isLoading: false,
      isSaving: false,
      
      // === General Config Actions ===
      setApiUrl: (url) =>
        set((state) => ({
          settings: { ...state.settings, apiUrl: url },
        })),
        
      setApiKey: (key) =>
        set((state) => ({
          settings: { ...state.settings, apiKey: key },
        })),
        
      setEnabled: (enabled) =>
        set((state) => ({
          settings: { ...state.settings, enabled },
        })),
      
      // === Reference Data Actions ===
      setCategories: (categories) =>
        set((state) => ({
          settings: { ...state.settings, categories },
        })),
        
      addCategory: (category) =>
        set((state) => ({
          settings: {
            ...state.settings,
            categories: [...state.settings.categories, category],
          },
        })),
        
      updateCategory: (id, updates) =>
        set((state) => ({
          settings: {
            ...state.settings,
            categories: state.settings.categories.map((c) =>
              c.id === id ? { ...c, ...updates } : c
            ),
          },
        })),
        
      deleteCategory: (id) =>
        set((state) => ({
          settings: {
            ...state.settings,
            categories: state.settings.categories.filter((c) => c.id !== id),
            categoryMappings: state.settings.categoryMappings.filter(
              (m) => m.trendtechCatId !== id
            ),
          },
        })),
      
      setBrands: (brands) =>
        set((state) => ({
          settings: { ...state.settings, brands },
        })),
        
      addBrand: (brand) =>
        set((state) => ({
          settings: {
            ...state.settings,
            brands: [...state.settings.brands, brand],
          },
        })),
        
      updateBrand: (id, updates) =>
        set((state) => ({
          settings: {
            ...state.settings,
            brands: state.settings.brands.map((b) =>
              b.id === id ? { ...b, ...updates } : b
            ),
          },
        })),
        
      deleteBrand: (id) =>
        set((state) => ({
          settings: {
            ...state.settings,
            brands: state.settings.brands.filter((b) => b.id !== id),
            brandMappings: state.settings.brandMappings.filter(
              (m) => m.trendtechBrandId !== id
            ),
          },
        })),
      
      // === Mapping Actions ===
      setPriceMapping: (mapping) =>
        set((state) => ({
          settings: { ...state.settings, priceMapping: mapping },
        })),
        
      updatePriceMapping: (field, policyId) =>
        set((state) => ({
          settings: {
            ...state.settings,
            priceMapping: {
              ...state.settings.priceMapping,
              [field]: policyId,
            },
          },
        })),
      
      setCategoryMappings: (mappings) =>
        set((state) => ({
          settings: { ...state.settings, categoryMappings: mappings },
        })),
        
      addCategoryMapping: (mapping) =>
        set((state) => ({
          settings: {
            ...state.settings,
            categoryMappings: [...state.settings.categoryMappings, mapping],
          },
        })),
        
      updateCategoryMapping: (id, updates) =>
        set((state) => ({
          settings: {
            ...state.settings,
            categoryMappings: state.settings.categoryMappings.map((m) =>
              m.id === id ? { ...m, ...updates } : m
            ),
          },
        })),
        
      deleteCategoryMapping: (id) =>
        set((state) => ({
          settings: {
            ...state.settings,
            categoryMappings: state.settings.categoryMappings.filter(
              (m) => m.id !== id
            ),
          },
        })),
      
      setBrandMappings: (mappings) =>
        set((state) => ({
          settings: { ...state.settings, brandMappings: mappings },
        })),
        
      addBrandMapping: (mapping) =>
        set((state) => ({
          settings: {
            ...state.settings,
            brandMappings: [...state.settings.brandMappings, mapping],
          },
        })),
        
      updateBrandMapping: (id, updates) =>
        set((state) => ({
          settings: {
            ...state.settings,
            brandMappings: state.settings.brandMappings.map((m) =>
              m.id === id ? { ...m, ...updates } : m
            ),
          },
        })),
        
      deleteBrandMapping: (id) =>
        set((state) => ({
          settings: {
            ...state.settings,
            brandMappings: state.settings.brandMappings.filter(
              (m) => m.id !== id
            ),
          },
        })),
      
      // === Sync Settings Actions ===
      setSyncSettings: (syncSettings) =>
        set((state) => ({
          settings: { ...state.settings, syncSettings },
        })),
        
      updateSyncSetting: (key, value) =>
        set((state) => ({
          settings: {
            ...state.settings,
            syncSettings: {
              ...state.settings.syncSettings,
              [key]: value,
            },
          },
        })),
      
      // === Log Actions ===
      addLog: (log) => {
        const newLog: TrendtechSyncLog = {
          ...log,
          id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          timestamp: new Date().toISOString(),
        };
        set((state) => ({
          settings: {
            ...state.settings,
            logs: [newLog, ...state.settings.logs].slice(0, 100), // Keep last 100 logs
          },
        }));
      },
      
      clearLogs: () =>
        set((state) => ({
          settings: { ...state.settings, logs: [] },
        })),
      
      // === Sync Actions ===
      syncCategoriesFromTrendtech: async () => {
        const { addLog, setCategories } = get();
        try {
          const response = await fetchTrendtechCategories();
          if (response.success && response.data) {
            const categories = response.data.categories;
            setCategories(categories);
            addLog({
              action: 'sync_categories',
              status: 'success',
              message: `Đã đồng bộ ${categories.length} danh mục từ Trendtech`,
              details: { total: categories.length, success: categories.length, failed: 0 },
            });
          } else {
            throw new Error(response.error || 'Không thể lấy danh sách danh mục');
          }
        } catch (error) {
          addLog({
            action: 'sync_categories',
            status: 'error',
            message: 'Lỗi khi đồng bộ danh mục từ Trendtech',
            details: { error: error instanceof Error ? error.message : String(error) },
          });
          throw error;
        }
      },
      
      syncBrandsFromTrendtech: async () => {
        const { addLog, setBrands } = get();
        try {
          const response = await fetchTrendtechBrands();
          if (response.success && response.data) {
            const brands = response.data.brands;
            setBrands(brands);
            addLog({
              action: 'sync_brands',
              status: 'success',
              message: `Đã đồng bộ ${brands.length} thương hiệu từ Trendtech`,
              details: { total: brands.length, success: brands.length, failed: 0 },
            });
          } else {
            throw new Error(response.error || 'Không thể lấy danh sách thương hiệu');
          }
        } catch (error) {
          addLog({
            action: 'sync_brands',
            status: 'error',
            message: 'Lỗi khi đồng bộ thương hiệu từ Trendtech',
            details: { error: error instanceof Error ? error.message : String(error) },
          });
          throw error;
        }
      },
      
      // === Trendtech Products Cache Actions ===
      setTrendtechProducts: (products) =>
        set((state) => ({
          settings: {
            ...state.settings,
            trendtechProducts: products,
            trendtechProductsLastFetch: new Date().toISOString(),
          },
        })),
        
      clearTrendtechProducts: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            trendtechProducts: [],
            trendtechProductsLastFetch: undefined,
          },
        })),
      
      // === Status Actions ===
      setLastSyncAt: (timestamp) =>
        set((state) => ({
          settings: { ...state.settings, lastSyncAt: timestamp },
        })),
        
      setLastSyncResult: (result) =>
        set((state) => ({
          settings: { ...state.settings, lastSyncResult: result },
        })),
        
      setConnectionStatus: (status, error) =>
        set((state) => ({
          settings: {
            ...state.settings,
            connectionStatus: status,
            connectionError: error,
          },
        })),
      
      // === Utility Actions ===
      resetSettings: () =>
        set({
          settings: DEFAULT_TRENDTECH_SETTINGS,
        }),
        
      setLoading: (isLoading) => set({ isLoading }),
      setSaving: (isSaving) => set({ isSaving }),
      
      // === Getters ===
      getCategoryById: (id) =>
        get().settings.categories.find((c) => c.id === id),
        
      getBrandById: (id) =>
        get().settings.brands.find((b) => b.id === id),
        
      getCategoryMappingByHrmId: (hrmCategoryId) =>
        get().settings.categoryMappings.find(
          (m) => m.hrmCategorySystemId === hrmCategoryId
        ),
        
      getBrandMappingByHrmId: (hrmBrandId) =>
        get().settings.brandMappings.find(
          (m) => m.hrmBrandSystemId === hrmBrandId
        ),
        
      getTrendtechCatIdByHrmCategory: (hrmCategoryId) => {
        const mapping = get().settings.categoryMappings.find(
          (m) => m.hrmCategorySystemId === hrmCategoryId
        );
        return mapping?.trendtechCatId ?? null;
      },
      
      getTrendtechBrandIdByHrmBrand: (hrmBrandId) => {
        const mapping = get().settings.brandMappings.find(
          (m) => m.hrmBrandSystemId === hrmBrandId
        );
        return mapping?.trendtechBrandId ?? null;
      },
    }),
    {
      name: 'trendtech-settings',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (state) => {
        // Exclude trendtechProducts from localStorage - keep only in memory
        const { trendtechProducts, trendtechProductsLastFetch, ...settingsToSave } = state.settings;
        return {
          settings: settingsToSave,
        };
      },
    }
  )
);

// ========================================
// Selector Hooks
// ========================================

export function useTrendtechEnabled() {
  return useTrendtechSettingsStore((state) => state.settings.enabled);
}

export function useTrendtechApiConfig() {
  return useTrendtechSettingsStore((state) => ({
    apiUrl: state.settings.apiUrl,
    apiKey: state.settings.apiKey,
    enabled: state.settings.enabled,
  }));
}

export function useTrendtechCategories() {
  return useTrendtechSettingsStore((state) => state.settings.categories);
}

export function useTrendtechBrands() {
  return useTrendtechSettingsStore((state) => state.settings.brands);
}

export function useTrendtechPriceMapping() {
  return useTrendtechSettingsStore((state) => state.settings.priceMapping);
}

export function useTrendtechCategoryMappings() {
  return useTrendtechSettingsStore((state) => state.settings.categoryMappings);
}

export function useTrendtechBrandMappings() {
  return useTrendtechSettingsStore((state) => state.settings.brandMappings);
}

export function useTrendtechSyncSettings() {
  return useTrendtechSettingsStore((state) => state.settings.syncSettings);
}

export function useTrendtechSyncStatus() {
  return useTrendtechSettingsStore((state) => ({
    lastSyncAt: state.settings.lastSyncAt,
    lastSyncResult: state.settings.lastSyncResult,
    connectionStatus: state.settings.connectionStatus,
    connectionError: state.settings.connectionError,
  }));
}

export function useTrendtechProducts() {
  return useTrendtechSettingsStore((state) => ({
    products: state.settings.trendtechProducts,
    lastFetch: state.settings.trendtechProductsLastFetch,
  }));
}
