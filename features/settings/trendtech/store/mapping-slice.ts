/**
 * Trendtech Settings Store - Mapping Slice
 * Price, category, and brand mapping operations
 * 
 * @module features/settings/trendtech/store/mapping-slice
 */

import type { SystemId } from '@/lib/id-types';
import type { 
  TrendtechSettings, 
  TrendtechPriceMapping, 
  TrendtechCategoryMapping, 
  TrendtechBrandMapping 
} from './types';

type StateWithSettings = { settings: TrendtechSettings };

// ========================================
// Price Mapping Actions
// ========================================

export const priceMappingActions = {
  setPriceMapping: (state: StateWithSettings, mapping: TrendtechPriceMapping) => ({
    settings: { ...state.settings, priceMapping: mapping },
  }),
  
  updatePriceMapping: (
    state: StateWithSettings, 
    field: keyof TrendtechPriceMapping, 
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
  setCategoryMappings: (state: StateWithSettings, mappings: TrendtechCategoryMapping[]) => ({
    settings: { ...state.settings, categoryMappings: mappings },
  }),
  
  addCategoryMapping: (state: StateWithSettings, mapping: TrendtechCategoryMapping) => ({
    settings: {
      ...state.settings,
      categoryMappings: [...state.settings.categoryMappings, mapping],
    },
  }),
  
  updateCategoryMapping: (
    state: StateWithSettings, 
    id: string, 
    updates: Partial<TrendtechCategoryMapping>
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
  setBrandMappings: (state: StateWithSettings, mappings: TrendtechBrandMapping[]) => ({
    settings: { ...state.settings, brandMappings: mappings },
  }),
  
  addBrandMapping: (state: StateWithSettings, mapping: TrendtechBrandMapping) => ({
    settings: {
      ...state.settings,
      brandMappings: [...state.settings.brandMappings, mapping],
    },
  }),
  
  updateBrandMapping: (
    state: StateWithSettings, 
    id: string, 
    updates: Partial<TrendtechBrandMapping>
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
  getCategoryMappingByHrmId: (settings: TrendtechSettings, hrmCategoryId: SystemId) =>
    settings.categoryMappings.find(
      (m) => m.hrmCategorySystemId === hrmCategoryId
    ),
    
  getBrandMappingByHrmId: (settings: TrendtechSettings, hrmBrandId: SystemId) =>
    settings.brandMappings.find(
      (m) => m.hrmBrandSystemId === hrmBrandId
    ),
    
  getTrendtechCatIdByHrmCategory: (settings: TrendtechSettings, hrmCategoryId: SystemId) => {
    const mapping = settings.categoryMappings.find(
      (m) => m.hrmCategorySystemId === hrmCategoryId
    );
    return mapping?.trendtechCatId ?? null;
  },
  
  getTrendtechBrandIdByHrmBrand: (settings: TrendtechSettings, hrmBrandId: SystemId) => {
    const mapping = settings.brandMappings.find(
      (m) => m.hrmBrandSystemId === hrmBrandId
    );
    return mapping?.trendtechBrandId ?? null;
  },
};
