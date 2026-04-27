import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Switch } from '../../../../components/ui/switch';
import { Label } from '../../../../components/ui/label';
import { Badge } from '../../../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Play, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTrendtechSettings, useTrendtechSyncSettingsMutations, useTrendtechSyncStatusMutations, useTrendtechLogMutations } from '../hooks/use-trendtech-settings';
import { SYNC_INTERVAL_OPTIONS } from '../../../../lib/trendtech/types';

export function SyncSettingsTab() {
  const { data: settings } = useTrendtechSettings();
  const { updateSyncSetting } = useTrendtechSyncSettingsMutations({ onSuccess: () => {} });
  const { setLastSyncAt, setLastSyncResult } = useTrendtechSyncStatusMutations();
  const { addLog } = useTrendtechLogMutations();
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
      // Implement actual sync logic
      // Sync based on enabled settings: inventory, price, SEO
      let total = 0;
      let success = 0;
      let failed = 0;

      if (syncSettings.syncInventory) {
        try {
          // Sync inventory to Trendtech
          // POST /api/trendtech/sync/stock - placeholder
          const inventoryResponse = await fetch(`${apiUrl}/sync/stock`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
          });

          if (inventoryResponse.ok) {
            const data = await inventoryResponse.json();
            success += data.success || 0;
            failed += data.failed || 0;
            total += data.total || 0;
          }
        } catch {
          failed++;
          total++;
        }
      }

      if (syncSettings.syncPrice) {
        try {
          // Sync prices to Trendtech
          // POST /api/trendtech/sync/price - placeholder
          const priceResponse = await fetch(`${apiUrl}/sync/price`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
          });

          if (priceResponse.ok) {
            const data = await priceResponse.json();
            success += data.success || 0;
            failed += data.failed || 0;
            total += data.total || 0;
          }
        } catch {
          failed++;
          total++;
        }
      }

      if (syncSettings.syncSeo) {
        try {
          // Sync SEO data to Trendtech
          // POST /api/trendtech/sync/seo - placeholder
          const seoResponse = await fetch(`${apiUrl}/sync/seo`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
          });

          if (seoResponse.ok) {
            const data = await seoResponse.json();
            success += data.success || 0;
            failed += data.failed || 0;
            total += data.total || 0;
          }
        } catch {
          failed++;
          total++;
        }
      }

      const responseTime = Date.now() - startTime;
      const result = {
        status: failed === 0 ? 'success' as const : (success > 0 ? 'partial' as const : 'error' as const),
        total,
        success,
        failed,
      };

      setLastSyncAt.mutate(new Date().toISOString());
      setLastSyncResult.mutate(result);

      addLog.mutate({
        action: 'sync_all',
        status: result.status,
        message: `Đồng bộ hoàn tất: ${success}/${total} thành công`,
        details: {
          total: result.total,
          success: result.success,
          failed: result.failed,
          responseTime,
          url: apiUrl,
          method: 'POST',
        }
      });

      toast.success(`Đồng bộ hoàn tất: ${success}/${total} thành công`);
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
              onCheckedChange={(checked) => {
                updateSyncSetting.mutate({ key: 'autoSyncEnabled', value: checked });
                addLog.mutate({
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
                updateSyncSetting.mutate({ key: 'syncInventory', value: checked });
                addLog.mutate({
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
                updateSyncSetting.mutate({ key: 'syncPrice', value: checked });
                addLog.mutate({
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
                updateSyncSetting.mutate({ key: 'syncSeo', value: checked });
                addLog.mutate({
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
                updateSyncSetting.mutate({ key: 'syncOnProductUpdate', value: checked });
                addLog.mutate({
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
                updateSyncSetting.mutate({ key: 'notifyOnError', value: checked });
                addLog.mutate({
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
          <CardTitle size="lg">Trạng thái đồng bộ</CardTitle>
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
            disabled={isSyncing || !settings?.enabled}
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
