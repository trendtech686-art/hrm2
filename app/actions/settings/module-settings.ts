'use server';

/**
 * Generic Server Actions for Module Settings (complaints, warranty, tasks)
 * Replaces client-side fetch() to /api/*-settings Route Handlers
 */

import prisma from '@/lib/prisma';
import type { Prisma } from '@/generated/prisma/client';

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// ============================================
// MODULE CONFIGURATION
// ============================================

type ModuleName = 'complaints' | 'warranty' | 'tasks';

const MODULE_CONFIG: Record<ModuleName, {
  group: string;
  settingKeys: Record<string, string>;
}> = {
  complaints: {
    group: 'complaints',
    settingKeys: {
      sla: 'complaints_sla_settings',
      notifications: 'complaints_notification_settings',
      tracking: 'complaints_tracking_settings',
      reminders: 'complaints_reminder_settings',
      templates: 'complaints_templates',
      cardColors: 'complaints_card_color_settings',
      complaintTypes: 'complaints_complaint_types',
    },
  },
  warranty: {
    group: 'warranty',
    settingKeys: {
      'sla-targets': 'warranty_sla_targets',
      notifications: 'warranty_notification_settings',
      tracking: 'warranty_tracking_settings',
      'reminder-templates': 'warranty_templates',
      cardColors: 'warranty_card_color_settings',
      templates: 'warranty_response_templates',
      publicTracking: 'warranty_public_tracking_settings',
    },
  },
  tasks: {
    group: 'tasks',
    settingKeys: {
      sla: 'tasks_sla_settings',
      notifications: 'tasks_notification_settings',
      reminders: 'tasks_reminder_settings',
      cardColors: 'tasks_card_color_settings',
      taskTypes: 'tasks_task_types',
      templates: 'tasks_templates',
      evidence: 'tasks_evidence_settings',
    },
  },
};

// ============================================
// SERVER ACTIONS
// ============================================

/**
 * Fetch a settings section for a module
 */
export async function getModuleSettingSection<T = unknown>(
  moduleName: ModuleName,
  type: string
): Promise<ActionResult<T | null>> {
  try {
    const config = MODULE_CONFIG[moduleName];
    if (!config) {
      return { success: false, error: `Unknown module: ${moduleName}` };
    }

    const key = config.settingKeys[type];
    if (!key) {
      return { success: false, error: `Unknown setting type: ${type} for module ${moduleName}` };
    }

    const setting = await prisma.setting.findUnique({
      where: {
        key_group: {
          key,
          group: config.group,
        },
      },
    });

    return {
      success: true,
      data: setting ? (setting.value as T) : null,
    };
  } catch (error) {
    console.error(`[${moduleName.toUpperCase()}-SETTINGS] GET error:`, error);
    return { success: false, error: 'Internal server error' };
  }
}

/**
 * Update (upsert) a settings section for a module
 */
export async function updateModuleSettingSection(
  moduleName: ModuleName,
  type: string,
  data: unknown
): Promise<ActionResult<unknown>> {
  try {
    const config = MODULE_CONFIG[moduleName];
    if (!config) {
      return { success: false, error: `Unknown module: ${moduleName}` };
    }

    const key = config.settingKeys[type];
    if (!key) {
      return { success: false, error: `Unknown setting type: ${type} for module ${moduleName}` };
    }

    if (!data) {
      return { success: false, error: 'Data is required' };
    }

    await prisma.setting.upsert({
      where: {
        key_group: {
          key,
          group: config.group,
        },
      },
      update: {
        value: data as Prisma.InputJsonValue,
        updatedAt: new Date(),
      },
      create: {
        key,
        value: data as Prisma.InputJsonValue,
        type: moduleName,
        group: config.group,
        category: 'system',
        description: `${moduleName} ${type} settings`,
      },
    });

    return { success: true, data };
  } catch (error) {
    console.error(`[${moduleName.toUpperCase()}-SETTINGS] POST error:`, error);
    return { success: false, error: 'Internal server error' };
  }
}
