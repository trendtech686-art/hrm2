'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { toast } from 'sonner';
import { ROUTES } from '../../lib/router';

// Test accounts (từ seed.ts)
const TEST_ACCOUNTS = [
  { email: 'admin@erp.local', password: 'password123', role: 'Admin', name: 'Quản trị viên' },
  { email: 'sales@erp.local', password: 'password123', role: 'Sales', name: 'Nhân viên bán hàng' },
];

export function LoginPage() {
  const _router = useRouter();
  
  const [selectedAccountIndex, setSelectedAccountIndex] = React.useState(0);
  const [email, setEmail] = React.useState(TEST_ACCOUNTS[0].email);
  const [password, setPassword] = React.useState(TEST_ACCOUNTS[0].password);
  const [isLoading, setIsLoading] = React.useState(false);

  // Get the page user was trying to access
  const from = ROUTES.DASHBOARD;

  // Auto-fill when account selection changes
  React.useEffect(() => {
    const selectedAccount = TEST_ACCOUNTS[selectedAccountIndex];
    setEmail(selectedAccount.email);
    setPassword(selectedAccount.password);
  }, [selectedAccountIndex]);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error('Vui lòng nhập email và mật khẩu');
      return;
    }

    setIsLoading(true);

    try {
      
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      
      
      if (result?.error) {
        toast.error('Email hoặc mật khẩu không đúng');
      } else if (result?.ok) {
        toast.success('Đăng nhập thành công!');
        // Use window.location for hard redirect to ensure session is refreshed
        window.location.href = from;
      } else {
        toast.error('Đã xảy ra lỗi không xác định');
      }
    } catch (error) {
      console.error('[Login] Error:', error);
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle size="lg">Đăng nhập</CardTitle>
          <CardDescription>
            Chọn tài khoản test hoặc nhập thông tin đăng nhập
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            {/* Test Account Selection */}
            <div className="grid gap-2">
              <Label>Tài khoản test</Label>
              <RadioGroup 
                value={selectedAccountIndex.toString()} 
                onValueChange={(value) => setSelectedAccountIndex(parseInt(String(value)))}
              >
                {TEST_ACCOUNTS.map((account, index) => (
                  <div key={account.email} className="flex items-center space-x-2">
                    <RadioGroupItem value={index.toString()} id={`acc-${index}`} />
                    <Label htmlFor={`acc-${index}`} className="font-normal cursor-pointer">
                      {account.role} - {account.name} ({account.email})
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleLogin();
                  }
                }}
              />
            </div>

            {/* Submit Button */}
            <Button 
              className="w-full" 
              disabled={isLoading}
              onClick={handleLogin}
            >
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
        </CardContent>
      </Card>
    </div>
  );
}
