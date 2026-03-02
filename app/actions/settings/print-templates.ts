'use server';

import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { revalidatePath } from '@/lib/revalidation';
import { generateIdWithPrefix } from '@/lib/id-generator';

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export type TemplateType = 
  | 'order'
  | 'receipt'
  | 'payment'
  | 'invoice'
  | 'warranty'
  | 'delivery'
  | 'inventory'
  | 'purchase-order'
  | 'barcode'
  | 'label';

export interface PrintTemplate {
  systemId: string;
  id: string;
  name: string;
  type: TemplateType;
  content: string;
  paperSize: string;
  orientation: 'portrait' | 'landscape';
  margins: { top: number; right: number; bottom: number; left: number };
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const SETTINGS_TYPE = 'print-templates';

/**
 * Get print templates
 */
export async function getPrintTemplates(
  type?: TemplateType
): Promise<ActionResult<PrintTemplate[]>> {
  try {
    const settings = await prisma.settingsData.findFirst({
      where: { type: SETTINGS_TYPE },
    });

    if (!settings) {
      return { success: true, data: [] };
    }

    let templates = (settings.metadata as Record<string, unknown>)?.templates as PrintTemplate[] || [];
    
    if (type) {
      templates = templates.filter((t) => t.type === type);
    }

    return { success: true, data: templates };
  } catch (error) {
    console.error('Failed to get print templates:', error);
    return { success: false, error: 'Không thể tải mẫu in' };
  }
}

/**
 * Get print template by ID
 */
export async function getPrintTemplateById(
  systemId: string
): Promise<ActionResult<PrintTemplate | null>> {
  try {
    const result = await getPrintTemplates();
    if (!result.success) return { success: false, error: result.error };

    const template = result.data.find((t) => t.systemId === systemId);
    return { success: true, data: template || null };
  } catch (error) {
    console.error('Failed to get print template:', error);
    return { success: false, error: 'Không thể tải mẫu in' };
  }
}

/**
 * Save all print templates
 */
async function saveTemplates(templates: PrintTemplate[]): Promise<void> {
  const existing = await prisma.settingsData.findFirst({
    where: { type: SETTINGS_TYPE },
  });

  if (existing) {
    await prisma.settingsData.update({
      where: { systemId: existing.systemId },
      data: { metadata: { templates } as unknown as Prisma.InputJsonValue },
    });
  } else {
    const tempId = await generateIdWithPrefix('PRINT_TPL', prisma);
    await prisma.settingsData.create({
      data: {
        systemId: tempId,
        id: tempId,
        type: SETTINGS_TYPE,
        name: 'Print Templates',
        metadata: { templates } as unknown as Prisma.InputJsonValue,
      },
    });
  }
}

/**
 * Create print template
 */
export async function createPrintTemplate(
  data: Omit<PrintTemplate, 'systemId' | 'id' | 'createdAt' | 'updatedAt'>
): Promise<ActionResult<PrintTemplate>> {
  try {
    const result = await getPrintTemplates();
    if (!result.success) return { success: false, error: result.error };

    const templates = result.data;
    const now = new Date().toISOString();

    const newTemplate: PrintTemplate = {
      ...data,
      systemId: await generateIdWithPrefix('PTPL', prisma),
      id: `TPL${String(templates.length + 1).padStart(6, '0')}`,
      createdAt: now,
      updatedAt: now,
    };

    // If this is default for type, unset others
    let updatedTemplates = [...templates];
    if (newTemplate.isDefault) {
      updatedTemplates = updatedTemplates.map((t) =>
        t.type === newTemplate.type ? { ...t, isDefault: false } : t
      );
    }

    updatedTemplates.push(newTemplate);
    await saveTemplates(updatedTemplates);

    revalidatePath('/settings/print-templates');
    return { success: true, data: newTemplate };
  } catch (error) {
    console.error('Failed to create print template:', error);
    return { success: false, error: 'Không thể tạo mẫu in' };
  }
}

/**
 * Update print template
 */
export async function updatePrintTemplate(
  systemId: string,
  data: Partial<PrintTemplate>
): Promise<ActionResult<PrintTemplate>> {
  try {
    const result = await getPrintTemplates();
    if (!result.success) return { success: false, error: result.error };

    const templates = result.data;
    const index = templates.findIndex((t) => t.systemId === systemId);
    if (index === -1) return { success: false, error: 'Không tìm thấy mẫu in' };

    const updated: PrintTemplate = {
      ...templates[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    let updatedTemplates = [...templates];
    updatedTemplates[index] = updated;

    // If setting as default for type, unset others
    if (data.isDefault) {
      updatedTemplates = updatedTemplates.map((t, i) =>
        i === index || t.type !== updated.type ? t : { ...t, isDefault: false }
      );
    }

    await saveTemplates(updatedTemplates);
    revalidatePath('/settings/print-templates');
    return { success: true, data: updated };
  } catch (error) {
    console.error('Failed to update print template:', error);
    return { success: false, error: 'Không thể cập nhật mẫu in' };
  }
}

/**
 * Delete print template
 */
export async function deletePrintTemplate(systemId: string): Promise<ActionResult<void>> {
  try {
    const result = await getPrintTemplates();
    if (!result.success) return { success: false, error: result.error };

    const templates = result.data.filter((t) => t.systemId !== systemId);
    await saveTemplates(templates);

    revalidatePath('/settings/print-templates');
    return { success: true, data: undefined };
  } catch (error) {
    console.error('Failed to delete print template:', error);
    return { success: false, error: 'Không thể xóa mẫu in' };
  }
}

/**
 * Duplicate print template
 */
export async function duplicatePrintTemplate(
  systemId: string
): Promise<ActionResult<PrintTemplate>> {
  try {
    const result = await getPrintTemplates();
    if (!result.success) return { success: false, error: result.error };

    const original = result.data.find((t) => t.systemId === systemId);
    if (!original) return { success: false, error: 'Không tìm thấy mẫu in' };

    const now = new Date().toISOString();
    const duplicated: PrintTemplate = {
      ...original,
      systemId: await generateIdWithPrefix('PTPL', prisma),
      id: `TPL${String(result.data.length + 1).padStart(6, '0')}`,
      name: `${original.name} (Copy)`,
      isDefault: false,
      createdAt: now,
      updatedAt: now,
    };

    const templates = [...result.data, duplicated];
    await saveTemplates(templates);

    revalidatePath('/settings/print-templates');
    return { success: true, data: duplicated };
  } catch (error) {
    console.error('Failed to duplicate print template:', error);
    return { success: false, error: 'Không thể nhân bản mẫu in' };
  }
}

/**
 * Reset print template to default content
 */
export async function resetPrintTemplate(
  systemId: string
): Promise<ActionResult<PrintTemplate>> {
  try {
    const result = await getPrintTemplates();
    if (!result.success) return { success: false, error: result.error };

    const index = result.data.findIndex((t) => t.systemId === systemId);
    if (index === -1) return { success: false, error: 'Không tìm thấy mẫu in' };

    const template = result.data[index];
    const defaultContent = getDefaultTemplateContent(template.type);

    const updated: PrintTemplate = {
      ...template,
      content: defaultContent,
      updatedAt: new Date().toISOString(),
    };

    const templates = [...result.data];
    templates[index] = updated;
    await saveTemplates(templates);

    revalidatePath('/settings/print-templates');
    return { success: true, data: updated };
  } catch (error) {
    console.error('Failed to reset print template:', error);
    return { success: false, error: 'Không thể đặt lại mẫu in' };
  }
}

/**
 * Get default template for type
 */
export async function getDefaultPrintTemplate(
  type: TemplateType
): Promise<ActionResult<PrintTemplate | null>> {
  try {
    const result = await getPrintTemplates(type);
    if (!result.success) return { success: false, error: result.error };

    const defaultTemplate = result.data.find((t) => t.isDefault);
    return { success: true, data: defaultTemplate || result.data[0] || null };
  } catch (error) {
    console.error('Failed to get default print template:', error);
    return { success: false, error: 'Không thể tải mẫu in mặc định' };
  }
}

function getDefaultTemplateContent(type: TemplateType): string {
  const defaults: Record<TemplateType, string> = {
    order: '<div class="order-template">{{order}}</div>',
    receipt: '<div class="receipt-template">{{receipt}}</div>',
    payment: '<div class="payment-template">{{payment}}</div>',
    invoice: '<div class="invoice-template">{{invoice}}</div>',
    warranty: '<div class="warranty-template">{{warranty}}</div>',
    delivery: '<div class="delivery-template">{{delivery}}</div>',
    inventory: '<div class="inventory-template">{{inventory}}</div>',
    'purchase-order': '<div class="po-template">{{purchaseOrder}}</div>',
    barcode: '<div class="barcode-template">{{barcode}}</div>',
    label: '<div class="label-template">{{label}}</div>',
  };
  return defaults[type] || '';
}
