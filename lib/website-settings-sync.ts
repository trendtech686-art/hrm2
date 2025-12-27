/**
 * Website Settings Sync Utility
 * Synchronizes website settings with database as source of truth
 * Uses in-memory cache for fast synchronous access
 * 
 * NOTE: localStorage has been removed - all data comes from API/database
 */

// Types
export interface WebsiteSettings {
  primaryDomain: string;
  additionalDomains: string[];
  wwwRedirect: 'www-to-non-www' | 'non-www-to-www' | 'keep';
  trailingSlash: 'add' | 'remove' | 'keep';
  sslEnabled: boolean;
  forceHttps: boolean;
  sslCertExpiry: string;
  sslAutoRenew: boolean;
  custom404Enabled: boolean;
  custom404Title: string;
  custom404Content: string;
  custom404RedirectUrl: string;
  custom404RedirectDelay: number;
}

export interface Redirect301 {
  id: string;
  fromUrl: string;
  toUrl: string;
  isActive: boolean;
  hitCount: number;
  createdAt: string;
  updatedAt: string;
}

// API endpoint
const API_ENDPOINT = '/api/website-settings';

// Defaults
const DEFAULT_SETTINGS: WebsiteSettings = {
  primaryDomain: '',
  additionalDomains: [],
  wwwRedirect: 'www-to-non-www',
  trailingSlash: 'remove',
  sslEnabled: true,
  forceHttps: true,
  sslCertExpiry: '',
  sslAutoRenew: true,
  custom404Enabled: false,
  custom404Title: 'Trang không tồn tại',
  custom404Content: '<p>Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>',
  custom404RedirectUrl: '',
  custom404RedirectDelay: 5,
};

const DEFAULT_REDIRECTS: Redirect301[] = [];

// In-memory cache
let settingsCache: WebsiteSettings | null = null;
let redirectsCache: Redirect301[] | null = null;
let isInitialized = false;

// ============== SETTINGS ==============

/**
 * Load settings from database
 */
export async function loadWebsiteSettingsAsync(): Promise<WebsiteSettings> {
  try {
    const res = await fetch(`${API_ENDPOINT}?type=settings`);
    if (res.ok) {
      const data = await res.json();
      settingsCache = { ...DEFAULT_SETTINGS, ...data };
      return settingsCache;
    }
  } catch (error) {
    console.error('[WebsiteSettings] Error loading from database:', error);
  }

  // Return cache or defaults if API fails
  return settingsCache ?? DEFAULT_SETTINGS;
}

/**
 * Get settings synchronously (from cache only)
 */
export function getWebsiteSettingsSync(): WebsiteSettings {
  return settingsCache ?? DEFAULT_SETTINGS;
}

/**
 * Save settings to database
 */
export async function saveWebsiteSettingsAsync(settings: WebsiteSettings): Promise<void> {
  // Update cache immediately
  settingsCache = settings;

  // Save to database
  try {
    await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'settings', data: settings }),
    });
  } catch (error) {
    console.error('[WebsiteSettings] Error saving to database:', error);
  }
}

// ============== REDIRECTS ==============

/**
 * Load redirects from database
 */
export async function loadRedirectsAsync(): Promise<Redirect301[]> {
  try {
    const res = await fetch(`${API_ENDPOINT}?type=redirects`);
    if (res.ok) {
      const data = await res.json();
      redirectsCache = data;
      return redirectsCache;
    }
  } catch (error) {
    console.error('[WebsiteSettings] Error loading redirects from database:', error);
  }

  // Return cache or defaults if API fails
  return redirectsCache ?? DEFAULT_REDIRECTS;
}

/**
 * Get redirects synchronously (from cache only)
 */
export function getRedirectsSync(): Redirect301[] {
  return redirectsCache ?? DEFAULT_REDIRECTS;
}

/**
 * Save redirects to database
 */
export async function saveRedirectsAsync(redirects: Redirect301[]): Promise<void> {
  // Update cache immediately
  redirectsCache = redirects;

  // Save to database
  try {
    await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'redirects', data: redirects }),
    });
  } catch (error) {
    console.error('[WebsiteSettings] Error saving redirects to database:', error);
  }
}

// ============== INITIALIZATION ==============

/**
 * Initialize both settings and redirects from database
 * Call this on app startup
 */
export async function initWebsiteSettings(): Promise<void> {
  if (isInitialized) return;
  
  await Promise.all([
    loadWebsiteSettingsAsync(),
    loadRedirectsAsync(),
  ]);
  
  isInitialized = true;
  console.log('[WebsiteSettings] Initialized from database');
}

/**
 * Force refresh from database
 */
export async function refreshWebsiteSettings(): Promise<void> {
  isInitialized = false;
  settingsCache = null;
  redirectsCache = null;
  await initWebsiteSettings();
}
