/**
 * Trendtech Settings Store - Config Slice
 * General configuration and utility actions
 * 
 * @module features/settings/trendtech/store/config-slice
 */

import type { TrendtechSettings } from './types';
import { DEFAULT_TRENDTECH_SETTINGS } from '../../../../lib/trendtech/types';

// ========================================
// Config Actions
// ========================================

export const configActions = {
  setApiUrl: (state: { settings: TrendtechSettings }, url: string) => ({
    settings: { ...state.settings, apiUrl: url },
  }),
  
  setApiKey: (state: { settings: TrendtechSettings }, key: string) => ({
    settings: { ...state.settings, apiKey: key },
  }),
  
  setEnabled: (state: { settings: TrendtechSettings }, enabled: boolean) => ({
    settings: { ...state.settings, enabled },
  }),
};

// ========================================
// Utility Actions
// ========================================

export const utilityActions = {
  resetSettings: () => ({
    settings: DEFAULT_TRENDTECH_SETTINGS,
  }),
};
