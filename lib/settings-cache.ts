/**
 * Global Settings Cache
 * 
 * Cung cấp cache in-memory cho các settings đọc từ database.
 * Được sử dụng bởi các utility functions không thể dùng React hooks.
 * 
 * Flow:
 * 1. App khởi động -> gọi loadGeneralSettings() từ AuthProvider/Layout
 * 2. Utility functions đọc từ cache qua getGeneralSettingsSync()
 * 3. Nếu cache rỗng, fallback về default values
 * 
 * NOTE: localStorage has been removed - all data comes from API/database
 */

interface GeneralSettings {
  timezone: string
  dateFormat: string
  timeFormat: '24h' | '12h'
  language: string
  currency: string
  storeName: string
  storeAddress: string
  storePhone: string
  logoUrl?: string
  // Add more fields as needed
}

const DEFAULT_GENERAL_SETTINGS: GeneralSettings = {
  timezone: 'Asia/Ho_Chi_Minh',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
  language: 'vi',
  currency: 'VND',
  storeName: '',
  storeAddress: '',
  storePhone: '',
}

// In-memory cache
let settingsCache: GeneralSettings | null = null
let isLoading = false
let loadPromise: Promise<GeneralSettings> | null = null

/**
 * Load general settings from database API
 * Should be called once when app initializes
 */
export async function loadGeneralSettings(): Promise<GeneralSettings> {
  // Return cached if available
  if (settingsCache) {
    return settingsCache
  }

  // Prevent multiple simultaneous loads
  if (loadPromise) {
    return loadPromise
  }

  isLoading = true

  loadPromise = (async () => {
    try {
      // Try API first
      const res = await fetch('/api/settings?group=general')
      if (res.ok) {
        const data = await res.json()
        
        if (data.grouped?.general) {
          settingsCache = {
            ...DEFAULT_GENERAL_SETTINGS,
            ...data.grouped.general,
          }
          return settingsCache
        }

        // Parse array format
        if (data.data && Array.isArray(data.data)) {
          const parsed = data.data.reduce((acc: Record<string, any>, item: any) => {
            acc[item.key] = item.value
            return acc
          }, {})
          
          settingsCache = {
            ...DEFAULT_GENERAL_SETTINGS,
            ...parsed,
          }
          return settingsCache
        }
      }
    } catch (error) {
      console.error('Failed to load general settings from API:', error)
    }

    // Return defaults if API fails
    settingsCache = DEFAULT_GENERAL_SETTINGS
    return settingsCache
  })()

  try {
    return await loadPromise
  } finally {
    isLoading = false
    loadPromise = null
  }
}

/**
 * Get general settings synchronously from cache
 * Falls back to defaults if not loaded yet
 */
export function getGeneralSettingsSync(): GeneralSettings {
  // Return from cache if available
  if (settingsCache) {
    return settingsCache
  }

  return DEFAULT_GENERAL_SETTINGS
}

/**
 * Update settings cache (call after saving settings)
 */
export function updateGeneralSettingsCache(settings: Partial<GeneralSettings>) {
  settingsCache = {
    ...(settingsCache || DEFAULT_GENERAL_SETTINGS),
    ...settings,
  }
}

/**
 * Clear settings cache (call on logout)
 */
export function clearGeneralSettingsCache() {
  settingsCache = null
  loadPromise = null
}

/**
 * Check if settings are loaded
 */
export function isSettingsLoaded(): boolean {
  return settingsCache !== null
}

/**
 * Check if settings are currently loading
 */
export function isSettingsLoading(): boolean {
  return isLoading
}

// Export defaults for reference
export { DEFAULT_GENERAL_SETTINGS }
export type { GeneralSettings }
