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

import { logError } from '@/lib/logger'

interface GeneralSettings {
  timezone: string
  dateFormat: string
  timeFormat: '24h' | '12h'
  language: string
  currency: string
  logoUrl?: string
}

interface BrandingInfo {
  logoUrl?: string | null
  faviconUrl?: string | null
}

const DEFAULT_GENERAL_SETTINGS: GeneralSettings = {
  timezone: 'Asia/Ho_Chi_Minh',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
  language: 'vi',
  currency: 'VND',
}

// In-memory cache
let settingsCache: GeneralSettings | null = null
let isLoading = false
let loadPromise: Promise<GeneralSettings | null> | null = null

function buildApiUrl(path: string): string {
  if (typeof window !== 'undefined') return path

  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

  return path.startsWith('http') ? path : `${base}${path}`
}

/**
 * Load branding info (logo, favicon) from API
 * Returns null if fetch fails
 */
async function fetchBrandingInfo(): Promise<BrandingInfo | null> {
  try {
    const res = await fetch(buildApiUrl('/api/branding'), {
      credentials: 'include',
      cache: 'no-store',
    })
    if (res.ok) {
      const data = await res.json()
      if (data.success && data.data) {
        return data.data as BrandingInfo
      }
    }
  } catch (error) {
    logError('Failed to load branding info from API', error)
  }
  return null
}

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
    const result = await loadPromise
    return result ?? DEFAULT_GENERAL_SETTINGS
  }

  isLoading = true

  loadPromise = (async () => {
    // Fetch settings and branding in parallel
    const [settingsResult, brandingResult] = await Promise.allSettled([
      fetchSettingsFromApi(),
      fetchBrandingInfo(),
    ])

    // Get settings (may be null if failed)
    const settings = settingsResult.status === 'fulfilled' ? settingsResult.value : null
    
    // Get branding (may be null if failed)
    const branding = brandingResult.status === 'fulfilled' ? brandingResult.value : null

    // If we have settings from API, use them as base
    if (settings) {
      // Merge branding logo into settings if not already present
      if (!settings.logoUrl && branding?.logoUrl) {
        settings.logoUrl = branding.logoUrl
      }
      settingsCache = {
        ...DEFAULT_GENERAL_SETTINGS,
        ...settings,
      }
      return settingsCache
    }

    // Fallback: Try branding only if settings failed
    if (branding?.logoUrl) {
      settingsCache = {
        ...DEFAULT_GENERAL_SETTINGS,
        logoUrl: branding.logoUrl,
      }
      return settingsCache
    }

    // Return defaults if everything fails
    settingsCache = DEFAULT_GENERAL_SETTINGS
    return settingsCache
  })()

  try {
    const result = await loadPromise
    return result ?? DEFAULT_GENERAL_SETTINGS
  } finally {
    isLoading = false
    loadPromise = null
  }
}

/**
 * Fetch general settings from /api/settings endpoint
 */
async function fetchSettingsFromApi(): Promise<Partial<GeneralSettings> | null> {
  try {
    const res = await fetch(buildApiUrl('/api/settings?group=general'), {
      credentials: 'include',
      cache: 'no-store',
    })
    if (res.ok) {
      const data = await res.json()

      if (data.grouped?.general) {
        return data.grouped.general as Partial<GeneralSettings>
      }

      // Parse array format
      if (data.data && Array.isArray(data.data)) {
        const parsed = (data.data as Array<{ key: string; value: unknown }>).reduce(
          (acc: Record<string, unknown>, item) => {
            acc[item.key] = item.value
            return acc
          },
          {}
        )
        return parsed as Partial<GeneralSettings>
      }
    }
  } catch (error) {
    logError('Failed to load general settings from API', error)
  }
  return null
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
