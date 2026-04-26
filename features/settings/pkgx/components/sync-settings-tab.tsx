import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Switch } from '../../../../components/ui/switch';
import { Label } from '../../../../components/ui/label';
import { Badge } from '../../../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { Play, Pause, FileText, CheckCircle2, AlertCircle, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { usePkgxSettings, usePkgxSyncSettingsMutations } from '../hooks/use-pkgx-settings';
import { SYNC_INTERVAL_OPTIONS } from '../types';

export function SyncSettingsTab() {
  const { data: settings, refetch: refetchSettings } = usePkgxSettings();
  const { updateSyncSetting } = usePkgxSyncSettingsMutations({ onSuccess: () => {} });
  const syncSettings = settings?.syncSettings ?? { autoSyncEnabled: false, intervalMinutes: 60, syncInventory: true, syncPrice: true, syncSeo: true, syncOnProductUpdate: false, notifyOnError: true };
  const lastSyncAt = settings?.lastSyncAt;
  const lastSyncResult = settings?.lastSyncResult;
  const apiKey = settings?.apiKey;
  const apiUrl = settings?.apiUrl;
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [showLogs, setShowLogs] = React.useState(false);

  const { data: syncLogs } = useQuery<{ systemId: string; syncType: string; action: string; status: string; itemsTotal: number; itemsSuccess: number; itemsFailed: number; errorMessage: string | null; details: Record<string, unknown> | null; syncedAt: string; syncedByName: string | null }[]>({
    queryKey: ['pkgx-sync-logs'],
    queryFn: async () => {
      const res = await fetch('/api/settings/pkgx/sync');
      const json = await res.json();
      return json.data ?? [];
    },
    enabled: showLogs,
    staleTime: 30_000,
  });

  const handleManualSync = async () => {
    if (!apiUrl || !apiKey) {
      toast.error('Vui lòng cấu hình API URL và API Key trước!');
      return;
    }

    setIsSyncing(true);
    toast.info('Đang đồng bộ dữ liệu lên PKGX...');
    
    try {
      const res = await fetch('/api/settings/pkgx/sync', {
        method: 'POST',
        credentials: 'include',
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Lỗi không xác định');
      }

      const data = json.data;
      await refetchSettings();

      if (data.failedCount > 0) {
        toast.warning(`Sync hoàn tất: ${data.successCount}/${data.total} SP thành công, ${data.failedCount} lỗi`);
      } else {
        toast.success(data.message || `Đồng bộ thành công ${data.successCount} sản phẩm!`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
      toast.error('Lỗi đồng bộ: ' + errorMessage);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleToggleAutoSync = (checked: boolean) => {
    const msg = checked ? 'Đã bật Auto Sync' : 'Đã tắt Auto Sync';
    updateSyncSetting.mutate({ key: 'autoSyncEnabled', value: checked }, {
      onSuccess: () => toast.success(msg),
    });
  };

  const handleToggleSyncInventory = (checked: boolean) => {
    updateSyncSetting.mutate({ key: 'syncInventory', value: checked });
  };

  const handleToggleSyncPrice = (checked: boolean) => {
    updateSyncSetting.mutate({ key: 'syncPrice', value: checked });
  };

  const handleToggleSyncSeo = (checked: boolean) => {
    updateSyncSetting.mutate({ key: 'syncSeo', value: checked });
  };

  const handleToggleSyncOnUpdate = (checked: boolean) => {
    updateSyncSetting.mutate({ key: 'syncOnProductUpdate', value: checked });
  };

  const handleToggleNotify = (checked: boolean) => {
    updateSyncSetting.mutate({ key: 'notifyOnError', value: checked });
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
                    <Badge className="bg-success/15 text-success-foreground border-success/30"><CheckCircle2 className="h-3 w-3 mr-1" />Thành công</Badge>
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
            <Button variant="outline" onClick={() => setShowLogs(!showLogs)}>
              <FileText className="h-4 w-4 mr-2" />
              Xem log
              {showLogs ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
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

      {/* Sync Log History */}
      {showLogs && (
        <Card>
          <CardHeader>
            <CardTitle size="lg">Lịch sử đồng bộ</CardTitle>
            <CardDescription>20 lần sync gần nhất</CardDescription>
          </CardHeader>
          <CardContent>
            {!syncLogs || syncLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground">Chưa có lịch sử đồng bộ</p>
            ) : (
              <div className="space-y-2">
                {syncLogs.map((log) => (
                  <div key={log.systemId} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/30">
                    <div className="flex items-center gap-3">
                      {log.status === 'success' ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                      )}
                      <div>
                        <p className="text-sm font-medium">
                          {log.itemsSuccess}/{log.itemsTotal} SP thành công
                          {log.itemsFailed > 0 && <span className="text-destructive ml-1">({log.itemsFailed} lỗi)</span>}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {log.syncedByName || 'Hệ thống'} • {new Date(log.syncedAt).toLocaleString('vi-VN')}
                          {log.details && typeof log.details === 'object' && 'duration' in log.details && (
                            <span className="ml-1">• {((log.details.duration as number) / 1000).toFixed(1)}s</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <Badge variant={log.status === 'success' ? 'default' : 'destructive'} className={log.status === 'success' ? 'bg-success/15 text-success-foreground border-success/30' : ''}>
                      {log.status === 'success' ? 'OK' : log.status === 'partial' ? 'Một phần' : 'Lỗi'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
