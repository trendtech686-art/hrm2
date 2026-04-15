'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from '@/lib/revalidation';
import { logError } from '@/lib/logger'
import { getSessionFromCookie } from '@/lib/api-utils'

type UserPreference = NonNullable<Awaited<ReturnType<typeof prisma.userPreference.findFirst>>>;

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface UserPreferenceFilters {
  userId: string;
  category?: string;
}

/**
 * Get all preferences for a user
 */
export async function getUserPreferences(
  userId: string,
  category?: string
): Promise<ActionResult<UserPreference[]>> {
  const session = await getSessionFromCookie()
  if (!session?.user) return { success: false, error: 'ChÆ°a Ä‘Äƒng nháº­p' } as any

  try {
    const where: Record<string, unknown> = { userId };
    if (category) where.category = category;

    const preferences = await prisma.userPreference.findMany({
      where,
      orderBy: { key: 'asc' },
    });

    return { success: true, data: preferences };
  } catch (error) {
    logError('Failed to fetch user preferences', error);
    return { success: false, error: 'KhÃ´ng thá»ƒ táº£i cÃ i Ä‘áº·t ngÆ°á»i dÃ¹ng' };
  }
}

/**
 * Get a single preference by key
 */
export async function getUserPreference(
  userId: string,
  key: string
): Promise<ActionResult<UserPreference | null>> {
  const session = await getSessionFromCookie()
  if (!session?.user) return { success: false, error: 'ChÆ°a Ä‘Äƒng nháº­p' } as any

  try {
    const preference = await prisma.userPreference.findUnique({
      where: { userId_key: { userId, key } },
    });

    return { success: true, data: preference };
  } catch (error) {
    logError('Failed to fetch user preference', error);
    return { success: false, error: 'KhÃ´ng thá»ƒ táº£i cÃ i Ä‘áº·t' };
  }
}

/**
 * Get preference value directly
 */
export async function getUserPreferenceValue<T = unknown>(
  userId: string,
  key: string,
  defaultValue?: T
): Promise<ActionResult<T>> {
  try {
    const preference = await prisma.userPreference.findUnique({
      where: { userId_key: { userId, key } },
    });

    if (!preference) {
      return { success: true, data: defaultValue as T };
    }

    return { success: true, data: preference.value as T };
  } catch (error) {
    logError('Failed to fetch user preference value', error);
    return { success: false, error: 'KhÃ´ng thá»ƒ táº£i cÃ i Ä‘áº·t' };
  }
}

/**
 * Set a preference (create or update)
 */
export async function setUserPreference(
  userId: string,
  key: string,
  value: unknown,
  category?: string
): Promise<ActionResult<UserPreference>> {
  const session = await getSessionFromCookie()
  if (!session?.user) return { success: false, error: 'ChÆ°a Ä‘Äƒng nháº­p' } as any

  try {
    const preference = await prisma.userPreference.upsert({
      where: { userId_key: { userId, key } },
      update: {
        value: value as object,
        category,
      },
      create: {
        userId,
        key,
        value: value as object,
        category,
      },
    });

    revalidatePath('/settings');
    return { success: true, data: preference };
  } catch (error) {
    logError('Failed to set user preference', error);
    return { success: false, error: 'KhÃ´ng thá»ƒ lÆ°u cÃ i Ä‘áº·t' };
  }
}

/**
 * Set multiple preferences at once
 */
export async function setUserPreferences(
  userId: string,
  preferences: { key: string; value: unknown; category?: string }[]
): Promise<ActionResult<{ count: number }>> {
  const session = await getSessionFromCookie()
  if (!session?.user) return { success: false, error: 'ChÆ°a Ä‘Äƒng nháº­p' } as any

  try {
    await prisma.$transaction(
      preferences.map((pref) =>
        prisma.userPreference.upsert({
          where: { userId_key: { userId, key: pref.key } },
          update: {
            value: pref.value as object,
            category: pref.category,
          },
          create: {
            userId,
            key: pref.key,
            value: pref.value as object,
            category: pref.category,
          },
        })
      )
    );

    revalidatePath('/settings');
    return { success: true, data: { count: preferences.length } };
  } catch (error) {
    logError('Failed to set user preferences', error);
    return { success: false, error: 'KhÃ´ng thá»ƒ lÆ°u cÃ i Ä‘áº·t' };
  }
}

/**
 * Delete a preference
 */
export async function deleteUserPreference(
  userId: string,
  key: string
): Promise<ActionResult<{ deleted: boolean }>> {
  const session = await getSessionFromCookie()
  if (!session?.user) return { success: false, error: 'ChÆ°a Ä‘Äƒng nháº­p' } as any
  try {
    await prisma.userPreference.delete({
      where: { userId_key: { userId, key } },
    });

    revalidatePath('/settings');
    return { success: true, data: { deleted: true } };
  } catch (error) {
    logError('Failed to delete user preference', error);
    return { success: false, error: 'KhÃ´ng thá»ƒ xÃ³a cÃ i Ä‘áº·t' };
  }
}

/**
 * Delete all preferences for a user
 */
export async function clearUserPreferences(
  userId: string,
  category?: string
): Promise<ActionResult<{ count: number }>> {
  const session = await getSessionFromCookie()
  if (!session?.user) return { success: false, error: 'ChÆ°a Ä‘Äƒng nháº­p' } as any
  try {
    const where: Record<string, unknown> = { userId };
    if (category) where.category = category;

    const result = await prisma.userPreference.deleteMany({ where });

    revalidatePath('/settings');
    return { success: true, data: { count: result.count } };
  } catch (error) {
    logError('Failed to clear user preferences', error);
    return { success: false, error: 'KhÃ´ng thá»ƒ xÃ³a táº¥t cáº£ cÃ i Ä‘áº·t' };
  }
}

// ============== Common preference keys ==============

export async function getThemePreference(userId: string): Promise<ActionResult<'light' | 'dark' | 'system'>> {
  const session = await getSessionFromCookie()
  if (!session?.user) return { success: false, error: 'ChÆ°a Ä‘Äƒng nháº­p' } as any

  const result = await getUserPreferenceValue<'light' | 'dark' | 'system'>(userId, 'theme', 'system');
  return result;
}

export async function setThemePreference(userId: string, theme: 'light' | 'dark' | 'system') {
  const session = await getSessionFromCookie()
  if (!session?.user) return { success: false, error: 'ChÆ°a Ä‘Äƒng nháº­p' } as any

  return setUserPreference(userId, 'theme', theme, 'appearance');
}

export async function getLanguagePreference(userId: string): Promise<ActionResult<string>> {
  const session = await getSessionFromCookie()
  if (!session?.user) return { success: false, error: 'ChÆ°a Ä‘Äƒng nháº­p' } as any

  const result = await getUserPreferenceValue<string>(userId, 'language', 'vi');
  return result;
}

export async function setLanguagePreference(userId: string, language: string) {
  const session = await getSessionFromCookie()
  if (!session?.user) return { success: false, error: 'ChÆ°a Ä‘Äƒng nháº­p' } as any

  return setUserPreference(userId, 'language', language, 'general');
}

export async function getSidebarCollapsed(userId: string): Promise<ActionResult<boolean>> {
  const session = await getSessionFromCookie()
  if (!session?.user) return { success: false, error: 'ChÆ°a Ä‘Äƒng nháº­p' } as any

  const result = await getUserPreferenceValue<boolean>(userId, 'sidebar_collapsed', false);
  return result;
}

export async function setSidebarCollapsed(userId: string, collapsed: boolean) {
  const session = await getSessionFromCookie()
  if (!session?.user) return { success: false, error: 'ChÆ°a Ä‘Äƒng nháº­p' } as any

  return setUserPreference(userId, 'sidebar_collapsed', collapsed, 'layout');
}

export async function getDefaultBranch(userId: string): Promise<ActionResult<string | null>> {
  const session = await getSessionFromCookie()
  if (!session?.user) return { success: false, error: 'ChÆ°a Ä‘Äƒng nháº­p' } as any

  const result = await getUserPreferenceValue<string | null>(userId, 'default_branch', null);
  return result;
}

export async function setDefaultBranch(userId: string, branchId: string) {
  const session = await getSessionFromCookie()
  if (!session?.user) return { success: false, error: 'ChÆ°a Ä‘Äƒng nháº­p' } as any

  return setUserPreference(userId, 'default_branch', branchId, 'general');
}

export async function getTableSettings(
  userId: string,
  tableId: string
): Promise<ActionResult<{
  columns?: string[];
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}>> {
  const session = await getSessionFromCookie()
  if (!session?.user) return { success: false, error: 'ChÆ°a Ä‘Äƒng nháº­p' } as any

  const result = await getUserPreferenceValue<{
    columns?: string[];
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }>(userId, `table_${tableId}`, {});
  return result;
}

export async function setTableSettings(
  userId: string,
  tableId: string,
  settings: {
    columns?: string[];
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }
) {
  const session = await getSessionFromCookie()
  if (!session?.user) return { success: false, error: 'ChÆ°a Ä‘Äƒng nháº­p' } as any

  return setUserPreference(userId, `table_${tableId}`, settings, 'table');
}

export async function getDashboardLayout(
  userId: string
): Promise<ActionResult<{ widgets?: string[]; layout?: unknown }>> {
  const session = await getSessionFromCookie()
  if (!session?.user) return { success: false, error: 'ChÆ°a Ä‘Äƒng nháº­p' } as any

  const result = await getUserPreferenceValue<{ widgets?: string[]; layout?: unknown }>(
    userId,
    'dashboard_layout',
    {}
  );
  return result;
}

export async function setDashboardLayout(
  userId: string,
  layout: { widgets?: string[]; layout?: unknown }
) {
  const session = await getSessionFromCookie()
  if (!session?.user) return { success: false, error: 'ChÆ°a Ä‘Äƒng nháº­p' } as any

  return setUserPreference(userId, 'dashboard_layout', layout, 'dashboard');
}
