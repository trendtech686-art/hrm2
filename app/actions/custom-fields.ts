'use server';

import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { revalidatePath } from '@/lib/revalidation';
import { generateIdWithPrefix } from '@/lib/id-generator';

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface CustomFieldDefinition {
  systemId: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'checkbox' | 'url' | 'email';
  label: string;
  description?: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select/multiselect
  defaultValue?: unknown;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CUSTOM_FIELDS_TYPE = 'task-custom-fields';

/**
 * Fetch all custom field definitions
 */
export async function getCustomFields(): Promise<ActionResult<CustomFieldDefinition[]>> {
  try {
    const settings = await prisma.settingsData.findFirst({
      where: { type: CUSTOM_FIELDS_TYPE },
    });

    if (!settings || !settings.metadata) {
      return { success: true, data: [] };
    }

    const fields = (settings.metadata as Record<string, unknown>)?.items as CustomFieldDefinition[] || [];
    return { success: true, data: fields.sort((a, b) => a.order - b.order) };
  } catch (error) {
    console.error('Failed to fetch custom fields:', error);
    return { success: false, error: 'Không thể tải trường tùy chỉnh' };
  }
}

/**
 * Fetch single custom field by ID
 */
export async function getCustomFieldById(
  systemId: string
): Promise<ActionResult<CustomFieldDefinition | null>> {
  try {
    const result = await getCustomFields();
    if (!result.success) return { success: false, error: result.error };

    const field = result.data.find((f) => f.systemId === systemId);
    return { success: true, data: field || null };
  } catch (error) {
    console.error('Failed to fetch custom field:', error);
    return { success: false, error: 'Không thể tải trường tùy chỉnh' };
  }
}

/**
 * Create new custom field
 */
export async function createCustomField(
  data: Omit<CustomFieldDefinition, 'systemId' | 'createdAt' | 'updatedAt'>
): Promise<ActionResult<CustomFieldDefinition>> {
  try {
    const result = await getCustomFields();
    if (!result.success) return { success: false, error: result.error };

    const systemId = await generateIdWithPrefix('CF', prisma);
    const newField: CustomFieldDefinition = {
      systemId,
      ...data,
      order: data.order ?? result.data.length,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updated = [...result.data, newField];
    await saveCustomFields(updated);

    revalidatePath('/tasks');
    return { success: true, data: newField };
  } catch (error) {
    console.error('Failed to create custom field:', error);
    return { success: false, error: 'Không thể tạo trường tùy chỉnh' };
  }
}

/**
 * Update custom field
 */
export async function updateCustomField(
  systemId: string,
  data: Partial<CustomFieldDefinition>
): Promise<ActionResult<CustomFieldDefinition>> {
  try {
    const result = await getCustomFields();
    if (!result.success) return { success: false, error: result.error };

    const index = result.data.findIndex((f) => f.systemId === systemId);
    if (index === -1) {
      return { success: false, error: 'Không tìm thấy trường tùy chỉnh' };
    }

    const updated = [...result.data];
    updated[index] = {
      ...updated[index],
      ...data,
      updatedAt: new Date(),
    };

    await saveCustomFields(updated);

    revalidatePath('/tasks');
    return { success: true, data: updated[index] };
  } catch (error) {
    console.error('Failed to update custom field:', error);
    return { success: false, error: 'Không thể cập nhật trường tùy chỉnh' };
  }
}

/**
 * Delete custom field
 */
export async function deleteCustomField(systemId: string): Promise<ActionResult<void>> {
  try {
    const result = await getCustomFields();
    if (!result.success) return { success: false, error: result.error };

    const updated = result.data.filter((f) => f.systemId !== systemId);
    await saveCustomFields(updated);

    revalidatePath('/tasks');
    return { success: true, data: undefined };
  } catch (error) {
    console.error('Failed to delete custom field:', error);
    return { success: false, error: 'Không thể xóa trường tùy chỉnh' };
  }
}

/**
 * Reorder custom fields
 */
export async function reorderCustomFields(fieldIds: string[]): Promise<ActionResult<void>> {
  try {
    const result = await getCustomFields();
    if (!result.success) return { success: false, error: result.error };

    const updated = fieldIds.map((id, index) => {
      const field = result.data.find((f) => f.systemId === id);
      if (!field) throw new Error(`Field ${id} not found`);
      return { ...field, order: index };
    });

    await saveCustomFields(updated);

    revalidatePath('/tasks');
    return { success: true, data: undefined };
  } catch (error) {
    console.error('Failed to reorder custom fields:', error);
    return { success: false, error: 'Không thể sắp xếp lại trường' };
  }
}

// Helper function
async function saveCustomFields(fields: CustomFieldDefinition[]): Promise<void> {
  const existing = await prisma.settingsData.findFirst({
    where: { type: CUSTOM_FIELDS_TYPE },
  });

  if (existing) {
    await prisma.settingsData.update({
      where: { systemId: existing.systemId },
      data: { metadata: { items: fields } as unknown as Prisma.InputJsonValue },
    });
  } else {
    const tempId = await generateIdWithPrefix('SETT', prisma);
    await prisma.settingsData.create({
      data: {
        systemId: tempId,
        id: tempId,
        type: CUSTOM_FIELDS_TYPE,
        name: 'Task Custom Fields',
        metadata: { items: fields } as unknown as Prisma.InputJsonValue,
      },
    });
  }
}
