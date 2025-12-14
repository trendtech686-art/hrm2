import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card.tsx';
import { TabsContent } from '../../../components/ui/tabs.tsx';
import { Label } from '../../../components/ui/label.tsx';
import { Input } from '../../../components/ui/input.tsx';
import { SettingsFormGrid } from '../../../components/settings/forms/SettingsFormGrid.tsx';
import { SettingsFormSection } from '../../../components/settings/forms/SettingsFormSection.tsx';
import { Button } from '../../../components/ui/button.tsx';
import { Switch } from '../../../components/ui/switch.tsx';
import { Textarea } from '../../../components/ui/textarea.tsx';
import { TailwindColorPicker } from '../../../components/ui/tailwind-color-picker.tsx';
import { TipTapEditor } from '../../../components/ui/tiptap-editor.tsx';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select.tsx';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog.tsx';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../components/ui/alert-dialog.tsx';
import { 
  Plus,
  Save,
  MoreHorizontal,
} from 'lucide-react';
import { toast } from 'sonner';
import { useSettingsPageHeader } from '../use-settings-page-header.tsx';
import { createSettingsConfigStore } from '../settings-config-store.ts';
import type { TaskPriority } from '../../tasks/types.ts';
import { SettingsActionButton } from '../../../components/settings/SettingsActionButton.tsx';
import { SettingsVerticalTabs } from '../../../components/settings/SettingsVerticalTabs.tsx';
import { useTabActionRegistry } from '../use-tab-action-registry.ts';

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

type StatusColorKey = keyof CardColorSettings['statusColors'];
type PriorityColorKey = keyof CardColorSettings['priorityColors'];

interface SLASettings {
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

interface NotificationSettings {
  emailOnCreate: boolean;
  emailOnAssign: boolean;
  emailOnComplete: boolean;
  emailOnOverdue: boolean;
  emailOnApprovalPending: boolean;
  smsOnOverdue: boolean;
  inAppNotifications: boolean;
}

interface ReminderSettings {
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

// ============================================
// DEFAULT VALUES
// ============================================

const defaultSLA: SLASettings = {
  'Thấp': { responseTime: 480, completeTime: 168 }, // 8h response, 7 days complete
  'Trung bình': { responseTime: 240, completeTime: 72 }, // 4h response, 3 days complete
  'Cao': { responseTime: 120, completeTime: 24 }, // 2h response, 1 day complete
  'Khẩn cấp': { responseTime: 60, completeTime: 8 }, // 1h response, 8h complete
};

const defaultReminders: ReminderSettings = {
  enabled: true,
  firstReminderHours: 8,
  secondReminderHours: 24,
  escalationHours: 48,
};

const defaultNotifications: NotificationSettings = {
  emailOnCreate: true,
  emailOnAssign: true,
  emailOnComplete: true,
  emailOnOverdue: true,
  emailOnApprovalPending: true,
  smsOnOverdue: false,
  inAppNotifications: true,
};

const defaultCardColors: CardColorSettings = {
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

const defaultEvidence: EvidenceSettings = {
  maxImages: 5,
  minNoteLength: 10,
  imageMaxSizeMB: 5,
  allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  requireNoteWithImages: true,
};

const defaultTaskTypes: TaskType[] = [
  { id: '1', name: 'Phát triển', description: 'Công việc liên quan đến code/development', icon: '', order: 1, isActive: true },
  { id: '2', name: 'Thiết kế', description: 'Công việc thiết kế UI/UX, graphics', icon: '', order: 2, isActive: true },
  { id: '3', name: 'Marketing', description: 'Công việc marketing, quảng cáo', icon: '', order: 3, isActive: true },
  { id: '4', name: 'Quản trị', description: 'Công việc hành chính, quản lý', icon: '', order: 4, isActive: true },
  { id: '5', name: 'Khác', description: 'Các loại công việc khác', icon: '', order: 5, isActive: true },
];

const defaultTemplates: TaskTemplate[] = [
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

const TASK_PRIORITY_CONFIGS: Array<{
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

const STATUS_COLOR_CONFIGS: Array<{
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

const PRIORITY_COLOR_CONFIGS: Array<{
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
// SETTINGS STORE
// ============================================

type TasksSettingsState = {
  sla: SLASettings;
  templates: TaskTemplate[];
  notifications: NotificationSettings;
  reminders: ReminderSettings;
  cardColors: CardColorSettings;
  taskTypes: TaskType[];
  evidence: EvidenceSettings;
};

const clone = <T,>(value: T): T => {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
};

const createDefaultTasksSettings = (): TasksSettingsState => ({
  sla: clone(defaultSLA),
  templates: clone(defaultTemplates),
  notifications: clone(defaultNotifications),
  reminders: clone(defaultReminders),
  cardColors: clone(defaultCardColors),
  taskTypes: clone(defaultTaskTypes),
  evidence: clone(defaultEvidence),
});

const useTasksSettingsStore = createSettingsConfigStore<TasksSettingsState>({
  storageKey: 'settings-tasks',
  getDefaultState: createDefaultTasksSettings,
});

export function loadCardColorSettings(): CardColorSettings {
  return clone(useTasksSettingsStore.getState().data.cardColors);
}

export function loadSLASettings(): SLASettings {
  return clone(useTasksSettingsStore.getState().data.sla);
}

export function loadEvidenceSettings(): EvidenceSettings {
  return clone(useTasksSettingsStore.getState().data.evidence);
}

export function loadTaskTypes(): TaskType[] {
  return clone(useTasksSettingsStore.getState().data.taskTypes).filter(t => t.isActive);
}

export function loadTaskTemplates(): TaskTemplate[] {
  return clone(useTasksSettingsStore.getState().data.templates);
}

// ============================================
// MAIN COMPONENT
// ============================================

export function TasksSettingsPage() {
  const storedSla = useTasksSettingsStore((state) => state.data.sla);
  const storedTemplates = useTasksSettingsStore((state) => state.data.templates);
  const storedNotifications = useTasksSettingsStore((state) => state.data.notifications);
  const storedReminders = useTasksSettingsStore((state) => state.data.reminders);
  const storedCardColors = useTasksSettingsStore((state) => state.data.cardColors);
  const storedTaskTypes = useTasksSettingsStore((state) => state.data.taskTypes);
  const storedEvidence = useTasksSettingsStore((state) => state.data.evidence);
  const setStoreSection = useTasksSettingsStore((state) => state.setSection);

  // States
  const [sla, setSLA] = React.useState<SLASettings>(storedSla);

  const [templates, setTemplates] = React.useState<TaskTemplate[]>(storedTemplates);
  const [editingTemplate, setEditingTemplate] = React.useState<TaskTemplate | null>(null);
  const [isAddingTemplate, setIsAddingTemplate] = React.useState(false);

  const [notifications, setNotifications] = React.useState<NotificationSettings>(storedNotifications);

  const [reminders, setReminders] = React.useState<ReminderSettings>(storedReminders);

  const [cardColors, setCardColors] = React.useState<CardColorSettings>(storedCardColors);

  const [taskTypes, setTaskTypes] = React.useState<TaskType[]>(storedTaskTypes);
  const [editingType, setEditingType] = React.useState<TaskType | null>(null);
  const [isAddingType, setIsAddingType] = React.useState(false);
  const [deleteTypeId, setDeleteTypeId] = React.useState<string | null>(null);
  const [deleteTemplateId, setDeleteTemplateId] = React.useState<string | null>(null);

  const [evidence, setEvidence] = React.useState<EvidenceSettings>(storedEvidence);

  const [activeTab, setActiveTab] = React.useState('sla');
  const { headerActions, registerActions } = useTabActionRegistry(activeTab);

  React.useEffect(() => {
    setSLA(storedSla);
  }, [storedSla]);

  React.useEffect(() => {
    setTemplates(storedTemplates);
  }, [storedTemplates]);

  React.useEffect(() => {
    setNotifications(storedNotifications);
  }, [storedNotifications]);

  React.useEffect(() => {
    setReminders(storedReminders);
  }, [storedReminders]);

  React.useEffect(() => {
    setCardColors(storedCardColors);
  }, [storedCardColors]);

  React.useEffect(() => {
    setTaskTypes(storedTaskTypes);
  }, [storedTaskTypes]);

  React.useEffect(() => {
    setEvidence(storedEvidence);
  }, [storedEvidence]);

  useSettingsPageHeader({
    title: 'Cài đặt công việc',
    actions: headerActions,
  });

  const registerSlaActions = React.useMemo(() => registerActions('sla'), [registerActions]);
  const registerTaskTypeActions = React.useMemo(() => registerActions('task-types'), [registerActions]);
  const registerEvidenceActions = React.useMemo(() => registerActions('evidence'), [registerActions]);
  const registerCardColorActions = React.useMemo(() => registerActions('card-colors'), [registerActions]);
  const registerTemplateActions = React.useMemo(() => registerActions('templates'), [registerActions]);
  const registerNotificationActions = React.useMemo(() => registerActions('notifications'), [registerActions]);

  // ============================================
  // SLA HANDLERS
  // ============================================

  const handleSLAChange = (priority: TaskPriority, field: 'responseTime' | 'completeTime', value: string) => {
    const numValue = parseInt(value) || 0;
    setSLA(prev => ({
      ...prev,
      [priority]: {
        ...prev[priority],
        [field]: numValue,
      }
    }));
  };

  const handleSaveSLA = () => {
    const priorities: TaskPriority[] = ['Thấp', 'Trung bình', 'Cao', 'Khẩn cấp'];
    const errors: string[] = [];

    priorities.forEach(priority => {
      const settings = sla[priority];
      
      if (settings.responseTime <= 0) {
        errors.push(`Thời gian phản hồi của ${priority} phải lớn hơn 0`);
      }
      
      if (settings.completeTime <= 0) {
        errors.push(`Thời gian hoàn thành của ${priority} phải lớn hơn 0`);
      }

      const responseHours = settings.responseTime / 60;
      if (settings.completeTime <= responseHours) {
        errors.push(`Thời gian hoàn thành của ${priority} phải lớn hơn thời gian phản hồi`);
      }
    });

    if (errors.length > 0) {
      toast.error('Lỗi xác thực', { description: errors.join('\n') });
      return;
    }

    setStoreSection('sla', sla);
    toast.success('Đã lưu cài đặt SLA');
  };

  const handleResetSLA = () => {
    const defaults = clone(defaultSLA);
    setSLA(defaults);
    setStoreSection('sla', defaults);
    toast.info('Đã khôi phục cài đặt mặc định');
  };

  React.useEffect(() => {
    if (activeTab !== 'sla') {
      return;
    }

    registerSlaActions([
      <SettingsActionButton key="save-sla" onClick={handleSaveSLA}>
        <Save className="h-4 w-4" /> Lưu cài đặt
      </SettingsActionButton>,
    ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, registerSlaActions]);

  // ============================================
  // EVIDENCE HANDLERS
  // ============================================

  const handleEvidenceChange = (field: keyof EvidenceSettings, value: number | boolean | string[]) => {
    setEvidence(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveEvidence = () => {
    const errors: string[] = [];

    if (evidence.maxImages < 1 || evidence.maxImages > 10) {
      errors.push('Số lượng ảnh tối đa phải từ 1-10');
    }

    if (evidence.minNoteLength < 0 || evidence.minNoteLength > 500) {
      errors.push('Độ dài ghi chú tối thiểu phải từ 0-500');
    }

    if (evidence.imageMaxSizeMB < 1 || evidence.imageMaxSizeMB > 50) {
      errors.push('Kích thước file tối đa phải từ 1-50 MB');
    }

    if (errors.length > 0) {
      toast.error('Lỗi xác thực', { description: errors.join('\n') });
      return;
    }

    setStoreSection('evidence', evidence);
    toast.success('Đã lưu cài đặt bằng chứng');
  };

  const handleResetEvidence = () => {
    const defaults = clone(defaultEvidence);
    setEvidence(defaults);
    setStoreSection('evidence', defaults);
    toast.info('Đã khôi phục cài đặt mặc định');
  };

  React.useEffect(() => {
    if (activeTab !== 'evidence') {
      return;
    }

    registerEvidenceActions([
      <SettingsActionButton key="save-evidence" onClick={handleSaveEvidence}>
        <Save className="h-4 w-4" /> Lưu cài đặt
      </SettingsActionButton>,
    ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, registerEvidenceActions]);

  // ============================================
  // TASK TYPES HANDLERS
  // ============================================

  const handleAddType = () => {
    const newType: TaskType = {
      id: Date.now().toString(),
      name: '',
      description: '',
      icon: '📌',
      order: taskTypes.length + 1,
      isActive: true,
    };
    setEditingType(newType);
    setIsAddingType(true);
  };

  const handleSaveType = () => {
    if (!editingType) return;

    if (!editingType.name.trim()) {
      toast.error('Tên loại công việc không được để trống');
      return;
    }

    const updatedTypes = isAddingType
      ? [...taskTypes, editingType]
      : taskTypes.map(t => (t.id === editingType.id ? editingType : t));

    setTaskTypes(updatedTypes);
    setStoreSection('taskTypes', updatedTypes);

    toast.success(isAddingType ? 'Đã thêm loại công việc' : 'Đã cập nhật loại công việc');
    setEditingType(null);
    setIsAddingType(false);
  };

  const handleDeleteType = (id: string) => {
    const updated = taskTypes.filter(t => t.id !== id);
    setTaskTypes(updated);
    setStoreSection('taskTypes', updated);
    toast.success('Đã xóa loại công việc');
    setDeleteTypeId(null);
  };

  const handleToggleTypeActive = (id: string) => {
    const updated = taskTypes.map(t =>
      t.id === id ? { ...t, isActive: !t.isActive } : t
    );
    setTaskTypes(updated);
    setStoreSection('taskTypes', updated);
  };

  const handleResetTypes = () => {
    const defaults = clone(defaultTaskTypes);
    setTaskTypes(defaults);
    setStoreSection('taskTypes', defaults);
    toast.info('Đã khôi phục cài đặt mặc định');
  };

  React.useEffect(() => {
    if (activeTab !== 'task-types') {
      return;
    }

    registerTaskTypeActions([
      <SettingsActionButton key="add-type" onClick={handleAddType}>
        <Plus className="h-4 w-4" /> Thêm loại mới
      </SettingsActionButton>,
    ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, registerTaskTypeActions]);

  // ============================================
  // CARD COLORS HANDLERS (Similar to complaints)
  // ============================================

  const handleCardColorToggle = (key: 'enableStatusColors' | 'enablePriorityColors' | 'enableOverdueColor') => {
    setCardColors(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleStatusColorChange = (status: StatusColorKey, value: string) => {
    setCardColors(prev => ({
      ...prev,
      statusColors: {
        ...prev.statusColors,
        [status]: value,
      },
    }));
  };

  const handlePriorityColorChange = (priority: PriorityColorKey, value: string) => {
    setCardColors(prev => ({
      ...prev,
      priorityColors: {
        ...prev.priorityColors,
        [priority]: value,
      },
    }));
  };

  const handleOverdueColorChange = (value: string) => {
    setCardColors(prev => ({
      ...prev,
      overdueColor: value,
    }));
  };

  const handleSaveCardColors = () => {
    setStoreSection('cardColors', cardColors);
    toast.success('Đã lưu cài đặt màu card');
  };

  const handleResetCardColors = () => {
    const defaults = clone(defaultCardColors);
    setCardColors(defaults);
    setStoreSection('cardColors', defaults);
    toast.info('Đã khôi phục cài đặt mặc định');
  };

  React.useEffect(() => {
    if (activeTab !== 'card-colors') {
      return;
    }

    registerCardColorActions([
      <SettingsActionButton key="save-card-colors" onClick={handleSaveCardColors}>
        <Save className="h-4 w-4" /> Lưu cài đặt
      </SettingsActionButton>,
    ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, registerCardColorActions]);

  // ============================================
  // NOTIFICATION & REMINDER HANDLERS
  // ============================================

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSaveNotifications = () => {
    setStoreSection('notifications', notifications);
    toast.success('Đã lưu cài đặt thông báo');
  };

  const handleResetNotifications = () => {
    const defaults = clone(defaultNotifications);
    setNotifications(defaults);
    setStoreSection('notifications', defaults);
    toast.info('Đã khôi phục cài đặt mặc định');
  };

  const handleReminderChange = (field: keyof ReminderSettings, value: boolean | number) => {
    setReminders(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveReminders = () => {
    setStoreSection('reminders', reminders);
    toast.success('Đã lưu cài đặt nhắc nhở');
  };

  const handleResetReminders = () => {
    const defaults = clone(defaultReminders);
    setReminders(defaults);
    setStoreSection('reminders', defaults);
    toast.info('Đã khôi phục cài đặt mặc định');
  };

  React.useEffect(() => {
    if (activeTab !== 'notifications') {
      return;
    }

    registerNotificationActions([
      <SettingsActionButton
        key="save-notifications"
        onClick={() => {
          handleSaveNotifications();
          handleSaveReminders();
        }}
      >
        <Save className="h-4 w-4" /> Lưu cài đặt
      </SettingsActionButton>,
    ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, registerNotificationActions]);

  // ============================================
  // TEMPLATE HANDLERS
  // ============================================

  const handleAddTemplate = () => {
    setEditingTemplate({
      id: Date.now().toString(),
      name: '',
      title: '',
      description: '',
      category: 'general',
      estimatedHours: 0,
      order: templates.length + 1,
    });
    setIsAddingTemplate(true);
  };

  const handleSaveTemplate = () => {
    if (!editingTemplate) return;

    if (!editingTemplate.name.trim() || !editingTemplate.title.trim()) {
      toast.error('Vui lòng điền đầy đủ tên và tiêu đề mẫu');
      return;
    }

    let updatedTemplates: TaskTemplate[];
    
    if (isAddingTemplate) {
      updatedTemplates = [...templates, editingTemplate];
    } else {
      updatedTemplates = templates.map(t => 
        t.id === editingTemplate.id ? editingTemplate : t
      );
    }

    setTemplates(updatedTemplates);
    setStoreSection('templates', updatedTemplates);
    
    toast.success(isAddingTemplate ? 'Đã thêm mẫu' : 'Đã cập nhật mẫu');

    setEditingTemplate(null);
    setIsAddingTemplate(false);
  };

  const handleDeleteTemplate = (id: string) => {
    const updatedTemplates = templates.filter(t => t.id !== id);
    setTemplates(updatedTemplates);
    setStoreSection('templates', updatedTemplates);
    toast.success('Đã xóa mẫu');
    setDeleteTemplateId(null);
  };

  const handleResetTemplates = () => {
    const defaults = clone(defaultTemplates);
    setTemplates(defaults);
    setStoreSection('templates', defaults);
    toast.info('Đã khôi phục mẫu mặc định');
  };

  React.useEffect(() => {
    if (activeTab !== 'templates') {
      return;
    }

    registerTemplateActions([
      <SettingsActionButton key="add-template" onClick={handleAddTemplate}>
        <Plus className="h-4 w-4" /> Thêm mẫu
      </SettingsActionButton>,
    ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, registerTemplateActions]);

  const tabs = React.useMemo(
    () => [
      { value: 'sla', label: 'SLA' },
      { value: 'task-types', label: 'Loại CV' },
      { value: 'evidence', label: 'Bằng chứng' },
      { value: 'card-colors', label: 'Màu card' },
      { value: 'templates', label: 'Mẫu CV' },
      { value: 'notifications', label: 'Thông báo' },
    ],
    [],
  );

  // ============================================
  // RENDER
  // ============================================

  return (
    <SettingsVerticalTabs value={activeTab} onValueChange={setActiveTab} tabs={tabs}>
      {/* TAB 1: SLA SETTINGS */}
      <TabsContent value="sla" className="mt-0 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Cài đặt SLA (Service Level Agreement)</CardTitle>
              <CardDescription>
                Thiết lập thời gian phản hồi và hoàn thành công việc theo mức độ ưu tiên
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {TASK_PRIORITY_CONFIGS.map(({ key, label, description, indicatorClass }) => (
                <SettingsFormSection
                  key={key}
                  title={label}
                  description={description}
                  badge={(
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className={`h-2.5 w-2.5 rounded-full ${indicatorClass}`} />
                      {key}
                    </div>
                  )}
                >
                  <SettingsFormGrid>
                    <div className="space-y-2">
                      <Label htmlFor={`sla-${key}-response`}>Thời gian phản hồi tối đa (phút)</Label>
                      <Input
                        id={`sla-${key}-response`}
                        type="number"
                        className="h-9"
                        value={sla[key].responseTime}
                        onChange={(e) => handleSLAChange(key, 'responseTime', e.target.value)}
                        min="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`sla-${key}-complete`}>Thời gian hoàn thành tối đa (giờ)</Label>
                      <Input
                        id={`sla-${key}-complete`}
                        type="number"
                        className="h-9"
                        value={sla[key].completeTime}
                        onChange={(e) => handleSLAChange(key, 'completeTime', e.target.value)}
                        min="0"
                      />
                    </div>
                  </SettingsFormGrid>
                </SettingsFormSection>
              ))}

            </CardContent>
          </Card>
      </TabsContent>

      {/* TAB 2: TASK TYPES */}
      <TabsContent value="task-types" className="mt-0 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Loại công việc</CardTitle>
              <CardDescription>
                Quản lý các loại công việc để phân loại và lọc task dễ dàng hơn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SettingsFormSection
                title="Danh sách loại công việc"
                description="Chuẩn hóa bộ lọc và automation theo từng nhóm task."
                contentClassName="space-y-4"
              >
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tên loại</TableHead>
                        <TableHead>Mô tả</TableHead>
                        <TableHead className="w-[100px]">Trạng thái</TableHead>
                        <TableHead className="w-[120px]">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {taskTypes.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground">
                            Chưa có loại công việc nào
                          </TableCell>
                        </TableRow>
                      ) : (
                        taskTypes.map((type) => (
                          <TableRow key={type.id}>
                            <TableCell className="font-medium">{type.name}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {type.description}
                            </TableCell>
                            <TableCell>
                              <Switch
                                checked={type.isActive}
                                onCheckedChange={() => handleToggleTypeActive(type.id)}
                              />
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setEditingType(type);
                                      setIsAddingType(false);
                                    }}
                                  >
                                    Sửa
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => setDeleteTypeId(type.id)}
                                  >
                                    Xóa
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </SettingsFormSection>
            </CardContent>
          </Card>

      {/* Dialog chỉnh sửa loại công việc */}
      <Dialog open={!!editingType} onOpenChange={(open) => {
        if (!open) {
          setEditingType(null);
          setIsAddingType(false);
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isAddingType ? 'Thêm loại công việc mới' : 'Chỉnh sửa loại công việc'}</DialogTitle>
            <DialogDescription>
              Điền thông tin hiển thị trên task board và bộ lọc.
            </DialogDescription>
          </DialogHeader>
          {editingType && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type-name">Tên loại công việc *</Label>
                <Input
                  id="type-name"
                  className="h-9"
                  value={editingType.name}
                  onChange={(e) => setEditingType({ ...editingType, name: e.target.value })}
                  placeholder="VD: Phát triển"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type-description">Mô tả</Label>
                <Textarea
                  id="type-description"
                  value={editingType.description}
                  onChange={(e) => setEditingType({ ...editingType, description: e.target.value })}
                  placeholder="VD: Công việc liên quan đến code/development"
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="type-active"
                  checked={editingType.isActive}
                  onCheckedChange={(checked) => setEditingType({ ...editingType, isActive: checked })}
                />
                <Label htmlFor="type-active" className="cursor-pointer">
                  Kích hoạt
                </Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditingType(null);
                setIsAddingType(false);
              }}
            >
              Hủy
            </Button>
            <Button onClick={handleSaveType}>
              <Save className="h-4 w-4 mr-2" />
              {isAddingType ? 'Thêm loại' : 'Lưu thay đổi'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AlertDialog xác nhận xóa loại công việc */}
      <AlertDialog open={!!deleteTypeId} onOpenChange={(open) => !open && setDeleteTypeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa loại công việc này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteTypeId && handleDeleteType(deleteTypeId)}
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </TabsContent>

      {/* TAB 3: EVIDENCE SETTINGS */}
      <TabsContent value="evidence" className="mt-0 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Cài đặt bằng chứng hoàn thành</CardTitle>
              <CardDescription>
                Cấu hình yêu cầu về hình ảnh và ghi chú khi hoàn thành công việc
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SettingsFormSection
                title="Giới hạn ảnh & dung lượng"
                description="Áp dụng khi nhân viên tải ảnh hoàn thành task."
              >
                <SettingsFormGrid>
                  <div className="space-y-2">
                    <Label htmlFor="max-images">Số lượng ảnh tối đa</Label>
                    <Input
                      id="max-images"
                      type="number"
                      className="h-9"
                      value={evidence.maxImages}
                      onChange={(e) => handleEvidenceChange('maxImages', parseInt(e.target.value) || 1)}
                      min="1"
                      max="10"
                    />
                    <p className="text-xs text-muted-foreground">Giới hạn từ 1-10 ảnh mỗi lần gửi.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-size">Kích thước file tối đa (MB)</Label>
                    <Input
                      id="max-size"
                      type="number"
                      className="h-9"
                      value={evidence.imageMaxSizeMB}
                      onChange={(e) => handleEvidenceChange('imageMaxSizeMB', parseInt(e.target.value) || 1)}
                      min="1"
                      max="50"
                    />
                    <p className="text-xs text-muted-foreground">Chấp nhận từ 1-50MB cho mỗi ảnh.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="min-note">Độ dài ghi chú tối thiểu (ký tự)</Label>
                    <Input
                      id="min-note"
                      type="number"
                      className="h-9"
                      value={evidence.minNoteLength}
                      onChange={(e) => handleEvidenceChange('minNoteLength', parseInt(e.target.value) || 0)}
                      min="0"
                      max="500"
                    />
                    <p className="text-xs text-muted-foreground">0 = không bắt buộc ghi chú.</p>
                  </div>
                </SettingsFormGrid>
              </SettingsFormSection>

              <SettingsFormSection
                title="Ghi chú & định dạng file"
                description="Đảm bảo bằng chứng có thông tin đầy đủ khi gửi duyệt."
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Switch
                      id="require-note"
                      checked={evidence.requireNoteWithImages}
                      onCheckedChange={(checked) => handleEvidenceChange('requireNoteWithImages', checked)}
                    />
                    <div>
                      <Label htmlFor="require-note" className="cursor-pointer">
                        Bắt buộc ghi chú khi đính kèm ảnh
                      </Label>
                      <p className="text-xs text-muted-foreground">Tăng chất lượng bằng chứng khi gửi cho quản lý.</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-blue-950 dark:border-blue-800">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                      💡 Định dạng ảnh được hỗ trợ
                    </p>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                      <li>JPEG (.jpg, .jpeg)</li>
                      <li>PNG (.png)</li>
                      <li>WebP (.webp)</li>
                    </ul>
                  </div>
                </div>
              </SettingsFormSection>

            </CardContent>
          </Card>
      </TabsContent>

      {/* TAB 4: CARD COLORS */}
      <TabsContent value="card-colors" className="mt-0 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Màu sắc card công việc</CardTitle>
              <CardDescription>
                Đồng bộ màu card giữa task board và timeline để dễ quét trạng thái
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SettingsFormSection
                title="Quy tắc áp dụng màu"
                description="Chọn nhóm hiển thị màu cho board."
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enable-status">Màu theo trạng thái</Label>
                      <p className="text-sm text-muted-foreground">Giúp nhận biết tiến độ task theo lifecycle.</p>
                    </div>
                    <Switch
                      id="enable-status"
                      checked={cardColors.enableStatusColors}
                      onCheckedChange={() => handleCardColorToggle('enableStatusColors')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enable-priority">Màu theo độ ưu tiên</Label>
                      <p className="text-sm text-muted-foreground">Đổi màu dựa trên priority (Low → Urgent).</p>
                    </div>
                    <Switch
                      id="enable-priority"
                      checked={cardColors.enablePriorityColors}
                      onCheckedChange={() => handleCardColorToggle('enablePriorityColors')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enable-overdue">Màu cảnh báo quá hạn</Label>
                      <p className="text-sm text-muted-foreground">Đổi màu card thành đỏ khi task trễ SLA.</p>
                    </div>
                    <Switch
                      id="enable-overdue"
                      checked={cardColors.enableOverdueColor}
                      onCheckedChange={() => handleCardColorToggle('enableOverdueColor')}
                    />
                  </div>
                </div>
              </SettingsFormSection>

              {cardColors.enableStatusColors && (
                <SettingsFormSection
                  title="Màu theo trạng thái"
                  description="Cá nhân hóa màu nền card cho từng trạng thái task."
                >
                  <SettingsFormGrid>
                    {STATUS_COLOR_CONFIGS.map(({ key, label, helper }) => (
                      <div key={key} className="space-y-2">
                        <TailwindColorPicker
                          label={`Màu cho trạng thái "${label}"`}
                          value={cardColors.statusColors[key]}
                          onChange={(value) => handleStatusColorChange(key, value)}
                          placeholder="bg-blue-50 border-blue-200"
                        />
                        <p className="text-xs text-muted-foreground">{helper}</p>
                      </div>
                    ))}
                  </SettingsFormGrid>
                </SettingsFormSection>
              )}

              {cardColors.enablePriorityColors && (
                <SettingsFormSection
                  title="Màu theo độ ưu tiên"
                  description="Áp dụng khi board hiển thị priority nổi bật."
                >
                  <SettingsFormGrid>
                    {PRIORITY_COLOR_CONFIGS.map(({ key, label, helper }) => (
                      <div key={key} className="space-y-2">
                        <TailwindColorPicker
                          label={`Màu cho ${label}`}
                          value={cardColors.priorityColors[key]}
                          onChange={(value) => handlePriorityColorChange(key, value)}
                          placeholder="bg-amber-50 border-amber-200"
                        />
                        <p className="text-xs text-muted-foreground">{helper}</p>
                      </div>
                    ))}
                  </SettingsFormGrid>
                </SettingsFormSection>
              )}

              {cardColors.enableOverdueColor && (
                <SettingsFormSection
                  title="Màu cảnh báo quá hạn"
                  description="Ưu tiên hiển thị màu cảnh báo trên mọi card quá hạn."
                >
                  <div className="space-y-2">
                    <TailwindColorPicker
                      label="Màu card quá hạn"
                      value={cardColors.overdueColor}
                      onChange={handleOverdueColorChange}
                      placeholder="bg-red-50 border-red-400"
                    />
                    <p className="text-xs text-muted-foreground">
                      Khi bật, màu này sẽ ghi đè mọi cấu hình khác cho task trễ deadline.
                    </p>
                  </div>
                </SettingsFormSection>
              )}

            </CardContent>
          </Card>
      </TabsContent>

      {/* TAB 5: TEMPLATES */}
      <TabsContent value="templates" className="mt-0 space-y-4">
          <Card>
            <CardHeader>
              <div>
                <CardTitle className="text-lg font-semibold">Mẫu công việc</CardTitle>
                <CardDescription>
                  Tạo và quản lý các mẫu công việc để tạo task nhanh hơn
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <SettingsFormSection
                title="Danh sách mẫu công việc"
                description="Chuẩn hóa nội dung mô tả, checklist và thời gian ước tính."
                contentClassName="space-y-4"
              >
                {templates.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Chưa có mẫu nào. Nhấn "Thêm mẫu" để tạo mẫu mới.
                  </div>
                ) : (
                  <div className="rounded-lg border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tên mẫu</TableHead>
                          <TableHead>Danh mục</TableHead>
                          <TableHead>Ước tính (giờ)</TableHead>
                          <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {templates.map(template => (
                          <TableRow key={template.id}>
                            <TableCell className="font-medium">{template.name}</TableCell>
                            <TableCell>
                              <span className="text-xs px-2 py-1 rounded-md bg-muted">
                                {template.category === 'development' && 'Phát triển'}
                                {template.category === 'design' && 'Thiết kế'}
                                {template.category === 'marketing' && 'Marketing'}
                                {template.category === 'admin' && 'Quản trị'}
                                {template.category === 'general' && 'Chung'}
                              </span>
                            </TableCell>
                            <TableCell>{template.estimatedHours}h</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setEditingTemplate(template);
                                      setIsAddingTemplate(false);
                                    }}
                                  >
                                    Sửa
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => setDeleteTemplateId(template.id)}
                                  >
                                    Xóa
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </SettingsFormSection>
            </CardContent>
          </Card>

      {/* Dialog chỉnh sửa mẫu công việc */}
      <Dialog open={!!editingTemplate} onOpenChange={(open) => {
        if (!open) {
          setEditingTemplate(null);
          setIsAddingTemplate(false);
        }
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isAddingTemplate ? 'Thêm mẫu mới' : 'Chỉnh sửa mẫu'}</DialogTitle>
            <DialogDescription>
              Điền chi tiết template dùng khi tạo nhanh công việc.
            </DialogDescription>
          </DialogHeader>
          {editingTemplate && (
            <div className="space-y-4">
              <SettingsFormGrid>
                <div className="space-y-2">
                  <Label htmlFor="template-name">Tên mẫu *</Label>
                  <Input
                    id="template-name"
                    className="h-9"
                    value={editingTemplate.name}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                    placeholder="VD: Bug Fix"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template-category">Danh mục</Label>
                  <Select
                    value={editingTemplate.category}
                    onValueChange={(value) => setEditingTemplate({ 
                      ...editingTemplate, 
                      category: value as TaskTemplate['category']
                    })}
                  >
                    <SelectTrigger id="template-category" className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="development">Phát triển</SelectItem>
                      <SelectItem value="design">Thiết kế</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="admin">Quản trị</SelectItem>
                      <SelectItem value="general">Chung</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="template-title">Tiêu đề mẫu *</Label>
                  <Input
                    id="template-title"
                    className="h-9"
                    value={editingTemplate.title}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, title: e.target.value })}
                    placeholder="VD: Sửa lỗi: [Tên lỗi]"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Mô tả mẫu</Label>
                  <TipTapEditor
                    content={editingTemplate.description}
                    onChange={(content) => setEditingTemplate({ ...editingTemplate, description: content })}
                    placeholder="Nhập mô tả chi tiết..."
                    minHeight="150px"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template-hours">Ước tính thời gian (giờ)</Label>
                  <Input
                    id="template-hours"
                    type="number"
                    className="h-9"
                    value={editingTemplate.estimatedHours}
                    onChange={(e) => setEditingTemplate({ 
                      ...editingTemplate, 
                      estimatedHours: parseInt(e.target.value) || 0 
                    })}
                    min="0"
                  />
                </div>
              </SettingsFormGrid>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setEditingTemplate(null);
              setIsAddingTemplate(false);
            }}>
              Hủy
            </Button>
            <Button onClick={handleSaveTemplate}>
              <Save className="h-4 w-4 mr-2" />
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AlertDialog xác nhận xóa mẫu */}
      <AlertDialog open={!!deleteTemplateId} onOpenChange={(open) => !open && setDeleteTemplateId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa mẫu công việc này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteTemplateId && handleDeleteTemplate(deleteTemplateId)}
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </TabsContent>

      {/* TAB 6: NOTIFICATIONS & REMINDERS */}
      <TabsContent value="notifications" className="mt-0 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Cài đặt thông báo & nhắc nhở</CardTitle>
              <CardDescription>
                Quản lý thông báo và nhắc nhở tự động cho công việc
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SettingsFormSection
                title="Thông báo Email"
                description="Gửi cập nhật tới người phụ trách và quản lý theo từng giai đoạn."
                contentClassName="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-create" className="cursor-pointer">
                    Khi công việc mới được tạo
                  </Label>
                  <Switch
                    id="email-create"
                    checked={notifications.emailOnCreate}
                    onCheckedChange={() => handleNotificationChange('emailOnCreate')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-assign" className="cursor-pointer">
                    Khi được phân công
                  </Label>
                  <Switch
                    id="email-assign"
                    checked={notifications.emailOnAssign}
                    onCheckedChange={() => handleNotificationChange('emailOnAssign')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-complete" className="cursor-pointer">
                    Khi công việc hoàn thành
                  </Label>
                  <Switch
                    id="email-complete"
                    checked={notifications.emailOnComplete}
                    onCheckedChange={() => handleNotificationChange('emailOnComplete')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-overdue" className="cursor-pointer">
                    Khi công việc quá hạn
                  </Label>
                  <Switch
                    id="email-overdue"
                    checked={notifications.emailOnOverdue}
                    onCheckedChange={() => handleNotificationChange('emailOnOverdue')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-approval" className="cursor-pointer">
                    Khi có bằng chứng chờ duyệt
                  </Label>
                  <Switch
                    id="email-approval"
                    checked={notifications.emailOnApprovalPending}
                    onCheckedChange={() => handleNotificationChange('emailOnApprovalPending')}
                  />
                </div>
              </SettingsFormSection>

              <SettingsFormSection
                title="Thông báo trong ứng dụng"
                description="Hiển thị trong hệ thống dành cho quản lý task."
              >
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="inapp" className="cursor-pointer">Bật thông báo in-app</Label>
                    <p className="text-xs text-muted-foreground">Áp dụng cho desktop và mobile app.</p>
                  </div>
                  <Switch
                    id="inapp"
                    checked={notifications.inAppNotifications}
                    onCheckedChange={() => handleNotificationChange('inAppNotifications')}
                  />
                </div>
              </SettingsFormSection>

              <SettingsFormSection
                title="Cảnh báo SMS"
                description="Chỉ nên bật cho sự kiện quan trọng để tránh spam."
              >
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-overdue" className="cursor-pointer">
                    Gửi SMS khi task quá hạn
                  </Label>
                  <Switch
                    id="sms-overdue"
                    checked={notifications.smsOnOverdue}
                    onCheckedChange={() => handleNotificationChange('smsOnOverdue')}
                  />
                </div>
              </SettingsFormSection>

              <SettingsFormSection
                title="Nhắc nhở & leo thang"
                description="Tự động đôn đốc task lâu không cập nhật."
              >
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="reminders-enabled" className="cursor-pointer">
                      Bật nhắc nhở thông minh
                    </Label>
                    <p className="text-xs text-muted-foreground">Gửi email/in-app tới assignee nếu task đứng yên.</p>
                  </div>
                  <Switch
                    id="reminders-enabled"
                    checked={reminders.enabled}
                    onCheckedChange={(checked) => handleReminderChange('enabled', checked)}
                  />
                </div>

                {reminders.enabled && (
                  <SettingsFormGrid className="pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-reminder">Nhắc nhở lần 1 (giờ)</Label>
                      <Input
                        id="first-reminder"
                        type="number"
                        className="h-9"
                        min="1"
                        value={reminders.firstReminderHours}
                        onChange={(e) => handleReminderChange('firstReminderHours', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="second-reminder">Nhắc nhở lần 2 (giờ)</Label>
                      <Input
                        id="second-reminder"
                        type="number"
                        className="h-9"
                        min="1"
                        value={reminders.secondReminderHours}
                        onChange={(e) => handleReminderChange('secondReminderHours', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="escalation">
                        Báo động leo thang (giờ)
                      </Label>
                      <Input
                        id="escalation"
                        type="number"
                        className="h-9"
                        min="1"
                        value={reminders.escalationHours}
                        onChange={(e) => handleReminderChange('escalationHours', parseInt(e.target.value) || 1)}
                      />
                    </div>
                  </SettingsFormGrid>
                )}
              </SettingsFormSection>

            </CardContent>
          </Card>
      </TabsContent>
    </SettingsVerticalTabs>
  );
}
