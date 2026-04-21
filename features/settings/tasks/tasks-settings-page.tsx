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
import { TipTapEditor } from '../../../components/ui/tiptap-editor';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../components/ui/alert-dialog';
import { 
  Plus,
  Save,
  MoreHorizontal,
  Loader2,
} from 'lucide-react';
import { SimpleSettingsTable } from '../../../components/settings/SimpleSettingsTable';
import type { ColumnDef } from '../../../components/data-table/types';
import { toast } from 'sonner';
import { generateSubEntityId } from '@/lib/id-utils';
import { useDirtyState } from '@/hooks/use-dirty-state';
import { useSettingsPageHeader } from '../use-settings-page-header';
import type { TaskPriority } from '../../tasks/types';
import { SettingsActionButton } from '../../../components/settings/SettingsActionButton';
import { SettingsVerticalTabs } from '../../../components/settings/SettingsVerticalTabs';
import { SettingsHistoryContent } from '../../../components/settings/SettingsHistoryContent';
import { useTabActionRegistry } from '../use-tab-action-registry';

// Import from extracted files
import {
  type CardColorSettings,
  type SLASettings,
  type TaskTemplate,
  type EvidenceSettings,
  type TaskType,
  type StatusColorKey,
  type PriorityColorKey,
  defaultSLA,
  defaultCardColors,
  defaultEvidence,
  defaultTaskTypes,
  defaultTemplates,
  TASK_PRIORITY_CONFIGS,
  STATUS_COLOR_CONFIGS,
  PRIORITY_COLOR_CONFIGS,
  clone,
} from './types';
import { useTasksSettings, useTasksSettingsMutations } from './hooks/use-tasks-settings';

// Re-export types for backward compatibility
export type { CardColorSettings, TaskTemplate, EvidenceSettings, TaskType } from './types';

// ============================================
// MAIN COMPONENT
// ============================================

export function TasksSettingsPage() {
  // Fetch settings from React Query
  const { data: settings } = useTasksSettings();
  const { updateSection } = useTasksSettingsMutations();

  // Get stored values from React Query
  const storedSla = settings.sla;
  const storedTemplates = settings.templates;
  const storedCardColors = settings.cardColors;
  const storedTaskTypes = settings.taskTypes;
  const storedEvidence = settings.evidence;

  // States
  const [sla, setSLA] = React.useState<SLASettings>(storedSla);

  const [templates, setTemplates] = React.useState<TaskTemplate[]>(storedTemplates);
  const [editingTemplate, setEditingTemplate] = React.useState<TaskTemplate | null>(null);
  const [isAddingTemplate, setIsAddingTemplate] = React.useState(false);

  const [cardColors, setCardColors] = React.useState<CardColorSettings>(storedCardColors);

  const [taskTypes, setTaskTypes] = React.useState<TaskType[]>(storedTaskTypes);
  const [editingType, setEditingType] = React.useState<TaskType | null>(null);
  const [isAddingType, setIsAddingType] = React.useState(false);
  const [deleteTypeId, setDeleteTypeId] = React.useState<string | null>(null);
  const [deleteTemplateId, setDeleteTemplateId] = React.useState<string | null>(null);
  
  // Selection states for bulk actions
  const [typeRowSelection, setTypeRowSelection] = React.useState<Record<string, boolean>>({});
  const [templateRowSelection, setTemplateRowSelection] = React.useState<Record<string, boolean>>({});

  const [evidence, setEvidence] = React.useState<EvidenceSettings>(storedEvidence);

  const [activeTab, setActiveTab] = React.useState('sla');
  const { headerActions, setHeaderActions } = useTabActionRegistry(activeTab);

  React.useEffect(() => {
    setSLA(storedSla);
  }, [storedSla]);

  React.useEffect(() => {
    setTemplates(storedTemplates);
  }, [storedTemplates]);

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

  // (register* memos removed — using direct setHeaderActions with handlersRef)

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

    updateSection.mutate({ type: 'sla', data: sla }, {
      onSuccess: () => toast.success('Đã lưu cài đặt SLA'),
    });
  };

  const _handleResetSLA = () => {
    const defaults = clone(defaultSLA);
    setSLA(defaults);
    updateSection.mutate({ type: 'sla', data: defaults }, {
      onSuccess: () => toast.info('Đã khôi phục cài đặt mặc định'),
    });
  };

  // (SLA useEffect moved to single handlersRef effect below)

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

    updateSection.mutate({ type: 'evidence', data: evidence }, {
      onSuccess: () => toast.success('Đã lưu cài đặt bằng chứng'),
    });
  };

  const _handleResetEvidence = () => {
    const defaults = clone(defaultEvidence);
    setEvidence(defaults);
    updateSection.mutate({ type: 'evidence', data: defaults }, {
      onSuccess: () => toast.info('Đã khôi phục cài đặt mặc định'),
    });
  };

  // (Evidence useEffect moved to single handlersRef effect below)

  // ============================================
  // TASK TYPES HANDLERS
  // ============================================

  const handleAddType = () => {
    const newType: TaskType = {
      id: generateSubEntityId('ID'),
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
    updateSection.mutate({ type: 'taskTypes', data: updatedTypes }, {
      onSuccess: () => toast.success(isAddingType ? 'Đã thêm loại công việc' : 'Đã cập nhật loại công việc'),
    });
    setEditingType(null);
    setIsAddingType(false);
  };

  const handleDeleteType = (id: string) => {
    const updated = taskTypes.filter(t => t.id !== id);
    setTaskTypes(updated);
    updateSection.mutate({ type: 'taskTypes', data: updated }, {
      onSuccess: () => {
        toast.success('Đã xóa loại công việc');
        setDeleteTypeId(null);
      },
    });
  };

  const handleBulkDeleteTypes = (selectedItems: (TaskType & { systemId: string })[]) => {
    const idsToDelete = new Set(selectedItems.map(item => item.id));
    const updated = taskTypes.filter(t => !idsToDelete.has(t.id));
    setTaskTypes(updated);
    updateSection.mutate({ type: 'taskTypes', data: updated }, {
      onSuccess: () => {
        toast.success(`Đã xóa ${selectedItems.length} loại công việc`);
        setTypeRowSelection({});
      },
    });
  };

  const handleToggleTypeActive = (id: string) => {
    const updated = taskTypes.map(t =>
      t.id === id ? { ...t, isActive: !t.isActive } : t
    );
    setTaskTypes(updated);
    updateSection.mutate({ type: 'taskTypes', data: updated }, {
      onSuccess: () => toast.success('Đã cập nhật trạng thái'),
    });
  };

  const _handleResetTypes = () => {
    const defaults = clone(defaultTaskTypes);
    setTaskTypes(defaults);
    updateSection.mutate({ type: 'taskTypes', data: defaults }, {
      onSuccess: () => toast.info('Đã khôi phục cài đặt mặc định'),
    });
  };

  // (Task types useEffect moved to single handlersRef effect below)

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
    updateSection.mutate({ type: 'cardColors', data: cardColors }, {
      onSuccess: () => toast.success('Đã lưu cài đặt màu card'),
    });
  };

  const _handleResetCardColors = () => {
    const defaults = clone(defaultCardColors);
    setCardColors(defaults);
    updateSection.mutate({ type: 'cardColors', data: defaults }, {
      onSuccess: () => toast.info('Đã khôi phục cài đặt mặc định'),
    });
  };

  // (Card colors useEffect moved to single handlersRef effect below)

  // ============================================
  // TEMPLATE HANDLERS
  // ============================================

  const handleAddTemplate = () => {
    setEditingTemplate({
      id: generateSubEntityId('ID'),
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
    updateSection.mutate({ type: 'templates', data: updatedTemplates }, {
      onSuccess: () => {
        toast.success(isAddingTemplate ? 'Đã thêm mẫu' : 'Đã cập nhật mẫu');
        setEditingTemplate(null);
        setIsAddingTemplate(false);
      },
    });
  };

  const handleDeleteTemplate = (id: string) => {
    const updatedTemplates = templates.filter(t => t.id !== id);
    setTemplates(updatedTemplates);
    updateSection.mutate({ type: 'templates', data: updatedTemplates }, {
      onSuccess: () => {
        toast.success('Đã xóa mẫu');
        setDeleteTemplateId(null);
      },
    });
  };

  const handleBulkDeleteTemplates = (selectedItems: (TaskTemplate & { systemId: string })[]) => {
    const idsToDelete = new Set(selectedItems.map(item => item.id));
    const updatedTemplates = templates.filter(t => !idsToDelete.has(t.id));
    setTemplates(updatedTemplates);
    updateSection.mutate({ type: 'templates', data: updatedTemplates }, {
      onSuccess: () => {
        toast.success(`Đã xóa ${selectedItems.length} mẫu`);
        setTemplateRowSelection({});
      },
    });
  };

  const _handleResetTemplates = () => {
    const defaults = clone(defaultTemplates);
    setTemplates(defaults);
    updateSection.mutate({ type: 'templates', data: defaults }, {
      onSuccess: () => toast.info('Đã khôi phục mẫu mặc định'),
    });
  };

  // ============================================
  // COLUMN DEFINITIONS FOR SIMPLE SETTINGS TABLE
  // ============================================
  
  // Prepare data with systemId for SimpleSettingsTable
  const taskTypesWithSystemId = React.useMemo(() => 
    taskTypes.map(t => ({ ...t, systemId: t.id })), 
    [taskTypes]
  );

  const templatesWithSystemId = React.useMemo(() => 
    templates.map(t => ({ ...t, systemId: t.id })), 
    [templates]
  );

  // Task Types columns
  const taskTypeColumns: ColumnDef<TaskType & { systemId: string }>[] = React.useMemo(() => [
    {
      id: 'name',
      header: 'Tên loại',
      cell: ({ row }) => <span className="font-medium">{row.name}</span>,
    },
    {
      id: 'description',
      header: 'Mô tả',
      cell: ({ row }) => <span className="text-muted-foreground">{row.description}</span>,
    },
    {
      id: 'isActive',
      header: 'Trạng thái',
      cell: ({ row }) => (
        <Switch
          checked={row.isActive}
          onCheckedChange={() => handleToggleTypeActive(row.id)}
        />
      ),
    },
    {
      id: 'actions',
      header: 'Thao tác',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Thao tác">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => { setEditingType(row); setIsAddingType(false); }}>
              Sửa
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTypeId(row.id)}>
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [taskTypes]);

  // Templates columns  
  const templateColumns: ColumnDef<TaskTemplate & { systemId: string }>[] = React.useMemo(() => [
    {
      id: 'name',
      header: 'Tên mẫu',
      cell: ({ row }) => <span className="font-medium">{row.name}</span>,
    },
    {
      id: 'category',
      header: 'Danh mục',
      cell: ({ row }) => (
        <span className="text-xs px-2 py-1 rounded-md bg-muted">
          {row.category === 'development' && 'Phát triển'}
          {row.category === 'design' && 'Thiết kế'}
          {row.category === 'marketing' && 'Marketing'}
          {row.category === 'admin' && 'Quản trị'}
          {row.category === 'general' && 'Chung'}
        </span>
      ),
    },
    {
      id: 'estimatedHours',
      header: 'Ước tính (giờ)',
      cell: ({ row }) => <span>{row.estimatedHours}h</span>,
    },
    {
      id: 'actions',
      header: 'Thao tác',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Thao tác">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => { setEditingTemplate(row); setIsAddingTemplate(false); }}>
              Sửa
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTemplateId(row.id)}>
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [templates]);

  // (Templates useEffect moved to single handlersRef effect below)

  // ✅ Stable handler refs — prevents stale closures in header action buttons
  const handlersRef = React.useRef({
    saveSLA: handleSaveSLA,
    saveEvidence: handleSaveEvidence,
    addType: handleAddType,
    saveCardColors: handleSaveCardColors,
    addTemplate: handleAddTemplate,
  });
  handlersRef.current = {
    saveSLA: handleSaveSLA,
    saveEvidence: handleSaveEvidence,
    addType: handleAddType,
    saveCardColors: handleSaveCardColors,
    addTemplate: handleAddTemplate,
  };

  const isSLADirty = useDirtyState(storedSla, sla);
  const isEvidenceDirty = useDirtyState(storedEvidence, evidence);
  const isCardColorsDirty = useDirtyState(storedCardColors, cardColors);
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
      case 'evidence':
        setHeaderActions([
          <SettingsActionButton key="save-evidence" onClick={() => handlersRef.current.saveEvidence()} disabled={!isEvidenceDirty || isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Lưu cài đặt
          </SettingsActionButton>,
        ]);
        break;
      case 'task-types':
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
    }
  }, [activeTab, setHeaderActions, isSLADirty, isEvidenceDirty, isCardColorsDirty, isSaving]);

  const tabs = React.useMemo(
    () => [
      { value: 'sla', label: 'SLA' },
      { value: 'task-types', label: 'Loại CV' },
      { value: 'evidence', label: 'Bằng chứng' },
      { value: 'card-colors', label: 'Màu card' },
      { value: 'templates', label: 'Mẫu CV' },
    ],
    [],
  );

  // ============================================
  // RENDER
  // ============================================

  return (
    <>
    <SettingsVerticalTabs value={activeTab} onValueChange={setActiveTab} tabs={tabs}>
      {/* TAB 1: SLA SETTINGS */}
      <TabsContent value="sla" className="mt-0 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle size="lg">Cài đặt SLA (Service Level Agreement)</CardTitle>
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
                        value={sla[key]?.responseTime ?? 0}
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
                        value={sla[key]?.completeTime ?? 0}
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
              <CardTitle size="lg">Loại công việc</CardTitle>
              <CardDescription>
                Quản lý các loại công việc để phân loại và lọc task dễ dàng hơn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleSettingsTable
                data={taskTypesWithSystemId}
                columns={taskTypeColumns}
                emptyTitle="Chưa có loại công việc nào"
                emptyDescription="Nhấn nút 'Thêm loại mới' để tạo loại công việc."
                enableSelection
                rowSelection={typeRowSelection}
                setRowSelection={setTypeRowSelection}
                onBulkDelete={handleBulkDeleteTypes}
                enablePagination
                pagination={{ pageSize: 10, pageSizeOptions: [10, 20, 50] }}
              />
            </CardContent>
          </Card>

      {/* Dialog chỉnh sửa loại công việc */}
      <Dialog open={!!editingType} onOpenChange={(open) => {
        if (!open) {
          setEditingType(null);
          setIsAddingType(false);
        }
      }}>
        <DialogContent className="sm:max-w-125">
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
            <Button onClick={handleSaveType} disabled={updateSection.isPending}>
              {updateSection.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
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
              <CardTitle size="lg">Cài đặt bằng chứng hoàn thành</CardTitle>
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
              <CardTitle size="lg">Màu sắc card công việc</CardTitle>
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
                          value={cardColors.statusColors[key] || ''}
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
                          value={cardColors.priorityColors[key] || ''}
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
                <CardTitle size="lg">Mẫu công việc</CardTitle>
                <CardDescription>
                  Tạo và quản lý các mẫu công việc để tạo task nhanh hơn
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <SimpleSettingsTable
                data={templatesWithSystemId}
                columns={templateColumns}
                emptyTitle="Chưa có mẫu nào"
                emptyDescription="Nhấn nút 'Thêm mẫu' để tạo mẫu công việc mới."
                enableSelection
                rowSelection={templateRowSelection}
                setRowSelection={setTemplateRowSelection}
                onBulkDelete={handleBulkDeleteTemplates}
                enablePagination
                pagination={{ pageSize: 10, pageSizeOptions: [10, 20, 50] }}
              />
            </CardContent>
          </Card>

      {/* Dialog chỉnh sửa mẫu công việc */}
      <Dialog open={!!editingTemplate} onOpenChange={(open) => {
        if (!open) {
          setEditingTemplate(null);
          setIsAddingTemplate(false);
        }
      }}>
        <DialogContent className="sm:max-w-150">
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
            <Button onClick={handleSaveTemplate} disabled={updateSection.isPending}>
              {updateSection.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
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
    </SettingsVerticalTabs>

    <div className="mt-6">
      <SettingsHistoryContent entityTypes={['task_settings']} />
    </div>
    </>
  );
}
