import * as React from 'react';
import { usePageHeader } from '../../../contexts/page-header-context.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card.tsx';
import { Button } from '../../../components/ui/button.tsx';
import { Input } from '../../../components/ui/input.tsx';
import { Label } from '../../../components/ui/label.tsx';
import { Badge } from '../../../components/ui/badge.tsx';
import { Checkbox } from '../../../components/ui/checkbox.tsx';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog.tsx';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../../components/ui/alert-dialog.tsx';
import { Separator } from '../../../components/ui/separator.tsx';
import { toast } from 'sonner';
import { Shield, Plus, Edit, Trash2, Save, RotateCcw } from 'lucide-react';
import { PERMISSION_GROUPS, PERMISSION_LABELS, DEFAULT_ROLE_PERMISSIONS, type Permission } from '../../employees/permissions.ts';

// Custom role type - có thể thêm mới
interface CustomRole {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isDefault: boolean; // Vai trò mặc định không thể xóa
}

// Mock store for role permissions
const useRolePermissionsStore = () => {
  const [roles, setRoles] = React.useState<CustomRole[]>([
    { id: 'admin', name: 'Quản trị viên', description: 'Toàn quyền hệ thống', permissions: DEFAULT_ROLE_PERMISSIONS.Admin, isDefault: true },
    { id: 'manager', name: 'Quản lý', description: 'Quản lý phòng ban', permissions: DEFAULT_ROLE_PERMISSIONS.Manager, isDefault: true },
    { id: 'sales', name: 'Kinh doanh', description: 'Nhân viên kinh doanh', permissions: DEFAULT_ROLE_PERMISSIONS.Sales, isDefault: true },
    { id: 'warehouse', name: 'Kho', description: 'Nhân viên kho', permissions: DEFAULT_ROLE_PERMISSIONS.Warehouse, isDefault: true },
  ]);

  const addRole = (name: string, description: string) => {
    const newRole: CustomRole = {
      id: `role_${Date.now()}`,
      name,
      description,
      permissions: [],
      isDefault: false,
    };
    setRoles(prev => [...prev, newRole]);
    toast.success(`Đã thêm vai trò "${name}"`);
  };

  const updateRole = (roleId: string, updates: Partial<CustomRole>) => {
    setRoles(prev => prev.map(r => r.id === roleId ? { ...r, ...updates } : r));
    toast.success('Đã cập nhật vai trò');
  };

  const deleteRole = (roleId: string) => {
    setRoles(prev => prev.filter(r => r.id !== roleId));
    toast.success('Đã xóa vai trò');
  };

  const resetRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;
    
    // Reset về quyền mặc định dựa trên id
    let defaultPerms: Permission[] = [];
    if (role.id === 'admin') defaultPerms = DEFAULT_ROLE_PERMISSIONS.Admin;
    else if (role.id === 'manager') defaultPerms = DEFAULT_ROLE_PERMISSIONS.Manager;
    else if (role.id === 'sales') defaultPerms = DEFAULT_ROLE_PERMISSIONS.Sales;
    else if (role.id === 'warehouse') defaultPerms = DEFAULT_ROLE_PERMISSIONS.Warehouse;
    
    setRoles(prev => prev.map(r => r.id === roleId ? { ...r, permissions: defaultPerms } : r));
    toast.success('Đã khôi phục quyền mặc định');
  };

  return { roles, addRole, updateRole, deleteRole, resetRole };
};

export function EmployeeRolesPage() {
  const { roles, addRole, updateRole, deleteRole, resetRole } = useRolePermissionsStore();
  const [selectedRole, setSelectedRole] = React.useState<CustomRole | null>(null);
  const [editingPermissions, setEditingPermissions] = React.useState<Permission[]>([]);
  const [showPermissionsDialog, setShowPermissionsDialog] = React.useState(false);
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [showEditDialog, setShowEditDialog] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [roleToDelete, setRoleToDelete] = React.useState<CustomRole | null>(null);
  const [roleForm, setRoleForm] = React.useState({ name: '', description: '' });

  // Page header actions
  const headerActions = React.useMemo(() => [
    <Button 
      key="add" 
      size="sm" 
      onClick={() => {
        setRoleForm({ name: '', description: '' });
        setShowAddDialog(true);
      }}
    >
      <Plus className="mr-2 h-4 w-4" />
      Thêm vai trò
    </Button>
  ], []);

  usePageHeader({
    title: 'Phân quyền & Tài khoản',
    actions: headerActions,
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Cài đặt', href: '/settings', isCurrent: false },
      { label: 'Phân quyền & Tài khoản', href: '', isCurrent: true }
    ]
  });

  const handleEditRole = (role: CustomRole) => {
    setSelectedRole(role);
    setEditingPermissions([...role.permissions]);
    setShowPermissionsDialog(true);
  };

  const handleEditRoleInfo = (role: CustomRole) => {
    setSelectedRole(role);
    setRoleForm({ name: role.name, description: role.description });
    setShowEditDialog(true);
  };

  const handleDeleteClick = (role: CustomRole) => {
    setRoleToDelete(role);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (roleToDelete) {
      deleteRole(roleToDelete.id);
      setShowDeleteDialog(false);
      setRoleToDelete(null);
    }
  };

  const handleAddRole = () => {
    if (!roleForm.name.trim()) {
      toast.error('Vui lòng nhập tên vai trò');
      return;
    }
    addRole(roleForm.name.trim(), roleForm.description.trim());
    setShowAddDialog(false);
    setRoleForm({ name: '', description: '' });
  };

  const handleUpdateRoleInfo = () => {
    if (!selectedRole || !roleForm.name.trim()) {
      toast.error('Vui lòng nhập tên vai trò');
      return;
    }
    updateRole(selectedRole.id, {
      name: roleForm.name.trim(),
      description: roleForm.description.trim(),
    });
    setShowEditDialog(false);
    setSelectedRole(null);
  };

  const handleTogglePermission = (permission: Permission) => {
    setEditingPermissions(prev => {
      if (prev.includes(permission)) {
        return prev.filter(p => p !== permission);
      } else {
        return [...prev, permission];
      }
    });
  };

  const handleToggleGroup = (groupPermissions: Permission[]) => {
    const allSelected = groupPermissions.every(p => editingPermissions.includes(p));
    
    if (allSelected) {
      setEditingPermissions(prev => prev.filter(p => !groupPermissions.includes(p)));
    } else {
      setEditingPermissions(prev => {
        const newPerms = new Set([...prev, ...groupPermissions]);
        return Array.from(newPerms);
      });
    }
  };

  const handleSavePermissions = () => {
    if (!selectedRole) return;
    updateRole(selectedRole.id, { permissions: editingPermissions });
    setShowPermissionsDialog(false);
    setSelectedRole(null);
  };

  return (
    <div className="space-y-6">
      {/* Roles List */}
      <div className="space-y-4">
        {roles.map((role) => (
          <Card key={role.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{role.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {role.permissions.length} quyền
                    </Badge>
                    {role.isDefault && (
                      <Badge variant="outline" className="text-xs">
                        Mặc định
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {role.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(PERMISSION_GROUPS).map(([groupKey, group]) => {
                      const groupPerms = group.permissions.filter(p => role.permissions.includes(p));
                      if (groupPerms.length === 0) return null;
                      
                      return (
                        <Badge key={groupKey} variant="outline" className="text-xs">
                          {group.label}: {groupPerms.length}/{group.permissions.length}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditRoleInfo(role)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditRole(role)}
                  >
                    <Shield className="h-4 w-4" />
                  </Button>
                  {role.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => resetRole(role.id)}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  )}
                  {!role.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(role)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Role Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Thêm vai trò mới
            </DialogTitle>
            <DialogDescription>
              Tạo vai trò mới và cấu hình quyền truy cập
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="role-name">Tên vai trò</Label>
              <Input
                id="role-name"
                placeholder="Nhập tên vai trò..."
                value={roleForm.name}
                onChange={(e) => setRoleForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role-desc">Mô tả</Label>
              <Input
                id="role-desc"
                placeholder="Nhập mô tả vai trò..."
                value={roleForm.description}
                onChange={(e) => setRoleForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleAddRole}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Info Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Chỉnh sửa vai trò
            </DialogTitle>
            <DialogDescription>
              Cập nhật thông tin vai trò
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-role-name">Tên vai trò</Label>
              <Input
                id="edit-role-name"
                placeholder="Nhập tên vai trò..."
                value={roleForm.name}
                onChange={(e) => setRoleForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role-desc">Mô tả</Label>
              <Input
                id="edit-role-desc"
                placeholder="Nhập mô tả vai trò..."
                value={roleForm.description}
                onChange={(e) => setRoleForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleUpdateRoleInfo}>
              <Save className="h-4 w-4 mr-2" />
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa vai trò</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa vai trò "{roleToDelete?.name}"? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Permissions Dialog */}
      <Dialog open={showPermissionsDialog} onOpenChange={setShowPermissionsDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Phân quyền cho {selectedRole?.name}
            </DialogTitle>
            <DialogDescription>
              Chọn các quyền mà vai trò này được phép thực hiện
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {Object.entries(PERMISSION_GROUPS).map(([groupKey, group]) => {
              const groupPerms = group.permissions;
              const selectedCount = groupPerms.filter(p => editingPermissions.includes(p)).length;
              const allSelected = selectedCount === groupPerms.length;

              return (
                <div key={groupKey} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={() => handleToggleGroup(groupPerms)}
                    />
                    <Label className="text-base font-semibold cursor-pointer" onClick={() => handleToggleGroup(groupPerms)}>
                      {group.label} ({selectedCount}/{groupPerms.length})
                    </Label>
                  </div>
                  <div className="ml-6 grid grid-cols-2 gap-3">
                    {groupPerms.map((permission) => (
                      <div key={permission} className="flex items-center gap-2">
                        <Checkbox
                          id={permission}
                          checked={editingPermissions.includes(permission)}
                          onCheckedChange={() => handleTogglePermission(permission)}
                        />
                        <Label
                          htmlFor={permission}
                          className="text-sm cursor-pointer"
                        >
                          {PERMISSION_LABELS[permission]}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <Separator />
                </div>
              );
            })}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowPermissionsDialog(false);
                setSelectedRole(null);
              }}
            >
              Hủy
            </Button>
            <Button onClick={handleSavePermissions}>
              <Save className="h-4 w-4 mr-2" />
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Info Card */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Hướng dẫn phân quyền:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li><strong>Thêm vai trò mới:</strong> Click nút "Thêm vai trò" ở góc trên</li>
              <li><strong>Chỉnh sửa thông tin:</strong> Click icon bút chì để sửa tên và mô tả</li>
              <li><strong>Phân quyền:</strong> Click icon khiên để cấu hình quyền truy cập</li>
              <li><strong>Khôi phục:</strong> Vai trò mặc định có thể reset về quyền ban đầu</li>
              <li><strong>Xóa vai trò:</strong> Chỉ xóa được vai trò tùy chỉnh, không xóa được vai trò mặc định</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
