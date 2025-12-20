import * as React from 'react';
import { useSettingsPageHeader } from '../use-settings-page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Badge } from '../../../components/ui/badge';
import { Checkbox } from '../../../components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../../components/ui/alert-dialog';
import { Separator } from '../../../components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { TabsContent } from '../../../components/ui/tabs';
import { SettingsVerticalTabs } from '../../../components/settings/SettingsVerticalTabs';
import { SettingsActionButton } from '../../../components/settings/SettingsActionButton';
import { toast } from 'sonner';
import { Shield, Plus, Edit, Trash2, Save, RotateCcw, Copy, Users, Search, UserCog, Key, RefreshCw, Eye, EyeOff, Clipboard, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../../../components/ui/dropdown-menu';
import { PERMISSION_GROUPS, PERMISSION_LABELS, type Permission } from '../../employees/permissions';
import { useRoleStore, type CustomRole } from './role-store';
import { useEmployeeStore } from '../../employees/store';
import type { Employee } from '../../employees/types';
import type { EmployeeRole } from '../../employees/roles';

export function EmployeeRolesPage() {
  const { roles, addRole, updateRole, deleteRole, resetRole } = useRoleStore();
  const { data: employees, update: updateEmployee } = useEmployeeStore();
  
  const [activeTab, setActiveTab] = React.useState('roles');
  const [selectedRole, setSelectedRole] = React.useState<CustomRole | null>(null);
  const [editingPermissions, setEditingPermissions] = React.useState<Permission[]>([]);
  const [showPermissionsDialog, setShowPermissionsDialog] = React.useState(false);
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [showEditDialog, setShowEditDialog] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [roleToDelete, setRoleToDelete] = React.useState<CustomRole | null>(null);
  const [roleForm, setRoleForm] = React.useState({ name: '', description: '' });
  
  // Tab 2: Gán vai trò
  const [searchTerm, setSearchTerm] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState<string>('all');
  
  // Password management
  const [showPasswordDialog, setShowPasswordDialog] = React.useState(false);
  const [showResetDialog, setShowResetDialog] = React.useState(false);
  const [selectedEmployee, setSelectedEmployee] = React.useState<Employee | null>(null);
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [generatedPassword, setGeneratedPassword] = React.useState('');

  const tabs = React.useMemo(() => [
    { value: 'roles', label: 'Danh sách vai trò' },
    { value: 'assign', label: 'Gán vai trò' },
  ], []);

  // Page header actions
  const headerActions = React.useMemo(() => {
    if (activeTab === 'roles') {
      return [
        <SettingsActionButton
          key="add"
          onClick={() => {
            setRoleForm({ name: '', description: '' });
            setShowAddDialog(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm vai trò
        </SettingsActionButton>
      ];
    }
    return [];
  }, [activeTab]);

  useSettingsPageHeader({
    title: 'Phân quyền & Tài khoản',
    subtitle: 'Quản lý vai trò và gán quyền cho nhân viên',
    actions: headerActions,
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Cài đặt', href: '/settings', isCurrent: false },
      { label: 'Phân quyền & Tài khoản', href: '', isCurrent: true }
    ]
  });

  // Filter employees for Tab 2
  const filteredEmployees = React.useMemo(() => {
    return employees.filter(emp => {
      const matchSearch = !searchTerm || 
        emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.workEmail?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchRole = roleFilter === 'all' || emp.role === roleFilter;
      
      return matchSearch && matchRole;
    });
  }, [employees, searchTerm, roleFilter]);

  // Count employees by role
  const employeeCountByRole = React.useMemo(() => {
    const counts: Record<string, number> = {};
    employees.forEach(emp => {
      counts[emp.role] = (counts[emp.role] || 0) + 1;
    });
    return counts;
  }, [employees]);

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

  const handleDuplicateRole = (role: CustomRole) => {
    addRole(`${role.name} (Copy)`, role.description);
    toast.success(`Đã sao chép vai trò "${role.name}"`);
  };

  const handleDeleteClick = (role: CustomRole) => {
    // Check if any employee is using this role
    const count = employeeCountByRole[role.id] || 0;
    if (count > 0) {
      toast.error(`Không thể xóa vai trò đang được sử dụng bởi ${count} nhân viên`);
      return;
    }
    setRoleToDelete(role);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (roleToDelete) {
      deleteRole(roleToDelete.id);
      setShowDeleteDialog(false);
      setRoleToDelete(null);
      toast.success('Đã xóa vai trò');
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
    toast.success('Đã thêm vai trò mới');
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
    toast.success('Đã cập nhật thông tin vai trò');
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
    toast.success('Đã lưu cấu hình phân quyền');
  };

  const handleResetRole = (roleId: string) => {
    resetRole(roleId);
    toast.success('Đã khôi phục quyền mặc định');
  };

  const handleChangeEmployeeRole = (employee: Employee, newRole: string) => {
    updateEmployee(employee.systemId, { ...employee, role: newRole as EmployeeRole });
    toast.success(`Đã cập nhật vai trò cho ${employee.fullName}`);
  };

  // Password management handlers
  const generatePassword = (length: number = 12): string => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*';
    const all = uppercase + lowercase + numbers + special;
    
    let password = '';
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];
    
    for (let i = 4; i < length; i++) {
      password += all[Math.floor(Math.random() * all.length)];
    }
    
    return password.split('').sort(() => Math.random() - 0.5).join('');
  };

  const handleOpenPasswordDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setNewPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowPasswordDialog(true);
  };

  const handleOpenResetDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    const pwd = generatePassword(12);
    setGeneratedPassword(pwd);
    setShowResetDialog(true);
  };

  const handleSavePassword = () => {
    if (!selectedEmployee) return;
    
    if (!newPassword) {
      toast.error('Vui lòng nhập mật khẩu');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }
    
    updateEmployee(selectedEmployee.systemId, { ...selectedEmployee, password: newPassword });
    setShowPasswordDialog(false);
    setSelectedEmployee(null);
    toast.success(`Đã đặt mật khẩu cho ${selectedEmployee.fullName}`);
  };

  const handleConfirmReset = () => {
    if (!selectedEmployee) return;
    
    updateEmployee(selectedEmployee.systemId, { ...selectedEmployee, password: generatedPassword });
    setShowResetDialog(false);
    setSelectedEmployee(null);
    toast.success(`Đã reset mật khẩu cho ${selectedEmployee.fullName}`);
  };

  const handleCopyPassword = async (password: string) => {
    try {
      await navigator.clipboard.writeText(password);
      toast.success('Đã sao chép mật khẩu');
    } catch {
      toast.error('Không thể sao chép');
    }
  };

  const handleGeneratePassword = () => {
    const pwd = generatePassword(12);
    setNewPassword(pwd);
    setConfirmPassword(pwd);
    setShowPassword(true);
  };

  const getRoleBadgeVariant = (roleId: string) => {
    switch (roleId) {
      case 'Admin': return 'destructive' as const;
      case 'Manager': return 'default' as const;
      case 'Sales': return 'secondary' as const;
      case 'Warehouse': return 'outline' as const;
      default: return 'secondary' as const;
    }
  };

  return (
    <>
      <SettingsVerticalTabs value={activeTab} onValueChange={setActiveTab} tabs={tabs}>
        {/* Tab 1: Danh sách vai trò */}
        <TabsContent value="roles" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách vai trò</CardTitle>
              <CardDescription>Quản lý các vai trò và quyền hạn trong hệ thống</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Tên vai trò</TableHead>
                      <TableHead className="w-[250px]">Mô tả</TableHead>
                      <TableHead className="w-[100px] text-center">Số quyền</TableHead>
                      <TableHead className="w-[120px] text-center">Nhân viên</TableHead>
                      <TableHead className="w-[100px] text-center">Loại</TableHead>
                      <TableHead className="w-[180px] text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{role.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {role.description}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{role.permissions.length}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">
                            <Users className="h-3 w-3 mr-1" />
                            {employeeCountByRole[role.id] || 0}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {role.isDefault ? (
                            <Badge variant="outline" className="text-xs">Mặc định</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">Tùy chỉnh</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEditRoleInfo(role)}
                              title="Sửa thông tin"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleDuplicateRole(role)}
                              title="Sao chép"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-primary"
                              onClick={() => handleEditRole(role)}
                              title="Phân quyền"
                            >
                              <Shield className="h-4 w-4" />
                            </Button>
                            {role.isDefault ? (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                onClick={() => handleResetRole(role.id)}
                                title="Khôi phục mặc định"
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => handleDeleteClick(role)}
                                title="Xóa vai trò"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {roles.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          Chưa có vai trò nào. Thêm vai trò mới để bắt đầu.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="bg-muted/50 mt-6">
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
                  <li><strong>Xóa vai trò:</strong> Chỉ xóa được vai trò tùy chỉnh không có nhân viên nào</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Gán vai trò */}
        <TabsContent value="assign" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Gán vai trò cho nhân viên</CardTitle>
              <CardDescription>Quản lý vai trò của từng nhân viên trong hệ thống</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm theo tên, mã NV, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Lọc theo vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả vai trò</SelectItem>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name} ({employeeCountByRole[role.id] || 0})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Employee Table */}
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Mã NV</TableHead>
                      <TableHead>Họ và tên</TableHead>
                      <TableHead className="w-[200px]">Email</TableHead>
                      <TableHead className="w-[150px]">Phòng ban</TableHead>
                      <TableHead className="w-[180px]">Vai trò</TableHead>
                      <TableHead className="w-[100px] text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee.systemId}>
                        <TableCell className="font-medium">{employee.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <UserCog className="h-4 w-4 text-muted-foreground" />
                            {employee.fullName}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {employee.workEmail || '—'}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {employee.departmentId || '—'}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={employee.role}
                            onValueChange={(value) => handleChangeEmployeeRole(employee, value)}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue>
                                <Badge variant={getRoleBadgeVariant(employee.role)}>
                                  {roles.find(r => r.id === employee.role)?.name || employee.role}
                                </Badge>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem key={role.id} value={role.id}>
                                  <div className="flex items-center gap-2">
                                    <Badge variant={getRoleBadgeVariant(role.id)} className="text-xs">
                                      {role.name}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {role.description}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleOpenPasswordDialog(employee)}>
                                <Key className="h-4 w-4 mr-2" />
                                Đặt mật khẩu
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleOpenResetDialog(employee)}>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Reset mật khẩu
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredEmployees.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          {searchTerm || roleFilter !== 'all' 
                            ? 'Không tìm thấy nhân viên phù hợp'
                            : 'Chưa có nhân viên nào trong hệ thống'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Summary */}
              <div className="flex flex-wrap gap-2 pt-2">
                {roles.map((role) => (
                  <Badge key={role.id} variant="outline" className="text-xs">
                    {role.name}: {employeeCountByRole[role.id] || 0} nhân viên
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </SettingsVerticalTabs>

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

      {/* Set Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Đặt mật khẩu
            </DialogTitle>
            <DialogDescription>
              Đặt mật khẩu đăng nhập cho {selectedEmployee?.fullName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">Mật khẩu mới</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu mới..."
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pr-20"
                />
                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleCopyPassword(newPassword)}
                    disabled={!newPassword}
                    title="Sao chép"
                  >
                    <Clipboard className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
              <Input
                id="confirm-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập lại mật khẩu..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGeneratePassword}
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Tạo mật khẩu ngẫu nhiên
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleSavePassword}>
              <Save className="h-4 w-4 mr-2" />
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Reset mật khẩu
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <span>Bạn có chắc muốn reset mật khẩu cho <strong>{selectedEmployee?.fullName}</strong>?</span>
              <div className="bg-muted p-3 rounded-md space-y-2">
                <p className="text-sm font-medium text-foreground">Mật khẩu mới:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-background px-3 py-2 rounded border text-sm font-mono">
                    {generatedPassword}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setGeneratedPassword(generatePassword(12))}
                    title="Tạo mật khẩu khác"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleCopyPassword(generatedPassword)}
                    title="Sao chép"
                  >
                    <Clipboard className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Hãy sao chép và gửi mật khẩu này cho nhân viên
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmReset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Xác nhận reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
