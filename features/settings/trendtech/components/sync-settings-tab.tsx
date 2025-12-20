import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Switch } from '../../../../components/ui/switch';
import { Label } from '../../../../components/ui/label';
import { Badge } from '../../../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Play, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTrendtechSettingsStore } from '../store';
import { SYNC_INTERVAL_OPTIONS } from '../../../../lib/trendtech/types';

export function SyncSettingsTab() {
  const { settings, updateSyncSetting, setLastSyncAt, setLastSyncResult, addLog } = useTrendtechSettingsStore();
  const { syncSettings, lastSyncAt, lastSyncResult, apiKey, apiUrl } = settings;
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
      // TODO: Implement actual sync logic when API is ready
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const responseTime = Date.now() - startTime;
      const result = { status: 'success' as const, total: 0, success: 0, failed: 0 };
      
      setLastSyncAt(new Date().toISOString());
      setLastSyncResult(result);
      
      addLog({
        action: 'sync_all',
        status: 'success',
        message: 'Đồng bộ hoàn tất (API chưa sẵn sàng)',
        details: {
          total: result.total,
          success: result.success,
          failed: result.failed,
          responseTime,
          url: apiUrl,
          method: 'POST',
        }
      });
      
      toast.success('Đồng bộ hoàn tất! (Đang chờ API Trendtech)');
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
      
      setLastSyncResult({ status: 'error', total: 0, success: 0, failed: 0 });
      
      addLog({
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
          <CardTitle className="text-lg">Lịch đồng bộ tự động</CardTitle>
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
              onCheckedChange={(checked) => {
                updateSyncSetting('autoSyncEnabled', checked);
                addLog({
                  action: 'save_config',
                  status: 'info',
                  message: checked ? 'Đã bật Auto Sync' : 'Đã tắt Auto Sync',
                  details: {}
                });
                toast.success(checked ? 'Đã bật Auto Sync' : 'Đã tắt Auto Sync');
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Tần suất đồng bộ</Label>
            <Select
              value={syncSettings.intervalMinutes.toString()}
              onValueChange={(value) => updateSyncSetting('intervalMinutes', parseInt(value, 10))}
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
          <CardTitle className="text-lg">Loại dữ liệu đồng bộ</CardTitle>
          <CardDescription>Chọn những thông tin cần đồng bộ lên Trendtech</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Đồng bộ tồn kho</Label>
              <p className="text-sm text-muted-foreground">Tổng tồn kho tất cả chi nhánh</p>
            </div>
            <Switch
              checked={syncSettings.syncInventory}
              onCheckedChange={(checked) => {
                updateSyncSetting('syncInventory', checked);
                addLog({
                  action: 'save_config',
                  status: 'info',
                  message: checked ? 'Đã bật đồng bộ tồn kho' : 'Đã tắt đồng bộ tồn kho',
                  details: {}
                });
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Đồng bộ giá</Label>
              <p className="text-sm text-muted-foreground">Theo cấu hình Mapping giá</p>
            </div>
            <Switch
              checked={syncSettings.syncPrice}
              onCheckedChange={(checked) => {
                updateSyncSetting('syncPrice', checked);
                addLog({
                  action: 'save_config',
                  status: 'info',
                  message: checked ? 'Đã bật đồng bộ giá' : 'Đã tắt đồng bộ giá',
                  details: {}
                });
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Đồng bộ SEO</Label>
              <p className="text-sm text-muted-foreground">Meta title, description, keywords</p>
            </div>
            <Switch
              checked={syncSettings.syncSeo}
              onCheckedChange={(checked) => {
                updateSyncSetting('syncSeo', checked);
                addLog({
                  action: 'save_config',
                  status: 'info',
                  message: checked ? 'Đã bật đồng bộ SEO' : 'Đã tắt đồng bộ SEO',
                  details: {}
                });
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Sync khi cập nhật SP</Label>
              <p className="text-sm text-muted-foreground">Tự động sync khi thay đổi SP trong HRM</p>
            </div>
            <Switch
              checked={syncSettings.syncOnProductUpdate}
              onCheckedChange={(checked) => {
                updateSyncSetting('syncOnProductUpdate', checked);
                addLog({
                  action: 'save_config',
                  status: 'info',
                  message: checked ? 'Đã bật sync khi cập nhật SP' : 'Đã tắt sync khi cập nhật SP',
                  details: {}
                });
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Thông báo khi lỗi</Label>
              <p className="text-sm text-muted-foreground">Hiển thị toast khi sync thất bại</p>
            </div>
            <Switch
              checked={syncSettings.notifyOnError}
              onCheckedChange={(checked) => {
                updateSyncSetting('notifyOnError', checked);
                addLog({
                  action: 'save_config',
                  status: 'info',
                  message: checked ? 'Đã bật thông báo lỗi' : 'Đã tắt thông báo lỗi',
                  details: {}
                });
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Trạng thái đồng bộ</CardTitle>
          <CardDescription>Thông tin lần sync gần nhất</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Lần sync cuối:</span>
            <span className="text-sm font-medium">
              {lastSyncAt ? new Date(lastSyncAt).toLocaleString('vi-VN') : 'Chưa có'}
            </span>
          </div>

          {lastSyncResult && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Kết quả:</span>
              <Badge variant={lastSyncResult.status === 'success' ? 'default' : 'destructive'}>
                {lastSyncResult.status === 'success' ? (
                  <><CheckCircle2 className="h-3 w-3 mr-1" />Thành công</>
                ) : (
                  <><AlertCircle className="h-3 w-3 mr-1" />Lỗi</>
                )}
              </Badge>
            </div>
          )}

          {nextSync && syncSettings.autoSyncEnabled && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Lần sync tiếp:</span>
              <span className="text-sm font-medium">{nextSync.toLocaleString('vi-VN')}</span>
            </div>
          )}

          <Button
            onClick={handleManualSync}
            disabled={isSyncing || !settings.enabled}
            className="w-full mt-4"
          >
            {isSyncing ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Đang đồng bộ...</>
            ) : (
              <><Play className="h-4 w-4 mr-2" />Đồng bộ ngay</>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
