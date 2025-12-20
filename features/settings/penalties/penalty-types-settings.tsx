import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Switch } from '../../../components/ui/switch';
import { Textarea } from '../../../components/ui/textarea';
import { Badge } from '../../../components/ui/badge';
import { CurrencyInput } from '../../../components/ui/currency-input';
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
  Pencil,
  Trash2,
  GripVertical,
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
import { usePenaltyTypeStore } from './store';
import type { PenaltyType, PenaltyCategory } from './types';
import { penaltyCategoryLabels, penaltyCategoryColors } from './types';
import { asBusinessId } from '@/lib/id-types';
import { useSettingsPageHeader } from '../use-settings-page-header';

// ============================================
// PENALTY TYPES SETTINGS COMPONENT
// ============================================

export function PenaltyTypesSettings() {
  const { data: penaltyTypes, add, update, remove } = usePenaltyTypeStore();
  
  // Page header
  useSettingsPageHeader({
    title: 'Loại phạt',
    subtitle: 'Quản lý các loại phạt cho nhân viên (khiếu nại, chấm công, hiệu suất)',
    breadcrumb: [
      { label: 'Trang chủ', href: '/' },
      { label: 'Cài đặt', href: '/settings' },
      { label: 'Loại phạt', href: '/settings/penalty-types', isCurrent: true }
    ],
  });
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingType, setEditingType] = React.useState<PenaltyType | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [typeToDelete, setTypeToDelete] = React.useState<PenaltyType | null>(null);
  
  // Form state
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    defaultAmount: 100000,
    category: 'other' as PenaltyCategory,
    isActive: true,
  });
  
  // Sort by order
  const sortedTypes = React.useMemo(() => 
    [...penaltyTypes].sort((a, b) => a.order - b.order),
    [penaltyTypes]
  );
  
  // Open dialog for new type
  const handleAddNew = () => {
    setEditingType(null);
    setFormData({
      name: '',
      description: '',
      defaultAmount: 100000,
      category: 'other',
      isActive: true,
    });
    setIsDialogOpen(true);
  };
  
  // Open dialog for edit
  const handleEdit = (type: PenaltyType) => {
    setEditingType(type);
    setFormData({
      name: type.name,
      description: type.description || '',
      defaultAmount: type.defaultAmount,
      category: type.category,
      isActive: type.isActive,
    });
    setIsDialogOpen(true);
  };
  
  // Save type
  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên loại phạt');
      return;
    }
    
    if (editingType) {
      // Update existing
      update(editingType.systemId, {
        ...editingType,
        name: formData.name.trim(),
        description: formData.description.trim(),
        defaultAmount: formData.defaultAmount,
        category: formData.category,
        isActive: formData.isActive,
        updatedAt: new Date().toISOString(),
      });
      toast.success('Đã cập nhật loại phạt');
    } else {
      // Create new
      const newId = `LP${String(penaltyTypes.length + 1).padStart(3, '0')}`;
      
      add({
        id: asBusinessId(newId),
        name: formData.name.trim(),
        description: formData.description.trim(),
        defaultAmount: formData.defaultAmount,
        category: formData.category,
        isActive: formData.isActive,
        order: penaltyTypes.length + 1,
        createdAt: new Date().toISOString(),
      });
      toast.success('Đã thêm loại phạt mới');
    }
    
    setIsDialogOpen(false);
  };
  
  // Delete type
  const handleDelete = (type: PenaltyType) => {
    setTypeToDelete(type);
    setDeleteConfirmOpen(true);
  };
  
  const confirmDelete = () => {
    if (typeToDelete) {
      remove(typeToDelete.systemId);
      toast.success('Đã xóa loại phạt');
    }
    setDeleteConfirmOpen(false);
    setTypeToDelete(null);
  };
  
  // Toggle active
  const handleToggleActive = (type: PenaltyType) => {
    update(type.systemId, {
      ...type,
      isActive: !type.isActive,
      updatedAt: new Date().toISOString(),
    });
    toast.success(type.isActive ? 'Đã tắt loại phạt' : 'Đã bật loại phạt');
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Loại phạt nhân viên</CardTitle>
              <CardDescription>
                Cấu hình các loại phạt và mức phạt mặc định cho từng loại vi phạm
              </CardDescription>
            </div>
            <Button onClick={handleAddNew} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Thêm loại phạt
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Tên loại phạt</TableHead>
                <TableHead>Phân loại</TableHead>
                <TableHead className="text-right">Mức phạt mặc định</TableHead>
                <TableHead className="text-center">Trạng thái</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTypes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    Chưa có loại phạt nào. Nhấn "Thêm loại phạt" để tạo mới.
                  </TableCell>
                </TableRow>
              ) : (
                sortedTypes.map((type, index) => (
                  <TableRow key={type.systemId}>
                    <TableCell className="text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground/50 cursor-grab" />
                        {index + 1}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{type.name}</p>
                        {type.description && (
                          <p className="text-xs text-muted-foreground">{type.description}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={penaltyCategoryColors[type.category]}
                      >
                        {penaltyCategoryLabels[type.category]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {type.defaultAmount.toLocaleString('vi-VN')}đ
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={type.isActive}
                        onCheckedChange={() => handleToggleActive(type)}
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
                          <DropdownMenuItem onClick={() => handleEdit(type)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDelete(type)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
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
        </CardContent>
      </Card>
      
      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingType ? 'Chỉnh sửa loại phạt' : 'Thêm loại phạt mới'}
            </DialogTitle>
            <DialogDescription>
              {editingType 
                ? 'Cập nhật thông tin loại phạt'
                : 'Tạo loại phạt mới cho nhân viên'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên loại phạt *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="VD: Đi làm trễ, Làm hỏng hàng..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Mô tả chi tiết về loại phạt này..."
                rows={2}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Phân loại</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: PenaltyCategory) => 
                    setFormData(prev => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complaint">Khiếu nại</SelectItem>
                    <SelectItem value="attendance">Chấm công</SelectItem>
                    <SelectItem value="performance">Hiệu suất</SelectItem>
                    <SelectItem value="other">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Mức phạt mặc định</Label>
                <CurrencyInput
                  value={formData.defaultAmount}
                  onChange={(value) => setFormData(prev => ({ ...prev, defaultAmount: value }))}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, isActive: checked }))
                }
              />
              <Label htmlFor="isActive">Kích hoạt</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              {editingType ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Xóa loại phạt?"
        description={`Bạn có chắc muốn xóa loại phạt "${typeToDelete?.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  );
}

// Helper function to load penalty types (for use in other components)
export function loadPenaltyTypes(): PenaltyType[] {
  return usePenaltyTypeStore.getState().data.filter(t => t.isActive);
}

// Helper function to get penalty type by id
export function getPenaltyTypeById(systemId: string): PenaltyType | undefined {
  return usePenaltyTypeStore.getState().data.find(t => t.systemId === systemId);
}
