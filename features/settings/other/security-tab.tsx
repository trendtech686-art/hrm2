'use client';

import * as React from 'react';
import { Save, Shield, Mail, Smartphone, MessageSquare, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { SettingsActionButton } from '@/components/settings/SettingsActionButton';
import { toast } from 'sonner';
import type { TabContentProps } from './types';

interface LocalSecuritySettings {
  minPasswordLength: number;
  requireUppercase: boolean;
  requireNumber: boolean;
  requireSpecialChar: boolean;
  sessionTimeoutMinutes: number;
  maxLoginAttempts: number;
  enableTwoFactor: boolean;
  twoFactorMethod: 'email' | 'app' | 'sms';
  enableOtpEmail: boolean;
  otpEmailExpireMinutes: number;
}

const LOCAL_DEFAULT_SECURITY_SETTINGS: LocalSecuritySettings = {
  minPasswordLength: 6,
  requireUppercase: false,
  requireNumber: false,
  requireSpecialChar: false,
  sessionTimeoutMinutes: 0, // 0 = no timeout
  maxLoginAttempts: 5,
  enableTwoFactor: false,
  twoFactorMethod: 'email',
  enableOtpEmail: false,
  otpEmailExpireMinutes: 5,
};

const SECURITY_PREFERENCE_KEY = 'local-security-settings';

export function SecurityTabContent({ isActive, onRegisterActions }: TabContentProps) {
  const [settings, setSettings] = React.useState<LocalSecuritySettings>(LOCAL_DEFAULT_SECURITY_SETTINGS);
  const [isSaving, setIsSaving] = React.useState(false);
  const [hasChanges, setHasChanges] = React.useState(false);
  const [_isLoading, setIsLoading] = React.useState(true);
  const originalSettings = React.useRef(JSON.stringify(settings));
  
  // Load from API on mount
  React.useEffect(() => {
    const loadFromAPI = async () => {
      try {
        const response = await fetch(`/api/user-preferences?category=system-settings&key=${SECURITY_PREFERENCE_KEY}`);
        if (response.ok) {
          const data = await response.json();
          if (data.value) {
            const loaded = { ...LOCAL_DEFAULT_SECURITY_SETTINGS, ...data.value };
            setSettings(loaded);
            originalSettings.current = JSON.stringify(loaded);
          }
        }
      } catch (error) {
        console.error('[SecurityTabContent] Failed to load:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadFromAPI();
  }, []);
  
  React.useEffect(() => {
    setHasChanges(JSON.stringify(settings) !== originalSettings.current);
  }, [settings]);
  
  const handleChange = <K extends keyof LocalSecuritySettings>(key: K, value: LocalSecuritySettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSave = React.useCallback(async () => {
    setIsSaving(true);
    try {
      await fetch('/api/user-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'system-settings',
          key: SECURITY_PREFERENCE_KEY,
          value: settings,
        }),
      });
      originalSettings.current = JSON.stringify(settings);
      toast.success('Đã lưu cài đặt bảo mật');
      setHasChanges(false);
    } catch (_error) {
      toast.error('Có lỗi xảy ra khi lưu cài đặt');
    } finally {
      setIsSaving(false);
    }
  }, [settings]);
  
  React.useEffect(() => {
    if (!isActive) return;
    onRegisterActions([
      <SettingsActionButton key="save-security" onClick={handleSave} disabled={!hasChanges || isSaving}>
        <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
      </SettingsActionButton>,
    ]);
  }, [isActive, hasChanges, isSaving, handleSave, onRegisterActions]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Quy tắc mật khẩu
          </CardTitle>
          <CardDescription>Cấu hình yêu cầu cho mật khẩu người dùng</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 max-w-xs">
            <Label htmlFor="minPasswordLength">Độ dài tối thiểu</Label>
            <div className="flex items-center gap-2">
              <Slider id="minPasswordLength" min={4} max={20} step={1} value={[settings.minPasswordLength]} onValueChange={([val]) => handleChange('minPasswordLength', val)} className="flex-1" />
              <Badge variant="secondary">{settings.minPasswordLength} ký tự</Badge>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Yêu cầu chữ in hoa</Label>
              <p className="text-sm text-muted-foreground">Mật khẩu phải chứa ít nhất 1 chữ in hoa (A-Z)</p>
            </div>
            <Switch checked={settings.requireUppercase} onCheckedChange={(val) => handleChange('requireUppercase', val)} />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Yêu cầu số</Label>
              <p className="text-sm text-muted-foreground">Mật khẩu phải chứa ít nhất 1 chữ số (0-9)</p>
            </div>
            <Switch checked={settings.requireNumber} onCheckedChange={(val) => handleChange('requireNumber', val)} />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Yêu cầu ký tự đặc biệt</Label>
              <p className="text-sm text-muted-foreground">Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt (!@#$...)</p>
            </div>
            <Switch checked={settings.requireSpecialChar} onCheckedChange={(val) => handleChange('requireSpecialChar', val)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Phiên đăng nhập</CardTitle>
          <CardDescription>Cấu hình bảo mật phiên làm việc</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Tự động đăng xuất sau (phút)</Label>
              <Input id="sessionTimeout" type="number" min={0} max={480} value={settings.sessionTimeoutMinutes} onChange={(e) => handleChange('sessionTimeoutMinutes', parseInt(e.target.value) || 0)} />
              <p className="text-xs text-muted-foreground">Đặt 0 để tắt tự động đăng xuất</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxLoginAttempts">Số lần đăng nhập sai tối đa</Label>
              <Input id="maxLoginAttempts" type="number" min={1} max={10} value={settings.maxLoginAttempts} onChange={(e) => handleChange('maxLoginAttempts', parseInt(e.target.value) || 5)} />
              <p className="text-xs text-muted-foreground">Khóa tài khoản sau số lần này</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Xác thực 2 yếu tố (2FA)</Label>
              <p className="text-sm text-muted-foreground">Yêu cầu xác thực bổ sung khi đăng nhập</p>
            </div>
            <Switch checked={settings.enableTwoFactor} onCheckedChange={(val) => handleChange('enableTwoFactor', val)} />
          </div>

          {settings.enableTwoFactor && (
            <>
              <div className="ml-6 p-4 rounded-lg border bg-muted/30 space-y-4">
                <Label className="text-sm font-medium">Phương thức xác thực</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div 
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${settings.twoFactorMethod === 'email' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                    onClick={() => handleChange('twoFactorMethod', 'email')}
                  >
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span className="font-medium">Email OTP</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Gửi mã OTP qua email</p>
                  </div>
                  <div 
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${settings.twoFactorMethod === 'app' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                    onClick={() => handleChange('twoFactorMethod', 'app')}
                  >
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      <span className="font-medium">Authenticator App</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Google/Microsoft Auth</p>
                  </div>
                  <div 
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${settings.twoFactorMethod === 'sms' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                    onClick={() => handleChange('twoFactorMethod', 'sms')}
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <span className="font-medium">SMS OTP</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Gửi mã qua tin nhắn</p>
                  </div>
                </div>
              </div>
            </>
          )}

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">OTP qua Email khi đăng nhập</Label>
              <p className="text-sm text-muted-foreground">Gửi mã xác thực một lần qua email Gmail</p>
            </div>
            <Switch checked={settings.enableOtpEmail} onCheckedChange={(val) => handleChange('enableOtpEmail', val)} />
          </div>

          {settings.enableOtpEmail && (
            <div className="ml-6 p-4 rounded-lg border bg-muted/30 space-y-4">
              <div className="space-y-2 max-w-xs">
                <Label>Thời gian hết hạn OTP (phút)</Label>
                <Select 
                  value={String(settings.otpEmailExpireMinutes)} 
                  onValueChange={(val) => handleChange('otpEmailExpireMinutes', parseInt(val))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 phút</SelectItem>
                    <SelectItem value="5">5 phút</SelectItem>
                    <SelectItem value="10">10 phút</SelectItem>
                    <SelectItem value="15">15 phút</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    <p className="font-medium">Yêu cầu cấu hình SMTP</p>
                    <p className="text-xs mt-1">Đảm bảo đã cấu hình Email SMTP trong tab "Email SMTP" để gửi OTP</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
