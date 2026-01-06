/**
 * PKGX Settings Store - Reference Data Slice
 * Categories and Brands CRUD operations
 * 
 * @module features/settings/pkgx/store/reference-slice
 */

import type { PkgxSettings, PkgxCategory, PkgxBrand } from './types';

type StateWithSettings = { settings: PkgxSettings };

// ========================================
// Category Actions
// ========================================

export const categoryActions = {
  setCategories: (state: StateWithSettings, categories: PkgxCategory[]) => ({
    settings: { ...state.settings, categories },
  }),
  
  addCategory: (state: StateWithSettings, category: PkgxCategory) => ({
    settings: {
      ...state.settings,
      categories: [...state.settings.categories, category],
    },
  }),
  
  updateCategory: (state: StateWithSettings, id: number, updates: Partial<PkgxCategory>) => ({
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
      // Also remove related mappings
      categoryMappings: state.settings.categoryMappings.filter(
        (m) => m.pkgxCatId !== id
      ),
    },
  }),
};

// ========================================
// Brand Actions
// ========================================

export const brandActions = {
  setBrands: (state: StateWithSettings, brands: PkgxBrand[]) => ({
    settings: { ...state.settings, brands },
  }),
  
  addBrand: (state: StateWithSettings, brand: PkgxBrand) => ({
    settings: {
      ...state.settings,
      brands: [...state.settings.brands, brand],
    },
  }),
  
  updateBrand: (state: StateWithSettings, id: number, updates: Partial<PkgxBrand>) => ({
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
      // Also remove related mappings
      brandMappings: state.settings.brandMappings.filter(
        (m) => m.pkgxBrandId !== id
      ),
    },
  }),
};

// ========================================
// Getters
// ========================================

export const referenceGetters = {
  getCategoryById: (settings: PkgxSettings, id: number) =>
    settings.categories.find((c) => c.id === id),
    
  getBrandById: (settings: PkgxSettings, id: number) =>
    settings.brands.find((b) => b.id === id),
};
