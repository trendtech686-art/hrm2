'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Switch } from '../../../components/ui/switch';
import { Textarea } from '../../../components/ui/textarea';
import { Badge } from '../../../components/ui/badge';
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
  Shield,
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
import { useRoles, useRoleMutations, type RoleSetting } from './hooks/use-roles';

// ============================================
// ROLES SETTINGS CONTENT
// For embedding in Employee Settings tabs
// ============================================

export function RolesSettingsContent() {
  // React Query hooks
  const { data: rolesData, isLoading, isError } = useRoles();
  const { create, update, remove } = useRoleMutations({
    onCreateSuccess: () => toast.success('Đã thêm vai trò mới'),
    onUpdateSuccess: () => toast.success('Đã cập nhật vai trò'),
    onDeleteSuccess: () => toast.success('Đã xóa vai trò'),
    onError: (error) => toast.error(`Lỗi: ${error.message}`),
  });
  
  const roles = React.useMemo(
    () => rolesData?.data ?? [],
    [rolesData?.data]
  );
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingRole, setEditingRole] = React.useState<RoleSetting | null>(null);
  const [isAddingNew, setIsAddingNew] = React.useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [roleToDelete, setRoleToDelete] = React.useState<RoleSetting | null>(null);
  
  // Form state
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    isActive: true,
    isSystem: false,
  });
  
  // Sort by order
  const sortedRoles = React.useMemo(() => 
    [...roles].sort((a, b) => a.sortOrder - b.sortOrder),
    [roles]
  );
  
  // Open dialog for new role
  const handleAddNew = () => {
    setEditingRole(null);
    setIsAddingNew(true);
    setFormData({
      name: '',
      description: '',
      isActive: true,
      isSystem: false,
    });
    setIsDialogOpen(true);
  };
  
  // Open dialog for edit
  const handleEdit = (role: RoleSetting) => {
    setEditingRole(role);
    setIsAddingNew(false);
    setFormData({
      name: role.name,
      description: role.description || '',
      isActive: role.isActive,
      isSystem: role.isSystem,
    });
    setIsDialogOpen(true);
  };
  
  // Save role
  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên vai trò');
      return;
    }
    
    if (editingRole && !isAddingNew) {
      // Update existing
      update.mutate({
        systemId: editingRole.systemId,
        data: {
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          isActive: formData.isActive,
        },
      });
    } else {
      // Create new
      create.mutate({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        isActive: formData.isActive,
        isSystem: false,
        sortOrder: roles.length + 1,
      });
    }
    
    setIsDialogOpen(false);
    setEditingRole(null);
    setIsAddingNew(false);
  };
  
  // Delete role
  const handleDelete = (role: RoleSetting) => {
    if (role.isSystem) {
      toast.error('Không thể xóa vai trò hệ thống');
      return;
    }
    setRoleToDelete(role);
    setDeleteConfirmOpen(true);
  };
  
  const confirmDelete = () => {
    if (roleToDelete) {
      remove.mutate(roleToDelete.systemId);
    }
    setDeleteConfirmOpen(false);
    setRoleToDelete(null);
  };
  
  // Toggle active
  const handleToggleActive = (role: RoleSetting) => {
    update.mutate({
      systemId: role.systemId,
      data: { isActive: !role.isActive },
    });
  };
  
  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Vai trò nhân viên</CardTitle>
              <CardDescription>
                Quản lý các vai trò và phân quyền trong hệ thống
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
          <CardTitle>Vai trò nhân viên</CardTitle>
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
              <CardTitle>Vai trò nhân viên</CardTitle>
              <CardDescription>
                Quản lý các vai trò và phân quyền trong hệ thống
              </CardDescription>
            </div>
            <Button onClick={handleAddNew} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Thêm vai trò
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-13">STT</TableHead>
                  <TableHead>Tên vai trò</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead className="w-25">Loại</TableHead>
                  <TableHead className="w-25">Trạng thái</TableHead>
                  <TableHead className="w-20 text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedRoles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      Chưa có vai trò nào. Nhấn "Thêm vai trò" để tạo mới.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedRoles.map((role, index) => (
                    <TableRow key={role.systemId}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{role.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {role.description}
                      </TableCell>
                      <TableCell>
                        {role.isSystem ? (
                          <Badge variant="secondary">Hệ thống</Badge>
                        ) : (
                          <Badge variant="outline">Tùy chỉnh</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={role.isActive}
                          onCheckedChange={() => handleToggleActive(role)}
                          disabled={role.isSystem}
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
                            <DropdownMenuItem onClick={() => handleEdit(role)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            {!role.isSystem && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleDelete(role)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Xóa
                                </DropdownMenuItem>
                              </>
                            )}
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
          setEditingRole(null);
          setIsAddingNew(false);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isAddingNew ? 'Thêm vai trò mới' : 'Chỉnh sửa vai trò'}
            </DialogTitle>
            <DialogDescription>
              {isAddingNew 
                ? 'Điền thông tin để tạo vai trò mới'
                : 'Cập nhật thông tin vai trò'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên vai trò *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="VD: Nhân viên bán hàng"
                disabled={editingRole?.isSystem}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="VD: Vai trò dành cho nhân viên bán hàng tại cửa hàng"
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
        title="Xóa vai trò?"
        description={`Bạn có chắc muốn xóa vai trò "${roleToDelete?.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </>
  );
}
