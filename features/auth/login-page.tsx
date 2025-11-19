import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/button.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Input } from '../../components/ui/input.tsx';
import { Label } from '../../components/ui/label.tsx';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group.tsx';
import { toast } from 'sonner';
import { ROUTES } from '../../lib/router.ts';
import { useAuth } from '../../contexts/auth-context.tsx';
import { useEmployeeStore } from '../employees/store.ts';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { data: employees, findById } = useEmployeeStore();
  
  // Lấy 2 nhân viên đầu tiên có email và password
  const availableEmployees = React.useMemo(() => {
    return employees
      .filter(emp => emp.workEmail && emp.password)
      .slice(0, 2);
  }, [employees]);

  const [selectedEmployeeIndex, setSelectedEmployeeIndex] = React.useState(0);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  // Get the page user was trying to access
  const from = (location.state as any)?.from || ROUTES.DASHBOARD;

  // Auto-fill when employee selection changes
  React.useEffect(() => {
    if (availableEmployees.length > 0) {
      const selectedEmployee = availableEmployees[selectedEmployeeIndex];
      setEmail(selectedEmployee.workEmail || '');
      setPassword(selectedEmployee.password || '');
    }
  }, [selectedEmployeeIndex, availableEmployees]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Tìm employee với email và password khớp
      const employee = employees.find(
        emp => emp.workEmail === email && emp.password === password
      );
      
      if (employee) {
        // Xác định role (có thể dựa vào employee.role hoặc logic khác)
        const role = employee.role === 'Admin' ? 'admin' : 'user';
        
        // Login with employee data
        login({
          email: employee.workEmail || email,
          name: employee.fullName,
          role: role,
          employeeId: employee.systemId
        });
        
        toast.success(`Đăng nhập thành công! Chào mừng ${employee.fullName}`);
        navigate(from, { replace: true });
      } else {
        toast.error('Email hoặc mật khẩu không đúng');
      }
      
      setIsLoading(false);
    }, 1000);
  };

  if (availableEmployees.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Không có tài khoản</CardTitle>
            <CardDescription>
              Chưa có nhân viên nào được cấu hình email và mật khẩu
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Đăng nhập</CardTitle>
          <CardDescription>
            Chọn loại tài khoản để tự động điền thông tin đăng nhập
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {/* Employee Selection */}
              <div className="grid gap-2">
                <Label>Loại tài khoản (Test)</Label>
                <RadioGroup 
                  value={selectedEmployeeIndex.toString()} 
                  onValueChange={(value) => setSelectedEmployeeIndex(parseInt(String(value)))}
                >
                  {availableEmployees.map((emp, index) => (
                    <div key={emp.systemId} className="flex items-center space-x-2">
                      <RadioGroupItem value={index.toString()} id={`emp-${index}`} />
                      <Label htmlFor={`emp-${index}`} className="font-normal cursor-pointer">
                        {emp.role || 'User'} - {emp.fullName} ({emp.workEmail})
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      toast.info('Tính năng quên mật khẩu đang phát triển');
                    }}
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Quên mật khẩu?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>

              {/* Google Login */}
              <Button 
                type="button"
                variant="outline" 
                className="w-full"
                onClick={() => toast.info('Tính năng đăng nhập với Google đang phát triển')}
              >
                Đăng nhập với Google
              </Button>
            </div>

            {/* Sign up link */}
            <div className="mt-4 text-center text-sm">
              Chưa có tài khoản?{' '}
              <a 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  toast.info('Tính năng đăng ký đang phát triển');
                }}
                className="underline underline-offset-4 hover:text-primary"
              >
                Đăng ký ngay
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
