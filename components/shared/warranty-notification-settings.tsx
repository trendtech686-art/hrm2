/**
 * Warranty Notification Settings Component
 * Configure notification preferences for warranty tickets
 * Pattern copied from Complaints notification settings
 */

import * as React from 'react';
import { Bell, Mail, MessageSquare, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  loadWarrantyNotificationSettings,
  saveWarrantyNotificationSettings,
  type WarrantyNotificationSettings,
} from '../../features/warranty/notification-utils';

export function WarrantyNotificationSettings() {
  const [settings, setSettings] = React.useState<WarrantyNotificationSettings>(
    loadWarrantyNotificationSettings()
  );

  // Save to localStorage whenever settings change
  React.useEffect(() => {
    saveWarrantyNotificationSettings(settings);
  }, [settings]);

  const handleToggle = (key: keyof WarrantyNotificationSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <CardTitle>Cài đặt thông báo bảo hành</CardTitle>
        </div>
        <CardDescription>
          Tùy chỉnh các thông báo bạn muốn nhận khi có hoạt động bảo hành
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Notifications */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">Thông báo Email</h3>
          </div>

          <div className="space-y-3 ml-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="emailOnCreate" className="flex-1 cursor-pointer">
                Tạo phiếu mới
                <p className="text-sm text-muted-foreground font-normal">
                  Nhận email khi có phiếu bảo hành mới
                </p>
              </Label>
              <Switch
                id="emailOnCreate"
                checked={settings.emailOnCreate}
                onCheckedChange={() => handleToggle('emailOnCreate')}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="emailOnAssign" className="flex-1 cursor-pointer">
                Gán nhân viên
                <p className="text-sm text-muted-foreground font-normal">
                  Nhận email khi được gán xử lý phiếu
                </p>
              </Label>
              <Switch
                id="emailOnAssign"
                checked={settings.emailOnAssign}
                onCheckedChange={() => handleToggle('emailOnAssign')}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="emailOnProcessing" className="flex-1 cursor-pointer">
                Bắt đầu xử lý
                <p className="text-sm text-muted-foreground font-normal">
                  Nhận email khi phiếu bắt đầu được xử lý
                </p>
              </Label>
              <Switch
                id="emailOnProcessing"
                checked={settings.emailOnProcessing}
                onCheckedChange={() => handleToggle('emailOnProcessing')}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="emailOnProcessed" className="flex-1 cursor-pointer">
                Xử lý xong
                <p className="text-sm text-muted-foreground font-normal">
                  Nhận email khi phiếu xử lý hoàn tất
                </p>
              </Label>
              <Switch
                id="emailOnProcessed"
                checked={settings.emailOnProcessed}
                onCheckedChange={() => handleToggle('emailOnProcessed')}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="emailOnReturned" className="flex-1 cursor-pointer">
                Đã trả hàng
                <p className="text-sm text-muted-foreground font-normal">
                  Nhận email khi đã trả hàng cho khách
                </p>
              </Label>
              <Switch
                id="emailOnReturned"
                checked={settings.emailOnReturned}
                onCheckedChange={() => handleToggle('emailOnReturned')}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="emailOnOverdue" className="flex-1 cursor-pointer">
                Cảnh báo quá hạn
                <p className="text-sm text-muted-foreground font-normal">
                  Nhận email khi phiếu quá hạn xử lý
                </p>
              </Label>
              <Switch
                id="emailOnOverdue"
                checked={settings.emailOnOverdue}
                onCheckedChange={() => handleToggle('emailOnOverdue')}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* SMS Notifications */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">Thông báo SMS</h3>
          </div>

          <div className="space-y-3 ml-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="smsOnOverdue" className="flex-1 cursor-pointer">
                SMS cảnh báo quá hạn
                <p className="text-sm text-muted-foreground font-normal">
                  Nhận SMS khi phiếu quá hạn (cần cấu hình gateway)
                </p>
              </Label>
              <Switch
                id="smsOnOverdue"
                checked={settings.smsOnOverdue}
                onCheckedChange={() => handleToggle('smsOnOverdue')}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* In-App Notifications */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">Thông báo trong ứng dụng</h3>
          </div>

          <div className="space-y-3 ml-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="inAppNotifications" className="flex-1 cursor-pointer">
                Hiển thị thông báo toast
                <p className="text-sm text-muted-foreground font-normal">
                  Hiển thị popup thông báo trong ứng dụng
                </p>
              </Label>
              <Switch
                id="inAppNotifications"
                checked={settings.inAppNotifications}
                onCheckedChange={() => handleToggle('inAppNotifications')}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="reminderNotifications" className="flex-1 cursor-pointer">
                Thông báo nhắc nhở
                <p className="text-sm text-muted-foreground font-normal">
                  Nhận thông báo khi được gửi nhắc nhở
                </p>
              </Label>
              <Switch
                id="reminderNotifications"
                checked={settings.reminderNotifications}
                onCheckedChange={() => handleToggle('reminderNotifications')}
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-lg bg-muted p-4 text-sm">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4" />
            <span className="font-medium">Tóm tắt cài đặt</span>
          </div>
          <p className="text-muted-foreground">
            Đã bật {Object.values(settings).filter(Boolean).length} / {Object.keys(settings).length} loại thông báo
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
