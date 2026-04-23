import type { TaskPriority } from '../../tasks/types';
import type { TaskNotificationSettings } from '../notifications/types';

// Re-export for backward compatibility
export type NotificationSettings = TaskNotificationSettings;

// ============================================
// INTERFACES
// ============================================

export interface CardColorSettings {
  statusColors: {
    'Chưa bắt đầu': string;
    'Đang thực hiện': string;
    'Chờ duyệt': string;
    'Hoàn thành': string;
    'Đã hủy': string;
  };
  priorityColors: {
    'Thấp': string;
    'Trung bình': string;
    'Cao': string;
    'Khẩn cấp': string;
  };
  overdueColor: string;
  enableStatusColors: boolean;
  enablePriorityColors: boolean;
  enableOverdueColor: boolean;
}

export type StatusColorKey = keyof CardColorSettings['statusColors'];
export type PriorityColorKey = keyof CardColorSettings['priorityColors'];

export interface SLASettings {
  'Thấp': { responseTime: number; completeTime: number };
  'Trung bình': { responseTime: number; completeTime: number };
  'Cao': { responseTime: number; completeTime: number };
  'Khẩn cấp': { responseTime: number; completeTime: number };
}

export interface TaskTemplate {
  id: string;
  name: string;
  title: string;
  description: string;
  category: 'development' | 'design' | 'marketing' | 'admin' | 'general';
  estimatedHours: number;
  order: number;
}

export interface ReminderSettings {
  enabled: boolean;
  firstReminderHours: number;
  secondReminderHours: number;
  escalationHours: number;
}

export interface EvidenceSettings {
  maxImages: number;
  minNoteLength: number;
  imageMaxSizeMB: number;
  allowedFormats: string[];
  requireNoteWithImages: boolean;
}

export interface TaskType {
  id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
  isActive: boolean;
  isDefault?: boolean;
  color?: string;
}

export type TasksSettingsState = {
  sla: SLASettings;
  templates: TaskTemplate[];
  notifications: NotificationSettings;
  reminders: ReminderSettings;
  cardColors: CardColorSettings;
  taskTypes: TaskType[];
  evidence: EvidenceSettings;
};

// ============================================
// DEFAULT VALUES
// ============================================

export const defaultSLA: SLASettings = {
  'Thấp': { responseTime: 480, completeTime: 168 },
  'Trung bình': { responseTime: 240, completeTime: 72 },
  'Cao': { responseTime: 120, completeTime: 24 },
  'Khẩn cấp': { responseTime: 60, completeTime: 8 },
};

export const defaultReminders: ReminderSettings = {
  enabled: true,
  firstReminderHours: 8,
  secondReminderHours: 24,
  escalationHours: 48,
};

export const defaultNotifications: NotificationSettings = {
  emailOnCreate: true,
  emailOnAssign: true,
  emailOnComplete: true,
  emailOnOverdue: true,
  emailOnApprovalPending: true,
  inAppNotifications: true,
};

export const defaultCardColors: CardColorSettings = {
  statusColors: {
    'Chưa bắt đầu': 'bg-muted border-border',
    'Đang thực hiện': 'bg-info/10 border-info/30',
    'Chờ duyệt': 'bg-warning/10 border-warning/30',
    'Hoàn thành': 'bg-success/10 border-success/30',
    'Đã hủy': 'bg-muted border-border',
  },
  priorityColors: {
    'Thấp': 'bg-muted border-border',
    'Trung bình': 'bg-warning/10 border-warning/30',
    'Cao': 'bg-warning/20 border-warning/50',
    'Khẩn cấp': 'bg-destructive/10 border-destructive/30',
  },
  overdueColor: 'bg-destructive/15 border-destructive/40',
  enableStatusColors: false,
  enablePriorityColors: true,
  enableOverdueColor: true,
};

export const defaultEvidence: EvidenceSettings = {
  maxImages: 5,
  minNoteLength: 10,
  imageMaxSizeMB: 5,
  allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  requireNoteWithImages: true,
};

export const defaultTaskTypes: TaskType[] = [
  { id: 'general', name: 'Công việc chung', description: 'Các công việc chung', icon: '', order: 1, isActive: true, isDefault: true },
  { id: 'order-process', name: 'Xử lý đơn hàng', description: 'Tiếp nhận, xử lý đơn hàng', icon: 'shopping-cart', order: 2, isActive: true, color: 'blue' },
  { id: 'inventory', name: 'Kiểm tra tồn kho', description: 'Kiểm đếm, đối chiếu tồn kho', icon: 'package', order: 3, isActive: true, color: 'amber' },
  { id: 'supplier', name: 'Liên hệ NCC', description: 'Đặt hàng, liên hệ nhà cung cấp', icon: 'truck', order: 4, isActive: true, color: 'purple' },
  { id: 'customer-support', name: 'CSKH', description: 'Chăm sóc, hỗ trợ khách hàng', icon: 'headphones', order: 5, isActive: true, color: 'green' },
  { id: 'product-listing', name: 'Đăng sản phẩm', description: 'Đăng sản phẩm lên các kênh', icon: 'image', order: 6, isActive: true, color: 'pink' },
  { id: 'shipping', name: 'Vận chuyển', description: 'Đóng gói, giao hàng', icon: 'send', order: 7, isActive: true, color: 'cyan' },
  { id: 'warranty', name: 'Bảo hành', description: 'Xử lý bảo hành sản phẩm', icon: 'shield', order: 8, isActive: true, color: 'orange' },
  { id: 'price-update', name: 'Cập nhật giá', description: 'Điều chỉnh giá bán các kênh', icon: 'tag', order: 9, isActive: true, color: 'red' },
  { id: 'report', name: 'Báo cáo', description: 'Lập báo cáo, thống kê', icon: 'file-text', order: 10, isActive: true, color: 'slate' },
];

export const defaultTemplates: TaskTemplate[] = [
  {
    id: 'new_product_launch',
    name: 'Ra mắt sản phẩm mới',
    title: 'Ra mắt SP mới: [Tên sản phẩm]',
    description: 'Quy trình thêm sản phẩm mới từ NCC',
    category: 'general',
    estimatedHours: 8,
    order: 1,
  },
  {
    id: 'inventory_check',
    name: 'Kiểm kho định kỳ',
    title: 'Kiểm kho: [Tuần/Tháng]',
    description: 'Kiểm tra tồn kho hàng tuần/tháng',
    category: 'general',
    estimatedHours: 4,
    order: 2,
  },
  {
    id: 'order_issue',
    name: 'Xử lý đơn hàng lỗi',
    title: 'Xử lý lỗi đơn: [Mã đơn]',
    description: 'Giải quyết vấn đề đơn hàng (thiếu hàng, giao sai, hư hỏng)',
    category: 'general',
    estimatedHours: 2,
    order: 3,
  },
  {
    id: 'supplier_order',
    name: 'Đặt hàng NCC',
    title: 'Đặt hàng: [Tên NCC]',
    description: 'Quy trình đặt hàng bổ sung từ nhà cung cấp',
    category: 'general',
    estimatedHours: 4,
    order: 4,
  },
  {
    id: 'price_sync',
    name: 'Đồng bộ giá đa kênh',
    title: 'Sync giá: [Danh mục/Sản phẩm]',
    description: 'Cập nhật giá trên các kênh bán hàng',
    category: 'general',
    estimatedHours: 2,
    order: 5,
  },
  {
    id: 'warranty_process',
    name: 'Xử lý bảo hành',
    title: 'Bảo hành: [Mã BH / Tên KH]',
    description: 'Quy trình tiếp nhận và xử lý bảo hành sản phẩm',
    category: 'general',
    estimatedHours: 4,
    order: 6,
  },
];

// ============================================
// CONFIG ARRAYS
// ============================================

export const TASK_PRIORITY_CONFIGS: Array<{
  key: TaskPriority;
  label: string;
  description: string;
  indicatorClass: string;
}> = [
  {
    key: 'Thấp',
    label: 'Ưu tiên thấp',
    description: 'Các công việc có thể hoàn thành trong tuần, không ảnh hưởng SLA tổng.',
    indicatorClass: 'bg-emerald-500',
  },
  {
    key: 'Trung bình',
    label: 'Ưu tiên trung bình',
    description: 'Tác động vừa phải, cần phản hồi trong ngày để tránh backlog.',
    indicatorClass: 'bg-amber-500',
  },
  {
    key: 'Cao',
    label: 'Ưu tiên cao',
    description: 'Task ảnh hưởng tới tiến độ phòng ban, cần theo dõi sát.',
    indicatorClass: 'bg-orange-500',
  },
  {
    key: 'Khẩn cấp',
    label: 'Ưu tiên khẩn cấp',
    description: 'Sự cố ảnh hưởng sản xuất hoặc khách hàng, yêu cầu phản hồi tức thì.',
    indicatorClass: 'bg-red-500',
  },
];

export const STATUS_COLOR_CONFIGS: Array<{
  key: StatusColorKey;
  label: string;
  helper: string;
}> = [
  {
    key: 'Chưa bắt đầu',
    label: 'Chưa bắt đầu',
    helper: 'Hiển thị cho task mới tạo hoặc chưa được nhận.',
  },
  {
    key: 'Đang thực hiện',
    label: 'Đang thực hiện',
    helper: 'Task đang được xử lý tích cực.',
  },
  {
    key: 'Chờ duyệt',
    label: 'Chờ duyệt',
    helper: 'Chờ duyệt, chờ đối tác hoặc phụ thuộc khác.',
  },
  {
    key: 'Hoàn thành',
    label: 'Hoàn thành',
    helper: 'Đánh dấu task đã hoàn tất.',
  },
  {
    key: 'Đã hủy',
    label: 'Đã hủy',
    helper: 'Áp dụng cho task bị hủy bỏ.',
  },
];

export const PRIORITY_COLOR_CONFIGS: Array<{
  key: PriorityColorKey;
  label: string;
  helper: string;
}> = [
  {
    key: 'Thấp',
    label: 'Ưu tiên thấp',
    helper: 'Những việc có thể thực hiện sau khi hoàn thành backlog.',
  },
  {
    key: 'Trung bình',
    label: 'Ưu tiên trung bình',
    helper: 'Task cần hoàn thành trong vài ngày.',
  },
  {
    key: 'Cao',
    label: 'Ưu tiên cao',
    helper: 'Task quan trọng, gắn KPI phòng ban.',
  },
  {
    key: 'Khẩn cấp',
    label: 'Ưu tiên khẩn cấp',
    helper: 'Sự cố lớn, cần nổi bật trên board.',
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export const clone = <T,>(value: T): T => {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
};
