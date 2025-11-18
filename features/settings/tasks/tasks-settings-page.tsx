import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs.tsx';
import { Label } from '../../../components/ui/label.tsx';
import { Input } from '../../../components/ui/input.tsx';
import { Button } from '../../../components/ui/button.tsx';
import { Switch } from '../../../components/ui/switch.tsx';
import { Textarea } from '../../../components/ui/textarea.tsx';
import { TailwindColorPicker } from '../../../components/ui/tailwind-color-picker.tsx';
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
  AlertCircle,
  Bell,
  Clock,
  Image,
  ListTodo,
  MessageSquare,
  Plus,
  RotateCcw,
  Save,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { usePageHeader } from '../../../contexts/page-header-context.tsx';
import { ResponsiveContainer } from '../../../components/mobile/responsive-container.tsx';
import { useMediaQuery } from '../../../lib/use-media-query.ts';
import type { TaskPriority, TaskStatus } from '../../tasks/types.ts';

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

interface EvidenceSettings {
  maxImages: number;
  minNoteLength: number;
  imageMaxSizeMB: number;
  allowedFormats: string[];
  requireNoteWithImages: boolean;
}

interface TaskType {
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
  { id: '1', name: 'Phát triển', description: 'Công việc liên quan đến code/development', icon: '💻', order: 1, isActive: true },
  { id: '2', name: 'Thiết kế', description: 'Công việc thiết kế UI/UX, graphics', icon: '🎨', order: 2, isActive: true },
  { id: '3', name: 'Marketing', description: 'Công việc marketing, quảng cáo', icon: '📢', order: 3, isActive: true },
  { id: '4', name: 'Quản trị', description: 'Công việc hành chính, quản lý', icon: '📋', order: 4, isActive: true },
  { id: '5', name: 'Khác', description: 'Các loại công việc khác', icon: '📌', order: 5, isActive: true },
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

// ============================================
// STORAGE HELPERS
// ============================================

const STORAGE_KEYS = {
  SLA: 'tasks-sla-settings',
  TEMPLATES: 'tasks-templates',
  NOTIFICATIONS: 'tasks-notification-settings',
  REMINDERS: 'tasks-reminder-settings',
  CARD_COLORS: 'tasks-card-colors',
  TASK_TYPES: 'tasks-types',
  EVIDENCE: 'tasks-evidence-settings',
};

function loadSettings<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveSettings<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Export functions for other components
export function loadCardColorSettings(): CardColorSettings {
  return loadSettings(STORAGE_KEYS.CARD_COLORS, defaultCardColors);
}

export function loadSLASettings(): SLASettings {
  return loadSettings(STORAGE_KEYS.SLA, defaultSLA);
}

export function loadEvidenceSettings(): EvidenceSettings {
  return loadSettings(STORAGE_KEYS.EVIDENCE, defaultEvidence);
}

export function loadTaskTemplates(): TaskTemplate[] {
  return loadSettings(STORAGE_KEYS.TEMPLATES, defaultTemplates);
}

// ============================================
// MAIN COMPONENT
// ============================================

export function TasksSettingsPage() {
  const isMobile = !useMediaQuery("(min-width: 768px)");

  // States
  const [sla, setSLA] = React.useState<SLASettings>(() => 
    loadSettings(STORAGE_KEYS.SLA, defaultSLA)
  );

  const [templates, setTemplates] = React.useState<TaskTemplate[]>(() => 
    loadSettings(STORAGE_KEYS.TEMPLATES, defaultTemplates)
  );
  const [editingTemplate, setEditingTemplate] = React.useState<TaskTemplate | null>(null);
  const [isAddingTemplate, setIsAddingTemplate] = React.useState(false);

  const [notifications, setNotifications] = React.useState<NotificationSettings>(() => 
    loadSettings(STORAGE_KEYS.NOTIFICATIONS, defaultNotifications)
  );

  const [reminders, setReminders] = React.useState<ReminderSettings>(() => 
    loadSettings(STORAGE_KEYS.REMINDERS, defaultReminders)
  );

  const [cardColors, setCardColors] = React.useState<CardColorSettings>(() => 
    loadSettings(STORAGE_KEYS.CARD_COLORS, defaultCardColors)
  );

  const [taskTypes, setTaskTypes] = React.useState<TaskType[]>(() => 
    loadSettings(STORAGE_KEYS.TASK_TYPES, defaultTaskTypes)
  );
  const [editingType, setEditingType] = React.useState<TaskType | null>(null);
  const [isAddingType, setIsAddingType] = React.useState(false);

  const [evidence, setEvidence] = React.useState<EvidenceSettings>(() => 
    loadSettings(STORAGE_KEYS.EVIDENCE, defaultEvidence)
  );

  usePageHeader({
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Cài đặt', href: '/settings', isCurrent: false },
      { label: 'Công việc', href: '/settings/tasks', isCurrent: true }
    ],
  });

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

    saveSettings(STORAGE_KEYS.SLA, sla);
    toast.success('✅ Đã lưu cài đặt SLA');
  };

  const handleResetSLA = () => {
    setSLA(defaultSLA);
    toast.info('ℹ️ Đã khôi phục cài đặt mặc định');
  };

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

    saveSettings(STORAGE_KEYS.EVIDENCE, evidence);
    toast.success('✅ Đã lưu cài đặt bằng chứng');
  };

  const handleResetEvidence = () => {
    setEvidence(defaultEvidence);
    toast.info('ℹ️ Đã khôi phục cài đặt mặc định');
  };

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

    if (isAddingType) {
      setTaskTypes([...taskTypes, editingType]);
    } else {
      setTaskTypes(taskTypes.map(t => t.id === editingType.id ? editingType : t));
    }

    saveSettings(STORAGE_KEYS.TASK_TYPES, isAddingType 
      ? [...taskTypes, editingType] 
      : taskTypes.map(t => t.id === editingType.id ? editingType : t)
    );

    toast.success(isAddingType ? '✅ Đã thêm loại công việc' : '✅ Đã cập nhật loại công việc');
    setEditingType(null);
    setIsAddingType(false);
  };

  const handleDeleteType = (id: string) => {
    const updated = taskTypes.filter(t => t.id !== id);
    setTaskTypes(updated);
    saveSettings(STORAGE_KEYS.TASK_TYPES, updated);
    toast.success('✅ Đã xóa loại công việc');
  };

  const handleToggleTypeActive = (id: string) => {
    const updated = taskTypes.map(t => 
      t.id === id ? { ...t, isActive: !t.isActive } : t
    );
    setTaskTypes(updated);
    saveSettings(STORAGE_KEYS.TASK_TYPES, updated);
  };

  const handleResetTypes = () => {
    setTaskTypes(defaultTaskTypes);
    saveSettings(STORAGE_KEYS.TASK_TYPES, defaultTaskTypes);
    toast.info('ℹ️ Đã khôi phục cài đặt mặc định');
  };

  // ============================================
  // CARD COLORS HANDLERS (Similar to complaints)
  // ============================================

  const handleCardColorToggle = (key: 'enableStatusColors' | 'enablePriorityColors' | 'enableOverdueColor') => {
    setCardColors(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSaveCardColors = () => {
    saveSettings(STORAGE_KEYS.CARD_COLORS, cardColors);
    toast.success('✅ Đã lưu cài đặt màu card');
  };

  const handleResetCardColors = () => {
    setCardColors(defaultCardColors);
    toast.info('ℹ️ Đã khôi phục cài đặt mặc định');
  };

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
    saveSettings(STORAGE_KEYS.NOTIFICATIONS, notifications);
    toast.success('✅ Đã lưu cài đặt thông báo');
  };

  const handleResetNotifications = () => {
    setNotifications(defaultNotifications);
    toast.info('ℹ️ Đã khôi phục cài đặt mặc định');
  };

  const handleReminderChange = (field: keyof ReminderSettings, value: boolean | number) => {
    setReminders(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveReminders = () => {
    saveSettings(STORAGE_KEYS.REMINDERS, reminders);
    toast.success('✅ Đã lưu cài đặt nhắc nhở');
  };

  const handleResetReminders = () => {
    setReminders(defaultReminders);
    toast.info('ℹ️ Đã khôi phục cài đặt mặc định');
  };

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
    saveSettings(STORAGE_KEYS.TEMPLATES, updatedTemplates);
    
    toast.success(isAddingTemplate ? '✅ Đã thêm mẫu' : '✅ Đã cập nhật mẫu');

    setEditingTemplate(null);
    setIsAddingTemplate(false);
  };

  const handleDeleteTemplate = (id: string) => {
    const updatedTemplates = templates.filter(t => t.id !== id);
    setTemplates(updatedTemplates);
    saveSettings(STORAGE_KEYS.TEMPLATES, updatedTemplates);
    toast.success('✅ Đã xóa mẫu');
  };

  const handleResetTemplates = () => {
    setTemplates(defaultTemplates);
    saveSettings(STORAGE_KEYS.TEMPLATES, defaultTemplates);
    toast.info('ℹ️ Đã khôi phục mẫu mặc định');
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <ResponsiveContainer maxWidth="full" padding={isMobile ? "sm" : "md"}>
      <Tabs defaultValue="sla" className="space-y-6">
        <TabsList className={`grid w-full ${isMobile ? 'grid-cols-3' : 'grid-cols-7'}`}>
          <TabsTrigger value="sla">
            <Clock className="h-4 w-4 mr-2" />
            {!isMobile && 'SLA'}
          </TabsTrigger>
          <TabsTrigger value="task-types">
            <ListTodo className="h-4 w-4 mr-2" />
            {!isMobile && 'Loại CV'}
          </TabsTrigger>
          <TabsTrigger value="evidence">
            <Image className="h-4 w-4 mr-2" />
            {!isMobile && 'Bằng chứng'}
          </TabsTrigger>
          <TabsTrigger value="card-colors">
            <AlertCircle className="h-4 w-4 mr-2" />
            {!isMobile && 'Màu card'}
          </TabsTrigger>
          <TabsTrigger value="templates">
            <MessageSquare className="h-4 w-4 mr-2" />
            {!isMobile && 'Mẫu CV'}
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            {!isMobile && 'Thông báo'}
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: SLA SETTINGS */}
        <TabsContent value="sla" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Cài đặt SLA (Service Level Agreement)</CardTitle>
              <CardDescription>
                Thiết lập thời gian phản hồi và hoàn thành công việc theo mức độ ưu tiên
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {(['Thấp', 'Trung bình', 'Cao', 'Khẩn cấp'] as TaskPriority[]).map((priority, idx) => {
                const colors = ['green', 'yellow', 'orange', 'red'];
                return (
                  <div key={priority} className="space-y-3 p-4 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full bg-${colors[idx]}-500`} />
                      <h3 className="font-semibold">{priority}</h3>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`${priority}-response`}>Thời gian phản hồi tối đa (phút)</Label>
                        <Input
                          id={`${priority}-response`}
                          type="number"
                          className="h-9"
                          value={sla[priority].responseTime}
                          onChange={(e) => handleSLAChange(priority, 'responseTime', e.target.value)}
                          min="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`${priority}-complete`}>Thời gian hoàn thành tối đa (giờ)</Label>
                        <Input
                          id={`${priority}-complete`}
                          type="number"
                          className="h-9"
                          value={sla[priority].completeTime}
                          onChange={(e) => handleSLAChange(priority, 'completeTime', e.target.value)}
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="flex gap-2 pt-4">
                <Button className="h-9" onClick={handleSaveSLA}>
                  <Save className="h-4 w-4 mr-2" />
                  Lưu cài đặt
                </Button>
                <Button variant="outline" className="h-9" onClick={handleResetSLA}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Khôi phục mặc định
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: TASK TYPES */}
        <TabsContent value="task-types" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Loại công việc</CardTitle>
              <CardDescription>
                Quản lý các loại công việc để phân loại và lọc task dễ dàng hơn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Button onClick={handleAddType} size="sm" className="h-9">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm loại mới
                </Button>
                <Button variant="outline" size="sm" className="h-9" onClick={handleResetTypes}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Khôi phục mặc định
                </Button>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Icon</TableHead>
                      <TableHead>Tên loại</TableHead>
                      <TableHead>Mô tả</TableHead>
                      <TableHead className="w-[100px]">Trạng thái</TableHead>
                      <TableHead className="w-[120px]">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taskTypes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          Chưa có loại công việc nào
                        </TableCell>
                      </TableRow>
                    ) : (
                      taskTypes.map((type) => (
                        <TableRow key={type.id}>
                          <TableCell className="text-2xl">{type.icon}</TableCell>
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
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingType(type);
                                  setIsAddingType(false);
                                }}
                              >
                                Sửa
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteType(type.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {editingType && (
                <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold">
                      {isAddingType ? 'Thêm loại công việc mới' : 'Chỉnh sửa loại công việc'}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingType(null);
                        setIsAddingType(false);
                      }}
                    >
                      Hủy
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="type-icon">Icon (emoji)</Label>
                      <Input
                        id="type-icon"
                        className="h-9"
                        value={editingType.icon}
                        onChange={(e) => setEditingType({ ...editingType, icon: e.target.value })}
                        placeholder="📌"
                        maxLength={2}
                      />
                    </div>

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

                  <Button className="h-9" onClick={handleSaveType}>
                    <Save className="h-4 w-4 mr-2" />
                    {isAddingType ? 'Thêm loại' : 'Lưu thay đổi'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: EVIDENCE SETTINGS */}
        <TabsContent value="evidence" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Cài đặt bằng chứng hoàn thành</CardTitle>
              <CardDescription>
                Cấu hình yêu cầu về hình ảnh và ghi chú khi hoàn thành công việc
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
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
                  <p className="text-xs text-muted-foreground">Từ 1-10 ảnh</p>
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
                  <p className="text-xs text-muted-foreground">0 = không bắt buộc ghi chú</p>
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
                  <p className="text-xs text-muted-foreground">Từ 1-50 MB</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="require-note"
                      checked={evidence.requireNoteWithImages}
                      onCheckedChange={(checked) => handleEvidenceChange('requireNoteWithImages', checked)}
                    />
                    <Label htmlFor="require-note" className="cursor-pointer">
                      Bắt buộc ghi chú khi có ảnh
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Yêu cầu người dùng phải nhập ghi chú khi upload ảnh
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-blue-950 dark:border-blue-800">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                  💡 Định dạng ảnh được hỗ trợ:
                </p>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                  <li>JPEG (.jpg, .jpeg)</li>
                  <li>PNG (.png)</li>
                  <li>WebP (.webp)</li>
                </ul>
              </div>

              <div className="flex gap-2 pt-4">
                <Button className="h-9" onClick={handleSaveEvidence}>
                  <Save className="h-4 w-4 mr-2" />
                  Lưu cài đặt
                </Button>
                <Button variant="outline" className="h-9" onClick={handleResetEvidence}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Khôi phục mặc định
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: CARD COLORS - Similar structure to complaints */}
        <TabsContent value="card-colors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Màu sắc card công việc</CardTitle>
              <CardDescription>
                Tùy chỉnh màu hiển thị card theo trạng thái, độ ưu tiên và quá hạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-semibold">Bật/Tắt hiển thị màu</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enable-overdue">Màu quá hạn</Label>
                    <p className="text-sm text-muted-foreground">Hiển thị màu đỏ cho task quá hạn</p>
                  </div>
                  <Switch
                    id="enable-overdue"
                    checked={cardColors.enableOverdueColor}
                    onCheckedChange={() => handleCardColorToggle('enableOverdueColor')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enable-priority">Màu theo độ ưu tiên</Label>
                    <p className="text-sm text-muted-foreground">Hiển thị màu theo priority</p>
                  </div>
                  <Switch
                    id="enable-priority"
                    checked={cardColors.enablePriorityColors}
                    onCheckedChange={() => handleCardColorToggle('enablePriorityColors')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enable-status">Màu theo trạng thái</Label>
                    <p className="text-sm text-muted-foreground">Hiển thị màu theo status</p>
                  </div>
                  <Switch
                    id="enable-status"
                    checked={cardColors.enableStatusColors}
                    onCheckedChange={() => handleCardColorToggle('enableStatusColors')}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" className="h-9" onClick={handleResetCardColors}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Khôi phục mặc định
                </Button>
                <Button className="h-9" onClick={handleSaveCardColors}>
                  <Save className="h-4 w-4 mr-2" />
                  Lưu cài đặt
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 5: TEMPLATES */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">Mẫu công việc</CardTitle>
                  <CardDescription>
                    Tạo và quản lý các mẫu công việc để tạo task nhanh hơn
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleResetTemplates} size="sm" className="h-9">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Khôi phục mặc định
                  </Button>
                  <Button onClick={handleAddTemplate} size="sm" className="h-9">
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm mẫu
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {templates.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Chưa có mẫu nào. Nhấn "Thêm mẫu" để tạo mẫu mới.
                </div>
              ) : (
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
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingTemplate(template);
                                setIsAddingTemplate(false);
                              }}
                            >
                              Sửa
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTemplate(template.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {editingTemplate && (
                <div className="mt-6 p-4 border rounded-lg space-y-4 bg-muted/50">
                  <h3 className="font-semibold">
                    {isAddingTemplate ? 'Thêm mẫu mới' : 'Chỉnh sửa mẫu'}
                  </h3>
                  
                  <div className="grid gap-4 md:grid-cols-2">
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="template-title">Tiêu đề mẫu *</Label>
                    <Input
                      id="template-title"
                      className="h-9"
                      value={editingTemplate.title}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, title: e.target.value })}
                      placeholder="VD: Sửa lỗi: [Tên lỗi]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="template-description">Mô tả mẫu</Label>
                    <Textarea
                      id="template-description"
                      value={editingTemplate.description}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
                      placeholder="Nhập mô tả chi tiết..."
                      rows={8}
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

                  <div className="flex gap-2">
                    <Button className="h-9" onClick={handleSaveTemplate}>
                      <Save className="h-4 w-4 mr-2" />
                      Lưu
                    </Button>
                    <Button variant="outline" className="h-9" onClick={() => {
                      setEditingTemplate(null);
                      setIsAddingTemplate(false);
                    }}>
                      Hủy
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 6: NOTIFICATIONS & REMINDERS */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Cài đặt thông báo & nhắc nhở</CardTitle>
              <CardDescription>
                Quản lý thông báo và nhắc nhở tự động cho công việc
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Notifications */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Thông báo Email
                </h3>
                
                <div className="space-y-3 pl-6">
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
                </div>
              </div>

              {/* Reminders */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Nhắc nhở tự động
                </h3>
                
                <div className="space-y-4 pl-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="reminders-enabled" className="cursor-pointer">
                        Bật tính năng nhắc nhở tự động
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Tự động gửi thông báo khi công việc không có cập nhật
                      </p>
                    </div>
                    <Switch
                      id="reminders-enabled"
                      checked={reminders.enabled}
                      onCheckedChange={(checked) => handleReminderChange('enabled', checked)}
                    />
                  </div>

                  {reminders.enabled && (
                    <div className="space-y-4 pl-4">
                      <div className="flex items-center gap-4">
                        <Label htmlFor="first-reminder" className="text-sm w-40">
                          Nhắc nhở lần 1 (giờ):
                        </Label>
                        <Input
                          id="first-reminder"
                          type="number"
                          className="h-9 w-24"
                          min="1"
                          value={reminders.firstReminderHours}
                          onChange={(e) => handleReminderChange('firstReminderHours', parseInt(e.target.value) || 1)}
                        />
                      </div>

                      <div className="flex items-center gap-4">
                        <Label htmlFor="second-reminder" className="text-sm w-40">
                          Nhắc nhở lần 2 (giờ):
                        </Label>
                        <Input
                          id="second-reminder"
                          type="number"
                          className="h-9 w-24"
                          min="1"
                          value={reminders.secondReminderHours}
                          onChange={(e) => handleReminderChange('secondReminderHours', parseInt(e.target.value) || 1)}
                        />
                      </div>

                      <div className="flex items-center gap-4">
                        <Label htmlFor="escalation" className="text-sm w-40 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3 text-destructive" />
                          Báo động leo thang (giờ):
                        </Label>
                        <Input
                          id="escalation"
                          type="number"
                          className="h-9 w-24"
                          min="1"
                          value={reminders.escalationHours}
                          onChange={(e) => handleReminderChange('escalationHours', parseInt(e.target.value) || 1)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button className="h-9" onClick={() => {
                  handleSaveNotifications();
                  handleSaveReminders();
                }}>
                  <Save className="h-4 w-4 mr-2" />
                  Lưu cài đặt
                </Button>
                <Button variant="outline" className="h-9" onClick={() => {
                  handleResetNotifications();
                  handleResetReminders();
                }}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Khôi phục mặc định
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ResponsiveContainer>
  );
}
