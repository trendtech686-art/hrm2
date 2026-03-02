'use server';

import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { revalidatePath } from '@/lib/revalidation';
import { generateIdWithPrefix } from '@/lib/id-generator';

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface PayrollTemplateColumn {
  key: string;
  label: string;
  type: 'text' | 'number' | 'formula' | 'currency';
  formula?: string;
  isRequired?: boolean;
  isVisible?: boolean;
  width?: number;
}

export interface PayrollTemplate {
  systemId: string;
  id: string;
  name: string;
  description?: string;
  columns: PayrollTemplateColumn[];
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const SETTINGS_TYPE = 'payroll-templates';

/**
 * Get all payroll templates
 */
export async function getPayrollTemplates(): Promise<ActionResult<PayrollTemplate[]>> {
  try {
    const settings = await prisma.settingsData.findFirst({
      where: { type: SETTINGS_TYPE },
    });

    if (!settings) {
      return { success: true, data: [] };
    }

    const templates = (settings.metadata as Record<string, unknown>)?.templates as PayrollTemplate[] || [];
    return { success: true, data: templates };
  } catch (error) {
    console.error('Failed to get payroll templates:', error);
    return { success: false, error: 'Không thể tải mẫu bảng lương' };
  }
}

/**
 * Save all payroll templates
 */
export async function savePayrollTemplates(
  templates: PayrollTemplate[]
): Promise<ActionResult<PayrollTemplate[]>> {
  try {
    const existing = await prisma.settingsData.findFirst({
      where: { type: SETTINGS_TYPE },
    });

    if (existing) {
      await prisma.settingsData.update({
        where: { systemId: existing.systemId },
        data: { metadata: { templates } as unknown as Prisma.InputJsonValue },
      });
    } else {
      const tempId = await generateIdWithPrefix('PAYROLL_TPL', prisma);
      await prisma.settingsData.create({
        data: {
          systemId: tempId,
          id: tempId,
          type: SETTINGS_TYPE,
          name: 'Payroll Templates',
          metadata: { templates } as unknown as Prisma.InputJsonValue,
        },
      });
    }

    revalidatePath('/settings/payroll-templates');
    return { success: true, data: templates };
  } catch (error) {
    console.error('Failed to save payroll templates:', error);
    return { success: false, error: 'Không thể lưu mẫu bảng lương' };
  }
}

/**
 * Create a new payroll template
 */
export async function createPayrollTemplate(
  data: Omit<PayrollTemplate, 'systemId' | 'id' | 'createdAt' | 'updatedAt'>
): Promise<ActionResult<PayrollTemplate>> {
  try {
    const result = await getPayrollTemplates();
    if (!result.success) return { success: false, error: result.error };

    const templates = result.data;
    const now = new Date().toISOString();

    const newTemplate: PayrollTemplate = {
      ...data,
      systemId: await generateIdWithPrefix('PAYTPL', prisma),
      id: `PT${String(templates.length + 1).padStart(6, '0')}`,
      createdAt: now,
      updatedAt: now,
    };

    // If this is default, unset others
    let updatedTemplates = [...templates];
    if (newTemplate.isDefault) {
      updatedTemplates = updatedTemplates.map((t) => ({ ...t, isDefault: false }));
    }

    updatedTemplates.push(newTemplate);
    await savePayrollTemplates(updatedTemplates);

    return { success: true, data: newTemplate };
  } catch (error) {
    console.error('Failed to create payroll template:', error);
    return { success: false, error: 'Không thể tạo mẫu bảng lương' };
  }
}

/**
 * Update a payroll template
 */
export async function updatePayrollTemplate(
  systemId: string,
  data: Partial<PayrollTemplate>
): Promise<ActionResult<PayrollTemplate>> {
  try {
    const result = await getPayrollTemplates();
    if (!result.success) return { success: false, error: result.error };

    const templates = result.data;
    const index = templates.findIndex((t) => t.systemId === systemId);
    if (index === -1) return { success: false, error: 'Không tìm thấy mẫu bảng lương' };

    const now = new Date().toISOString();
    const updated: PayrollTemplate = {
      ...templates[index],
      ...data,
      updatedAt: now,
    };

    let updatedTemplates = [...templates];
    updatedTemplates[index] = updated;

    // If setting this one as default, unset others
    if (data.isDefault) {
      updatedTemplates = updatedTemplates.map((t, i) =>
        i === index ? t : { ...t, isDefault: false }
      );
    }

    await savePayrollTemplates(updatedTemplates);
    return { success: true, data: updated };
  } catch (error) {
    console.error('Failed to update payroll template:', error);
    return { success: false, error: 'Không thể cập nhật mẫu bảng lương' };
  }
}

/**
 * Delete a payroll template
 */
export async function deletePayrollTemplate(
  systemId: string
): Promise<ActionResult<void>> {
  try {
    const result = await getPayrollTemplates();
    if (!result.success) return { success: false, error: result.error };

    const templates = result.data.filter((t) => t.systemId !== systemId);

    // Ensure at least one default exists
    if (templates.length > 0 && !templates.some((t) => t.isDefault)) {
      templates[0].isDefault = true;
    }

    await savePayrollTemplates(templates);
    return { success: true, data: undefined };
  } catch (error) {
    console.error('Failed to delete payroll template:', error);
    return { success: false, error: 'Không thể xóa mẫu bảng lương' };
  }
}

/**
 * Get default payroll template
 */
export async function getDefaultPayrollTemplate(): Promise<ActionResult<PayrollTemplate | null>> {
  try {
    const result = await getPayrollTemplates();
    if (!result.success) return { success: false, error: result.error };

    const defaultTemplate = result.data.find((t) => t.isDefault);
    return { success: true, data: defaultTemplate || null };
  } catch (error) {
    console.error('Failed to get default payroll template:', error);
    return { success: false, error: 'Không thể tải mẫu bảng lương mặc định' };
  }
}

/**
 * Duplicate a payroll template
 */
export async function duplicatePayrollTemplate(
  systemId: string
): Promise<ActionResult<PayrollTemplate>> {
  try {
    const result = await getPayrollTemplates();
    if (!result.success) return { success: false, error: result.error };

    const original = result.data.find((t) => t.systemId === systemId);
    if (!original) return { success: false, error: 'Không tìm thấy mẫu bảng lương' };

    const now = new Date().toISOString();
    const duplicated: PayrollTemplate = {
      ...original,
      systemId: await generateIdWithPrefix('PAYTPL', prisma),
      id: `PT${String(result.data.length + 1).padStart(6, '0')}`,
      name: `${original.name} (Copy)`,
      isDefault: false,
      createdAt: now,
      updatedAt: now,
    };

    const updatedTemplates = [...result.data, duplicated];
    await savePayrollTemplates(updatedTemplates);

    return { success: true, data: duplicated };
  } catch (error) {
    console.error('Failed to duplicate payroll template:', error);
    return { success: false, error: 'Không thể nhân bản mẫu bảng lương' };
  }
}
