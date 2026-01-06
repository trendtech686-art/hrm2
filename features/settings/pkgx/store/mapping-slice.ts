/**
 * PKGX Settings Store - Mapping Slice
 * Price, category, and brand mapping operations
 * 
 * @module features/settings/pkgx/store/mapping-slice
 */

import type { SystemId } from '@/lib/id-types';
import type { 
  PkgxSettings, 
  PkgxPriceMapping, 
  PkgxCategoryMapping, 
  PkgxBrandMapping 
} from './types';

type StateWithSettings = { settings: PkgxSettings };

// ========================================
// Price Mapping Actions
// ========================================

export const priceMappingActions = {
  setPriceMapping: (state: StateWithSettings, mapping: PkgxPriceMapping) => ({
    settings: { ...state.settings, priceMapping: mapping },
  }),
  
  updatePriceMapping: (
    state: StateWithSettings, 
    field: keyof PkgxPriceMapping, 
    policyId: SystemId | null
  ) => ({
    settings: {
      ...state.settings,
      priceMapping: {
        ...state.settings.priceMapping,
        [field]: policyId,
      },
    },
  }),
};

// ========================================
// Category Mapping Actions
// ========================================

export const categoryMappingActions = {
  setCategoryMappings: (state: StateWithSettings, mappings: PkgxCategoryMapping[]) => ({
    settings: { ...state.settings, categoryMappings: mappings },
  }),
  
  addCategoryMapping: (state: StateWithSettings, mapping: PkgxCategoryMapping) => ({
    settings: {
      ...state.settings,
      categoryMappings: [...state.settings.categoryMappings, mapping],
    },
  }),
  
  updateCategoryMapping: (
    state: StateWithSettings, 
    id: string, 
    updates: Partial<PkgxCategoryMapping>
  ) => ({
    settings: {
      ...state.settings,
      categoryMappings: state.settings.categoryMappings.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    },
  }),
  
  deleteCategoryMapping: (state: StateWithSettings, id: string) => ({
    settings: {
      ...state.settings,
      categoryMappings: state.settings.categoryMappings.filter(
        (m) => m.id !== id
      ),
    },
  }),
};

// ========================================
// Brand Mapping Actions
// ========================================

export const brandMappingActions = {
  setBrandMappings: (state: StateWithSettings, mappings: PkgxBrandMapping[]) => ({
    settings: { ...state.settings, brandMappings: mappings },
  }),
  
  addBrandMapping: (state: StateWithSettings, mapping: PkgxBrandMapping) => ({
    settings: {
      ...state.settings,
      brandMappings: [...state.settings.brandMappings, mapping],
    },
  }),
  
  updateBrandMapping: (
    state: StateWithSettings, 
    id: string, 
    updates: Partial<PkgxBrandMapping>
  ) => ({
    settings: {
      ...state.settings,
      brandMappings: state.settings.brandMappings.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    },
  }),
  
  deleteBrandMapping: (state: StateWithSettings, id: string) => ({
    settings: {
      ...state.settings,
      brandMappings: state.settings.brandMappings.filter(
        (m) => m.id !== id
      ),
    },
  }),
};

// ========================================
// Mapping Getters
// ========================================

export const mappingGetters = {
  getCategoryMappingByHrmId: (settings: PkgxSettings, hrmCategoryId: SystemId) =>
    settings.categoryMappings.find(
      (m) => m.hrmCategorySystemId === hrmCategoryId
    ),
    
  getBrandMappingByHrmId: (settings: PkgxSettings, hrmBrandId: SystemId) =>
    settings.brandMappings.find(
      (m) => m.hrmBrandSystemId === hrmBrandId
    ),
    
  getPkgxCatIdByHrmCategory: (settings: PkgxSettings, hrmCategoryId: SystemId) => {
    const mapping = settings.categoryMappings.find(
      (m) => m.hrmCategorySystemId === hrmCategoryId
    );
    return mapping?.pkgxCatId ?? null;
  },
  
  getPkgxBrandIdByHrmBrand: (settings: PkgxSettings, hrmBrandId: SystemId) => {
    const mapping = settings.brandMappings.find(
      (m) => m.hrmBrandSystemId === hrmBrandId
    );
    return mapping?.pkgxBrandId ?? null;
  },
};
