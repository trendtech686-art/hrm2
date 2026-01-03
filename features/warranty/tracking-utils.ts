/**
 * Warranty Tracking Utilities
 * Helper functions for public tracking settings
 * 
 * @migrated localStorage → /api/user-preferences
 * @see docs/LOCALSTORAGE-TO-DATABASE-MIGRATION.md
 */

import { 
  getWarrantyTrackingSettingsSync,
  DEFAULT_TRACKING_SETTINGS as _DEFAULT_TRACKING_SETTINGS,
  type PublicTrackingSettings 
} from '@/hooks/use-public-tracking-settings';

export type { PublicTrackingSettings };

/**
 * Load tracking settings
 * @deprecated Use useWarrantyTrackingSettings() hook for React components
 */
export function loadTrackingSettings(): PublicTrackingSettings {
  return getWarrantyTrackingSettingsSync();
}

/**
 * Check if customer comments are allowed
 */
export function canCustomerComment(): boolean {
  const settings = loadTrackingSettings();
  return settings.allowCustomerComments;
}

/**
 * Check if employee name should be shown
 */
export function shouldShowEmployeeName(): boolean {
  const settings = loadTrackingSettings();
  return settings.showEmployeeName;
}

/**
 * Check if timeline should be shown
 */
export function shouldShowTimeline(): boolean {
  const settings = loadTrackingSettings();
  return settings.showTimeline;
}

/**
 * Get tracking code for display (can be customized)
 */
export function getTrackingCode(systemId: string): string {
  return systemId;
}
