import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Switch } from '../../../components/ui/switch';
import { Textarea } from '../../../components/ui/textarea';
import { CurrencyInput } from '../../../components/ui/currency-input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { Plus, Save, Loader2 } from 'lucide-react';
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
import { SimpleSettingsTable } from '../../../components/settings/SimpleSettingsTable';
import { toast } from 'sonner';
import { usePenaltyTypes, usePenaltyTypeMutations, type PenaltyTypeSetting } from '../penalty-types/hooks/use-penalty-types';
import type { PenaltyCategory } from './types';
import { getPenaltyTypeColumns } from './penalty-types-columns';
import { Skeleton } from '../../../components/ui/skeleton';
import type { SystemId } from '@/lib/id-types';

// ============================================
// PENALTY TYPES SETTINGS CONTENT (No Page Header)
// For embedding in Employee Settings tabs
// ============================================

export function PenaltyTypesSettingsContent() {
  // React Query hooks
  const { data: penaltyTypesData, isLoading, isError } = usePenaltyTypes();
  const { create, update, remove } = usePenaltyTypeMutations({
    onCreateSuccess: () => toast.success('Đã thêm loại phạt mới'),
    onUpdateSuccess: () => toast.success('Đã cập nhật loại phạt'),
    onDeleteSuccess: () => toast.success('Đã xóa loại phạt'),
    onError: (error) => toast.error(`Lỗi: ${error.message}`),
  });
  
  const penaltyTypes = React.useMemo(
    () => penaltyTypesData?.data ?? [],
    [penaltyTypesData?.data]
  );
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingType, setEditingType] = React.useState<PenaltyTypeSetting | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [typeToDelete, setTypeToDelete] = React.useState<PenaltyTypeSetting | null>(null);
  
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
    [...penaltyTypes].sort((a, b) => a.sortOrder - b.sortOrder),
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
  const handleEdit = React.useCallback((type: PenaltyTypeSetting) => {
    setEditingType(type);
    setFormData({
      name: type.name,
      description: type.description || '',
      defaultAmount: type.defaultAmount,
      category: type.category as PenaltyCategory,
      isActive: type.isActive,
    });
    setIsDialogOpen(true);
  }, []);
  
  // Save type
  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên loại phạt');
      return;
    }
    
    if (editingType) {
      // Update existing
      update.mutate({
        systemId: editingType.systemId,
        data: {
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          defaultAmount: formData.defaultAmount,
          category: formData.category,
          isActive: formData.isActive,
        },
      });
    } else {
      // Create new
      create.mutate({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        defaultAmount: formData.defaultAmount,
        category: formData.category,
        isActive: formData.isActive,
        sortOrder: penaltyTypes.length + 1,
      });
    }
    
    setIsDialogOpen(false);
  };
  
  // Delete type
  const handleDelete = React.useCallback((type: PenaltyTypeSetting) => {
    setTypeToDelete(type);
    setDeleteConfirmOpen(true);
  }, []);
  
  const confirmDelete = () => {
    if (typeToDelete) {
      remove.mutate(typeToDelete.systemId);
    }
    setDeleteConfirmOpen(false);
    setTypeToDelete(null);
  };
  
  // Toggle active
  const handleToggleActive = React.useCallback((type: PenaltyTypeSetting) => {
    update.mutate({
      systemId: type.systemId,
      data: { isActive: !type.isActive },
    });
  }, [update]);

  // Columns for SimpleSettingsTable
  const columns = React.useMemo(() => getPenaltyTypeColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onToggleActive: handleToggleActive,
  }), [handleEdit, handleDelete, handleToggleActive]);

  // Row selection state
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = React.useState(false);

  const handleBulkDelete = React.useCallback((selectedItems: { systemId: string }[]) => {
    if (selectedItems.length === 0) return;
    setIsBulkDeleteOpen(true);
  }, []);

  const confirmBulkDelete = () => {
    const selectedIds = Object.keys(rowSelection);
    selectedIds.forEach(id => {
      remove.mutate(id as SystemId);
    });
    toast.success(`Đã xóa ${selectedIds.length} loại phạt`);
    setRowSelection({});
    setIsBulkDeleteOpen(false);
  };
  
  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Loại phạt nhân viên</CardTitle>
              <CardDescription>
                Cấu hình các loại phạt và mức phạt mặc định cho từng loại vi phạm
              </CardDescription>
            </div>
            <Skeleton className="h-9 w-32" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Error state
  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loại phạt nhân viên</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Không thể tải dữ liệu. Vui lòng thử lại.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <>
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
          <SimpleSettingsTable
            data={sortedTypes}
            columns={columns}
            isLoading={isLoading}
            emptyTitle="Chưa có loại phạt"
            emptyDescription="Nhấn 'Thêm loại phạt' để tạo mới"
            enableSelection
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            onBulkDelete={handleBulkDelete}
            enablePagination
            pagination={{ pageSize: 10, showInfo: true }}
          />
        </CardContent>
      </Card>

      {/* Bulk Delete Dialog */}
      <AlertDialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa {Object.keys(rowSelection).length} loại phạt?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa các loại phạt đã chọn? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={remove.isPending}>
              {remove.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Single Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa loại phạt?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa loại phạt "{typeToDelete?.name}"? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={remove.isPending}>
              {remove.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
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
            <Button onClick={handleSave} disabled={create.isPending || update.isPending}>
              {(create.isPending || update.isPending) ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              {editingType ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
