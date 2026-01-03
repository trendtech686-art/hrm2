// ============================================
// TYPES & INTERFACES
// ============================================

export interface CardColorSettings {
  // Màu theo trạng thái
  statusColors: {
    pending: string;
    investigating: string;
    resolved: string;
    rejected: string;
  };
  // Màu theo độ ưu tiên (override statusColors nếu có)
  priorityColors: {
    low: string;
    medium: string;
    high: string;
    urgent: string;
  };
  // Màu quá hạn (override tất cả)
  overdueColor: string;
  // Enable/disable coloring
  enableStatusColors: boolean;
  enablePriorityColors: boolean;
  enableOverdueColor: boolean;
}

export interface SLASettings {
  low: { responseTime: number; resolveTime: number };
  medium: { responseTime: number; resolveTime: number };
  high: { responseTime: number; resolveTime: number };
  urgent: { responseTime: number; resolveTime: number };
}

export interface ResponseTemplate {
  id: string;
  name: string;
  content: string;
  category: 'general' | 'product-defect' | 'shipping-delay' | 'wrong-item' | 'customer-service';
  order: number;
}

export interface NotificationSettings {
  emailOnCreate: boolean;
  emailOnAssign: boolean;
  emailOnVerified: boolean;
  emailOnResolved: boolean;
  emailOnOverdue: boolean;
  smsOnOverdue: boolean;
  inAppNotifications: boolean;
}

export interface PublicTrackingSettings {
  enabled: boolean;
  allowCustomerComments: boolean;
  showEmployeeName: boolean;
  showTimeline: boolean;
}

export interface ReminderSettings {
  enabled: boolean;
  firstReminderHours: number;
  secondReminderHours: number;
  escalationHours: number;
}

export interface ComplaintType {
  id: string;
  name: string;
  description: string;
  order: number;
  isActive: boolean;
}

export type ComplaintsSettingsState = {
  sla: SLASettings;
  templates: ResponseTemplate[];
  notifications: NotificationSettings;
  publicTracking: PublicTrackingSettings;
  reminders: ReminderSettings;
  cardColors: CardColorSettings;
  complaintTypes: ComplaintType[];
};

// ============================================
// DEFAULT VALUES
// ============================================

export const defaultSLA: SLASettings = {
  low: { responseTime: 240, resolveTime: 48 }, // 4h response, 48h resolve
  medium: { responseTime: 120, resolveTime: 24 }, // 2h response, 24h resolve
  high: { responseTime: 60, resolveTime: 12 }, // 1h response, 12h resolve
  urgent: { responseTime: 30, resolveTime: 4 }, // 30m response, 4h resolve
};

export const defaultReminders: ReminderSettings = {
  enabled: true,
  firstReminderHours: 4,
  secondReminderHours: 8,
  escalationHours: 24,
};

export const defaultNotifications: NotificationSettings = {
  emailOnCreate: true,
  emailOnAssign: true,
  emailOnVerified: false,
  emailOnResolved: true,
  emailOnOverdue: true,
  smsOnOverdue: false,
  inAppNotifications: true,
};

export const defaultPublicTracking: PublicTrackingSettings = {
  enabled: false,
  allowCustomerComments: false,
  showEmployeeName: true,
  showTimeline: true,
};

export const defaultCardColors: CardColorSettings = {
  statusColors: {
    pending: 'bg-yellow-50 border-yellow-200',
    investigating: 'bg-blue-50 border-blue-200',
    resolved: 'bg-green-50 border-green-200',
    rejected: 'bg-gray-50 border-gray-200',
  },
  priorityColors: {
    low: 'bg-slate-50 border-slate-200',
    medium: 'bg-amber-50 border-amber-200',
    high: 'bg-orange-50 border-orange-300',
    urgent: 'bg-red-100 border-red-300',
  },
  overdueColor: 'bg-red-50 border-red-400',
  enableStatusColors: false,
  enablePriorityColors: true,
  enableOverdueColor: true,
};

export const defaultComplaintTypes: ComplaintType[] = [
  { id: '1', name: 'Sản phẩm lỗi', description: 'Sản phẩm có lỗi kỹ thuật hoặc hỏng hóc', order: 1, isActive: true },
  { id: '2', name: 'Giao hàng chậm', description: 'Đơn hàng giao chậm so với thời gian cam kết', order: 2, isActive: true },
  { id: '3', name: 'Sai sản phẩm', description: 'Giao sai sản phẩm so với đơn hàng', order: 3, isActive: true },
  { id: '4', name: 'Dịch vụ chăm sóc', description: 'Khiếu nại về thái độ hoặc dịch vụ nhân viên', order: 4, isActive: true },
  { id: '5', name: 'Khác', description: 'Các loại khiếu nại khác', order: 5, isActive: true },
];

export const SLA_PRIORITY_CONFIGS: Array<{
  key: keyof SLASettings;
  label: string;
  description: string;
  indicatorClass: string;
}> = [
  {
    key: 'low',
    label: 'Ưu tiên thấp',
    description: 'Ví dụ: các lỗi nhỏ hoặc yêu cầu tham khảo thông tin',
    indicatorClass: 'bg-green-500',
  },
  {
    key: 'medium',
    label: 'Ưu tiên trung bình',
    description: 'Ảnh hưởng vừa phải tới khách hàng, cần theo dõi trong ngày',
    indicatorClass: 'bg-yellow-500',
  },
  {
    key: 'high',
    label: 'Ưu tiên cao',
    description: 'Các vấn đề ảnh hưởng trực tiếp đến trải nghiệm khách hàng',
    indicatorClass: 'bg-orange-500',
  },
  {
    key: 'urgent',
    label: 'Ưu tiên khẩn cấp',
    description: 'Khiếu nại nghiêm trọng cần phản hồi ngay (ví dụ sự cố truyền thông)',
    indicatorClass: 'bg-red-500',
  },
];

export const defaultTemplates: ResponseTemplate[] = [
  {
    id: '1',
    name: 'Xin lỗi - Lỗi sản phẩm',
    content: 'Kính chào Anh/Chị,\n\nChúng tôi xin chân thành xin lỗi về sản phẩm bị lỗi mà Anh/Chị đã nhận được. Đây là sự cố đáng tiếc và chúng tôi hiểu sự bất tiện mà điều này gây ra.\n\nChúng tôi đang xử lý khiếu nại của Anh/Chị và sẽ sớm có phương án giải quyết hợp lý nhất.\n\nTrân trọng,',
    category: 'product-defect',
    order: 1,
  },
  {
    id: '2',
    name: 'Xin lỗi - Giao hàng chậm',
    content: 'Kính chào Anh/Chị,\n\nChúng tôi xin lỗi vì đơn hàng của Anh/Chị đã bị giao chậm hơn so với dự kiến. Chúng tôi đã liên hệ với đơn vị vận chuyển để làm rõ nguyên nhân.\n\nChúng tôi sẽ có phương án bù trừ hợp lý cho sự chậm trễ này.\n\nTrân trọng,',
    category: 'shipping-delay',
    order: 2,
  },
  {
    id: '3',
    name: 'Xác nhận đang xử lý',
    content: 'Kính chào Anh/Chị,\n\nChúng tôi đã nhận được khiếu nại của Anh/Chị và đang tiến hành xác minh thông tin.\n\nChúng tôi sẽ phản hồi lại trong thời gian sớm nhất. Xin Anh/Chị vui lòng theo dõi.\n\nTrân trọng,',
    category: 'general',
    order: 3,
  },
];

// ============================================
// UTILITIES
// ============================================

export const clone = <T,>(value: T): T => {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
};

export const createDefaultComplaintsSettings = (): ComplaintsSettingsState => ({
  sla: clone(defaultSLA),
  templates: clone(defaultTemplates),
  notifications: clone(defaultNotifications),
  publicTracking: clone(defaultPublicTracking),
  reminders: clone(defaultReminders),
  cardColors: clone(defaultCardColors),
  complaintTypes: clone(defaultComplaintTypes),
});

// Validation helper for Tailwind classes
export function validateTailwindClasses(value: string): boolean {
  if (!value || !value.trim()) return false;
  
  // Pattern: bg-color-shade or border-color-shade, can have multiple classes
  const tailwindPattern = /^(bg|border|text|shadow|ring)-[\w-]+(\/\d+)?(\s+(bg|border|text|shadow|ring)-[\w-]+(\/\d+)?)*$/;
  return tailwindPattern.test(value.trim());
}
