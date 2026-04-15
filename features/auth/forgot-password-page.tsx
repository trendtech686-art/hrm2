'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail, KeyRound, ShieldCheck, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { toast } from 'sonner'
import { logError } from '@/lib/logger'

type Step = 'email' | 'otp' | 'password'

export function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = React.useState<Step>('email')
  const [email, setEmail] = React.useState('')
  const [otp, setOtp] = React.useState('')
  const [newPassword, setNewPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [countdown, setCountdown] = React.useState(0)

  // Countdown timer cho nút gửi lại OTP
  React.useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => setCountdown(c => c - 1), 1000)
    return () => clearInterval(timer)
  }, [countdown])

  const handleSendOTP = async () => {
    if (!email || !email.includes('@')) {
      toast.error('Vui lòng nhập email hợp lệ')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || data.message || 'Có lỗi xảy ra')
        return
      }

      toast.success('Mã OTP đã được gửi đến email của bạn')
      setStep('otp')
      setCountdown(60)
    } catch (error) {
      logError('[ForgotPassword] Send OTP failed', error)
      toast.error('Không thể gửi yêu cầu. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyAndReset = async () => {
    if (otp.length !== 6) {
      toast.error('Vui lòng nhập đủ 6 số OTP')
      return
    }
    if (!newPassword) {
      toast.error('Vui lòng nhập mật khẩu mới')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          otp,
          newPassword,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || data.message || 'Có lỗi xảy ra')
        return
      }

      toast.success('Đặt lại mật khẩu thành công!')
      setStep('password') // Show success state
      // Redirect after 2s
      setTimeout(() => router.push('/login'), 2000)
    } catch (error) {
      logError('[ForgotPassword] Reset failed', error)
      toast.error('Không thể đặt lại mật khẩu. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (countdown > 0) return
    await handleSendOTP()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <CardTitle size="lg">
                {step === 'email' && 'Quên mật khẩu'}
                {step === 'otp' && 'Nhập mã xác nhận'}
                {step === 'password' && 'Thành công!'}
              </CardTitle>
              <CardDescription>
                {step === 'email' && 'Nhập email để nhận mã xác nhận'}
                {step === 'otp' && `Mã OTP đã gửi đến ${email}`}
                {step === 'password' && 'Mật khẩu đã được đặt lại'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Step 1: Nhập email */}
          {step === 'email' && (
            <div className="flex flex-col gap-4">
              <div className="mx-auto rounded-full bg-primary/10 p-3">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your-email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendOTP()}
                  disabled={isLoading}
                />
              </div>
              <Button className="w-full" onClick={handleSendOTP} disabled={isLoading || !email}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  'Gửi mã xác nhận'
                )}
              </Button>
            </div>
          )}

          {/* Step 2: Nhập OTP + Mật khẩu mới */}
          {step === 'otp' && (
            <div className="flex flex-col gap-4">
              <div className="mx-auto rounded-full bg-primary/10 p-3">
                <KeyRound className="h-6 w-6 text-primary" />
              </div>

              {/* OTP Input */}
              <div className="grid gap-2">
                <Label>Mã xác nhận (6 số)</Label>
                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
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
                <div className="text-center">
                  {countdown > 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Gửi lại sau {countdown}s
                    </p>
                  ) : (
                    <button
                      onClick={handleResendOTP}
                      className="text-sm text-primary hover:underline"
                      disabled={isLoading}
                    >
                      Gửi lại mã OTP
                    </button>
                  )}
                </div>
              </div>

              {/* New Password */}
              <div className="grid gap-2">
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Nhập mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Nhập lại mật khẩu mới"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerifyAndReset()}
                  disabled={isLoading}
                />
              </div>

              <Button className="w-full" onClick={handleVerifyAndReset} disabled={isLoading || otp.length !== 6 || !newPassword}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  'Đặt lại mật khẩu'
                )}
              </Button>

              <Button variant="ghost" className="w-full" onClick={() => { setStep('email'); setOtp(''); }}>
                Đổi email khác
              </Button>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 'password' && (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="rounded-full bg-green-100 p-3">
                <ShieldCheck className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-center text-muted-foreground">
                Đang chuyển hướng về trang đăng nhập...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
