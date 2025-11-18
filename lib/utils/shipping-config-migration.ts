/**
 * Shipping Configuration Migration - V2 Multi-Account Structure
 */

import { ShippingConfig, GlobalShippingConfig, PartnerAccount } from '@/lib/types/shipping-config';

const STORAGE_KEY = 'shipping_partners_config';

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
    latePickupWarningDays: 2,
    lateDeliveryWarningDays: 7,
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
      VNPOST: { accounts: [] },
      NINJA_VAN: { accounts: [] },
      AHAMOVE: { accounts: [] },
    },
    global: getDefaultGlobalConfig(),
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Load shipping config from localStorage
 */
export function loadShippingConfig(): ShippingConfig {
  const data = localStorage.getItem(STORAGE_KEY);
  
  if (data) {
    try {
      const config = JSON.parse(data);
      
      // If it's V2 format, migrate old 'email' field to 'apiToken' if needed
      if (config.version === 2 && config.partners) {
        // ✅ Auto-migrate GHTK credentials from 'email' to 'apiToken'
        if (config.partners.GHTK?.accounts) {
          config.partners.GHTK.accounts.forEach((account: any) => {
            if (account.credentials?.email && !account.credentials?.apiToken) {
              console.log('🔄 [Migration] Converting GHTK credentials from email to apiToken');
              account.credentials.apiToken = account.credentials.email;
              delete account.credentials.email;
            }
          });
          // Save migrated config
          saveShippingConfig(config);
        }
        return config;
      }
    } catch (error) {
      console.error('Failed to parse config:', error);
    }
  }
  
  // No config found, return empty V2 structure
  const newConfig = getDefaultShippingConfig();
  saveShippingConfig(newConfig);
  return newConfig;
}

/**
 * Save shipping config
 */
export function saveShippingConfig(config: ShippingConfig): void {
  config.lastUpdated = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  console.log('✅ Shipping config saved');
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
    id: `acc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  config.partners[partnerCode].accounts.push(newAccount);
  saveShippingConfig(config);
  
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
    
    saveShippingConfig(config);
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
  
  saveShippingConfig(config);
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
  
  saveShippingConfig(config);
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
    console.error('Import failed:', error);
    throw error;
  }
}

