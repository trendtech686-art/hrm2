import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { SystemId } from '@/lib/id-types';
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
} from './types';
import { DEFAULT_PKGX_SETTINGS } from './types';
import { PKGX_CATEGORIES, PKGX_BRANDS } from './constants';
import { getCategories as fetchPkgxCategories, getBrands as fetchPkgxBrands } from '@/lib/pkgx/api-service';

// ========================================
// Store Interface
// ========================================

interface PkgxSettingsStore {
  // === State ===
  settings: PkgxSettings;
  isLoading: boolean;
  isSaving: boolean;
  
  // === General Config Actions ===
  setApiUrl: (url: string) => void;
  setApiKey: (key: string) => void;
  setEnabled: (enabled: boolean) => void;
  
  // === Reference Data Actions ===
  setCategories: (categories: PkgxCategory[]) => void;
  addCategory: (category: PkgxCategory) => void;
  updateCategory: (id: number, updates: Partial<PkgxCategory>) => void;
  deleteCategory: (id: number) => void;
  
  setBrands: (brands: PkgxBrand[]) => void;
  addBrand: (brand: PkgxBrand) => void;
  updateBrand: (id: number, updates: Partial<PkgxBrand>) => void;
  deleteBrand: (id: number) => void;
  
  // === Mapping Actions ===
  setPriceMapping: (mapping: PkgxPriceMapping) => void;
  updatePriceMapping: (field: keyof PkgxPriceMapping, policyId: SystemId | null) => void;
  
  setCategoryMappings: (mappings: PkgxCategoryMapping[]) => void;
  addCategoryMapping: (mapping: PkgxCategoryMapping) => void;
  updateCategoryMapping: (id: string, updates: Partial<PkgxCategoryMapping>) => void;
  deleteCategoryMapping: (id: string) => void;
  
  setBrandMappings: (mappings: PkgxBrandMapping[]) => void;
  addBrandMapping: (mapping: PkgxBrandMapping) => void;
  updateBrandMapping: (id: string, updates: Partial<PkgxBrandMapping>) => void;
  deleteBrandMapping: (id: string) => void;
  
  // === Sync Settings Actions ===
  setSyncSettings: (settings: PkgxSyncSettings) => void;
  updateSyncSetting: <K extends keyof PkgxSyncSettings>(key: K, value: PkgxSyncSettings[K]) => void;
  
  // === Log Actions ===
  addLog: (log: Omit<PkgxSyncLog, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
  
  // === Sync Actions ===
  syncCategoriesFromPkgx: () => Promise<void>;
  syncBrandsFromPkgx: () => Promise<void>;
  
  // === PKGX Products Cache Actions ===
  setPkgxProducts: (products: PkgxProduct[]) => void;
  clearPkgxProducts: () => void;
  
  // === Status Actions ===
  setLastSyncAt: (timestamp: string) => void;
  setLastSyncResult: (result: PkgxSyncResult) => void;
  setConnectionStatus: (status: 'connected' | 'disconnected' | 'error', error?: string) => void;
  
  // === Utility Actions ===
  loadDefaultData: () => void;
  resetSettings: () => void;
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  
  // === Getters ===
  getCategoryById: (id: number) => PkgxCategory | undefined;
  getBrandById: (id: number) => PkgxBrand | undefined;
  getCategoryMappingByHrmId: (hrmCategoryId: SystemId) => PkgxCategoryMapping | undefined;
  getBrandMappingByHrmId: (hrmBrandId: SystemId) => PkgxBrandMapping | undefined;
  getPkgxCatIdByHrmCategory: (hrmCategoryId: SystemId) => number | null;
  getPkgxBrandIdByHrmBrand: (hrmBrandId: SystemId) => number | null;
}

// ========================================
// Store Implementation
// ========================================

export const usePkgxSettingsStore = create<PkgxSettingsStore>()(
  persist(
    (set, get) => ({
      // === Initial State ===
      settings: {
        ...DEFAULT_PKGX_SETTINGS,
        categories: PKGX_CATEGORIES,
        brands: PKGX_BRANDS,
      },
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
            // Also remove related mappings
            categoryMappings: state.settings.categoryMappings.filter(
              (m) => m.pkgxCatId !== id
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
            // Also remove related mappings
            brandMappings: state.settings.brandMappings.filter(
              (m) => m.pkgxBrandId !== id
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
        const newLog: PkgxSyncLog = {
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
      syncCategoriesFromPkgx: async () => {
        const { addLog, setCategories } = get();
        try {
          const response = await fetchPkgxCategories();
          if (response.success && response.data && !response.data.error) {
            // Map API response to PkgxCategory format
            const categories: PkgxCategory[] = response.data.data.map((cat) => ({
              id: cat.cat_id,
              name: cat.cat_name,
              parentId: cat.parent_id > 0 ? cat.parent_id : undefined,
            }));
            
            // Replace all categories with fresh data from server
            setCategories(categories);
            addLog({
              action: 'sync_categories',
              status: 'success',
              message: `Đã đồng bộ ${categories.length} danh mục từ PKGX`,
              details: { total: categories.length, success: categories.length, failed: 0 },
            });
          } else {
            throw new Error(response.error || response.data?.message || 'Không thể lấy danh sách danh mục');
          }
        } catch (error) {
          addLog({
            action: 'sync_categories',
            status: 'error',
            message: 'Lỗi khi đồng bộ danh mục từ PKGX',
            details: { error: error instanceof Error ? error.message : String(error) },
          });
          throw error; // Re-throw to let UI handle
        }
      },
      
      syncBrandsFromPkgx: async () => {
        const { addLog, setBrands } = get();
        try {
          const response = await fetchPkgxBrands();
          if (response.success && response.data && !response.data.error) {
            // Map API response to PkgxBrand format
            const brands: PkgxBrand[] = response.data.data.map((brand) => ({
              id: brand.brand_id,
              name: brand.brand_name,
            }));
            
            // Replace all brands with fresh data from server
            setBrands(brands);
            addLog({
              action: 'sync_brands',
              status: 'success',
              message: `Đã đồng bộ ${brands.length} thương hiệu từ PKGX`,
              details: { total: brands.length, success: brands.length, failed: 0 },
            });
          } else {
            throw new Error(response.error || response.data?.message || 'Không thể lấy danh sách thương hiệu');
          }
        } catch (error) {
          addLog({
            action: 'sync_brands',
            status: 'error',
            message: 'Lỗi khi đồng bộ thương hiệu từ PKGX',
            details: { error: error instanceof Error ? error.message : String(error) },
          });
          throw error; // Re-throw to let UI handle
        }
      },
      
      // === PKGX Products Cache Actions ===
      setPkgxProducts: (products) =>
        set((state) => ({
          settings: {
            ...state.settings,
            pkgxProducts: products,
            pkgxProductsLastFetch: new Date().toISOString(),
          },
        })),
        
      clearPkgxProducts: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            pkgxProducts: [],
            pkgxProductsLastFetch: undefined,
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
      loadDefaultData: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            categories: PKGX_CATEGORIES,
            brands: PKGX_BRANDS,
          },
        })),
        
      resetSettings: () =>
        set({
          settings: {
            ...DEFAULT_PKGX_SETTINGS,
            categories: PKGX_CATEGORIES,
            brands: PKGX_BRANDS,
          },
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
        
      getPkgxCatIdByHrmCategory: (hrmCategoryId) => {
        const mapping = get().settings.categoryMappings.find(
          (m) => m.hrmCategorySystemId === hrmCategoryId
        );
        return mapping?.pkgxCatId ?? null;
      },
      
      getPkgxBrandIdByHrmBrand: (hrmBrandId) => {
        const mapping = get().settings.brandMappings.find(
          (m) => m.hrmBrandSystemId === hrmBrandId
        );
        return mapping?.pkgxBrandId ?? null;
      },
    }),
    {
      name: 'pkgx-settings',
      storage: createJSONStorage(() => localStorage),
      version: 3, // v3: Remove pkgxProducts from persist (too large for localStorage)
      migrate: (persistedState: any, version: number) => {
        if (version < 3) {
          // Remove pkgxProducts from persisted state - it's too large for localStorage
          const newSettings = { ...persistedState.settings };
          delete newSettings.pkgxProducts;
          delete newSettings.pkgxProductsLastFetch;
          return {
            ...persistedState,
            settings: newSettings,
          };
        }
        return persistedState;
      },
      partialize: (state) => {
        // Exclude pkgxProducts from localStorage - keep only in memory
        const { pkgxProducts, pkgxProductsLastFetch, ...settingsToSave } = state.settings;
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

export function usePkgxEnabled() {
  return usePkgxSettingsStore((state) => state.settings.enabled);
}

export function usePkgxApiConfig() {
  return usePkgxSettingsStore((state) => ({
    apiUrl: state.settings.apiUrl,
    apiKey: state.settings.apiKey,
    enabled: state.settings.enabled,
  }));
}

export function usePkgxCategories() {
  return usePkgxSettingsStore((state) => state.settings.categories);
}

export function usePkgxBrands() {
  return usePkgxSettingsStore((state) => state.settings.brands);
}

export function usePkgxPriceMapping() {
  return usePkgxSettingsStore((state) => state.settings.priceMapping);
}

export function usePkgxCategoryMappings() {
  return usePkgxSettingsStore((state) => state.settings.categoryMappings);
}

export function usePkgxBrandMappings() {
  return usePkgxSettingsStore((state) => state.settings.brandMappings);
}

export function usePkgxSyncSettings() {
  return usePkgxSettingsStore((state) => state.settings.syncSettings);
}

export function usePkgxSyncStatus() {
  return usePkgxSettingsStore((state) => ({
    lastSyncAt: state.settings.lastSyncAt,
    lastSyncResult: state.settings.lastSyncResult,
    connectionStatus: state.settings.connectionStatus,
    connectionError: state.settings.connectionError,
  }));
}

export function usePkgxProducts() {
  return usePkgxSettingsStore((state) => ({
    products: state.settings.pkgxProducts,
    lastFetch: state.settings.pkgxProductsLastFetch,
  }));
}
