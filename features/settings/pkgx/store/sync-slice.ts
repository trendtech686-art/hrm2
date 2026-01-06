/**
 * PKGX Settings Store - Sync Slice
 * Sync actions, logs, status, and products cache
 * 
 * @module features/settings/pkgx/store/sync-slice
 */

import type { 
  PkgxSettings, 
  PkgxSyncSettings, 
  PkgxSyncResult, 
  PkgxSyncLog,
  PkgxCategory,
  PkgxBrand,
  PkgxProduct,
} from './types';
import { getCategories as fetchPkgxCategories, getBrands as fetchPkgxBrands } from '@/lib/pkgx/api-service';
import { getCurrentUserInfo } from '@/contexts/auth-context';

type StateWithSettings = { settings: PkgxSettings };

// ========================================
// Sync Settings Actions
// ========================================

export const syncSettingsActions = {
  setSyncSettings: (state: StateWithSettings, syncSettings: PkgxSyncSettings) => ({
    settings: { ...state.settings, syncSettings },
  }),
  
  updateSyncSetting: <K extends keyof PkgxSyncSettings>(
    state: StateWithSettings,
    key: K,
    value: PkgxSyncSettings[K]
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
) => (log: Omit<PkgxSyncLog, 'id' | 'timestamp'>) => {
  const userInfo = getCurrentUserInfo();
  
  const newLog: PkgxSyncLog = {
    ...log,
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    timestamp: new Date().toISOString(),
    userId: userInfo.systemId,
    userName: userInfo.name,
  };
  
  set((state) => ({
    settings: {
      ...state.settings,
      logs: [newLog, ...state.settings.logs].slice(0, 100), // Keep last 100 logs
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
    addLog: (log: Omit<PkgxSyncLog, 'id' | 'timestamp'>) => void;
    setCategories: (categories: PkgxCategory[]) => void;
  }
) => async () => {
  const { addLog, setCategories } = get();
  try {
    const response = await fetchPkgxCategories();
    if (response.success && response.data && !response.data.error) {
      const categories: PkgxCategory[] = response.data.data.map((cat) => ({
        id: cat.cat_id,
        name: cat.cat_name,
        parentId: cat.parent_id > 0 ? cat.parent_id : undefined,
      }));
      
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
    throw error;
  }
};

export const createSyncBrandsAction = (
  get: () => StateWithSettings & { 
    addLog: (log: Omit<PkgxSyncLog, 'id' | 'timestamp'>) => void;
    setBrands: (brands: PkgxBrand[]) => void;
  }
) => async () => {
  const { addLog, setBrands } = get();
  try {
    const response = await fetchPkgxBrands();
    if (response.success && response.data && !response.data.error) {
      const brands: PkgxBrand[] = response.data.data.map((brand) => ({
        id: brand.brand_id,
        name: brand.brand_name,
      }));
      
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
    throw error;
  }
};

// ========================================
// Products Cache Actions
// ========================================

export const productsActions = {
  setPkgxProducts: (state: StateWithSettings, products: PkgxProduct[]) => ({
    settings: {
      ...state.settings,
      pkgxProducts: products,
      pkgxProductsLastFetch: new Date().toISOString(),
    },
  }),
  
  clearPkgxProducts: (state: StateWithSettings) => ({
    settings: {
      ...state.settings,
      pkgxProducts: [],
      pkgxProductsLastFetch: undefined,
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
  
  setLastSyncResult: (state: StateWithSettings, result: PkgxSyncResult) => ({
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
