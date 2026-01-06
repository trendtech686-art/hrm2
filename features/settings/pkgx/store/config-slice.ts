/**
 * PKGX Settings Store - Config Slice
 * General configuration and utility actions
 * 
 * @module features/settings/pkgx/store/config-slice
 */

import type { PkgxSettings } from './types';
import { DEFAULT_PKGX_SETTINGS } from '../types';
import { PKGX_CATEGORIES, PKGX_BRANDS } from '../constants';

// ========================================
// Initial State
// ========================================

export const createInitialSettings = (): PkgxSettings => ({
  ...DEFAULT_PKGX_SETTINGS,
  categories: PKGX_CATEGORIES,
  brands: PKGX_BRANDS,
});

// ========================================
// Config Actions
// ========================================

export const configActions = {
  setApiUrl: (state: { settings: PkgxSettings }, url: string) => ({
    settings: { ...state.settings, apiUrl: url },
  }),
  
  setApiKey: (state: { settings: PkgxSettings }, key: string) => ({
    settings: { ...state.settings, apiKey: key },
  }),
  
  setEnabled: (state: { settings: PkgxSettings }, enabled: boolean) => ({
    settings: { ...state.settings, enabled },
  }),
};

// ========================================
// Utility Actions
// ========================================

export const utilityActions = {
  loadDefaultData: (state: { settings: PkgxSettings }) => ({
    settings: {
      ...state.settings,
      categories: PKGX_CATEGORIES,
      brands: PKGX_BRANDS,
    },
  }),
  
  resetSettings: () => ({
    settings: createInitialSettings(),
  }),
};
