/**
 * Settings API Sync Helper
 * 
 * Helper functions to sync settings stores with PostgreSQL API
 */

const API_BASE = '/api/settings';

export interface SettingSyncConfig {
  group: string;
  key?: string;
}

/**
 * Fetch settings from API by group
 */
export async function fetchSettingsFromAPI<T>(config: SettingSyncConfig): Promise<T | null> {
  try {
    const params = new URLSearchParams();
    params.set('group', config.group);
    if (config.key) {
      params.set('key', config.key);
    }
    
    const response = await fetch(`${API_BASE}?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch settings: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // If specific key requested, return the value
    if (config.key && data.value !== undefined) {
      return data.value as T;
    }
    
    // Return grouped data for the specified group
    return data.grouped?.[config.group] as T || null;
  } catch (error) {
    console.error(`[Settings Sync] Error fetching ${config.group}:`, error);
    return null;
  }
}

/**
 * Save settings to API
 */
export async function saveSettingsToAPI(
  group: string,
  key: string,
  value: any,
  description?: string
): Promise<boolean> {
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        group,
        key,
        value: typeof value === 'object' ? JSON.stringify(value) : value,
        description,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to save setting: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error(`[Settings Sync] Error saving ${group}.${key}:`, error);
    return false;
  }
}

/**
 * Bulk save settings to API
 */
export async function bulkSaveSettingsToAPI(
  group: string,
  settings: Record<string, any>
): Promise<boolean> {
  try {
    const settingsArray = Object.entries(settings).map(([key, value]) => ({
      group,
      key,
      value: typeof value === 'object' ? JSON.stringify(value) : value,
    }));
    
    const response = await fetch(API_BASE, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ settings: settingsArray }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to bulk save settings: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error(`[Settings Sync] Error bulk saving ${group}:`, error);
    return false;
  }
}

/**
 * Create a settings sync middleware for Zustand stores
 * This wraps store actions to also sync to API
 */
export function createSettingsSyncMiddleware(group: string) {
  return (setter: Function) => {
    return (partialState: any) => {
      // Apply local state first
      setter(partialState);
      
      // Sync to API in background
      if (typeof partialState === 'object' && partialState !== null) {
        bulkSaveSettingsToAPI(group, partialState).catch(console.error);
      }
    };
  };
}

/**
 * Hook to initialize settings from API
 */
export async function initializeSettingsFromAPI<T>(
  group: string,
  setSettings: (settings: T) => void,
  defaultSettings: T
): Promise<void> {
  const apiSettings = await fetchSettingsFromAPI<T>({ group });
  
  if (apiSettings) {
    // Parse JSON strings back to objects if needed
    const parsedSettings = Object.entries(apiSettings).reduce((acc, [key, value]) => {
      try {
        if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
          acc[key as keyof T] = JSON.parse(value);
        } else {
          acc[key as keyof T] = value as T[keyof T];
        }
      } catch {
        acc[key as keyof T] = value as T[keyof T];
      }
      return acc;
    }, {} as T);
    
    setSettings({ ...defaultSettings, ...parsedSettings });
  }
}
