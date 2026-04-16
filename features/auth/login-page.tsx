'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';
import { ROUTES } from '../../lib/router';
import { logError } from '@/lib/logger'

export function LoginPage() {
  const _router = useRouter();
  
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  // OTP state
  const [showOtp, setShowOtp] = React.useState(false);
  const [otp, setOtp] = React.useState('');
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [countdown, setCountdown] = React.useState(0);

  // Get the page user was trying to access
  const from = ROUTES.DASHBOARD;

  // Countdown timer
  React.useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

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
        return;
      }
      
      if (!result?.ok) {
        toast.error('Đã xảy ra lỗi không xác định');
        return;
      }

      // Check OTP requirement
      try {
        const otpRes = await fetch('/api/auth/login-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const otpData = await otpRes.json();

        if (otpData.required) {
          setShowOtp(true);
          setCountdown(60);
          toast.info('Mã OTP đã được gửi đến email của bạn');
          return;
        }
      } catch {
        // If OTP check fails, proceed normally
      }

      // No OTP required - redirect
      toast.success('Đăng nhập thành công!');
      window.location.href = from;
    } catch (error) {
      logError('[Login] Error', error);
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return;

    setIsVerifying(true);
    try {
      const res = await fetch('/api/auth/login-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', email, otp }),
      });
      const data = await res.json();

      if (data.verified) {
        toast.success('Đăng nhập thành công!');
        window.location.href = from;
      } else {
        toast.error(data.error || 'Mã OTP không đúng');
        setOtp('');
      }
    } catch {
      toast.error('Lỗi xác thực OTP');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    try {
      await fetch('/api/auth/login-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setCountdown(60);
      setOtp('');
      toast.info('Đã gửi lại mã OTP');
    } catch {
      toast.error('Không thể gửi lại mã OTP');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle size="lg">Đăng nhập</CardTitle>
          <CardDescription>
            {showOtp
              ? <>Nhập mã OTP đã gửi đến <strong>{email}</strong></>
              : 'Nhập email và mật khẩu để đăng nhập'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            {!showOtp && (
              <>
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
                    <Link
                      href="/login/forgot-password"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Quên mật khẩu?
                    </Link>
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
              </>
            )}

            {showOtp && (
              <>
                {/* OTP Input inline */}
                <div className="space-y-3">
                  <Label>Mã xác thực OTP</Label>
                  <div className="flex justify-center">
                    <InputOTP maxLength={6} value={otp} onChange={setOtp} autoFocus>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>

                <Button
                  className="w-full"
                  disabled={otp.length !== 6 || isVerifying}
                  onClick={handleVerifyOtp}
                >
                  {isVerifying ? 'Đang xác thực...' : 'Xác nhận OTP'}
                </Button>

                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    className="text-muted-foreground hover:underline"
                    onClick={() => {
                      setShowOtp(false);
                      setOtp('');
                    }}
                  >
                    ← Quay lại
                  </button>
                  {countdown > 0 ? (
                    <span className="text-muted-foreground">Gửi lại sau {countdown}s</span>
                  ) : (
                    <button
                      type="button"
                      className="text-primary hover:underline"
                      onClick={handleResendOtp}
                    >
                      Gửi lại mã OTP
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
