import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { TabsContent } from '../../../components/ui/tabs';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { SettingsFormGrid } from '../../../components/settings/forms/SettingsFormGrid';
import { SettingsFormSection } from '../../../components/settings/forms/SettingsFormSection';
import { Button } from '../../../components/ui/button';
import { Switch } from '../../../components/ui/switch';
import { Textarea } from '../../../components/ui/textarea';
import { TailwindColorPicker } from '../../../components/ui/tailwind-color-picker';
import { cn } from '../../../lib/utils';
import { SettingsActionButton } from '../../../components/settings/SettingsActionButton';
import { SettingsVerticalTabs } from '../../../components/settings/SettingsVerticalTabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import { 
  AlertCircle,
  Bell,
  Clock,
  MoreHorizontal,
  Plus,
  Save,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { ConfirmDialog } from '../../../components/ui/confirm-dialog';
import { toast } from 'sonner';
import { useSettingsPageHeader } from '../use-settings-page-header';
import { createSettingsConfigStore } from '../settings-config-store';
import { useTabActionRegistry } from '../use-tab-action-registry';

// ============================================
// INTERFACES
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

interface SLASettings {
  low: { responseTime: number; resolveTime: number };
  medium: { responseTime: number; resolveTime: number };
  high: { responseTime: number; resolveTime: number };
  urgent: { responseTime: number; resolveTime: number };
}

interface ResponseTemplate {
  id: string;
  name: string;
  content: string;
  category: 'general' | 'product-defect' | 'shipping-delay' | 'wrong-item' | 'customer-service';
  order: number;
}

interface NotificationSettings {
  emailOnCreate: boolean;
  emailOnAssign: boolean;
  emailOnVerified: boolean;
  emailOnResolved: boolean;
  emailOnOverdue: boolean;
  smsOnOverdue: boolean;
  inAppNotifications: boolean;
}

interface PublicTrackingSettings {
  enabled: boolean;
  allowCustomerComments: boolean;
  showEmployeeName: boolean;
  showTimeline: boolean;
}

interface ReminderSettings {
  enabled: boolean;
  firstReminderHours: number;
  secondReminderHours: number;
  escalationHours: number;
}

interface ComplaintType {
  id: string;
  name: string;
  description: string;
  order: number;
  isActive: boolean;
}

// ============================================
// DEFAULT VALUES
// ============================================

const defaultSLA: SLASettings = {
  low: { responseTime: 240, resolveTime: 48 }, // 4h response, 48h resolve
  medium: { responseTime: 120, resolveTime: 24 }, // 2h response, 24h resolve
  high: { responseTime: 60, resolveTime: 12 }, // 1h response, 12h resolve
  urgent: { responseTime: 30, resolveTime: 4 }, // 30m response, 4h resolve
};

const defaultReminders: ReminderSettings = {
  enabled: true,
  firstReminderHours: 4,
  secondReminderHours: 8,
  escalationHours: 24,
};

const defaultNotifications: NotificationSettings = {
  emailOnCreate: true,
  emailOnAssign: true,
  emailOnVerified: false,
  emailOnResolved: true,
  emailOnOverdue: true,
  smsOnOverdue: false,
  inAppNotifications: true,
};

const defaultPublicTracking: PublicTrackingSettings = {
  enabled: false,
  allowCustomerComments: false,
  showEmployeeName: true,
  showTimeline: true,
};

const defaultCardColors: CardColorSettings = {
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

const defaultComplaintTypes: ComplaintType[] = [
  { id: '1', name: 'Sản phẩm lỗi', description: 'Sản phẩm có lỗi kỹ thuật hoặc hỏng hóc', order: 1, isActive: true },
  { id: '2', name: 'Giao hàng chậm', description: 'Đơn hàng giao chậm so với thời gian cam kết', order: 2, isActive: true },
  { id: '3', name: 'Sai sản phẩm', description: 'Giao sai sản phẩm so với đơn hàng', order: 3, isActive: true },
  { id: '4', name: 'Dịch vụ chăm sóc', description: 'Khiếu nại về thái độ hoặc dịch vụ nhân viên', order: 4, isActive: true },
  { id: '5', name: 'Khác', description: 'Các loại khiếu nại khác', order: 5, isActive: true },
];

const SLA_PRIORITY_CONFIGS: Array<{
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


const defaultTemplates: ResponseTemplate[] = [
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
// SETTINGS STORE
// ============================================

type ComplaintsSettingsState = {
  sla: SLASettings;
  templates: ResponseTemplate[];
  notifications: NotificationSettings;
  publicTracking: PublicTrackingSettings;
  reminders: ReminderSettings;
  cardColors: CardColorSettings;
  complaintTypes: ComplaintType[];
};

const clone = <T,>(value: T): T => {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
};

const createDefaultComplaintsSettings = (): ComplaintsSettingsState => ({
  sla: clone(defaultSLA),
  templates: clone(defaultTemplates),
  notifications: clone(defaultNotifications),
  publicTracking: clone(defaultPublicTracking),
  reminders: clone(defaultReminders),
  cardColors: clone(defaultCardColors),
  complaintTypes: clone(defaultComplaintTypes),
});

const useComplaintsSettingsStore = createSettingsConfigStore<ComplaintsSettingsState>({
  storageKey: 'settings-complaints',
  getDefaultState: createDefaultComplaintsSettings,
});

// Validation helper for Tailwind classes
function validateTailwindClasses(value: string): boolean {
  if (!value || !value.trim()) return false;
  
  // Pattern: bg-color-shade or border-color-shade, can have multiple classes
  const tailwindPattern = /^(bg|border|text|shadow|ring)-[\w-]+(\/\d+)?(\s+(bg|border|text|shadow|ring)-[\w-]+(\/\d+)?)*$/;
  return tailwindPattern.test(value.trim());
}

// Export function to load card colors from other components
export function loadCardColorSettings(): CardColorSettings {
  return clone(useComplaintsSettingsStore.getState().data.cardColors);
}

// Export function to load complaint types from other components
export function loadComplaintTypes(): ComplaintType[] {
  return clone(useComplaintsSettingsStore.getState().data.complaintTypes);
}

// Export the ComplaintType interface for use in other components
export type { ComplaintType };

// ============================================
// MAIN COMPONENT
// ============================================

export function ComplaintsSettingsPage() {
  const [activeTab, setActiveTab] = React.useState('sla');
  const { headerActions, registerActions } = useTabActionRegistry(activeTab);
  const registerSlaActions = React.useMemo(() => registerActions('sla'), [registerActions]);
  const registerComplaintTypeActions = React.useMemo(() => registerActions('complaint-types'), [registerActions]);
  const registerCardColorActions = React.useMemo(() => registerActions('card-colors'), [registerActions]);
  const registerTemplateActions = React.useMemo(() => registerActions('templates'), [registerActions]);
  const registerNotificationActions = React.useMemo(() => registerActions('notifications'), [registerActions]);
  const registerPublicTrackingActions = React.useMemo(() => registerActions('public-tracking'), [registerActions]);

  const storedSla = useComplaintsSettingsStore((state) => state.data.sla);
  const storedTemplates = useComplaintsSettingsStore((state) => state.data.templates);
  const storedNotifications = useComplaintsSettingsStore((state) => state.data.notifications);
  const storedPublicTracking = useComplaintsSettingsStore((state) => state.data.publicTracking);
  const storedReminders = useComplaintsSettingsStore((state) => state.data.reminders);
  const storedCardColors = useComplaintsSettingsStore((state) => state.data.cardColors);
  const storedComplaintTypes = useComplaintsSettingsStore((state) => state.data.complaintTypes);
  const setStoreSection = useComplaintsSettingsStore((state) => state.setSection);

  // SLA State
  const [sla, setSLA] = React.useState<SLASettings>(storedSla);

  // Templates State
  const [templates, setTemplates] = React.useState<ResponseTemplate[]>(storedTemplates);
  const [editingTemplate, setEditingTemplate] = React.useState<ResponseTemplate | null>(null);
  const [isAddingTemplate, setIsAddingTemplate] = React.useState(false);

  // Notifications State
  const [notifications, setNotifications] = React.useState<NotificationSettings>(storedNotifications);

  // Public Tracking State
  const [publicTracking, setPublicTracking] = React.useState<PublicTrackingSettings>(storedPublicTracking);

  // Reminders State
  const [reminders, setReminders] = React.useState<ReminderSettings>(storedReminders);

  // Card Colors State
  const [cardColors, setCardColors] = React.useState<CardColorSettings>(storedCardColors);

  // Complaint Types State
  const [complaintTypes, setComplaintTypes] = React.useState<ComplaintType[]>(storedComplaintTypes);
  const [editingType, setEditingType] = React.useState<ComplaintType | null>(null);
  const [isAddingType, setIsAddingType] = React.useState(false);
  const [typeDialogOpen, setTypeDialogOpen] = React.useState(false);
  const [deleteTypeId, setDeleteTypeId] = React.useState<string | null>(null);

  // Template Dialog State
  const [templateDialogOpen, setTemplateDialogOpen] = React.useState(false);
  const [deleteTemplateId, setDeleteTemplateId] = React.useState<string | null>(null);

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
    setPublicTracking(storedPublicTracking);
  }, [storedPublicTracking]);

  React.useEffect(() => {
    setReminders(storedReminders);
  }, [storedReminders]);

  React.useEffect(() => {
    setCardColors(storedCardColors);
  }, [storedCardColors]);

  React.useEffect(() => {
    setComplaintTypes(storedComplaintTypes);
  }, [storedComplaintTypes]);

  useSettingsPageHeader({
    title: 'Cài đặt khiếu nại',
    subtitle: 'Thiết lập SLA, tự động hóa và template phản hồi khiếu nại',
    actions: headerActions,
  });

  // ============================================
  // SLA HANDLERS
  // ============================================

  const handleSLAChange = (priority: keyof SLASettings, field: 'responseTime' | 'resolveTime', value: string) => {
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
    // Validation for each priority level
    const priorities = ['low', 'medium', 'high', 'urgent'] as const;
    const errors: string[] = [];

    priorities.forEach(priority => {
      const settings = sla[priority];
      const priorityLabel = {
        low: 'Thấp',
        medium: 'Trung bình',
        high: 'Cao',
        urgent: 'Khẩn cấp'
      }[priority];

      if (settings.responseTime <= 0) {
        errors.push(`Thời gian phản hồi của mức độ ${priorityLabel} phải lớn hơn 0`);
      }
      
      if (settings.resolveTime <= 0) {
        errors.push(`Thời gian giải quyết của mức độ ${priorityLabel} phải lớn hơn 0`);
      }

      // Convert response time from minutes to hours for comparison
      const responseHours = settings.responseTime / 60;
      if (settings.resolveTime <= responseHours) {
        errors.push(`Thời gian giải quyết của mức độ ${priorityLabel} phải lớn hơn thời gian phản hồi`);
      }
    });

    if (errors.length > 0) {
      toast.error('Lỗi xác thực', {
        description: errors.join('\n'),
      });
      return;
    }

    setStoreSection('sla', sla);
    toast.success('Đã lưu cài đặt SLA', {
      description: 'Thời gian phản hồi và giải quyết đã được cập nhật thành công.',
    });
  };

  const handleResetSLA = () => {
    const nextDefaults = clone(defaultSLA);
    setSLA(nextDefaults);
    setStoreSection('sla', nextDefaults);
    toast.info('Đã khôi phục cài đặt mặc định', {
      description: 'Cài đặt SLA đã được reset về giá trị mặc định của hệ thống.',
    });
  };

  // ============================================
  // TEMPLATE HANDLERS
  // ============================================

  const handleAddTemplate = () => {
    setEditingTemplate({
      id: Date.now().toString(),
      name: '',
      content: '',
      category: 'general',
      order: templates.length + 1,
    });
    setIsAddingTemplate(true);
    setTemplateDialogOpen(true);
  };

  const handleEditTemplate = (template: ResponseTemplate) => {
    setEditingTemplate({ ...template });
    setIsAddingTemplate(false);
    setTemplateDialogOpen(true);
  };

  const handleSaveTemplate = () => {
    if (!editingTemplate) return;

    if (!editingTemplate.name.trim() || !editingTemplate.content.trim()) {
      toast.error('Lỗi xác thực', {
        description: 'Vui lòng điền đầy đủ tên và nội dung mẫu.',
      });
      return;
    }

    let updatedTemplates: ResponseTemplate[];
    
    if (isAddingTemplate) {
      updatedTemplates = [...templates, editingTemplate];
    } else {
      updatedTemplates = templates.map(t => 
        t.id === editingTemplate.id ? editingTemplate : t
      );
    }

    setTemplates(updatedTemplates);
    setStoreSection('templates', updatedTemplates);
    
    toast.success(isAddingTemplate ? 'Đã thêm mẫu' : 'Đã cập nhật mẫu', {
      description: `Mẫu "${editingTemplate.name}" đã được lưu thành công.`,
    });

    setEditingTemplate(null);
    setIsAddingTemplate(false);
    setTemplateDialogOpen(false);
  };

  const handleConfirmDeleteTemplate = () => {
    if (!deleteTemplateId) return;
    const updatedTemplates = templates.filter(t => t.id !== deleteTemplateId);
    setTemplates(updatedTemplates);
    setStoreSection('templates', updatedTemplates);
    
    toast.success('Đã xóa mẫu', {
      description: 'Mẫu phản hồi đã được xóa thành công.',
    });
    setDeleteTemplateId(null);
  };

  const handleResetTemplates = () => {
    const defaults = clone(defaultTemplates);
    setTemplates(defaults);
    setStoreSection('templates', defaults);
    toast.info('Đã khôi phục mẫu mặc định', {
      description: 'Tất cả mẫu phản hồi đã được reset về giá trị mặc định của hệ thống.',
    });
  };

  const handleCancelEdit = () => {
    setEditingTemplate(null);
    setIsAddingTemplate(false);
    setTemplateDialogOpen(false);
  };

  // ============================================
  // NOTIFICATION HANDLERS
  // ============================================

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSaveNotifications = () => {
    setStoreSection('notifications', notifications);
    toast.success('Đã lưu cài đặt thông báo', {
      description: 'Các tùy chọn thông báo đã được cập nhật thành công.',
    });
  };

  const handleResetNotifications = () => {
    const defaults = clone(defaultNotifications);
    setNotifications(defaults);
    setStoreSection('notifications', defaults);
    toast.info('Đã khôi phục cài đặt mặc định', {
      description: 'Cài đặt thông báo đã được reset về giá trị mặc định của hệ thống.',
    });
  };

  // ============================================
  // PUBLIC TRACKING HANDLERS
  // ============================================

  const handlePublicTrackingChange = (key: keyof PublicTrackingSettings) => {
    setPublicTracking(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSavePublicTracking = () => {
    setStoreSection('publicTracking', publicTracking);
    toast.success('Đã lưu cài đặt tracking công khai', {
      description: 'Các tùy chọn liên kết công khai đã được cập nhật thành công.',
    });
  };

  const handleResetPublicTracking = () => {
    const defaults = clone(defaultPublicTracking);
    setPublicTracking(defaults);
    setStoreSection('publicTracking', defaults);
    toast.info('Đã khôi phục cài đặt mặc định', {
      description: 'Cài đặt tracking công khai đã được reset về giá trị mặc định của hệ thống.',
    });
  };

  // ============================================
  // REMINDERS HANDLERS
  // ============================================

  const handleReminderChange = (field: keyof ReminderSettings, value: boolean | number) => {
    setReminders(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveReminders = () => {
    setStoreSection('reminders', reminders);
    toast.success('Đã lưu cài đặt nhắc nhở', {
      description: 'Các tùy chọn nhắc nhở khiếu nại đã được cập nhật thành công.',
    });
  };

  const handleResetReminders = () => {
    const defaults = clone(defaultReminders);
    setReminders(defaults);
    setStoreSection('reminders', defaults);
    toast.info('Đã khôi phục cài đặt mặc định', {
      description: 'Cài đặt nhắc nhở đã được reset về giá trị mặc định của hệ thống.',
    });
  };

  // ============================================
  // CARD COLORS HANDLERS
  // ============================================

  const handleCardColorToggle = (key: 'enableStatusColors' | 'enablePriorityColors' | 'enableOverdueColor') => {
    setCardColors(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleStatusColorChange = (status: keyof CardColorSettings['statusColors'], value: string) => {
    setCardColors(prev => ({
      ...prev,
      statusColors: {
        ...prev.statusColors,
        [status]: value,
      }
    }));
  };

  const handlePriorityColorChange = (priority: keyof CardColorSettings['priorityColors'], value: string) => {
    setCardColors(prev => ({
      ...prev,
      priorityColors: {
        ...prev.priorityColors,
        [priority]: value,
      }
    }));
  };

  const handleOverdueColorChange = (value: string) => {
    setCardColors(prev => ({
      ...prev,
      overdueColor: value,
    }));
  };

  const handleSaveCardColors = () => {
    // Validate all enabled color settings
    const errors: string[] = [];

    if (cardColors.enableOverdueColor) {
      if (!cardColors.overdueColor.trim()) {
        errors.push('Màu quá hạn không được để trống');
      } else if (!validateTailwindClasses(cardColors.overdueColor)) {
        errors.push('Màu quá hạn không đúng định dạng Tailwind (ví dụ: bg-red-50 border-red-400)');
      }
    }

    if (cardColors.enablePriorityColors) {
      const priorities = [
        { key: 'low', label: 'Thấp' },
        { key: 'medium', label: 'Trung bình' },
        { key: 'high', label: 'Cao' },
        { key: 'urgent', label: 'Khẩn cấp' },
      ];
      
      priorities.forEach(({ key, label }) => {
        const value = cardColors.priorityColors[key as keyof typeof cardColors.priorityColors];
        if (!value.trim()) {
          errors.push(`Màu mức độ ${label} không được để trống`);
        } else if (!validateTailwindClasses(value)) {
          errors.push(`Màu mức độ ${label} không đúng định dạng Tailwind`);
        }
      });
    }

    if (cardColors.enableStatusColors) {
      const statuses = [
        { key: 'pending', label: 'Chờ xử lý' },
        { key: 'investigating', label: 'Đang xử lý' },
        { key: 'resolved', label: 'Đã giải quyết' },
        { key: 'rejected', label: 'Từ chối' },
      ];
      
      statuses.forEach(({ key, label }) => {
        const value = cardColors.statusColors[key as keyof typeof cardColors.statusColors];
        if (!value.trim()) {
          errors.push(`Màu trạng thái ${label} không được để trống`);
        } else if (!validateTailwindClasses(value)) {
          errors.push(`Màu trạng thái ${label} không đúng định dạng Tailwind`);
        }
      });
    }

    if (errors.length > 0) {
      toast.error('Lỗi xác thực', {
        description: errors.join('\n'),
      });
      return;
    }

    setStoreSection('cardColors', cardColors);
    toast.success('Đã lưu cài đặt màu card', {
      description: 'Màu sắc hiển thị card đã được cập nhật thành công.',
    });
  };

  const handleResetCardColors = () => {
    const defaults = clone(defaultCardColors);
    setCardColors(defaults);
    setStoreSection('cardColors', defaults);
    toast.info('Đã khôi phục cài đặt mặc định', {
      description: 'Màu card đã được reset về giá trị mặc định của hệ thống.',
    });
  };

  // ============================================
  // COMPLAINT TYPES HANDLERS
  // ============================================

  const handleAddType = () => {
    const newType: ComplaintType = {
      id: Date.now().toString(),
      name: '',
      description: '',
      order: complaintTypes.length + 1,
      isActive: true,
    };
    setEditingType(newType);
    setIsAddingType(true);
    setTypeDialogOpen(true);
  };

  const handleEditType = (type: ComplaintType) => {
    setEditingType({ ...type });
    setIsAddingType(false);
    setTypeDialogOpen(true);
  };

  const handleSaveType = () => {
    if (!editingType) return;

    if (!editingType.name.trim()) {
      toast.error('Tên loại khiếu nại không được để trống');
      return;
    }

    const nextTypes = isAddingType
      ? [...complaintTypes, editingType]
      : complaintTypes.map(t => (t.id === editingType.id ? editingType : t));

    setComplaintTypes(nextTypes);
    setStoreSection('complaintTypes', nextTypes);
    toast.success(isAddingType ? 'Đã thêm loại khiếu nại mới' : 'Đã cập nhật loại khiếu nại');

    setEditingType(null);
    setIsAddingType(false);
    setTypeDialogOpen(false);
  };

  const handleConfirmDeleteType = () => {
    if (!deleteTypeId) return;
    const updated = complaintTypes.filter(t => t.id !== deleteTypeId);
    setComplaintTypes(updated);
    setStoreSection('complaintTypes', updated);
    toast.success('Đã xóa loại khiếu nại');
    setDeleteTypeId(null);
  };

  const handleToggleTypeActive = (id: string) => {
    const updated = complaintTypes.map(t =>
      t.id === id ? { ...t, isActive: !t.isActive } : t
    );
    setComplaintTypes(updated);
    setStoreSection('complaintTypes', updated);
    toast.success('Đã cập nhật trạng thái');
  };

  const handleResetTypes = () => {
    const defaults = clone(defaultComplaintTypes);
    setComplaintTypes(defaults);
    setStoreSection('complaintTypes', defaults);
    toast.info('Đã khôi phục cài đặt mặc định');
  };

  // ============================================
  // RENDER
  // ============================================

    React.useEffect(() => {
      if (activeTab !== 'sla') {
        return;
      }

      registerSlaActions([
        <SettingsActionButton key="save" onClick={handleSaveSLA}>
          <Save className="h-4 w-4" /> Lưu cài đặt
        </SettingsActionButton>,
      ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, registerSlaActions]);

    React.useEffect(() => {
      if (activeTab !== 'complaint-types') {
        return;
      }

      registerComplaintTypeActions([
        <SettingsActionButton key="add" onClick={handleAddType}>
          <Plus className="h-4 w-4" /> Thêm loại mới
        </SettingsActionButton>,
      ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, registerComplaintTypeActions]);

    React.useEffect(() => {
      if (activeTab !== 'card-colors') {
        return;
      }

      registerCardColorActions([
        <SettingsActionButton key="save" onClick={handleSaveCardColors}>
          <Save className="h-4 w-4" /> Lưu cài đặt
        </SettingsActionButton>,
      ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, registerCardColorActions]);

    React.useEffect(() => {
      if (activeTab !== 'templates') {
        return;
      }

      registerTemplateActions([
        <SettingsActionButton key="add" onClick={handleAddTemplate}>
          <Plus className="h-4 w-4" /> Thêm mẫu
        </SettingsActionButton>,
      ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, registerTemplateActions]);

    React.useEffect(() => {
      if (activeTab !== 'notifications') {
        return;
      }

      registerNotificationActions([
        <SettingsActionButton key="save" onClick={() => {
          handleSaveNotifications();
          handleSaveReminders();
        }}>
          <Save className="h-4 w-4" /> Lưu cài đặt
        </SettingsActionButton>,
      ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, registerNotificationActions]);

    React.useEffect(() => {
      if (activeTab !== 'public-tracking') {
        return;
      }

      registerPublicTrackingActions([
        <SettingsActionButton key="save" onClick={handleSavePublicTracking}>
          <Save className="h-4 w-4" /> Lưu cài đặt
        </SettingsActionButton>,
      ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, registerPublicTrackingActions]);

  const tabs = React.useMemo(
    () => [
      { value: 'sla', label: 'SLA' },
      { value: 'complaint-types', label: 'Loại KN' },
      { value: 'card-colors', label: 'Màu card' },
      { value: 'templates', label: 'Mẫu phản hồi' },
      { value: 'notifications', label: 'Thông báo' },
      { value: 'public-tracking', label: 'Tracking' },
    ],
    [],
  );

  return (
      <div className="space-y-6">
        <SettingsVerticalTabs value={activeTab} onValueChange={setActiveTab} tabs={tabs}>

        {/* ============================================ */}
        {/* TAB 1: SLA SETTINGS */}
        {/* ============================================ */}
        <TabsContent value="sla" className="mt-0 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt SLA (Service Level Agreement)</CardTitle>
              <CardDescription>
                Thiết lập thời gian phản hồi và giải quyết khiếu nại theo mức độ ưu tiên
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {SLA_PRIORITY_CONFIGS.map(({ key, label, description, indicatorClass }) => (
                <SettingsFormSection
                  key={key}
                  title={label}
                  description={description}
                  badge={(
                    <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
                      <span className={cn('h-2 w-2 rounded-full', indicatorClass)} />
                      SLA
                    </span>
                  )}
                >
                  <SettingsFormGrid>
                    <div className="space-y-2">
                      <Label htmlFor={`${key}-response`}>Thời gian phản hồi tối đa (phút)</Label>
                      <Input
                        id={`${key}-response`}
                        type="number"
                        min="0"
                        value={sla[key].responseTime}
                        onChange={(e) => handleSLAChange(key, 'responseTime', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${key}-resolve`}>Thời gian giải quyết tối đa (giờ)</Label>
                      <Input
                        id={`${key}-resolve`}
                        type="number"
                        min="0"
                        value={sla[key].resolveTime}
                        onChange={(e) => handleSLAChange(key, 'resolveTime', e.target.value)}
                      />
                    </div>
                  </SettingsFormGrid>
                </SettingsFormSection>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================ */}
        {/* TAB 2: COMPLAINT TYPES */}
        {/* ============================================ */}
        <TabsContent value="complaint-types" className="mt-0 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Loại khiếu nại</CardTitle>
              <CardDescription>
                Quản lý các loại khiếu nại có thể sử dụng khi tạo khiếu nại mới
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* Types Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">STT</TableHead>
                      <TableHead>Tên loại</TableHead>
                      <TableHead>Mô tả</TableHead>
                      <TableHead className="w-[100px]">Trạng thái</TableHead>
                      <TableHead className="w-[80px] text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {complaintTypes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          Chưa có loại khiếu nại nào
                        </TableCell>
                      </TableRow>
                    ) : (
                      complaintTypes.map((type, index) => (
                        <TableRow key={type.id}>
                          <TableCell>{index + 1}</TableCell>
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
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditType(type)}>
                                  Sửa
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => setDeleteTypeId(type.id)}
                                  className="text-destructive focus:text-destructive"
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
            </CardContent>
          </Card>

          {/* Edit/Add Type Dialog */}
          <Dialog open={typeDialogOpen} onOpenChange={(open) => {
            setTypeDialogOpen(open);
            if (!open) {
              setEditingType(null);
              setIsAddingType(false);
            }
          }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {isAddingType ? 'Thêm loại khiếu nại mới' : 'Chỉnh sửa loại khiếu nại'}
                </DialogTitle>
                <DialogDescription>
                  {isAddingType 
                    ? 'Điền thông tin để tạo loại khiếu nại mới' 
                    : 'Cập nhật thông tin loại khiếu nại'}
                </DialogDescription>
              </DialogHeader>
              
              {editingType && (
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="type-name">Tên loại khiếu nại *</Label>
                    <Input
                      id="type-name"
                      value={editingType.name}
                      onChange={(e) => setEditingType({ ...editingType, name: e.target.value })}
                      placeholder="VD: Sản phẩm lỗi"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type-description">Mô tả</Label>
                    <Textarea
                      id="type-description"
                      value={editingType.description}
                      onChange={(e) => setEditingType({ ...editingType, description: e.target.value })}
                      placeholder="VD: Sản phẩm có lỗi kỹ thuật hoặc hỏng hóc"
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
                <Button variant="outline" onClick={() => {
                  setTypeDialogOpen(false);
                  setEditingType(null);
                  setIsAddingType(false);
                }}>
                  Hủy
                </Button>
                <Button onClick={handleSaveType}>
                  <Save className="h-4 w-4 mr-2" />
                  {isAddingType ? 'Thêm loại' : 'Lưu thay đổi'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Type Confirm Dialog */}
          <ConfirmDialog
            open={!!deleteTypeId}
            onOpenChange={(open) => !open && setDeleteTypeId(null)}
            title="Xóa loại khiếu nại"
            description="Bạn có chắc chắn muốn xóa loại khiếu nại này? Hành động này không thể hoàn tác."
            confirmText="Xóa"
            cancelText="Hủy"
            variant="destructive"
            onConfirm={handleConfirmDeleteType}
          />
        </TabsContent>

        {/* ============================================ */}
        {/* TAB 3: CARD COLORS */}
        {/* ============================================ */}
        <TabsContent value="card-colors" className="mt-0 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Màu sắc card khiếu nại</CardTitle>
              <CardDescription>
                Tùy chỉnh màu hiển thị card theo trạng thái, độ ưu tiên và quá hạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SettingsFormSection
                title="Hướng dẫn nhập màu Tailwind"
                description="Áp dụng đồng nhất giữa màu nền (bg-*) và viền (border-*) để card trông hài hòa."
                className="bg-blue-50/80 border-blue-200"
                contentClassName="space-y-3"
              >
                <p className="text-sm text-blue-900 font-medium">💡 Gợi ý:</p>
                <ul className="list-inside list-disc text-sm text-blue-800 space-y-1">
                  <li>Sử dụng định dạng <code className="bg-blue-100 px-1 rounded">bg-[màu]-[độ đậm]</code> và <code className="bg-blue-100 px-1 rounded">border-[màu]-[độ đậm]</code>.</li>
                  <li>Ví dụ: <code className="bg-blue-100 px-1 rounded">bg-red-50 border-red-400</code></li>
                  <li>Dãy màu hợp lệ: red, blue, green, yellow, amber, slate, gray,...</li>
                  <li>Độ đậm phổ biến: 50 → 900</li>
                </ul>
              </SettingsFormSection>

              <SettingsFormSection
                title="Bật/Tắt hiển thị màu"
                description="Tùy chọn ưu tiên hiển thị: quá hạn → độ ưu tiên → trạng thái."
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enable-overdue">Màu quá hạn</Label>
                      <p className="text-sm text-muted-foreground">Nhấn mạnh các khiếu nại vượt SLA.</p>
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
                      <p className="text-sm text-muted-foreground">Thể hiện mức độ ảnh hưởng của khiếu nại.</p>
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
                      <p className="text-sm text-muted-foreground">Phân loại theo tiến trình xử lý.</p>
                    </div>
                    <Switch
                      id="enable-status"
                      checked={cardColors.enableStatusColors}
                      onCheckedChange={() => handleCardColorToggle('enableStatusColors')}
                    />
                  </div>
                </div>
              </SettingsFormSection>

              {cardColors.enableOverdueColor && (
                <SettingsFormSection
                  title="Màu quá hạn SLA"
                  description="Áp dụng cho các khiếu nại vượt SLA, hiển thị trước các màu khác."
                  className="border border-destructive/30"
                >
                  <TailwindColorPicker
                    value={cardColors.overdueColor}
                    onChange={handleOverdueColorChange}
                    label="Màu nền và viền"
                    placeholder="Ví dụ: bg-red-50 border-red-400"
                  />
                </SettingsFormSection>
              )}

              {cardColors.enablePriorityColors && (
                <SettingsFormSection
                  title="Màu theo độ ưu tiên"
                  description="Sử dụng dải màu ấm từ thấp → khẩn cấp để dễ phân biệt."
                >
                  <div className="space-y-4">
                    <TailwindColorPicker
                      value={cardColors.priorityColors.low}
                      onChange={(value) => handlePriorityColorChange('low', value)}
                      label="Ưu tiên thấp"
                      placeholder="Ví dụ: bg-slate-50 border-slate-200"
                    />

                    <TailwindColorPicker
                      value={cardColors.priorityColors.medium}
                      onChange={(value) => handlePriorityColorChange('medium', value)}
                      label="Ưu tiên trung bình"
                      placeholder="Ví dụ: bg-amber-50 border-amber-200"
                    />

                    <TailwindColorPicker
                      value={cardColors.priorityColors.high}
                      onChange={(value) => handlePriorityColorChange('high', value)}
                      label="Ưu tiên cao"
                      placeholder="Ví dụ: bg-orange-50 border-orange-300"
                    />

                    <TailwindColorPicker
                      value={cardColors.priorityColors.urgent}
                      onChange={(value) => handlePriorityColorChange('urgent', value)}
                      label="Khẩn cấp"
                      placeholder="Ví dụ: bg-red-100 border-red-300"
                    />
                  </div>
                </SettingsFormSection>
              )}

              {cardColors.enableStatusColors && (
                <SettingsFormSection
                  title="Màu theo trạng thái"
                  description="Dùng tông màu lạnh để thể hiện tiến trình xử lý."
                >
                  <div className="space-y-4">
                    <TailwindColorPicker
                      value={cardColors.statusColors.pending}
                      onChange={(value) => handleStatusColorChange('pending', value)}
                      label="Chờ xử lý"
                      placeholder="Ví dụ: bg-yellow-50 border-yellow-200"
                    />

                    <TailwindColorPicker
                      value={cardColors.statusColors.investigating}
                      onChange={(value) => handleStatusColorChange('investigating', value)}
                      label="Đang kiểm tra"
                      placeholder="Ví dụ: bg-blue-50 border-blue-200"
                    />

                    <TailwindColorPicker
                      value={cardColors.statusColors.resolved}
                      onChange={(value) => handleStatusColorChange('resolved', value)}
                      label="Đã giải quyết"
                      placeholder="Ví dụ: bg-green-50 border-green-200"
                    />

                    <TailwindColorPicker
                      value={cardColors.statusColors.rejected}
                      onChange={(value) => handleStatusColorChange('rejected', value)}
                      label="Từ chối"
                      placeholder="Ví dụ: bg-gray-50 border-gray-200"
                    />
                  </div>
                </SettingsFormSection>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================ */}
        {/* TAB 3: RESPONSE TEMPLATES */}
        {/* ============================================ */}
        <TabsContent value="templates" className="mt-0 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mẫu phản hồi</CardTitle>
              <CardDescription>
                Tạo và quản lý các mẫu phản hồi nhanh cho khiếu nại
              </CardDescription>
            </CardHeader>
            <CardContent>
              {templates.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Chưa có mẫu phản hồi nào. Nhấn "Thêm mẫu" để tạo mẫu mới.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên mẫu</TableHead>
                      <TableHead>Danh mục</TableHead>
                      <TableHead className="w-[80px] text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {templates.map(template => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">{template.name}</TableCell>
                        <TableCell>
                          <span className="text-xs px-2 py-1 rounded-md bg-muted">
                            {template.category === 'general' && 'Chung'}
                            {template.category === 'product-defect' && 'Lỗi sản phẩm'}
                            {template.category === 'shipping-delay' && 'Giao hàng chậm'}
                            {template.category === 'wrong-item' && 'Sai hàng'}
                            {template.category === 'customer-service' && 'Dịch vụ KH'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditTemplate(template)}>
                                Sửa
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => setDeleteTemplateId(template.id)}
                                className="text-destructive focus:text-destructive"
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
              )}
            </CardContent>
          </Card>

          {/* Edit/Add Template Dialog */}
          <Dialog open={templateDialogOpen} onOpenChange={(open) => {
            setTemplateDialogOpen(open);
            if (!open) {
              setEditingTemplate(null);
              setIsAddingTemplate(false);
            }
          }}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {isAddingTemplate ? 'Thêm mẫu phản hồi mới' : 'Chỉnh sửa mẫu phản hồi'}
                </DialogTitle>
                <DialogDescription>
                  {isAddingTemplate 
                    ? 'Điền thông tin để tạo mẫu phản hồi mới' 
                    : 'Cập nhật thông tin mẫu phản hồi'}
                </DialogDescription>
              </DialogHeader>
              
              {editingTemplate && (
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Tên mẫu *</Label>
                    <Input
                      id="template-name"
                      value={editingTemplate.name}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                      placeholder="VD: Xin lỗi - Lỗi sản phẩm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="template-category">Danh mục</Label>
                    <Select
                      value={editingTemplate.category}
                      onValueChange={(value) => setEditingTemplate({ 
                        ...editingTemplate, 
                        category: value as ResponseTemplate['category']
                      })}
                    >
                      <SelectTrigger id="template-category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">Chung</SelectItem>
                        <SelectItem value="product-defect">Lỗi sản phẩm</SelectItem>
                        <SelectItem value="shipping-delay">Giao hàng chậm</SelectItem>
                        <SelectItem value="wrong-item">Sai hàng</SelectItem>
                        <SelectItem value="customer-service">Dịch vụ khách hàng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="template-content">Nội dung mẫu *</Label>
                    <Textarea
                      id="template-content"
                      value={editingTemplate.content}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, content: e.target.value })}
                      placeholder="Nhập nội dung phản hồi..."
                      rows={8}
                    />
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={handleCancelEdit}>
                  Hủy
                </Button>
                <Button onClick={handleSaveTemplate}>
                  <Save className="h-4 w-4 mr-2" />
                  {isAddingTemplate ? 'Thêm mẫu' : 'Lưu thay đổi'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Template Confirm Dialog */}
          <ConfirmDialog
            open={!!deleteTemplateId}
            onOpenChange={(open) => !open && setDeleteTemplateId(null)}
            title="Xóa mẫu phản hồi"
            description="Bạn có chắc chắn muốn xóa mẫu phản hồi này? Hành động này không thể hoàn tác."
            confirmText="Xóa"
            cancelText="Hủy"
            variant="destructive"
            onConfirm={handleConfirmDeleteTemplate}
          />
        </TabsContent>

        {/* ============================================ */}
        {/* TAB 3: NOTIFICATIONS */}
        {/* ============================================ */}
        <TabsContent value="notifications" className="mt-0 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt thông báo</CardTitle>
              <CardDescription>
                Quản lý thông báo qua email, SMS và in-app cho các sự kiện khiếu nại
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SettingsFormSection
                title="Thông báo Email"
                description="Gửi mail tới nhân viên phụ trách và người tạo khiếu nại."
                badge={<Bell className="h-4 w-4 text-muted-foreground" />}
                contentClassName="space-y-3"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-create" className="cursor-pointer">
                      Khi khiếu nại mới được tạo
                    </Label>
                    <Switch
                      id="email-create"
                      checked={notifications.emailOnCreate}
                      onCheckedChange={() => handleNotificationChange('emailOnCreate')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-assign" className="cursor-pointer">
                      Khi được phân công xử lý
                    </Label>
                    <Switch
                      id="email-assign"
                      checked={notifications.emailOnAssign}
                      onCheckedChange={() => handleNotificationChange('emailOnAssign')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-verified" className="cursor-pointer">
                      Khi khiếu nại được xác minh
                    </Label>
                    <Switch
                      id="email-verified"
                      checked={notifications.emailOnVerified}
                      onCheckedChange={() => handleNotificationChange('emailOnVerified')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-resolved" className="cursor-pointer">
                      Khi khiếu nại được giải quyết
                    </Label>
                    <Switch
                      id="email-resolved"
                      checked={notifications.emailOnResolved}
                      onCheckedChange={() => handleNotificationChange('emailOnResolved')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-overdue" className="cursor-pointer">
                      Khi khiếu nại quá hạn SLA
                    </Label>
                    <Switch
                      id="email-overdue"
                      checked={notifications.emailOnOverdue}
                      onCheckedChange={() => handleNotificationChange('emailOnOverdue')}
                    />
                  </div>
                </div>
              </SettingsFormSection>

              <SettingsFormSection
                title="Thông báo SMS"
                description="Dùng cho các cảnh báo quan trọng, tránh gửi quá nhiều."
                badge={<AlertCircle className="h-4 w-4 text-muted-foreground" />}
              >
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-overdue" className="cursor-pointer">
                    Cảnh báo quá hạn SLA
                  </Label>
                  <Switch
                    id="sms-overdue"
                    checked={notifications.smsOnOverdue}
                    onCheckedChange={() => handleNotificationChange('smsOnOverdue')}
                  />
                </div>
              </SettingsFormSection>

              <SettingsFormSection
                title="Thông báo trong ứng dụng"
                description="Hiển thị tại biểu tượng chuông của HRM giúp đội xử lý không bỏ sót."
                badge={<Bell className="h-4 w-4 text-muted-foreground" />}
              >
                <div className="flex items-center justify-between">
                  <Label htmlFor="inapp" className="cursor-pointer">
                    Bật thông báo in-app (bell icon)
                  </Label>
                  <Switch
                    id="inapp"
                    checked={notifications.inAppNotifications}
                    onCheckedChange={() => handleNotificationChange('inAppNotifications')}
                  />
                </div>
              </SettingsFormSection>

              <SettingsFormSection
                title="Nhắc nhở tự động"
                description="Gửi cảnh báo nếu ticket không được cập nhật trong thời gian quy định."
                badge={<Clock className="h-4 w-4 text-muted-foreground" />}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="reminders-enabled" className="cursor-pointer">
                        Bật tính năng nhắc nhở tự động
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Tự động gửi thông báo khi khiếu nại bị bỏ quên
                      </p>
                    </div>
                    <Switch
                      id="reminders-enabled"
                      checked={reminders.enabled}
                      onCheckedChange={(checked) => handleReminderChange('enabled', checked)}
                    />
                  </div>

                  {reminders.enabled && (
                    <div className="space-y-4">
                      <SettingsFormGrid columns={3} className="items-start">
                        <div className="space-y-2">
                          <Label htmlFor="first-reminder">Nhắc nhở lần 1 (giờ)</Label>
                          <Input
                            id="first-reminder"
                            type="number"
                            min="1"
                            value={reminders.firstReminderHours}
                            onChange={(e) => handleReminderChange('firstReminderHours', parseInt(e.target.value) || 1)}
                          />
                          <p className="text-xs text-muted-foreground">Mặc định: 4 giờ</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="second-reminder">Nhắc nhở lần 2 (giờ)</Label>
                          <Input
                            id="second-reminder"
                            type="number"
                            min="1"
                            value={reminders.secondReminderHours}
                            onChange={(e) => handleReminderChange('secondReminderHours', parseInt(e.target.value) || 1)}
                          />
                          <p className="text-xs text-muted-foreground">Mặc định: 8 giờ</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="escalation" className="flex items-center gap-1">
                            <AlertCircle className="h-3 w-3 text-destructive" />
                            Báo động leo thang (giờ)
                          </Label>
                          <Input
                            id="escalation"
                            type="number"
                            min="1"
                            value={reminders.escalationHours}
                            onChange={(e) => handleReminderChange('escalationHours', parseInt(e.target.value) || 1)}
                          />
                          <p className="text-xs text-muted-foreground">Mặc định: 24 giờ</p>
                        </div>
                      </SettingsFormGrid>

                      <div className="text-xs text-muted-foreground space-y-1 bg-muted/50 p-3 rounded">
                        <p>• Áp dụng cho trạng thái Pending/Investigating.</p>
                        <p>• Thời gian tính từ hành động gần nhất.</p>
                        <p>• Gửi cho người phụ trách và người tạo ticket.</p>
                      </div>
                    </div>
                  )}
                </div>
              </SettingsFormSection>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================ */}
        {/* TAB 4: PUBLIC TRACKING */}
        {/* ============================================ */}
        <TabsContent value="public-tracking" className="mt-0 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Liên kết theo dõi công khai</CardTitle>
              <CardDescription>
                Cho phép khách hàng theo dõi tiến độ xử lý khiếu nại qua link công khai
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SettingsFormSection
                title="Cấu hình truy cập công khai"
                description="Kiểm soát thông tin nào được chia sẻ cho khách hàng qua đường link."
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="tracking-enabled" className="cursor-pointer">
                        Bật tính năng tracking công khai
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Tạo link để khách hàng tự tra cứu tiến độ
                      </p>
                    </div>
                    <Switch
                      id="tracking-enabled"
                      checked={publicTracking.enabled}
                      onCheckedChange={() => handlePublicTrackingChange('enabled')}
                    />
                  </div>

                  {publicTracking.enabled && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label htmlFor="allow-comments" className="cursor-pointer">
                            Cho phép khách hàng comment
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Thu thập thêm dữ liệu và bằng chứng trực tiếp từ khách hàng
                          </p>
                        </div>
                        <Switch
                          id="allow-comments"
                          checked={publicTracking.allowCustomerComments}
                          onCheckedChange={() => handlePublicTrackingChange('allowCustomerComments')}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label htmlFor="show-employee" className="cursor-pointer">
                            Hiển thị tên nhân viên xử lý
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Tăng tính minh bạch với khách hàng
                          </p>
                        </div>
                        <Switch
                          id="show-employee"
                          checked={publicTracking.showEmployeeName}
                          onCheckedChange={() => handlePublicTrackingChange('showEmployeeName')}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label htmlFor="show-timeline" className="cursor-pointer">
                            Hiển thị timeline xử lý
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Cho phép khách hàng xem toàn bộ lịch sử hành động
                          </p>
                        </div>
                        <Switch
                          id="show-timeline"
                          checked={publicTracking.showTimeline}
                          onCheckedChange={() => handlePublicTrackingChange('showTimeline')}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </SettingsFormSection>

              {/* Example */}
              {publicTracking.enabled && (
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <p className="text-sm font-medium">Ví dụ link tracking:</p>
                  <code className="text-xs bg-background px-2 py-1 rounded block">
                    https://yoursite.com/complaint-tracking/abc123xyz
                  </code>
                  <p className="text-xs text-muted-foreground">
                    Link này sẽ được tạo tự động khi tạo khiếu nại mới
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        </SettingsVerticalTabs>
      </div>
  );
}
