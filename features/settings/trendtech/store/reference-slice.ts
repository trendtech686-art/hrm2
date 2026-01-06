/**
 * Trendtech Settings Store - Reference Data Slice
 * Categories and Brands CRUD operations
 * 
 * @module features/settings/trendtech/store/reference-slice
 */

import type { TrendtechSettings, TrendtechCategory, TrendtechBrand } from './types';

type StateWithSettings = { settings: TrendtechSettings };

// ========================================
// Category Actions
// ========================================

export const categoryActions = {
  setCategories: (state: StateWithSettings, categories: TrendtechCategory[]) => ({
    settings: { ...state.settings, categories },
  }),
  
  addCategory: (state: StateWithSettings, category: TrendtechCategory) => ({
    settings: {
      ...state.settings,
      categories: [...state.settings.categories, category],
    },
  }),
  
  updateCategory: (state: StateWithSettings, id: number, updates: Partial<TrendtechCategory>) => ({
    settings: {
      ...state.settings,
      categories: state.settings.categories.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    },
  }),
  
  deleteCategory: (state: StateWithSettings, id: number) => ({
    settings: {
      ...state.settings,
      categories: state.settings.categories.filter((c) => c.id !== id),
      categoryMappings: state.settings.categoryMappings.filter(
        (m) => m.trendtechCatId !== id
      ),
    },
  }),
};

// ========================================
// Brand Actions
// ========================================

export const brandActions = {
  setBrands: (state: StateWithSettings, brands: TrendtechBrand[]) => ({
    settings: { ...state.settings, brands },
  }),
  
  addBrand: (state: StateWithSettings, brand: TrendtechBrand) => ({
    settings: {
      ...state.settings,
      brands: [...state.settings.brands, brand],
    },
  }),
  
  updateBrand: (state: StateWithSettings, id: number, updates: Partial<TrendtechBrand>) => ({
    settings: {
      ...state.settings,
      brands: state.settings.brands.map((b) =>
        b.id === id ? { ...b, ...updates } : b
      ),
    },
  }),
  
  deleteBrand: (state: StateWithSettings, id: number) => ({
    settings: {
      ...state.settings,
      brands: state.settings.brands.filter((b) => b.id !== id),
      brandMappings: state.settings.brandMappings.filter(
        (m) => m.trendtechBrandId !== id
      ),
    },
  }),
};

// ========================================
// Getters
// ========================================

export const referenceGetters = {
  getCategoryById: (settings: TrendtechSettings, id: number) =>
    settings.categories.find((c) => c.id === id),
    
  getBrandById: (settings: TrendtechSettings, id: number) =>
    settings.brands.find((b) => b.id === id),
};
