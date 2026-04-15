/**
 * Shipping Configuration Migration - V2 Multi-Account Structure
 * 
 * NOTE: localStorage has been removed - all data comes from API/database
 */

import { ShippingConfig, GlobalShippingConfig, PartnerAccount } from '@/lib/types/shipping-config';
import { logError } from '@/lib/logger'

// In-memory cache
let configCache: ShippingConfig | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 phút cache TTL

/**
 * Get default global config
 */
function getDefaultGlobalConfig(): GlobalShippingConfig {
  return {
    weight: {
      mode: 'FROM_PRODUCTS',
      customValue: 500,
    },
    dimensions: {
      length: 30,
      width: 20,
      height: 10,
    },
    requirement: 'ALLOW_CHECK_NOT_TRY',
    note: '',
    autoSyncCancelStatus: false,
    autoSyncCODCollection: false,
    autoCreateReconciliationSheet: false,
    latePickupWarningDays: 2,
    lateDeliveryWarningDays: 7,
    productSendMode: 'all',
  };
}

/**
 * Get default empty shipping config
 */
export function getDefaultShippingConfig(): ShippingConfig {
  return {
    version: 2,
    partners: {
      GHN: { accounts: [] },
      GHTK: { accounts: [] },
      VTP: { accounts: [] },
      'J&T': { accounts: [] },
      SPX: { accounts: [] },
    },
    global: getDefaultGlobalConfig(),
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Load shipping config from database (async)
 * ⚡ OPTIMIZED: Returns from cache if available and not stale
 */
export async function loadShippingConfigAsync(forceRefresh = false): Promise<ShippingConfig> {
  // ⚡ Return cached config if available and not stale
  const now = Date.now();
  if (!forceRefresh && configCache && (now - cacheTimestamp) < CACHE_TTL) {
    return configCache;
  }
  
  try {
    const response = await fetch('/api/shipping-config');
    if (!response.ok) throw new Error('Failed to fetch');
    const config = await response.json();
    configCache = config;
    cacheTimestamp = now;
    return config;
  } catch (error) {
    logError('[ShippingConfig] Failed to load from database', error);
    // Return cached or default
    return configCache ?? getDefaultShippingConfig();
  }
}

/**
 * Load shipping config (sync) - returns cache or default
 */
export function loadShippingConfig(): ShippingConfig {
  // Return cache if available
  if (configCache) return configCache;
  
  // Return default - async load should be triggered on app init
  return getDefaultShippingConfig();
}

/**
 * Save shipping config to database
 */
export async function saveShippingConfig(config: ShippingConfig): Promise<void> {
  config.lastUpdated = new Date().toISOString();
  
  // Update cache
  configCache = config;
  cacheTimestamp = Date.now();
  
  // Save to database
  try {
    const response = await fetch('/api/shipping-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    if (!response.ok) {
      logError('Failed to save shipping config', response.statusText);
    }
  } catch (error) {
    logError('❌ Error saving shipping config to database', error);
  }
}

/**
 * Get partner accounts
 */
export function getPartnerAccounts(
  config: ShippingConfig,
  partnerCode: keyof ShippingConfig['partners']
): PartnerAccount[] {
  return config.partners[partnerCode]?.accounts || [];
}

/**
 * Get default account for partner
 */
export function getDefaultAccount(
  config: ShippingConfig,
  partnerCode: keyof ShippingConfig['partners']
): PartnerAccount | null {
  const accounts = getPartnerAccounts(config, partnerCode);
  const defaultAcc = accounts.find(acc => acc.isDefault && acc.active);
  
  if (defaultAcc) return defaultAcc;
  
  // Return first active account if no default
  return accounts.find(acc => acc.active) || null;
}

/**
 * Add new account
 */
export function addPartnerAccount(
  config: ShippingConfig,
  partnerCode: keyof ShippingConfig['partners'],
  account: Omit<PartnerAccount, 'id' | 'createdAt' | 'updatedAt'>
): ShippingConfig {
  const newAccount: PartnerAccount = {
    ...account,
    id: `acc_${crypto.randomUUID().slice(0, 12)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  config.partners[partnerCode].accounts.push(newAccount);
  
  return config;
}

/**
 * Update account
 */
export function updatePartnerAccount(
  config: ShippingConfig,
  partnerCode: keyof ShippingConfig['partners'],
  accountId: string,
  updates: Partial<PartnerAccount>
): ShippingConfig {
  const accounts = config.partners[partnerCode].accounts;
  const index = accounts.findIndex(acc => acc.id === accountId);
  
  if (index !== -1) {
    accounts[index] = {
      ...accounts[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
  }
  
  return config;
}

/**
 * Delete account
 */
export function deletePartnerAccount(
  config: ShippingConfig,
  partnerCode: keyof ShippingConfig['partners'],
  accountId: string
): ShippingConfig {
  const accounts = config.partners[partnerCode].accounts;
  const account = accounts.find(acc => acc.id === accountId);
  
  // Remove the account
  config.partners[partnerCode].accounts = accounts.filter(acc => acc.id !== accountId);
  
  // Set a new default if we deleted the default account
  if (account?.isDefault && config.partners[partnerCode].accounts.length > 0) {
    config.partners[partnerCode].accounts[0].isDefault = true;
  }
  
  return config;
}

/**
 * Set default account
 */
export function setDefaultAccount(
  config: ShippingConfig,
  partnerCode: keyof ShippingConfig['partners'],
  accountId: string
): ShippingConfig {
  const accounts = config.partners[partnerCode].accounts;
  
  // Remove default from all accounts
  accounts.forEach(acc => {
    acc.isDefault = false;
  });
  
  // Set new default
  const account = accounts.find(acc => acc.id === accountId);
  if (account) {
    account.isDefault = true;
    account.updatedAt = new Date().toISOString();
  }
  
  return config;
}

/**
 * Update global config
 */
export function updateGlobalConfig(
  config: ShippingConfig,
  updates: Partial<GlobalShippingConfig>
): ShippingConfig {
  config.global = {
    ...config.global,
    ...updates,
  };
  
  saveShippingConfig(config);
  return config;
}

/**
 * Export config as JSON
 */
export function exportShippingConfig(): string {
  const config = loadShippingConfig();
  return JSON.stringify(config, null, 2);
}

/**
 * Import config from JSON
 */
export function importShippingConfig(jsonString: string): ShippingConfig {
  try {
    const config = JSON.parse(jsonString);
    
    if (config.version !== 2) {
      throw new Error('Invalid config version');
    }
    
    saveShippingConfig(config);
    return config;
  } catch (error) {
    logError('Import failed', error);
    throw error;
  }
}

