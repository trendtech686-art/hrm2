'use server';

import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { revalidatePath } from '@/lib/revalidation';
import { generateIdWithPrefix } from '@/lib/id-generator';

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export type Theme = 'light' | 'dark' | 'system' | 'custom';
export type Font = 'inter' | 'roboto' | 'open-sans' | 'lato' | 'poppins';
export type FontSize = 'small' | 'medium' | 'large';
export type ColorMode = 'default' | 'colorful' | 'muted';

export interface CustomThemeConfig {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
}

export interface AppearanceSettings {
  theme: Theme;
  font: Font;
  fontSize: FontSize;
  colorMode: ColorMode;
  customTheme?: CustomThemeConfig;
}

const SETTINGS_TYPE = 'appearance';

/**
 * Get appearance settings
 */
export async function getAppearanceSettings(): Promise<ActionResult<AppearanceSettings>> {
  try {
    const settings = await prisma.settingsData.findFirst({
      where: { type: SETTINGS_TYPE },
    });

    const defaultSettings: AppearanceSettings = {
      theme: 'system',
      font: 'inter',
      fontSize: 'medium',
      colorMode: 'default',
    };

    if (!settings) {
      return { success: true, data: defaultSettings };
    }

    const metadata = settings.metadata as Record<string, unknown> || {};
    return {
      success: true,
      data: {
        theme: (metadata.theme as Theme) || defaultSettings.theme,
        font: (metadata.font as Font) || defaultSettings.font,
        fontSize: (metadata.fontSize as FontSize) || defaultSettings.fontSize,
        colorMode: (metadata.colorMode as ColorMode) || defaultSettings.colorMode,
        customTheme: metadata.customTheme as CustomThemeConfig | undefined,
      },
    };
  } catch (error) {
    console.error('Failed to get appearance settings:', error);
    return { success: false, error: 'Không thể tải cài đặt giao diện' };
  }
}

/**
 * Update appearance settings
 */
export async function updateAppearanceSettings(
  data: Partial<AppearanceSettings>
): Promise<ActionResult<AppearanceSettings>> {
  try {
    const existing = await prisma.settingsData.findFirst({
      where: { type: SETTINGS_TYPE },
    });

    const existingMetadata = (existing?.metadata as Record<string, unknown>) || {};
    const newMetadata = { ...existingMetadata, ...data };

    if (existing) {
      await prisma.settingsData.update({
        where: { systemId: existing.systemId },
        data: { metadata: newMetadata as Prisma.InputJsonValue },
      });
    } else {
      const settingsId = await generateIdWithPrefix('APPEARANCE', prisma);
      await prisma.settingsData.create({
        data: {
          systemId: settingsId,
          id: settingsId,
          type: SETTINGS_TYPE,
          name: 'Appearance Settings',
          metadata: newMetadata as Prisma.InputJsonValue,
        },
      });
    }

    revalidatePath('/settings/appearance');
    return {
      success: true,
      data: newMetadata as AppearanceSettings,
    };
  } catch (error) {
    console.error('Failed to update appearance settings:', error);
    return { success: false, error: 'Không thể cập nhật cài đặt giao diện' };
  }
}

/**
 * Save custom theme
 */
export async function saveCustomTheme(
  config: CustomThemeConfig
): Promise<ActionResult<CustomThemeConfig>> {
  try {
    const existing = await prisma.settingsData.findFirst({
      where: { type: SETTINGS_TYPE },
    });

    const existingMetadata = (existing?.metadata as Record<string, unknown>) || {};
    const newMetadata = { ...existingMetadata, customTheme: config };

    if (existing) {
      await prisma.settingsData.update({
        where: { systemId: existing.systemId },
        data: { metadata: newMetadata as unknown as Prisma.InputJsonValue },
      });
    } else {
      const settingsId = await generateIdWithPrefix('APPEARANCE', prisma);
      await prisma.settingsData.create({
        data: {
          systemId: settingsId,
          id: settingsId,
          type: SETTINGS_TYPE,
          name: 'Appearance Settings',
          metadata: newMetadata as unknown as Prisma.InputJsonValue,
        },
      });
    }

    revalidatePath('/settings/appearance');
    return { success: true, data: config };
  } catch (error) {
    console.error('Failed to save custom theme:', error);
    return { success: false, error: 'Không thể lưu theme tùy chỉnh' };
  }
}

/**
 * Reset appearance to defaults
 */
export async function resetAppearanceSettings(): Promise<ActionResult<AppearanceSettings>> {
  try {
    const defaultSettings: AppearanceSettings = {
      theme: 'system',
      font: 'inter',
      fontSize: 'medium',
      colorMode: 'default',
    };

    const existing = await prisma.settingsData.findFirst({
      where: { type: SETTINGS_TYPE },
    });

    if (existing) {
      await prisma.settingsData.update({
        where: { systemId: existing.systemId },
        data: { metadata: defaultSettings as unknown as Prisma.InputJsonValue },
      });
    }

    revalidatePath('/settings/appearance');
    return { success: true, data: defaultSettings };
  } catch (error) {
    console.error('Failed to reset appearance settings:', error);
    return { success: false, error: 'Không thể đặt lại cài đặt giao diện' };
  }
}
