/**
 * usePublicTrackingSettings - React Query Hooks
 * 
 * Replaces localStorage for public tracking settings:
 * - warranty-public-tracking-settings
 * - complaints-public-tracking-settings
 * 
 * @see docs/LOCALSTORAGE-TO-DATABASE-MIGRATION.md
 */

import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { logError } from '@/lib/logger'

// ============================================================================
// Types
// ============================================================================

export interface PublicTrackingSettings {
  enabled: boolean;
  allowCustomerComments: boolean;
  showEmployeeName: boolean;
  showTimeline: boolean;
}

// ============================================================================
// Defaults
// ============================================================================

export const DEFAULT_TRACKING_SETTINGS: PublicTrackingSettings = {
  enabled: false, // Default to disabled for security
  allowCustomerComments: false,
  showEmployeeName: true,
  showTimeline: true,
};

// ============================================================================
// In-memory cache for sync access
// ============================================================================

let warrantyTrackingCache: PublicTrackingSettings | null = null;
let complaintsTrackingCache: PublicTrackingSettings | null = null;

// ============================================================================
// API functions
// ============================================================================

const PREFERENCE_CATEGORY = 'tracking-settings';
const WARRANTY_KEY = 'warranty-public-tracking';
const COMPLAINTS_KEY = 'complaints-public-tracking';

async function loadFromAPI(key: string): Promise<PublicTrackingSettings> {
  try {
    const response = await fetch(`/api/user-preferences?category=${PREFERENCE_CATEGORY}&key=${key}`);
    if (response.ok) {
      const data = await response.json();
      if (data.value) {
        return { ...DEFAULT_TRACKING_SETTINGS, ...data.value };
      }
    }
  } catch (error) {
    logError(`[usePublicTrackingSettings] Failed to load ${key}`, error);
  }
  return DEFAULT_TRACKING_SETTINGS;
}

async function saveToAPI(key: string, settings: PublicTrackingSettings): Promise<void> {
  try {
    await fetch('/api/user-preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: PREFERENCE_CATEGORY,
        key,
        value: settings,
      }),
    });
  } catch (error) {
    logError(`[usePublicTrackingSettings] Failed to save ${key}`, error);
  }
}

// ============================================================================
// Warranty Tracking Settings Hook
// ============================================================================

export function useWarrantyTrackingSettings() {
  const [settings, setSettings] = useState<PublicTrackingSettings>(
    warrantyTrackingCache || DEFAULT_TRACKING_SETTINGS
  );
  const [isLoading, setIsLoading] = useState(!warrantyTrackingCache);
  const [isSaving, setIsSaving] = useState(false);

  // Load from API on mount
  useEffect(() => {
    if (warrantyTrackingCache) {
      setSettings(warrantyTrackingCache);
      setIsLoading(false);
      return;
    }

    loadFromAPI(WARRANTY_KEY).then(loaded => {
      warrantyTrackingCache = loaded;
      setSettings(loaded);
      setIsLoading(false);
    });
  }, []);

  // Debounced save
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce(async (newSettings: PublicTrackingSettings) => {
      setIsSaving(true);
      await saveToAPI(WARRANTY_KEY, newSettings);
      setIsSaving(false);
    }, 500),
    []
  );

  const updateSettings = useCallback((newSettings: PublicTrackingSettings) => {
    warrantyTrackingCache = newSettings;
    setSettings(newSettings);
    debouncedSave(newSettings);
  }, [debouncedSave]);

  const updateField = useCallback(<K extends keyof PublicTrackingSettings>(
    key: K,
    value: PublicTrackingSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    updateSettings(newSettings);
  }, [settings, updateSettings]);

  return {
    settings,
    setSettings: updateSettings,
    updateField,
    isLoading,
    isSaving,
  };
}

// ============================================================================
// Complaints Tracking Settings Hook
// ============================================================================

export function useComplaintsTrackingSettings() {
  const [settings, setSettings] = useState<PublicTrackingSettings>(
    complaintsTrackingCache || DEFAULT_TRACKING_SETTINGS
  );
  const [isLoading, setIsLoading] = useState(!complaintsTrackingCache);
  const [isSaving, setIsSaving] = useState(false);

  // Load from API on mount
  useEffect(() => {
    if (complaintsTrackingCache) {
      setSettings(complaintsTrackingCache);
      setIsLoading(false);
      return;
    }

    loadFromAPI(COMPLAINTS_KEY).then(loaded => {
      complaintsTrackingCache = loaded;
      setSettings(loaded);
      setIsLoading(false);
    });
  }, []);

  // Debounced save
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce(async (newSettings: PublicTrackingSettings) => {
      setIsSaving(true);
      await saveToAPI(COMPLAINTS_KEY, newSettings);
      setIsSaving(false);
    }, 500),
    []
  );

  const updateSettings = useCallback((newSettings: PublicTrackingSettings) => {
    complaintsTrackingCache = newSettings;
    setSettings(newSettings);
    debouncedSave(newSettings);
  }, [debouncedSave]);

  const updateField = useCallback(<K extends keyof PublicTrackingSettings>(
    key: K,
    value: PublicTrackingSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    updateSettings(newSettings);
  }, [settings, updateSettings]);

  return {
    settings,
    setSettings: updateSettings,
    updateField,
    isLoading,
    isSaving,
  };
}

// ============================================================================
// Synchronous getters (use cached data)
// ============================================================================

/**
 * Get warranty tracking settings synchronously (uses cache)
 * Call initWarrantyTrackingSettings() first for guaranteed data
 */
export function getWarrantyTrackingSettingsSync(): PublicTrackingSettings {
  if (!warrantyTrackingCache) {
    // Trigger async load
    loadFromAPI(WARRANTY_KEY).then(loaded => {
      warrantyTrackingCache = loaded;
    });
    return DEFAULT_TRACKING_SETTINGS;
  }
  return warrantyTrackingCache;
}

/**
 * Get complaints tracking settings synchronously (uses cache)
 */
export function getComplaintsTrackingSettingsSync(): PublicTrackingSettings {
  if (!complaintsTrackingCache) {
    // Trigger async load
    loadFromAPI(COMPLAINTS_KEY).then(loaded => {
      complaintsTrackingCache = loaded;
    });
    return DEFAULT_TRACKING_SETTINGS;
  }
  return complaintsTrackingCache;
}

/**
 * Invalidate complaints tracking cache (call after settings are saved externally)
 */
export function invalidateComplaintsTrackingCache(): void {
  complaintsTrackingCache = null;
}

/**
 * Initialize warranty tracking cache (call early in app lifecycle)
 */
export async function initWarrantyTrackingSettings(): Promise<PublicTrackingSettings> {
  if (!warrantyTrackingCache) {
    warrantyTrackingCache = await loadFromAPI(WARRANTY_KEY);
  }
  return warrantyTrackingCache;
}

/**
 * Initialize complaints tracking cache
 */
export async function initComplaintsTrackingSettings(): Promise<PublicTrackingSettings> {
  if (!complaintsTrackingCache) {
    complaintsTrackingCache = await loadFromAPI(COMPLAINTS_KEY);
  }
  return complaintsTrackingCache;
}
