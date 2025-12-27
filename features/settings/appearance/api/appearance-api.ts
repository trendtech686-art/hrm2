/**
 * Appearance Settings API Layer
 */

import type { Theme, Font, FontSize, ColorMode, CustomThemeConfig } from '../store';

export interface AppearanceSettings {
  theme: Theme;
  font: Font;
  fontSize: FontSize;
  colorMode: ColorMode;
  customTheme?: CustomThemeConfig;
}

const BASE_URL = '/api/settings/appearance';

export async function fetchAppearanceSettings(): Promise<AppearanceSettings> {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function updateAppearanceSettings(data: Partial<AppearanceSettings>): Promise<AppearanceSettings> {
  const res = await fetch(BASE_URL, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
}

export async function saveCustomTheme(config: CustomThemeConfig): Promise<CustomThemeConfig> {
  const res = await fetch(`${BASE_URL}/custom-theme`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(config) });
  if (!res.ok) throw new Error('Failed to save');
  return res.json();
}
