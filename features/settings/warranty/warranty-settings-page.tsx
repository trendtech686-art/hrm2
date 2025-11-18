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
import { toast } from 'sonner';
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
  Save,
  Trash2,
} from 'lucide-react';
import { usePageHeader } from '../../../contexts/page-header-context.tsx';
import { ResponsiveContainer } from '../../../components/mobile/responsive-container.tsx';
import { useMediaQuery } from '../../../lib/use-media-query.ts';

// ============================================
// INTERFACES
// ============================================

export interface CardColorSettings {
  // Màu theo trạng thái warranty
  statusColors: {
    new: string;
    pending: string;
    processed: string;
    returned: string;
  };
  // Màu quá hạn (override tất cả)
  overdueColor: string;
  // Enable/disable coloring
  enableStatusColors: boolean;
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
  category: 'general' | 'processing-error' | 'customer-damage' | 'inspection-result' | 'warranty-approved' | 'warranty-rejected';
  order: number;
}

interface NotificationSettings {
  emailOnCreate: boolean;
  emailOnAssign: boolean;
  emailOnInspected: boolean;
  emailOnApproved: boolean;
  emailOnRejected: boolean;
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

// ============================================
// DEFAULT VALUES
// ============================================

const defaultSLA: SLASettings = {
  low: { responseTime: 480, resolveTime: 72 }, // 8h response, 72h resolve
  medium: { responseTime: 240, resolveTime: 48 }, // 4h response, 48h resolve
  high: { responseTime: 120, resolveTime: 24 }, // 2h response, 24h resolve
  urgent: { responseTime: 60, resolveTime: 12 }, // 1h response, 12h resolve
};

const defaultNotifications: NotificationSettings = {
  emailOnCreate: true,
  emailOnAssign: true,
  emailOnInspected: false,
  emailOnApproved: true,
  emailOnRejected: true,
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
    new: 'bg-blue-50 border-blue-200',
    pending: 'bg-yellow-50 border-yellow-200',
    processed: 'bg-green-50 border-green-200',
    returned: 'bg-gray-50 border-gray-200',
  },
  overdueColor: 'bg-red-50 border-red-400',
  enableStatusColors: true,
  enableOverdueColor: true,
};

const defaultTemplates: ResponseTemplate[] = [
  {
    id: '1',
    name: 'Xác nhận tiếp nhận yêu cầu bảo hành',
    content: 'Kính chào Anh/Chị,\n\nChúng tôi đã nhận được yêu cầu bảo hành của Anh/Chị cho sản phẩm [TÊN SẢN PHẨM].\n\nMã bảo hành: [MÃ BẢO HÀNH]\nNgày tiếp nhận: [NGÀY]\n\nChúng tôi sẽ tiến hành kiểm tra và thông báo kết quả trong thời gian sớm nhất.\n\nTrân trọng,',
    category: 'general',
    order: 1,
  },
  {
    id: '2',
    name: 'Thông báo đang kiểm tra',
    content: 'Kính chào Anh/Chị,\n\nSản phẩm của Anh/Chị đang được nhân viên kỹ thuật kiểm tra.\n\nChúng tôi sẽ thông báo kết quả kiểm tra và phương án xử lý trong vòng 24-48 giờ.\n\nTrân trọng,',
    category: 'inspection-result',
    order: 2,
  },
  {
    id: '3',
    name: 'Chấp nhận bảo hành - Lỗi sản xuất',
    content: 'Kính chào Anh/Chị,\n\nSau khi kiểm tra, chúng tôi xác nhận sản phẩm của Anh/Chị thuộc diện bảo hành do lỗi sản xuất.\n\nPhương án xử lý: [ĐỔI MỚI / SỬA CHỮA / HOÀN TIỀN]\nThời gian xử lý: [THỜI GIAN]\n\nChúng tôi sẽ liên hệ với Anh/Chị để sắp xếp việc [đổi sản phẩm mới / sửa chữa / hoàn tiền].\n\nTrân trọng,',
    category: 'warranty-approved',
    order: 3,
  },
  {
    id: '4',
    name: 'Từ chối bảo hành - Lỗi người dùng',
    content: 'Kính chào Anh/Chị,\n\nSau khi kiểm tra kỹ thuật, chúng tôi xin phép được thông báo rằng sản phẩm của Anh/Chị không thuộc diện bảo hành do:\n\n[LÝ DO: VD: Hư hỏng do tác động vật lý / Sử dụng không đúng mục đích / Đã qua sửa chữa bởi bên thứ ba]\n\nChúng tôi có thể hỗ trợ sửa chữa với chi phí [SỐ TIỀN] nếu Anh/Chị có nhu cầu.\n\nTrân trọng,',
    category: 'warranty-rejected',
    order: 4,
  },
  {
    id: '5',
    name: 'Xin lỗi - Lỗi xử lý',
    content: 'Kính chào Anh/Chị,\n\nChúng tôi xin chân thành xin lỗi về sự cố xảy ra trong quá trình xử lý sản phẩm của Anh/Chị.\n\nChúng tôi đã xác định nguyên nhân và sẽ có phương án khắc phục/bồi thường hợp lý.\n\nXin Anh/Chị vui lòng liên hệ với chúng tôi để được hỗ trợ tốt nhất.\n\nTrân trọng,',
    category: 'processing-error',
    order: 5,
  },
];

// ============================================
// STORAGE HELPERS
// ============================================

const STORAGE_KEYS = {
  SLA: 'warranty-sla-settings',
  TEMPLATES: 'warranty-templates',
  NOTIFICATIONS: 'warranty-notification-settings',
  PUBLIC_TRACKING: 'warranty-public-tracking-settings',
  CARD_COLORS: 'warranty-card-colors',
};

// Export function to load card colors from other components
export function loadCardColorSettings(): CardColorSettings {
  return loadSettings(STORAGE_KEYS.CARD_COLORS, defaultCardColors);
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

// ============================================
// MAIN COMPONENT
// ============================================

export function WarrantySettingsPage() {
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
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [templateToDelete, setTemplateToDelete] = React.useState<string | null>(null);
  const [showEditDialog, setShowEditDialog] = React.useState(false);

  // Notifications State
  const [notifications, setNotifications] = React.useState<NotificationSettings>(() => 
    loadSettings(STORAGE_KEYS.NOTIFICATIONS, defaultNotifications)
  );

  // Public Tracking State
  const [publicTracking, setPublicTracking] = React.useState<PublicTrackingSettings>(() => 
    loadSettings(STORAGE_KEYS.PUBLIC_TRACKING, defaultPublicTracking)
  );

  // Card Colors State
  const [cardColors, setCardColors] = React.useState<CardColorSettings>(() => 
    loadSettings(STORAGE_KEYS.CARD_COLORS, defaultCardColors)
  );

  usePageHeader({
    title: 'Cài đặt bảo hành',
    subtitle: 'Cấu hình SLA, mẫu phản hồi, thông báo và liên kết công khai',
    breadcrumb: [
      { label: 'Trang chủ', href: '/' },
      { label: 'Cài đặt', href: '/settings' },
      { label: 'Bảo hành', href: '/settings/warranty', isCurrent: true }
    ],
    actions: [], // Clear any previous actions
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
    // Validation
    const priorities: Array<keyof SLASettings> = ['low', 'medium', 'high', 'urgent'];
    for (const priority of priorities) {
      if (sla[priority].responseTime <= 0) {
        toast.error('Lỗi validation', {
          description: `Thời gian phản hồi cho mức ${priority} phải lớn hơn 0`,
        });
        return;
      }
      if (sla[priority].resolveTime <= 0) {
        toast.error('Lỗi validation', {
          description: `Thời gian xử lý cho mức ${priority} phải lớn hơn 0`,
        });
        return;
      }
    }

    saveSettings(STORAGE_KEYS.SLA, sla);
    toast.success('✅ Đã lưu cài đặt SLA', {
      description: 'Thời gian phản hồi và giải quyết đã được cập nhật.',
    });
  };

  const handleResetSLA = () => {
    setSLA(defaultSLA);
    saveSettings(STORAGE_KEYS.SLA, defaultSLA);
    toast.success('✅ Đã đặt lại mặc định', {
      description: 'Cài đặt SLA đã được khôi phục về giá trị mặc định.',
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
    setShowEditDialog(true);
  };

  const handleSaveTemplate = () => {
    if (!editingTemplate) return;

    // Validation
    if (!editingTemplate.name.trim()) {
      toast.error('❌ Lỗi validation', {
        description: 'Vui lòng nhập tên mẫu.',
      });
      return;
    }

    if (!editingTemplate.content.trim()) {
      toast.error('❌ Lỗi validation', {
        description: 'Vui lòng nhập nội dung mẫu.',
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
      description: `Mẫu "${editingTemplate.name}" đã được lưu.`,
    });

    setEditingTemplate(null);
    setIsAddingTemplate(false);
    setShowEditDialog(false);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplateToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDeleteTemplate = () => {
    if (!templateToDelete) return;
    
    const template = templates.find(t => t.id === templateToDelete);
    const updatedTemplates = templates.filter(t => t.id !== templateToDelete);
    setTemplates(updatedTemplates);
    saveSettings(STORAGE_KEYS.TEMPLATES, updatedTemplates);
    
    toast.success('✅ Đã xóa mẫu', {
      description: `Mẫu "${template?.name}" đã được xóa.`,
    });
    
    setShowDeleteDialog(false);
    setTemplateToDelete(null);
  };

  const handleCancelEdit = () => {
    setEditingTemplate(null);
    setIsAddingTemplate(false);
    setShowEditDialog(false);
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
      description: 'Các tùy chọn thông báo đã được cập nhật.',
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
    
    // Show different message based on enabled state
    if (publicTracking.enabled) {
      toast.success('✅ Đã bật tracking công khai', {
        description: 'Khách hàng giờ có thể theo dõi tiến độ bảo hành qua link công khai.',
      });
    } else {
      toast.success('✅ Đã tắt tracking công khai', {
        description: 'Tính năng tracking công khai đã được vô hiệu hóa.',
      });
    }
  };

  // ============================================
  // CARD COLOR HANDLERS
  // ============================================

  const handleCardColorChange = (category: 'statusColors' | 'overdueColor', key: string, value: string) => {
    if (category === 'overdueColor') {
      setCardColors(prev => ({ ...prev, overdueColor: value }));
    } else {
      setCardColors(prev => ({
        ...prev,
        statusColors: { ...prev.statusColors, [key]: value }
      }));
    }
  };

  const handleCardColorToggle = (key: 'enableStatusColors' | 'enableOverdueColor') => {
    setCardColors(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveCardColors = () => {
    saveSettings(STORAGE_KEYS.CARD_COLORS, cardColors);
    toast.success('✅ Đã lưu màu card', {
      description: 'Cài đặt màu sắc card bảo hành đã được cập nhật. Refresh trang để xem thay đổi.',
    });
  };

  const handleResetCardColors = () => {
    setCardColors(defaultCardColors);
    saveSettings(STORAGE_KEYS.CARD_COLORS, defaultCardColors);
    toast.success('✅ Đã đặt lại mặc định', {
      description: 'Màu card đã được khôi phục về giá trị mặc định.',
    });
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <ResponsiveContainer maxWidth="full" padding={isMobile ? "sm" : "md"}>
      <Tabs defaultValue="sla" className="space-y-6">
        <TabsList className={`grid w-full ${isMobile ? 'grid-cols-3' : 'grid-cols-5'}`}>
          <TabsTrigger value="sla" className={isMobile ? 'text-xs' : ''}>
            <Clock className="h-4 w-4 mr-2" />
            {!isMobile && 'SLA'}
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
          <TabsTrigger value="card-colors" className={isMobile ? 'text-xs' : ''}>
            <Plus className="h-4 w-4 mr-2" />
            {!isMobile && 'Màu card'}
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
                Thiết lập thời gian phản hồi và xử lý bảo hành theo mức độ ưu tiên
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
                    <Label htmlFor="low-resolve">Thời gian xử lý tối đa (giờ)</Label>
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
                    <Label htmlFor="medium-resolve">Thời gian xử lý tối đa (giờ)</Label>
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
                    <Label htmlFor="high-resolve">Thời gian xử lý tối đa (giờ)</Label>
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
                    <Label htmlFor="urgent-resolve">Thời gian xử lý tối đa (giờ)</Label>
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
              <div className="flex gap-3 pt-4">
                <Button onClick={handleSaveSLA}>
                  <Save className="h-4 w-4 mr-2" />
                  Lưu cài đặt
                </Button>
                <Button variant="outline" onClick={handleResetSLA}>
                  Đặt lại mặc định
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Simple Warranty SLA Targets Card */}
          <Card>
            <CardHeader>
              <CardTitle>Mục tiêu SLA đơn giản</CardTitle>
              <CardDescription>
                Cấu hình thời gian xử lý chuẩn cho toàn bộ phiếu bảo hành
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="sla-response">
                    Phản hồi (phút)
                    <span className="text-xs text-muted-foreground block">
                      Nhận → Bắt đầu xử lý
                    </span>
                  </Label>
                  <Input
                    id="sla-response"
                    type="number"
                    defaultValue="120"
                    placeholder="120"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sla-processing">
                    Xử lý (phút)
                    <span className="text-xs text-muted-foreground block">
                      Hoàn tất xử lý SP
                    </span>
                  </Label>
                  <Input
                    id="sla-processing"
                    type="number"
                    defaultValue="1440"
                    placeholder="1440"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sla-return">
                    Trả hàng (phút)
                    <span className="text-xs text-muted-foreground block">
                      Hoàn thành → Trả khách
                    </span>
                  </Label>
                  <Input
                    id="sla-return"
                    type="number"
                    defaultValue="2880"
                    placeholder="2880"
                  />
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Lưu SLA đơn giản
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================ */}
        {/* TAB 2: RESPONSE TEMPLATES */}
        {/* ============================================ */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Mẫu phản hồi</CardTitle>
                  <CardDescription>
                    Tạo và quản lý các mẫu phản hồi nhanh cho bảo hành
                  </CardDescription>
                </div>
                <Button onClick={handleAddTemplate} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm mẫu
                </Button>
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
                            {template.category === 'processing-error' && 'Lỗi xử lý'}
                            {template.category === 'customer-damage' && 'Lỗi khách hàng'}
                            {template.category === 'inspection-result' && 'Kết quả kiểm tra'}
                            {template.category === 'warranty-approved' && 'Chấp nhận BH'}
                            {template.category === 'warranty-rejected' && 'Từ chối BH'}
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
                                setShowEditDialog(true);
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
                Quản lý thông báo qua email, SMS và in-app cho các sự kiện bảo hành
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
                      Khi bảo hành mới được tạo
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
                    <Label htmlFor="email-inspected" className="cursor-pointer">
                      Khi hoàn thành kiểm tra
                    </Label>
                    <Switch
                      id="email-inspected"
                      checked={notifications.emailOnInspected}
                      onCheckedChange={() => handleNotificationChange('emailOnInspected')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-approved" className="cursor-pointer">
                      Khi chấp nhận bảo hành
                    </Label>
                    <Switch
                      id="email-approved"
                      checked={notifications.emailOnApproved}
                      onCheckedChange={() => handleNotificationChange('emailOnApproved')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-rejected" className="cursor-pointer">
                      Khi từ chối bảo hành
                    </Label>
                    <Switch
                      id="email-rejected"
                      checked={notifications.emailOnRejected}
                      onCheckedChange={() => handleNotificationChange('emailOnRejected')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-overdue" className="cursor-pointer">
                      Khi bảo hành quá hạn SLA
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

              {/* Save Button */}
              <div className="pt-4">
                <Button onClick={handleSaveNotifications}>
                  <Save className="h-4 w-4 mr-2" />
                  Lưu cài đặt
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
                Cho phép khách hàng theo dõi tiến độ xử lý bảo hành qua link công khai
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
                      Tạo link công khai để khách hàng theo dõi bảo hành
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
                          Khách hàng có thể thêm bình luận vào yêu cầu bảo hành
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
                    https://yoursite.com/warranty-tracking/abc123xyz
                  </code>
                  <p className="text-xs text-muted-foreground">
                    Link này sẽ được tạo tự động khi tạo yêu cầu bảo hành mới
                  </p>
                </div>
              )}

              {/* Save Button */}
              <div className="pt-4">
                <Button onClick={handleSavePublicTracking}>
                  <Save className="h-4 w-4 mr-2" />
                  Lưu cài đặt
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================ */}
        {/* TAB 5: CARD COLORS */}
        {/* ============================================ */}
        <TabsContent value="card-colors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Màu sắc card bảo hành (Kanban View)</CardTitle>
              <CardDescription>
                Tùy chỉnh màu nền và viền card theo trạng thái bảo hành trong chế độ Kanban
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Toggle Controls */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enable-overdue">Màu quá hạn SLA</Label>
                    <p className="text-sm text-muted-foreground">
                      Override tất cả màu khác khi phiếu quá hạn (ưu tiên cao nhất)
                    </p>
                  </div>
                  <Switch
                    id="enable-overdue"
                    checked={cardColors.enableOverdueColor}
                    onCheckedChange={() => handleCardColorToggle('enableOverdueColor')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enable-status">Màu theo trạng thái</Label>
                    <p className="text-sm text-muted-foreground">
                      Hiển thị màu theo trạng thái xử lý
                    </p>
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
                <div className="space-y-3 p-4 border rounded-lg bg-red-50/50 dark:bg-red-950/20">
                  <h3 className="font-semibold text-red-600 dark:text-red-400">
                    Màu quá hạn SLA
                  </h3>
                  <TailwindColorPicker
                    value={cardColors.overdueColor}
                    onChange={(value) => handleCardColorChange('overdueColor', '', value)}
                    label="Màu nền và viền"
                    placeholder="Ví dụ: bg-red-50 border-red-400"
                  />
                </div>
              )}

              {/* Status Colors */}
              {cardColors.enableStatusColors && (
                <div className="space-y-3 p-4 border rounded-lg">
                  <h3 className="font-semibold">Màu theo trạng thái</h3>
                  
                  <div className="space-y-4">
                    <TailwindColorPicker
                      value={cardColors.statusColors.new}
                      onChange={(value) => handleCardColorChange('statusColors', 'new', value)}
                      label="Mới (New)"
                      placeholder="Ví dụ: bg-blue-50 border-blue-200"
                    />

                    <TailwindColorPicker
                      value={cardColors.statusColors.pending}
                      onChange={(value) => handleCardColorChange('statusColors', 'pending', value)}
                      label="Chưa xử lý (Pending)"
                      placeholder="Ví dụ: bg-yellow-50 border-yellow-200"
                    />

                    <TailwindColorPicker
                      value={cardColors.statusColors.processed}
                      onChange={(value) => handleCardColorChange('statusColors', 'processed', value)}
                      label="Đã xử lý (Processed)"
                      placeholder="Ví dụ: bg-green-50 border-green-200"
                    />

                    <TailwindColorPicker
                      value={cardColors.statusColors.returned}
                      onChange={(value) => handleCardColorChange('statusColors', 'returned', value)}
                      label="Đã trả (Returned)"
                      placeholder="Ví dụ: bg-gray-50 border-gray-200"
                    />
                  </div>
                </div>
              )}

              {/* Info Box */}
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-4 text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                  💡 Thứ tự ưu tiên màu sắc
                </p>
                <ol className="text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
                  <li>Màu quá hạn SLA (nếu bật) - Ưu tiên cao nhất</li>
                  <li>Màu theo trạng thái (nếu bật) - Ưu tiên thấp</li>
                  <li>Màu mặc định (nếu tắt tất cả)</li>
                </ol>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button onClick={handleSaveCardColors}>
                  <Save className="h-4 w-4 mr-2" />
                  Lưu cài đặt
                </Button>
                <Button variant="outline" onClick={handleResetCardColors}>
                  Đặt lại mặc định
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit/Add Template Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isAddingTemplate ? 'Thêm mẫu phản hồi mới' : 'Chỉnh sửa mẫu phản hồi'}
            </DialogTitle>
            <DialogDescription>
              Tạo hoặc chỉnh sửa mẫu phản hồi nhanh cho khách hàng
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
                  placeholder="VD: Xác nhận tiếp nhận bảo hành"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="template-category">Danh mục *</Label>
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
                    <SelectItem value="processing-error">Lỗi xử lý</SelectItem>
                    <SelectItem value="customer-damage">Lỗi khách hàng</SelectItem>
                    <SelectItem value="inspection-result">Kết quả kiểm tra</SelectItem>
                    <SelectItem value="warranty-approved">Chấp nhận bảo hành</SelectItem>
                    <SelectItem value="warranty-rejected">Từ chối bảo hành</SelectItem>
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
                  rows={12}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Tip: Sử dụng biến như [TÊN SẢN PHẨM], [MÃ BẢO HÀNH], [NGÀY] để tùy chỉnh
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleCancelEdit}>
              Hủy
            </Button>
            <Button onClick={handleSaveTemplate}>
              <Save className="h-4 w-4 mr-2" />
              Lưu mẫu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Template Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa mẫu phản hồi</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa mẫu phản hồi này? Hành động này không thể hoàn tác.
              {templateToDelete && (
                <div className="mt-2 p-2 bg-muted rounded text-sm font-medium">
                  Mẫu: {templates.find(t => t.id === templateToDelete)?.name}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteTemplate}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa mẫu
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </ResponsiveContainer>
  );
}
