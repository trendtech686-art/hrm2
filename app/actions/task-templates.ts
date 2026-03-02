'use server';

import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { revalidatePath } from '@/lib/revalidation';
import { generateIdWithPrefix } from '@/lib/id-generator';

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface TaskTemplate {
  systemId: string;
  name: string;
  description?: string;
  
  // Template content
  title: string;
  taskDescription?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  labels?: string[];
  estimatedHours?: number;
  
  // Subtasks template
  subtasks?: Array<{
    title: string;
    description?: string;
  }>;
  
  // Custom field values
  customFieldValues?: Record<string, unknown>;
  
  // Checklist template
  checklist?: Array<{
    text: string;
    checked: boolean;
  }>;
  
  // Metadata
  category?: string;
  usageCount: number;
  isActive: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const TEMPLATES_TYPE = 'task-templates';

/**
 * Fetch all task templates
 */
export async function getTaskTemplates(): Promise<ActionResult<TaskTemplate[]>> {
  try {
    const settings = await prisma.settingsData.findFirst({
      where: { type: TEMPLATES_TYPE },
    });

    if (!settings || !settings.metadata) {
      return { success: true, data: [] };
    }

    const templates = (settings.metadata as Record<string, unknown>)?.items as TaskTemplate[] || [];
    return { success: true, data: templates };
  } catch (error) {
    console.error('Failed to fetch task templates:', error);
    return { success: false, error: 'Không thể tải mẫu công việc' };
  }
}

/**
 * Fetch single template by ID
 */
export async function getTaskTemplateById(
  systemId: string
): Promise<ActionResult<TaskTemplate | null>> {
  try {
    const result = await getTaskTemplates();
    if (!result.success) return { success: false, error: result.error };

    const template = result.data.find((t) => t.systemId === systemId);
    return { success: true, data: template || null };
  } catch (error) {
    console.error('Failed to fetch task template:', error);
    return { success: false, error: 'Không thể tải mẫu công việc' };
  }
}

/**
 * Create new task template
 */
export async function createTaskTemplate(
  data: Omit<TaskTemplate, 'systemId' | 'createdAt' | 'updatedAt' | 'usageCount'>
): Promise<ActionResult<TaskTemplate>> {
  try {
    const result = await getTaskTemplates();
    if (!result.success) return { success: false, error: result.error };

    const systemId = await generateIdWithPrefix('TT', prisma);
    const newTemplate: TaskTemplate = {
      systemId,
      ...data,
      usageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updated = [...result.data, newTemplate];
    await saveTaskTemplates(updated);

    revalidatePath('/tasks');
    return { success: true, data: newTemplate };
  } catch (error) {
    console.error('Failed to create task template:', error);
    return { success: false, error: 'Không thể tạo mẫu công việc' };
  }
}

/**
 * Update task template
 */
export async function updateTaskTemplate(
  systemId: string,
  data: Partial<TaskTemplate>
): Promise<ActionResult<TaskTemplate>> {
  try {
    const result = await getTaskTemplates();
    if (!result.success) return { success: false, error: result.error };

    const index = result.data.findIndex((t) => t.systemId === systemId);
    if (index === -1) {
      return { success: false, error: 'Không tìm thấy mẫu công việc' };
    }

    const updated = [...result.data];
    updated[index] = {
      ...updated[index],
      ...data,
      updatedAt: new Date(),
    };

    await saveTaskTemplates(updated);

    revalidatePath('/tasks');
    return { success: true, data: updated[index] };
  } catch (error) {
    console.error('Failed to update task template:', error);
    return { success: false, error: 'Không thể cập nhật mẫu công việc' };
  }
}

/**
 * Delete task template
 */
export async function deleteTaskTemplate(systemId: string): Promise<ActionResult<void>> {
  try {
    const result = await getTaskTemplates();
    if (!result.success) return { success: false, error: result.error };

    const updated = result.data.filter((t) => t.systemId !== systemId);
    await saveTaskTemplates(updated);

    revalidatePath('/tasks');
    return { success: true, data: undefined };
  } catch (error) {
    console.error('Failed to delete task template:', error);
    return { success: false, error: 'Không thể xóa mẫu công việc' };
  }
}

/**
 * Increment template usage count
 */
export async function incrementTemplateUsage(systemId: string): Promise<ActionResult<void>> {
  try {
    const result = await getTaskTemplates();
    if (!result.success) return { success: false, error: result.error };

    const index = result.data.findIndex((t) => t.systemId === systemId);
    if (index === -1) {
      return { success: false, error: 'Không tìm thấy mẫu công việc' };
    }

    const updated = [...result.data];
    updated[index] = {
      ...updated[index],
      usageCount: updated[index].usageCount + 1,
      updatedAt: new Date(),
    };

    await saveTaskTemplates(updated);

    return { success: true, data: undefined };
  } catch (error) {
    console.error('Failed to increment usage:', error);
    return { success: false, error: 'Không thể cập nhật số lần sử dụng' };
  }
}

/**
 * Get popular templates (most used)
 */
export async function getPopularTemplates(
  limit: number = 5
): Promise<ActionResult<TaskTemplate[]>> {
  try {
    const result = await getTaskTemplates();
    if (!result.success) return { success: false, error: result.error };

    const popular = result.data
      .filter((t) => t.isActive)
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);

    return { success: true, data: popular };
  } catch (error) {
    console.error('Failed to get popular templates:', error);
    return { success: false, error: 'Không thể tải mẫu phổ biến' };
  }
}

/**
 * Duplicate template
 */
export async function duplicateTaskTemplate(
  systemId: string
): Promise<ActionResult<TaskTemplate>> {
  try {
    const result = await getTaskTemplateById(systemId);
    if (!result.success) return { success: false, error: result.error };
    if (!result.data) return { success: false, error: 'Không tìm thấy mẫu' };

    const { systemId: _, createdAt: __, updatedAt: ___, usageCount: ____, ...templateData } = result.data;
    
    return createTaskTemplate({
      ...templateData,
      name: `${templateData.name} (Copy)`,
    });
  } catch (error) {
    console.error('Failed to duplicate template:', error);
    return { success: false, error: 'Không thể sao chép mẫu' };
  }
}

// Helper function
async function saveTaskTemplates(templates: TaskTemplate[]): Promise<void> {
  const existing = await prisma.settingsData.findFirst({
    where: { type: TEMPLATES_TYPE },
  });

  if (existing) {
    await prisma.settingsData.update({
      where: { systemId: existing.systemId },
      data: { metadata: { items: templates } as unknown as Prisma.InputJsonValue },
    });
  } else {
    const settingsId = await generateIdWithPrefix('SETT', prisma);
    await prisma.settingsData.create({
      data: {
        systemId: settingsId,
        id: settingsId,
        type: TEMPLATES_TYPE,
        name: 'Task Templates',
        metadata: { items: templates } as unknown as Prisma.InputJsonValue,
      },
    });
  }
}
