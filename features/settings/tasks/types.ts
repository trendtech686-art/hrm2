import type { TaskPriority } from '../../tasks/types';

// ============================================
// INTERFACES
// ============================================

export interface CardColorSettings {
  statusColors: {
    'Chưa bắt đầu': string;
    'Đang thực hiện': string;
    'Đang chờ': string;
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

export interface NotificationSettings {
  emailOnCreate: boolean;
  emailOnAssign: boolean;
  emailOnComplete: boolean;
  emailOnOverdue: boolean;
  emailOnApprovalPending: boolean;
  smsOnOverdue: boolean;
  inAppNotifications: boolean;
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
  'Thấp': { responseTime: 480, completeTime: 168 }, // 8h response, 7 days complete
  'Trung bình': { responseTime: 240, completeTime: 72 }, // 4h response, 3 days complete
  'Cao': { responseTime: 120, completeTime: 24 }, // 2h response, 1 day complete
  'Khẩn cấp': { responseTime: 60, completeTime: 8 }, // 1h response, 8h complete
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
  smsOnOverdue: false,
  inAppNotifications: true,
};

export const defaultCardColors: CardColorSettings = {
  statusColors: {
    'Chưa bắt đầu': 'bg-slate-50 border-slate-200',
    'Đang thực hiện': 'bg-blue-50 border-blue-200',
    'Đang chờ': 'bg-yellow-50 border-yellow-200',
    'Hoàn thành': 'bg-green-50 border-green-200',
    'Đã hủy': 'bg-gray-50 border-gray-200',
  },
  priorityColors: {
    'Thấp': 'bg-slate-50 border-slate-200',
    'Trung bình': 'bg-amber-50 border-amber-200',
    'Cao': 'bg-orange-50 border-orange-300',
    'Khẩn cấp': 'bg-red-100 border-red-300',
  },
  overdueColor: 'bg-red-50 border-red-400',
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
  { id: '1', name: 'Phát triển', description: 'Công việc liên quan đến code/development', icon: '', order: 1, isActive: true },
  { id: '2', name: 'Thiết kế', description: 'Công việc thiết kế UI/UX, graphics', icon: '', order: 2, isActive: true },
  { id: '3', name: 'Marketing', description: 'Công việc marketing, quảng cáo', icon: '', order: 3, isActive: true },
  { id: '4', name: 'Quản trị', description: 'Công việc hành chính, quản lý', icon: '', order: 4, isActive: true },
  { id: '5', name: 'Khác', description: 'Các loại công việc khác', icon: '', order: 5, isActive: true },
];

export const defaultTemplates: TaskTemplate[] = [
  {
    id: '1',
    name: 'Bug Fix',
    title: 'Sửa lỗi: [Tên lỗi]',
    description: '**Mô tả lỗi:**\n[Mô tả chi tiết lỗi]\n\n**Bước tái hiện:**\n1. ...\n2. ...\n\n**Kết quả mong đợi:**\n[Kết quả đúng]\n\n**Kết quả thực tế:**\n[Kết quả sai]',
    category: 'development',
    estimatedHours: 4,
    order: 1,
  },
  {
    id: '2',
    name: 'New Feature',
    title: 'Tính năng mới: [Tên tính năng]',
    description: '**Mục đích:**\n[Mô tả mục đích]\n\n**Yêu cầu chức năng:**\n- ...\n- ...\n\n**Yêu cầu kỹ thuật:**\n- ...\n\n**Acceptance Criteria:**\n- [ ] ...\n- [ ] ...',
    category: 'development',
    estimatedHours: 16,
    order: 2,
  },
  {
    id: '3',
    name: 'Design Task',
    title: 'Thiết kế: [Tên thiết kế]',
    description: '**Loại thiết kế:**\n[UI/UX/Banner/Logo/...]\n\n**Yêu cầu:**\n- ...\n- ...\n\n**Tham khảo:**\n[Link/File tham khảo]',
    category: 'design',
    estimatedHours: 8,
    order: 3,
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
    key: 'Đang chờ',
    label: 'Đang chờ',
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
