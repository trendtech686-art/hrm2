'use server';

import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { revalidatePath } from '@/lib/revalidation';
import { generateIdWithPrefix } from '@/lib/id-generator';

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface RecurringTask {
  systemId: string;
  title: string;
  description?: string;
  assigneeSystemId?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  labels?: string[];
  
  // Recurrence settings
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number; // Every X days/weeks/months/years
  daysOfWeek?: number[]; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  monthOfYear?: number; // 1-12 for yearly
  
  startDate: Date | string;
  endDate?: Date | string;
  
  // Status
  isActive: boolean;
  isPaused: boolean;
  lastProcessedDate?: Date | string;
  nextRunDate?: Date | string;
  
  createdAt: Date;
  updatedAt: Date;
}

const RECURRING_TASKS_TYPE = 'recurring-tasks';

/**
 * Fetch all recurring tasks
 */
export async function getRecurringTasks(): Promise<ActionResult<RecurringTask[]>> {
  try {
    const settings = await prisma.settingsData.findFirst({
      where: { type: RECURRING_TASKS_TYPE },
    });

    if (!settings || !settings.metadata) {
      return { success: true, data: [] };
    }

    const tasks = (settings.metadata as Record<string, unknown>)?.items as RecurringTask[] || [];
    return { success: true, data: tasks };
  } catch (error) {
    console.error('Failed to fetch recurring tasks:', error);
    return { success: false, error: 'Không thể tải công việc định kỳ' };
  }
}

/**
 * Fetch single recurring task by ID
 */
export async function getRecurringTaskById(
  systemId: string
): Promise<ActionResult<RecurringTask | null>> {
  try {
    const result = await getRecurringTasks();
    if (!result.success) return { success: false, error: result.error };

    const task = result.data.find((t) => t.systemId === systemId);
    return { success: true, data: task || null };
  } catch (error) {
    console.error('Failed to fetch recurring task:', error);
    return { success: false, error: 'Không thể tải công việc định kỳ' };
  }
}

/**
 * Create new recurring task
 */
export async function createRecurringTask(
  data: Omit<RecurringTask, 'systemId' | 'createdAt' | 'updatedAt' | 'lastProcessedDate'>
): Promise<ActionResult<RecurringTask>> {
  try {
    const result = await getRecurringTasks();
    if (!result.success) return { success: false, error: result.error };

    const systemId = await generateIdWithPrefix('RT', prisma);
    const newTask: RecurringTask = {
      systemId,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updated = [...result.data, newTask];
    await saveRecurringTasks(updated);

    revalidatePath('/tasks');
    return { success: true, data: newTask };
  } catch (error) {
    console.error('Failed to create recurring task:', error);
    return { success: false, error: 'Không thể tạo công việc định kỳ' };
  }
}

/**
 * Update recurring task
 */
export async function updateRecurringTask(
  systemId: string,
  data: Partial<RecurringTask>
): Promise<ActionResult<RecurringTask>> {
  try {
    const result = await getRecurringTasks();
    if (!result.success) return { success: false, error: result.error };

    const index = result.data.findIndex((t) => t.systemId === systemId);
    if (index === -1) {
      return { success: false, error: 'Không tìm thấy công việc định kỳ' };
    }

    const updated = [...result.data];
    updated[index] = {
      ...updated[index],
      ...data,
      updatedAt: new Date(),
    };

    await saveRecurringTasks(updated);

    revalidatePath('/tasks');
    return { success: true, data: updated[index] };
  } catch (error) {
    console.error('Failed to update recurring task:', error);
    return { success: false, error: 'Không thể cập nhật công việc định kỳ' };
  }
}

/**
 * Delete recurring task
 */
export async function deleteRecurringTask(systemId: string): Promise<ActionResult<void>> {
  try {
    const result = await getRecurringTasks();
    if (!result.success) return { success: false, error: result.error };

    const updated = result.data.filter((t) => t.systemId !== systemId);
    await saveRecurringTasks(updated);

    revalidatePath('/tasks');
    return { success: true, data: undefined };
  } catch (error) {
    console.error('Failed to delete recurring task:', error);
    return { success: false, error: 'Không thể xóa công việc định kỳ' };
  }
}

/**
 * Toggle pause status
 */
export async function toggleRecurringTaskPause(
  systemId: string
): Promise<ActionResult<RecurringTask>> {
  try {
    const result = await getRecurringTasks();
    if (!result.success) return { success: false, error: result.error };

    const index = result.data.findIndex((t) => t.systemId === systemId);
    if (index === -1) {
      return { success: false, error: 'Không tìm thấy công việc định kỳ' };
    }

    const updated = [...result.data];
    updated[index] = {
      ...updated[index],
      isPaused: !updated[index].isPaused,
      updatedAt: new Date(),
    };

    await saveRecurringTasks(updated);

    revalidatePath('/tasks');
    return { success: true, data: updated[index] };
  } catch (error) {
    console.error('Failed to toggle pause:', error);
    return { success: false, error: 'Không thể thay đổi trạng thái' };
  }
}

/**
 * Process recurring tasks - create new task instances
 */
export async function processRecurringTasks(): Promise<ActionResult<{ created: number }>> {
  try {
    const result = await getRecurringTasks();
    if (!result.success) return { success: false, error: result.error };

    const now = new Date();
    let created = 0;

    const updated = result.data.map((task) => {
      if (!task.isActive || task.isPaused) return task;
      if (task.endDate && new Date(task.endDate) < now) return task;

      const nextRun = task.nextRunDate ? new Date(task.nextRunDate) : new Date(task.startDate);
      if (nextRun > now) return task;

      // TODO: Create actual task instance in tasks table
      created++;

      // Calculate next run date
      const nextRunDate = calculateNextRunDate(task, nextRun);

      return {
        ...task,
        lastProcessedDate: now,
        nextRunDate,
        updatedAt: new Date(),
      };
    });

    await saveRecurringTasks(updated);

    revalidatePath('/tasks');
    return { success: true, data: { created } };
  } catch (error) {
    console.error('Failed to process recurring tasks:', error);
    return { success: false, error: 'Không thể xử lý công việc định kỳ' };
  }
}

// Helper functions
async function saveRecurringTasks(tasks: RecurringTask[]): Promise<void> {
  const existing = await prisma.settingsData.findFirst({
    where: { type: RECURRING_TASKS_TYPE },
  });

  if (existing) {
    await prisma.settingsData.update({
      where: { systemId: existing.systemId },
      data: { metadata: { items: tasks } as unknown as Prisma.InputJsonValue },
    });
  } else {
    const settingsId = await generateIdWithPrefix('SETT', prisma);
    await prisma.settingsData.create({
      data: {
        systemId: settingsId,
        id: settingsId,
        type: RECURRING_TASKS_TYPE,
        name: 'Recurring Tasks',
        metadata: { items: tasks } as unknown as Prisma.InputJsonValue,
      },
    });
  }
}

function calculateNextRunDate(task: RecurringTask, fromDate: Date): Date {
  const next = new Date(fromDate);
  
  switch (task.frequency) {
    case 'daily':
      next.setDate(next.getDate() + task.interval);
      break;
    case 'weekly':
      next.setDate(next.getDate() + 7 * task.interval);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + task.interval);
      break;
    case 'yearly':
      next.setFullYear(next.getFullYear() + task.interval);
      break;
  }
  
  return next;
}
