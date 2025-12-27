import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Eye, EyeOff, RefreshCw, Copy, ShieldAlert } from 'lucide-react';
import type { Employee } from '@/lib/types/prisma-extended';
import type { EmployeeRole } from './roles';
import { useEmployeeStore } from './store';
import { useAuth } from '../../contexts/auth-context';
import { toast } from 'sonner';
import { hashPassword, validatePasswordStrength, sanitizeInput } from '../../lib/security-utils';

interface EmployeeAccountTabProps {
  employee: Employee;
}

const getRoleLabel = (role: EmployeeRole): string => {
  switch (role) {
    case 'Admin': return 'Quản trị viên';
    case 'Manager': return 'Quản lý';
    case 'Sales': return 'Kinh doanh';
    case 'Warehouse': return 'Kho';
    default: return role;
  }
};

const getRoleDescription = (role: EmployeeRole): string => {
  switch (role) {
    case 'Admin': return 'Toàn quyền hệ thống';
    case 'Manager': return 'Quản lý phòng ban';
    case 'Sales': return 'Nhân viên kinh doanh';
    case 'Warehouse': return 'Nhân viên kho';
    default: return '';
  }
};

const getRoleBadgeVariant = (role: EmployeeRole) => {
  switch (role) {
    case 'Admin': return 'destructive' as const;
    case 'Manager': return 'default' as const;
    case 'Sales': return 'secondary' as const;
    case 'Warehouse': return 'outline' as const;
    default: return 'secondary' as const;
  }
};

// Hàm tạo mật khẩu ngẫu nhiên
const generatePassword = (length: number = 12): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';
  const allChars = uppercase + lowercase + numbers + symbols;
  
  let password = '';
  // Đảm bảo có ít nhất 1 ký tự mỗi loại
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Thêm các ký tự ngẫu nhiên còn lại
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Trộn ngẫu nhiên
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

export function EmployeeAccountTab({ employee }: EmployeeAccountTabProps) {
  const { update } = useEmployeeStore();
  const { user: currentUser } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [selectedRole, setSelectedRole] = React.useState<EmployeeRole>(employee.role);

  // Check if current user can change roles (only Admin can)
  const canChangeRole = currentUser?.role === 'admin';
  // Check if trying to edit own account
  const isOwnAccount = currentUser?.employeeId === employee.systemId;

  const handleGeneratePassword = () => {
    const newPassword = generatePassword(12);
    setPassword(newPassword);
    setConfirmPassword(newPassword);
    setShowPassword(true);
    toast.success('Đã tạo mật khẩu ngẫu nhiên');
  };

  const handleCopyPassword = async () => {
    if (!password) {
      toast.error('Chưa có mật khẩu để copy');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(password);
      toast.success('Đã copy mật khẩu vào clipboard');
    } catch (err) {
      toast.error('Không thể copy mật khẩu');
    }
  };

  const handleSave = async () => {
    if (password || confirmPassword) {
      // Use centralized password validation
      const validation = validatePasswordStrength(password);
      if (!validation.isValid) {
        toast.error(validation.errors[0]);
        return;
      }
      if (password !== confirmPassword) {
        toast.error('Mật khẩu xác nhận không khớp');
        return;
      }
    }

    const updates: Partial<Employee> = {
      role: selectedRole,
    };

    if (password) {
      // Hash password before storing (client-side protection)
      // Real hashing should be done server-side with bcrypt
      updates.password = await hashPassword(password);
    }

    update(employee.systemId, { ...employee, ...updates });

    toast.success('Đã cập nhật thông tin đăng nhập');
    
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-h5">
            Thông tin đăng nhập
          </CardTitle>
          <CardDescription>
            Cấu hình tài khoản và quyền truy cập hệ thống cho nhân viên
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Email đăng nhập</Label>
            <Input 
              value={employee.workEmail} 
              disabled 
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Email công việc được sử dụng làm tên đăng nhập
            </p>
          </div>

          <div className="space-y-2">
            <Label>Vai trò hiện tại</Label>
            <div>
              <Badge variant={getRoleBadgeVariant(employee.role)} className="text-sm">
                {getRoleLabel(employee.role)}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Thay đổi vai trò</Label>
            {canChangeRole ? (
              <>
                <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as EmployeeRole)}>
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sales">
                      <div className="flex flex-col items-start py-1">
                        <span className="font-medium">{getRoleLabel('Sales')}</span>
                        <span className="text-xs text-muted-foreground">{getRoleDescription('Sales')}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Warehouse">
                      <div className="flex flex-col items-start py-1">
                        <span className="font-medium">{getRoleLabel('Warehouse')}</span>
                        <span className="text-xs text-muted-foreground">{getRoleDescription('Warehouse')}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Manager">
                      <div className="flex flex-col items-start py-1">
                        <span className="font-medium">{getRoleLabel('Manager')}</span>
                        <span className="text-xs text-muted-foreground">{getRoleDescription('Manager')}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Admin">
                      <div className="flex flex-col items-start py-1">
                        <span className="font-medium">{getRoleLabel('Admin')}</span>
                        <span className="text-xs text-muted-foreground">{getRoleDescription('Admin')}</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Vai trò xác định quyền truy cập các chức năng trong hệ thống
                </p>
              </>
            ) : (
              <div className="rounded-lg border border-amber-200 p-3 bg-amber-50 dark:bg-amber-950/20">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                  <ShieldAlert className="h-4 w-4" />
                  <p className="text-sm">
                    Chỉ Admin mới có quyền thay đổi vai trò nhân viên.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-h5">
            Đổi mật khẩu
          </CardTitle>
          <CardDescription>
            {employee.password ? 'Cập nhật mật khẩu đăng nhập' : 'Thiết lập mật khẩu đăng nhập mới'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {employee.password ? (
            <div className="rounded-lg border p-3 bg-muted/50">
              <p className="text-sm text-muted-foreground">
                 Mật khẩu đã được thiết lập. Để thay đổi, nhập mật khẩu mới bên dưới.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-orange-200 p-3 bg-orange-50 dark:bg-orange-950/20">
              <p className="text-sm text-orange-800 dark:text-orange-200">
                 Chưa có mật khẩu. Nhân viên chưa thể đăng nhập hệ thống.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mật khẩu mới</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGeneratePassword}
                >
                  Tạo tự động
                </Button>
                {password && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopyPassword}
                  >
                    Copy
                  </Button>
                )}
              </div>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu mới"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={handleSave}>
              Lưu thay đổi
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
               Lưu ý quan trọng:
            </p>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
              <li>Email công việc được dùng làm tên đăng nhập</li>
              <li>Mật khẩu phải có tối thiểu 6 ký tự</li>
              <li>Vai trò quyết định quyền truy cập các chức năng</li>
              <li>Chỉ Admin mới được thay đổi vai trò nhân viên khác</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
