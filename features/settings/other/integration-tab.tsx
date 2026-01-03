'use client';

import * as React from 'react';
import { Save, Mail, Send, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SettingsActionButton } from '@/components/settings/SettingsActionButton';
import { toast } from 'sonner';
import type { TabContentProps } from './types';

interface LocalIntegrationSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  smtpFromEmail: string;
  smtpFromName: string;
  enableTLS: boolean;
}

const LOCAL_DEFAULT_INTEGRATION_SETTINGS: LocalIntegrationSettings = {
  smtpHost: '',
  smtpPort: 587,
  smtpUser: '',
  smtpPassword: '',
  smtpFromEmail: '',
  smtpFromName: '',
  enableTLS: true,
};

const INTEGRATION_PREFERENCE_KEY = 'local-integration-settings';

export function IntegrationTabContent({ isActive, onRegisterActions }: TabContentProps) {
  const [settings, setSettings] = React.useState<LocalIntegrationSettings>(LOCAL_DEFAULT_INTEGRATION_SETTINGS);
  const [isSaving, setIsSaving] = React.useState(false);
  const [hasChanges, setHasChanges] = React.useState(false);
  const [showToken, setShowToken] = React.useState(false);
  const [_isLoading, setIsLoading] = React.useState(true);
  const originalSettings = React.useRef(JSON.stringify(settings));
  
  // Load from API on mount
  React.useEffect(() => {
    const loadFromAPI = async () => {
      try {
        const response = await fetch(`/api/user-preferences?category=system-settings&key=${INTEGRATION_PREFERENCE_KEY}`);
        if (response.ok) {
          const data = await response.json();
          if (data.value) {
            const loaded = { ...LOCAL_DEFAULT_INTEGRATION_SETTINGS, ...data.value };
            setSettings(loaded);
            originalSettings.current = JSON.stringify(loaded);
          }
        }
      } catch (error) {
        console.error('[IntegrationTabContent] Failed to load:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadFromAPI();
  }, []);
  
  React.useEffect(() => {
    setHasChanges(JSON.stringify(settings) !== originalSettings.current);
  }, [settings]);
  
  const handleChange = <K extends keyof LocalIntegrationSettings>(key: K, value: LocalIntegrationSettings[K]) => {
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
          key: INTEGRATION_PREFERENCE_KEY,
          value: settings,
        }),
      });
      originalSettings.current = JSON.stringify(settings);
      toast.success('Đã lưu cài đặt tích hợp');
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
      <SettingsActionButton key="save-integration" onClick={handleSave} disabled={!hasChanges || isSaving}>
        <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
      </SettingsActionButton>,
    ]);
  }, [isActive, hasChanges, isSaving, handleSave, onRegisterActions]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email SMTP
          </CardTitle>
          <CardDescription>Cấu hình máy chủ gửi email</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtpHost">SMTP Host</Label>
              <Input id="smtpHost" value={settings.smtpHost} onChange={(e) => handleChange('smtpHost', e.target.value)} placeholder="VD: smtp.gmail.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpPort">SMTP Port</Label>
              <Input id="smtpPort" type="number" value={settings.smtpPort} onChange={(e) => handleChange('smtpPort', parseInt(e.target.value) || 587)} placeholder="587" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtpUser">Tên đăng nhập</Label>
              <Input id="smtpUser" value={settings.smtpUser} onChange={(e) => handleChange('smtpUser', e.target.value)} placeholder="your-email@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpPassword">Mật khẩu</Label>
              <div className="flex gap-2">
                <Input id="smtpPassword" type={showToken ? 'text' : 'password'} value={settings.smtpPassword} onChange={(e) => handleChange('smtpPassword', e.target.value)} placeholder="Mật khẩu ứng dụng" className="flex-1" />
                <Button type="button" variant="outline" size="icon" onClick={() => setShowToken(!showToken)}>
                  {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Sử dụng App Password nếu dùng Gmail</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtpFromEmail">Email người gửi</Label>
              <Input id="smtpFromEmail" type="email" value={settings.smtpFromEmail} onChange={(e) => handleChange('smtpFromEmail', e.target.value)} placeholder="noreply@company.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpFromName">Tên người gửi</Label>
              <Input id="smtpFromName" value={settings.smtpFromName} onChange={(e) => handleChange('smtpFromName', e.target.value)} placeholder="HRM System" />
            </div>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Bật TLS/SSL</Label>
              <p className="text-sm text-muted-foreground">Mã hóa kết nối đến máy chủ SMTP</p>
            </div>
            <Switch checked={settings.enableTLS} onCheckedChange={(val) => handleChange('enableTLS', val)} />
          </div>
        </CardContent>
      </Card>

      {/* Test email */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Kiểm tra cấu hình
          </CardTitle>
          <CardDescription>Gửi email test để xác nhận cấu hình SMTP</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input placeholder="Email nhận test..." className="flex-1" />
            <Button variant="outline">
              <Send className="mr-2 h-4 w-4" />
              Gửi email test
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Đảm bảo đã lưu cấu hình trước khi gửi email test
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
