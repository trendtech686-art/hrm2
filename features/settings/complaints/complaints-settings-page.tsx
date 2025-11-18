import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs.tsx';
import { Label } from '../../../components/ui/label.tsx';
import { Input } from '../../../components/ui/input.tsx';
import { Button } from '../../../components/ui/button.tsx';
import { Switch } from '../../../components/ui/switch.tsx';
import { Textarea } from '../../../components/ui/textarea.tsx';
import { TailwindColorPicker } from '../../../components/ui/tailwind-color-picker.tsx';
import { cn } from '../../../lib/utils.ts';
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
  Link as LinkIcon,
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
// STORAGE HELPERS
// ============================================

const STORAGE_KEYS = {
  SLA: 'complaints-sla-settings',
  TEMPLATES: 'complaints-templates',
  NOTIFICATIONS: 'complaints-notification-settings',
  PUBLIC_TRACKING: 'complaints-public-tracking-settings',
  REMINDERS: 'complaints-reminder-settings',
  CARD_COLORS: 'complaints-card-colors',
  COMPLAINT_TYPES: 'complaints-types',
};

// Validation helper for Tailwind classes
function validateTailwindClasses(value: string): boolean {
  if (!value || !value.trim()) return false;
  
  // Pattern: bg-color-shade or border-color-shade, can have multiple classes
  const tailwindPattern = /^(bg|border|text|shadow|ring)-[\w-]+(\/\d+)?(\s+(bg|border|text|shadow|ring)-[\w-]+(\/\d+)?)*$/;
  return tailwindPattern.test(value.trim());
}

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

// Export function to load card colors from other components
export function loadCardColorSettings(): CardColorSettings {
  return loadSettings(STORAGE_KEYS.CARD_COLORS, defaultCardColors);
}

// ============================================
// MAIN COMPONENT
// ============================================

export function ComplaintsSettingsPage() {
  const isMobile = !useMediaQuery("(min-width: 768px)");

  // SLA State
  const [sla, setSLA] = React.useState<SLASettings>(() => 
    loadSettings(STORAGE_KEYS.SLA, defaultSLA)
  );

  // Templates State
  const [templates, setTemplates] = React.useState<ResponseTemplate[]>(() => 
    loadSettings(STORAGE_KEYS.TEMPLATES, defaultTemplates)
  );
  const [editingTemplate, setEditingTemplate] = React.useState<ResponseTemplate | null>(null);
  const [isAddingTemplate, setIsAddingTemplate] = React.useState(false);

  // Notifications State
  const [notifications, setNotifications] = React.useState<NotificationSettings>(() => 
    loadSettings(STORAGE_KEYS.NOTIFICATIONS, defaultNotifications)
  );

  // Public Tracking State
  const [publicTracking, setPublicTracking] = React.useState<PublicTrackingSettings>(() => 
    loadSettings(STORAGE_KEYS.PUBLIC_TRACKING, defaultPublicTracking)
  );

  // Reminders State
  const [reminders, setReminders] = React.useState<ReminderSettings>(() => 
    loadSettings(STORAGE_KEYS.REMINDERS, defaultReminders)
  );

  // Card Colors State
  const [cardColors, setCardColors] = React.useState<CardColorSettings>(() => 
    loadSettings(STORAGE_KEYS.CARD_COLORS, defaultCardColors)
  );

  // Complaint Types State
  const [complaintTypes, setComplaintTypes] = React.useState<ComplaintType[]>(() => 
    loadSettings(STORAGE_KEYS.COMPLAINT_TYPES, defaultComplaintTypes)
  );
  const [editingType, setEditingType] = React.useState<ComplaintType | null>(null);
  const [isAddingType, setIsAddingType] = React.useState(false);

  usePageHeader({
    title: 'Cài đặt khiếu nại',
    breadcrumb: [
      { label: 'Trang chủ', href: '/' },
      { label: 'Cài đặt', href: '/settings' },
      { label: 'Khiếu nại', href: '/settings/complaints', isCurrent: true }
    ],
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

    saveSettings(STORAGE_KEYS.SLA, sla);
    toast.success('✅ Đã lưu cài đặt SLA', {
      description: 'Thời gian phản hồi và giải quyết đã được cập nhật thành công.',
    });
  };

  const handleResetSLA = () => {
    setSLA(defaultSLA);
    toast.info('ℹ️ Đã khôi phục cài đặt mặc định', {
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
    saveSettings(STORAGE_KEYS.TEMPLATES, updatedTemplates);
    
    toast.success(isAddingTemplate ? '✅ Đã thêm mẫu' : '✅ Đã cập nhật mẫu', {
      description: `Mẫu "${editingTemplate.name}" đã được lưu thành công.`,
    });

    setEditingTemplate(null);
    setIsAddingTemplate(false);
  };

  const handleDeleteTemplate = (id: string) => {
    const updatedTemplates = templates.filter(t => t.id !== id);
    setTemplates(updatedTemplates);
    saveSettings(STORAGE_KEYS.TEMPLATES, updatedTemplates);
    
    toast.success('✅ Đã xóa mẫu', {
      description: 'Mẫu phản hồi đã được xóa thành công.',
    });
  };

  const handleResetTemplates = () => {
    setTemplates(defaultTemplates);
    saveSettings(STORAGE_KEYS.TEMPLATES, defaultTemplates);
    toast.info('ℹ️ Đã khôi phục mẫu mặc định', {
      description: 'Tất cả mẫu phản hồi đã được reset về giá trị mặc định của hệ thống.',
    });
  };

  const handleCancelEdit = () => {
    setEditingTemplate(null);
    setIsAddingTemplate(false);
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
    saveSettings(STORAGE_KEYS.NOTIFICATIONS, notifications);
    toast.success('✅ Đã lưu cài đặt thông báo', {
      description: 'Các tùy chọn thông báo đã được cập nhật thành công.',
    });
  };

  const handleResetNotifications = () => {
    setNotifications(defaultNotifications);
    toast.info('ℹ️ Đã khôi phục cài đặt mặc định', {
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
    saveSettings(STORAGE_KEYS.PUBLIC_TRACKING, publicTracking);
    toast.success('✅ Đã lưu cài đặt tracking công khai', {
      description: 'Các tùy chọn liên kết công khai đã được cập nhật thành công.',
    });
  };

  const handleResetPublicTracking = () => {
    setPublicTracking(defaultPublicTracking);
    toast.info('ℹ️ Đã khôi phục cài đặt mặc định', {
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
    saveSettings(STORAGE_KEYS.REMINDERS, reminders);
    toast.success('✅ Đã lưu cài đặt nhắc nhở', {
      description: 'Các tùy chọn nhắc nhở khiếu nại đã được cập nhật thành công.',
    });
  };

  const handleResetReminders = () => {
    setReminders(defaultReminders);
    toast.info('ℹ️ Đã khôi phục cài đặt mặc định', {
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

    saveSettings(STORAGE_KEYS.CARD_COLORS, cardColors);
    toast.success('✅ Đã lưu cài đặt màu card', {
      description: 'Màu sắc hiển thị card đã được cập nhật thành công.',
    });
  };

  const handleResetCardColors = () => {
    setCardColors(defaultCardColors);
    toast.info('ℹ️ Đã khôi phục cài đặt mặc định', {
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
  };

  const handleEditType = (type: ComplaintType) => {
    setEditingType({ ...type });
    setIsAddingType(false);
  };

  const handleSaveType = () => {
    if (!editingType) return;

    if (!editingType.name.trim()) {
      toast.error('Tên loại khiếu nại không được để trống');
      return;
    }

    if (isAddingType) {
      setComplaintTypes([...complaintTypes, editingType]);
      toast.success('✅ Đã thêm loại khiếu nại mới');
    } else {
      setComplaintTypes(complaintTypes.map(t => t.id === editingType.id ? editingType : t));
      toast.success('✅ Đã cập nhật loại khiếu nại');
    }

    saveSettings(STORAGE_KEYS.COMPLAINT_TYPES, isAddingType 
      ? [...complaintTypes, editingType] 
      : complaintTypes.map(t => t.id === editingType.id ? editingType : t)
    );

    setEditingType(null);
    setIsAddingType(false);
  };

  const handleDeleteType = (id: string) => {
    const updated = complaintTypes.filter(t => t.id !== id);
    setComplaintTypes(updated);
    saveSettings(STORAGE_KEYS.COMPLAINT_TYPES, updated);
    toast.success('✅ Đã xóa loại khiếu nại');
  };

  const handleToggleTypeActive = (id: string) => {
    const updated = complaintTypes.map(t => 
      t.id === id ? { ...t, isActive: !t.isActive } : t
    );
    setComplaintTypes(updated);
    saveSettings(STORAGE_KEYS.COMPLAINT_TYPES, updated);
    toast.success('✅ Đã cập nhật trạng thái');
  };

  const handleResetTypes = () => {
    setComplaintTypes(defaultComplaintTypes);
    saveSettings(STORAGE_KEYS.COMPLAINT_TYPES, defaultComplaintTypes);
    toast.info('ℹ️ Đã khôi phục cài đặt mặc định');
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <ResponsiveContainer maxWidth="full" padding={isMobile ? "sm" : "md"}>
      <Tabs defaultValue="sla" className="space-y-6">
        <TabsList className={`grid w-full ${isMobile ? 'grid-cols-3' : 'grid-cols-7'}`}>
          <TabsTrigger value="sla" className={isMobile ? 'text-xs' : ''}>
            <Clock className="h-4 w-4 mr-2" />
            {!isMobile && 'SLA'}
          </TabsTrigger>
          <TabsTrigger value="complaint-types" className={isMobile ? 'text-xs' : ''}>
            <AlertCircle className="h-4 w-4 mr-2" />
            {!isMobile && 'Loại KN'}
          </TabsTrigger>
          <TabsTrigger value="card-colors" className={isMobile ? 'text-xs' : ''}>
            <AlertCircle className="h-4 w-4 mr-2" />
            {!isMobile && 'Màu card'}
          </TabsTrigger>
          <TabsTrigger value="templates" className={isMobile ? 'text-xs' : ''}>
            <MessageSquare className="h-4 w-4 mr-2" />
            {!isMobile && 'Mẫu phản hồi'}
          </TabsTrigger>
          <TabsTrigger value="notifications" className={isMobile ? 'text-xs' : ''}>
            <Bell className="h-4 w-4 mr-2" />
            {!isMobile && 'Thông báo'}
          </TabsTrigger>
          <TabsTrigger value="public-tracking" className={isMobile ? 'text-xs' : ''}>
            <LinkIcon className="h-4 w-4 mr-2" />
            {!isMobile && 'Tracking'}
          </TabsTrigger>
        </TabsList>

        {/* ============================================ */}
        {/* TAB 1: SLA SETTINGS */}
        {/* ============================================ */}
        <TabsContent value="sla" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt SLA (Service Level Agreement)</CardTitle>
              <CardDescription>
                Thiết lập thời gian phản hồi và giải quyết khiếu nại theo mức độ ưu tiên
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Low Priority */}
              <div className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <h3 className="font-semibold">Ưu tiên thấp</h3>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="low-response">Thời gian phản hồi tối đa (phút)</Label>
                    <Input
                      id="low-response"
                      type="number"
                      value={sla.low.responseTime}
                      onChange={(e) => handleSLAChange('low', 'responseTime', e.target.value)}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="low-resolve">Thời gian giải quyết tối đa (giờ)</Label>
                    <Input
                      id="low-resolve"
                      type="number"
                      value={sla.low.resolveTime}
                      onChange={(e) => handleSLAChange('low', 'resolveTime', e.target.value)}
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Medium Priority */}
              <div className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <h3 className="font-semibold">Ưu tiên trung bình</h3>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="medium-response">Thời gian phản hồi tối đa (phút)</Label>
                    <Input
                      id="medium-response"
                      type="number"
                      value={sla.medium.responseTime}
                      onChange={(e) => handleSLAChange('medium', 'responseTime', e.target.value)}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medium-resolve">Thời gian giải quyết tối đa (giờ)</Label>
                    <Input
                      id="medium-resolve"
                      type="number"
                      value={sla.medium.resolveTime}
                      onChange={(e) => handleSLAChange('medium', 'resolveTime', e.target.value)}
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* High Priority */}
              <div className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-orange-500" />
                  <h3 className="font-semibold">Ưu tiên cao</h3>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="high-response">Thời gian phản hồi tối đa (phút)</Label>
                    <Input
                      id="high-response"
                      type="number"
                      value={sla.high.responseTime}
                      onChange={(e) => handleSLAChange('high', 'responseTime', e.target.value)}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="high-resolve">Thời gian giải quyết tối đa (giờ)</Label>
                    <Input
                      id="high-resolve"
                      type="number"
                      value={sla.high.resolveTime}
                      onChange={(e) => handleSLAChange('high', 'resolveTime', e.target.value)}
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Urgent Priority */}
              <div className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <h3 className="font-semibold">Ưu tiên khẩn cấp</h3>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="urgent-response">Thời gian phản hồi tối đa (phút)</Label>
                    <Input
                      id="urgent-response"
                      type="number"
                      value={sla.urgent.responseTime}
                      onChange={(e) => handleSLAChange('urgent', 'responseTime', e.target.value)}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="urgent-resolve">Thời gian giải quyết tối đa (giờ)</Label>
                    <Input
                      id="urgent-resolve"
                      type="number"
                      value={sla.urgent.resolveTime}
                      onChange={(e) => handleSLAChange('urgent', 'resolveTime', e.target.value)}
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSaveSLA}>
                  <Save className="h-4 w-4 mr-2" />
                  Lưu cài đặt
                </Button>
                <Button variant="outline" onClick={handleResetSLA}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Khôi phục mặc định
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================ */}
        {/* TAB 2: COMPLAINT TYPES */}
        {/* ============================================ */}
        <TabsContent value="complaint-types" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Loại khiếu nại</CardTitle>
              <CardDescription>
                Quản lý các loại khiếu nại có thể sử dụng khi tạo khiếu nại mới
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button onClick={handleAddType} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm loại mới
                </Button>
                <Button variant="outline" size="sm" onClick={handleResetTypes}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Khôi phục mặc định
                </Button>
              </div>

              {/* Types Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">STT</TableHead>
                      <TableHead>Tên loại</TableHead>
                      <TableHead>Mô tả</TableHead>
                      <TableHead className="w-[100px]">Trạng thái</TableHead>
                      <TableHead className="w-[120px]">Thao tác</TableHead>
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
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditType(type)}
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

              {/* Edit Form */}
              {editingType && (
                <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold">
                      {isAddingType ? 'Thêm loại khiếu nại mới' : 'Chỉnh sửa loại khiếu nại'}
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

                  <Button onClick={handleSaveType}>
                    <Save className="h-4 w-4 mr-2" />
                    {isAddingType ? 'Thêm loại' : 'Lưu thay đổi'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================ */}
        {/* TAB 3: CARD COLORS */}
        {/* ============================================ */}
        <TabsContent value="card-colors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Màu sắc card khiếu nại</CardTitle>
              <CardDescription>
                Tùy chỉnh màu hiển thị card theo trạng thái, độ ưu tiên và quá hạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Help Text */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900 font-medium mb-2">💡 Hướng dẫn nhập màu Tailwind CSS:</p>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Định dạng: <code className="bg-blue-100 px-1 rounded">bg-[màu]-[độ đậm]</code> hoặc <code className="bg-blue-100 px-1 rounded">border-[màu]-[độ đậm]</code></li>
                  <li>Ví dụ: <code className="bg-blue-100 px-1 rounded">bg-red-50 border-red-400</code></li>
                  <li>Màu: red, blue, green, yellow, amber, slate, gray...</li>
                  <li>Độ đậm: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900</li>
                </ul>
              </div>

              {/* Enable/Disable Options */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-semibold">Bật/Tắt hiển thị màu</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enable-overdue">Màu quá hạn</Label>
                    <p className="text-sm text-muted-foreground">Hiển thị màu đỏ cho khiếu nại quá hạn (ưu tiên cao nhất)</p>
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
                    <p className="text-sm text-muted-foreground">Hiển thị màu theo mức độ ưu tiên (thấp/trung/cao/khẩn cấp)</p>
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
                    <p className="text-sm text-muted-foreground">Hiển thị màu theo trạng thái xử lý (ưu tiên thấp nhất)</p>
                  </div>
                  <Switch
                    id="enable-status"
                    checked={cardColors.enableStatusColors}
                    onCheckedChange={() => handleCardColorToggle('enableStatusColors')}
                  />
                </div>
              </div>

              {/* Overdue Color */}
              {cardColors.enableOverdueColor && (
                <div className="space-y-3 p-4 border rounded-lg">
                  <h3 className="font-semibold text-red-600">Màu quá hạn SLA</h3>
                  <TailwindColorPicker
                    value={cardColors.overdueColor}
                    onChange={handleOverdueColorChange}
                    label="Màu nền và viền"
                    placeholder="Ví dụ: bg-red-50 border-red-400"
                  />
                </div>
              )}

              {/* Priority Colors */}
              {cardColors.enablePriorityColors && (
                <div className="space-y-3 p-4 border rounded-lg">
                  <h3 className="font-semibold">Màu theo độ ưu tiên</h3>
                  
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
                </div>
              )}

              {/* Status Colors */}
              {cardColors.enableStatusColors && (
                <div className="space-y-3 p-4 border rounded-lg">
                  <h3 className="font-semibold">Màu theo trạng thái</h3>
                  
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
                </div>
              )}

              {/* Save Button */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleResetCardColors}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Khôi phục mặc định
                </Button>
                <Button onClick={handleSaveCardColors}>
                  <Save className="h-4 w-4 mr-2" />
                  Lưu cài đặt
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================ */}
        {/* TAB 3: RESPONSE TEMPLATES */}
        {/* ============================================ */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Mẫu phản hồi</CardTitle>
                  <CardDescription>
                    Tạo và quản lý các mẫu phản hồi nhanh cho khiếu nại
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleResetTemplates} size="sm">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Khôi phục mặc định
                  </Button>
                  <Button onClick={handleAddTemplate} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm mẫu
                  </Button>
                </div>
              </div>
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
                      <TableHead className="text-right">Thao tác</TableHead>
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

              {/* Edit/Add Template Dialog */}
              {editingTemplate && (
                <div className="mt-6 p-4 border rounded-lg space-y-4 bg-muted/50">
                  <h3 className="font-semibold">
                    {isAddingTemplate ? 'Thêm mẫu mới' : 'Chỉnh sửa mẫu'}
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Tên mẫu</Label>
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
                    <Label htmlFor="template-content">Nội dung mẫu</Label>
                    <Textarea
                      id="template-content"
                      value={editingTemplate.content}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, content: e.target.value })}
                      placeholder="Nhập nội dung phản hồi..."
                      rows={8}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleSaveTemplate}>
                      <Save className="h-4 w-4 mr-2" />
                      Lưu
                    </Button>
                    <Button variant="outline" onClick={handleCancelEdit}>
                      Hủy
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================ */}
        {/* TAB 3: NOTIFICATIONS */}
        {/* ============================================ */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt thông báo</CardTitle>
              <CardDescription>
                Quản lý thông báo qua email, SMS và in-app cho các sự kiện khiếu nại
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
              </div>

              {/* SMS Notifications */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Thông báo SMS
                </h3>
                
                <div className="space-y-3 pl-6">
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
                </div>
              </div>

              {/* In-App Notifications */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Thông báo trong ứng dụng
                </h3>
                
                <div className="space-y-3 pl-6">
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
                </div>
              </div>

              {/* Reminder Settings */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Nhắc nhở tự động
                </h3>
                <p className="text-sm text-muted-foreground">
                  Hệ thống sẽ tự động gửi thông báo nhắc nhở nếu khiếu nại không có hành động sau một khoảng thời gian
                </p>
                
                <div className="space-y-4 pl-6">
                  {/* Enable/Disable */}
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
                    <div className="space-y-4 pl-4">
                      {/* First Reminder */}
                      <div className="flex items-center gap-4">
                        <Label htmlFor="first-reminder" className="text-sm w-40">
                          Nhắc nhở lần 1 (giờ):
                        </Label>
                        <Input
                          id="first-reminder"
                          type="number"
                          min="1"
                          value={reminders.firstReminderHours}
                          onChange={(e) => handleReminderChange('firstReminderHours', parseInt(e.target.value) || 1)}
                          className="w-24"
                        />
                        <span className="text-xs text-muted-foreground">Mặc định: 4 giờ</span>
                      </div>

                      {/* Second Reminder */}
                      <div className="flex items-center gap-4">
                        <Label htmlFor="second-reminder" className="text-sm w-40">
                          Nhắc nhở lần 2 (giờ):
                        </Label>
                        <Input
                          id="second-reminder"
                          type="number"
                          min="1"
                          value={reminders.secondReminderHours}
                          onChange={(e) => handleReminderChange('secondReminderHours', parseInt(e.target.value) || 1)}
                          className="w-24"
                        />
                        <span className="text-xs text-muted-foreground">Mặc định: 8 giờ</span>
                      </div>

                      {/* Escalation */}
                      <div className="flex items-center gap-4">
                        <Label htmlFor="escalation" className="text-sm w-40 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3 text-destructive" />
                          Báo động leo thang (giờ):
                        </Label>
                        <Input
                          id="escalation"
                          type="number"
                          min="1"
                          value={reminders.escalationHours}
                          onChange={(e) => handleReminderChange('escalationHours', parseInt(e.target.value) || 1)}
                          className="w-24"
                        />
                        <span className="text-xs text-muted-foreground">Mặc định: 24 giờ</span>
                      </div>

                      <div className="text-xs text-muted-foreground space-y-1 bg-muted/50 p-3 rounded">
                        <p>• Hệ thống chỉ gửi nhắc nhở cho khiếu nại ở trạng thái Pending hoặc Investigating</p>
                        <p>• Thời gian tính từ lúc tạo khiếu nại hoặc hành động cuối cùng</p>
                        <p>• Thông báo sẽ gửi cho nhân viên được phân công và người tạo khiếu nại</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Save Button */}
              <div className="flex gap-2 pt-4">
                <Button onClick={() => {
                  handleSaveNotifications();
                  handleSaveReminders();
                }}>
                  <Save className="h-4 w-4 mr-2" />
                  Lưu cài đặt
                </Button>
                <Button variant="outline" onClick={() => {
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

        {/* ============================================ */}
        {/* TAB 4: PUBLIC TRACKING */}
        {/* ============================================ */}
        <TabsContent value="public-tracking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Liên kết theo dõi công khai</CardTitle>
              <CardDescription>
                Cho phép khách hàng theo dõi tiến độ xử lý khiếu nại qua link công khai
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="tracking-enabled" className="cursor-pointer">
                      Bật tính năng tracking công khai
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Tạo link công khai để khách hàng theo dõi khiếu nại
                    </p>
                  </div>
                  <Switch
                    id="tracking-enabled"
                    checked={publicTracking.enabled}
                    onCheckedChange={() => handlePublicTrackingChange('enabled')}
                  />
                </div>

                {publicTracking.enabled && (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="allow-comments" className="cursor-pointer">
                          Cho phép khách hàng comment
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Khách hàng có thể thêm bình luận vào khiếu nại
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
                          Khách hàng có thể xem tên nhân viên được phân công
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
                          Khách hàng có thể xem lịch sử xử lý chi tiết
                        </p>
                      </div>
                      <Switch
                        id="show-timeline"
                        checked={publicTracking.showTimeline}
                        onCheckedChange={() => handlePublicTrackingChange('showTimeline')}
                      />
                    </div>
                  </>
                )}
              </div>

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

              {/* Save Button */}
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSavePublicTracking}>
                  <Save className="h-4 w-4 mr-2" />
                  Lưu cài đặt
                </Button>
                <Button variant="outline" onClick={handleResetPublicTracking}>
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
