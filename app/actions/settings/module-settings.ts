'use server';

/**
 * Generic Server Actions for Module Settings (complaints, warranty, tasks)
 * Replaces client-side fetch() to /api/*-settings Route Handlers
 */

import prisma from '@/lib/prisma';
import type { Prisma } from '@/generated/prisma/client';
import { logError } from '@/lib/logger'
import { requireActionPermission } from '@/lib/api-utils'
import { cache } from '@/lib/cache'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { invalidateNotificationSettingsCache } from '@/lib/notifications'

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// ============================================
// MODULE CONFIGURATION
// ============================================

type ModuleName = 'complaints' | 'warranty' | 'tasks' | 'system-notifications' | 'sales' | 'warehouse' | 'hr';

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
  'system-notifications': {
    group: 'system-notifications',
    settingKeys: {
      general: 'general_notification_settings',
      notifications: 'system_notification_settings',
    },
  },
  sales: {
    group: 'sales',
    settingKeys: {
      notifications: 'sales_notification_settings',
    },
  },
  warehouse: {
    group: 'warehouse',
    settingKeys: {
      notifications: 'warehouse_notification_settings',
    },
  },
  hr: {
    group: 'hr',
    settingKeys: {
      notifications: 'hr_notification_settings',
    },
  },
};

// Vietnamese section labels per module
const SECTION_LABELS: Record<ModuleName, Record<string, string>> = {
  tasks: {
    sla: 'SLA công việc',
    notifications: 'Thông báo công việc',
    reminders: 'Nhắc nhở công việc',
    cardColors: 'Màu card công việc',
    taskTypes: 'Loại công việc',
    templates: 'Mẫu công việc',
    evidence: 'Bằng chứng công việc',
  },
  complaints: {
    sla: 'SLA khiếu nại',
    notifications: 'Thông báo khiếu nại',
    tracking: 'Theo dõi khiếu nại',
    reminders: 'Nhắc nhở khiếu nại',
    templates: 'Mẫu khiếu nại',
    cardColors: 'Màu card khiếu nại',
    complaintTypes: 'Loại khiếu nại',
  },
  warranty: {
    'sla-targets': 'SLA bảo hành',
    notifications: 'Thông báo bảo hành',
    tracking: 'Tra cứu bảo hành công khai',
    'reminder-templates': 'Mẫu phản hồi bảo hành',
    cardColors: 'Màu card bảo hành',
  },
  'system-notifications': {
    general: 'Cài đặt thông báo chung',
    notifications: 'Thông báo hệ thống',
  },
  sales: {
    notifications: 'Thông báo kinh doanh',
  },
  warehouse: {
    notifications: 'Thông báo kho & mua hàng',
  },
  hr: {
    notifications: 'Thông báo nhân sự',
  },
};

// Entity type per module for activity logs
const MODULE_ENTITY_TYPE: Record<ModuleName, string> = {
  tasks: 'task_settings',
  complaints: 'complaint_settings',
  warranty: 'warranty_settings',
  'system-notifications': 'notification_settings',
  sales: 'notification_settings',
  warehouse: 'notification_settings',
  hr: 'notification_settings',
};

// Vietnamese field-level labels for activity log changes
const FIELD_LABELS: Record<string, string> = {
  // Common
  enabled: 'Bật/Tắt',
  name: 'Tên',
  description: 'Mô tả',
  isActive: 'Trạng thái',
  isDefault: 'Mặc định',
  order: 'Thứ tự',
  icon: 'Biểu tượng',
  color: 'Màu sắc',
  // SLA
  'Thấp': 'Thấp',
  'Trung bình': 'Trung bình',
  'Cao': 'Cao',
  'Khẩn cấp': 'Khẩn cấp',
  responseTime: 'Thời gian phản hồi',
  completeTime: 'Thời gian hoàn thành',
  // Notifications
  emailOnCreate: 'Email khi tạo mới',
  emailOnAssign: 'Email khi giao việc',
  emailOnComplete: 'Email khi hoàn thành',
  emailOnOverdue: 'Email khi quá hạn',
  emailOnApprovalPending: 'Email khi chờ duyệt',
  inAppNotifications: 'Thông báo trong app',
  // Reminders
  firstReminderHours: 'Nhắc nhở lần 1 (giờ)',
  secondReminderHours: 'Nhắc nhở lần 2 (giờ)',
  escalationHours: 'Báo động leo thang (giờ)',
  // Card colors
  statusColors: 'Màu trạng thái',
  priorityColors: 'Màu ưu tiên',
  overdueColor: 'Màu quá hạn',
  enableStatusColors: 'Bật màu trạng thái',
  enablePriorityColors: 'Bật màu ưu tiên',
  enableOverdueColor: 'Bật màu quá hạn',
  // Evidence
  maxImages: 'Số ảnh tối đa',
  minNoteLength: 'Độ dài ghi chú tối thiểu',
  imageMaxSizeMB: 'Dung lượng ảnh tối đa (MB)',
  allowedFormats: 'Định dạng cho phép',
  requireNoteWithImages: 'Yêu cầu ghi chú kèm ảnh',
  // General notifications (use prefixed key to avoid duplicate 'enabled')
  notificationEnabled: 'Bật thông báo',
  notifyOverdue: 'Công việc quá hạn',
  notifyDueToday: 'Hết hạn hôm nay',
  notifyDueTomorrow: 'Hết hạn ngày mai',
  notifyDueSoon: 'Sắp hết hạn (3 ngày)',
  showDesktopNotification: 'Thông báo desktop',
  playSound: 'Âm thanh thông báo',
  // System notifications
  orderCreated: 'Thông báo đơn hàng mới',
  orderStatusChanged: 'Thông báo thay đổi trạng thái đơn',
  paymentReceived: 'Thông báo nhận thanh toán',
  paymentOverdue: 'Thông báo thanh toán quá hạn',
  lowStockAlert: 'Cảnh báo tồn kho thấp',
  lowStockThreshold: 'Ngưỡng cảnh báo tồn kho',
  newCustomerRegistered: 'Thông báo khách hàng mới',
  dailySummaryEmail: 'Email tổng hợp hàng ngày',
  // Complaints/Warranty
  autoClose: 'Tự động đóng',
  autoCloseAfterDays: 'Tự động đóng sau (ngày)',
  requireEvidence: 'Yêu cầu bằng chứng',
  emailOnStatusChange: 'Email khi đổi trạng thái',
  emailOnNewComment: 'Email khi có bình luận',
  smsOnStatusChange: 'SMS khi đổi trạng thái',
  publicTrackingEnabled: 'Bật tra cứu công khai',
  // Warranty SLA priorities (English keys)
  low: 'Thấp',
  medium: 'Trung bình',
  high: 'Cao',
  urgent: 'Khẩn cấp',
  resolveTime: 'Thời gian xử lý',
  // Warranty notifications
  emailOnProcessing: 'Email khi đang xử lý',
  emailOnProcessed: 'Email khi đã xử lý',
  emailOnReturned: 'Email khi đã trả hàng',
  reminderNotifications: 'Thông báo nhắc nhở',
  // Warranty/Complaints public tracking
  allowCustomerComments: 'Cho phép khách bình luận',
  showEmployeeName: 'Hiển thị tên nhân viên',
  showTimeline: 'Hiển thị timeline',
  showProductList: 'Hiển thị danh sách sản phẩm',
  showSummary: 'Hiển thị tổng kết',
  showPayment: 'Hiển thị thanh toán',
  showReceivedImages: 'Hiển thị ảnh nhận hàng',
  showProcessedImages: 'Hiển thị ảnh sau xử lý',
  showHistory: 'Hiển thị lịch sử thao tác',
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
  const authResult = await requireActionPermission('view_settings')
  if (!authResult.success) return authResult
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
    logError(`[${moduleName.toUpperCase()}-SETTINGS] GET error`, error);
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
  const authResult = await requireActionPermission('edit_settings')
  if (!authResult.success) return { success: false, error: authResult.error }

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

    // Read old value for change tracking
    const oldSetting = await prisma.setting.findUnique({
      where: { key_group: { key, group: config.group } },
    });
    const oldValue = oldSetting?.value;

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

    // Activity log with diff  
    const sectionLabel = SECTION_LABELS[moduleName]?.[type] || type;
    const entityType = MODULE_ENTITY_TYPE[moduleName] || 'settings';
    const isCreate = !oldSetting;
    // Deep-sort keys for stable JSON comparison (avoids false positives from key order)
    const stableStringify = (v: unknown): string => JSON.stringify(v, (_k, val) =>
      val && typeof val === 'object' && !Array.isArray(val)
        ? Object.keys(val).sort().reduce((o, k) => { o[k] = val[k]; return o; }, {} as Record<string, unknown>)
        : val
    );
    if (isCreate) {
      createActivityLog({
        entityType: entityType as any,
        entityId: key,
        action: `Tạo cài đặt ${sectionLabel}`,
        actionType: 'create',
        createdBy: authResult.session?.user?.id ?? '',
      }).catch(e => logError(`[${moduleName}-settings] activity log failed`, e));
    } else if (stableStringify(oldValue) !== stableStringify(data)) {
      const changes: Record<string, { from: unknown; to: unknown }> = {};
      const changedLabels: string[] = [];
      const formatVal = (v: unknown) => v === true ? 'Bật' : v === false ? 'Tắt' : v;

      if (Array.isArray(oldValue) || Array.isArray(data)) {
        // Array diff: compare items by id or name
        const oldArr = (Array.isArray(oldValue) ? oldValue : []) as Record<string, unknown>[];
        const newArr = (Array.isArray(data) ? data : []) as Record<string, unknown>[];
        const getId = (item: Record<string, unknown>) => String(item.id ?? item.name ?? '');
        const getName = (item: Record<string, unknown>) => String(item.name ?? item.id ?? '');
        const oldMap = new Map(oldArr.map(item => [getId(item), item]));
        const newMap = new Map(newArr.map(item => [getId(item), item]));

        // Added items
        for (const [id, item] of newMap) {
          if (!oldMap.has(id)) {
            const label = `Thêm: ${getName(item)}`;
            changes[label] = { from: null, to: getName(item) };
            changedLabels.push(label);
          }
        }
        // Removed items
        for (const [id, item] of oldMap) {
          if (!newMap.has(id)) {
            const label = `Xóa: ${getName(item)}`;
            changes[label] = { from: getName(item), to: null };
            changedLabels.push(label);
          }
        }
        // Modified items
        for (const [id, newItem] of newMap) {
          const oldItem = oldMap.get(id);
          if (oldItem && stableStringify(oldItem) !== stableStringify(newItem)) {
            const itemName = getName(newItem);
            // Find changed fields within the item
            const itemChangedFields: string[] = [];
            const allItemKeys = new Set([...Object.keys(oldItem), ...Object.keys(newItem)]);
            for (const k of allItemKeys) {
              if (k === 'id') continue;
              if (stableStringify(oldItem[k]) !== stableStringify(newItem[k])) {
                const fieldLabel = FIELD_LABELS[k] || k;
                itemChangedFields.push(fieldLabel);
                changes[`${itemName} → ${fieldLabel}`] = { from: formatVal(oldItem[k] ?? null), to: formatVal(newItem[k] ?? null) };
              }
            }
            if (itemChangedFields.length > 0) {
              changedLabels.push(`${itemName} (${itemChangedFields.join(', ')})`);
            }
          }
        }
        // Count summary
        if (oldArr.length !== newArr.length) {
          changes['Số lượng'] = { from: `${oldArr.length} mục`, to: `${newArr.length} mục` };
        }
      } else {
        // Object diff: compare top-level keys with Vietnamese labels
        const oldObj = (oldValue as Record<string, unknown>) || {};
        const newObj = (data as Record<string, unknown>) || {};
        const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);
        for (const k of allKeys) {
          if (stableStringify(oldObj[k]) !== stableStringify(newObj[k])) {
            const label = FIELD_LABELS[k] || k;
            changes[label] = { from: formatVal(oldObj[k] ?? null), to: formatVal(newObj[k] ?? null) };
            changedLabels.push(label);
          }
        }
      }

      if (changedLabels.length > 0) {
        const changeDetail = changedLabels.join(', ');
        createActivityLog({
          entityType: entityType as any,
          entityId: key,
          action: `Cập nhật ${sectionLabel}: ${changeDetail}`,
          actionType: 'update',
          changes,
          createdBy: authResult.session?.user?.id ?? '',
        }).catch(e => logError(`[${moduleName}-settings] activity log failed`, e));
      }
    }

    // Invalidate server-side settings cache so GET returns fresh data
    cache.deletePattern('^settings:');

    // Invalidate notification settings cache immediately
    invalidateNotificationSettingsCache();

    return { success: true, data };
  } catch (error) {
    logError(`[${moduleName.toUpperCase()}-SETTINGS] POST error`, error);
    return { success: false, error: 'Internal server error' };
  }
}
