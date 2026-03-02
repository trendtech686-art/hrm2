'use client'

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../../components/ui/input-otp';
import { toast } from 'sonner';
import { ROUTES } from '../../lib/router';

const CORRECT_OTP = '123456'; // Mock OTP for testing

export function OtpVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [otp, setOtp] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [countdown, setCountdown] = React.useState(60);
  const [canResend, setCanResend] = React.useState(false);

  const email = searchParams.get('email') || 'user@example.com';
  const from = searchParams.get('from') || 'login';

  // Countdown timer for resend
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error('Vui lòng nhập đủ 6 chữ số');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (otp === CORRECT_OTP) {
        toast.success('Xác thực OTP thành công!');
        
        if (from === 'signup') {
          // NOTE: In production, OTP verification should be handled by NextAuth
          // This is demo code - actual auth state is managed by NextAuth session
          router.push(ROUTES.DASHBOARD);
        } else {
          // For password reset or other flows
          toast.info('OTP đã được xác thực');
          router.push('/login');
        }
      } else {
        toast.error('Mã OTP không đúng. Vui lòng thử lại.date');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleResend = () => {
    if (!canResend) return;
    
    // Simulate resending OTP
    toast.success('Mã OTP mới đã được gửi đến email của bạn');
    setCountdown(60);
    setCanResend(false);
    setOtp('');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle size="lg">Xác thực OTP</CardTitle>
          <CardDescription>
            Nhập mã OTP 6 chữ số đã được gửi đến email<br />
            <span className="font-semibold">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            {/* OTP Input */}
            <div className="flex flex-col items-center gap-4">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
                disabled={isLoading}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>

              <div className="text-sm text-muted-foreground text-center">
                {from === 'signup' && (
                  <p className="mb-2 text-green-600 font-medium">
                    💡 Mã OTP test: <span className="font-mono font-bold">123456</span>
                  </p>
                )}
                <p>Nhập mã OTP 6 chữ số</p>
              </div>
            </div>

            {/* Verify Button */}
            <Button
              onClick={handleVerify}
              className="w-full"
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? 'Đang xác thực...' : 'Xác thực'}
            </Button>

            {/* Resend OTP */}
            <div className="text-center text-sm">
              {canResend ? (
                <button
                  onClick={handleResend}
                  className="text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  Gửi lại mã OTP
                </button>
              ) : (
                <span className="text-muted-foreground">
                  Gửi lại mã sau {countdown}s
                </span>
              )}
            </div>

            {/* Back to login */}
            <div className="text-center text-sm">
              <a
                href="/login"
                onClick={(e) => {
                  e.preventDefault();
                  router.push('/login');
                }}
                className="text-muted-foreground underline underline-offset-4 hover:text-primary"
              >
                Quay lại đăng nhập
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
