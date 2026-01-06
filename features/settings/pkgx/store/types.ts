/**
 * PKGX Settings Store - Types
 * Store interface and type definitions
 * 
 * @module features/settings/pkgx/store/types
 */

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
} from '../types';

// ========================================
// Store State Interface
// ========================================

export interface PkgxSettingsStore {
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

// Re-export types for convenience
export type {
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
};
