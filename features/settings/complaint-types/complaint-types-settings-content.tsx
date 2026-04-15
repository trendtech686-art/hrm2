'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Switch } from '../../../components/ui/switch';
import { Textarea } from '../../../components/ui/textarea';
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
import { Skeleton } from '../../../components/ui/skeleton';
import { useComplaintTypes, useComplaintTypeMutations, type ComplaintTypeSetting } from './hooks/use-complaint-types';

// ============================================
// COMPLAINT TYPES SETTINGS CONTENT
// For embedding in Complaints Settings tabs
// ============================================

export function ComplaintTypesSettingsContent() {
  // React Query hooks
  const { data: complaintTypesData, isLoading, isError } = useComplaintTypes();
  const { create, update, remove } = useComplaintTypeMutations({
    onCreateSuccess: () => toast.success('Đã thêm loại khiếu nại mới'),
    onUpdateSuccess: () => toast.success('Đã cập nhật loại khiếu nại'),
    onDeleteSuccess: () => toast.success('Đã xóa loại khiếu nại'),
    onError: (error) => toast.error(`Lỗi: ${error.message}`),
  });
  
  const complaintTypes = React.useMemo(
    () => complaintTypesData?.data ?? [],
    [complaintTypesData?.data]
  );
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingType, setEditingType] = React.useState<ComplaintTypeSetting | null>(null);
  const [isAddingNew, setIsAddingNew] = React.useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [typeToDelete, setTypeToDelete] = React.useState<ComplaintTypeSetting | null>(null);
  
  // Form state
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    color: '',
    isActive: true,
    isDefault: false,
  });
  
  // Sort by order
  const sortedTypes = React.useMemo(() => 
    [...complaintTypes].sort((a, b) => a.sortOrder - b.sortOrder),
    [complaintTypes]
  );
  
  // Open dialog for new type
  const handleAddNew = () => {
    setEditingType(null);
    setIsAddingNew(true);
    setFormData({
      name: '',
      description: '',
      color: '',
      isActive: true,
      isDefault: false,
    });
    setIsDialogOpen(true);
  };
  
  // Open dialog for edit
  const handleEdit = (type: ComplaintTypeSetting) => {
    setEditingType(type);
    setIsAddingNew(false);
    setFormData({
      name: type.name,
      description: type.description || '',
      color: type.color || '',
      isActive: type.isActive,
      isDefault: type.isDefault,
    });
    setIsDialogOpen(true);
  };
  
  // Save type
  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên loại khiếu nại');
      return;
    }
    
    if (editingType && !isAddingNew) {
      // Update existing
      update.mutate({
        systemId: editingType.systemId,
        data: {
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          color: formData.color.trim() || undefined,
          isActive: formData.isActive,
          isDefault: formData.isDefault,
        },
      });
    } else {
      // Create new
      create.mutate({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        color: formData.color.trim() || undefined,
        isActive: formData.isActive,
        isDefault: formData.isDefault,
        sortOrder: complaintTypes.length + 1,
      });
    }
    
    setIsDialogOpen(false);
    setEditingType(null);
    setIsAddingNew(false);
  };
  
  // Delete type
  const handleDelete = (type: ComplaintTypeSetting) => {
    setTypeToDelete(type);
    setDeleteConfirmOpen(true);
  };
  
  const confirmDelete = () => {
    if (typeToDelete) {
      remove.mutate(typeToDelete.systemId);
    }
    setDeleteConfirmOpen(false);
    setTypeToDelete(null);
  };
  
  // Toggle active
  const handleToggleActive = (type: ComplaintTypeSetting) => {
    update.mutate({
      systemId: type.systemId,
      data: { isActive: !type.isActive },
    });
  };
  
  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Loại khiếu nại</CardTitle>
              <CardDescription>
                Quản lý các loại khiếu nại có thể sử dụng khi tạo khiếu nại mới
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
          <CardTitle>Loại khiếu nại</CardTitle>
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
              <CardTitle>Loại khiếu nại</CardTitle>
              <CardDescription>
                Quản lý các loại khiếu nại có thể sử dụng khi tạo khiếu nại mới
              </CardDescription>
            </div>
            <Button onClick={handleAddNew} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Thêm loại khiếu nại
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-x-auto">
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
                {sortedTypes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      Chưa có loại khiếu nại nào. Nhấn "Thêm loại khiếu nại" để tạo mới.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedTypes.map((type, index) => (
                    <TableRow key={type.systemId}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{type.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {type.description}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={type.isActive}
                          onCheckedChange={() => handleToggleActive(type)}
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
          </div>
        </CardContent>
      </Card>
      
      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          setEditingType(null);
          setIsAddingNew(false);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isAddingNew ? 'Thêm loại khiếu nại mới' : 'Chỉnh sửa loại khiếu nại'}
            </DialogTitle>
            <DialogDescription>
              {isAddingNew 
                ? 'Điền thông tin để tạo loại khiếu nại mới'
                : 'Cập nhật thông tin loại khiếu nại'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên loại khiếu nại *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="VD: Sản phẩm lỗi"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="VD: Sản phẩm có lỗi kỹ thuật hoặc hỏng hóc"
                rows={3}
              />
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
              {(create.isPending || update.isPending) && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              <Save className="h-4 w-4 mr-2" />
              {isAddingNew ? 'Thêm mới' : 'Cập nhật'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Xóa loại khiếu nại?"
        description={`Bạn có chắc muốn xóa loại khiếu nại "${typeToDelete?.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </>
  );
}
