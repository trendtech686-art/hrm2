/**
 * Warranty Tracking Utilities
 * Helper functions for public tracking settings
 */

export interface PublicTrackingSettings {
  enabled: boolean;
  allowCustomerComments: boolean;
  showEmployeeName: boolean;
  showTimeline: boolean;
}

const STORAGE_KEY = 'warranty-public-tracking-settings';

const defaultSettings: PublicTrackingSettings = {
  enabled: false, // Default to disabled for security
  allowCustomerComments: false,
  showEmployeeName: true,
  showTimeline: true,
};

/**
 * Load tracking settings from localStorage
 */
export function loadTrackingSettings(): PublicTrackingSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    console.log('[Warranty Tracking] Raw localStorage:', stored);
    if (stored) {
      const parsed = JSON.parse(stored);
      const merged = { ...defaultSettings, ...parsed };
      console.log('[Warranty Tracking] Loaded settings:', merged);
      return merged;
    }
  } catch (error) {
    console.error('Failed to load warranty tracking settings:', error);
  }
  console.log('[Warranty Tracking] Using default settings:', defaultSettings);
  return defaultSettings;
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
