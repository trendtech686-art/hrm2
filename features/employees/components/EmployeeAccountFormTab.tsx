import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from 'sonner';
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

interface EmployeeAccountFormTabProps {
  workEmail: string;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  isEditMode: boolean;
}

/**
 * Tạo mật khẩu ngẫu nhiên mạnh
 */
const generatePassword = (length: number = 12): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';
  const allChars = uppercase + lowercase + numbers + symbols;
  
  let pass = '';
  pass += uppercase[Math.floor(Math.random() * uppercase.length)];
  pass += lowercase[Math.floor(Math.random() * lowercase.length)];
  pass += numbers[Math.floor(Math.random() * numbers.length)];
  pass += symbols[Math.floor(Math.random() * symbols.length)];
  
  for (let i = pass.length; i < length; i++) {
    pass += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  return pass.split('').sort(() => Math.random() - 0.5).join('');
};

export function EmployeeAccountFormTab({
  workEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  isEditMode,
}: EmployeeAccountFormTabProps) {
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

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-4">Thông tin đăng nhập</h3>
      
      <Card className="mb-6">
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label>Email đăng nhập</Label>
            <Input 
              value={workEmail || ''} 
              disabled 
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Email công việc được sử dụng làm tên đăng nhập
            </p>
          </div>

          {!password && !isEditMode && (
            <div className="rounded-lg border border-orange-200 p-3 bg-orange-50 dark:bg-orange-950/20">
              <p className="text-sm text-orange-800 dark:text-orange-200">
                Chưa có mật khẩu. Nhân viên chưa thể đăng nhập hệ thống.
              </p>
            </div>
          )}

          {password && isEditMode && (
            <div className="rounded-lg border p-3 bg-muted/50">
              <p className="text-sm text-muted-foreground">
                Mật khẩu đã được thiết lập. Để thay đổi, nhập mật khẩu mới bên dưới.
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
              <li>Sử dụng nút "Tạo tự động" để tạo mật khẩu mạnh</li>
              <li>Nhớ copy và gửi mật khẩu cho nhân viên</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
