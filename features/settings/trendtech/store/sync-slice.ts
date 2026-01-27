/**
 * Trendtech Settings Store - Sync Slice
 * Sync actions, logs, status, and products cache
 * 
 * @module features/settings/trendtech/store/sync-slice
 */

import type { 
  TrendtechSettings, 
  TrendtechSyncSettings, 
  TrendtechSyncResult, 
  TrendtechSyncLog,
  TrendtechCategory,
  TrendtechBrand,
  TrendtechProduct,
} from './types';
import { getCategories as fetchTrendtechCategories, getBrands as fetchTrendtechBrands } from '../../../../lib/trendtech/api-service';

type StateWithSettings = { settings: TrendtechSettings };

// ========================================
// Sync Settings Actions
// ========================================

export const syncSettingsActions = {
  setSyncSettings: (state: StateWithSettings, syncSettings: TrendtechSyncSettings) => ({
    settings: { ...state.settings, syncSettings },
  }),
  
  updateSyncSetting: <K extends keyof TrendtechSyncSettings>(
    state: StateWithSettings,
    key: K,
    value: TrendtechSyncSettings[K]
  ) => ({
    settings: {
      ...state.settings,
      syncSettings: {
        ...state.settings.syncSettings,
        [key]: value,
      },
    },
  }),
};

// ========================================
// Log Actions
// ========================================

export const createAddLogAction = (
  set: (fn: (state: StateWithSettings) => Partial<StateWithSettings>) => void
) => (log: Omit<TrendtechSyncLog, 'id' | 'timestamp'>) => {
  const newLog: TrendtechSyncLog = {
    ...log,
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    timestamp: new Date().toISOString(),
  };
  
  set((state) => ({
    settings: {
      ...state.settings,
      logs: [newLog, ...state.settings.logs].slice(0, 100),
    },
  }));
};

export const logActions = {
  clearLogs: (state: StateWithSettings) => ({
    settings: { ...state.settings, logs: [] },
  }),
};

// ========================================
// Sync Actions
// ========================================

export const createSyncCategoriesAction = (
  get: () => StateWithSettings & { 
    addLog: (log: Omit<TrendtechSyncLog, 'id' | 'timestamp'>) => void;
    setCategories: (categories: TrendtechCategory[]) => void;
  }
) => async (apiSettings?: any) => {
  const { addLog, setCategories } = get();
  try {
    const response = await (fetchTrendtechCategories as any)(apiSettings);
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
};

export const createSyncBrandsAction = (
  get: () => StateWithSettings & { 
    addLog: (log: Omit<TrendtechSyncLog, 'id' | 'timestamp'>) => void;
    setBrands: (brands: TrendtechBrand[]) => void;
  }
) => async (apiSettings?: any) => {
  const { addLog, setBrands } = get();
  try {
    const response = await (fetchTrendtechBrands as any)(apiSettings);
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
};

// ========================================
// Products Cache Actions
// ========================================

export const productsActions = {
  setTrendtechProducts: (state: StateWithSettings, products: TrendtechProduct[]) => ({
    settings: {
      ...state.settings,
      trendtechProducts: products,
      trendtechProductsLastFetch: new Date().toISOString(),
    },
  }),
  
  clearTrendtechProducts: (state: StateWithSettings) => ({
    settings: {
      ...state.settings,
      trendtechProducts: [],
      trendtechProductsLastFetch: undefined,
    },
  }),
};

// ========================================
// Status Actions
// ========================================

export const statusActions = {
  setLastSyncAt: (state: StateWithSettings, timestamp: string) => ({
    settings: { ...state.settings, lastSyncAt: timestamp },
  }),
  
  setLastSyncResult: (state: StateWithSettings, result: TrendtechSyncResult) => ({
    settings: { ...state.settings, lastSyncResult: result },
  }),
  
  setConnectionStatus: (
    state: StateWithSettings, 
    status: 'connected' | 'disconnected' | 'error', 
    error?: string
  ) => ({
    settings: {
      ...state.settings,
      connectionStatus: status,
      connectionError: error,
    },
  }),
};
