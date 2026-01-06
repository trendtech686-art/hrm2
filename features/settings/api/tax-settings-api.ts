/**
 * Tax Settings API Client
 * Uses /api/settings with group='tax'
 */

export interface TaxSettings {
  priceIncludesTax: boolean;
  defaultSaleTaxId: string | null;
  defaultPurchaseTaxId: string | null;
}

const API_BASE = '/api/settings';
const SETTING_GROUP = 'tax';

export async function fetchTaxSettings(): Promise<TaxSettings> {
  const response = await fetch(`${API_BASE}?group=${SETTING_GROUP}`, {
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch tax settings');
  }
  
  const { grouped } = await response.json();
  const taxSettings = grouped?.[SETTING_GROUP] || {};
  
  return {
    priceIncludesTax: taxSettings.priceIncludesTax ?? false,
    defaultSaleTaxId: taxSettings.defaultSaleTaxId ?? null,
    defaultPurchaseTaxId: taxSettings.defaultPurchaseTaxId ?? null,
  };
}

export async function updateTaxSettings(data: Partial<TaxSettings>): Promise<TaxSettings> {
  // Update each setting individually
  const updates = Object.entries(data).filter(([, value]) => value !== undefined);
  
  await Promise.all(
    updates.map(([key, value]) =>
      fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          group: SETTING_GROUP,
          key,
          value,
        }),
      })
    )
  );
  
  // Return updated settings
  return fetchTaxSettings();
}

export async function resetTaxSettings(): Promise<TaxSettings> {
  return updateTaxSettings({
    priceIncludesTax: false,
    defaultSaleTaxId: null,
    defaultPurchaseTaxId: null,
  });
}
