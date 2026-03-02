import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Switch } from '../../../../components/ui/switch';
import { Label } from '../../../../components/ui/label';
import { Badge } from '../../../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Play, Pause, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { usePkgxSettings, usePkgxSyncSettingsMutations, usePkgxSyncStatusMutations, usePkgxLogMutations } from '../hooks/use-pkgx-settings';
import { SYNC_INTERVAL_OPTIONS } from '../types';

export function SyncSettingsTab() {
  const { data: settings } = usePkgxSettings();
  const { updateSyncSetting } = usePkgxSyncSettingsMutations({ onSuccess: () => {} });
  const { setLastSyncAt, setLastSyncResult } = usePkgxSyncStatusMutations();
  const { addLog } = usePkgxLogMutations();
  const syncSettings = settings?.syncSettings ?? { autoSyncEnabled: false, intervalMinutes: 60, syncInventory: true, syncPrice: true, syncSeo: true, syncOnProductUpdate: false, notifyOnError: true };
  const lastSyncAt = settings?.lastSyncAt;
  const lastSyncResult = settings?.lastSyncResult;
  const apiKey = settings?.apiKey;
  const apiUrl = settings?.apiUrl;
  const [isSyncing, setIsSyncing] = React.useState(false);

  const handleManualSync = async () => {
    if (!apiUrl || !apiKey) {
      toast.error('Vui lòng cấu hình API URL và API Key trước!');
      return;
    }

    setIsSyncing(true);
    const startTime = Date.now();
    toast.info('Đang đồng bộ dữ liệu...');
    
    try {
      // TODO: Implement actual sync logic with real API
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const responseTime = Date.now() - startTime;
      const result = { status: 'success' as const, total: 150, success: 150, failed: 0 };
      
      setLastSyncAt.mutate(new Date().toISOString());
      setLastSyncResult.mutate(result);
      
      addLog.mutate({
        action: 'sync_all',
        status: 'success',
        message: 'Đồng bộ tất cả dữ liệu thành công',
        details: {
          total: result.total,
          success: result.success,
          failed: result.failed,
          responseTime,
          url: apiUrl,
          method: 'POST',
        }
      });
      
      toast.success('Đồng bộ thành công!');
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
      
      setLastSyncResult.mutate({ status: 'error', total: 0, success: 0, failed: 0 });
      
      addLog.mutate({
        action: 'sync_all',
        status: 'error',
        message: 'Lỗi đồng bộ dữ liệu',
        details: {
          error: errorMessage,
          responseTime,
          url: apiUrl,
          method: 'POST',
        }
      });
      
      toast.error('Lỗi đồng bộ: ' + errorMessage);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleToggleAutoSync = (checked: boolean) => {
    updateSyncSetting.mutate({ key: 'autoSyncEnabled', value: checked });
    addLog.mutate({
      action: 'save_config',
      status: 'info',
      message: checked ? 'Đã bật Auto Sync' : 'Đã tắt Auto Sync',
      details: {}
    });
    toast.success(checked ? 'Đã bật Auto Sync' : 'Đã tắt Auto Sync');
  };

  const handleToggleSyncInventory = (checked: boolean) => {
    updateSyncSetting.mutate({ key: 'syncInventory', value: checked });
    addLog.mutate({
      action: 'save_config',
      status: 'info',
      message: checked ? 'Đã bật đồng bộ tồn kho' : 'Đã tắt đồng bộ tồn kho',
      details: {}
    });
  };

  const handleToggleSyncPrice = (checked: boolean) => {
    updateSyncSetting.mutate({ key: 'syncPrice', value: checked });
    addLog.mutate({
      action: 'save_config',
      status: 'info',
      message: checked ? 'Đã bật đồng bộ giá' : 'Đã tắt đồng bộ giá',
      details: {}
    });
  };

  const handleToggleSyncSeo = (checked: boolean) => {
    updateSyncSetting.mutate({ key: 'syncSeo', value: checked });
    addLog.mutate({
      action: 'save_config',
      status: 'info',
      message: checked ? 'Đã bật đồng bộ SEO' : 'Đã tắt đồng bộ SEO',
      details: {}
    });
  };

  const handleToggleSyncOnUpdate = (checked: boolean) => {
    updateSyncSetting.mutate({ key: 'syncOnProductUpdate', value: checked });
    addLog.mutate({
      action: 'save_config',
      status: 'info',
      message: checked ? 'Đã bật đồng bộ khi cập nhật SP' : 'Đã tắt đồng bộ khi cập nhật SP',
      details: {}
    });
  };

  const handleToggleNotify = (checked: boolean) => {
    updateSyncSetting.mutate({ key: 'notifyOnError', value: checked });
    addLog.mutate({
      action: 'save_config',
      status: 'info',
      message: checked ? 'Đã bật thông báo lỗi' : 'Đã tắt thông báo lỗi',
      details: {}
    });
  };

  const getNextSyncTime = () => {
    if (!lastSyncAt || !syncSettings.autoSyncEnabled) return null;
    const lastSync = new Date(lastSyncAt);
    const nextSync = new Date(lastSync.getTime() + syncSettings.intervalMinutes * 60 * 1000);
    return nextSync;
  };

  const nextSync = getNextSyncTime();

  return (
    <div className="space-y-6">
      {/* Schedule Card */}
      <Card>
        <CardHeader>
          <CardTitle size="lg">Lịch đồng bộ tự động</CardTitle>
          <CardDescription>Cài đặt thời gian và tần suất đồng bộ</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Bật Auto Sync</Label>
              <p className="text-sm text-muted-foreground">Tự động đồng bộ dữ liệu theo lịch</p>
            </div>
            <Switch
              checked={syncSettings.autoSyncEnabled}
              onCheckedChange={handleToggleAutoSync}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Tần suất đồng bộ</Label>
            <Select
              value={syncSettings.intervalMinutes.toString()}
              onValueChange={(value) => updateSyncSetting.mutate({ key: 'intervalMinutes', value: parseInt(value, 10) })}
              disabled={!syncSettings.autoSyncEnabled}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SYNC_INTERVAL_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Types Card */}
      <Card>
        <CardHeader>
          <CardTitle size="lg">Loại dữ liệu đồng bộ</CardTitle>
          <CardDescription>Chọn những thông tin cần đồng bộ lên PKGX</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Đồng bộ tồn kho</Label>
              <p className="text-sm text-muted-foreground">Tổng tồn kho tất cả chi nhánh</p>
            </div>
            <Switch
              checked={syncSettings.syncInventory}
              onCheckedChange={handleToggleSyncInventory}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Đồng bộ giá</Label>
              <p className="text-sm text-muted-foreground">Theo mapping bảng giá đã cấu hình</p>
            </div>
            <Switch
              checked={syncSettings.syncPrice}
              onCheckedChange={handleToggleSyncPrice}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Đồng bộ SEO</Label>
              <p className="text-sm text-muted-foreground">meta_title, meta_desc, keywords</p>
            </div>
            <Switch
              checked={syncSettings.syncSeo}
              onCheckedChange={handleToggleSyncSeo}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Sync ngay khi cập nhật sản phẩm</Label>
              <p className="text-sm text-muted-foreground">Đồng bộ real-time khi sửa SP trong HRM</p>
            </div>
            <Switch
              checked={syncSettings.syncOnProductUpdate}
              onCheckedChange={handleToggleSyncOnUpdate}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Card */}
      <Card>
        <CardHeader>
          <CardTitle size="lg">Thông báo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Thông báo khi có lỗi sync</Label>
              <p className="text-sm text-muted-foreground">Nhận thông báo khi đồng bộ thất bại</p>
            </div>
            <Switch
              checked={syncSettings.notifyOnError}
              onCheckedChange={handleToggleNotify}
            />
          </div>
        </CardContent>
      </Card>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle size="lg">Trạng thái đồng bộ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Lần sync cuối</p>
              <p className="font-medium">
                {lastSyncAt ? new Date(lastSyncAt).toLocaleString('vi-VN') : 'Chưa có'}
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Kết quả</p>
              {lastSyncResult ? (
                <div className="flex items-center gap-2">
                  {lastSyncResult.status === 'success' ? (
                    <Badge className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" />Thành công</Badge>
                  ) : (
                    <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Có lỗi</Badge>
                  )}
                  <span className="text-sm">{lastSyncResult.success}/{lastSyncResult.total}</span>
                </div>
              ) : (
                <p className="font-medium">--</p>
              )}
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Lần sync tiếp theo</p>
              <p className="font-medium">
                {nextSync ? nextSync.toLocaleString('vi-VN') : 'Không có'}
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleManualSync} disabled={isSyncing}>
              {isSyncing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              {isSyncing ? 'Đang sync...' : 'Sync ngay'}
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Xem log
            </Button>
            {syncSettings.autoSyncEnabled && (
              <Button variant="outline" onClick={() => handleToggleAutoSync(false)}>
                <Pause className="h-4 w-4 mr-2" />
                Tạm dừng
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
