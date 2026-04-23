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
import { SettingsActionButton } from '../../../components/settings/SettingsActionButton';
import { SettingsVerticalTabs } from '../../../components/settings/SettingsVerticalTabs';
import { SettingsHistoryContent } from '../../../components/settings/SettingsHistoryContent';
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
  MoreHorizontal,
  Plus,
  Save,
  Loader2,
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
import { generateSubEntityId } from '@/lib/id-utils';
import { useDirtyState } from '@/hooks/use-dirty-state';
import { useSettingsPageHeader } from '../use-settings-page-header';
import { useTabActionRegistry } from '../use-tab-action-registry';

// Import types and constants from extracted files
import {
  type CardColorSettings,
  type SLASettings,
  type ResponseTemplate,
  type PublicTrackingSettings,
  type ComplaintType,
  SLA_PRIORITY_CONFIGS,
  validateTailwindClasses,
  clone,
  defaultSLA,
  defaultTemplates,
  defaultPublicTracking,
  defaultCardColors,
  defaultComplaintTypes,
} from './types';

// Re-export for backward compatibility
export type { CardColorSettings, ComplaintType };

// ============================================
// MAIN COMPONENT
// ============================================

import { useComplaintsSettings, useComplaintsSettingsMutations } from './hooks/use-complaints-settings';

export function ComplaintsSettingsPage() {
  const [activeTab, setActiveTab] = React.useState('sla');
  const { headerActions, setHeaderActions } = useTabActionRegistry(activeTab);

  // Fetch settings from React Query
  const { data: settings } = useComplaintsSettings();
  const { updateSection } = useComplaintsSettingsMutations();

  // Get stored values from React Query
  const storedSla = settings.sla;
  const storedTemplates = settings.templates as ResponseTemplate[];
  const storedPublicTracking = settings.publicTracking;
  const storedCardColors = settings.cardColors;
  const storedComplaintTypes = settings.complaintTypes;

  // SLA State
  const [sla, setSLA] = React.useState<SLASettings>(storedSla);

  // Templates State
  const [templates, setTemplates] = React.useState<ResponseTemplate[]>(storedTemplates);
  const [editingTemplate, setEditingTemplate] = React.useState<ResponseTemplate | null>(null);
  const [isAddingTemplate, setIsAddingTemplate] = React.useState(false);

  // Public Tracking State
  const [publicTracking, setPublicTracking] = React.useState<PublicTrackingSettings>(storedPublicTracking);

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
    setPublicTracking(storedPublicTracking);
  }, [storedPublicTracking]);

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
    // Validation for each priority level - ✅ Match Prisma ComplaintPriority enum
    const priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;
    const errors: string[] = [];

    priorities.forEach(priority => {
      const settings = sla[priority];
      const priorityLabel = {
        LOW: 'Thấp',
        MEDIUM: 'Trung bình',
        HIGH: 'Cao',
        CRITICAL: 'Khẩn cấp'
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

    updateSection.mutate({ type: 'sla', data: sla }, {
      onSuccess: () => {
        toast.success('Đã lưu cài đặt SLA', {
          description: 'Thời gian phản hồi và giải quyết đã được cập nhật thành công.',
        });
      },
    });
  };

  const _handleResetSLA = () => {
    const nextDefaults = clone(defaultSLA);
    setSLA(nextDefaults);
    updateSection.mutate({ type: 'sla', data: nextDefaults });
    toast.info('Đã khôi phục cài đặt mặc định', {
      description: 'Cài đặt SLA đã được reset về giá trị mặc định của hệ thống.',
    });
  };

  // ============================================
  // TEMPLATE HANDLERS
  // ============================================

  const handleAddTemplate = () => {
    setEditingTemplate({
      id: generateSubEntityId('complaint-setting'),
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
    updateSection.mutate({ type: 'templates', data: updatedTemplates }, {
      onSuccess: () => {
        toast.success(isAddingTemplate ? 'Đã thêm mẫu' : 'Đã cập nhật mẫu', {
          description: `Mẫu "${editingTemplate.name}" đã được lưu thành công.`,
        });
      },
    });

    setEditingTemplate(null);
    setIsAddingTemplate(false);
    setTemplateDialogOpen(false);
  };

  const handleConfirmDeleteTemplate = () => {
    if (!deleteTemplateId) return;
    const updatedTemplates = templates.filter(t => t.id !== deleteTemplateId);
    setTemplates(updatedTemplates);
    updateSection.mutate({ type: 'templates', data: updatedTemplates }, {
      onSuccess: () => {
        toast.success('Đã xóa mẫu', {
          description: 'Mẫu phản hồi đã được xóa thành công.',
        });
      },
    });
    setDeleteTemplateId(null);
  };

  const _handleResetTemplates = () => {
    const defaults = clone(defaultTemplates);
    setTemplates(defaults);
    updateSection.mutate({ type: 'templates', data: defaults });
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
  // PUBLIC TRACKING HANDLERS
  // ============================================

  const handlePublicTrackingChange = (key: keyof PublicTrackingSettings) => {
    setPublicTracking(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSavePublicTracking = async () => {
    updateSection.mutate({ type: 'tracking', data: publicTracking }, {
      onSuccess: () => {
        toast.success('Đã lưu cài đặt tracking công khai', {
          description: 'Các tùy chọn liên kết công khai đã được cập nhật thành công.',
        });
      },
    });
  };

  const _handleResetPublicTracking = () => {
    const defaults = clone(defaultPublicTracking);
    setPublicTracking(defaults);
    updateSection.mutate({ type: 'tracking', data: defaults });
    toast.info('Đã khôi phục cài đặt mặc định', {
      description: 'Cài đặt tracking công khai đã được reset về giá trị mặc định của hệ thống.',
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
      // ✅ Match Prisma ComplaintPriority enum
      const priorities = [
        { key: 'LOW', label: 'Thấp' },
        { key: 'MEDIUM', label: 'Trung bình' },
        { key: 'HIGH', label: 'Cao' },
        { key: 'CRITICAL', label: 'Khẩn cấp' },
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

    updateSection.mutate({ type: 'cardColors', data: cardColors }, {
      onSuccess: () => {
        toast.success('Đã lưu cài đặt màu card', {
          description: 'Màu sắc hiển thị card đã được cập nhật thành công.',
        });
      },
    });
  };

  const _handleResetCardColors = () => {
    const defaults = clone(defaultCardColors);
    setCardColors(defaults);
    updateSection.mutate({ type: 'cardColors', data: defaults });
    toast.info('Đã khôi phục cài đặt mặc định', {
      description: 'Màu card đã được reset về giá trị mặc định của hệ thống.',
    });
  };

  // ============================================
  // COMPLAINT TYPES HANDLERS
  // ============================================

  const handleAddType = () => {
    const newType: ComplaintType = {
      id: generateSubEntityId('complaint-setting'),
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
    updateSection.mutate({ type: 'complaintTypes', data: nextTypes }, {
      onSuccess: () => {
        toast.success(isAddingType ? 'Đã thêm loại khiếu nại mới' : 'Đã cập nhật loại khiếu nại');
      },
    });

    setEditingType(null);
    setIsAddingType(false);
    setTypeDialogOpen(false);
  };

  const handleConfirmDeleteType = () => {
    if (!deleteTypeId) return;
    const updated = complaintTypes.filter(t => t.id !== deleteTypeId);
    setComplaintTypes(updated);
    updateSection.mutate({ type: 'complaintTypes', data: updated }, {
      onSuccess: () => {
        toast.success('Đã xóa loại khiếu nại');
      },
    });
    setDeleteTypeId(null);
  };

  const handleToggleTypeActive = (id: string) => {
    const updated = complaintTypes.map(t =>
      t.id === id ? { ...t, isActive: !t.isActive } : t
    );
    setComplaintTypes(updated);
    updateSection.mutate({ type: 'complaintTypes', data: updated }, {
      onSuccess: () => {
        toast.success('Đã cập nhật trạng thái');
      },
    });
  };

  const _handleResetTypes = () => {
    const defaults = clone(defaultComplaintTypes);
    setComplaintTypes(defaults);
    updateSection.mutate({ type: 'complaintTypes', data: defaults });
    toast.info('Đã khôi phục cài đặt mặc định');
  };

  // ============================================
  // RENDER
  // ============================================

  // ✅ Use refs to avoid stale closures in header action buttons
  // Handlers capture current state on every render; refs always point to latest version
  const handlersRef = React.useRef({
    saveSLA: handleSaveSLA,
    addType: handleAddType,
    saveCardColors: handleSaveCardColors,
    addTemplate: handleAddTemplate,
    savePublicTracking: handleSavePublicTracking,
  });
  handlersRef.current = {
    saveSLA: handleSaveSLA,
    addType: handleAddType,
    saveCardColors: handleSaveCardColors,
    addTemplate: handleAddTemplate,
    savePublicTracking: handleSavePublicTracking,
  };

  const isSLADirty = useDirtyState(storedSla, sla);
  const isCardColorsDirty = useDirtyState(storedCardColors, cardColors);
  const isPublicTrackingDirty = useDirtyState(storedPublicTracking, publicTracking);
  const isSaving = updateSection.isPending;

  React.useEffect(() => {
    switch (activeTab) {
      case 'sla':
        setHeaderActions([
          <SettingsActionButton key="save-sla" onClick={() => handlersRef.current.saveSLA()} disabled={!isSLADirty || isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Lưu cài đặt
          </SettingsActionButton>,
        ]);
        break;
      case 'complaint-types':
        setHeaderActions([
          <SettingsActionButton key="add-type" onClick={() => handlersRef.current.addType()}>
            <Plus className="h-4 w-4" /> Thêm loại mới
          </SettingsActionButton>,
        ]);
        break;
      case 'card-colors':
        setHeaderActions([
          <SettingsActionButton key="save-card-colors" onClick={() => handlersRef.current.saveCardColors()} disabled={!isCardColorsDirty || isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Lưu cài đặt
          </SettingsActionButton>,
        ]);
        break;
      case 'templates':
        setHeaderActions([
          <SettingsActionButton key="add-template" onClick={() => handlersRef.current.addTemplate()}>
            <Plus className="h-4 w-4" /> Thêm mẫu
          </SettingsActionButton>,
        ]);
        break;
      case 'public-tracking':
        setHeaderActions([
          <SettingsActionButton key="save-tracking" onClick={() => handlersRef.current.savePublicTracking()} disabled={!isPublicTrackingDirty || isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Lưu cài đặt
          </SettingsActionButton>,
        ]);
        break;
    }
  }, [activeTab, setHeaderActions, isSLADirty, isCardColorsDirty, isPublicTrackingDirty, isSaving]);

  const tabs = React.useMemo(
    () => [
      { value: 'sla', label: 'SLA' },
      { value: 'complaint-types', label: 'Loại KN' },
      { value: 'card-colors', label: 'Màu card' },
      { value: 'templates', label: 'Mẫu phản hồi' },
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
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">STT</TableHead>
                      <TableHead>Tên loại</TableHead>
                      <TableHead>Mô tả</TableHead>
                      <TableHead className="w-25">Trạng thái</TableHead>
                      <TableHead className="w-20 text-right">Thao tác</TableHead>
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
                                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Thao tác">
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
                <Button onClick={handleSaveType} disabled={updateSection.isPending}>
                  {updateSection.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
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
                      value={cardColors.priorityColors.LOW}
                      onChange={(value) => handlePriorityColorChange('LOW', value)}
                      label="Ưu tiên thấp"
                      placeholder="Ví dụ: bg-slate-50 border-slate-200"
                    />

                    <TailwindColorPicker
                      value={cardColors.priorityColors.MEDIUM}
                      onChange={(value) => handlePriorityColorChange('MEDIUM', value)}
                      label="Ưu tiên trung bình"
                      placeholder="Ví dụ: bg-amber-50 border-amber-200"
                    />

                    <TailwindColorPicker
                      value={cardColors.priorityColors.HIGH}
                      onChange={(value) => handlePriorityColorChange('HIGH', value)}
                      label="Ưu tiên cao"
                      placeholder="Ví dụ: bg-orange-50 border-orange-300"
                    />

                    <TailwindColorPicker
                      value={cardColors.priorityColors.CRITICAL}
                      onChange={(value) => handlePriorityColorChange('CRITICAL', value)}
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
                      placeholder="Ví dụ: bg-muted border-border"
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
                <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên mẫu</TableHead>
                      <TableHead>Danh mục</TableHead>
                      <TableHead className="w-20 text-right">Thao tác</TableHead>
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
                </div>
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
                <Button onClick={handleSaveTemplate} disabled={updateSection.isPending}>
                  {updateSection.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
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

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label htmlFor="show-order-info" className="cursor-pointer">
                            Hiển thị thông tin đơn hàng
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Hiển thị chi tiết đơn hàng liên quan (mã đơn, địa chỉ, ngày bán...)
                          </p>
                        </div>
                        <Switch
                          id="show-order-info"
                          checked={publicTracking.showOrderInfo ?? true}
                          onCheckedChange={() => handlePublicTrackingChange('showOrderInfo')}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label htmlFor="show-products" className="cursor-pointer">
                            Hiển thị sản phẩm bị ảnh hưởng
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Hiển thị danh sách sản phẩm và chi tiết thiếu/hỏng/thừa
                          </p>
                        </div>
                        <Switch
                          id="show-products"
                          checked={publicTracking.showProducts ?? true}
                          onCheckedChange={() => handlePublicTrackingChange('showProducts')}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label htmlFor="show-images" className="cursor-pointer">
                            Hiển thị hình ảnh
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Hiển thị hình ảnh từ khách hàng và nhân viên kiểm tra
                          </p>
                        </div>
                        <Switch
                          id="show-images"
                          checked={publicTracking.showImages ?? true}
                          onCheckedChange={() => handlePublicTrackingChange('showImages')}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label htmlFor="show-resolution" className="cursor-pointer">
                            Hiển thị kết quả giải quyết
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Hiển thị ghi chú giải quyết và phương án xử lý
                          </p>
                        </div>
                        <Switch
                          id="show-resolution"
                          checked={publicTracking.showResolution ?? true}
                          onCheckedChange={() => handlePublicTrackingChange('showResolution')}
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

        <div className="mt-6">
          <SettingsHistoryContent entityTypes={['complaint_settings', 'complaint_type']} />
        </div>
      </div>
  );
}
