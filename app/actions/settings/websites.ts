'use server';

import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { revalidatePath } from '@/lib/revalidation';
import { generateIdWithPrefix } from '@/lib/id-generator';

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface WebsiteDefinition {
  systemId: string;
  code: string;
  name: string;
  domain: string;
  apiUrl?: string;
  apiKey?: string;
  syncEnabled: boolean;
  syncInterval?: number;
  isActive: boolean;
  settings?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

const SETTINGS_TYPE = 'websites';

/**
 * Get all websites
 */
export async function getWebsites(): Promise<ActionResult<WebsiteDefinition[]>> {
  try {
    const settings = await prisma.settingsData.findFirst({
      where: { type: SETTINGS_TYPE },
    });

    if (!settings) {
      return { success: true, data: [] };
    }

    const websites = (settings.metadata as Record<string, unknown>)?.websites as WebsiteDefinition[] || [];
    return { success: true, data: websites };
  } catch (error) {
    console.error('Failed to get websites:', error);
    return { success: false, error: 'Không thể tải danh sách website' };
  }
}

/**
 * Get website by code
 */
export async function getWebsiteByCode(
  code: string
): Promise<ActionResult<WebsiteDefinition | null>> {
  try {
    const result = await getWebsites();
    if (!result.success) return { success: false, error: result.error };

    const website = result.data.find((w) => w.code === code);
    return { success: true, data: website || null };
  } catch (error) {
    console.error('Failed to get website:', error);
    return { success: false, error: 'Không thể tải website' };
  }
}

/**
 * Get active websites
 */
export async function getActiveWebsites(): Promise<ActionResult<WebsiteDefinition[]>> {
  try {
    const result = await getWebsites();
    if (!result.success) return { success: false, error: result.error };

    const activeWebsites = result.data.filter((w) => w.isActive);
    return { success: true, data: activeWebsites };
  } catch (error) {
    console.error('Failed to get active websites:', error);
    return { success: false, error: 'Không thể tải website đang hoạt động' };
  }
}

/**
 * Save websites
 */
async function saveWebsites(websites: WebsiteDefinition[]): Promise<void> {
  const existing = await prisma.settingsData.findFirst({
    where: { type: SETTINGS_TYPE },
  });

  if (existing) {
    await prisma.settingsData.update({
      where: { systemId: existing.systemId },
      data: { metadata: { websites } as unknown as Prisma.InputJsonValue },
    });
  } else {
    const tempId = await generateIdWithPrefix('WEBSITES', prisma);
    await prisma.settingsData.create({
      data: {
        systemId: tempId,
        id: tempId,
        type: SETTINGS_TYPE,
        name: 'Website Definitions',
        metadata: { websites } as unknown as Prisma.InputJsonValue,
      },
    });
  }
}

/**
 * Create website
 */
export async function createWebsite(
  data: Omit<WebsiteDefinition, 'systemId' | 'createdAt' | 'updatedAt'>
): Promise<ActionResult<WebsiteDefinition>> {
  try {
    const result = await getWebsites();
    if (!result.success) return { success: false, error: result.error };

    // Check duplicate code
    if (result.data.some((w) => w.code === data.code)) {
      return { success: false, error: 'Mã website đã tồn tại' };
    }

    const now = new Date().toISOString();
    const newWebsite: WebsiteDefinition = {
      ...data,
      systemId: await generateIdWithPrefix('WEB', prisma),
      createdAt: now,
      updatedAt: now,
    };

    const websites = [...result.data, newWebsite];
    await saveWebsites(websites);

    revalidatePath('/settings/websites');
    return { success: true, data: newWebsite };
  } catch (error) {
    console.error('Failed to create website:', error);
    return { success: false, error: 'Không thể tạo website' };
  }
}

/**
 * Update website
 */
export async function updateWebsite(
  code: string,
  data: Partial<WebsiteDefinition>
): Promise<ActionResult<WebsiteDefinition>> {
  try {
    const result = await getWebsites();
    if (!result.success) return { success: false, error: result.error };

    const index = result.data.findIndex((w) => w.code === code);
    if (index === -1) return { success: false, error: 'Không tìm thấy website' };

    const updated: WebsiteDefinition = {
      ...result.data[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    const websites = [...result.data];
    websites[index] = updated;
    await saveWebsites(websites);

    revalidatePath('/settings/websites');
    return { success: true, data: updated };
  } catch (error) {
    console.error('Failed to update website:', error);
    return { success: false, error: 'Không thể cập nhật website' };
  }
}

/**
 * Delete website
 */
export async function deleteWebsite(code: string): Promise<ActionResult<void>> {
  try {
    const result = await getWebsites();
    if (!result.success) return { success: false, error: result.error };

    const websites = result.data.filter((w) => w.code !== code);
    await saveWebsites(websites);

    revalidatePath('/settings/websites');
    return { success: true, data: undefined };
  } catch (error) {
    console.error('Failed to delete website:', error);
    return { success: false, error: 'Không thể xóa website' };
  }
}

/**
 * Toggle website active status
 */
export async function toggleWebsiteActive(
  code: string
): Promise<ActionResult<WebsiteDefinition>> {
  try {
    const result = await getWebsites();
    if (!result.success) return { success: false, error: result.error };

    const website = result.data.find((w) => w.code === code);
    if (!website) return { success: false, error: 'Không tìm thấy website' };

    return updateWebsite(code, { isActive: !website.isActive });
  } catch (error) {
    console.error('Failed to toggle website status:', error);
    return { success: false, error: 'Không thể thay đổi trạng thái website' };
  }
}

/**
 * Toggle website sync
 */
export async function toggleWebsiteSync(
  code: string
): Promise<ActionResult<WebsiteDefinition>> {
  try {
    const result = await getWebsites();
    if (!result.success) return { success: false, error: result.error };

    const website = result.data.find((w) => w.code === code);
    if (!website) return { success: false, error: 'Không tìm thấy website' };

    return updateWebsite(code, { syncEnabled: !website.syncEnabled });
  } catch (error) {
    console.error('Failed to toggle website sync:', error);
    return { success: false, error: 'Không thể thay đổi trạng thái đồng bộ' };
  }
}
