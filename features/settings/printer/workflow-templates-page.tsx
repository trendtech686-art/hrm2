/**
 * Workflow Templates Settings Page - UPGRADED
 * 
 * Quản lý templates quy trình xử lý cho các chức năng
 * - Full CRUD: Create, Read, Update, Delete templates
 * - Mỗi chức năng có thể có NHIỀU quy trình
 * - Có switch "Mặc định" để chọn quy trình mặc định cho mỗi chức năng
 * - UI: VirtualizedDataTable với select all + Dialog editor
 */

import * as React from 'react';
import { useSettingsPageHeader } from '../use-settings-page-header.tsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card.tsx';
import { Button } from '../../../components/ui/button.tsx';
import { SubtaskList, type Subtask } from '../../../components/shared/subtask-list.tsx';
import { toast } from 'sonner';
import { nanoid } from 'nanoid';
import { 
  Plus, 
  Save, 
  X, 
  MoreHorizontal,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu.tsx';
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
import { Switch } from '../../../components/ui/switch.tsx';
import { Checkbox } from '../../../components/ui/checkbox.tsx';
import { VirtualizedDataTable } from '../../../components/data-table/virtualized-data-table.tsx';
import type { ColumnDef } from '../../../components/data-table/types.ts';
import { ConfirmDialog } from '../../../components/ui/confirm-dialog.tsx';
import { Separator } from '../../../components/ui/separator.tsx';

// ============================================================================
// Types & Constants
// ============================================================================

interface WorkflowTemplate {
  systemId: string;
  id: string;
  name: string; // 'complaints', 'warranty' - chức năng
  label: string; // Display name
  description: string;
  subtasks: Subtask[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Available workflow types - Các chức năng có thể cần quy trình xử lý
const WORKFLOW_TYPES = [
  { value: 'complaints', label: 'Khiếu nại' },
  { value: 'warranty', label: 'Bảo hành' },
  { value: 'orders', label: 'Đơn hàng' },
  { value: 'sales-returns', label: 'Đổi trả hàng' },
  { value: 'purchase-returns', label: 'Trả hàng NCC' },
  { value: 'stock-transfers', label: 'Chuyển kho' },
  { value: 'inventory-checks', label: 'Kiểm kho' },
] as const;

const STORAGE_KEY = 'workflow_templates_v4';

// ============================================================================
// Storage Functions
// ============================================================================

function getDefaultTemplates(): WorkflowTemplate[] {
  const now = new Date();
  return [
    // 1. Khiếu nại
    {
      systemId: nanoid(),
      id: nanoid(),
      name: 'complaints',
      label: 'Quy trình Khiếu nại tiêu chuẩn',
      description: 'Các bước xử lý khiếu nại từ khách hàng',
      isDefault: true,
      createdAt: now,
      updatedAt: now,
      subtasks: [
        { id: nanoid(), title: 'Tiếp nhận và phân loại khiếu nại', completed: false, order: 0, createdAt: now },
        { id: nanoid(), title: 'Kiểm tra thông tin đơn hàng và sản phẩm', completed: false, order: 1, createdAt: now },
        { id: nanoid(), title: 'Liên hệ xác minh với khách hàng', completed: false, order: 2, createdAt: now },
        { id: nanoid(), title: 'Thu thập bằng chứng (ảnh, video)', completed: false, order: 3, createdAt: now },
        { id: nanoid(), title: 'Đề xuất phương án giải quyết', completed: false, order: 4, createdAt: now },
        { id: nanoid(), title: 'Thực hiện xử lý (hoàn tiền/đổi hàng/bồi thường)', completed: false, order: 5, createdAt: now },
        { id: nanoid(), title: 'Xác nhận khách hàng đồng ý phương án', completed: false, order: 6, createdAt: now },
        { id: nanoid(), title: 'Hoàn tất và đóng khiếu nại', completed: false, order: 7, createdAt: now },
      ],
    },
    // 2. Bảo hành
    {
      systemId: nanoid(),
      id: nanoid(),
      name: 'warranty',
      label: 'Quy trình Bảo hành tiêu chuẩn',
      description: 'Các bước xử lý phiếu bảo hành sản phẩm',
      isDefault: true,
      createdAt: now,
      updatedAt: now,
      subtasks: [
        { id: nanoid(), title: 'Kiểm tra sản phẩm và tình trạng', completed: false, order: 0, createdAt: now },
        { id: nanoid(), title: 'Chụp ảnh sản phẩm trước khi xử lý', completed: false, order: 1, createdAt: now },
        { id: nanoid(), title: 'Liên hệ khách hàng xác nhận phương án xử lý', completed: false, order: 2, createdAt: now },
        { id: nanoid(), title: 'Thực hiện sửa chữa/thay thế sản phẩm', completed: false, order: 3, createdAt: now },
        { id: nanoid(), title: 'Chụp ảnh sản phẩm sau khi xử lý', completed: false, order: 4, createdAt: now },
        { id: nanoid(), title: 'Đóng gói và chuẩn bị giao hàng', completed: false, order: 5, createdAt: now },
        { id: nanoid(), title: 'Tạo đơn hàng trả khách và gắn mã vận đơn', completed: false, order: 6, createdAt: now },
      ],
    },
    // 3. Đơn hàng
    {
      systemId: nanoid(),
      id: nanoid(),
      name: 'orders',
      label: 'Quy trình xử lý Đơn hàng',
      description: 'Các bước xử lý đơn hàng từ tiếp nhận đến giao hàng',
      isDefault: true,
      createdAt: now,
      updatedAt: now,
      subtasks: [
        { id: nanoid(), title: 'Xác nhận đơn hàng với khách', completed: false, order: 0, createdAt: now },
        { id: nanoid(), title: 'Kiểm tra tồn kho và đặt hàng (nếu cần)', completed: false, order: 1, createdAt: now },
        { id: nanoid(), title: 'Chuẩn bị hàng hóa theo đơn', completed: false, order: 2, createdAt: now },
        { id: nanoid(), title: 'Đóng gói sản phẩm', completed: false, order: 3, createdAt: now },
        { id: nanoid(), title: 'Tạo vận đơn và bàn giao vận chuyển', completed: false, order: 4, createdAt: now },
        { id: nanoid(), title: 'Theo dõi tình trạng giao hàng', completed: false, order: 5, createdAt: now },
        { id: nanoid(), title: 'Xác nhận giao hàng thành công', completed: false, order: 6, createdAt: now },
      ],
    },
    // 4. Đổi trả hàng
    {
      systemId: nanoid(),
      id: nanoid(),
      name: 'sales-returns',
      label: 'Quy trình Đổi trả hàng',
      description: 'Các bước xử lý yêu cầu đổi trả từ khách hàng',
      isDefault: true,
      createdAt: now,
      updatedAt: now,
      subtasks: [
        { id: nanoid(), title: 'Tiếp nhận yêu cầu đổi trả', completed: false, order: 0, createdAt: now },
        { id: nanoid(), title: 'Xác minh thông tin đơn hàng gốc', completed: false, order: 1, createdAt: now },
        { id: nanoid(), title: 'Kiểm tra điều kiện đổi trả (thời hạn, tình trạng)', completed: false, order: 2, createdAt: now },
        { id: nanoid(), title: 'Duyệt yêu cầu đổi trả', completed: false, order: 3, createdAt: now },
        { id: nanoid(), title: 'Hướng dẫn khách gửi trả hàng', completed: false, order: 4, createdAt: now },
        { id: nanoid(), title: 'Nhận và kiểm tra sản phẩm trả về', completed: false, order: 5, createdAt: now },
        { id: nanoid(), title: 'Xử lý hoàn tiền hoặc gửi sản phẩm thay thế', completed: false, order: 6, createdAt: now },
        { id: nanoid(), title: 'Cập nhật kho và hoàn tất đổi trả', completed: false, order: 7, createdAt: now },
      ],
    },
    // 5. Trả hàng NCC
    {
      systemId: nanoid(),
      id: nanoid(),
      name: 'purchase-returns',
      label: 'Quy trình Trả hàng NCC',
      description: 'Các bước trả hàng cho nhà cung cấp',
      isDefault: true,
      createdAt: now,
      updatedAt: now,
      subtasks: [
        { id: nanoid(), title: 'Xác định hàng cần trả NCC (lỗi, thừa, không đạt)', completed: false, order: 0, createdAt: now },
        { id: nanoid(), title: 'Liên hệ NCC thông báo trả hàng', completed: false, order: 1, createdAt: now },
        { id: nanoid(), title: 'Chờ NCC xác nhận và cung cấp địa chỉ', completed: false, order: 2, createdAt: now },
        { id: nanoid(), title: 'Đóng gói hàng trả', completed: false, order: 3, createdAt: now },
        { id: nanoid(), title: 'Gửi hàng và lấy biên nhận', completed: false, order: 4, createdAt: now },
        { id: nanoid(), title: 'Theo dõi đến khi NCC nhận hàng', completed: false, order: 5, createdAt: now },
        { id: nanoid(), title: 'Đối chiếu công nợ với NCC', completed: false, order: 6, createdAt: now },
      ],
    },
    // 6. Chuyển kho
    {
      systemId: nanoid(),
      id: nanoid(),
      name: 'stock-transfers',
      label: 'Quy trình Chuyển kho',
      description: 'Các bước chuyển hàng giữa các kho',
      isDefault: true,
      createdAt: now,
      updatedAt: now,
      subtasks: [
        { id: nanoid(), title: 'Tạo phiếu chuyển kho', completed: false, order: 0, createdAt: now },
        { id: nanoid(), title: 'Kiểm tra tồn kho xuất', completed: false, order: 1, createdAt: now },
        { id: nanoid(), title: 'Lấy hàng và kiểm đếm', completed: false, order: 2, createdAt: now },
        { id: nanoid(), title: 'Đóng gói và ghi chú vận chuyển', completed: false, order: 3, createdAt: now },
        { id: nanoid(), title: 'Xuất kho nguồn', completed: false, order: 4, createdAt: now },
        { id: nanoid(), title: 'Vận chuyển đến kho đích', completed: false, order: 5, createdAt: now },
        { id: nanoid(), title: 'Nhận hàng và kiểm đếm tại kho đích', completed: false, order: 6, createdAt: now },
        { id: nanoid(), title: 'Nhập kho đích và hoàn tất', completed: false, order: 7, createdAt: now },
      ],
    },
    // 7. Kiểm kho
    {
      systemId: nanoid(),
      id: nanoid(),
      name: 'inventory-checks',
      label: 'Quy trình Kiểm kho',
      description: 'Các bước thực hiện kiểm kê hàng tồn kho',
      isDefault: true,
      createdAt: now,
      updatedAt: now,
      subtasks: [
        { id: nanoid(), title: 'Lên kế hoạch kiểm kho (thời gian, phạm vi)', completed: false, order: 0, createdAt: now },
        { id: nanoid(), title: 'In danh sách hàng hóa cần kiểm', completed: false, order: 1, createdAt: now },
        { id: nanoid(), title: 'Phân công nhân sự kiểm kê', completed: false, order: 2, createdAt: now },
        { id: nanoid(), title: 'Thực hiện kiểm đếm thực tế', completed: false, order: 3, createdAt: now },
        { id: nanoid(), title: 'Ghi nhận số lượng thực tế', completed: false, order: 4, createdAt: now },
        { id: nanoid(), title: 'Đối chiếu với số liệu hệ thống', completed: false, order: 5, createdAt: now },
        { id: nanoid(), title: 'Xác định và giải trình chênh lệch', completed: false, order: 6, createdAt: now },
        { id: nanoid(), title: 'Duyệt và cập nhật tồn kho', completed: false, order: 7, createdAt: now },
      ],
    },
  ];
}

function getTemplatesFromStorage(): WorkflowTemplate[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((t: any) => ({
        ...t,
        systemId: t.systemId || t.id, // Migrate old data
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
// Table Columns
// ============================================================================

function createColumns(
  onEdit: (template: WorkflowTemplate) => void,
  onDelete: (templateId: string) => void,
  onToggleDefault: (template: WorkflowTemplate, checked: boolean) => void,
): ColumnDef<WorkflowTemplate>[] {
  return [
    {
      id: 'select',
      size: 40,
      meta: { displayName: 'Chọn', sticky: 'left' },
      header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll }) => (
        <Checkbox
          checked={isSomePageRowsSelected ? 'indeterminate' : isAllPageRowsSelected}
          onCheckedChange={(checked) => onToggleAll?.(checked === true)}
          aria-label="Chọn tất cả"
        />
      ),
      cell: ({ isSelected, onToggleSelect }) => (
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onToggleSelect?.(checked === true)}
          aria-label="Chọn dòng"
        />
      ),
    },
    {
      id: 'label',
      header: 'Tên quy trình',
      size: 250,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{row.label}</span>
          {row.isDefault && (
            <Badge variant="outline" className="text-xs">
              Mặc định
            </Badge>
          )}
        </div>
      ),
    },
    {
      id: 'name',
      header: 'Chức năng',
      size: 120,
      cell: ({ row }) => {
        const wt = WORKFLOW_TYPES.find(w => w.value === row.name);
        return (
          <Badge variant="secondary">
            {wt?.label || row.name}
          </Badge>
        );
      },
    },
    {
      id: 'description',
      header: 'Mô tả',
      size: 250,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground truncate block max-w-[230px]">
          {row.description || '-'}
        </span>
      ),
    },
    {
      id: 'subtasks',
      header: 'Số bước',
      size: 80,
      cell: ({ row }) => (
        <span className="text-center block">{row.subtasks.length}</span>
      ),
    },
    {
      id: 'isDefault',
      header: 'Mặc định',
      size: 100,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Switch
            checked={row.isDefault}
            onCheckedChange={(checked) => onToggleDefault(row, checked)}
            aria-label="Đặt làm mặc định"
          />
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Thao tác',
      size: 80,
      meta: { displayName: 'Thao tác', sticky: 'right' },
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(row)}>
              Sửa
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete(row.systemId)}
              className="text-destructive focus:text-destructive"
            >
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}

// ============================================================================
// Main Component
// ============================================================================

export function WorkflowTemplatesPage() {
  const [templates, setTemplates] = React.useState<WorkflowTemplate[]>(() => getTemplatesFromStorage());
  
  // Table states
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'createdAt', desc: true });
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>(['select', 'actions']);
  
  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingTemplate, setEditingTemplate] = React.useState<WorkflowTemplate | null>(null);
  const [deleteTargetId, setDeleteTargetId] = React.useState<string | null>(null);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = React.useState(false);
  
  // Form states
  const [formName, setFormName] = React.useState('');
  const [formLabel, setFormLabel] = React.useState('');
  const [formDescription, setFormDescription] = React.useState('');
  const [formSubtasks, setFormSubtasks] = React.useState<Subtask[]>([]);

  const selectedRows = React.useMemo(() => {
    return templates.filter(t => rowSelection[t.systemId]);
  }, [templates, rowSelection]);

  const handleCreate = () => {
    setEditingTemplate(null);
    setFormName('');
    setFormLabel('');
    setFormDescription('');
    setFormSubtasks([]);
    setIsDialogOpen(true);
  };

  // Tính số quy trình theo chức năng
  const workflowCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    WORKFLOW_TYPES.forEach(wt => {
      counts[wt.value] = templates.filter(t => t.name === wt.value).length;
    });
    return counts;
  }, [templates]);

  // Lấy các chức năng đã có quy trình
  const activeWorkflows = React.useMemo(() => {
    return WORKFLOW_TYPES.filter(wt => workflowCounts[wt.value] > 0);
  }, [workflowCounts]);

  useSettingsPageHeader({
    title: 'Quy trình',
    actions: [
      // Hiển thị badges cho các chức năng đã có quy trình
      ...activeWorkflows.map(wt => (
        <Badge key={wt.value} variant="secondary" className="text-xs">
          {wt.label}: {workflowCounts[wt.value]}
        </Badge>
      )),
      <Button key="add" onClick={handleCreate}>
        <Plus className="h-4 w-4" />
        Tạo quy trình
      </Button>
    ],
  });

  // Save to storage whenever templates change
  React.useEffect(() => {
    saveTemplatesToStorage(templates);
  }, [templates]);

  const handleEdit = React.useCallback((template: WorkflowTemplate) => {
    setEditingTemplate(template);
    setFormName(template.name);
    setFormLabel(template.label);
    setFormDescription(template.description);
    setFormSubtasks([...template.subtasks]);
    setIsDialogOpen(true);
  }, []);

  const handleSave = () => {
    // Validation
    if (!formName || !formLabel || formSubtasks.length === 0) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const now = new Date();

    if (editingTemplate) {
      // Update existing
      setTemplates(prev =>
        prev.map(t =>
          t.systemId === editingTemplate.systemId
            ? {
                ...t,
                name: formName,
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
      // Create new - check if this is the first template for this function
      const existingForFunction = templates.filter(t => t.name === formName);
      const isFirstForFunction = existingForFunction.length === 0;
      
      const newTemplate: WorkflowTemplate = {
        systemId: nanoid(),
        id: nanoid(),
        name: formName,
        label: formLabel,
        description: formDescription,
        subtasks: formSubtasks,
        isDefault: isFirstForFunction, // Auto set as default if first
        createdAt: now,
        updatedAt: now,
      };
      setTemplates(prev => [...prev, newTemplate]);
      toast.success('Đã tạo quy trình mới');
    }

    setIsDialogOpen(false);
  };

  const handleDeleteClick = React.useCallback((templateId: string) => {
    setDeleteTargetId(templateId);
  }, []);

  const handleDeleteConfirm = () => {
    if (!deleteTargetId) return;

    const templateToDelete = templates.find(t => t.systemId === deleteTargetId);
    
    setTemplates(prev => {
      const newTemplates = prev.filter(t => t.systemId !== deleteTargetId);
      
      // If deleted template was default, set another one as default
      if (templateToDelete?.isDefault) {
        const sameFunction = newTemplates.filter(t => t.name === templateToDelete.name);
        if (sameFunction.length > 0 && !sameFunction.some(t => t.isDefault)) {
          sameFunction[0].isDefault = true;
        }
      }
      
      return newTemplates;
    });
    
    toast.success('Đã xóa quy trình');
    setDeleteTargetId(null);
  };

  const handleBulkDelete = () => {
    setShowBulkDeleteDialog(true);
  };

  const handleBulkDeleteConfirm = () => {
    const idsToDelete = Object.keys(rowSelection);
    
    setTemplates(prev => {
      let newTemplates = prev.filter(t => !idsToDelete.includes(t.systemId));
      
      // Ensure each function has a default
      WORKFLOW_TYPES.forEach(wt => {
        const forFunction = newTemplates.filter(t => t.name === wt.value);
        if (forFunction.length > 0 && !forFunction.some(t => t.isDefault)) {
          forFunction[0].isDefault = true;
        }
      });
      
      return newTemplates;
    });
    
    setRowSelection({});
    setShowBulkDeleteDialog(false);
    toast.success(`Đã xóa ${idsToDelete.length} quy trình`);
  };

  const handleToggleDefault = React.useCallback((template: WorkflowTemplate, checked: boolean) => {
    setTemplates(prev => {
      if (checked) {
        // Bật mặc định cho template này
        return prev.map(t => {
          if (t.name === template.name) {
            return {
              ...t,
              isDefault: t.systemId === template.systemId,
              updatedAt: new Date(),
            };
          }
          return t;
        });
      } else {
        // Tắt mặc định - tìm template khác cùng function để set mặc định
        const otherTemplates = prev.filter(t => t.name === template.name && t.systemId !== template.systemId);
        if (otherTemplates.length > 0) {
          const newDefault = otherTemplates[0];
          return prev.map(t => {
            if (t.name === template.name) {
              return {
                ...t,
                isDefault: t.systemId === newDefault.systemId,
                updatedAt: new Date(),
              };
            }
            return t;
          });
        }
        // Không có template khác, giữ nguyên
        toast.error('Phải có ít nhất một quy trình mặc định cho chức năng này');
        return prev;
      }
    });
  }, []);

  const columns = React.useMemo(
    () => createColumns(handleEdit, handleDeleteClick, handleToggleDefault),
    [handleEdit, handleDeleteClick, handleToggleDefault]
  );

  return (
    <div className="space-y-6">
      {/* Templates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách quy trình</CardTitle>
          <CardDescription>
            Quản lý các quy trình xử lý cho từng chức năng. Mỗi chức năng có thể có nhiều quy trình, chọn 1 làm mặc định.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {templates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Chưa có quy trình nào. Nhấn "Tạo quy trình" để bắt đầu.
            </div>
          ) : (
            <VirtualizedDataTable
              columns={columns}
              data={templates}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              onBulkDelete={handleBulkDelete}
              showBulkDeleteButton={true}
              allSelectedRows={selectedRows}
              expanded={expanded}
              setExpanded={setExpanded}
              sorting={sorting}
              setSorting={setSorting}
              columnVisibility={columnVisibility}
              setColumnVisibility={setColumnVisibility}
              columnOrder={columnOrder}
              setColumnOrder={setColumnOrder}
              pinnedColumns={pinnedColumns}
              setPinnedColumns={setPinnedColumns}
            />
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="space-y-3 text-sm">
            <p className="font-medium">Hướng dẫn sử dụng:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Mỗi chức năng (Khiếu nại, Bảo hành, ...) có thể có nhiều quy trình</li>
              <li>Bật switch "Mặc định" để chọn quy trình áp dụng khi tạo phiếu mới</li>
              <li>Mỗi chức năng chỉ có 1 quy trình mặc định</li>
              <li>Khi hoàn thành 100% checklist → Tự động chuyển trạng thái cuối</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
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
              {/* Workflow Type Select */}
              <div className="space-y-2">
                <Label>Chức năng *</Label>
                <Select value={formName} onValueChange={setFormName}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn chức năng" />
                  </SelectTrigger>
                  <SelectContent>
                    {WORKFLOW_TYPES.map(wt => {
                      const count = templates.filter(t => t.name === wt.value).length;
                      return (
                        <SelectItem key={wt.value} value={wt.value}>
                          <div className="flex items-center gap-2">
                            <span>{wt.label}</span>
                            {count > 0 && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                {count} quy trình
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Label */}
              <div className="space-y-2">
                <Label>Tên quy trình *</Label>
                <Input
                  value={formLabel}
                  onChange={(e) => setFormLabel(e.target.value)}
                  placeholder="VD: Quy trình xử lý khiếu nại VIP"
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
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              <X className="h-4 w-4" />
              Hủy
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4" />
              {editingTemplate ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        title="Xác nhận xóa"
        description={`Bạn có chắc muốn xóa quy trình "${templates.find(t => t.systemId === deleteTargetId)?.label || ''}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
      />

      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showBulkDeleteDialog}
        onOpenChange={setShowBulkDeleteDialog}
        title="Xác nhận xóa nhiều"
        description={`Bạn có chắc muốn xóa ${selectedRows.length} quy trình đã chọn? Hành động này không thể hoàn tác.`}
        confirmText="Xóa tất cả"
        cancelText="Hủy"
        variant="destructive"
        onConfirm={handleBulkDeleteConfirm}
      />
    </div>
  );
}

// ============================================================================
// Export function for other modules
// ============================================================================

export function getWorkflowTemplate(workflowName: string): Subtask[] {
  const templates = getTemplatesFromStorage();
  // Tìm template mặc định cho chức năng này
  const template = templates.find(t => t.name === workflowName && t.isDefault);
  
  if (!template) {
    // Fallback: lấy template đầu tiên của chức năng này
    const fallback = templates.find(t => t.name === workflowName);
    if (!fallback) return [];
    
    return fallback.subtasks.map(s => ({
      ...s,
      id: nanoid(),
      completed: false,
      completedAt: undefined,
    }));
  }
  
  // Deep clone and reset completed status
  return template.subtasks.map(s => ({
    ...s,
    id: nanoid(),
    completed: false,
    completedAt: undefined,
  }));
}

// Get all templates for a workflow (for selection)
export function getWorkflowTemplates(workflowName: string): WorkflowTemplate[] {
  const templates = getTemplatesFromStorage();
  return templates.filter(t => t.name === workflowName);
}
