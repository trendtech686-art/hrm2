/**
 * Trendtech Settings Store - Types
 * Store interface and type definitions
 * 
 * @module features/settings/trendtech/store/types
 */

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
} from '../../../../lib/trendtech/types';

// ========================================
// Store State Interface
// ========================================

export interface TrendtechSettingsStore {
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

// Re-export types for convenience
export type {
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
};
