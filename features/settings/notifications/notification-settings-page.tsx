'use client';

import * as React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Save, Bell, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { SettingsVerticalTabs } from '@/components/settings/SettingsVerticalTabs';
import { SettingsFormSection } from '@/components/settings/forms/SettingsFormSection';
import { SettingsFormGrid } from '@/components/settings/forms/SettingsFormGrid';
import { SettingsHistoryContent } from '@/components/settings/SettingsHistoryContent';
import { SettingsActionButton } from '@/components/settings/SettingsActionButton';
import { useSettingsPageHeader } from '../use-settings-page-header';
import { useTabActionRegistry } from '../use-tab-action-registry';
import {
  useTaskNotificationSettings,
  useComplaintNotificationSettings,
  useWarrantyNotificationSettings,
  useSystemNotificationSettings,
  useGeneralNotificationSettings,
  useSalesNotificationSettings,
  useWarehouseNotificationSettings,
  useHrNotificationSettings,
  useNotificationSettingsMutations,
} from './hooks/use-notification-settings';
import type {
  TaskNotificationSettings,
  TaskReminderSettings,
  ComplaintNotificationSettings,
  ComplaintReminderSettings,
  WarrantyNotificationSettings,
  SystemNotificationSettings,
  GeneralNotificationSettings,
  SalesNotificationSettings,
  WarehouseNotificationSettings,
  HrNotificationSettings,
} from './types';
import { useDirtyState } from '@/hooks/use-dirty-state';

export function NotificationSettingsPage() {
  const [activeTab, setActiveTab] = React.useState('general');
  const { headerActions, registerActions } = useTabActionRegistry(activeTab);

  useSettingsPageHeader({
    title: 'Cài đặt thông báo',
    actions: headerActions,
  });

  const tabs = React.useMemo(
    () => [
      { value: 'general', label: 'Chung' },
      { value: 'tasks', label: 'Công việc' },
      { value: 'complaints', label: 'Khiếu nại' },
      { value: 'warranty', label: 'Bảo hành' },
      { value: 'sales', label: 'Kinh doanh' },
      { value: 'warehouse', label: 'Kho & Mua hàng' },
      { value: 'hr', label: 'Nhân sự' },
      { value: 'system', label: 'Hệ thống' },
    ],
    [],
  );

  const registerGeneralActions = React.useMemo(() => registerActions('general'), [registerActions]);
  const registerTaskActions = React.useMemo(() => registerActions('tasks'), [registerActions]);
  const registerComplaintActions = React.useMemo(() => registerActions('complaints'), [registerActions]);
  const registerWarrantyActions = React.useMemo(() => registerActions('warranty'), [registerActions]);
  const registerSalesActions = React.useMemo(() => registerActions('sales'), [registerActions]);
  const registerWarehouseActions = React.useMemo(() => registerActions('warehouse'), [registerActions]);
  const registerHrActions = React.useMemo(() => registerActions('hr'), [registerActions]);
  const registerSystemActions = React.useMemo(() => registerActions('system'), [registerActions]);

  return (
    <>
    <SettingsVerticalTabs value={activeTab} onValueChange={setActiveTab} tabs={tabs}>
      <TabsContent value="general" className="mt-0">
        <GeneralNotificationTab isActive={activeTab === 'general'} onRegisterActions={registerGeneralActions} />
      </TabsContent>
      <TabsContent value="tasks" className="mt-0 space-y-4">
        <TaskNotificationTab isActive={activeTab === 'tasks'} onRegisterActions={registerTaskActions} />
      </TabsContent>
      <TabsContent value="complaints" className="mt-0 space-y-4">
        <ComplaintNotificationTab isActive={activeTab === 'complaints'} onRegisterActions={registerComplaintActions} />
      </TabsContent>
      <TabsContent value="warranty" className="mt-0 space-y-4">
        <WarrantyNotificationTab isActive={activeTab === 'warranty'} onRegisterActions={registerWarrantyActions} />
      </TabsContent>
      <TabsContent value="sales" className="mt-0 space-y-4">
        <SalesNotificationTab isActive={activeTab === 'sales'} onRegisterActions={registerSalesActions} />
      </TabsContent>
      <TabsContent value="warehouse" className="mt-0 space-y-4">
        <WarehouseNotificationTab isActive={activeTab === 'warehouse'} onRegisterActions={registerWarehouseActions} />
      </TabsContent>
      <TabsContent value="hr" className="mt-0 space-y-4">
        <HrNotificationTab isActive={activeTab === 'hr'} onRegisterActions={registerHrActions} />
      </TabsContent>
      <TabsContent value="system" className="mt-0 space-y-4">
        <SystemNotificationTab isActive={activeTab === 'system'} onRegisterActions={registerSystemActions} />
      </TabsContent>
    </SettingsVerticalTabs>

    <div className="mt-6">
      <SettingsHistoryContent
        entityTypes={['task_settings', 'complaint_settings', 'warranty_settings', 'notification_settings']}
      />
    </div>
    </>
  );
}

// ============================================
// GENERAL TAB (server-persisted notification preferences)
// ============================================

function GeneralNotificationTab({ isActive, onRegisterActions }: { isActive: boolean; onRegisterActions: (actions?: React.ReactNode[]) => void }) {
  const { settings: stored } = useGeneralNotificationSettings();
  const { updateGeneralNotifications } = useNotificationSettingsMutations();

  const [settings, setSettings] = React.useState<GeneralNotificationSettings>(stored);
  const [hasDesktopPermission, setHasDesktopPermission] = React.useState(
    typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted'
  );

  React.useEffect(() => { setSettings(stored); }, [stored]);

  const hasChanges = JSON.stringify(stored) !== JSON.stringify(settings);

  const handleToggle = (key: keyof GeneralNotificationSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = React.useCallback(() => {
    updateGeneralNotifications.mutate(settings, {
      onSuccess: () => {
        toast.success('Đã lưu cài đặt thông báo');
      },
    });
  }, [settings, updateGeneralNotifications]);

  const handleSaveRef = React.useRef(handleSave);
  handleSaveRef.current = handleSave;

  const handleRequestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setHasDesktopPermission(permission === 'granted');
      if (permission === 'granted') {
        toast.success('Đã cấp quyền thông báo desktop');
      }
    }
  };

  React.useEffect(() => {
    if (!isActive) return;
    onRegisterActions([
      <SettingsActionButton key="save" onClick={() => handleSaveRef.current()} disabled={!hasChanges || updateGeneralNotifications.isPending}>
        {updateGeneralNotifications.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Lưu cài đặt
      </SettingsActionButton>,
    ]);
  }, [isActive, hasChanges, updateGeneralNotifications.isPending, onRegisterActions]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Cài đặt chung
          </CardTitle>
          <CardDescription>
            Bật/tắt và cấu hình thông báo nhắc nhở chung cho hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="gen-enabled" className="text-base font-medium">Bật thông báo</Label>
              <p className="text-sm text-muted-foreground">Nhận thông báo về công việc sắp hết hạn</p>
            </div>
            <Switch id="gen-enabled" checked={settings.enabled} onCheckedChange={() => handleToggle('enabled')} />
          </div>

          <SettingsFormSection title="Loại thông báo" description="Chọn loại thông báo bạn muốn nhận">
            <div className="space-y-3">
              {[
                { id: 'notifyOverdue', label: 'Công việc quá hạn', desc: 'Thông báo quan trọng cho công việc đã quá hạn' },
                { id: 'notifyDueToday', label: 'Hết hạn hôm nay', desc: 'Thông báo cho công việc hết hạn trong ngày' },
                { id: 'notifyDueTomorrow', label: 'Hết hạn ngày mai', desc: 'Thông báo trước 1 ngày' },
                { id: 'notifyDueSoon', label: 'Sắp hết hạn (3 ngày)', desc: 'Thông báo trước 3 ngày' },
              ].map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor={item.id} className="cursor-pointer">{item.label}</Label>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    id={item.id}
                    checked={settings[item.id as keyof typeof settings] as boolean}
                    onCheckedChange={() => handleToggle(item.id as keyof typeof settings)}
                    disabled={!settings.enabled}
                  />
                </div>
              ))}
            </div>
          </SettingsFormSection>

          <SettingsFormSection title="Hiển thị" description="Tùy chọn hiển thị và âm thanh">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="gen-desktop" className="cursor-pointer">Thông báo desktop</Label>
                  <p className="text-xs text-muted-foreground">
                    Hiển thị thông báo trên màn hình desktop
                    {!hasDesktopPermission && ' (Cần cấp quyền)'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!hasDesktopPermission && (
                    <Button size="sm" variant="outline" onClick={handleRequestPermission}>Cấp quyền</Button>
                  )}
                  <Switch
                    id="gen-desktop"
                    checked={settings.showDesktopNotification}
                    onCheckedChange={() => handleToggle('showDesktopNotification')}
                    disabled={!settings.enabled || !hasDesktopPermission}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="gen-sound" className="cursor-pointer">Âm thanh thông báo</Label>
                  <p className="text-xs text-muted-foreground">Phát âm thanh khi có thông báo mới</p>
                </div>
                <Switch
                  id="gen-sound"
                  checked={settings.playSound}
                  onCheckedChange={() => handleToggle('playSound')}
                  disabled={!settings.enabled}
                />
              </div>
            </div>
          </SettingsFormSection>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// TASK NOTIFICATION TAB
// ============================================

function TaskNotificationTab({ isActive, onRegisterActions }: { isActive: boolean; onRegisterActions: (actions?: React.ReactNode[]) => void }) {
  const { notifications: stored, reminders: storedReminders } = useTaskNotificationSettings();
  const { updateTaskNotifications, updateTaskReminders } = useNotificationSettingsMutations();

  const [notifications, setNotifications] = React.useState<TaskNotificationSettings>(stored);
  const [reminders, setReminders] = React.useState<TaskReminderSettings>(storedReminders);

  React.useEffect(() => { setNotifications(stored); }, [stored]);
  React.useEffect(() => { setReminders(storedReminders); }, [storedReminders]);

  const handleNotificationChange = (key: keyof TaskNotificationSettings) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleReminderChange = (field: keyof TaskReminderSettings, value: boolean | number) => {
    setReminders(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = React.useCallback(() => {
    updateTaskNotifications.mutate(notifications, {
      onSuccess: () => {
        updateTaskReminders.mutate(reminders, {
          onSuccess: () => toast.success('Đã lưu thông báo công việc'),
        });
      },
    });
  }, [notifications, reminders, updateTaskNotifications, updateTaskReminders]);

  const handleSaveRef = React.useRef(handleSave);
  handleSaveRef.current = handleSave;

  const isNotifDirty = useDirtyState(stored, notifications);
  const isReminderDirty = useDirtyState(storedReminders, reminders);
  const isDirty = isNotifDirty || isReminderDirty;
  const isSaving = updateTaskNotifications.isPending || updateTaskReminders.isPending;

  React.useEffect(() => {
    if (!isActive) return;
    onRegisterActions([
      <SettingsActionButton key="save" onClick={() => handleSaveRef.current()} disabled={!isDirty || isSaving}>
        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Lưu cài đặt
      </SettingsActionButton>,
    ]);
  }, [isActive, isDirty, isSaving, onRegisterActions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle size="lg">Thông báo công việc</CardTitle>
        <CardDescription>Quản lý thông báo và nhắc nhở tự động cho công việc</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <SettingsFormSection title="Thông báo Email" description="Gửi cập nhật tới người phụ trách và quản lý." contentClassName="space-y-3">
          {([
            ['emailOnCreate', 'Khi công việc mới được tạo'],
            ['emailOnAssign', 'Khi được phân công'],
            ['emailOnComplete', 'Khi công việc hoàn thành'],
            ['emailOnOverdue', 'Khi công việc quá hạn'],
            ['emailOnApprovalPending', 'Khi có bằng chứng chờ duyệt'],
          ] as const).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between">
              <Label htmlFor={`task-${key}`} className="cursor-pointer">{label}</Label>
              <Switch id={`task-${key}`} checked={notifications[key]} onCheckedChange={() => handleNotificationChange(key)} />
            </div>
          ))}
        </SettingsFormSection>

        <SettingsFormSection title="Thông báo trong ứng dụng" description="Hiển thị trong hệ thống dành cho quản lý task.">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="task-inapp" className="cursor-pointer">Bật thông báo in-app</Label>
              <p className="text-xs text-muted-foreground">Áp dụng cho desktop và mobile app.</p>
            </div>
            <Switch id="task-inapp" checked={notifications.inAppNotifications} onCheckedChange={() => handleNotificationChange('inAppNotifications')} />
          </div>
        </SettingsFormSection>

        <SettingsFormSection title="Nhắc nhở & leo thang" description="Tự động đôn đốc task lâu không cập nhật.">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="task-rem-enabled" className="cursor-pointer">Bật nhắc nhở thông minh</Label>
              <p className="text-xs text-muted-foreground">Gửi email/in-app tới assignee nếu task đứng yên.</p>
            </div>
            <Switch id="task-rem-enabled" checked={reminders.enabled} onCheckedChange={(checked) => handleReminderChange('enabled', checked)} />
          </div>
          {reminders.enabled && (
            <SettingsFormGrid className="pt-4">
              <div className="space-y-2">
                <Label htmlFor="task-rem1">Nhắc nhở lần 1 (giờ)</Label>
                <Input id="task-rem1" type="number" className="h-9" min="1" value={reminders.firstReminderHours} onChange={(e) => handleReminderChange('firstReminderHours', parseInt(e.target.value) || 1)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-rem2">Nhắc nhở lần 2 (giờ)</Label>
                <Input id="task-rem2" type="number" className="h-9" min="1" value={reminders.secondReminderHours} onChange={(e) => handleReminderChange('secondReminderHours', parseInt(e.target.value) || 1)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-esc">Báo động leo thang (giờ)</Label>
                <Input id="task-esc" type="number" className="h-9" min="1" value={reminders.escalationHours} onChange={(e) => handleReminderChange('escalationHours', parseInt(e.target.value) || 1)} />
              </div>
            </SettingsFormGrid>
          )}
        </SettingsFormSection>
      </CardContent>
    </Card>
  );
}

// ============================================
// COMPLAINT NOTIFICATION TAB
// ============================================

function ComplaintNotificationTab({ isActive, onRegisterActions }: { isActive: boolean; onRegisterActions: (actions?: React.ReactNode[]) => void }) {
  const { notifications: stored, reminders: storedReminders } = useComplaintNotificationSettings();
  const { updateComplaintNotifications, updateComplaintReminders } = useNotificationSettingsMutations();

  const [notifications, setNotifications] = React.useState<ComplaintNotificationSettings>(stored);
  const [reminders, setReminders] = React.useState<ComplaintReminderSettings>(storedReminders);

  React.useEffect(() => { setNotifications(stored); }, [stored]);
  React.useEffect(() => { setReminders(storedReminders); }, [storedReminders]);

  const handleNotificationChange = (key: keyof ComplaintNotificationSettings) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleReminderChange = (field: keyof ComplaintReminderSettings, value: boolean | number) => {
    setReminders(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = React.useCallback(() => {
    updateComplaintNotifications.mutate(notifications, {
      onSuccess: () => {
        updateComplaintReminders.mutate(reminders, {
          onSuccess: () => toast.success('Đã lưu thông báo khiếu nại'),
        });
      },
    });
  }, [notifications, reminders, updateComplaintNotifications, updateComplaintReminders]);

  const handleSaveRef = React.useRef(handleSave);
  handleSaveRef.current = handleSave;

  const isNotifDirty = useDirtyState(stored, notifications);
  const isReminderDirty = useDirtyState(storedReminders, reminders);
  const isDirty = isNotifDirty || isReminderDirty;
  const isSaving = updateComplaintNotifications.isPending || updateComplaintReminders.isPending;

  React.useEffect(() => {
    if (!isActive) return;
    onRegisterActions([
      <SettingsActionButton key="save" onClick={() => handleSaveRef.current()} disabled={!isDirty || isSaving}>
        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Lưu cài đặt
      </SettingsActionButton>,
    ]);
  }, [isActive, isDirty, isSaving, onRegisterActions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle size="lg">Thông báo khiếu nại</CardTitle>
        <CardDescription>Quản lý thông báo và nhắc nhở tự động cho khiếu nại</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <SettingsFormSection title="Thông báo Email" description="Gửi cập nhật tới người phụ trách và quản lý." contentClassName="space-y-3">
          {([
            ['emailOnCreate', 'Khi khiếu nại mới được tạo'],
            ['emailOnAssign', 'Khi được phân công xử lý'],
            ['emailOnVerified', 'Khi khiếu nại đã xác minh'],
            ['emailOnResolved', 'Khi khiếu nại đã giải quyết'],
            ['emailOnOverdue', 'Khi khiếu nại quá hạn'],
          ] as const).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between">
              <Label htmlFor={`comp-${key}`} className="cursor-pointer">{label}</Label>
              <Switch id={`comp-${key}`} checked={notifications[key]} onCheckedChange={() => handleNotificationChange(key)} />
            </div>
          ))}
        </SettingsFormSection>

        <SettingsFormSection title="Thông báo trong ứng dụng" description="Hiển thị trong hệ thống.">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="comp-inapp" className="cursor-pointer">Bật thông báo in-app</Label>
              <p className="text-xs text-muted-foreground">Áp dụng cho desktop và mobile app.</p>
            </div>
            <Switch id="comp-inapp" checked={notifications.inAppNotifications} onCheckedChange={() => handleNotificationChange('inAppNotifications')} />
          </div>
        </SettingsFormSection>

        <SettingsFormSection title="Nhắc nhở tự động" description="Tự động đôn đốc khiếu nại lâu không xử lý.">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="comp-rem-enabled" className="cursor-pointer">Bật nhắc nhở</Label>
              <p className="text-xs text-muted-foreground">Gửi email/in-app tới người xử lý.</p>
            </div>
            <Switch id="comp-rem-enabled" checked={reminders.enabled} onCheckedChange={(checked) => handleReminderChange('enabled', checked)} />
          </div>
          {reminders.enabled && (
            <SettingsFormGrid className="pt-4">
              <div className="space-y-2">
                <Label htmlFor="comp-rem1">Nhắc nhở lần 1 (giờ)</Label>
                <Input id="comp-rem1" type="number" className="h-9" min="1" value={reminders.firstReminderHours} onChange={(e) => handleReminderChange('firstReminderHours', parseInt(e.target.value) || 1)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="comp-rem2">Nhắc nhở lần 2 (giờ)</Label>
                <Input id="comp-rem2" type="number" className="h-9" min="1" value={reminders.secondReminderHours} onChange={(e) => handleReminderChange('secondReminderHours', parseInt(e.target.value) || 1)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="comp-esc">Báo động leo thang (giờ)</Label>
                <Input id="comp-esc" type="number" className="h-9" min="1" value={reminders.escalationHours} onChange={(e) => handleReminderChange('escalationHours', parseInt(e.target.value) || 1)} />
              </div>
            </SettingsFormGrid>
          )}
        </SettingsFormSection>
      </CardContent>
    </Card>
  );
}

// ============================================
// WARRANTY NOTIFICATION TAB
// ============================================

function WarrantyNotificationTab({ isActive, onRegisterActions }: { isActive: boolean; onRegisterActions: (actions?: React.ReactNode[]) => void }) {
  const { notifications: stored } = useWarrantyNotificationSettings();
  const { updateWarrantyNotifications } = useNotificationSettingsMutations();

  const [notifications, setNotifications] = React.useState<WarrantyNotificationSettings>(stored);

  React.useEffect(() => { setNotifications(stored); }, [stored]);

  const handleNotificationChange = (key: keyof WarrantyNotificationSettings) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = React.useCallback(() => {
    updateWarrantyNotifications.mutate(notifications, {
      onSuccess: () => toast.success('Đã lưu thông báo bảo hành'),
    });
  }, [notifications, updateWarrantyNotifications]);

  const handleSaveRef = React.useRef(handleSave);
  handleSaveRef.current = handleSave;

  const isDirty = useDirtyState(stored, notifications);
  const isSaving = updateWarrantyNotifications.isPending;

  React.useEffect(() => {
    if (!isActive) return;
    onRegisterActions([
      <SettingsActionButton key="save" onClick={() => handleSaveRef.current()} disabled={!isDirty || isSaving}>
        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Lưu cài đặt
      </SettingsActionButton>,
    ]);
  }, [isActive, isDirty, isSaving, onRegisterActions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle size="lg">Thông báo bảo hành</CardTitle>
        <CardDescription>Quản lý thông báo tự động cho bảo hành</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <SettingsFormSection title="Thông báo Email" description="Gửi cập nhật tới người phụ trách." contentClassName="space-y-3">
          {([
            ['emailOnCreate', 'Khi phiếu bảo hành được tạo'],
            ['emailOnAssign', 'Khi được phân công xử lý'],
            ['emailOnInspected', 'Khi đã kiểm tra sản phẩm'],
            ['emailOnApproved', 'Khi bảo hành được duyệt'],
            ['emailOnRejected', 'Khi bảo hành bị từ chối'],
            ['emailOnOverdue', 'Khi bảo hành quá hạn'],
          ] as const).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between">
              <Label htmlFor={`war-${key}`} className="cursor-pointer">{label}</Label>
              <Switch id={`war-${key}`} checked={notifications[key]} onCheckedChange={() => handleNotificationChange(key)} />
            </div>
          ))}
        </SettingsFormSection>

        <SettingsFormSection title="Thông báo trong ứng dụng" description="Hiển thị trong hệ thống.">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="war-inapp" className="cursor-pointer">Bật thông báo in-app</Label>
              <p className="text-xs text-muted-foreground">Áp dụng cho desktop và mobile app.</p>
            </div>
            <Switch id="war-inapp" checked={notifications.inAppNotifications} onCheckedChange={() => handleNotificationChange('inAppNotifications')} />
          </div>
        </SettingsFormSection>

      </CardContent>
    </Card>
  );
}

// ============================================
// SALES NOTIFICATION TAB
// ============================================

function SalesNotificationTab({ isActive, onRegisterActions }: { isActive: boolean; onRegisterActions: (actions?: React.ReactNode[]) => void }) {
  const { settings: stored } = useSalesNotificationSettings();
  const { updateSalesNotifications } = useNotificationSettingsMutations();

  const [settings, setSettings] = React.useState<SalesNotificationSettings>(stored);

  React.useEffect(() => { setSettings(stored); }, [stored]);

  const handleToggle = (key: keyof SalesNotificationSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = React.useCallback(() => {
    updateSalesNotifications.mutate(settings, {
      onSuccess: () => toast.success('Đã lưu thông báo kinh doanh'),
    });
  }, [settings, updateSalesNotifications]);

  const handleSaveRef = React.useRef(handleSave);
  handleSaveRef.current = handleSave;

  const isDirty = useDirtyState(stored, settings);
  const isSaving = updateSalesNotifications.isPending;

  React.useEffect(() => {
    if (!isActive) return;
    onRegisterActions([
      <SettingsActionButton key="save" onClick={() => handleSaveRef.current()} disabled={!isDirty || isSaving}>
        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Lưu cài đặt
      </SettingsActionButton>,
    ]);
  }, [isActive, isDirty, isSaving, onRegisterActions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle size="lg">Thông báo kinh doanh</CardTitle>
        <CardDescription>Quản lý thông báo cho đơn hàng, vận chuyển, khách hàng</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <SettingsFormSection title="Đơn hàng" description="Thông báo liên quan đến đơn hàng." contentClassName="space-y-3">
          {([
            ['orderCreated', 'Đơn hàng mới', 'Thông báo khi có đơn hàng mới được tạo.'],
            ['orderStatusChanged', 'Thay đổi trạng thái đơn', 'Thông báo khi đơn hàng chuyển trạng thái.'],
            ['orderAssigned', 'Giao đơn hàng', 'Thông báo khi đơn hàng được giao cho nhân viên.'],
            ['orderCancelled', 'Hủy đơn hàng', 'Thông báo khi đơn hàng bị hủy.'],
          ] as const).map(([key, label, desc]) => (
            <div key={key} className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor={`sales-${key}`} className="cursor-pointer">{label}</Label>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <Switch id={`sales-${key}`} checked={settings[key] as boolean} onCheckedChange={() => handleToggle(key)} />
            </div>
          ))}
        </SettingsFormSection>

        <SettingsFormSection title="Đóng gói & Vận chuyển" description="Thông báo liên quan đến giao hàng." contentClassName="space-y-3">
          {([
            ['packagingUpdated', 'Đóng gói', 'Thông báo khi đóng gói được phân công hoặc hoàn thành.'],
            ['shipmentUpdated', 'Vận đơn', 'Thông báo khi tạo hoặc hủy vận đơn.'],
            ['deliveryUpdated', 'Giao hàng', 'Thông báo khi giao hàng thành công hoặc thất bại.'],
          ] as const).map(([key, label, desc]) => (
            <div key={key} className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor={`sales-${key}`} className="cursor-pointer">{label}</Label>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <Switch id={`sales-${key}`} checked={settings[key] as boolean} onCheckedChange={() => handleToggle(key)} />
            </div>
          ))}
        </SettingsFormSection>

        <SettingsFormSection title="Khách hàng & Khác" description="Thông báo liên quan khác." contentClassName="space-y-3">
          {([
            ['salesReturnUpdated', 'Trả hàng', 'Thông báo khi có phiếu trả hàng mới hoặc cập nhật.'],
            ['customerCreated', 'Khách hàng mới', 'Thông báo khi có khách hàng mới.'],
            ['reconciliationUpdated', 'Đối soát COD', 'Thông báo khi tạo hoặc xác nhận phiếu đối soát.'],
          ] as const).map(([key, label, desc]) => (
            <div key={key} className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor={`sales-${key}`} className="cursor-pointer">{label}</Label>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <Switch id={`sales-${key}`} checked={settings[key] as boolean} onCheckedChange={() => handleToggle(key)} />
            </div>
          ))}
        </SettingsFormSection>

        <SettingsFormSection title="Thông báo trong ứng dụng" description="Bật/tắt toàn bộ thông báo in-app cho module kinh doanh.">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sales-inapp" className="cursor-pointer">Bật thông báo in-app</Label>
              <p className="text-xs text-muted-foreground">Áp dụng cho desktop và mobile app.</p>
            </div>
            <Switch id="sales-inapp" checked={settings.inAppNotifications} onCheckedChange={() => handleToggle('inAppNotifications')} />
          </div>
        </SettingsFormSection>
      </CardContent>
    </Card>
  );
}

// ============================================
// WAREHOUSE & PURCHASING NOTIFICATION TAB
// ============================================

function WarehouseNotificationTab({ isActive, onRegisterActions }: { isActive: boolean; onRegisterActions: (actions?: React.ReactNode[]) => void }) {
  const { settings: stored } = useWarehouseNotificationSettings();
  const { updateWarehouseNotifications } = useNotificationSettingsMutations();

  const [settings, setSettings] = React.useState<WarehouseNotificationSettings>(stored);

  React.useEffect(() => { setSettings(stored); }, [stored]);

  const handleToggle = (key: keyof WarehouseNotificationSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = React.useCallback(() => {
    updateWarehouseNotifications.mutate(settings, {
      onSuccess: () => toast.success('Đã lưu thông báo kho & mua hàng'),
    });
  }, [settings, updateWarehouseNotifications]);

  const handleSaveRef = React.useRef(handleSave);
  handleSaveRef.current = handleSave;

  const isDirty = useDirtyState(stored, settings);
  const isSaving = updateWarehouseNotifications.isPending;

  React.useEffect(() => {
    if (!isActive) return;
    onRegisterActions([
      <SettingsActionButton key="save" onClick={() => handleSaveRef.current()} disabled={!isDirty || isSaving}>
        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Lưu cài đặt
      </SettingsActionButton>,
    ]);
  }, [isActive, isDirty, isSaving, onRegisterActions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle size="lg">Thông báo kho & mua hàng</CardTitle>
        <CardDescription>Quản lý thông báo cho kho vận, mua hàng, tồn kho</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <SettingsFormSection title="Kho vận" description="Thông báo liên quan đến quản lý kho." contentClassName="space-y-3">
          {([
            ['stockTransferUpdated', 'Chuyển kho', 'Thông báo khi tạo, hoàn thành hoặc hủy phiếu chuyển kho.'],
            ['inventoryCheckUpdated', 'Kiểm kê', 'Thông báo khi tạo hoặc hoàn thành kiểm kê.'],
            ['costAdjustmentUpdated', 'Điều chỉnh giá vốn', 'Thông báo khi tạo hoặc xác nhận điều chỉnh giá vốn.'],
            ['priceAdjustmentUpdated', 'Điều chỉnh giá bán', 'Thông báo khi tạo hoặc xác nhận điều chỉnh giá bán.'],
          ] as const).map(([key, label, desc]) => (
            <div key={key} className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor={`wh-${key}`} className="cursor-pointer">{label}</Label>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <Switch id={`wh-${key}`} checked={settings[key] as boolean} onCheckedChange={() => handleToggle(key)} />
            </div>
          ))}
        </SettingsFormSection>

        <SettingsFormSection title="Mua hàng" description="Thông báo liên quan đến nhập hàng." contentClassName="space-y-3">
          {([
            ['purchaseOrderUpdated', 'Đơn nhập hàng', 'Thông báo khi tạo, cập nhật hoặc hủy đơn nhập hàng.'],
            ['purchaseReturnUpdated', 'Trả hàng nhập', 'Thông báo khi tạo hoặc xử lý phiếu trả hàng nhập.'],
            ['inventoryReceiptUpdated', 'Phiếu nhập kho', 'Thông báo khi tạo hoặc cập nhật phiếu nhập kho.'],
          ] as const).map(([key, label, desc]) => (
            <div key={key} className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor={`wh-${key}`} className="cursor-pointer">{label}</Label>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <Switch id={`wh-${key}`} checked={settings[key] as boolean} onCheckedChange={() => handleToggle(key)} />
            </div>
          ))}
        </SettingsFormSection>

        <SettingsFormSection title="Cảnh báo tồn kho" description="Cảnh báo về tình trạng tồn kho.">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="wh-low-stock" className="cursor-pointer">Cảnh báo tồn kho thấp</Label>
              <p className="text-xs text-muted-foreground">Thông báo khi sản phẩm sắp hết hàng.</p>
            </div>
            <Switch id="wh-low-stock" checked={settings.lowStockAlert} onCheckedChange={() => handleToggle('lowStockAlert')} />
          </div>
          {settings.lowStockAlert && (
            <div className="space-y-2 pt-2">
              <Label htmlFor="wh-stock-threshold">Ngưỡng cảnh báo (số lượng)</Label>
              <Input
                id="wh-stock-threshold"
                type="number"
                className="h-9 max-w-50"
                min="1"
                value={settings.lowStockThreshold}
                onChange={(e) => setSettings(prev => ({ ...prev, lowStockThreshold: parseInt(e.target.value) || 1 }))}
              />
            </div>
          )}
        </SettingsFormSection>

        <SettingsFormSection title="Thông báo trong ứng dụng" description="Bật/tắt toàn bộ thông báo in-app cho kho & mua hàng.">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="wh-inapp" className="cursor-pointer">Bật thông báo in-app</Label>
              <p className="text-xs text-muted-foreground">Áp dụng cho desktop và mobile app.</p>
            </div>
            <Switch id="wh-inapp" checked={settings.inAppNotifications} onCheckedChange={() => handleToggle('inAppNotifications')} />
          </div>
        </SettingsFormSection>
      </CardContent>
    </Card>
  );
}

// ============================================
// HR NOTIFICATION TAB
// ============================================

function HrNotificationTab({ isActive, onRegisterActions }: { isActive: boolean; onRegisterActions: (actions?: React.ReactNode[]) => void }) {
  const { settings: stored } = useHrNotificationSettings();
  const { updateHrNotifications } = useNotificationSettingsMutations();

  const [settings, setSettings] = React.useState<HrNotificationSettings>(stored);

  React.useEffect(() => { setSettings(stored); }, [stored]);

  const handleToggle = (key: keyof HrNotificationSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = React.useCallback(() => {
    updateHrNotifications.mutate(settings, {
      onSuccess: () => toast.success('Đã lưu thông báo nhân sự'),
    });
  }, [settings, updateHrNotifications]);

  const handleSaveRef = React.useRef(handleSave);
  handleSaveRef.current = handleSave;

  const isDirty = useDirtyState(stored, settings);
  const isSaving = updateHrNotifications.isPending;

  React.useEffect(() => {
    if (!isActive) return;
    onRegisterActions([
      <SettingsActionButton key="save" onClick={() => handleSaveRef.current()} disabled={!isDirty || isSaving}>
        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Lưu cài đặt
      </SettingsActionButton>,
    ]);
  }, [isActive, isDirty, isSaving, onRegisterActions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle size="lg">Thông báo nhân sự</CardTitle>
        <CardDescription>Quản lý thông báo cho nhân viên, chấm công, nghỉ phép, bảng lương</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <SettingsFormSection title="Nhân sự" description="Thông báo liên quan đến quản lý nhân sự." contentClassName="space-y-3">
          {([
            ['employeeCreated', 'Nhân viên mới', 'Thông báo khi có nhân viên mới được giao quản lý.'],
            ['attendanceUpdated', 'Chấm công', 'Thông báo khi chấm công được cập nhật.'],
            ['leaveUpdated', 'Nghỉ phép', 'Thông báo khi có đơn nghỉ phép mới hoặc được duyệt/từ chối.'],
            ['payrollUpdated', 'Bảng lương', 'Thông báo khi tạo hoặc cập nhật bảng lương.'],
            ['penaltyUpdated', 'Phiếu phạt', 'Thông báo khi phiếu phạt mới hoặc cập nhật.'],
          ] as const).map(([key, label, desc]) => (
            <div key={key} className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor={`hr-${key}`} className="cursor-pointer">{label}</Label>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <Switch id={`hr-${key}`} checked={settings[key] as boolean} onCheckedChange={() => handleToggle(key)} />
            </div>
          ))}
        </SettingsFormSection>

        <SettingsFormSection title="Thông báo trong ứng dụng" description="Bật/tắt toàn bộ thông báo in-app cho nhân sự.">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="hr-inapp" className="cursor-pointer">Bật thông báo in-app</Label>
              <p className="text-xs text-muted-foreground">Áp dụng cho desktop và mobile app.</p>
            </div>
            <Switch id="hr-inapp" checked={settings.inAppNotifications} onCheckedChange={() => handleToggle('inAppNotifications')} />
          </div>
        </SettingsFormSection>
      </CardContent>
    </Card>
  );
}

// ============================================
// SYSTEM NOTIFICATION TAB (slimmed)
// ============================================

function SystemNotificationTab({ isActive, onRegisterActions }: { isActive: boolean; onRegisterActions: (actions?: React.ReactNode[]) => void }) {
  const { settings: stored } = useSystemNotificationSettings();
  const { updateSystemNotifications } = useNotificationSettingsMutations();

  const [settings, setSettings] = React.useState<SystemNotificationSettings>(stored);

  React.useEffect(() => { setSettings(stored); }, [stored]);

  const handleToggle = (key: keyof SystemNotificationSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = React.useCallback(() => {
    updateSystemNotifications.mutate(settings, {
      onSuccess: () => toast.success('Đã lưu thông báo hệ thống'),
    });
  }, [settings, updateSystemNotifications]);

  const handleSaveRef = React.useRef(handleSave);
  handleSaveRef.current = handleSave;

  const isDirty = useDirtyState(stored, settings);
  const isSaving = updateSystemNotifications.isPending;

  React.useEffect(() => {
    if (!isActive) return;
    onRegisterActions([
      <SettingsActionButton key="save" onClick={() => handleSaveRef.current()} disabled={!isDirty || isSaving}>
        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Lưu cài đặt
      </SettingsActionButton>,
    ]);
  }, [isActive, isDirty, isSaving, onRegisterActions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle size="lg">Thông báo hệ thống</CardTitle>
        <CardDescription>Cấu hình thông báo thanh toán, bình luận, báo cáo</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <SettingsFormSection title="Thanh toán" description="Thông báo liên quan đến thanh toán." contentClassName="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sys-payment-received" className="cursor-pointer">Nhận thanh toán</Label>
              <p className="text-xs text-muted-foreground">Thông báo khi nhận được thanh toán.</p>
            </div>
            <Switch id="sys-payment-received" checked={settings.paymentReceived} onCheckedChange={() => handleToggle('paymentReceived')} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sys-payment-overdue" className="cursor-pointer">Thanh toán quá hạn</Label>
              <p className="text-xs text-muted-foreground">Cảnh báo khi có thanh toán quá hạn.</p>
            </div>
            <Switch id="sys-payment-overdue" checked={settings.paymentOverdue} onCheckedChange={() => handleToggle('paymentOverdue')} />
          </div>
        </SettingsFormSection>

        <SettingsFormSection title="Phiếu thu/chi" description="Thông báo khi có phiếu thu/chi mới.">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sys-receipt" className="cursor-pointer">Phiếu thu/chi</Label>
              <p className="text-xs text-muted-foreground">Thông báo khi tạo hoặc cập nhật phiếu thu/chi.</p>
            </div>
            <Switch id="sys-receipt" checked={settings.receiptUpdated} onCheckedChange={() => handleToggle('receiptUpdated')} />
          </div>
        </SettingsFormSection>

        <SettingsFormSection title="Bình luận" description="Thông báo khi có bình luận mới.">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sys-comment" className="cursor-pointer">Bình luận mới</Label>
              <p className="text-xs text-muted-foreground">Thông báo khi có bình luận mới trên đơn hàng, công việc, v.v.</p>
            </div>
            <Switch id="sys-comment" checked={settings.commentCreated} onCheckedChange={() => handleToggle('commentCreated')} />
          </div>
        </SettingsFormSection>

        <SettingsFormSection title="Báo cáo" description="Email tổng hợp định kỳ.">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sys-daily-summary" className="cursor-pointer">Email tổng hợp hàng ngày</Label>
              <p className="text-xs text-muted-foreground">Gửi email báo cáo tổng quan cuối ngày.</p>
            </div>
            <Switch id="sys-daily-summary" checked={settings.dailySummaryEmail} onCheckedChange={() => handleToggle('dailySummaryEmail')} />
          </div>
        </SettingsFormSection>
      </CardContent>
    </Card>
  );
}
