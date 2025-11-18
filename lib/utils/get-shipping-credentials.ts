/**
 * Helper functions to get shipping partner credentials
 * Centralized source from shipping_partners_config (localStorage)
 */

import { loadShippingConfig } from './shipping-config-migration';
import type { PartnerAccount } from '../types/shipping-config';

export type ShippingCredentials = {
  apiToken: string;
  partnerCode: string;
  account: PartnerAccount;
};

/**
 * Get GHTK credentials from config
 * @throws Error if no active account found
 */
export function getGHTKCredentials(): ShippingCredentials {
  const config = loadShippingConfig();
  const accounts = config.partners.GHTK.accounts;
  
  // Find default active account first, then any active account
  const activeAccount = accounts.find(a => a.isDefault && a.active) 
                     || accounts.find(a => a.active);
  
  if (!activeAccount) {
    throw new Error('Chưa cấu hình GHTK. Vui lòng vào Cài đặt → Đối tác vận chuyển.');
  }
  
  if (!activeAccount.credentials?.apiToken) {
    throw new Error('Tài khoản GHTK chưa có API Token. Vui lòng cấu hình lại.');
  }
  
  return {
    apiToken: activeAccount.credentials.apiToken,
    partnerCode: (activeAccount.credentials as any).partnerCode || '',
    account: activeAccount
  };
}

/**
 * Get GHN credentials from config
 * @throws Error if no active account found
 */
export function getGHNCredentials(): ShippingCredentials {
  const config = loadShippingConfig();
  const accounts = config.partners.GHN.accounts;
  
  const activeAccount = accounts.find(a => a.isDefault && a.active) 
                     || accounts.find(a => a.active);
  
  if (!activeAccount) {
    throw new Error('Chưa cấu hình GHN. Vui lòng vào Cài đặt → Đối tác vận chuyển.');
  }
  
  if (!activeAccount.credentials?.apiToken) {
    throw new Error('Tài khoản GHN chưa có API Token. Vui lòng cấu hình lại.');
  }
  
  return {
    apiToken: activeAccount.credentials.apiToken,
    partnerCode: (activeAccount.credentials as any).partnerCode || '',
    account: activeAccount
  };
}

/**
 * Check if a partner has active account
 */
export function hasActiveAccount(partnerCode: 'GHTK' | 'GHN' | 'VTP' | 'J&T' | 'SPX'): boolean {
  try {
    const config = loadShippingConfig();
    const accounts = config.partners[partnerCode].accounts;
    return accounts.some(a => a.active);
  } catch {
    return false;
  }
}

/**
 * Get all active partners
 */
export function getActivePartners(): Array<'GHTK' | 'GHN' | 'VTP' | 'J&T' | 'SPX'> {
  const partners: Array<'GHTK' | 'GHN' | 'VTP' | 'J&T' | 'SPX'> = ['GHTK', 'GHN', 'VTP', 'J&T', 'SPX'];
  return partners.filter(p => hasActiveAccount(p));
}
