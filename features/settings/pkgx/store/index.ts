/**
 * PKGX Settings Store - Main Entry
 * Combined store with all slices
 * Data is stored in database via /api/settings
 * 
 * @module features/settings/pkgx/store
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// Types
import type { PkgxSettingsStore } from './types';
export type { PkgxSettingsStore } from './types';
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
} from './types';

// Slices
import { createInitialSettings, configActions, utilityActions } from './config-slice';
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
const SETTINGS_GROUP = 'pkgx';

export const usePkgxSettingsStore = create<PkgxSettingsStore>()(
  subscribeWithSelector(
    (set, get) => ({
      // === Initial State ===
      settings: createInitialSettings(),
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
      syncCategoriesFromPkgx: createSyncCategoriesAction(get),
      syncBrandsFromPkgx: createSyncBrandsAction(get),
      
      // === PKGX Products Cache Actions ===
      setPkgxProducts: (products) => set((state) => productsActions.setPkgxProducts(state, products)),
      clearPkgxProducts: () => set((state) => productsActions.clearPkgxProducts(state)),
      
      // === Status Actions ===
      setLastSyncAt: (timestamp) => set((state) => statusActions.setLastSyncAt(state, timestamp)),
      setLastSyncResult: (result) => set((state) => statusActions.setLastSyncResult(state, result)),
      setConnectionStatus: (status, error) => set((state) => statusActions.setConnectionStatus(state, status, error)),
      
      // === Utility Actions ===
      loadDefaultData: () => set((state) => utilityActions.loadDefaultData(state)),
      resetSettings: () => set(utilityActions.resetSettings()),
      setLoading: (isLoading) => set({ isLoading }),
      setSaving: (isSaving) => set({ isSaving }),
      
      // === Getters ===
      getCategoryById: (id) => referenceGetters.getCategoryById(get().settings, id),
      getBrandById: (id) => referenceGetters.getBrandById(get().settings, id),
      getCategoryMappingByHrmId: (hrmCategoryId) => mappingGetters.getCategoryMappingByHrmId(get().settings, hrmCategoryId),
      getBrandMappingByHrmId: (hrmBrandId) => mappingGetters.getBrandMappingByHrmId(get().settings, hrmBrandId),
      getPkgxCatIdByHrmCategory: (hrmCategoryId) => mappingGetters.getPkgxCatIdByHrmCategory(get().settings, hrmCategoryId),
      getPkgxBrandIdByHrmBrand: (hrmBrandId) => mappingGetters.getPkgxBrandIdByHrmBrand(get().settings, hrmBrandId),
    })
  )
);

// ========================================
// Database Sync Functions
// ========================================

let saveTimeout: NodeJS.Timeout | null = null;
let isInitialized = false;

/**
 * Load PKGX settings from database
 */
export async function loadPkgxSettingsFromDatabase(): Promise<void> {
  try {
    const res = await fetch(`${SETTINGS_API}?group=${SETTINGS_GROUP}`);
    if (res.ok) {
      const data = await res.json();
      if (data.grouped?.[SETTINGS_GROUP]?.settings) {
        usePkgxSettingsStore.setState({ 
          settings: {
            ...createInitialSettings(),
            ...data.grouped[SETTINGS_GROUP].settings,
          }
        });
      }
    }
    isInitialized = true;
  } catch (error) {
    console.error('[PKGX] Error loading settings from database:', error);
  }
}

/**
 * Save PKGX settings to database (debounced)
 */
export function savePkgxSettingsToDatabase(): void {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  
  saveTimeout = setTimeout(async () => {
    try {
      const { settings } = usePkgxSettingsStore.getState();
      // Exclude runtime data from database
      const { pkgxProducts: _pkgxProducts, pkgxProductsLastFetch: _pkgxProductsLastFetch, ...settingsToSave } = settings;
      
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
      console.error('[PKGX] Error saving settings to database:', error);
    }
  }, 1000);
}

// Auto-save when settings change (after initial load)
usePkgxSettingsStore.subscribe(
  (state) => state.settings,
  () => {
    if (isInitialized) {
      savePkgxSettingsToDatabase();
    }
  }
);

// Re-export selectors
export {
  usePkgxEnabled,
  usePkgxApiConfig,
  usePkgxCategories,
  usePkgxBrands,
  usePkgxPriceMapping,
  usePkgxCategoryMappings,
  usePkgxBrandMappings,
  usePkgxSyncSettings,
  usePkgxSyncStatus,
  usePkgxProducts,
} from './selectors';
