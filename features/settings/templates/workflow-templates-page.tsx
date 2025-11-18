/**
 * Workflow Templates Settings Page - REDESIGNED
 * 
 * Quản lý templates quy trình xử lý cho các chức năng
 * - Full CRUD: Create, Read, Update, Delete templates
 * - Mỗi chức năng (workflow) có 1 template duy nhất
 * - UI: List view + Full-screen Dialog editor
 */

import * as React from 'react';
import { usePageHeader } from '../../../contexts/page-header-context.tsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card.tsx';
import { Button } from '../../../components/ui/button.tsx';
import { SubtaskList, type Subtask } from '../../../components/shared/subtask-list.tsx';
import { toast } from 'sonner';
import { nanoid } from 'nanoid';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Package, 
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select.tsx';
import { Input } from '../../../components/ui/input.tsx';
import { Label } from '../../../components/ui/label.tsx';
import { Textarea } from '../../../components/ui/textarea.tsx';
import { Badge } from '../../../components/ui/badge.tsx';
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
import { Separator } from '../../../components/ui/separator.tsx';

// ============================================================================
// Types & Constants
// ============================================================================

interface WorkflowTemplate {
  id: string;
  name: string; // 'complaints', 'warranty' - unique key, immutable
  label: string; // Display name
  description: string;
  subtasks: Subtask[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Available workflow types
const WORKFLOW_TYPES = [
  { 
    value: 'complaints', 
    label: 'Khiếu nại',
    icon: '📋',
    statusOptions: [
      { value: 'pending', label: 'Chờ xử lý' },
      { value: 'investigating', label: 'Đang kiểm tra' },
      { value: 'resolved', label: 'Đã giải quyết' },
      { value: 'rejected', label: 'Từ chối' },
    ]
  },
  { 
    value: 'warranty', 
    label: 'Bảo hành',
    icon: '🔧',
    statusOptions: [
      { value: 'new', label: 'Mới' },
      { value: 'pending', label: 'Chưa xử lý' },
      { value: 'processed', label: 'Đã xử lý' },
      { value: 'returned', label: 'Đã trả' },
    ]
  },
] as const;

const STORAGE_KEY = 'workflow_templates_v2';

// ============================================================================
// Storage Functions
// ============================================================================

function getDefaultTemplates(): WorkflowTemplate[] {
  const now = new Date();
  return [
    {
      id: nanoid(),
      name: 'warranty',
      label: 'Quy trình Bảo hành',
      description: 'Các bước xử lý phiếu bảo hành',
      isDefault: true,
      createdAt: now,
      updatedAt: now,
      subtasks: [
        {
          id: nanoid(),
          title: 'Kiểm tra sản phẩm và tình trạng',
          completed: false,
          order: 0,
          createdAt: now,
        },
        {
          id: nanoid(),
          title: 'Chụp ảnh sản phẩm trước khi xử lý',
          completed: false,
          order: 1,
          createdAt: now,
        },
        {
          id: nanoid(),
          title: 'Liên hệ khách hàng xác nhận phương án xử lý',
          completed: false,
          order: 2,
          createdAt: now,
        },
        {
          id: nanoid(),
          title: 'Thực hiện sửa chữa/thay thế sản phẩm',
          completed: false,
          order: 3,
          createdAt: now,
        },
        {
          id: nanoid(),
          title: 'Chụp ảnh sản phẩm sau khi xử lý',
          completed: false,
          order: 4,
          createdAt: now,
        },
        {
          id: nanoid(),
          title: 'Đóng gói và chuẩn bị giao hàng',
          completed: false,
          order: 5,
          createdAt: now,
        },
        {
          id: nanoid(),
          title: 'Tạo đơn hàng trả khách và gắn mã vận đơn',
          completed: false,
          order: 6,
          createdAt: now,
        },
      ],
    },
    {
      id: nanoid(),
      name: 'complaints',
      label: 'Quy trình Khiếu nại',
      description: 'Các bước xử lý khiếu nại',
      isDefault: true,
      createdAt: now,
      updatedAt: now,
      subtasks: [
        {
          id: nanoid(),
          title: 'Tiếp nhận và phân loại khiếu nại',
          completed: false,
          order: 0,
          createdAt: now,
        },
        {
          id: nanoid(),
          title: 'Kiểm tra thông tin đơn hàng và sản phẩm',
          completed: false,
          order: 1,
          createdAt: now,
        },
        {
          id: nanoid(),
          title: 'Liên hệ xác minh với khách hàng',
          completed: false,
          order: 2,
          createdAt: now,
        },
        {
          id: nanoid(),
          title: 'Thu thập bằng chứng (ảnh, video)',
          completed: false,
          order: 3,
          createdAt: now,
        },
        {
          id: nanoid(),
          title: 'Đề xuất phương án giải quyết',
          completed: false,
          order: 4,
          createdAt: now,
        },
        {
          id: nanoid(),
          title: 'Thực hiện xử lý (hoàn tiền/đổi hàng/bồi thường)',
          completed: false,
          order: 5,
          createdAt: now,
        },
        {
          id: nanoid(),
          title: 'Xác nhận khách hàng đồng ý phương án',
          completed: false,
          order: 6,
          createdAt: now,
        },
        {
          id: nanoid(),
          title: 'Hoàn tất và đóng khiếu nại',
          completed: false,
          order: 7,
          createdAt: now,
        },
      ],
    },
  ];
}

function getTemplatesFromStorage(): WorkflowTemplate[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Parse dates
      return parsed.map((t: any) => ({
        ...t,
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt),
        subtasks: t.subtasks.map((s: any) => ({
          ...s,
          createdAt: new Date(s.createdAt),
          completedAt: s.completedAt ? new Date(s.completedAt) : undefined,
        })),
      }));
    }
  } catch (error) {
    console.error('Failed to load templates:', error);
  }
  
  return getDefaultTemplates();
}

function saveTemplatesToStorage(templates: WorkflowTemplate[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  } catch (error) {
    console.error('Failed to save templates:', error);
    throw error;
  }
}

// ============================================================================
// Main Component
// ============================================================================

export function WorkflowTemplatesPage() {
  const { setPageHeader } = usePageHeader();
  const [templates, setTemplates] = React.useState<WorkflowTemplate[]>(() => getTemplatesFromStorage());
  
  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [editingTemplate, setEditingTemplate] = React.useState<WorkflowTemplate | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<WorkflowTemplate | null>(null);
  
  // Form states
  const [formName, setFormName] = React.useState('');
  const [formLabel, setFormLabel] = React.useState('');
  const [formDescription, setFormDescription] = React.useState('');
  const [formSubtasks, setFormSubtasks] = React.useState<Subtask[]>([]);

  React.useEffect(() => {
    setPageHeader({
      title: 'Cài đặt Quy trình',
      breadcrumb: [
        { label: 'Trang chủ', href: '/', isCurrent: false },
        { label: 'Cài đặt', href: '/settings', isCurrent: false },
        { label: 'Quy trình', href: '', isCurrent: true },
      ],
    });
  }, [setPageHeader]);

  // Save to storage whenever templates change
  React.useEffect(() => {
    saveTemplatesToStorage(templates);
  }, [templates]);

  const handleCreate = () => {
    setEditingTemplate(null);
    setFormName('');
    setFormLabel('');
    setFormDescription('');
    setFormSubtasks([]);
    setIsDialogOpen(true);
  };

  const handleEdit = (template: WorkflowTemplate) => {
    setEditingTemplate(template);
    setFormName(template.name);
    setFormLabel(template.label);
    setFormDescription(template.description);
    setFormSubtasks([...template.subtasks]);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    // Validation
    if (!formName || !formLabel || formSubtasks.length === 0) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Check if name already exists (when creating)
    if (!editingTemplate && templates.some(t => t.name === formName)) {
      toast.error('Chức năng này đã có quy trình rồi!');
      return;
    }

    const now = new Date();

    if (editingTemplate) {
      // Update existing
      setTemplates(prev =>
        prev.map(t =>
          t.id === editingTemplate.id
            ? {
                ...t,
                label: formLabel,
                description: formDescription,
                subtasks: formSubtasks,
                updatedAt: now,
              }
            : t
        )
      );
      toast.success('Đã cập nhật quy trình');
    } else {
      // Create new
      const newTemplate: WorkflowTemplate = {
        id: nanoid(),
        name: formName,
        label: formLabel,
        description: formDescription,
        subtasks: formSubtasks,
        isDefault: false,
        createdAt: now,
        updatedAt: now,
      };
      setTemplates(prev => [...prev, newTemplate]);
      toast.success('Đã tạo quy trình mới');
    }

    setIsDialogOpen(false);
  };

  const handleDeleteClick = (template: WorkflowTemplate) => {
    setDeleteTarget(template);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;

    setTemplates(prev => prev.filter(t => t.id !== deleteTarget.id));
    toast.success('Đã xóa quy trình');
    setIsDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  const getWorkflowType = (name: string) => {
    return WORKFLOW_TYPES.find(wt => wt.value === name);
  };

  const getStatusOptions = (workflowName: string) => {
    const type = WORKFLOW_TYPES.find(wt => wt.value === workflowName);
    return type?.statusOptions || [];
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Quản lý Quy trình</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Tạo và quản lý quy trình xử lý cho các chức năng. Mỗi chức năng chỉ có 1 quy trình duy nhất.
              </p>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Tạo quy trình
            </Button>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => {
              const workflowType = getWorkflowType(template.name);
              return (
                <Card key={template.id} className="relative hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{workflowType?.icon || '📋'}</span>
                        <div>
                          <CardTitle className="text-base">{template.label}</CardTitle>
                          <p className="text-xs text-muted-foreground mt-1">
                            {workflowType?.label || template.name}
                          </p>
                        </div>
                      </div>
                      {template.isDefault && (
                        <Badge variant="outline" className="text-xs">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Mặc định
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {template.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Package className="h-3 w-3" />
                      <span>{template.subtasks.length} bước</span>
                    </div>

                    <Separator />

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleEdit(template)}
                      >
                        <Edit2 className="mr-2 h-3 w-3" />
                        Chỉnh sửa
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteClick(template)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Empty state */}
            {templates.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">Chưa có quy trình nào</p>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    Tạo quy trình đầu tiên để bắt đầu
                  </p>
                  <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo quy trình
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Info Card */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="space-y-3 text-sm">
                <p className="font-medium">💡 Hướng dẫn sử dụng:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Mỗi chức năng (Khiếu nại, Bảo hành, ...) chỉ có 1 quy trình duy nhất</li>
                  <li>Quy trình sẽ tự động áp dụng khi tạo phiếu mới trong chức năng đó</li>
                  <li>Có thể config status tự động chuyển khi hoàn thành từng bước</li>
                  <li>Khi hoàn thành 100% checklist → Tự động chuyển trạng thái cuối</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create/Edit Dialog - Full Screen */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Chỉnh sửa quy trình' : 'Tạo quy trình mới'}
            </DialogTitle>
            <DialogDescription>
              {editingTemplate 
                ? 'Cập nhật thông tin và các bước trong quy trình'
                : 'Chọn chức năng và tạo danh sách các bước xử lý'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="space-y-4">
              {/* Workflow Type Select (only when creating) */}
              {!editingTemplate && (
                <div className="space-y-2">
                  <Label>Chức năng *</Label>
                  <Select value={formName} onValueChange={setFormName}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn chức năng" />
                    </SelectTrigger>
                    <SelectContent>
                      {WORKFLOW_TYPES.map(wt => {
                        const exists = templates.some(t => t.name === wt.value);
                        return (
                          <SelectItem 
                            key={wt.value} 
                            value={wt.value}
                            disabled={exists}
                          >
                            <div className="flex items-center gap-2">
                              <span>{wt.icon}</span>
                              <span>{wt.label}</span>
                              {exists && (
                                <Badge variant="secondary" className="ml-2 text-xs">
                                  Đã có
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Label */}
              <div className="space-y-2">
                <Label>Tên quy trình *</Label>
                <Input
                  value={formLabel}
                  onChange={(e) => setFormLabel(e.target.value)}
                  placeholder="VD: Quy trình xử lý khiếu nại"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>Mô tả</Label>
                <Textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Mô tả ngắn gọn về quy trình này"
                  rows={2}
                />
              </div>
            </div>

            <Separator />

            {/* Subtasks Editor */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base">Các bước xử lý *</Label>
                <Badge variant="secondary">
                  {formSubtasks.length} bước
                </Badge>
              </div>

              <SubtaskList
                subtasks={formSubtasks}
                onAdd={(title, parentId) => {
                  const newSubtask: Subtask = {
                    id: nanoid(),
                    title,
                    completed: false,
                    order: formSubtasks.length,
                    createdAt: new Date(),
                    parentId,
                  };
                  setFormSubtasks(prev => [...prev, newSubtask]);
                }}
                onUpdate={(id, updates) => {
                  setFormSubtasks(prev =>
                    prev.map(s => (s.id === id ? { ...s, ...updates } : s))
                  );
                }}
                onDelete={(id) => {
                  setFormSubtasks(prev =>
                    prev.filter(s => s.id !== id && s.parentId !== id)
                  );
                }}
                onReorder={(reordered) => {
                  setFormSubtasks(reordered);
                }}
                onToggleComplete={(id, completed) => {
                  // Keep completed false in template mode
                  setFormSubtasks(prev =>
                    prev.map(s => (s.id === id ? { ...s, completed: false } : s))
                  );
                }}
                allowNested={true}
                showProgress={false}
                readonly={false}
                emptyMessage="Chưa có bước nào. Click 'Thêm subtask' để tạo."
                showStatusSelector={true}
                statusOptions={getStatusOptions(formName || editingTemplate?.name || '')}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              Hủy
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              {editingTemplate ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa quy trình <strong>{deleteTarget?.label}</strong>?
              <br />
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ============================================================================
// Export function for other modules
// ============================================================================

export function getWorkflowTemplate(workflowName: string): Subtask[] {
  const templates = getTemplatesFromStorage();
  const template = templates.find(t => t.name === workflowName);
  
  if (!template) return [];
  
  // Deep clone and reset completed status
  return template.subtasks.map(s => ({
    ...s,
    id: nanoid(), // Generate new IDs for each instance
    completed: false,
    completedAt: undefined,
  }));
}
