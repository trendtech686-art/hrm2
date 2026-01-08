/**
 * Trendtech Settings Store - Main Entry
 * Combined store with all slices
 * Data is stored in database via /api/settings
 * 
 * @module features/settings/trendtech/store
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { DEFAULT_TRENDTECH_SETTINGS } from '../../../../lib/trendtech/types';

// Types
import type { TrendtechSettingsStore } from './types';
export type { TrendtechSettingsStore } from './types';
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
} from './types';

// Slices
import { configActions, utilityActions } from './config-slice';
import { categoryActions, brandActions, referenceGetters } from './reference-slice';
import { 
  priceMappingActions, 
  categoryMappingActions, 
  brandMappingActions, 
  mappingGetters 
} from './mapping-slice';
import {
  syncSettingsActions,
  logActions,
  createAddLogAction,
  createSyncCategoriesAction,
  createSyncBrandsAction,
  productsActions,
  statusActions,
} from './sync-slice';

// ========================================
// Combined Store (Database-backed)
// ========================================

const SETTINGS_API = '/api/settings';
const SETTINGS_GROUP = 'trendtech';

export const useTrendtechSettingsStore = create<TrendtechSettingsStore>()(
  subscribeWithSelector(
    (set, get) => ({
      // === Initial State ===
      settings: DEFAULT_TRENDTECH_SETTINGS,
      isLoading: false,
      isSaving: false,
      
      // === General Config Actions ===
      setApiUrl: (url) => set((state) => configActions.setApiUrl(state, url)),
      setApiKey: (key) => set((state) => configActions.setApiKey(state, key)),
      setEnabled: (enabled) => set((state) => configActions.setEnabled(state, enabled)),
      
      // === Reference Data Actions ===
      setCategories: (categories) => set((state) => categoryActions.setCategories(state, categories)),
      addCategory: (category) => set((state) => categoryActions.addCategory(state, category)),
      updateCategory: (id, updates) => set((state) => categoryActions.updateCategory(state, id, updates)),
      deleteCategory: (id) => set((state) => categoryActions.deleteCategory(state, id)),
      
      setBrands: (brands) => set((state) => brandActions.setBrands(state, brands)),
      addBrand: (brand) => set((state) => brandActions.addBrand(state, brand)),
      updateBrand: (id, updates) => set((state) => brandActions.updateBrand(state, id, updates)),
      deleteBrand: (id) => set((state) => brandActions.deleteBrand(state, id)),
      
      // === Mapping Actions ===
      setPriceMapping: (mapping) => set((state) => priceMappingActions.setPriceMapping(state, mapping)),
      updatePriceMapping: (field, policyId) => set((state) => priceMappingActions.updatePriceMapping(state, field, policyId)),
      
      setCategoryMappings: (mappings) => set((state) => categoryMappingActions.setCategoryMappings(state, mappings)),
      addCategoryMapping: (mapping) => set((state) => categoryMappingActions.addCategoryMapping(state, mapping)),
      updateCategoryMapping: (id, updates) => set((state) => categoryMappingActions.updateCategoryMapping(state, id, updates)),
      deleteCategoryMapping: (id) => set((state) => categoryMappingActions.deleteCategoryMapping(state, id)),
      
      setBrandMappings: (mappings) => set((state) => brandMappingActions.setBrandMappings(state, mappings)),
      addBrandMapping: (mapping) => set((state) => brandMappingActions.addBrandMapping(state, mapping)),
      updateBrandMapping: (id, updates) => set((state) => brandMappingActions.updateBrandMapping(state, id, updates)),
      deleteBrandMapping: (id) => set((state) => brandMappingActions.deleteBrandMapping(state, id)),
      
      // === Sync Settings Actions ===
      setSyncSettings: (syncSettings) => set((state) => syncSettingsActions.setSyncSettings(state, syncSettings)),
      updateSyncSetting: (key, value) => set((state) => syncSettingsActions.updateSyncSetting(state, key, value)),
      
      // === Log Actions ===
      addLog: createAddLogAction(set),
      clearLogs: () => set((state) => logActions.clearLogs(state)),
      
      // === Sync Actions ===
      syncCategoriesFromTrendtech: createSyncCategoriesAction(get),
      syncBrandsFromTrendtech: createSyncBrandsAction(get),
      
      // === Trendtech Products Cache Actions ===
      setTrendtechProducts: (products) => set((state) => productsActions.setTrendtechProducts(state, products)),
      clearTrendtechProducts: () => set((state) => productsActions.clearTrendtechProducts(state)),
      
      // === Status Actions ===
      setLastSyncAt: (timestamp) => set((state) => statusActions.setLastSyncAt(state, timestamp)),
      setLastSyncResult: (result) => set((state) => statusActions.setLastSyncResult(state, result)),
      setConnectionStatus: (status, error) => set((state) => statusActions.setConnectionStatus(state, status, error)),
      
      // === Utility Actions ===
      resetSettings: () => set(utilityActions.resetSettings()),
      setLoading: (isLoading) => set({ isLoading }),
      setSaving: (isSaving) => set({ isSaving }),
      
      // === Getters ===
      getCategoryById: (id) => referenceGetters.getCategoryById(get().settings, id),
      getBrandById: (id) => referenceGetters.getBrandById(get().settings, id),
      getCategoryMappingByHrmId: (hrmCategoryId) => mappingGetters.getCategoryMappingByHrmId(get().settings, hrmCategoryId),
      getBrandMappingByHrmId: (hrmBrandId) => mappingGetters.getBrandMappingByHrmId(get().settings, hrmBrandId),
      getTrendtechCatIdByHrmCategory: (hrmCategoryId) => mappingGetters.getTrendtechCatIdByHrmCategory(get().settings, hrmCategoryId),
      getTrendtechBrandIdByHrmBrand: (hrmBrandId) => mappingGetters.getTrendtechBrandIdByHrmBrand(get().settings, hrmBrandId),
    })
  )
);

// ========================================
// Database Sync Functions
// ========================================

let saveTimeout: NodeJS.Timeout | null = null;
let isInitialized = false;

/**
 * Load Trendtech settings from database
 */
export async function loadTrendtechSettingsFromDatabase(): Promise<void> {
  try {
    const res = await fetch(`${SETTINGS_API}?group=${SETTINGS_GROUP}`);
    if (res.ok) {
      const data = await res.json();
      if (data.grouped?.[SETTINGS_GROUP]?.settings) {
        useTrendtechSettingsStore.setState({ 
          settings: {
            ...DEFAULT_TRENDTECH_SETTINGS,
            ...data.grouped[SETTINGS_GROUP].settings,
          }
        });
      }
    }
    isInitialized = true;
  } catch (error) {
    console.error('[Trendtech] Error loading settings from database:', error);
  }
}

/**
 * Save Trendtech settings to database (debounced)
 */
export function saveTrendtechSettingsToDatabase(): void {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  
  saveTimeout = setTimeout(async () => {
    try {
      const { settings } = useTrendtechSettingsStore.getState();
      // Exclude runtime data from database
      const { trendtechProducts: _trendtechProducts, trendtechProductsLastFetch: _trendtechProductsLastFetch, ...settingsToSave } = settings;
      
      await fetch(SETTINGS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'settings',
          group: SETTINGS_GROUP,
          type: 'json',
          category: 'integration',
          value: settingsToSave,
        }),
      });
    } catch (error) {
      console.error('[Trendtech] Error saving settings to database:', error);
    }
  }, 1000);
}

// Auto-save when settings change (after initial load)
useTrendtechSettingsStore.subscribe(
  (state) => state.settings,
  () => {
    if (isInitialized) {
      saveTrendtechSettingsToDatabase();
    }
  }
);

// Re-export selectors
export {
  useTrendtechEnabled,
  useTrendtechApiConfig,
  useTrendtechCategories,
  useTrendtechBrands,
  useTrendtechPriceMapping,
  useTrendtechCategoryMappings,
  useTrendtechBrandMappings,
  useTrendtechSyncSettings,
  useTrendtechSyncStatus,
  useTrendtechProducts,
} from './selectors';
