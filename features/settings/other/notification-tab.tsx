'use client';

import * as React from 'react';
import { Bell, Save, Send } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { SettingsActionButton } from '@/components/settings/SettingsActionButton';
import { useNotificationSettings } from '@/hooks/use-due-date-notifications';
import { toast } from 'sonner';
import type { TabContentProps } from './types';

export function NotificationTabContent({ isActive, onRegisterActions }: TabContentProps) {
  const { getSettings, saveSettings, resetSettings: _resetSettings } = useNotificationSettings();
  const [settings, setSettings] = React.useState(getSettings());
  const [hasChanges, setHasChanges] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [hasDesktopPermission, setHasDesktopPermission] = React.useState(
    typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted'
  );

  React.useEffect(() => {
    const current = getSettings();
    const isDifferent = JSON.stringify(current) !== JSON.stringify(settings);
    setHasChanges(isDifferent);
  }, [settings, getSettings]);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleIntervalChange = (value: number[]) => {
    setSettings(prev => ({ ...prev, checkInterval: value[0] }));
  };

  const handleSave = React.useCallback(() => {
    setIsSaving(true);
    try {
      saveSettings(settings);
      setHasChanges(false);
      toast.success('Đã lưu cài đặt thông báo');
    } catch (_error) {
      toast.error('Có lỗi xảy ra khi lưu cài đặt');
    } finally {
      setIsSaving(false);
    }
  }, [settings, saveSettings]);

  const handleRequestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setHasDesktopPermission(permission === 'granted');
      if (permission === 'granted') {
        toast.success('Đã cấp quyền thông báo desktop');
      } else {
        toast.error('Không được cấp quyền thông báo desktop');
      }
    }
  };

  // Register header actions
  React.useEffect(() => {
    if (!isActive) return;
    onRegisterActions([
      <SettingsActionButton 
        key="save-notification"
        onClick={handleSave} 
        disabled={!hasChanges || isSaving}
      >
        <Save className="mr-2 h-4 w-4" /> 
        {isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
      </SettingsActionButton>,
    ]);
  }, [isActive, hasChanges, isSaving, handleSave, onRegisterActions]);

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Cài đặt chung
          </CardTitle>
          <CardDescription>
            Bật/tắt và cấu hình thông báo nhắc nhở
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enabled" className="text-base font-medium">
                Bật thông báo
              </Label>
              <p className="text-sm text-muted-foreground">
                Nhận thông báo về công việc sắp hết hạn
              </p>
            </div>
            <Switch
              id="enabled"
              checked={settings.enabled}
              onCheckedChange={() => handleToggle('enabled')}
            />
          </div>

          <Separator />

          {/* Check Interval */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="interval" className="text-base font-medium">
                Tần suất kiểm tra
              </Label>
              <Badge variant="secondary">{settings.checkInterval} phút</Badge>
            </div>
            <Slider
              id="interval"
              min={5}
              max={120}
              step={5}
              value={[settings.checkInterval]}
              onValueChange={handleIntervalChange}
              disabled={!settings.enabled}
            />
            <p className="text-sm text-muted-foreground">
              Hệ thống sẽ kiểm tra công việc hết hạn mỗi {settings.checkInterval} phút
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notification Types */}
      <Card>
        <CardHeader>
          <CardTitle>Loại thông báo</CardTitle>
          <CardDescription>
            Chọn các loại thông báo bạn muốn nhận
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="overdue" className="text-base font-medium">
                Công việc quá hạn
              </Label>
              <p className="text-sm text-muted-foreground">
                Thông báo quan trọng cho công việc đã quá hạn
              </p>
            </div>
            <Switch
              id="overdue"
              checked={settings.notifyOverdue}
              onCheckedChange={() => handleToggle('notifyOverdue')}
              disabled={!settings.enabled}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="today" className="text-base font-medium">
                Hết hạn hôm nay
              </Label>
              <p className="text-sm text-muted-foreground">
                Thông báo cho công việc hết hạn trong ngày
              </p>
            </div>
            <Switch
              id="today"
              checked={settings.notifyDueToday}
              onCheckedChange={() => handleToggle('notifyDueToday')}
              disabled={!settings.enabled}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="tomorrow" className="text-base font-medium">
                Hết hạn ngày mai
              </Label>
              <p className="text-sm text-muted-foreground">
                Thông báo trước 1 ngày
              </p>
            </div>
            <Switch
              id="tomorrow"
              checked={settings.notifyDueTomorrow}
              onCheckedChange={() => handleToggle('notifyDueTomorrow')}
              disabled={!settings.enabled}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="soon" className="text-base font-medium">
                Sắp hết hạn (3 ngày)
              </Label>
              <p className="text-sm text-muted-foreground">
                Thông báo trước 3 ngày
              </p>
            </div>
            <Switch
              id="soon"
              checked={settings.notifyDueSoon}
              onCheckedChange={() => handleToggle('notifyDueSoon')}
              disabled={!settings.enabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Cài đặt nâng cao</CardTitle>
          <CardDescription>
            Tùy chọn hiển thị và âm thanh
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 flex-1">
              <Label htmlFor="desktop" className="text-base font-medium">
                Thông báo desktop
              </Label>
              <p className="text-sm text-muted-foreground">
                Hiển thị thông báo trên màn hình desktop
                {!hasDesktopPermission && ' (Cần cấp quyền)'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {!hasDesktopPermission && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRequestPermission}
                >
                  Cấp quyền
                </Button>
              )}
              <Switch
                id="desktop"
                checked={settings.showDesktopNotification}
                onCheckedChange={() => handleToggle('showDesktopNotification')}
                disabled={!settings.enabled || !hasDesktopPermission}
              />
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sound" className="text-base font-medium">
                Âm thanh thông báo
              </Label>
              <p className="text-sm text-muted-foreground">
                Phát âm thanh khi có thông báo mới
              </p>
            </div>
            <Switch
              id="sound"
              checked={settings.playSound}
              onCheckedChange={() => handleToggle('playSound')}
              disabled={!settings.enabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Kênh thông báo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Kênh gửi thông báo
          </CardTitle>
          <CardDescription>
            Bật/tắt các kênh gửi thông báo đến nhân viên
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Email</Label>
              <p className="text-sm text-muted-foreground">Gửi thông báo qua email</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">SMS</Label>
              <p className="text-sm text-muted-foreground">Gửi tin nhắn SMS (cần cấu hình nhà cung cấp)</p>
            </div>
            <Switch disabled />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Push Notification</Label>
              <p className="text-sm text-muted-foreground">Thông báo đẩy trên app/web</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
