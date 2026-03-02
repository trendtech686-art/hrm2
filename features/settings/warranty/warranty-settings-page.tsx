'use client'

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
import { generateSubEntityId } from '@/lib/id-utils';
import { SettingsActionButton } from '../../../components/settings/SettingsActionButton';
import { SettingsVerticalTabs } from '../../../components/settings/SettingsVerticalTabs';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
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
  MoreHorizontal,
  Plus,
  Save,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { ConfirmDialog } from '../../../components/ui/confirm-dialog';
import { useSettingsPageHeader } from '../use-settings-page-header';
import { useTabActionRegistry } from '../use-tab-action-registry';

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
  showProductList: boolean;
  showSummary: boolean;
  showPayment: boolean;
  showReceivedImages: boolean;
  showProcessedImages: boolean;
  showHistory: boolean;
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

const _defaultNotifications: NotificationSettings = {
  emailOnCreate: true,
  emailOnAssign: true,
  emailOnInspected: false,
  emailOnApproved: true,
  emailOnRejected: true,
  emailOnOverdue: true,
  smsOnOverdue: false,
  inAppNotifications: true,
};

const _defaultPublicTracking: PublicTrackingSettings = {
  enabled: false,
  allowCustomerComments: false,
  showEmployeeName: true,
  showTimeline: true,
  showProductList: true,
  showSummary: true,
  showPayment: true,
  showReceivedImages: true,
  showProcessedImages: true,
  showHistory: true,
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

const _defaultTemplates: ResponseTemplate[] = [
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

const WARRANTY_SLA_PRIORITY_CONFIGS: Array<{
  key: keyof SLASettings;
  label: string;
  description: string;
  indicatorClass: string;
}> = [
  {
    key: 'low',
    label: 'Ưu tiên thấp',
    description: 'Các yêu cầu bảo hành cơ bản, không ảnh hưởng đến trải nghiệm khách hàng.',
    indicatorClass: 'bg-green-500',
  },
  {
    key: 'medium',
    label: 'Ưu tiên trung bình',
    description: 'Cần xử lý trong vòng 2-3 ngày làm việc.',
    indicatorClass: 'bg-yellow-500',
  },
  {
    key: 'high',
    label: 'Ưu tiên cao',
    description: 'Sản phẩm lỗi gây gián đoạn sử dụng, cần phản hồi trong ngày.',
    indicatorClass: 'bg-orange-500',
  },
  {
    key: 'urgent',
    label: 'Ưu tiên khẩn cấp',
    description: 'Sự cố nghiêm trọng, yêu cầu phản hồi trong vòng 1 giờ.',
    indicatorClass: 'bg-red-500',
  },
];

// ============================================
// SETTINGS STORE
// ============================================

type _WarrantySettingsState = {
  sla: SLASettings;
  templates: ResponseTemplate[];
  notifications: NotificationSettings;
  publicTracking: PublicTrackingSettings;
  cardColors: CardColorSettings;
};

const clone = <T,>(value: T): T => {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
};

import { useWarrantySettings, useWarrantySettingsMutations } from './hooks/use-warranty-settings';

// ============================================
// MAIN COMPONENT
// ============================================

export function WarrantySettingsPage() {
  const [activeTab, setActiveTab] = React.useState('sla');
  const { headerActions, setHeaderActions } = useTabActionRegistry(activeTab);

  // Fetch settings from React Query
  const { data: settings, isLoading: _isLoadingSettings } = useWarrantySettings();
  const { updateSection } = useWarrantySettingsMutations();

  // (unused register* removed — using direct setHeaderActions now)

  // Get stored values from React Query
  const storedSla = settings.sla;
  const storedTemplates = settings.templates as ResponseTemplate[];
  const storedNotifications = settings.notifications;
  const storedPublicTracking = settings.publicTracking;
  const storedCardColors = settings.cardColors;

  // SLA State - cast to proper type
  const [sla, setSLA] = React.useState<SLASettings>(storedSla as SLASettings);

  // Templates State
  const [templates, setTemplates] = React.useState<ResponseTemplate[]>(storedTemplates);
  const [editingTemplate, setEditingTemplate] = React.useState<ResponseTemplate | null>(null);
  const [isAddingTemplate, setIsAddingTemplate] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [templateToDelete, setTemplateToDelete] = React.useState<string | null>(null);
  const [showEditDialog, setShowEditDialog] = React.useState(false);

  // Notifications State
  const [notifications, setNotifications] = React.useState<NotificationSettings>(storedNotifications as unknown as NotificationSettings);

  // Public Tracking State
  const [publicTracking, setPublicTracking] = React.useState<PublicTrackingSettings>(storedPublicTracking);

  // Card Colors State
  const [cardColors, setCardColors] = React.useState<CardColorSettings>(storedCardColors as CardColorSettings);

  React.useEffect(() => {
    setSLA(storedSla as SLASettings);
  }, [storedSla]);

  React.useEffect(() => {
    setTemplates(storedTemplates);
  }, [storedTemplates]);

  React.useEffect(() => {
    setNotifications(storedNotifications as unknown as NotificationSettings);
  }, [storedNotifications]);

  React.useEffect(() => {
    setPublicTracking(storedPublicTracking);
  }, [storedPublicTracking]);

  React.useEffect(() => {
    setCardColors(storedCardColors as CardColorSettings);
  }, [storedCardColors]);

  useSettingsPageHeader({
    title: 'Cài đặt bảo hành',
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

    updateSection.mutate(
      { type: 'sla-targets', data: sla },
      {
        onSuccess: () => {
          toast.success('Đã lưu cài đặt SLA', {
            description: 'Thời gian phản hồi và giải quyết đã được cập nhật.',
          });
        },
      }
    );
  };

  const _handleResetSLA = () => {
    const defaults = clone(defaultSLA);
    setSLA(defaults);
    updateSection.mutate(
      { type: 'sla-targets', data: defaults },
      {
        onSuccess: () => {
          toast.info('Đã đặt lại mặc định', {
            description: 'Cài đặt SLA đã được khôi phục về giá trị mặc định.',
          });
        },
      }
    );
  };

  // ============================================
  // TEMPLATE HANDLERS
  // ============================================

  const handleAddTemplate = () => {
    setEditingTemplate({
      id: generateSubEntityId('ID'),
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
      toast.error('Lỗi validation', {
        description: 'Vui lòng nhập tên mẫu.',
      });
      return;
    }

    if (!editingTemplate.content.trim()) {
      toast.error('Lỗi validation', {
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
    updateSection.mutate(
      { type: 'reminder-templates', data: updatedTemplates },
      {
        onSuccess: () => {
          toast.success(isAddingTemplate ? 'Đã thêm mẫu' : 'Đã cập nhật mẫu', {
            description: `Mẫu "${editingTemplate.name}" đã được lưu.`,
          });
        },
      }
    );

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
    updateSection.mutate(
      { type: 'reminder-templates', data: updatedTemplates },
      {
        onSuccess: () => {
          toast.success('Đã xóa mẫu', {
            description: `Mẫu "${template?.name}" đã được xóa.`,
          });
        },
      }
    );
    
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
    updateSection.mutate(
      { type: 'notifications', data: notifications as unknown as Parameters<typeof updateSection.mutate>[0]['data'] },
      {
        onSuccess: () => {
          toast.success('Đã lưu cài đặt thông báo', {
            description: 'Các tùy chọn thông báo đã được cập nhật.',
          });
        },
      }
    );
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
    updateSection.mutate(
      { type: 'tracking', data: publicTracking },
      {
        onSuccess: () => {
          toast.success('Đã lưu cài đặt tracking công khai', {
            description: publicTracking.enabled
              ? 'Khách hàng giờ có thể theo dõi tiến độ bảo hành qua link công khai.'
              : 'Tính năng tracking công khai đã được vô hiệu hóa.',
          });
        },
      }
    );
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
    updateSection.mutate(
      { type: 'cardColors', data: cardColors },
      {
        onSuccess: () => {
          toast.success('Đã lưu màu card', {
            description: 'Cài đặt màu sắc card bảo hành đã được cập nhật. Refresh trang để xem thay đổi.',
          });
        },
      }
    );
  };

  const _handleResetCardColors = () => {
    const defaults = clone(defaultCardColors);
    setCardColors(defaults);
    updateSection.mutate(
      { type: 'cardColors', data: defaults },
      {
        onSuccess: () => {
          toast.info('Đã đặt lại mặc định', {
            description: 'Màu card đã được khôi phục về giá trị mặc định.',
          });
        },
      }
    );
  };

  // ============================================
  // RENDER
  // ============================================

  // ✅ Use refs to avoid stale closures in header action buttons
  const handlersRef = React.useRef({
    saveSLA: handleSaveSLA,
    addTemplate: handleAddTemplate,
    saveNotifications: handleSaveNotifications,
    savePublicTracking: handleSavePublicTracking,
    saveCardColors: handleSaveCardColors,
  });
  handlersRef.current = {
    saveSLA: handleSaveSLA,
    addTemplate: handleAddTemplate,
    saveNotifications: handleSaveNotifications,
    savePublicTracking: handleSavePublicTracking,
    saveCardColors: handleSaveCardColors,
  };

  React.useEffect(() => {
    switch (activeTab) {
      case 'sla':
        setHeaderActions([
          <SettingsActionButton key="save" onClick={() => handlersRef.current.saveSLA()}>
            <Save className="h-4 w-4" /> Lưu cài đặt
          </SettingsActionButton>,
        ]);
        break;
      case 'templates':
        setHeaderActions([
          <SettingsActionButton key="add" onClick={() => handlersRef.current.addTemplate()}>
            <Plus className="h-4 w-4" /> Thêm mẫu
          </SettingsActionButton>,
        ]);
        break;
      case 'notifications':
        setHeaderActions([
          <SettingsActionButton key="save" onClick={() => handlersRef.current.saveNotifications()}>
            <Save className="h-4 w-4" /> Lưu cài đặt
          </SettingsActionButton>,
        ]);
        break;
      case 'public-tracking':
        setHeaderActions([
          <SettingsActionButton key="save" onClick={() => handlersRef.current.savePublicTracking()}>
            <Save className="h-4 w-4" /> Lưu cài đặt
          </SettingsActionButton>,
        ]);
        break;
      case 'card-colors':
        setHeaderActions([
          <SettingsActionButton key="save" onClick={() => handlersRef.current.saveCardColors()}>
            <Save className="h-4 w-4" /> Lưu cài đặt
          </SettingsActionButton>,
        ]);
        break;
    }
  }, [activeTab, setHeaderActions]);

  const tabs = React.useMemo(
    () => [
      { value: 'sla', label: 'SLA' },
      { value: 'templates', label: 'Mẫu biểu' },
      { value: 'notifications', label: 'Thông báo' },
      { value: 'public-tracking', label: 'Tracking' },
      { value: 'card-colors', label: 'Màu card' },
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
                Thiết lập thời gian phản hồi và xử lý bảo hành theo mức độ ưu tiên
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {WARRANTY_SLA_PRIORITY_CONFIGS.map(({ key, label, description, indicatorClass }) => (
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
                      <Label htmlFor={`${key}-resolve`}>Thời gian xử lý tối đa (giờ)</Label>
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
        <TabsContent value="templates" className="mt-0 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mẫu phản hồi</CardTitle>
              <CardDescription>
                Tạo và quản lý các mẫu phản hồi nhanh cho bảo hành
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
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                setEditingTemplate(template);
                                setIsAddingTemplate(false);
                                setShowEditDialog(true);
                              }}>
                                Sửa
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeleteTemplate(template.id)}
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
        </TabsContent>

        {/* ============================================ */}
        {/* TAB 3: NOTIFICATIONS */}
        {/* ============================================ */}
        <TabsContent value="notifications" className="mt-0 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt thông báo</CardTitle>
              <CardDescription>
                Quản lý thông báo qua email, SMS và in-app cho các sự kiện bảo hành
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SettingsFormSection
                title="Thông báo Email"
                description="Gửi cập nhật đến khách hàng và đội bảo hành cho từng giai đoạn."
                badge={<Bell className="h-4 w-4 text-muted-foreground" />}
                contentClassName="space-y-3"
              >
                <div className="space-y-3">
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
              </SettingsFormSection>

              <SettingsFormSection
                title="Thông báo SMS"
                description="Chỉ bật cho các sự kiện cần phản hồi tức thì để tránh spam."
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
                description="Hiển thị trong bell icon của hệ thống HRM."
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
                Cho phép khách hàng theo dõi tiến độ xử lý bảo hành qua link công khai
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SettingsFormSection
                title="Cấu hình truy cập công khai"
                description="Kiểm soát dữ liệu nào được chia sẻ cho khách hàng qua link bảo hành."
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="tracking-enabled" className="cursor-pointer">
                        Bật tính năng tracking công khai
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Tạo link công khai để khách hàng tự theo dõi tiến độ
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
                            Thu thập thêm bằng chứng trực tiếp từ khách hàng
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
                            Tăng tính minh bạch và trách nhiệm
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
                            Cho phép khách hàng xem toàn bộ lịch sử thao tác
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
                    https://yoursite.com/warranty/tracking/abc123xyz
                  </code>
                  <p className="text-xs text-muted-foreground">
                    Link này sẽ được tạo tự động khi tạo yêu cầu bảo hành mới
                  </p>
                </div>
              )}

              {/* Card visibility settings */}
              {publicTracking.enabled && (
                <SettingsFormSection
                  title="Hiển thị nội dung trang tracking"
                  description="Chọn các thẻ thông tin sẽ hiển thị trên trang tracking công khai cho khách hàng."
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="show-product-list" className="cursor-pointer">
                          Danh sách sản phẩm bảo hành
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Hiển thị bảng chi tiết sản phẩm (tên, số lượng, giá, kết quả)
                        </p>
                      </div>
                      <Switch
                        id="show-product-list"
                        checked={publicTracking.showProductList !== false}
                        onCheckedChange={() => handlePublicTrackingChange('showProductList')}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="show-summary" className="cursor-pointer">
                          Tổng kết bảo hành
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Hiển thị tổng giá trị, số lượng đổi/trả, bù trừ
                        </p>
                      </div>
                      <Switch
                        id="show-summary"
                        checked={publicTracking.showSummary !== false}
                        onCheckedChange={() => handlePublicTrackingChange('showSummary')}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="show-payment" className="cursor-pointer">
                          Thông tin thanh toán
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Hiển thị chi tiết thanh toán, phiếu thu/chi liên quan
                        </p>
                      </div>
                      <Switch
                        id="show-payment"
                        checked={publicTracking.showPayment !== false}
                        onCheckedChange={() => handlePublicTrackingChange('showPayment')}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="show-received-images" className="cursor-pointer">
                          Hình ảnh lúc nhận hàng
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Hiển thị ảnh sản phẩm khi tiếp nhận bảo hành
                        </p>
                      </div>
                      <Switch
                        id="show-received-images"
                        checked={publicTracking.showReceivedImages !== false}
                        onCheckedChange={() => handlePublicTrackingChange('showReceivedImages')}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="show-processed-images" className="cursor-pointer">
                          Hình ảnh sau xử lý
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Hiển thị ảnh sản phẩm sau khi xử lý bảo hành
                        </p>
                      </div>
                      <Switch
                        id="show-processed-images"
                        checked={publicTracking.showProcessedImages !== false}
                        onCheckedChange={() => handlePublicTrackingChange('showProcessedImages')}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="show-history" className="cursor-pointer">
                          Lịch sử thao tác
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Hiển thị chi tiết từng thao tác xử lý bảo hành
                        </p>
                      </div>
                      <Switch
                        id="show-history"
                        checked={publicTracking.showHistory !== false}
                        onCheckedChange={() => handlePublicTrackingChange('showHistory')}
                      />
                    </div>
                  </div>
                </SettingsFormSection>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================ */}
        {/* TAB 5: CARD COLORS */}
        {/* ============================================ */}
        <TabsContent value="card-colors" className="mt-0 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Màu sắc card bảo hành (Kanban View)</CardTitle>
              <CardDescription>
                Tùy chỉnh màu nền và viền card theo trạng thái bảo hành trong chế độ Kanban
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SettingsFormSection
                title="Kiểu màu hiển thị"
                description="Ưu tiên: quá hạn → trạng thái → màu mặc định."
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enable-overdue">Màu quá hạn SLA</Label>
                      <p className="text-sm text-muted-foreground">
                        Override tất cả màu khác khi phiếu quá hạn
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
                        Hiển thị màu dựa trên tiến trình xử lý
                      </p>
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
                  description="Áp dụng ngay khi phiếu vượt SLA, bỏ qua các thiết lập khác."
                  className="bg-red-50/50 dark:bg-red-950/20"
                >
                  <TailwindColorPicker
                    value={cardColors.overdueColor}
                    onChange={(value) => handleCardColorChange('overdueColor', '', value)}
                    label="Màu nền và viền"
                    placeholder="Ví dụ: bg-red-50 border-red-400"
                  />
                </SettingsFormSection>
              )}

              {cardColors.enableStatusColors && (
                <SettingsFormSection
                  title="Màu theo trạng thái"
                  description="Sử dụng dải màu trực quan để phân biệt tiến độ bảo hành."
                >
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
                </SettingsFormSection>
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
            </CardContent>
          </Card>
        </TabsContent>
        </SettingsVerticalTabs>

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
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Xác nhận xóa mẫu phản hồi"
        description={`Bạn có chắc chắn muốn xóa mẫu "${templates.find(t => t.id === templateToDelete)?.name || ''}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa mẫu"
        cancelText="Hủy"
        variant="destructive"
        onConfirm={confirmDeleteTemplate}
      />

    </div>
  );
}
